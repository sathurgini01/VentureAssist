import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";

import LegalSubmission from "../models/LegalSubmission.js";
import LegalHelpRequest from "../models/LegalHelpRequest.js";

const router = express.Router();

/** GET /api/legal/admin/reviews */
router.get(
  "/admin/reviews",
  protectMarketing,
  allowMarketingRoles("admin"),
  async (req, res, next) => {
    try {
      const submissions = await LegalSubmission.find()
        .populate("taskId", "title category")
        .populate("userId", "name email");

      res.json({ submissions });
    } catch (e) {
      next(e);
    }
  }
);

/** PATCH /api/legal/admin/submissions/:id */
router.patch(
  "/admin/submissions/:id",
  protectMarketing,
  allowMarketingRoles("admin"),
  async (req, res, next) => {
    try {
      const { status, adminFeedback } = req.body;

      const updated = await LegalSubmission.findByIdAndUpdate(
        req.params.id,
        { $set: { status, adminFeedback } },
        { new: true }
      );

      res.json({ submission: updated });
    } catch (e) {
      next(e);
    }
  }
);

/** GET /api/legal/admin/help-requests */
router.get(
  "/admin/help-requests",
  protectMarketing,
  allowMarketingRoles("admin"),
  async (req, res, next) => {
    try {
      const requests = await LegalHelpRequest.find()
        .populate("taskId", "title")
        .populate("userId", "name email");

      res.json({ requests });
    } catch (e) {
      next(e);
    }
  }
);

export default router;