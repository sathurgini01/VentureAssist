import FinanceProfile from "../models/FinanceProfile.js";
import calculateRunway from "../utils/calculateBreakEven.js";

export const getBreakEven = async (profileId) => {
  const profile = await FinanceProfile.findById(profileId);

  return calculateRunway(
    profile.initialCapital,
    profile.monthlyRevenue,
    profile.monthlyExpenses
  );
};