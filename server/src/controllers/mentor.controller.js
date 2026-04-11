import Mentor from "../models/mentorModel.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9\s\-()]{7,15}$/;

function buildAvatarUrl(name = "Mentor") {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=ffffff`;
}

function normalizeMentor(mentorDoc) {
  const mentor = mentorDoc?.toObject ? mentorDoc.toObject() : mentorDoc;
  const assignedIdeas = Array.isArray(mentor?.assignedBusinessIdeas) ? mentor.assignedBusinessIdeas : [];

  return {
    ...mentor,
    email: mentor?.email || "",
    phoneNumber: mentor?.phoneNumber || "",
    imageUrl: mentor?.imageUrl || buildAvatarUrl(mentor?.name),
    bio:
      mentor?.bio ||
      `${mentor?.name || "This mentor"} supports founders with ${mentor?.expertise?.toLowerCase() || "business"} guidance.`,
    assignedBusinessIdeas: assignedIdeas,
    assignedBusinessIdeaTitles: assignedIdeas.map((idea) => idea?.title).filter(Boolean)
  };
}

export const listMentors = async (req, res, next) => {
  try {
    const { q = "", expertise = "" } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { expertise: { $regex: q, $options: "i" } }
      ];
    }
    if (expertise) filter.expertise = expertise;

    const mentors = await Mentor.find(filter)
      .populate("assignedBusinessIdeas", "title")
      .sort({ createdAt: -1 });

    res.json(mentors.map(normalizeMentor));
  } catch (e) {
    next(e);
  }
};

export const getMentorById = async (req, res, next) => {
  try {
    const mentor = await Mentor.findById(req.params.mentorId).populate("assignedBusinessIdeas", "title");

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json(normalizeMentor(mentor));
  } catch (e) {
    next(e);
  }
};

export const createMentor = async (req, res, next) => {
  try {
    const { name, email = "", phoneNumber = "", expertise, assignedBusinessIdeas = [], bio = "" } = req.body;

    if (!name || !email || !expertise) {
      return res.status(400).json({ message: "Name, email, and expertise are required" });
    }

    if (!emailPattern.test(String(email).trim())) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (!phonePattern.test(String(phoneNumber).trim())) {
      return res.status(400).json({ message: "Enter a valid phone number" });
    }

    const mentor = await Mentor.create({
      name,
      email,
      phoneNumber,
      expertise,
      assignedBusinessIdeas,
      imageUrl: req.body.imageUrl || buildAvatarUrl(name),
      bio:
        bio ||
        `${name} supports founders with ${String(expertise).toLowerCase()} guidance.`
    });

    const populatedMentor = await Mentor.findById(mentor._id).populate("assignedBusinessIdeas", "title");
    res.status(201).json(normalizeMentor(populatedMentor));
  } catch (e) {
    next(e);
  }
};

export const updateMentor = async (req, res, next) => {
  try {
    const { name, email = "", phoneNumber = "", expertise, assignedBusinessIdeas = [], bio = "" } = req.body;

    if (!name || !email || !expertise) {
      return res.status(400).json({ message: "Name, email, and expertise are required" });
    }

    if (!emailPattern.test(String(email).trim())) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (!phonePattern.test(String(phoneNumber).trim())) {
      return res.status(400).json({ message: "Enter a valid phone number" });
    }

    const mentor = await Mentor.findByIdAndUpdate(
      req.params.mentorId,
      {
        name,
        email,
        phoneNumber,
        expertise,
        assignedBusinessIdeas,
        imageUrl: req.body.imageUrl || buildAvatarUrl(name),
        bio:
          bio ||
          `${name} supports founders with ${String(expertise).toLowerCase()} guidance.`
      },
      { new: true, runValidators: true }
    ).populate("assignedBusinessIdeas", "title");

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json(normalizeMentor(mentor));
  } catch (e) {
    next(e);
  }
};

export const deleteMentor = async (req, res, next) => {
  try {
    const mentor = await Mentor.findByIdAndDelete(req.params.mentorId);

    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json({ message: "Mentor deleted successfully" });
  } catch (e) {
    next(e);
  }
};
