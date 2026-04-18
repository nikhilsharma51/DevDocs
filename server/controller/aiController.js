import { handleQuery, handleEmbedding } from "../services/aiService.js";

export async function queryAI(req, res) {
  try {
    const { question } = req.body;
    if (!question?.trim()) {
      return res.status(400).json({ error: "Question is required ! " });
    }

    const result = await handleQuery(question, req.user.id);
    res.json(result);
  } catch (error) {
    console.error("AI query error ", error);
    res.status(500).json({ error: "AI query failed" });
  }
}

export async function embedDocument(req, res) {
  try {
    const { docId, title, content } = req.body;
    if (!docId) {
      return res.status(400).json({ error: "docId required " });
    }

    await handleEmbedding({ docId, title, content, userId: req.user.id });
    res.json({ ok: "true" });
  } catch (error) {
    console.error("Embed error:", error);
    res.status(500).json({ error: "Embedding failed" });
  }
}
