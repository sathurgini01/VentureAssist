import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutesMarketing from "./routes/authRoutesMarketing.js";
import articleRoutesMarketing from "./routes/articleRoutesMarketing.js";
import templateRoutesMarketing from "./routes/templateRoutesMarketing.js";
import campaignRoutesMarketing from "./routes/campaignRoutesMarketing.js";
import mentorRoutesMarketing from "./routes/mentorRoutesMarketing.js";
import mentorRequestRoutesMarketing from "./routes/mentorRequestRoutesMarketing.js";
import mentorApplicationRoutesMarketing from "./routes/mentorApplicationRoutesMarketing.js";
import aiRoutes from "./routes/aiRoutes.js";
import legalRoutes from "./routes/legalRoutes.js";
import legalActionRoutes from "./routes/legalActionRoutes.js";
import toolkitRoutes from "./routes/toolkitRoutes.js";
import mentorLegalRoutes from "./routes/mentorLegalRoutes.js";
import adminLegalRoutes from "./routes/adminLegalRoutes.js";
import legalAiRoutes from "./routes/legalAiRoutes.js";
import mentorApplicationRoutesMarketing from "./routes/mentorApplicationRoutesMarketing.js";

import {
  notFoundMarketing,
  errorHandlerMarketing,
} from "./middleware/errorMiddlewareMarketing.js";

import financeRoutes from "./routes/financeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import revenueRoutes from "./routes/revenueRoutes.js";



import businessRoutes from "./routes/business.routes.js";

import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();


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

// Routes (order doesn’t matter, but keep consistent)
// Marketing Auth (common)
app.use("/api/marketing/auth", authRoutesMarketing);
app.use("/api/marketing/articles", articleRoutesMarketing);
app.use("/api/marketing/templates", templateRoutesMarketing);
app.use("/api/marketing/campaigns", campaignRoutesMarketing);
app.use("/api/marketing/mentors", mentorRoutesMarketing);
app.use("/api/marketing/mentor-requests", mentorRequestRoutesMarketing);
app.use("/api/marketing/mentor-applications", mentorApplicationRoutesMarketing);
app.use("/api/ai", aiRoutes);


app.use("/api/finance", financeRoutes);
app.use("/api/finance/expenses", expenseRoutes);
app.use("/api/finance/revenue", revenueRoutes);

// Marketing Mentor Applications
app.use("/api/marketing/mentor-applications", mentorApplicationRoutesMarketing);

// Business module
app.use("/api/business", businessRoutes);

// ✅ Must be LAST
app.use(notFound);
app.use(errorHandler);

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.send("VentureAssist Backend Running...");
});

// Routes
app.use("/api/marketing/auth", authRoutesMarketing);
app.use("/api/auth", authRoutesMarketing);
app.use("/api/legal", legalRoutes);
app.use("/api/legal", legalActionRoutes);
app.use("/api/legal", toolkitRoutes);
app.use("/api/legal", adminLegalRoutes);
app.use("/api/legal", legalAiRoutes);
app.use("/api/legal", mentorLegalRoutes);

// ✅ Mentor Applications route (Added)
app.use("/api/marketing/mentor-applications", mentorApplicationRoutesMarketing);

// Error handling
app.use(notFoundMarketing);
app.use(errorHandlerMarketing);

export default app;