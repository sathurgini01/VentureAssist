import User from "../models/User.js";
import MentorApplicationMarketing from "../models/MentorApplicationMarketing.js";

// GET /api/marketing/mentors
export const getMentorsMarketing = async (req, res, next) => {
  try {
    const expertiseArea = (req.query?.expertiseArea || "").trim();

    const mentorUsers = await User.find({ role: "mentor" }).select(
      "name email role createdAt mentorExpertiseAreas"
    );

    const mentorUserIds = mentorUsers.map((mentor) => mentor._id);

    const approvedApplications = await MentorApplicationMarketing.find({
      userId: { $in: mentorUserIds },
      status: "approved"
    })
      .select("userId expertiseAreas availability updatedAt createdAt")
      .sort({ updatedAt: -1, createdAt: -1 });

    const latestApplicationByUser = new Map();
    approvedApplications.forEach((application) => {
      const key = String(application.userId);
      if (!latestApplicationByUser.has(key)) {
        latestApplicationByUser.set(key, application);
      }
    });

    const mentors = mentorUsers
      .map((mentor) => {
        const application = latestApplicationByUser.get(String(mentor._id));
        const userExpertiseAreas = Array.isArray(mentor?.mentorExpertiseAreas)
          ? mentor.mentorExpertiseAreas
          : [];
        const applicationExpertiseAreas = Array.isArray(application?.expertiseAreas)
          ? application.expertiseAreas
          : [];
        const expertiseAreas = userExpertiseAreas.length > 0
          ? userExpertiseAreas
          : applicationExpertiseAreas.length > 0
            ? applicationExpertiseAreas
            : [];

        return {
          ...mentor.toObject(),
          expertiseAreas,
          availability: application?.availability || ""
        };
      })
      .filter((mentor) => {
        if (!expertiseArea) return true;
        return mentor.expertiseAreas.includes(expertiseArea);
      });

    res.status(200).json({ mentors });
  } catch (err) {
    next(err);
  }
};