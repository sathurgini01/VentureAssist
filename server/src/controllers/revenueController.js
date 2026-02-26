import Revenue from "../models/Revenue.js";

export const addRevenue = async (req, res) => {
  const revenue = await Revenue.create(req.body);
  res.json(revenue);
};

export const getRevenue = async (req, res) => {
  const data = await Revenue.find({ profileId: req.params.profileId });
  res.json(data);
};