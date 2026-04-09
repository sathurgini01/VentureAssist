import mongoose from "mongoose";

const toolkitSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    relatedBusinessIdea: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Idea"
    },
    category: { type: String, trim: true }, // Canvas/Persona/Competitor/Pitch/SWOT Guide
    description: { type: String, required: true, trim: true },
    content: { type: String, default: "" }, // steps/template text
    downloadUrl: { type: String, default: "" }, // /downloads/toolkits/xxx.pdf
    resourceType: {
      type: String,
      enum: ["pdf", "link", ""],
      default: ""
    },
    fileName: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("Toolkit", toolkitSchema);
