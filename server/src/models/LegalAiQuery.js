import mongoose from "mongoose";

const businessProfileSchema = new mongoose.Schema(
  {
    businessName: { type: String, default: "" },
    businessType: { type: String, default: "" }, // sole proprietorship, partnership, private limited, etc.
    businessStage: { type: String, default: "" }, // idea, startup, operating, scaling
    industry: { type: String, default: "" }, // food, retail, services, tech, etc.
    country: { type: String, default: "" },
    districtOrCity: { type: String, default: "" },
    employeeCount: { type: Number, default: 0 },
    hasPhysicalLocation: { type: Boolean, default: false },
    hasEmployees: { type: Boolean, default: false },
    licenses: { type: [String], default: [] }
  },
  { _id: false }
);

const legalAiQuerySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    businessProfile: {
      type: businessProfileSchema,
      default: {}
    },
    response: {
      summary: { type: String, default: "" },
      riskLevel: {
        type: String,
        enum: ["LOW", "MEDIUM", "HIGH"],
        default: "MEDIUM"
      },
      actionItems: { type: [String], default: [] },
      documentsToConsider: { type: [String], default: [] },
      licencesToCheck: { type: [String], default: [] },
      warnings: { type: [String], default: [] },
      disclaimer: { type: String, default: "General guidance only. Not legal advice." }
    },
    provider: {
      type: String,
      default: "gemini"
    },
    model: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      default: "SUCCESS"
    },
    rawText: {
      type: String,
      default: ""
    },
    errorMessage: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model("LegalAiQuery", legalAiQuerySchema);