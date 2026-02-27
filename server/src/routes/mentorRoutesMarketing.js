import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";
import { getMentorsMarketing } from "../controllers/mentorControllerMarketing.js";

const router = express.Router();

router.get(
  "/",
  protectMarketing,
  allowMarketingRoles("user", "mentor", "admin"),
  getMentorsMarketing
);

export default router;