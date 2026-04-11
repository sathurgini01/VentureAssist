import LegalSubmission from "../models/LegalSubmission.js";
import LegalHelpRequest from "../models/LegalHelpRequest.js";

/**
 * POST /api/legal/tasks/:taskId/submissions
 * Page 04 (Evidence)
 * Body: { fileUrl, note }
 */
export const submitEvidence = async (req, res, next) => {
  try {
    const { fileUrl, note, mentorId, mentorName } = req.body;
    if (!fileUrl) return res.status(400).json({ message: "fileUrl is required" });

    let submission = await LegalSubmission.findOne({
      userId: req.user._id,
      taskId: req.params.taskId,
    });

    if (!submission) {
      submission = new LegalSubmission({
        userId: req.user._id,
        taskId: req.params.taskId,
        mentorId: mentorId || null,
      });
    }

    const nextRound = (submission.submissionHistory?.length || 0) + 1;

    submission.status = "UNDER_REVIEW";
    if (mentorId) submission.mentorId = mentorId;

    submission.evidence.push({ fileUrl, note, mentorName: mentorName || "" });
    submission.submissionHistory.push({
      round: nextRound,
      fileUrl,
      note: note || "",
      mentorName: mentorName || "",
      mentorId: mentorId || null,
      submittedAt: new Date(),
      status: "UNDER_REVIEW",
      mentorFeedback: "",
      adminFeedback: "",
      reviewedAt: null,
    });

    await submission.save();

    res.status(201).json({ submission });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/legal/help-requests
 * Page 05 (Ask Mentor)
 * Body: { taskId, message }
 */
export const createHelpRequest = async (req, res, next) => {
  try {
    const { taskId, message, mentorId, mentorName } = req.body;
    if (!message) {
      return res.status(400).json({ message: "message is required" });
    }

    const request = await LegalHelpRequest.create({
      userId: req.user._id,
      taskId: taskId || null,
      mentorId: mentorId || null,
      mentorName: mentorName || "",
      message
    });

    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
};