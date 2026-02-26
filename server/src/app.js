import express from "express";
import cors from "cors";

import authRoutesMarketing from "./routes/authRoutesMarketing.js";
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
app.use("/api/legal", legalRoutes);
app.use("/api/legal", legalActionRoutes);
app.use("/api/legal", toolkitRoutes);
app.use("/api/legal", adminLegalRoutes);
app.use("/api/legal", legalAiRoutes);

// ✅ Mentor RBAC routes (added)
app.use("/api/legal", mentorLegalRoutes);

// Error handling
app.use(notFoundMarketing);
app.use(errorHandlerMarketing);

export default app;