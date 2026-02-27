import MentorApplicationMarketing from "../models/MentorApplicationMarketing.js";
import User from "../models/User.js";

// POST /api/marketing/mentor-applications  (user)
export const applyForMentorMarketing = async (req, res, next) => {
  try {
    const { expertiseAreas, bio, portfolioLink, availability } = req.body;

    // prevent duplicate pending application
    const existing = await MentorApplicationMarketing.findOne({
      userId: req.user._id,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ message: "You already have a pending application" });
    }

    const created = await MentorApplicationMarketing.create({
      userId: req.user._id,
      expertiseAreas: Array.isArray(expertiseAreas) ? expertiseAreas : [],
      bio: bio || "",
      portfolioLink: portfolioLink || "",
      availability: availability || ""
    });

    res.status(201).json({ message: "Mentor application submitted", application: created });
  } catch (err) {
    next(err);
  }
};

// GET /api/marketing/mentor-applications  (admin sees all | user sees own)
export const getMentorApplicationsMarketing = async (req, res, next) => {
  try {
    const query = req.user.role === "admin" ? {} : { userId: req.user._id };

    const apps = await MentorApplicationMarketing.find(query)
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ applications: apps });
  } catch (err) {
    next(err);
  }
};

// PUT /api/marketing/mentor-applications/:id/approve  (admin)
export const approveMentorApplicationMarketing = async (req, res, next) => {
  try {
    const app = await MentorApplicationMarketing.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.status = "approved";
    app.adminNote = req.body.adminNote || "";
    await app.save();

    // ✅ Promote user to mentor
    await User.findByIdAndUpdate(app.userId, { role: "mentor" });

    res.status(200).json({ message: "Application approved, user is now mentor", application: app });
  } catch (err) {
    next(err);
  }
};

// PUT /api/marketing/mentor-applications/:id/reject  (admin)
export const rejectMentorApplicationMarketing = async (req, res, next) => {
  try {
    const app = await MentorApplicationMarketing.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.status = "rejected";
    app.adminNote = req.body.adminNote || "";
    await app.save();

    res.status(200).json({ message: "Application rejected", application: app });
  } catch (err) {
    next(err);
  }
};