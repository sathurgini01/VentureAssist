import CampaignMarketing from "../models/CampaignMarketing.js";
import TemplateMarketing from "../models/TemplateMarketing.js";

// POST /api/marketing/campaigns
// Create campaign (optionally from templateId)
export const createCampaignMarketing = async (req, res, next) => {
  try {
    const { templateId, title } = req.body;

    let campaignTitle = title;
    let tasks = [];
    let usedTemplateId = null;

    // If creating from template, copy steps -> tasks
    if (templateId) {
      const template = await TemplateMarketing.findById(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      usedTemplateId = template._id;
      campaignTitle = campaignTitle || template.title;

      tasks = (template.steps || []).map((s) => ({
        title: s.title,
        description: s.description || "",
        order: s.order || 0,
        isDone: false,
        completedAt: null
      }));
    }

    if (!campaignTitle) {
      return res.status(400).json({ message: "Campaign title is required" });
    }

    const created = await CampaignMarketing.create({
      owner: req.user._id,
      templateId: usedTemplateId,
      title: campaignTitle,
      tasks
    });

    res.status(201).json({ message: "Campaign created", campaign: created });
  } catch (err) {
    next(err);
  }
};

// GET /api/marketing/campaigns
// Logged-in user sees only their campaigns (admin can see all via query ?all=true if you want)
export const getMyCampaignsMarketing = async (req, res, next) => {
  try {
    const query = { owner: req.user._id };

    const items = await CampaignMarketing.find(query)
      .sort({ createdAt: -1 })
      .populate("templateId", "title stage category")
      .populate("owner", "name email role");

    res.status(200).json({ items });
  } catch (err) {
    next(err);
  }
};

// GET /api/marketing/campaigns/:id
// Owner/admin only (handled by middleware campaignOwnerOrAdmin)
export const getCampaignByIdMarketing = async (req, res) => {
  const campaign = await CampaignMarketing.findById(req.params.id)
    .populate("templateId", "title stage category steps")
    .populate("owner", "name email role");

  res.status(200).json(campaign);
};

// PUT /api/marketing/campaigns/:id
// Owner/admin only
export const updateCampaignMarketing = async (req, res, next) => {
  try {
    const campaign = req.campaign;

    const { status, progress, metrics, tasks, title } = req.body;

    if (title !== undefined) campaign.title = title;

    if (status !== undefined) campaign.status = status;

    if (progress !== undefined) {
      const p = Number(progress);
      if (Number.isNaN(p) || p < 0 || p > 100) {
        return res.status(400).json({ message: "Progress must be between 0 and 100" });
      }
      campaign.progress = p;
    }

    // Update metrics partially
    if (metrics !== undefined && typeof metrics === "object" && metrics !== null) {
      campaign.metrics = {
        ...campaign.metrics,
        ...metrics
      };
    }

    // Update tasks array (simple approach for now)
    if (tasks !== undefined) {
      if (!Array.isArray(tasks)) {
        return res.status(400).json({ message: "Tasks must be an array" });
      }
      // keep only expected shape
      campaign.tasks = tasks.map((t, idx) => ({
        title: t.title ?? `Task ${idx + 1}`,
        description: t.description ?? "",
        order: t.order ?? idx + 1,
        isDone: Boolean(t.isDone),
        completedAt: t.isDone ? (t.completedAt ? new Date(t.completedAt) : new Date()) : null
      }));
    }

    const updated = await campaign.save();
    res.status(200).json({ message: "Campaign updated", campaign: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/marketing/campaigns/:id
// Owner/admin only
export const deleteCampaignMarketing = async (req, res, next) => {
  try {
    const campaign = req.campaign;
    await campaign.deleteOne();
    res.status(200).json({ message: "Campaign deleted" });
  } catch (err) {
    next(err);
  }
};