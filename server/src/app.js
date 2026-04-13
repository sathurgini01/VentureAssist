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


const app = express();

dotenv.config();


// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

const publicPath = path.join(__dirname, "..", "public");
app.use(express.static(publicPath));

app.get("/", (req, res) => res.send("VentureAssist Backend Running..."));

// Auth
app.use("/api/marketing/auth", authRoutesMarketing);
app.use("/api/auth", authRoutesMarketing);

// Marketing
app.use("/api/marketing/articles", articleRoutesMarketing);
app.use("/api/marketing/templates", templateRoutesMarketing);
app.use("/api/marketing/campaigns", campaignRoutesMarketing);
app.use("/api/marketing/mentors", mentorRoutesMarketing);
app.use("/api/marketing/mentor-requests", mentorRequestRoutesMarketing);
app.use("/api/marketing/mentor-applications", mentorApplicationRoutesMarketing);
app.use("/api/ai", aiRoutes);

// Finance
app.use("/api/finance", financeRoutes);
app.use("/api/finance/expenses", expenseRoutes);
app.use("/api/finance/revenue", revenueRoutes);

// Business
app.use("/api/business", businessRoutes);

// Legal
app.use("/api/legal", legalRoutes);
app.use("/api/legal", legalActionRoutes);
app.use("/api/legal", toolkitRoutes);
app.use("/api/legal", adminLegalRoutes);
app.use("/api/legal", legalAiRoutes);
app.use("/api/legal", mentorLegalRoutes);

// Error handling (must be last)
app.use(notFoundMarketing);
app.use(errorHandlerMarketing);
app.use(notFound);
app.use(errorHandler);



export default app;