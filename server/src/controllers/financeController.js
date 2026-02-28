import FinanceProfile from "../models/FinanceProfile.js";

export const createProfile = async (req, res) => {
  const profile = await FinanceProfile.create({
    ...req.body,
    userId: req.user.id
  });

  res.json(profile);
};

export const getProfile = async (req, res) => {
  const profile = await FinanceProfile.findById(req.params.id);

  res.json(profile);
};

export const updateProfile = async (req, res) => {
  const profile = await FinanceProfile.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(profile);
};

export const deleteProfile = async (req, res) => {
  await FinanceProfile.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};