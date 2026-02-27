import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutesMarketing from "./routes/authRoutesMarketing.js";
import mentorApplicationRoutesMarketing from "./routes/mentorApplicationRoutesMarketing.js";
import businessRoutes from "./routes/business.routes.js";

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// ✅ VERY IMPORTANT: app.js is inside /src, public is outside /src
// so go up one level: ../public
const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

app.get("/", (req, res) => res.send("VentureAssist Backend Running..."));

// Marketing Auth (common)
app.use("/api/marketing/auth", authRoutesMarketing);

// Marketing Mentor Applications
app.use("/api/marketing/mentor-applications", mentorApplicationRoutesMarketing);

// Business module
app.use("/api/business", businessRoutes);

// ✅ Must be LAST
app.use(notFound);
app.use(errorHandler);

export default app;