import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { getToolkits } from "../controllers/toolkitController.js";

const router = express.Router();

/**
 * GET /api/legal/toolkits
 * Protected
 */
router.get("/toolkits", protectMarketing, getToolkits);

export default router;