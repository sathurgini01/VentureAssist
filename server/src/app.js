import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutesMarketing from "./routes/authRoutesMarketing.js";
import mentorApplicationRoutesMarketing from "./routes/mentorApplicationRoutesMarketing.js";

import businessRoutes from "./routes/business.routes.js";

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("VentureAssist Backend Running..."));

// Marketing Auth (common)
app.use("/api/marketing/auth", authRoutesMarketing);

// ✅ Marketing Mentor Applications (NEW)
app.use("/api/marketing/mentor-applications", mentorApplicationRoutesMarketing);

// ✅ Business module (YOUR PART)
app.use("/api/business", businessRoutes);

// ✅ Common handlers (works for ApiError status codes too)
app.use(notFound);
app.use(errorHandler);

export default app;