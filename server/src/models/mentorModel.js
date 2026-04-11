import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phoneNumber: { type: String, trim: true, default: "" },
    imageUrl: { type: String, required: true },
    expertise: { type: String, required: true, trim: true }, // Business Strategy / Operations / Product
    bio: { type: String, required: true },
    assignedBusinessIdeas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Idea"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Mentor", mentorSchema);
