import "dotenv/config";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import app from "./app.js";
import { seedIfEmpty } from "./config/seed.js";
import express from "express";

import connectDB from "./config/db.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load server/.env even when command is run from project root
dotenv.config({ path: path.resolve(__dirname, "../.env") });

await connectDB();

// ✅ Very Important – Serve static files (PDF download)
app.use(express.static("public"));



const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});