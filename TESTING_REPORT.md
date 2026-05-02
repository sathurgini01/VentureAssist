# Testing Instruction Report – VentureAssist

**SE3040 – Application Frameworks**
**BSc (Hons) in Information Technology Specialized in Software Engineering – Year 03**

---

## 1. Testing Overview

VentureAssist is tested at three levels to ensure correctness, reliability, and performance:

| Level | Tool | Scope |
|---|---|---|
| Unit Testing | Jest 30 + `@jest/globals` | Individual functions / logic in isolation |
| Integration Testing | Jest + Supertest | API routes → Controllers → MongoDB |
| Performance Testing | Artillery.io | API throughput, latency, and stability under load |

---

## 2. Testing Environment Configuration

### 2.1 Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| Node.js | v18+ | JavaScript runtime |
| npm | v9+ | Package manager |
| MongoDB | Local (v6) or Atlas | Database for integration tests |
| Artillery | v2+ | Performance / load testing |
| Postman | Any | Manual API testing (optional) |

### 2.2 Install Dependencies

```bash
# From the project root
cd server
npm install
```

This installs both production dependencies and the dev dependencies:

```
jest              – Test runner
@jest/globals     – ESM-compatible Jest globals (describe, it, expect …)
supertest         – HTTP assertion library for integration tests
nodemon           – Dev server auto-reload
```

### 2.3 Environment File for Tests

Create `server/.env.test` (used by integration tests to avoid touching the production database):

```env
TEST_MONGO_URI=mongodb://127.0.0.1:27017/ventureassist_test
JWT_SECRET=test_secret_key_for_tests
PORT=5001
NODE_ENV=test
```

> If MongoDB is not installed locally, set `TEST_MONGO_URI` to an Atlas URI that points to a **separate test cluster/database**.

### 2.4 Test File Structure

```
server/
├── src/
│   └── __tests__/
│       ├── unit/
│       │   └── auth.test.js          ← Unit tests (no DB required)
│       └── integration/
│           └── api.test.js           ← Integration tests (DB required)
├── artillery.yml                     ← Performance test scenario
└── jest.config.cjs                   ← Jest configuration
```

---

## 3. Unit Testing

### 3.1 Objective

Validate individual functions and business logic **in complete isolation** from the database or network. Each test exercises a single unit of behaviour.

### 3.2 What Is Tested

| Test Suite | Functions Covered | # Tests |
|---|---|---|
| JWT Token Generation | `jwt.sign`, `jwt.verify` | 3 |
| Password Hashing | `bcrypt.hash`, `bcrypt.compare` | 3 |
| Input Validation | Email regex, password length check | 4 |
| Break-even Calculation | Finance profit / investment maths | 3 |
| Role-Based Access Control | Permission mapping per role | 4 |
| **Total** | | **17** |

### 3.3 How to Run Unit Tests

**Step 1 – Navigate to the server directory**

```bash
cd server
```

**Step 2 – Run only unit tests**

```bash
npm run test:unit
```

This executes:

```bash
NODE_OPTIONS=--experimental-vm-modules jest --config jest.config.cjs src/__tests__/unit
```

**Step 3 – Expected output**

```
PASS  src/__tests__/unit/auth.test.js
  JWT Token Generation
    ✓ generates a valid token containing the user id (12 ms)
    ✓ throws an error when verifying with a wrong secret (2 ms)
    ✓ throws an error for an expired token (11 ms)
  Password Hashing
    ✓ hashes a password so it does not equal the plaintext (62 ms)
    ✓ correctly compares the correct password against the hash (6 ms)
    ✓ rejects an incorrect password (6 ms)
  Input Validation
    ✓ accepts a valid email address (1 ms)
    ✓ rejects an email without @ symbol (0 ms)
    ✓ accepts a password of 6 or more characters (0 ms)
    ✓ rejects a password shorter than 6 characters (0 ms)
  Break-even Calculation
    ✓ calculates break-even months correctly (0 ms)
    ✓ returns null when monthly expenses exceed revenue (0 ms)
    ✓ handles zero expenses (full revenue goes to profit) (0 ms)
  Role-Based Access Control
    ✓ grants admin full CRUD permissions (0 ms)
    ✓ allows mentor to review submissions (0 ms)
    ✓ prevents user from managing other users (0 ms)
    ✓ allows user to create a submission (0 ms)

Tests:       17 passed, 17 total
Time:        0.361 s
```

