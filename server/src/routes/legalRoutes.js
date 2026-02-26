import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";

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