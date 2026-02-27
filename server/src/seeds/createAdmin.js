import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config({ path: "./.env" });

const run = async () => {
  const email = process.argv[2];
  const password = process.argv[3] || "Admin@123";
  const name = process.argv[4] || "Admin";

  if (!email) {
    console.log("❌ Usage: node src/seeds/createAdmin.js <email> <password> <name>");
    process.exit(1);
  }

  try {
    if (!process.env.MONGO_URI) {
      console.log("❌ MONGO_URI not found in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Mongo connected");

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("⚠️ User already exists:", email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    console.log("✅ Admin created:", email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
};

run();