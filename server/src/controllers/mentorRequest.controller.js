import MentorRequest from "../models/mentorRequestModel.js";

export const createMentorRequest = async (req, res, next) => {
  try {
    const { mentorId, ideaId, message, preferredTime } = req.body;
    if (!mentorId || !message || !preferredTime) {
      return res.status(400).json({ message: "mentorId, message, preferredTime are required" });
    }

    const created = await MentorRequest.create({
      mentorId,
      ideaId: ideaId || undefined,
      message,
      preferredTime
    });

    res.status(201).json({ message: "Request sent successfully ✅", request: created });
  } catch (e) {
    next(e);
  }
};

export const listMentorRequests = async (req, res, next) => {
  try {
    const { mentorId, ideaId, status } = req.query;

    const filter = {};
    if (mentorId) filter.mentorId = mentorId;
    if (ideaId) filter.ideaId = ideaId;
    if (status) filter.status = status;

    const requests = await MentorRequest.find(filter)
      .populate("mentorId")
      .populate("ideaId")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (e) {
    next(e);
  }
};

export const updateMentorRequestStatus = async (req, res, next) => {
  try {
    const { status, mentorNote = "" } = req.body;
    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await MentorRequest.findByIdAndUpdate(
      req.params.id,
      { status, mentorNote },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Request not found" });
    res.json(updated);
  } catch (e) {
    next(e);
  }
};