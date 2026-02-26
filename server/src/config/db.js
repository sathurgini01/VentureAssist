import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");

    const uri =
      process.env.MONGO_URI ||
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/startup-toolkit";

    if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
      console.warn("⚠ No Mongo URI set — falling back to local MongoDB at:", uri);
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected ✅: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error ❌:", err.message);
    process.exit(1);
  }
};

export default connectDB;