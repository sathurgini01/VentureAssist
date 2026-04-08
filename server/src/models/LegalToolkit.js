import mongoose from "mongoose";

const legalToolkitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, enum: ["LINK", "PDF", "TEMPLATE"], default: "LINK" },
    url: { type: String, required: true },
    description: { type: String, default: '' },
    tags: { type: [String], default: [] },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model("LegalToolkit", legalToolkitSchema);