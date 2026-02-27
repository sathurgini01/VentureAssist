import mongoose from "mongoose";

const mentorApplicationMarketingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    expertiseAreas: [{ type: String, trim: true }], // e.g. ["marketing","finance"]
    bio: { type: String, default: "" },
    portfolioLink: { type: String, default: "" },
    availability: { type: String, default: "" },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending"
    },

    adminNote: { type: String, default: "" }
  },
  { timestamps: true }
);

export default mongoose.model("MentorApplicationMarketing", mentorApplicationMarketingSchema);