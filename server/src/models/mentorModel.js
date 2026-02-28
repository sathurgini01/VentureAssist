import mongoose from "mongoose";

const mentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true },
    expertise: { type: String, required: true, trim: true }, // Business Strategy / Operations / Product
    bio: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Mentor", mentorSchema);