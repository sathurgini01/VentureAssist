import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import app from "./app.js";
import { connectDB } from "./config/db.js";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server root
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

// Immediately start server safely
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5050;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();