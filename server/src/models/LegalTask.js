import mongoose from "mongoose";

const legalTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    steps: { type: [String], default: [] },
    requiredDocuments: { type: [String], default: [] },
    helpfulLinks: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("LegalTask", legalTaskSchema);