import mongoose from "mongoose";

const swotSchema = new mongoose.Schema(
  {
    ideaId: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true, unique: true },
    strengths: [{ type: String, required: true }],
    weaknesses: [{ type: String, required: true }],
    opportunities: [{ type: String, required: true }],
    threats: [{ type: String, required: true }],
    generatedBy: { type: String, enum: ["ai", "manual"], default: "ai" }
  },
  { timestamps: true }
);

export default mongoose.model("Swot", swotSchema);