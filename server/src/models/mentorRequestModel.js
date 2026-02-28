import mongoose from "mongoose";

const mentorRequestSchema = new mongoose.Schema(
  {
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: "Mentor", required: true },
    ideaId: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: false },
    message: { type: String, required: true },
    preferredTime: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
    mentorNote: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("MentorRequest", mentorRequestSchema);