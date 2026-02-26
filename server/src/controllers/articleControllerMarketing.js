import ArticleMarketing from "../models/ArticleMarketing.js";

// GET /api/marketing/articles?stage=&category=&search=&page=&limit=
// Public
export const getArticlesMarketing = async (req, res, next) => {
  try {
    const { stage, category, search } = req.query;

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "10", 10), 1),
      50
    );
    const skip = (page - 1) * limit;

    const query = {};
    if (stage) query.stage = stage;
    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const [items, total] = await Promise.all([
      ArticleMarketing.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email role"),
      ArticleMarketing.countDocuments(query),
    ]);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/marketing/articles/:id
// Public
export const getArticleByIdMarketing = async (req, res, next) => {
  try {
    const article = await ArticleMarketing.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );

    if (!article) {
      res.status(404);
      throw new Error("Article not found");
    }

    res.status(200).json(article);
  } catch (err) {
    next(err);
  }
};

// POST /api/marketing/articles
// Admin only
export const createArticleMarketing = async (req, res, next) => {
  try {
    const { title, content, category, stage, tags } = req.body;

    const article = await ArticleMarketing.create({
      title,
      content,
      category,
      stage,
      tags: Array.isArray(tags) ? tags : [],
      createdBy: req.user._id,
    });

    res.status(201).json({
      message: "Article created",
      article,
    });
  } catch (err) {
    next(err);
  }
};

// PUT /api/marketing/articles/:id
// Admin only
export const updateArticleMarketing = async (req, res, next) => {
  try {
    const { title, content, category, stage, tags } = req.body;

    const article = await ArticleMarketing.findById(req.params.id);
    if (!article) {
      res.status(404);
      throw new Error("Article not found");
    }

    if (title !== undefined) article.title = title;
    if (content !== undefined) article.content = content;
    if (category !== undefined) article.category = category;
    if (stage !== undefined) article.stage = stage;
    if (tags !== undefined) article.tags = Array.isArray(tags) ? tags : [];

    const updated = await article.save();

    res.status(200).json({
      message: "Article updated",
      article: updated,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/marketing/articles/:id
// Admin only
export const deleteArticleMarketing = async (req, res, next) => {
  try {
    const article = await ArticleMarketing.findById(req.params.id);
    if (!article) {
      res.status(404);
      throw new Error("Article not found");
    }

    await article.deleteOne();

    res.status(200).json({ message: "Article deleted" });
  } catch (err) {
    next(err);
  }
};