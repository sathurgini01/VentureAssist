import express from "express";
import cors from "cors";

import authRoutesMarketing from "./routes/authRoutesMarketing.js";
import articleRoutesMarketing from "./routes/articleRoutesMarketing.js";
import templateRoutesMarketing from "./routes/templateRoutesMarketing.js";
import campaignRoutesMarketing from "./routes/campaignRoutesMarketing.js";
import mentorRoutesMarketing from "./routes/mentorRoutesMarketing.js";
import mentorRequestRoutesMarketing from "./routes/mentorRequestRoutesMarketing.js";
import mentorApplicationRoutesMarketing from "./routes/mentorApplicationRoutesMarketing.js";
import aiRoutes from "./routes/aiRoutes.js";

import {
  notFoundMarketing,
  errorHandlerMarketing,
} from "./middleware/errorMiddlewareMarketing.js";

import financeRoutes from "./routes/financeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import revenueRoutes from "./routes/revenueRoutes.js";

const app = express();



app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("VentureAssist Backend Running..."));

// Routes (order doesn’t matter, but keep consistent)
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

app.use(notFoundMarketing);
app.use(errorHandlerMarketing);

export default app;