import LegalSubmission from "../models/LegalSubmission.js";
import LegalHelpRequest from "../models/LegalHelpRequest.js";

/**
 * POST /api/legal/tasks/:taskId/submissions
 * Page 04 (Evidence)
 * Body: { fileUrl, note }
 */
export const submitEvidence = async (req, res, next) => {
  try {
    const { fileUrl, note } = req.body;
    if (!fileUrl) return res.status(400).json({ message: "fileUrl is required" });

    const submission = await LegalSubmission.findOneAndUpdate(
      { userId: req.user._id, taskId: req.params.taskId },
      {
        $set: { status: "UNDER_REVIEW" },
        $push: { evidence: { fileUrl, note } }
      },
      { upsert: true, returnDocument: "after" }
    );

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
    const { taskId, message } = req.body;
    if (!taskId || !message) {
      return res.status(400).json({ message: "taskId and message are required" });
    }

    const request = await LegalHelpRequest.create({
      userId: req.user._id,
      taskId,
      message
    });

    res.status(201).json({ request });
  } catch (err) {
    next(err);
  }
};