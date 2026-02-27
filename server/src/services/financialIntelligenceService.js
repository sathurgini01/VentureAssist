import FinanceProfile from "../models/FinanceProfile.js";
import Expense from "../models/Expense.js";
import Revenue from "../models/Revenue.js";

export const generateFinancialReport = async (profileId) => {
  const profile = await FinanceProfile.findById(profileId);

  if (!profile) {
    throw new Error("Finance profile not found");
  }

  const totalExpenses = await Expense.aggregate([
    { $match: { profileId: profile._id } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const totalRevenue = await Revenue.aggregate([
    { $match: { profileId: profile._id } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const expenses = totalExpenses[0]?.total || 0;
  const revenue = totalRevenue[0]?.total || 0;

  // 🔥 Burn Rate
  const burnRate = expenses - revenue;

  // 🚀 Runway
  let runway;
  if (burnRate <= 0) {
    runway = "Infinite (Profitable)";
  } else {
    runway = (profile.initialCapital / burnRate).toFixed(2);
  }

  // 📊 Profit Margin
  const profitMargin =
    revenue === 0 ? 0 : ((revenue - expenses) / revenue) * 100;

  // 🧮 Financial Health Score
  let score = 0;

  // Runway Score
  if (typeof runway === "string") score += 30;
  else if (runway > 12) score += 30;
  else if (runway > 6) score += 20;
  else score += 10;

  // Profit Margin Score
  if (profitMargin > 20) score += 30;
  else if (profitMargin > 10) score += 20;
  else score += 10;

  // Expense Ratio
  const expenseRatio = revenue === 0 ? 100 : (expenses / revenue) * 100;
  if (expenseRatio < 60) score += 20;
  else if (expenseRatio < 80) score += 10;

  // Revenue presence
  if (revenue > 0) score += 20;

  // Risk Level
  let riskLevel;
  if (score >= 80) riskLevel = "Low";
  else if (score >= 50) riskLevel = "Moderate";
  else riskLevel = "High";

  // Smart Advice
  let advice = "";
  if (riskLevel === "High") {
    advice = "Your startup is financially unstable. Reduce burn rate immediately.";
  } else if (riskLevel === "Moderate") {
    advice = "Your startup is stable but needs optimization.";
  } else {
    advice = "Your startup is financially healthy.";
  }

  return {
    burnRate,
    runway,
    totalRevenue: revenue,
    totalExpenses: expenses,
    profitMargin: profitMargin.toFixed(2),
    financialHealthScore: score,
    riskLevel,
    advice
  };
};