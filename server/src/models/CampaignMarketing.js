import mongoose from "mongoose";

const campaignTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isDone: { type: Boolean, default: false },
    completedAt: { type: Date, default: null }
  },
  { _id: false }
);

const campaignMarketingSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    templateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TemplateMarketing",
      default: null
    },

    title: { type: String, required: true, trim: true, maxlength: 140 },

    status: {
      type: String,
      enum: ["planned", "running", "paused", "completed"],
      default: "planned"
    },

    progress: { type: Number, default: 0, min: 0, max: 100 },

    tasks: { type: [campaignTaskSchema], default: [] },

    metrics: {
      impressions: { type: Number, default: 0, min: 0 },
      clicks: { type: Number, default: 0, min: 0 },
      leads: { type: Number, default: 0, min: 0 },
      engagement: { type: Number, default: 0, min: 0 },
      sales: { type: Number, default: 0, min: 0 },
      budgetSpentLKR: { type: Number, default: 0, min: 0 },
      notes: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("CampaignMarketing", campaignMarketingSchema);