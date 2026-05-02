/**
 * Integration Tests – REST API Endpoints
 * Tests route → controller → service → database flow using Supertest.
 * Requires a running MongoDB instance (local or Atlas URI via .env.test).
 *
 * Correct fields verified against actual Mongoose models:
 *   ideaModel.js         → required: title, problem
 *   FinanceProfile.js    → required: startupName, initialCapital
 *   CampaignMarketing.js → required: title (owner set from req.user)
 *   LegalTask response   → { tasks: [...] } (not a plain array)
 */

import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const TEST_DB_URI =
  process.env.TEST_MONGO_URI ||
  "mongodb://127.0.0.1:27017/ventureassist_test";

let app;

beforeAll(async () => {
  const mod = await import("../../app.js");
  app = mod.default;
  await mongoose.connect(TEST_DB_URI);
});

afterAll(async () => {
  if (mongoose.connection.db) {
    await mongoose.connection.db.dropDatabase();
  }
  await mongoose.disconnect();
});

// ── Helper: register a user and return their token ────────────────────────────
async function registerAndLogin(prefix) {
  const email = `${prefix}_${Date.now()}@ventureassist.test`;
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: `${prefix} User`, email, password: "testpass123" });
  return res.body.token;
}

// ── Health Check ──────────────────────────────────────────────────────────────

describe("GET / – Health Check", () => {
  it("returns 200 with backend confirmation message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("VentureAssist Backend Running");
  });
});

// ── Authentication Module ─────────────────────────────────────────────────────

describe("Authentication – Register", () => {
  const user = {
    name: "Reg Test",
    email: `reg_${Date.now()}@ventureassist.test`,
    password: "regpass123",
  };

  it("registers a new user and returns a JWT token with role=user", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.role).toBe("user");
    expect(res.body.user.email).toBe(user.email);
  });

  it("returns 400 for duplicate email", async () => {
    const res = await request(app).post("/api/auth/register").send(user);
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });
});

describe("Authentication – Login", () => {
  const creds = {
    email: `login_${Date.now()}@ventureassist.test`,
    password: "loginpass123",
  };

  beforeAll(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ name: "Login User", ...creds });
  });

  it("returns 200 and a token for valid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send(creds);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("returns 401 for wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: creds.email, password: "wrongpass" });
    expect(res.status).toBe(401);
    expect(res.body.message).toMatch(/invalid/i);
  });

  it("returns 401 for non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@test.com", password: "pass" });
    expect(res.status).toBe(401);
  });
});

// ── Business Module ───────────────────────────────────────────────────────────
// Routes are open (no auth middleware on business.routes.js)
// ideaModel requires: title (String), problem (String)

