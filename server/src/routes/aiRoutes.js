import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";
import { analyzeCampaignMarketing } from "../controllers/aiController.js";

const router = express.Router();

router.post(
  "/marketing-campaigns/:id/analyze",
  protectMarketing,
  allowMarketingRoles("user", "mentor", "admin"),
  analyzeCampaignMarketing
);

export default router;