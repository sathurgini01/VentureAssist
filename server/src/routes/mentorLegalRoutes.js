import express from "express";
import { protectMarketing } from "../middleware/authMiddlewareMarketing.js";
import { allowMarketingRoles } from "../middleware/roleMiddlewareMarketing.js";

import Mentor from "../models/mentorModel.js";
import User from "../models/User.js";
import MentorApplicationMarketing from "../models/MentorApplicationMarketing.js";
import LegalSubmission from "../models/LegalSubmission.js";
import LegalHelpRequest from "../models/LegalHelpRequest.js";

const router = express.Router();

const normalizeMarketingMentor = (mentor, application) => {
  const expertiseArea = Array.isArray(mentor?.mentorExpertiseAreas) && mentor.mentorExpertiseAreas.length > 0
    ? mentor.mentorExpertiseAreas.join(', ')
    : Array.isArray(application?.expertiseAreas)
      ? application.expertiseAreas.join(', ')
      : 'Legal mentor';

  return {
    _id: mentor._id,
    name: mentor.name,
    email: mentor.email,
    bio: application?.bio || mentor.bio || '',
    expertise: expertiseArea,
    imageUrl: mentor.imageUrl || '',
    availability: application?.availability || '',
    qualification: application?.qualification || '',
    yearsExperience: Number(application?.yearsExperience || 0),
    portfolioLink: application?.portfolioLink || '',
    createdAt: mentor.createdAt,
    updatedAt: mentor.updatedAt,
  };
};

const normalizeLegalMentor = (mentor) => ({
  _id: mentor._id,
  name: mentor.name,
  email: mentor.email || '',
  bio: mentor.bio || '',
  expertise: mentor.expertise || 'Legal mentor',
  imageUrl: mentor.imageUrl || '',
  availability: mentor.availability || '',
  qualification: mentor.qualification || '',
  yearsExperience: Number(mentor.yearsExperience || 0),
  portfolioLink: mentor.portfolioLink || '',
  createdAt: mentor.createdAt,
  updatedAt: mentor.updatedAt,
});

const getMentorsFromMarketingUsers = async () => {
  const mentorUsers = await User.find({ role: "mentor" }).select("name email role createdAt updatedAt mentorExpertiseAreas bio imageUrl");
  const mentorUserIds = mentorUsers.map((mentor) => mentor._id);

  const approvedApplications = await MentorApplicationMarketing.find({
    userId: { $in: mentorUserIds },
    status: "approved"
  })
    .select("userId expertiseAreas qualification yearsExperience bio portfolioLink availability updatedAt createdAt")
    .sort({ updatedAt: -1, createdAt: -1 });

  const latestApplicationByUser = new Map();
  approvedApplications.forEach((application) => {
    const key = String(application.userId);
    if (!latestApplicationByUser.has(key)) {
      latestApplicationByUser.set(key, application);
    }
  });

  return mentorUsers.map((mentor) => normalizeMarketingMentor(mentor, latestApplicationByUser.get(String(mentor._id))));
};

/** GET /api/legal/mentors */
router.get("/mentors", protectMarketing, async (req, res, next) => {
  try {
    const [legalMentors, fallbackMentors] = await Promise.all([
      Mentor.find().sort({ createdAt: -1 }),
      getMentorsFromMarketingUsers(),
    ]);

    const normalizedLegalMentors = legalMentors.map((mentor) => normalizeLegalMentor(mentor));
    const merged = [...normalizedLegalMentors, ...fallbackMentors];

    const seenEmails = new Set();
    const uniqueMentors = merged.filter((mentor) => {
      const key = (mentor.email || String(mentor._id)).toLowerCase().trim();
      if (seenEmails.has(key)) return false;
      seenEmails.add(key);
      return true;
    });

    res.json({ mentors: uniqueMentors });
  } catch (e) { next(e); }
});

/** GET /api/legal/mentors/:id */
router.get("/mentors/:id", protectMarketing, async (req, res, next) => {
  try {
    let mentor = await Mentor.findById(req.params.id);
    if (mentor) {
      return res.json({ mentor: normalizeLegalMentor(mentor) });
    }

    const mentorUser = await User.findById(req.params.id).select("name email createdAt updatedAt mentorExpertiseAreas bio imageUrl");
    if (!mentorUser) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const application = await MentorApplicationMarketing.findOne({ userId: mentorUser._id, status: "approved" })
      .select("expertiseAreas qualification yearsExperience bio portfolioLink availability updatedAt createdAt")
      .sort({ updatedAt: -1, createdAt: -1 });

    mentor = normalizeMarketingMentor(mentorUser, application);
    res.json({ mentor });
  } catch (e) { next(e); }
});

