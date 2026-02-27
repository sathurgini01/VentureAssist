import mongoose from "mongoose";

const mentorRequestMarketingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    topic: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120
    },

    message: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },

    reply: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

export default mongoose.model(
  "MentorRequestMarketing",
  mentorRequestMarketingSchema
);