### 3.4 Run All Tests (Unit + Integration)

```bash
npm test
```

---

## 4. Integration Testing

### 4.1 Objective

Verify that the complete request path works end-to-end: **HTTP request → Express route → Controller → Service → MongoDB → HTTP response**. This confirms that components interact correctly and catches errors that unit tests cannot detect (e.g. schema mismatches, middleware chains, DB query failures).

### 4.2 What Is Tested

| Module | Endpoints Tested | Scenarios |
|---|---|---|
| Health Check | `GET /` | Status 200, body text |
| Auth – Register | `POST /api/auth/register` | Success (201), duplicate email (400), role forced to `user` |
| Auth – Login | `POST /api/auth/login` | Valid (200), wrong password (401), unknown email (401) |
| Business – Ideas | `POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id` | Full CRUD; correct fields: `title` + `problem` |
| Business – SWOT | `POST /ideas/:id/swot/generate`, `GET /ideas/:id/swot` | Generate and retrieve SWOT |
| Business – Tracker | `GET /trackers?ideaId=` | Progress tracker auto-created with idea |
| Finance – Profile | `POST /api/finance`, `GET /api/finance`, `GET /:id` | Create with `startupName` + `initialCapital` |
| Finance – Expenses | `POST /expenses`, `GET /expenses/:profileId` | Add expense, list by profile |
| Finance – Revenue | `POST /revenue`, `GET /revenue/:profileId` | Add revenue, list by profile |
| Finance – Breakeven | `GET /breakeven/:id` | Returns `{ breakEvenMonths }` |
| Marketing – Campaigns | `POST`, `GET`, `GET /:id`, `PUT /:id`, `DELETE /:id` | Full CRUD; `title` field; create returns `{campaign:{…}}`, list returns `{items:[…]}` |
| Marketing – Articles | `GET /api/marketing/articles` | Returns article list |
| Legal – Tasks | `GET /api/legal/tasks` | Returns `{ tasks: [...] }` (not plain array); 401 without token |
| Legal – Submissions | `GET /api/legal/submissions/me` | Returns `{ submissions: [...] }` |
| Legal – Progress | `GET /api/legal/progress/me` | User progress summary |
| Legal – Mentors | `GET /api/legal/mentors` | Legal mentor list |
| Legal – Toolkits | `GET /api/legal/toolkits` | Legal toolkit list |

### 4.3 Integration Testing Setup

**Step 1 – Start a local MongoDB instance**

```bash
# Option A: Local MongoDB
mongod --dbpath /data/db

# Option B: Use MongoDB Atlas test cluster (set TEST_MONGO_URI in .env.test)
```

**Step 2 – Create the test environment file**

```bash
# server/.env.test
TEST_MONGO_URI=mongodb://127.0.0.1:27017/ventureassist_test
JWT_SECRET=test_secret_key_for_tests
PORT=5001
NODE_ENV=test
```

### 4.4 Integration Testing Execution

```bash
cd server
npm run test:integration
```

This executes:

```bash
NODE_OPTIONS=--experimental-vm-modules jest --config jest.config.cjs src/__tests__/integration
```

**What happens automatically:**
1. Jest connects to `ventureassist_test` database (isolated from production)
2. Runs all API scenarios using Supertest (no browser or manual steps required)
3. Drops the test database after all tests complete (clean state every run)

### 4.5 Expected Output

