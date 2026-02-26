import express from "express";
import { body } from "express-validator";

import {
  getArticlesMarketing,
  getArticleByIdMarketing,
  createArticleMarketing,
  updateArticleMarketing,
  deleteArticleMarketing,
} from "../controllers/articleControllerMarketing.js";

import { validate } from "../utils/validate.js";

import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";

const router = express.Router();

// Public routes
router.get("/", getArticlesMarketing);
router.get("/:id", getArticleByIdMarketing);

// Admin routes
router.post(
  "/",
  protectMarketing,
  allowMarketingRoles("admin"),
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stage")
      .isIn(["earlyStartup", "growing", "established"])
      .withMessage("Stage must be earlyStartup, growing, or established"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
  ],
  validate,
  createArticleMarketing
);

router.put(
  "/:id",
  protectMarketing,
  allowMarketingRoles("admin"),
  [
    body("title").optional().isString(),
    body("content").optional().isString(),
    body("category").optional().isString(),
    body("stage")
      .optional()
      .isIn(["earlyStartup", "growing", "established"])
      .withMessage("Stage must be earlyStartup, growing, or established"),
    body("tags").optional().isArray().withMessage("Tags must be an array"),
  ],
  validate,
  updateArticleMarketing
);

router.delete(
  "/:id",
  protectMarketing,
  allowMarketingRoles("admin"),
  deleteArticleMarketing
);

export default router;