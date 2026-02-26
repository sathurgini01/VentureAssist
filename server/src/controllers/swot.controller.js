import Idea from "../models/ideaModel.js";
import Swot from "../models/swotModel.js";
import { ApiError } from "../utils/ApiError.js";
import { generateSwotFromAI } from "../services/swot.service.js";

// POST /api/business/ideas/:id/swot/generate
export const generateSwot = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) throw new ApiError(404, "Idea not found");

    const swotJson = await generateSwotFromAI(idea);

    const saved = await Swot.findOneAndUpdate(
      { ideaId: idea._id },
      { ideaId: idea._id, ...swotJson, generatedBy: "ai" },
      { upsert: true, new: true }
    );

    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

// GET /api/business/ideas/:id/swot
export const getSwot = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) throw new ApiError(404, "Idea not found");

    const swot = await Swot.findOne({ ideaId: idea._id });
    if (!swot) throw new ApiError(404, "SWOT not generated yet");

    res.json(swot);
  } catch (err) {
    next(err);
  }
};