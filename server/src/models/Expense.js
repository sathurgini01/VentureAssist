import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: "FinanceProfile" },
  category: String,
  amount: Number,
  date: { type: Date, default: Date.now },
  description: String
});

export default mongoose.model("Expense", expenseSchema);