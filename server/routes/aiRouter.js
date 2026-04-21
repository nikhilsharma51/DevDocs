import { Router } from "express";
import { handleEmbedding, handleQuery } from "../services/aiService.js";

export const aiRouter = Router();

// aiRouter.post("/query", async (req, res) => {
//   const { question } = req.body;
//   if (!question?.trim()) {
//     return res.status(400).json({ error: "Question is required" });
//   }

//   try {
//     const result = await handleQuery(question, req.user.id);
//     res.json(result);
//   } catch (err) {
//     console.error("AI query error:", err);
//     res.status(500).json({
//       error: err?.message || "AI query failed",
//     });
//   }
// });

aiRouter.post("/embed", async (req, res) => {
  const { docId, title, content } = req.body;
  if (!docId) return res.status(400).json({ error: "docId required" });

  try {
    await handleEmbedding({
      docId,
      title: title ?? "",
      content: content ?? "",
      userId: req.user.id,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("Embed error:", err);
    res.status(500).json({
      error: err?.message || "Embedding failed",
    });
  }
});
