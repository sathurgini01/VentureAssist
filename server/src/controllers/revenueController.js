import Revenue from "../models/Revenue.js";
import FinanceProfile from "../models/FinanceProfile.js";

export const addRevenue = async (req, res) => {
  const revenue = await Revenue.create(req.body);
  await FinanceProfile.findByIdAndUpdate(req.body.profileId, {
    $inc: { monthlyRevenue: revenue.amount }
  });
  res.json(revenue);
};

export const getRevenue = async (req, res) => {
  const data = await Revenue.find({ profileId: req.params.profileId });
  res.json(data);
};

export const updateRevenue = async (req, res) => {
  const oldDoc = await Revenue.findById(req.params.id);
  const updated = await Revenue.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated)
    return res.status(404).json({ message: "Revenue not found" });

  if (oldDoc) {
    await FinanceProfile.findByIdAndUpdate(updated.profileId, {
      $inc: { monthlyRevenue: updated.amount - oldDoc.amount }
    });
  }

  res.json(updated);
};


export const deleteRevenue = async (req, res) => {
  const deleted = await Revenue.findByIdAndDelete(req.params.id);

  if (!deleted)
    return res.status(404).json({ message: "Revenue not found" });

  await FinanceProfile.findByIdAndUpdate(deleted.profileId, {
    $inc: { monthlyRevenue: -deleted.amount }
  });

  res.json({ message: "Revenue deleted successfully" });
};