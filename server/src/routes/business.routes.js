import { Router } from "express";

import {
  createIdea,
  getIdeas,
  getIdeaById,
  updateIdea,
  deleteIdea
} from "../controllers/idea.controller.js";

import {
  listToolkits,
  getToolkitById,
  createToolkit,
  updateToolkit,
  deleteToolkit
} from "../controllers/toolkit.controller.js";
import {
  listMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor
} from "../controllers/mentor.controller.js";

import {
  createMentorRequest,
  listMentorRequests,
  updateMentorRequestStatus,
  deleteMentorRequest
} from "../controllers/mentorRequest.controller.js";

import {
  initTrackerForIdea,
  getTrackerByIdea,
  updateTrackerItem
} from "../controllers/tracker.controller.js";

import { getBusinessHome } from "../controllers/home.controller.js";
import { generateSwot, getSwot } from "../controllers/swot.controller.js";

const router = Router();

router.get("/home", getBusinessHome);

router.post("/ideas", createIdea);
router.get("/ideas", getIdeas);
router.get("/ideas/:id", getIdeaById);
router.put("/ideas/:id", updateIdea);
router.delete("/ideas/:id", deleteIdea);

router.post("/ideas/:id/swot/generate", generateSwot);
router.get("/ideas/:id/swot", getSwot);

router.get("/toolkits", listToolkits);
router.get("/toolkits/:toolkitId", getToolkitById);
router.post("/toolkits", createToolkit);
router.put("/toolkits/:toolkitId", updateToolkit);
router.delete("/toolkits/:toolkitId", deleteToolkit);

router.get("/mentors", listMentors);
router.get("/mentors/:mentorId", getMentorById);
router.post("/mentors", createMentor);
router.put("/mentors/:mentorId", updateMentor);
router.delete("/mentors/:mentorId", deleteMentor);

router.post("/mentor-requests", createMentorRequest);
router.get("/mentor-requests", listMentorRequests);
router.put("/mentor-requests/:id", updateMentorRequestStatus);
router.delete("/mentor-requests/:id", deleteMentorRequest);

router.post("/trackers/init/:ideaId", initTrackerForIdea);
router.get("/tracker/:ideaId", getTrackerByIdea);
router.get("/trackers", getTrackerByIdea);
router.put("/trackers/:trackerId/items/:itemId", updateTrackerItem);

export default router;
