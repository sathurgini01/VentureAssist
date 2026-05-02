/**
 * Unit Tests – Authentication Logic
 * Tests JWT generation and password hashing in isolation (no DB required).
 */

import { describe, it, expect, beforeAll } from "@jest/globals";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = "test_secret_key_for_unit_tests";

// ── JWT Token Generation ──────────────────────────────────────────────────────

describe("JWT Token Generation", () => {
  it("generates a valid token containing the user id", () => {
    const userId = "64abc123def456ghi789jkl";
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = jwt.verify(token, JWT_SECRET);
    expect(decoded.id).toBe(userId);
  });

  it("throws an error when verifying with a wrong secret", () => {
    const token = jwt.sign({ id: "user123" }, JWT_SECRET, { expiresIn: "1h" });
    expect(() => jwt.verify(token, "wrong_secret")).toThrow();
  });

  it("throws an error for an expired token", () => {
    const token = jwt.sign({ id: "user123" }, JWT_SECRET, { expiresIn: "0s" });
    // Allow 1ms for expiry
    return new Promise((resolve) =>
      setTimeout(() => {
        expect(() => jwt.verify(token, JWT_SECRET)).toThrow(/expired/i);
        resolve();
      }, 10)
    );
  });
});

// ── Password Hashing ──────────────────────────────────────────────────────────

describe("Password Hashing", () => {
  let hashed;

  beforeAll(async () => {
    const salt = await bcrypt.genSalt(10);
    hashed = await bcrypt.hash("password123", salt);
  });

  it("hashes a password so it does not equal the plaintext", () => {
    expect(hashed).not.toBe("password123");
    expect(hashed.startsWith("$2")).toBe(true);
  });

  it("correctly compares the correct password against the hash", async () => {
    const match = await bcrypt.compare("password123", hashed);
    expect(match).toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const match = await bcrypt.compare("wrongpassword", hashed);
    expect(match).toBe(false);
  });
});

// ── Input Validation Helpers ──────────────────────────────────────────────────

describe("Input Validation", () => {
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isStrongPassword = (pw) => pw.length >= 6;

  it("accepts a valid email address", () => {
    expect(isValidEmail("test@example.com")).toBe(true);
  });

  it("rejects an email without @ symbol", () => {
    expect(isValidEmail("invalidemail.com")).toBe(false);
  });

  it("accepts a password of 6 or more characters", () => {
    expect(isStrongPassword("secure1")).toBe(true);
  });

  it("rejects a password shorter than 6 characters", () => {
    expect(isStrongPassword("abc")).toBe(false);
  });
});

// ── Break-even Calculation (Finance Logic) ────────────────────────────────────

describe("Break-even Calculation", () => {
  const calculateBreakeven = (initialInvestment, monthlyRevenue, monthlyExpenses) => {
    const monthlyProfit = monthlyRevenue - monthlyExpenses;
    if (monthlyProfit <= 0) return null;
    return Math.ceil(initialInvestment / monthlyProfit);
  };

  it("calculates break-even months correctly", () => {
    expect(calculateBreakeven(100000, 20000, 10000)).toBe(10);
  });

  it("returns null when monthly expenses exceed revenue", () => {
    expect(calculateBreakeven(100000, 5000, 10000)).toBeNull();
  });

  it("handles zero expenses (full revenue goes to profit)", () => {
    expect(calculateBreakeven(50000, 10000, 0)).toBe(5);
  });
});

// ── Role-Based Access Control ─────────────────────────────────────────────────

describe("Role-Based Access Control", () => {
  const ROLES = { USER: "user", MENTOR: "mentor", ADMIN: "admin" };

  const hasPermission = (role, resource) => {
    const permissions = {
      admin: ["create", "read", "update", "delete", "manage_users"],
      mentor: ["read", "review_submissions", "respond_requests"],
      user: ["read", "create_submission", "create_request"],
    };
    return (permissions[role] || []).includes(resource);
  };

  it("grants admin full CRUD permissions", () => {
    expect(hasPermission(ROLES.ADMIN, "delete")).toBe(true);
    expect(hasPermission(ROLES.ADMIN, "manage_users")).toBe(true);
  });

  it("allows mentor to review submissions", () => {
    expect(hasPermission(ROLES.MENTOR, "review_submissions")).toBe(true);
  });

  it("prevents user from managing other users", () => {
    expect(hasPermission(ROLES.USER, "manage_users")).toBe(false);
  });

  it("allows user to create a submission", () => {
    expect(hasPermission(ROLES.USER, "create_submission")).toBe(true);
  });
});
