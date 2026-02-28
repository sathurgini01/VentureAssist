import TemplateMarketing from "../models/TemplateMarketing.js";

// GET /api/marketing/templates?stage=&category=&search=&page=&limit=
const getTemplatesMarketing = async (req, res, next) => {
  try {
    const { stage, category, search } = req.query;

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || "10", 10), 1), 50);
    const skip = (page - 1) * limit;

    const query = {};
    if (stage) query.stage = stage;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }

    const [items, total] = await Promise.all([
      TemplateMarketing.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email role"),
      TemplateMarketing.countDocuments(query)
    ]);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/marketing/templates/:id
const getTemplateByIdMarketing = async (req, res, next) => {
  try {
    const item = await TemplateMarketing.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!item) {
      res.status(404);
      throw new Error("Template not found");
    }

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

// POST /api/marketing/templates (admin)
const createTemplateMarketing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      stage,
      category,
      tags,
      estimatedBudgetLKR,
      estimatedDurationDays,
      steps
    } = req.body;

    const created = await TemplateMarketing.create({
      title,
      description,
      stage,
      category,
      tags: Array.isArray(tags) ? tags : [],
      estimatedBudgetLKR: estimatedBudgetLKR ?? 0,
      estimatedDurationDays: estimatedDurationDays ?? 30,
      steps: Array.isArray(steps) ? steps : [],
      createdBy: req.user._id
    });

    res.status(201).json({ message: "Template created", template: created });
  } catch (err) {
    next(err);
  }
};

// PUT /api/marketing/templates/:id (admin)
const updateTemplateMarketing = async (req, res, next) => {
  try {
    const t = await TemplateMarketing.findById(req.params.id);
    if (!t) {
      res.status(404);
      throw new Error("Template not found");
    }

    const updatable = [
      "title",
      "description",
      "stage",
      "category",
      "tags",
      "estimatedBudgetLKR",
      "estimatedDurationDays",
      "steps"
    ];

    updatable.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === "tags" || field === "steps") {
          t[field] = Array.isArray(req.body[field]) ? req.body[field] : [];
        } else {
          t[field] = req.body[field];
        }
      }
    });

    const updated = await t.save();
    res.status(200).json({ message: "Template updated", template: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/marketing/templates/:id (admin)
const deleteTemplateMarketing = async (req, res, next) => {
  try {
    const t = await TemplateMarketing.findById(req.params.id);
    if (!t) {
      res.status(404);
      throw new Error("Template not found");
    }

    await t.deleteOne();
    res.status(200).json({ message: "Template deleted" });
  } catch (err) {
    next(err);
  }
};

export {
  getTemplatesMarketing,
  getTemplateByIdMarketing,
  createTemplateMarketing,
  updateTemplateMarketing,
  deleteTemplateMarketing
};