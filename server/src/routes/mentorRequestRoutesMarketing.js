import express from "express";
import { body } from "express-validator";

import { validate } from "../utils/validate.js";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";

import {
  createMentorRequestMarketing,
  getMentorRequestsMarketing,
  respondMentorRequestMarketing
} from "../controllers/mentorRequestControllerMarketing.js";

const router = express.Router();

// All mentor-request routes require login
router.use(protectMarketing);

// ✅ Only USER can create mentor request
router.post(
  "/",
  allowMarketingRoles("user"),
  [
    body("mentorId").notEmpty().withMessage("mentorId required"),
    body("topic").notEmpty().withMessage("topic required"),
    body("message").notEmpty().withMessage("message required"),
    body("domain").optional().isIn(["businessIdea", "marketingDevelopment", "law"]),
    body("preferredDateTime").optional().isISO8601()
  ],
  validate,
  createMentorRequestMarketing
);

// ✅ All roles can view (filtered inside controller)
router.get(
  "/",
  allowMarketingRoles("user", "mentor", "admin"),
  getMentorRequestsMarketing
);

// ✅ Only mentor (assigned) or admin can respond
router.put(
  "/:id/respond",
  allowMarketingRoles("mentor", "admin"),
  [
    body("status").optional().isIn(["pending", "accepted", "rejected", "completed"]),
    body("scheduledDateTime").optional().isISO8601(),
    body("meetingUrl").optional().isString(),
    body("reply").optional().isString()
  ],
  validate,
  respondMentorRequestMarketing
);

export default router;