import mongoose from "mongoose";

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: String,
    problem: { type: String, required: true },
    solution: String,
    targetCustomer: String,
    location: String,
    uniqueness: String,
    resources: String,
    challenges: String,
    opportunities: String,
    revenueModel: String,
    nextMonthGoal: String
  },
  { timestamps: true }
);

export default mongoose.model("Idea", ideaSchema);