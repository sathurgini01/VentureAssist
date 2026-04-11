import express from "express";
import { body } from "express-validator";

import { validate } from "../utils/validate.js";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";

import {
  applyForMentorMarketing,
  getMentorApplicationsMarketing,
  approveMentorApplicationMarketing,
  rejectMentorApplicationMarketing,
  deleteMentorApplicationMarketing
} from "../controllers/mentorApplicationControllerMarketing.js";

const router = express.Router();

// must be logged in
router.use(protectMarketing, allowMarketingRoles("user", "mentor", "admin"));

// user applies
router.post(
  "/",
  [
    body("expertiseAreas").optional().isArray().withMessage("expertiseAreas must be an array"),
    body("qualification").optional().isString(),
    body("yearsExperience").optional().isInt({ min: 0 }),
    body("bio").optional().isString(),
    body("portfolioLink").optional().isString(),
    body("availability").optional().isString(),
    body("mentorName").optional().isString(),
    body("mentorEmail").optional().isString(),
    body("phoneNumber").optional().isString(),
    body("expertiseSkills").optional().isString(),
    body("shortBio").optional().isString()
  ],
  validate,
  applyForMentorMarketing
);

// admin sees all, user sees own
router.get("/", getMentorApplicationsMarketing);

// admin actions
router.put("/:id/approve", allowMarketingRoles("admin"), approveMentorApplicationMarketing);
router.put("/:id/reject", allowMarketingRoles("admin"), rejectMentorApplicationMarketing);
router.delete("/:id", allowMarketingRoles("admin"), deleteMentorApplicationMarketing);

export default router;
