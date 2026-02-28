import mongoose from "mongoose";

const templateStepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const templateMarketingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true },

    stage: {
      type: String,
      enum: ["earlyStartup", "growing", "established"],
      required: true
    },

    category: { type: String, required: true, trim: true, maxlength: 50 },
    tags: [{ type: String, trim: true }],

    estimatedBudgetLKR: { type: Number, default: 0, min: 0 },
    estimatedDurationDays: { type: Number, default: 30, min: 1 },

    steps: { type: [templateStepSchema], default: [] },

    avgRating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0, min: 0 },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("TemplateMarketing", templateMarketingSchema);