import express from "express";
import { body } from "express-validator";

import { validate } from "../utils/validate.js";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";

import {
  applyForMentorMarketing,
  getMentorApplicationsMarketing,
  approveMentorApplicationMarketing,
  rejectMentorApplicationMarketing
} from "../controllers/mentorApplicationControllerMarketing.js";

const router = express.Router();

// must be logged in
router.use(protectMarketing, allowMarketingRoles("user", "mentor", "admin"));

// user applies
router.post(
  "/",
  [
    body("expertiseAreas").optional().isArray().withMessage("expertiseAreas must be an array"),
    body("bio").optional().isString(),
    body("portfolioLink").optional().isString(),
    body("availability").optional().isString()
  ],
  validate,
  applyForMentorMarketing
);

// admin sees all, user sees own
router.get("/", getMentorApplicationsMarketing);

// admin actions
router.put("/:id/approve", allowMarketingRoles("admin"), approveMentorApplicationMarketing);
router.put("/:id/reject", allowMarketingRoles("admin"), rejectMentorApplicationMarketing);

export default router;