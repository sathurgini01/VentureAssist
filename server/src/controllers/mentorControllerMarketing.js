import User from "../models/User.js";

// GET /api/marketing/mentors
export const getMentorsMarketing = async (req, res, next) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select(
      "name email role createdAt"
    );

    res.status(200).json({ mentors });
  } catch (err) {
    next(err);
  }
};