import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectMarketing = async (req, res, next) => {
  try {
    const rawAuthHeader = req.headers.authorization || req.headers.Authorization;
    const authHeader = String(rawAuthHeader || "").trim();

    // Accept: "Bearer <token>" (case-insensitive, tolerant to extra spaces)
    const bearerMatch = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!bearerMatch) {
      return res.status(401).json({
        message: "Not authorized, missing or invalid Authorization header",
        hint: "Use header: Authorization: Bearer <token>"
      });
    }

    const token = bearerMatch[1].trim();
    if (!token) {
      return res.status(401).json({
        message: "Not authorized, empty token",
        hint: "Login again and paste full JWT token"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Not authorized, token failed",
      hint: "Token may be expired/invalid. Login again and use fresh token"
    });
  }
};
