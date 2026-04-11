import Toolkit from "../models/toolkitModel.js";

function normalizeToolkit(toolkitDoc) {
  const toolkit = toolkitDoc?.toObject ? toolkitDoc.toObject() : toolkitDoc;
  const displayName = toolkit?.name || toolkit?.title;
  const relatedBusinessIdeaTitle = toolkit?.relatedBusinessIdea?.title || "";

  return {
    ...toolkit,
    name: displayName,
    title: displayName,
    category: relatedBusinessIdeaTitle || toolkit?.category || "Business Toolkit",
    content: toolkit?.content || toolkit?.description || "",
    downloadUrl: toolkit?.downloadUrl || "",
    relatedBusinessIdeaTitle,
    resourceType: toolkit?.resourceType || "",
    fileName: toolkit?.fileName || ""
  };
}

export const listToolkits = async (req, res, next) => {
  try {
    const { q = "", category = "" } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }
    if (category) {
      filter.category = category;
    }

    const toolkits = await Toolkit.find(filter)
      .populate("relatedBusinessIdea", "title")
      .sort({ createdAt: -1 });

    res.json(toolkits.map(normalizeToolkit));
  } catch (e) {
    next(e);
  }
};

export const getToolkitById = async (req, res, next) => {
  try {
    const toolkit = await Toolkit.findById(req.params.toolkitId).populate("relatedBusinessIdea", "title");
    if (!toolkit) return res.status(404).json({ message: "Toolkit not found" });
    res.json(normalizeToolkit(toolkit));
  } catch (e) {
    next(e);
  }
};

export const createToolkit = async (req, res, next) => {
  try {
    const { name, description, relatedBusinessIdea = null, resourceType = "", downloadUrl = "", fileName = "" } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    if (!downloadUrl) {
      return res.status(400).json({ message: "A PDF file or resource link is required" });
    }

    const toolkit = await Toolkit.create({
      name,
      title: name,
      description,
      relatedBusinessIdea,
      category: req.body.category || "Business Toolkit",
      content: req.body.content || description,
      downloadUrl,
      resourceType,
      fileName
    });

    const populatedToolkit = await Toolkit.findById(toolkit._id).populate("relatedBusinessIdea", "title");
    res.status(201).json(normalizeToolkit(populatedToolkit));
  } catch (e) {
    next(e);
  }
};

export const updateToolkit = async (req, res, next) => {
  try {
    const { name, description, relatedBusinessIdea = null, resourceType = "", downloadUrl = "", fileName = "" } = req.body;

    if (!name || !description) {
      return res.status(400).json({ message: "Name and description are required" });
    }

    if (!downloadUrl) {
      return res.status(400).json({ message: "A PDF file or resource link is required" });
    }

    const toolkit = await Toolkit.findByIdAndUpdate(
      req.params.toolkitId,
      {
        name,
        title: name,
        description,
        relatedBusinessIdea,
        category: req.body.category || "Business Toolkit",
        content: req.body.content || description,
        downloadUrl,
        resourceType,
        fileName
      },
      { new: true, runValidators: true }
    ).populate("relatedBusinessIdea", "title");

    if (!toolkit) {
      return res.status(404).json({ message: "Toolkit not found" });
    }

    res.json(normalizeToolkit(toolkit));
  } catch (e) {
    next(e);
  }
};

export const deleteToolkit = async (req, res, next) => {
  try {
    const toolkit = await Toolkit.findByIdAndDelete(req.params.toolkitId);

    if (!toolkit) {
      return res.status(404).json({ message: "Toolkit not found" });
    }

    res.json({ message: "Toolkit deleted successfully" });
  } catch (e) {
    next(e);
  }
};
