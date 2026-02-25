import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

// Load CommonJS auth safely
const { protectMarketing } = require(
  "../middleware/authMiddlewareMarketing.cjs"
);

import {
  getTasks,
  getTaskById,
  getMySubmissions,
  getMySubmissionForTask,
  getMyProgress
} from "../controllers/legalController.js";

const router = express.Router();

router.get("/tasks", protectMarketing, getTasks);
router.get("/tasks/:taskId", protectMarketing, getTaskById);

router.get("/submissions/me", protectMarketing, getMySubmissions);
router.get(
  "/tasks/:taskId/submission/me",
  protectMarketing,
  getMySubmissionForTask
);

router.get("/progress/me", protectMarketing, getMyProgress);

export default router;