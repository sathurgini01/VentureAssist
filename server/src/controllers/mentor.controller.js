import Mentor from "../models/mentorModel.js";

export const listMentors = async (req, res, next) => {
  try {
    const { q = "", expertise = "" } = req.query;

    const filter = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (expertise) filter.expertise = expertise;

    const mentors = await Mentor.find(filter).sort({ createdAt: -1 });
    res.json(mentors);
  } catch (e) {
    next(e);
  }
};