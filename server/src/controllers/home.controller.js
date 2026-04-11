import Idea from "../models/ideaModel.js";
import Swot from "../models/swotModel.js";
import Toolkit from "../models/toolkitModel.js";
import Mentor from "../models/mentorModel.js";
import Tracker from "../models/trackerModel.js";

export const getBusinessHome = async (req, res, next) => {
  try {
    const ideasCreated = await Idea.countDocuments();
    const swotGenerated = await Swot.countDocuments();
    const toolkitCount = await Toolkit.countDocuments();
    const mentorCount = await Mentor.countDocuments();

    const topToolkits = await Toolkit.find()
      .populate("relatedBusinessIdea", "title")
      .sort({ createdAt: -1 })
      .limit(3);
    const topMentors = await Mentor.find()
      .populate("assignedBusinessIdeas", "title")
      .sort({ createdAt: -1 })
      .limit(3);

    const lastTracker = await Tracker.findOne().sort({ updatedAt: -1 }).populate("ideaId");
    let trackerSnapshot = null;

    if (lastTracker) {
      const total = lastTracker.items.length || 1;
      const doneCount = lastTracker.items.filter((item) => item.done).length;
      const progressPercent = Math.round((doneCount / total) * 100);
      const nextTasks = lastTracker.items.filter((item) => !item.done).slice(0, 3).map((item) => item.title);

      trackerSnapshot = {
        ideaId: lastTracker.ideaId?._id,
        ideaTitle: lastTracker.ideaId?.title,
        progressPercent,
        nextTasks
      };
    }

    res.json({
      ideasCreated,
      swotGenerated,
      toolkitCount,
      mentorCount,
      topToolkits: topToolkits.map((toolkit) => ({
        ...toolkit.toObject(),
        name: toolkit.name || toolkit.title,
        title: toolkit.name || toolkit.title,
        category: toolkit.relatedBusinessIdea?.title || toolkit.category || "Business Toolkit",
        relatedBusinessIdeaTitle: toolkit.relatedBusinessIdea?.title || ""
      })),
      topMentors: topMentors.map((mentor) => ({
        ...mentor.toObject(),
        email: mentor.email || "",
        bio:
          mentor.bio ||
          `${mentor.name} supports founders with ${mentor.expertise?.toLowerCase() || "business"} guidance.`,
        assignedBusinessIdeaTitles: (mentor.assignedBusinessIdeas || [])
          .map((idea) => idea?.title)
          .filter(Boolean)
      })),
      trackerSnapshot
    });
  } catch (e) {
    next(e);
  }
};