describe("Business Module – Ideas CRUD", () => {
  let createdIdeaId;

  it("POST /api/business/ideas – creates an idea with correct fields", async () => {
    const res = await request(app)
      .post("/api/business/ideas")
      .send({
        title: "EcoDelivery App",
        problem: "Carbon-heavy last-mile delivery",
        solution: "Electric bike courier network",
        targetCustomer: "Urban shoppers aged 20–35",
        revenueModel: "Subscription + per-delivery fee",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.title).toBe("EcoDelivery App");
    createdIdeaId = res.body._id;
  });

  it("GET /api/business/ideas – returns array of ideas", async () => {
    const res = await request(app).get("/api/business/ideas");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /api/business/ideas/:id – returns a single idea by id", async () => {
    const res = await request(app).get(`/api/business/ideas/${createdIdeaId}`);
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(createdIdeaId);
    expect(res.body.title).toBe("EcoDelivery App");
  });

  it("PUT /api/business/ideas/:id – updates an existing idea", async () => {
    const res = await request(app)
      .put(`/api/business/ideas/${createdIdeaId}`)
      .send({ title: "EcoDelivery App v2" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("EcoDelivery App v2");
  });

  it("POST /api/business/ideas/:id/swot/generate – generates SWOT analysis", async () => {
    const res = await request(app).post(
      `/api/business/ideas/${createdIdeaId}/swot/generate`
    );
    expect([200, 201]).toContain(res.status);
  });

  it("GET /api/business/ideas/:id/swot – retrieves SWOT analysis", async () => {
    const res = await request(app).get(
      `/api/business/ideas/${createdIdeaId}/swot`
    );
    expect([200, 404]).toContain(res.status);
  });

  it("GET /api/business/trackers?ideaId=... – returns progress tracker", async () => {
    const res = await request(app).get(
      `/api/business/trackers?ideaId=${createdIdeaId}`
    );
    expect([200, 404]).toContain(res.status);
  });

  it("DELETE /api/business/ideas/:id – deletes the idea", async () => {
    const res = await request(app).delete(
      `/api/business/ideas/${createdIdeaId}`
    );
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});

// ── Finance Module ────────────────────────────────────────────────────────────
// Routes use protectMarketing middleware
// FinanceProfile requires: startupName (String), initialCapital (Number)

describe("Finance Module – Profile, Expenses & Revenue", () => {
  let token;
  let profileId;
  let expenseId;
  let revenueId;

  beforeAll(async () => {
    token = await registerAndLogin("finance");
  });

  it("POST /api/finance – creates a finance profile (correct field: initialCapital)", async () => {
    const res = await request(app)
      .post("/api/finance")
      .set("Authorization", `Bearer ${token}`)
      .send({
        startupName: "TestStartup LK",
        initialCapital: 500000,
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.startupName).toBe("TestStartup LK");
    profileId = res.body._id;
  });

  it("GET /api/finance – returns all finance profiles for the user", async () => {
    const res = await request(app)
      .get("/api/finance")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("GET /api/finance/:id – returns a single finance profile", async () => {
    const res = await request(app)
      .get(`/api/finance/${profileId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(profileId);
  });

  it("POST /api/finance/expenses – adds an expense and links to profile", async () => {
    const res = await request(app)
      .post("/api/finance/expenses")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profileId,
        category: "Marketing",
        amount: 15000,
        description: "Social media ads",
      });

    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty("_id");
    expenseId = res.body._id;
  });

  it("GET /api/finance/expenses/:profileId – returns expenses for profile", async () => {
    const res = await request(app)
      .get(`/api/finance/expenses/${profileId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/finance/revenue – adds a revenue entry", async () => {
    const res = await request(app)
      .post("/api/finance/revenue")
      .set("Authorization", `Bearer ${token}`)
      .send({
        profileId,
        amount: 80000,
        description: "Product sales",
      });

    expect([200, 201]).toContain(res.status);
    revenueId = res.body._id;
  });

  it("GET /api/finance/revenue/:profileId – returns revenue for profile", async () => {
    const res = await request(app)
      .get(`/api/finance/revenue/${profileId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/finance/breakeven/:id – returns break-even calculation", async () => {
    const res = await request(app).get(
      `/api/finance/breakeven/${profileId}`
    );
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("breakEvenMonths");
  });

  it("returns 401 when accessing finance without token", async () => {
    const res = await request(app).get("/api/finance");
    expect(res.status).toBe(401);
  });
});

// ── Marketing Module ──────────────────────────────────────────────────────────
// Routes use protectMarketing middleware
// CampaignMarketing requires: title (String) — owner is set from req.user._id

describe("Marketing Module – Campaigns", () => {
  let token;
  let campaignId;

  beforeAll(async () => {
    token = await registerAndLogin("marketing");
  });

  it("POST /api/marketing/campaigns – creates a campaign with title", async () => {
    const res = await request(app)
      .post("/api/marketing/campaigns")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Summer Launch 2026" });

    // Response: { message: "Campaign created", campaign: { _id, title, ... } }
    expect(res.status).toBe(201);
    expect(res.body.campaign).toHaveProperty("_id");
    expect(res.body.campaign.title).toBe("Summer Launch 2026");
    campaignId = res.body.campaign._id;
  });

  it("GET /api/marketing/campaigns – returns { items: [...] } for user", async () => {
    const res = await request(app)
      .get("/api/marketing/campaigns")
      .set("Authorization", `Bearer ${token}`);

    // Response: { items: [...] }
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it("GET /api/marketing/campaigns/:id – returns a single campaign object", async () => {
    const res = await request(app)
      .get(`/api/marketing/campaigns/${campaignId}`)
      .set("Authorization", `Bearer ${token}`);

    // Response: campaign object directly
    expect(res.status).toBe(200);
    expect(res.body._id).toBe(campaignId);
  });

  it("PUT /api/marketing/campaigns/:id – updates a campaign", async () => {
    const res = await request(app)
      .put(`/api/marketing/campaigns/${campaignId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "running" });

    // Response: { message: "Campaign updated", campaign: { ... } }
    expect(res.status).toBe(200);
    expect(res.body.campaign.status).toBe("running");
  });

  it("GET /api/marketing/articles – returns public articles", async () => {
    const res = await request(app).get("/api/marketing/articles");
    expect([200, 404]).toContain(res.status);
  });

  it("returns 401 when accessing campaigns without token", async () => {
    const res = await request(app).get("/api/marketing/campaigns");
    expect(res.status).toBe(401);
  });

  it("DELETE /api/marketing/campaigns/:id – deletes campaign", async () => {
    const res = await request(app)
      .delete(`/api/marketing/campaigns/${campaignId}`)
      .set("Authorization", `Bearer ${token}`);

    // Response: { message: "Campaign deleted" }
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});

// ── Legal Module ──────────────────────────────────────────────────────────────
// Routes use protectMarketing middleware
// getTasks returns { tasks: [...] } — NOT a plain array

describe("Legal Module – Tasks, Submissions & Help Requests", () => {
  let token;

  beforeAll(async () => {
    token = await registerAndLogin("legal");
  });

  it("GET /api/legal/tasks – returns { tasks: [...] } for authenticated user", async () => {
    const res = await request(app)
      .get("/api/legal/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("tasks");
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });

  it("GET /api/legal/tasks – returns 401 without token", async () => {
    const res = await request(app).get("/api/legal/tasks");
    expect(res.status).toBe(401);
  });

  it("GET /api/legal/submissions/me – returns user's submissions", async () => {
    const res = await request(app)
      .get("/api/legal/submissions/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("submissions");
    expect(Array.isArray(res.body.submissions)).toBe(true);
  });

  it("GET /api/legal/progress/me – returns legal task progress", async () => {
    const res = await request(app)
      .get("/api/legal/progress/me")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.status);
  });

  it("GET /api/legal/mentors – returns legal mentor list", async () => {
    const res = await request(app)
      .get("/api/legal/mentors")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.status);
  });

  it("GET /api/legal/toolkits – returns legal toolkits", async () => {
    const res = await request(app)
      .get("/api/legal/toolkits")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.status);
  });
});
