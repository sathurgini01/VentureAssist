import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedIfEmpty } from "./config/seed.js";

dotenv.config();

await connectDB();

// ✅ Seed toolkits + mentors if DB empty
await seedIfEmpty();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});