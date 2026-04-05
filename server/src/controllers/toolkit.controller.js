import Toolkit from "../models/toolkitModel.js";

export const listToolkits = async (req, res, next) => {
  try {
    const { q = "", category = "" } = req.query;

    const filter = {};
    if (q) filter.title = { $regex: q, $options: "i" };
    if (category) filter.category = category;

    const toolkits = await Toolkit.find(filter).sort({ createdAt: -1 });
    res.json(toolkits);
  } catch (e) {
    next(e);
  }
};

export const getToolkitById = async (req, res, next) => {
  try {
    const toolkit = await Toolkit.findById(req.params.toolkitId);
    if (!toolkit) return res.status(404).json({ message: "Toolkit not found" });
    res.json(toolkit);
  } catch (e) {
    next(e);
  }
};