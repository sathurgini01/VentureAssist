import express from "express";
import { body } from "express-validator";
import { validate } from "../utils/validate.js";
import { registerUser, loginUser } from "../controllers/authControllerMarketing.js";

const router = express.Router();

/**
 * POST /api/marketing/auth/register
 * Public
 */
router.post(
  "/register",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ],
  validate,
  registerUser
);

/**
 * POST /api/marketing/auth/login
 * Public
 */
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validate,
  loginUser
);

export default router;