import Revenue from "../models/Revenue.js";

export const addRevenue = async (req, res) => {
  const revenue = await Revenue.create(req.body);
  res.json(revenue);
};

export const getRevenue = async (req, res) => {
  const data = await Revenue.find({ profileId: req.params.profileId });
  res.json(data);
};

export const updateRevenue = async (req, res) => {
  const updated = await Revenue.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!updated)
    return res.status(404).json({ message: "Revenue not found" });

  res.json(updated);
};


export const deleteRevenue = async (req, res) => {
  const deleted = await Revenue.findByIdAndDelete(req.params.id);

  if (!deleted)
    return res.status(404).json({ message: "Revenue not found" });

  res.json({ message: "Revenue deleted successfully" });
};