import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";

import LegalSubmission from "../models/LegalSubmission.js";
import LegalHelpRequest from "../models/LegalHelpRequest.js";

const router = express.Router();

/** GET /api/legal/mentor/reviews */
router.get("/mentor/reviews", protectMarketing, allowMarketingRoles("mentor", "admin"), async (req, res, next) => {
  try {
    const submissions = await LegalSubmission.find({ status: "UNDER_REVIEW" })
      .populate("taskId", "title category")
      .populate("userId", "name email");

    res.json({ submissions });
  } catch (e) { next(e); }
});

/** PATCH /api/legal/mentor/submissions/:id */
router.patch("/mentor/submissions/:id", protectMarketing, allowMarketingRoles("mentor", "admin"), async (req, res, next) => {
  try {
    const { status, mentorFeedback } = req.body;
    const updated = await LegalSubmission.findByIdAndUpdate(
      req.params.id,
      { $set: { status, mentorFeedback } },
      { new: true }
    );

    res.json({ submission: updated });
  } catch (e) { next(e); }
});

/** GET /api/legal/mentor/help-requests */
router.get("/mentor/help-requests", protectMarketing, allowMarketingRoles("mentor", "admin"), async (req, res, next) => {
  try {
    const requests = await LegalHelpRequest.find({ status: "OPEN" })
      .populate("taskId", "title")
      .populate("userId", "name email");

    res.json({ requests });
  } catch (e) { next(e); }
});

export default router;