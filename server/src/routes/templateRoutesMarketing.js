import express from "express";
import { body } from "express-validator";

import { validate } from "../utils/validate.js";
import {
  getTemplatesMarketing,
  getTemplateByIdMarketing,
  createTemplateMarketing,
  updateTemplateMarketing,
  deleteTemplateMarketing
} from "../controllers/templateControllerMarketing.js";

import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";

const router = express.Router();

/// Protected (any logged-in user)
router.get(
  "/",
  protectMarketing,
  allowMarketingRoles("user", "mentor", "admin"),
  getTemplatesMarketing
);

router.get(
  "/:id",
  protectMarketing,
  allowMarketingRoles("user", "mentor", "admin"),
  getTemplateByIdMarketing
);
// Admin create
router.post(
  "/",
  protectMarketing,
  allowMarketingRoles("admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stage")
      .isIn(["earlyStartup", "growing", "established"])
      .withMessage("Stage must be earlyStartup, growing, or established"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
    body("estimatedBudgetLKR").optional().isNumeric().withMessage("Budget must be a number"),
    body("estimatedDurationDays")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Duration must be >= 1"),
    body("steps").optional().isArray().withMessage("Steps must be an array"),
    body("steps.*.title").optional().isString().withMessage("Step title must be a string"),
    body("steps.*.description").optional().isString(),
    body("steps.*.order").optional().isInt()
  ],
  validate,
  createTemplateMarketing
);

// Admin update
router.put(
  "/:id",
  protectMarketing,
  allowMarketingRoles("admin"),
  [
    body("stage")
      .optional()
      .isIn(["earlyStartup", "growing", "established"])
      .withMessage("Stage must be earlyStartup, growing, or established"),
    body("tags").optional().isArray(),
    body("steps").optional().isArray(),
    body("estimatedBudgetLKR").optional().isNumeric(),
    body("estimatedDurationDays").optional().isInt({ min: 1 })
  ],
  validate,
  updateTemplateMarketing
);

// Admin delete
router.delete("/:id", protectMarketing, allowMarketingRoles("admin"), deleteTemplateMarketing);

export default router;