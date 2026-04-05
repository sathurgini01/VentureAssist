import mongoose from "mongoose";

const toolkitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true }, // Canvas/Persona/Competitor/Pitch/SWOT Guide
    description: { type: String, required: true, trim: true },
    content: { type: String, required: true }, // steps/template text
    downloadUrl: { type: String, required: true } // /downloads/toolkits/xxx.pdf
  },
  { timestamps: true }
);

export default mongoose.model("Toolkit", toolkitSchema);