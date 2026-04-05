import MentorRequestMarketing from "../models/MentorRequestMarketing.js";
import User from "../models/User.js";

// Create mentor request (User)
export const createMentorRequestMarketing = async (req, res, next) => {
  try {
    const { mentorId, topic, message } = req.body;

    const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const created = await MentorRequestMarketing.create({
      userId: req.user._id,
      mentorId,
      topic,
      message
    });

    res.status(201).json({ message: "Mentor request sent", request: created });
  } catch (err) {
    next(err);
  }
};

// Get mentor requests (role-based)
export const getMentorRequestsMarketing = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === "user") {
      query.userId = req.user._id;
    } else if (req.user.role === "mentor") {
      query.mentorId = req.user._id;
    }
    // admin sees all (no filter)

    const requests = await MentorRequestMarketing.find(query)
      .populate("userId", "name email role")
      .populate("mentorId", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({ requests });
  } catch (err) {
    next(err);
  }
};

// Mentor/Admin respond
export const respondMentorRequestMarketing = async (req, res, next) => {
  try {
    const { status, reply } = req.body;

    const request = await MentorRequestMarketing.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    const isMentorAssigned =
      request.mentorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isMentorAssigned && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to respond" });
    }

    if (status) request.status = status;
    if (reply !== undefined) request.reply = reply;

    await request.save();

    res.status(200).json({
      message: "Request updated",
      request
    });
  } catch (err) {
    next(err);
  }
};