```
PASS  src/__tests__/integration/api.test.js
  GET / – Health Check
    ✓ returns 200 with backend confirmation message
  Authentication – Register
    ✓ registers a new user and returns a JWT token with role=user
    ✓ returns 400 for duplicate email
  Authentication – Login
    ✓ returns 200 and a token for valid credentials
    ✓ returns 401 for wrong password
    ✓ returns 401 for non-existent email
  Business Module – Ideas CRUD
    ✓ POST /api/business/ideas – creates an idea with correct fields
    ✓ GET /api/business/ideas – returns array of ideas
    ✓ GET /api/business/ideas/:id – returns a single idea by id
    ✓ PUT /api/business/ideas/:id – updates an existing idea
    ✓ POST /api/business/ideas/:id/swot/generate – generates SWOT analysis
    ✓ GET /api/business/ideas/:id/swot – retrieves SWOT analysis
    ✓ GET /api/business/trackers?ideaId=... – returns progress tracker
    ✓ DELETE /api/business/ideas/:id – deletes the idea
  Finance Module – Profile, Expenses & Revenue
    ✓ POST /api/finance – creates a finance profile (correct field: initialCapital)
    ✓ GET /api/finance – returns all finance profiles for the user
    ✓ GET /api/finance/:id – returns a single finance profile
    ✓ POST /api/finance/expenses – adds an expense and links to profile
    ✓ GET /api/finance/expenses/:profileId – returns expenses for profile
    ✓ POST /api/finance/revenue – adds a revenue entry
    ✓ GET /api/finance/revenue/:profileId – returns revenue for profile
    ✓ GET /api/finance/breakeven/:id – returns break-even calculation
    ✓ returns 401 when accessing finance without token
  Marketing Module – Campaigns
    ✓ POST /api/marketing/campaigns – creates a campaign with title
    ✓ GET /api/marketing/campaigns – returns campaigns owned by user
    ✓ GET /api/marketing/campaigns/:id – returns a single campaign
    ✓ PUT /api/marketing/campaigns/:id – updates a campaign
    ✓ GET /api/marketing/articles – returns public articles
    ✓ returns 401 when accessing campaigns without token
    ✓ DELETE /api/marketing/campaigns/:id – deletes campaign
  Legal Module – Tasks, Submissions & Help Requests
    ✓ GET /api/legal/tasks – returns { tasks: [...] } for authenticated user
    ✓ GET /api/legal/tasks – returns 401 without token
    ✓ GET /api/legal/submissions/me – returns user's submissions
    ✓ GET /api/legal/progress/me – returns legal task progress
    ✓ GET /api/legal/mentors – returns legal mentor list
    ✓ GET /api/legal/toolkits – returns legal toolkits

Tests:       36 passed, 36 total
```

---

## 5. Performance Testing

### 5.1 Objective

Evaluate the API's behaviour under realistic concurrent load. Measures:

- **Throughput** – requests handled per second
- **Latency** – median and 95th-percentile response times
- **Error rate** – percentage of failed requests under stress

### 5.2 Tool – Artillery.io

Artillery is an open-source, Node.js-based load testing framework recommended by the assignment specification for Express.js applications.

```bash
# Install Artillery globally
npm install -g artillery
```

### 5.3 Test Scenarios (artillery.yml)

The performance test file is at `server/artillery.yml` and covers five weighted scenarios:

| Scenario | Weight | Flow |
|---|---|---|
| Health Check | 10% | `GET /` |
| Auth Flow | 20% | Register → Login |
| Business Ideas | 25% | Register → Create idea → List ideas |
| Legal Tasks | 20% | Register → Get legal tasks |
| Marketing Campaigns | 25% | Register → Create campaign → List campaigns |

**Load Phases:**

| Phase | Duration | Virtual Users/sec | Goal |
|---|---|---|---|
| Warm-up | 30 s | 5 → 20 (ramp) | Gradual startup |
| Sustained Load | 60 s | 20 (steady) | Normal peak traffic |
| Stress Test | 30 s | 50 (spike) | Identify breaking point |

### 5.4 Performance Testing Setup

**Step 1 – Start the backend server locally**

```bash
cd server
npm run dev
```

Confirm it is running at `http://localhost:5000`.

**Step 2 – Install Artillery globally**

```bash
npm install -g artillery
```

**Step 3 – Verify Artillery installation**

```bash
artillery version
# Should output: 2.x.x
```

### 5.5 Performance Testing Execution

**Run the full performance test:**

```bash
cd server
npm run test:performance
```

This executes:

```bash
artillery run artillery.yml
```

**Run with an HTML report:**

```bash
npm run test:performance:report
# Generates artillery-report.json then opens an HTML report
```

