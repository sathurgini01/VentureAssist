import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    fileUrl: { type: String, required: true },
    note: { type: String, default: "" },
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const legalSubmissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "LegalTask", required: true },

    status: {
      type: String,
      enum: ["PENDING", "UNDER_REVIEW", "APPROVED", "CHANGES_REQUESTED"],
      default: "PENDING"
    },

    evidence: { type: [evidenceSchema], default: [] },
    mentorFeedback: { type: String, default: "" }
  },
  { timestamps: true }
);

legalSubmissionSchema.index({ userId: 1, taskId: 1 }, { unique: true });

export default mongoose.model("LegalSubmission", legalSubmissionSchema);