import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { queryAI, embedDocument } from "../controller/aiController.js";

const router = Router();

router.post("/query", authMiddleware, queryAI);
router.post("/embed", authMiddleware, embedDocument);

export default router;