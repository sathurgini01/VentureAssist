import Idea from "../models/ideaModel.js";
import Swot from "../models/swotModel.js";
import Toolkit from "../models/toolkitModel.js";
import Mentor from "../models/mentorModel.js";
import Tracker from "../models/trackerModel.js";

export const getBusinessHome = async (req, res, next) => {
  try {
    const ideasCreated = await Idea.countDocuments();
    const swotGenerated = await Swot.countDocuments(); // if you don’t use SWOT yet, this will be 0

    const topToolkits = await Toolkit.find().sort({ createdAt: -1 }).limit(3);
    const topMentors = await Mentor.find().sort({ createdAt: -1 }).limit(3);

    // last tracker snapshot
    const lastTracker = await Tracker.findOne().sort({ updatedAt: -1 }).populate("ideaId");
    let trackerSnapshot = null;

    if (lastTracker) {
      const total = lastTracker.items.length || 1;
      const doneCount = lastTracker.items.filter((i) => i.done).length;
      const progressPercent = Math.round((doneCount / total) * 100);
      const nextTasks = lastTracker.items.filter((i) => !i.done).slice(0, 3).map((i) => i.title);

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
      topToolkits,
      topMentors,
      trackerSnapshot
    });
  } catch (e) {
    next(e);
  }
};