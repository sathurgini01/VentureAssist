import mongoose from "mongoose";

const articleMarketingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, required: true },

    category: { type: String, required: true, trim: true, maxlength: 50 },

    stage: {
      type: String,
      enum: ["earlyStartup", "growing", "established"],
      required: true,
    },

    tags: [{ type: String, trim: true }],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ArticleMarketing = mongoose.model(
  "ArticleMarketing",
  articleMarketingSchema
);

export default ArticleMarketing;