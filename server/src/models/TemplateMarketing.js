import mongoose from "mongoose";

const templateStepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, default: "" },
    order: { type: Number, default: 0 }
  },
  { _id: false }
);

const templateMetricSchema = new mongoose.Schema(
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

const templateBudgetItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 120 },
    amountLKR: { type: Number, default: 0, min: 0 }
  },
  { _id: false }
);

const templateExecutionDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1 },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    focus: { type: String, default: "", trim: true, maxlength: 220 },
    tasks: [{ type: String, trim: true, maxlength: 200 }]
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

    durationLabel: { type: String, default: "", trim: true, maxlength: 60 },
    objective: { type: String, default: "", trim: true, maxlength: 220 },
    campaignOverview: { type: String, default: "" },
    targetAudience: { type: String, default: "" },
    idealFor: [{ type: String, trim: true }],

    estimatedBudgetLKR: { type: Number, default: 0, min: 0 },
    estimatedDurationDays: { type: Number, default: 30, min: 1 },

    budgetBreakdown: { type: [templateBudgetItemSchema], default: [] },
    executionPlan: { type: [templateExecutionDaySchema], default: [] },
    expectedResults: [{ type: String, trim: true }],
    finalOutputItems: [{ type: String, trim: true }],

    steps: { type: [templateStepSchema], default: [] },
    metricDefinitions: { type: [templateMetricSchema], default: [] },

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