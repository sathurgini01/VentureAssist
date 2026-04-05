import mongoose from "mongoose";

const financeProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  startupName: { type: String, required: true },
  initialCapital: { type: Number, required: true },
  monthlyRevenue: { type: Number, default: 0 },
  monthlyExpenses: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("FinanceProfile", financeProfileSchema);