import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("VentureAssist server is running ✅");
});

export default app;