import "dotenv/config";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import app from "./app.js";
import { seedIfEmpty } from "./config/seed.js";
import express from "express";

import connectDB from "./config/db.js";

await connectDB();

// ✅ Very Important – Serve static files (PDF download)
app.use(express.static("public"));

// ✅ Seed toolkits + mentors if DB emptys
await seedIfEmpty();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});