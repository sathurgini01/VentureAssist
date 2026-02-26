import express from "express";
import cors from "cors";

import authRoutesMarketing from "./routes/authRoutesMarketing.js";
import { notFoundMarketing, errorHandlerMarketing } from "./middleware/errorMiddlewareMarketing.js";

import financeRoutes from "./routes/financeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import revenueRoutes from "./routes/revenueRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("VentureAssist Backend Running..."));

app.use("/api/marketing/auth", authRoutesMarketing);

app.use("/api/finance", financeRoutes);
app.use("/api/finance/expenses", expenseRoutes);
app.use("/api/finance/revenue", revenueRoutes);

app.use(notFoundMarketing);
app.use(errorHandlerMarketing);

export default app;