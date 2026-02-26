import LegalToolkit from "../models/LegalToolkit.js";

export const getToolkits = async (req, res, next) => {
  try {
    const toolkits = await LegalToolkit.find({ active: true }).sort({ category: 1 });
    res.json({ toolkits });
  } catch (err) {
    next(err);
  }
};