import FinanceProfile from "../models/FinanceProfile.js";
import Expense from "../models/Expense.js";
import Revenue from "../models/Revenue.js";

const attachTotals = async (profile) => {
  if (!profile) return null;
  const [expSum] = await Expense.aggregate([
    { $match: { profileId: profile._id } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);
  const [revSum] = await Revenue.aggregate([
    { $match: { profileId: profile._id } },
    { $group: { _id: null, total: { $sum: "$amount" } } }
  ]);

  const pObj = profile.toObject();
  pObj.monthlyExpenses = expSum?.total || 0;
  pObj.monthlyRevenue = revSum?.total || 0;

  // Auto-heal the DB record
  await FinanceProfile.findByIdAndUpdate(profile._id, {
    monthlyExpenses: pObj.monthlyExpenses,
    monthlyRevenue: pObj.monthlyRevenue
  });

  return pObj;
};

export const createProfile = async (req, res) => {
  const profile = await FinanceProfile.create({
    ...req.body,
    userId: req.user.id
  });

  res.json(profile);
};

export const getProfile = async (req, res) => {
  const profile = await FinanceProfile.findById(req.params.id);
  res.json(await attachTotals(profile));
};

export const updateProfile = async (req, res) => {
  const profile = await FinanceProfile.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(await attachTotals(profile));
};

export const deleteProfile = async (req, res) => {
  await FinanceProfile.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const getAllProfiles = async (req, res) => {
  const profiles = await FinanceProfile.find({ userId: req.user.id });
  const updatedProfiles = await Promise.all(profiles.map(p => attachTotals(p)));
  res.json(updatedProfiles);
};