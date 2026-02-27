import LegalTask from "../models/LegalTask.js";
import LegalSubmission from "../models/LegalSubmission.js";

/**
 * GET /api/legal/tasks?category=...&summary=true
 * Used by: Page 01 (summary) + Page 02 (dashboard list)
 */
export const getTasks = async (req, res, next) => {
  try {
    const { category, summary } = req.query;

    const filter = { active: true };
    if (category) filter.category = category;

    const selectFields =
      summary === "true" ? "title category order active" : "";

    const tasks = await LegalTask.find(filter)
      .select(selectFields)
      .sort({ order: 1 });

    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/legal/tasks/:taskId
 * Used by: Page 03 (task detail)
 */
export const getTaskById = async (req, res, next) => {
  try {
    const task = await LegalTask.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ task });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/legal/submissions/me
 * Used by: Page 02 (overlay status per task)
 */
export const getMySubmissions = async (req, res, next) => {
  try {
    const submissions = await LegalSubmission.find({ userId: req.user._id })
      .select("taskId status updatedAt");

    res.json({ submissions });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/legal/tasks/:taskId/submission/me
 * Used by: Page 03 (single task status)
 */
export const getMySubmissionForTask = async (req, res, next) => {
  try {
    let submission = await LegalSubmission.findOne({
      userId: req.user._id,
      taskId: req.params.taskId
    }).sort({ updatedAt: -1, createdAt: -1 });

    // Fallback: if client accidentally sends submissionId in :taskId slot,
    // still return the user's submission instead of showing stale PENDING.
    if (!submission && /^[a-fA-F0-9]{24}$/.test(req.params.taskId)) {
      submission = await LegalSubmission.findOne({
        _id: req.params.taskId,
        userId: req.user._id
      });
    }

    // Final fallback: return the user's latest submission instead of default PENDING
    // (helps when client sends wrong taskId but expects latest approved status check).
    if (!submission) {
      submission = await LegalSubmission.findOne({
        userId: req.user._id
      }).sort({ updatedAt: -1, createdAt: -1 });
    }

    if (!submission) return res.json({ submission: { status: "PENDING" } });

    res.json({ submission });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/legal/progress/me
 * Used by: Page 01 + Page 06
 */
export const getMyProgress = async (req, res, next) => {
  try {
    const totalTasks = await LegalTask.countDocuments({ active: true });

    const my = await LegalSubmission.find({ userId: req.user._id }).select("status");

    const counts = {
      pending: 0,
      underReview: 0,
      approved: 0,
      changesRequested: 0
    };

    for (const s of my) {
      if (s.status === "PENDING") counts.pending++;
      else if (s.status === "UNDER_REVIEW") counts.underReview++;
      else if (s.status === "APPROVED") counts.approved++;
      else if (s.status === "CHANGES_REQUESTED") counts.changesRequested++;
    }

    const readiness = totalTasks === 0 ? 0 : Math.round((counts.approved / totalTasks) * 100);

    res.json({
      totalTasks,
      ...counts,
      readiness
    });
  } catch (err) {
    next(err);
  }
};