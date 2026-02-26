import mongoose from "mongoose";

const revenueSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "FinanceProfile" },
  source: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Revenue", revenueSchema);