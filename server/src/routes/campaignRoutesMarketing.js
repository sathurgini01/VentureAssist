import express from "express";
import { body } from "express-validator";

import { validate } from "../utils/validate.js";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";
import { campaignOwnerOrAdmin } from "../middleware/campaignAccessMarketing.js";

import {
  createCampaignMarketing,
  getMyCampaignsMarketing,
  getCampaignByIdMarketing,
  updateCampaignMarketing,
  deleteCampaignMarketing
} from "../controllers/campaignControllerMarketing.js";

const router = express.Router();

// All campaign routes require login
router.use(protectMarketing, allowMarketingRoles("user", "mentor", "admin"));

// Create campaign
router.post(
  "/",
  [
    body("templateId").optional().isString().withMessage("templateId must be a string"),
    body("title").optional().isString().withMessage("title must be a string")
  ],
  validate,
  createCampaignMarketing
);

// Get my campaigns
router.get("/", getMyCampaignsMarketing);

// Owner/admin routes
router.get("/:id", campaignOwnerOrAdmin, getCampaignByIdMarketing);

router.put(
  "/:id",
  campaignOwnerOrAdmin,
  [
    body("title").optional().isString(),
    body("status")
      .optional()
      .isIn(["planned", "running", "paused", "completed"])
      .withMessage("Invalid status"),
    body("progress").optional().isNumeric().withMessage("progress must be number"),
    body("metrics").optional().isObject().withMessage("metrics must be an object"),
    body("tasks").optional().isArray().withMessage("tasks must be an array")
  ],
  validate,
  updateCampaignMarketing
);

router.delete("/:id", campaignOwnerOrAdmin, deleteCampaignMarketing);

export default router;