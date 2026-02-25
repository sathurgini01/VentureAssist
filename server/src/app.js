import express from "express";
import cors from "cors";

import authRoutesMarketing from "./routes/authRoutesMarketing.js";
import { notFoundMarketing, errorHandlerMarketing } from "./middleware/errorMiddlewareMarketing.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("VentureAssist Backend Running..."));

app.use("/api/marketing/auth", authRoutesMarketing);

app.use(notFoundMarketing);
app.use(errorHandlerMarketing);

export default app;