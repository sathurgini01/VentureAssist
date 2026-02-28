import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";

import {
  getToolkits,
  getToolkitById,
  createToolkit,
  updateToolkit,
  deleteToolkit,
} from "../controllers/toolkitController.js";

const router = express.Router();

/**
 * USER ACCESS
 */

// Get all active toolkits
router.get("/toolkits", protectMarketing, getToolkits);

// Get single toolkit
router.get("/toolkits/:id", protectMarketing, getToolkitById);

/**
 * ADMIN CRUD
 */

// Create
router.post(
  "/toolkits",
  protectMarketing,
  allowMarketingRoles("admin"),
  createToolkit
);

// Update
router.put(
  "/toolkits/:id",
  protectMarketing,
  allowMarketingRoles("admin"),
  updateToolkit
);

// Delete
router.delete(
  "/toolkits/:id",
  protectMarketing,
  allowMarketingRoles("admin"),
  deleteToolkit
);

export default router;