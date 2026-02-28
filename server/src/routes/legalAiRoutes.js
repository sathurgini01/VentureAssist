import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { askGeminiCompliance } from "../controllers/legalAiController.js";

const router = express.Router();

/**
 * POST /api/legal/ai/compliance
 * Protected route
 * Body: { question }
 */
router.post("/ai/compliance", protectMarketing, askGeminiCompliance);

export default router;