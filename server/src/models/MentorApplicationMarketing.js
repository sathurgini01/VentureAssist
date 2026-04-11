import mongoose from "mongoose";

const mentorApplicationMarketingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    mentorName: { type: String, default: "" },
    mentorEmail: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    expertiseSkills: { type: String, default: "" },
    shortBio: { type: String, default: "" },
    expertiseAreas: [{ type: String, trim: true }], // e.g. ["marketing","finance"]
    qualification: { type: String, default: "" },
    yearsExperience: { type: Number, default: 0, min: 0 },
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
