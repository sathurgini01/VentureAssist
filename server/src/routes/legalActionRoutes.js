import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";

import {
  submitEvidence,
  createHelpRequest
} from "../controllers/legalActionController.js";

const router = express.Router();

router.post("/tasks/:taskId/submissions", protectMarketing, submitEvidence);
router.post("/help-requests", protectMarketing, createHelpRequest);
// Backward-compatible alias for clients calling /api/legal/tasks/help-requests
router.post("/tasks/help-requests", protectMarketing, createHelpRequest);

export default router;