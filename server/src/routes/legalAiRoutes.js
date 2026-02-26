import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";

const router = express.Router();

router.post("/ai/compliance", protectMarketing, async (req, res) => {
  const { question } = req.body;
  return res.json({
    answer: `Demo response for: ${question}`,
    disclaimer: "General guidance only. Not legal advice."
  });
});

export default router;