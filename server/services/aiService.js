import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js/dist/index.cjs";
import { configDotenv } from "dotenv";
configDotenv();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
);

async function getEmbedding(text) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embeddings.values;
}

export async function handleQuery(query, userId) {
  const quesEmbedding = getEmbedding(query);

  const { data: matched_docs, error } = await supabase.rpc("match_documents", {
    query_embedding: quesEmbedding,
    match_threshold: 0.7,
    match_count: 3,
    user_id: userId,
  });

  if (error) throw error;

  if (!matched_docs || matched_docs.length == 0) {
    return {
      answer: "No relevant documents found ",
      sources: [],
    };
  }

  const context = matched_docs
    .map((d) => `Document : ${d.title}\n\n${d.content}`)
    .join("\n\n---\n\n");

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a helful assistant for an engineering team's documentation system
    Answer the following question using ONLY the documentation provided below.
    If the answer is not in the documentation, say so clearly.
    Be concise and use the exact details from the docs.

    Documentation: ${context}

    Question : ${query}
    `;

  const result = await model.generateContent(prompt);

  return {
    answer: result.response.text(),
    sources: matched_docs.map((d) => ({
      id: d.id,
      title: d.title,
    })),
  };
}
export async function handleEmbedding({ docId, title, content, userId }) {
  const text = `${title}\n\n${content}`;
  const embedding = await embedText(text);

  const { error } = await supabase
    .from("documents")
    .update({ embedding })
    .eq("id", docId)
    .eq("author_id", userId);

  if (error) throw error;
}
