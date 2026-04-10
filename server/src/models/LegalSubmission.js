import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    note: { type: String, default: "" },
    mentorName: { type: String, default: "" },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const submissionHistorySchema = new mongoose.Schema(
  {
    round: { type: Number, required: true },
    fileUrl: { type: String, required: true },
    note: { type: String, default: "" },
    mentorName: { type: String, default: "" },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", default: null },
    submittedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "CHANGES_REQUESTED"],
      default: "UNDER_REVIEW"
    },
    mentorFeedback: { type: String, default: "" },
    adminFeedback: { type: String, default: "" },
    reviewedAt: { type: Date, default: null }
  },
  { _id: false }
);

const legalSubmissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "LegalTask", required: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", default: null },

    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "CHANGES_REQUESTED"],
      default: "PENDING"
    },

    evidence: { type: [evidenceSchema], default: [] },
    submissionHistory: { type: [submissionHistorySchema], default: [] },
    mentorFeedback: { type: String, default: "" },
    adminFeedback: { type: String, default: "" }
  },
  { timestamps: true }
);

legalSubmissionSchema.index({ userId: 1, taskId: 1 }, { unique: true });

export default mongoose.model("LegalSubmission", legalSubmissionSchema);