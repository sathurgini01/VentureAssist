import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

/* =========================
   REGISTER USER (FORCE USER ROLE)
   ========================= */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body; 
    // ❌ DO NOT take role from req.body anymore

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        message: "User already exists with this email"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ ALWAYS force role = "user"
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
    });

    res.status(201).json({
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id)
    });

  } catch (err) {
    next(err);
  }
};


/* =========================
   LOGIN USER
   ========================= */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: generateToken(user._id)
    });

  } catch (err) {
    next(err);
  }
};