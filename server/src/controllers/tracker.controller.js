import Tracker from "../models/trackerModel.js";

const defaultItems = [
  "Idea submitted",
  "SWOT generated",
  "Business canvas completed",
  "Competitor analysis done",
  "Revenue model selected",
  "Pitch deck draft uploaded"
];

export const initTrackerForIdea = async (req, res, next) => {
  try {
    const { ideaId } = req.params;

    const existing = await Tracker.findOne({ ideaId });
    if (existing) return res.json(existing);

    const created = await Tracker.create({
      ideaId,
      items: defaultItems.map((t) => ({ title: t, done: false, notes: "" }))
    });

    res.status(201).json(created);
  } catch (e) {
    next(e);
  }
};

export const getTrackerByIdea = async (req, res, next) => {
  try {
    const { ideaId } = req.query;
    if (!ideaId) return res.status(400).json({ message: "ideaId is required" });

    const tracker = await Tracker.findOne({ ideaId });
    if (!tracker) return res.status(404).json({ message: "Tracker not found (init first)" });

    // progress percent
    const total = tracker.items.length || 1;
    const doneCount = tracker.items.filter((i) => i.done).length;
    const progressPercent = Math.round((doneCount / total) * 100);

    res.json({ tracker, progressPercent });
  } catch (e) {
    next(e);
  }
};

export const updateTrackerItem = async (req, res, next) => {
  try {
    const { trackerId, itemId } = req.params;
    const { done, notes } = req.body;

    const tracker = await Tracker.findById(trackerId);
    if (!tracker) return res.status(404).json({ message: "Tracker not found" });

    const item = tracker.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (typeof done === "boolean") item.done = done;
    if (typeof notes === "string") item.notes = notes;

    await tracker.save();

    const total = tracker.items.length || 1;
    const doneCount = tracker.items.filter((i) => i.done).length;
    const progressPercent = Math.round((doneCount / total) * 100);

    res.json({ tracker, progressPercent });
  } catch (e) {
    next(e);
  }
};