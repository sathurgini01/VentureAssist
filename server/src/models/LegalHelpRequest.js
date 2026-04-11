import mongoose from "mongoose";

const legalHelpRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: "LegalTask" },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", default: null },
    mentorName: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["OPEN", "CLOSED"], default: "OPEN" },
    mentorReply: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("LegalHelpRequest", legalHelpRequestSchema);