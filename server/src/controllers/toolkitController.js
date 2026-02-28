import LegalToolkit from "../models/LegalToolkit.js";

/**
 * GET ALL ACTIVE TOOLKITS (Users)
 * GET /api/legal/toolkits
 */
export const getToolkits = async (req, res, next) => {
  try {
    const toolkits = await LegalToolkit.find({ active: true }).sort({
      category: 1,
    });

    res.json({ toolkits });
  } catch (err) {
    next(err);
  }
};

/**
 * GET SINGLE TOOLKIT
 * GET /api/legal/toolkits/:id
 */
export const getToolkitById = async (req, res, next) => {
  try {
    const toolkit = await LegalToolkit.findById(req.params.id);

    if (!toolkit) {
      return res.status(404).json({ message: "Toolkit not found" });
    }

    res.json({ toolkit });
  } catch (err) {
    next(err);
  }
};

/**
 * CREATE TOOLKIT (Admin Only)
 * POST /api/legal/toolkits
 */
export const createToolkit = async (req, res, next) => {
  try {
    const { title, category, type, url, active } = req.body;

    const toolkit = await LegalToolkit.create({
      title,
      category,
      type,
      url,
      active,
    });

    res.status(201).json({
      message: "Toolkit created successfully",
      toolkit,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * UPDATE TOOLKIT (Admin Only)
 * PUT /api/legal/toolkits/:id
 */
export const updateToolkit = async (req, res, next) => {
  try {
    const toolkit = await LegalToolkit.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!toolkit) {
      return res.status(404).json({ message: "Toolkit not found" });
    }

    res.json({
      message: "Toolkit updated successfully",
      toolkit,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE TOOLKIT (Admin Only)
 * DELETE /api/legal/toolkits/:id
 */
export const deleteToolkit = async (req, res, next) => {
  try {
    const toolkit = await LegalToolkit.findByIdAndDelete(req.params.id);

    if (!toolkit) {
      return res.status(404).json({ message: "Toolkit not found" });
    }

    res.json({ message: "Toolkit deleted successfully" });
  } catch (err) {
    next(err);
  }
};