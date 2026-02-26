import Idea from "../models/ideaModel.js";
import Tracker from "../models/trackerModel.js";

// ----------------------------
// Create Idea (B2)
// ----------------------------
export const createIdea = async (req, res, next) => {
  try {
    const idea = await Idea.create(req.body);

    // Auto-create tracker with default checklist
    await Tracker.create({
      ideaId: idea._id,
      items: [
        { title: "Idea submitted", done: true, notes: "" },
        { title: "SWOT generated", done: false, notes: "" },
        { title: "Business canvas completed", done: false, notes: "" },
        { title: "Competitor analysis done", done: false, notes: "" },
        { title: "Revenue model selected", done: false, notes: "" },
        { title: "Pitch deck draft uploaded", done: false, notes: "" }
      ]
    });

    res.status(201).json(idea);
  } catch (error) {
    next(error);
  }
};

// ----------------------------
// Get All Ideas (B3)
// ----------------------------
export const getIdeas = async (req, res, next) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    next(error);
  }
};

// ----------------------------
// Get One Idea (B4)
// ----------------------------
export const getIdeaById = async (req, res, next) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }
    res.json(idea);
  } catch (error) {
    next(error);
  }
};

// ----------------------------
// Update Idea
// ----------------------------
export const updateIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    res.json(idea);
  } catch (error) {
    next(error);
  }
};

// ----------------------------
// Delete Idea (also delete tracker)
// ----------------------------
export const deleteIdea = async (req, res, next) => {
  try {
    const idea = await Idea.findByIdAndDelete(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    // Also delete related tracker
    await Tracker.findOneAndDelete({ ideaId: req.params.id });

    res.json({ message: "Idea deleted successfully" });
  } catch (error) {
    next(error);
  }
};