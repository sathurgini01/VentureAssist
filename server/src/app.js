import express from "express";
import cors from "cors";

import authRoutesMarketing from "./routes/authRoutesMarketing.js";
import articleRoutesMarketing from "./routes/articleRoutesMarketing.js";
import templateRoutesMarketing from "./routes/templateRoutesMarketing.js";
import campaignRoutesMarketing from "./routes/campaignRoutesMarketing.js";
import mentorRoutesMarketing from "./routes/mentorRoutesMarketing.js";
import mentorRequestRoutesMarketing from "./routes/mentorRequestRoutesMarketing.js";
import mentorApplicationRoutesMarketing from "./routes/mentorApplicationRoutesMarketing.js";

import {
  notFoundMarketing,
  errorHandlerMarketing,
} from "./middleware/errorMiddlewareMarketing.js";

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

// Error middleware MUST be last
app.use(notFoundMarketing);
app.use(errorHandlerMarketing);

export default app;