**Run a quick smoke test (10 seconds, 5 users/sec):**

```bash
artillery quick --count 10 --num 5 http://localhost:5000/
```

### 5.6 Expected Output

```
Phase 1 (Warm-up):        30s  5–20 req/s
Phase 2 (Sustained Load): 60s  20 req/s
Phase 3 (Stress Test):    30s  50 req/s

Summary report:
  Scenarios launched:    2500
  Scenarios completed:   2498
  Requests completed:    7240
  Mean response/sec:     59.8
  Response time (msec):
    min: 12
    max: 892
    median: 45
    95th: 210
    99th: 380
  Codes:
    200: 6850
    201: 382
    400: 8 (expected duplicates)
  Errors: 0
```

### 5.7 Acceptance Criteria

| Metric | Target | Pass/Fail |
|---|---|---|
| Error rate | < 1% | Pass |
| 95th percentile response time | < 500 ms | Pass |
| Median response time | < 100 ms | Pass |
| Throughput | > 20 req/s | Pass |

---

## 6. Manual API Testing with Postman

For exploratory or scenario-based testing, use Postman:

### 6.1 Setup

1. Download Postman from [postman.com](https://www.postman.com/downloads/)
2. Set the base URL as an environment variable:
   - **Local:** `http://localhost:5000`
   - **Production:** `https://ventureassist.onrender.com`

### 6.2 Authentication Flow

```http
POST {{base_url}}/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

Save the returned `token` as the `authToken` environment variable. All subsequent protected requests use:

```
Authorization: Bearer {{authToken}}
```

### 6.3 Complete Test Sequence

```
1. Register User      → POST /api/auth/register
2. Login              → POST /api/auth/login           (save token)
3. Create Idea        → POST /api/business/ideas
4. Generate SWOT      → POST /api/business/ideas/:id/swot/generate
5. Create Finance     → POST /api/finance
6. Add Expense        → POST /api/finance/expenses
7. Add Revenue        → POST /api/finance/revenue
8. Break-even Calc    → GET  /api/finance/breakeven/:id
9. Create Campaign    → POST /api/marketing/campaigns
10. Analyze Campaign  → POST /api/ai/marketing-campaigns/:id/analyze
11. Get Legal Tasks   → GET  /api/legal/tasks
12. Submit Evidence   → POST /api/legal/tasks/:taskId/submissions
13. Request Mentor    → POST /api/legal/help-requests
14. AI Legal Guidance → POST /api/legal/ai/compliance
```

---

## 7. Test Coverage Summary

| Test Type | Tool | Tests | Status |
|---|---|---|---|
| Unit Tests | Jest | 17 | All Pass |
| Integration Tests | Jest + Supertest | 36 | All Pass |
| Performance Tests | Artillery | 5 scenarios, 3 phases | Pass (< 1% error rate) |
| Manual API Tests | Postman | All 40+ endpoints | Verified |

### Module Coverage

| Module | Unit | Integration | Notes |
|---|---|---|---|
| Authentication | JWT tests, password tests, validation tests | Register (201/400), Login (200/401) | Role forced to `user` on register |
| Business | Break-even calc, RBAC | Full CRUD ideas, SWOT, tracker | Routes are open (no auth required) |
| Finance | Break-even calc | Profile, expenses, revenue, break-even API, 401 check | Uses `initialCapital` (not `initialInvestment`) |
| Marketing | Input validation, RBAC | Campaign CRUD, articles, 401 check | `title` field; create → `{campaign}`, list → `{items}`, update → `{campaign}` |
| Legal | RBAC | Tasks `{tasks:[]}`, submissions, progress, mentors, toolkits, 401 check | Response wrapped in object |

---

## 8. Quick Reference Commands

```bash
# Run all automated tests
cd server && npm test

# Unit tests only (no DB needed)
npm run test:unit

# Integration tests only (local MongoDB required)
npm run test:integration

# Performance test (server must be running on port 5000)
npm run test:performance

# Performance test with HTML report
npm run test:performance:report
```

---

*Tested on: Node.js v18, MongoDB Atlas, Express.js v5*
*Testing frameworks: Jest v30, Supertest v7, Artillery v2*
