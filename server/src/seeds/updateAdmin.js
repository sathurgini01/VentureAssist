import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config({ path: "./.env" });

const run = async () => {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log("❌ Usage: node updateAdmin.js <email> <newPassword>");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const res = await User.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );

  if (res.modifiedCount === 1) {
    console.log("✅ Password updated for", email);
  } else {
    console.log("⚠️ User not found or password not changed");
  }

  process.exit(0);
};

run();