import MentorApplicationMarketing from "../models/MentorApplicationMarketing.js";
import User from "../models/User.js";
import Mentor from "../models/mentorModel.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/marketing/mentor-applications  (user)
export const applyForMentorMarketing = async (req, res, next) => {
  try {
    const { expertiseAreas, qualification, yearsExperience, bio, portfolioLink, availability, mentorName, mentorEmail, expertiseSkills, shortBio } = req.body;
    const normalizeExpertiseArea = (value) => {
      const raw = String(value || "").trim().toLowerCase();
      if (!raw) return "";
      if (raw === "businessidea" || raw === "business_idea" || raw === "business-idea" || raw === "business idea") {
        return "businessIdea";
      }
      if (raw === "marketingdevelopment" || raw === "marketing_development" || raw === "marketing-development" || raw === "marketing and development" || raw === "marketing") {
        return "marketingDevelopment";
      }
      if (raw === "law" || raw === "legal") {
        return "law";
      }
      return "";
    };
    const singleExpertiseArea = normalizeExpertiseArea(
      Array.isArray(expertiseAreas) ? expertiseAreas[0] : expertiseAreas
    );
    const normalizedExpertiseAreas = singleExpertiseArea ? [singleExpertiseArea] : [];

    // prevent duplicate pending application
    const existing = await MentorApplicationMarketing.findOne({
      userId: req.user._id,
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ message: "You already have a pending application" });
    }

    if (!emailPattern.test(String(mentorEmail || req.user.email || "").trim())) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const created = await MentorApplicationMarketing.create({
      userId: req.user._id,
      mentorName: mentorName || req.user.name || "",
      mentorEmail: mentorEmail || req.user.email || "",
      phoneNumber: "",
      expertiseSkills: expertiseSkills || "",
      shortBio: shortBio || bio || "",
      expertiseAreas: normalizedExpertiseAreas,
      qualification: qualification || "",
      yearsExperience: Number(yearsExperience || 0),
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

    const normalizeExpertiseArea = (value) => {
      const raw = String(value || "").trim().toLowerCase();
      if (!raw) return "";
      if (raw === "businessidea" || raw === "business_idea" || raw === "business-idea" || raw === "business idea") {
        return "businessIdea";
      }
      if (raw === "marketingdevelopment" || raw === "marketing_development" || raw === "marketing-development" || raw === "marketing and development" || raw === "marketing") {
        return "marketingDevelopment";
      }
      if (raw === "law" || raw === "legal") {
        return "law";
      }
      return "";
    };

    const firstExpertiseArea = normalizeExpertiseArea(
      Array.isArray(app.expertiseAreas) ? app.expertiseAreas[0] : app.expertiseAreas
    );
    const finalExpertiseAreas = firstExpertiseArea ? [firstExpertiseArea] : [];

    app.status = "approved";
    app.expertiseAreas = finalExpertiseAreas;
    app.adminNote = req.body?.adminNote || "";
    await app.save();

    // ✅ Promote user to mentor
    const user = await User.findByIdAndUpdate(app.userId, {
      role: "mentor",
      mentorExpertiseAreas: finalExpertiseAreas
    }, { new: true });

    const mentorName = app.mentorName || user?.name || "Mentor";
    const mentorEmail = app.mentorEmail || user?.email || "";

    const existingMentor = await Mentor.findOne({ email: mentorEmail });

    const mentorPayload = {
      name: mentorName,
      email: mentorEmail,
      phoneNumber: app.phoneNumber || "",
      expertise: app.expertiseSkills || app.qualification || "General Business Support",
      bio: app.shortBio || app.bio || `${mentorName} supports founders with practical business guidance.`,
      imageUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(mentorName)}&background=0f766e&color=ffffff`,
      assignedBusinessIdeas: []
    };

    if (existingMentor) {
      await Mentor.findByIdAndUpdate(existingMentor._id, mentorPayload, { new: true, runValidators: true });
    } else {
      await Mentor.create(mentorPayload);
    }

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

export const deleteMentorApplicationMarketing = async (req, res, next) => {
  try {
    const deleted = await MentorApplicationMarketing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Application not found" });

    res.status(200).json({ message: "Application deleted" });
  } catch (err) {
    next(err);
  }
};
