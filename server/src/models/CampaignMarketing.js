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

const campaignMetricDefinitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    type: {
      type: String,
      enum: ["number", "percentage", "currency"],
      default: "number"
    },
    required: { type: Boolean, default: false }
  },
  { _id: false }
);

const campaignMetricValueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    value: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ["number", "percentage", "currency"],
      default: "number"
    }
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
    metricDefinitions: { type: [campaignMetricDefinitionSchema], default: [] },
    metricValues: { type: [campaignMetricValueSchema], default: [] },

    metrics: {
      impressions: { type: Number, default: 0, min: 0 },
      clicks: { type: Number, default: 0, min: 0 },
      leads: { type: Number, default: 0, min: 0 },
      engagement: { type: Number, default: 0, min: 0 },
      sales: { type: Number, default: 0, min: 0 },
      budgetSpentLKR: { type: Number, default: 0, min: 0 },
      revenue: { type: Number, default: 0, min: 0 },
      notes: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("CampaignMarketing", campaignMarketingSchema);