/** GET /api/legal/help-requests/me */
router.get("/help-requests/me", protectMarketing, async (req, res, next) => {
  try {
    const filter = { userId: req.user._id };
    if (req.query.mentorId) {
      filter.mentorId = req.query.mentorId;
    }

    const requests = await LegalHelpRequest.find(filter)
      .populate("taskId", "title category description")
      .populate("mentorId", "name expertise bio imageUrl")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (e) { next(e); }
});

/** GET /api/legal/mentor/reviews */
router.get("/mentor/reviews", protectMarketing, allowMarketingRoles("mentor", "admin"), async (req, res, next) => {
  try {
    const filter = { status: "UNDER_REVIEW" };
    if (req.user.role === "mentor") {
      const mentorDoc = await Mentor.findOne({ email: req.user.email });
      const mentorDocId = mentorDoc?._id || null;
      filter.$or = [
        { mentorId: req.user._id },
        { mentorId: null },
        ...(mentorDocId ? [{ mentorId: mentorDocId }] : []),
      ];
    }

    const submissions = await LegalSubmission.find(filter)
      .populate("taskId", "title category")
      .populate("userId", "name email")
      .populate("mentorId", "name email expertise bio imageUrl");

    res.json({ submissions });
  } catch (e) { next(e); }
});

/** PATCH /api/legal/mentor/submissions/:id */
router.patch("/mentor/submissions/:id", protectMarketing, allowMarketingRoles("mentor", "admin"), async (req, res, next) => {
  try {
    const { status, mentorFeedback } = req.body;
    const updated = await LegalSubmission.findById(req.params.id);

    if (!updated) {
      return res.status(404).json({ message: "Submission not found" });
    }

    if (status) updated.status = status;
    if (mentorFeedback !== undefined) updated.mentorFeedback = mentorFeedback;

    if (Array.isArray(updated.submissionHistory) && updated.submissionHistory.length > 0) {
      const lastUnderReviewIndex = [...updated.submissionHistory]
        .map((item, index) => ({ item, index }))
        .reverse()
        .find(({ item }) => item.status === "UNDER_REVIEW")?.index;

      const targetIndex =
        lastUnderReviewIndex !== undefined
          ? lastUnderReviewIndex
          : updated.submissionHistory.length - 1;

      const historyEntry = updated.submissionHistory[targetIndex];
      if (historyEntry) {
        if (status) historyEntry.status = status;
        if (mentorFeedback !== undefined) historyEntry.mentorFeedback = mentorFeedback;
        historyEntry.reviewedAt = new Date();
      }
    }

    await updated.save();

    res.json({ submission: updated });
  } catch (e) { next(e); }
});

/** GET /api/legal/mentor/submissions/user/:userId */
router.get("/mentor/submissions/user/:userId", protectMarketing, allowMarketingRoles("mentor", "admin"), async (req, res, next) => {
  try {
    const submissions = await LegalSubmission.find({ userId: req.params.userId })
      .populate("taskId", "title category")
      .populate("mentorId", "name email")
      .sort({ updatedAt: -1, createdAt: -1 });

    const history = submissions
      .flatMap((submission) => {
        const base = {
          submissionId: submission._id,
          taskId: submission.taskId,
          mentorId: submission.mentorId,
          userId: submission.userId,
        };

        if (Array.isArray(submission.submissionHistory) && submission.submissionHistory.length > 0) {
          return submission.submissionHistory.map((entry, index) => ({
            ...base,
            key: `${String(submission._id)}-${entry.round || index + 1}`,
            round: entry.round || index + 1,
            fileUrl: entry.fileUrl,
            note: entry.note || "",
            status: entry.status || "UNDER_REVIEW",
            mentorFeedback: entry.mentorFeedback || "",
            adminFeedback: entry.adminFeedback || "",
            submittedAt: entry.submittedAt,
            reviewedAt: entry.reviewedAt,
            updatedAt: entry.reviewedAt || entry.submittedAt || submission.updatedAt,
          }));
        }

        return (submission.evidence || []).map((evidenceItem, index) => ({
          ...base,
          key: `${String(submission._id)}-legacy-${index + 1}`,
          round: index + 1,
          fileUrl: evidenceItem.fileUrl,
          note: evidenceItem.note || "",
          status: submission.status,
          mentorFeedback: submission.mentorFeedback || "",
          adminFeedback: submission.adminFeedback || "",
          submittedAt: evidenceItem.uploadedAt || submission.createdAt,
          reviewedAt: submission.updatedAt,
          updatedAt: submission.updatedAt,
        }));
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json({ submissions: history });
  } catch (e) { next(e); }
});

/** GET /api/legal/mentor/submissions/history */
router.get("/mentor/submissions/history", protectMarketing, allowMarketingRoles("mentor", "admin"), async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === "mentor") {
      const mentorDoc = await Mentor.findOne({ email: req.user.email });
      const mentorDocId = mentorDoc?._id || null;
      const ids = [req.user._id, ...(mentorDocId ? [mentorDocId] : [])];
      filter.mentorId = { $in: ids };
    }

    const submissions = await LegalSubmission.find(filter)
      .populate("taskId", "title category")
      .populate("userId", "name email")
      .populate("mentorId", "name email")
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(50);

    const history = submissions
      .flatMap((submission) => {
        const base = {
          submissionId: submission._id,
          taskId: submission.taskId,
          userId: submission.userId,
          mentorId: submission.mentorId,
        };

        if (Array.isArray(submission.submissionHistory) && submission.submissionHistory.length > 0) {
          return submission.submissionHistory.map((entry, index) => ({
            ...base,
            key: `${String(submission._id)}-${entry.round || index + 1}`,
            round: entry.round || index + 1,
            fileUrl: entry.fileUrl,
            note: entry.note || "",
            status: entry.status || "UNDER_REVIEW",
            mentorFeedback: entry.mentorFeedback || "",
            adminFeedback: entry.adminFeedback || "",
            submittedAt: entry.submittedAt,
            reviewedAt: entry.reviewedAt,
            updatedAt: entry.reviewedAt || entry.submittedAt || submission.updatedAt,
          }));
        }

        return (submission.evidence || []).map((evidenceItem, index) => ({
          ...base,
          key: `${String(submission._id)}-legacy-${index + 1}`,
          round: index + 1,
          fileUrl: evidenceItem.fileUrl,
          note: evidenceItem.note || "",
          status: submission.status,
          mentorFeedback: submission.mentorFeedback || "",
          adminFeedback: submission.adminFeedback || "",
          submittedAt: evidenceItem.uploadedAt || submission.createdAt,
          reviewedAt: submission.updatedAt,
          updatedAt: submission.updatedAt,
        }));
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    res.json({ submissions: history });
  } catch (e) { next(e); }
});

/** GET /api/legal/mentor/help-requests */
router.get("/mentor/help-requests", protectMarketing, allowMarketingRoles("mentor", "admin"), async (req, res, next) => {
  try {
    let filter = {};
    if (req.user.role !== "admin") {
      const mentorDoc = await Mentor.findOne({ email: req.user.email });
      const mentorDocId = mentorDoc?._id || null;
      const ids = [req.user._id, ...(mentorDocId ? [mentorDocId] : [])];
      filter = { mentorId: { $in: ids } };
    }

    const requests = await LegalHelpRequest.find(filter)
      .populate("taskId", "title category description")
      .populate("userId", "name email")
      .populate("mentorId", "name email expertise")
      .sort({ createdAt: -1 });

    res.json({ requests });
  } catch (e) { next(e); }
});

/** PATCH /api/legal/mentor/help-requests/:id */
router.patch("/mentor/help-requests/:id", protectMarketing, allowMarketingRoles("mentor", "admin"), async (req, res, next) => {
  try {
    const { mentorReply, status } = req.body;
    const update = {};
    if (mentorReply !== undefined) {
      update.mentorReply = mentorReply;
      update.mentorName = req.user?.name || "";
      update.mentorId = req.user?._id;
    }
    if (status) update.status = status;

    const updated = await LegalHelpRequest.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { returnDocument: "after" }
    )
      .populate("taskId", "title category description")
      .populate("userId", "name email")
      .populate("mentorId", "name expertise");

    if (!updated) {
      return res.status(404).json({ message: "Help request not found" });
    }

    res.json({ request: updated });
  } catch (e) { next(e); }
});

export default router;