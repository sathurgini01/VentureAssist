import mongoose from "mongoose";

const trackerItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    done: { type: Boolean, default: false },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

const trackerSchema = new mongoose.Schema(
  {
    ideaId: { type: mongoose.Schema.Types.ObjectId, ref: "Idea", required: true, unique: true },
    items: { type: [trackerItemSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Tracker", trackerSchema);