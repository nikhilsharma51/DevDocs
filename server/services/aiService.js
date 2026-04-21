import { GoogleGenerativeAI } from "@google/generative-ai";
import { HfInference } from "@huggingface/inference";
import { createClient } from "@supabase/supabase-js";
import { configDotenv } from "dotenv";

configDotenv();

/** Same model for query + document embeddings; 768-dim to match pgvector / Supabase column. */
const HF_EMBED_MODEL =
  process.env.HF_EMBEDDING_MODEL ||
  "sentence-transformers/all-mpnet-base-v2";

/** Tried in order until one accepts generateContent (handles regional / tier model differences). */
function chatModelsToTry() {
  const fromEnv = process.env.GEMINI_CHAT_MODEL?.trim();
  const defaults = [
    "gemini-2.0-flash-001",
    "gemini-2.0-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-flash-latest",
  ];
  const list = fromEnv ? [fromEnv, ...defaults] : defaults;
  return [...new Set(list)];
}

const hf = process.env.HF_TOKEN
  ? new HfInference(process.env.HF_TOKEN)
  : null;

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

/**
 * HF feature extraction may return number[], number[][], or nested tensors.
 * Flatten to a single float[] and verify dimension (768 for all-mpnet-base-v2).
 */
function normalizeEmbedding(raw, expectedDim = 768) {
  let v = raw;
  while (Array.isArray(v) && v.length && typeof v[0] !== "number") {
    v = v[0];
  }
  if (!Array.isArray(v) || v.some((x) => typeof x !== "number")) {
    throw new Error("Invalid embedding shape from embedding provider");
  }
  if (v.length !== expectedDim) {
    throw new Error(
      `Embedding dimension is ${v.length} but Supabase vectors expect ${expectedDim}. Set HF_EMBEDDING_MODEL to a ${expectedDim}-dim model or alter the DB.`,
    );
  }
  return v;
}

/**
 * Gemini SDK throws from response.text() when a candidate is blocked (safety, etc.).
 * Still return a usable string when possible so the client gets 200 + sources.
 */
function extractGeminiAnswerText(result) {
  const response = result.response;
  try {
    const t = response.text();
    return (t && String(t).trim()) || "";
  } catch (e) {
    console.warn("Gemini response.text() failed:", e?.message || e);
    const parts = response.candidates?.[0]?.content?.parts;
    const joined = Array.isArray(parts)
      ? parts.map((p) => p.text).filter(Boolean).join("\n").trim()
      : "";
    if (joined) return joined;
    return (
      "I found relevant documents but could not produce a full reply " +
      `(model blocked or empty response: ${e?.message || "unknown"}). ` +
      "Try rephrasing, or read the linked sources below."
    );
  }
}

function isGeminiModelAvailabilityError(err) {
  const msg = `${err?.message || err?.statusText || ""} ${err?.errorDetails || ""}`;
  return /404|not found|NOT_FOUND|unsupported|invalid model|UNKNOWN_MODEL|is not found for API version/i.test(
    msg,
  );
}

async function generateAnswerWithGemini(prompt) {
  let lastErr;
  for (const modelId of chatModelsToTry()) {
    try {
      const model = genAI.getGenerativeModel({ model: modelId });
      const result = await model.generateContent(prompt);
      const text = extractGeminiAnswerText(result);
      return { text, modelId };
    } catch (e) {
      lastErr = e;
      if (isGeminiModelAvailabilityError(e)) {
        console.warn(`Gemini chat model "${modelId}" unavailable, trying next:`, e?.message);
        continue;
      }
      throw e;
    }
  }
  throw lastErr || new Error("No Gemini chat model succeeded");
}

async function getEmbedding(text) {
  if (!hf) {
    throw new Error(
      "HF_TOKEN is missing. Add a Hugging Face access token for embedding API (free tier: huggingface.co/settings/tokens).",
    );
  }
  try {
    const embedding = await hf.featureExtraction({
      model: HF_EMBED_MODEL,
      inputs: `Represent this sentence for retrieval: ${text}`,
    });
    return normalizeEmbedding(embedding);
  } catch (err) {
    console.error("HF Embedding error:", err);
    throw err;
  }
}

export async function handleQuery(query, userId) {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is missing (required for chat responses).");
  }

  const quesEmbedding = await getEmbedding(query);

  const matchThreshold = Number(process.env.MATCH_THRESHOLD);
  const threshold = Number.isFinite(matchThreshold) ? matchThreshold : 0.45;

  const { data: matched_docs, error } = await supabase.rpc("match_documents", {
    query_embedding: quesEmbedding,
    match_threshold: threshold,
    match_count: 3,
    user_id: userId,
  });

  if (error) {
    console.error("Supabase match_documents error:", error);
    const hint =
      /dimension|vector|expected/i.test(error.message || "")
        ? " Your `match_documents` SQL must use the same vector size as embeddings (768 for all-mpnet-base-v2)."
        : "";
    throw new Error((error.message || "Vector search failed") + hint);
  }

  if (!matched_docs || matched_docs.length === 0) {
    return {
      answer:
        "I couldn't find any relevant documentation to answer that. Try adding or updating docs, or ask something else.",
      sources: [],
    };
  }

  const context = matched_docs
    .map((d) => `Document : ${d.title}\n\n${d.content}`)
    .join("\n\n---\n\n");

  const prompt = `You are a helpful assistant for an engineering team's documentation system
    Answer the following question using ONLY the documentation provided below.
    If the answer is not in the documentation, say so clearly.
    Be concise and use the exact details from the docs.

    Documentation: ${context}

    Question : ${query}
    `;

  const { text: answer } = await generateAnswerWithGemini(prompt);

  return {
    answer,
    sources: matched_docs.map((d) => ({
      id: d.id,
      title: d.title,
    })),
  };
}

export async function handleEmbedding({ docId, title, content, userId }) {
  const text = `${title}\n\n${content}`;
  const embedding = await getEmbedding(text);

  const { error } = await supabase
    .from("documents")
    .update({ embedding })
    .eq("id", docId)
    .eq("author_id", userId);

  if (error) throw error;
}
