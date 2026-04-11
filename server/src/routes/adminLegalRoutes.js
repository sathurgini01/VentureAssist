import express from "express";
import * as authPkg from "../middleware/authMiddlewareMarketing.js";
import * as rolePkg from "../middleware/roleMiddlewareMarketing.js";
import LegalTask from "../models/LegalTask.js";

const { protectMarketing } = authPkg;
const { allowMarketingRoles } = rolePkg;

const router = express.Router();

// CREATE
router.post("/admin/tasks", protectMarketing, allowMarketingRoles("admin"), async (req, res, next) => {
  try {
    const task = await LegalTask.create(req.body);
    res.status(201).json({ task });
  } catch (e) { next(e); }
});

// READ list
router.get("/admin/tasks", protectMarketing, allowMarketingRoles("admin"), async (req, res, next) => {
  try {
    const tasks = await LegalTask.find().sort({ order: 1 });
    res.json({ tasks });
  } catch (e) { next(e); }
});

// READ one
router.get("/admin/tasks/:taskId", protectMarketing, allowMarketingRoles("admin"), async (req, res, next) => {
  try {
    const task = await LegalTask.findById(req.params.taskId);
    res.json({ task });
  } catch (e) { next(e); }
});

// UPDATE
router.put("/admin/tasks/:taskId", protectMarketing, allowMarketingRoles("admin"), async (req, res, next) => {
  try {
    const task = await LegalTask.findByIdAndUpdate(req.params.taskId, req.body, { returnDocument: "after" });
    res.json({ task });
  } catch (e) { next(e); }
});

// DELETE
router.delete("/admin/tasks/:taskId", protectMarketing, allowMarketingRoles("admin"), async (req, res, next) => {
  try {
    await LegalTask.findByIdAndDelete(req.params.taskId);
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
});

export default router;




