# 🚀 VentureAssist 

> that support young entrepreneurs with startup toolkits.

---

## 📌 Project Overview

VentureAssist is a full-stack web-based platform designed to support students in managing and developing their ideas across multiple domains including Business, Finance, and Legal services. The system provides a centralized dashboard for Users, Mentors, and Admins to collaborate efficiently.

The Legal Support Module enables users to manage legal-related tasks, upload evidence, request mentor assistance, and receive AI-powered legal compliance guidance. The platform ensures secure and structured interaction through role-based access control.

---

## 🌟 Features

### Core Features/Marketing Module
- ✅ User Authentication – Secure JWT-based login and registration with role-based access (User, Mentor, Admin)
- 📊 Role-Based Dashboards – Separate dashboards for Users, Mentors, and Admins with tailored functionalities
- 🧩 Multi-Module Platform – Integrated system supporting Business, Finance, Marketing, and Legal domains
- 🔄 Workflow-Based System – Structured step-by-step startup support process
- 🔐 Secure Data Handling – Protected API endpoints with validation and authentication middleware

### Business Module
- 🚀 Idea Creation & Management – Users can create and manage startup ideas
- 📌 Workflow Tracking – Track progress from idea to execution
- 🧑‍🏫 Mentor Feedback System – Receive expert feedback on business ideas
- 📈 Idea Validation Support – Evaluate feasibility and improvement suggestions

### Finance Module
- 💵 Budget Planning – Create and manage startup budgets
- 📊 Cost Estimation – Estimate operational and startup costs
- 📉 Financial Tracking – Monitor expenses and financial progress
- 📁 Financial Data Management – Store and retrieve financial records securely

### Marketing Module
- 📣 Campaign Planning – Create marketing campaigns for startup promotion
- 🎯 Strategy Development – Guidance for marketing strategies
- 🌐 Digital Marketing Support – Tools and suggestions for online promotion
- 📊 Marketing Workflow Management – Track marketing activities and progress

### Legal Support Module
- 📄 Legal Task Management – Manage legal requirements and compliance tasks
- 🧰 Legal Toolkit – Access structured legal guides and resources
- 📎 Evidence Upload System – Upload legal documents securely
- 📨 Mentor Help Requests – Request assistance from legal mentors
- 🧑‍⚖️ Mentor Review Workflow – Mentors review and respond to legal issues
- 🤖 AI Legal Assistant – Generate legal guidance using Mock AI
- 🔒 Secure Document Handling – Safe storage of sensitive legal information

### Advanced Feature
- 🔄 End-to-End Workflow System – Complete flow from task creation to mentor response
- 📈 Admin Monitoring Dashboard – Manage users, mentors, and system operations
- 👥 Mentor Management – Assign and track mentor responses
- 🔐 Role-Based Access Control (RBAC) – Granular permission control for each role
- 🛡️ Security Implementation – JWT authentication, input validation, and protected routes
- 📁 File Upload Handling – Secure document upload using Multer
- 🤖 AI Integration – Smart assistance using OpenAI / Gemini APIs
- 📊 System Scalability – Modular architecture supporting future expansion
- 📝 Structured API Design – Clean REST API with controller-service architecture

---

## 🛠️ Tech Stack

| Category              | Technologies                                            |
| --------------------- | ------------------------------------------------------- |
| **Frontend**          | React.js, React Router, Context API, CSS                |
| **Runtime**           | Node.js (v18+)                                          |
| **Framework**         | Express.js                                              |
| **Database**          | MongoDB with Mongoose ODM                               |
| **Authentication**    | JWT (JSON Web Tokens)                                   |
| **API Architecture**  | RESTful APIs (Controller–Service Pattern)               |
| **AI Integration**    | OpenAI API / Gemini API                                 |
| **File Upload**       | Multer                                                  |
| **State Management**  | React Context API                                       |
| **Routing**           | React Router DOM                                        |
| **Security**          | JWT Auth Middleware, Input Validation, CORS             |
| **Development Tools** | VS Code, Postman, Git & GitHub                          |
| **Deployment**        | Vercel / Netlify (Frontend), Render / Railway (Backend) |
| **Database Hosting**  | MongoDB Atlas                                           |

### Integrations
- OpenAI / Gemini API (AI legal assistance)
- Multer (File upload handling)

---

## 📁 Project Structure


```
VentureAssist/
│
├── client/
│   └── src/
│       ├── pages/
│       │   ├── Auth/
│       │   ├── Dashboard/
│       │   ├── Business/
│       │   ├── Finance/
│       │   ├── Legal/
│       │   │   ├── CreateTask
│       │   │   ├── UploadEvidence
│       │   │   ├── RequestMentor
│       │   │   └── LegalDashboard
│       │   ├── Mentor/
│       │   └── Admin/
│       │
│       ├── components/
│       ├── context/
│       ├── routes/
│       └── services/
│
├── server/
│   └── src/
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── legalController.js
│       │   ├── businessController.js
│       │   └── financeController.js
│       │
│       ├── routes/
│       ├── models/
│       ├── services/
│       ├── middleware/
│       └── config/
│
└── README.md
```
## 🚀 Getting Started

### 📋 Prerequisites

Before running this project, make sure you have the following installed:

* **Node.js** v16 or higher  
  👉 https://nodejs.org/

* **MongoDB** (Local or MongoDB Atlas cloud)  
  👉 https://www.mongodb.com/

* **Git** (for cloning repository)  
  👉 https://git-scm.com/

* **Postman** (for API testing)  
  👉 https://www.postman.com/downloads/

* **Code Editor (Recommended: VS Code)**  
  👉 https://code.visualstudio.com/

---

### ⚙️ Installation

#### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd VentureAssist
```

---

#### 2️⃣ Install Dependencies

**Backend Setup**

```bash
cd server
npm install
```

**Frontend Setup**

```bash
cd ../client
npm install
```

---

#### 3️⃣ Configure Environment Variables

Create a `.env` file inside the **server** folder:

```env
# Server Configuration
PORT=5050
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT Authentication
JWT_SECRET=your_secret_key

# AI Integration
OPENAI_API_KEY=your_openai_api_key
GEMINI_API_KEY=your_gemini_api_key
```

---

Create a `.env` file inside the **client** folder:

```env
VITE_API_BASE_URL=http://localhost:5050
```

---

#### 4️⃣ Start MongoDB

```bash
# If using local MongoDB
mongod
```

👉 If using MongoDB Atlas → no need to run this step

---

#### 5️⃣ Run the Application

**Start Backend**

```bash
cd server
npm run dev
```

**Start Frontend**

```bash
cd client
npm run dev
```

---

#### 6️⃣ Verify Application

Frontend:  
👉 http://localhost:5173  

Backend API:  
👉 http://localhost:5050  

---

### 🧪 Quick Test

* Register a user  
* Login using credentials  
* Access dashboard  

Test modules:

* Business  
* Finance  
* Marketing  
* Legal  
---


## 📚 API Endpoints

### Base URL

```id="api-base"
http://localhost:5050/api
```

---

## 🔐 Authentication Endpoints

These endpoints handle user registration and login. In your code, the marketing auth router is also mounted on the common auth path, so both auth styles exist.

### Available Base Paths

* `/api/auth`
* `/api/marketing/auth`

### Endpoints

#### Register User

```http id="auth-register"
POST /api/auth/register
POST /api/marketing/auth/register
Content-Type: application/json
```

**What it does:**
Registers a new user account. The backend forces the role to `user` during registration.

**Request Body**

```json id="auth-register-body"
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

---

#### Login User

```http id="auth-login"
POST /api/auth/login
POST /api/marketing/auth/login
Content-Type: application/json
```

**What it does:**
Authenticates a user and returns a JWT token.

**Request Body**

```json id="auth-login-body"
{
  "email": "john@example.com",
  "password": "password123"
}
```

---

## 💡 Business Idea Module Endpoints

These endpoints manage startup ideas, SWOT generation, business toolkits, mentor requests, and progress trackers.

### Business Home Summary

```http id="biz-home"
GET /api/business/home
```

**What it does:**
Returns a summary dashboard for the business idea module, including idea counts, SWOT count, top toolkits, mentors, and tracker data.

---

### Idea Management

#### Create Idea

```http id="biz-create-idea"
POST /api/business/ideas
```

**What it does:**
Creates a new business idea. A default tracker is automatically created for the idea.

---

#### Get All Ideas

```http id="biz-get-ideas"
GET /api/business/ideas
```

**What it does:**
Returns all business ideas, sorted by newest first.

---

#### Get Single Idea

```http id="biz-get-idea"
GET /api/business/ideas/:id
```

**What it does:**
Returns a single business idea by ID.

---

#### Update Idea

```http id="biz-update-idea"
PUT /api/business/ideas/:id
```

**What it does:**
Updates an existing business idea.

---

#### Delete Idea

```http id="biz-delete-idea"
DELETE /api/business/ideas/:id
```

**What it does:**
Deletes a business idea and its related progress tracker.

---

### SWOT Analysis

#### Generate SWOT

```http id="biz-generate-swot"
POST /api/business/ideas/:id/swot/generate
```

**What it does:**
Generates SWOT analysis for a business idea.

---

#### Get SWOT

```http id="biz-get-swot"
GET /api/business/ideas/:id/swot
```

**What it does:**
Returns the SWOT analysis for a given idea.

---

### Business Toolkits

#### Get All Toolkits

```http id="biz-get-toolkits"
GET /api/business/toolkits
```

**What it does:**
Returns business toolkits. Supports filtering in the controller.

---

#### Get Toolkit by ID

```http id="biz-get-toolkit"
GET /api/business/toolkits/:toolkitId
```

**What it does:**
Returns a specific business toolkit.

---

### Business Mentors

#### Get Mentors

```http id="biz-get-mentors"
GET /api/business/mentors
```

**What it does:**
Returns available business mentors. Supports search and expertise filtering.

---

### Business Mentor Requests

#### Create Mentor Request

```http id="biz-create-mentor-request"
POST /api/business/mentor-requests
```

**What it does:**
Creates a mentor request for a business idea.

---

#### Get Mentor Requests

```http id="biz-get-mentor-requests"
GET /api/business/mentor-requests
```

**What it does:**
Returns mentor requests. Supports optional filters such as mentorId, ideaId, and status.

---

#### Update Mentor Request Status

```http id="biz-update-mentor-request"
PUT /api/business/mentor-requests/:id
```

**What it does:**
Updates request status such as `Pending`, `Accepted`, or `Rejected`.

---

### Progress Tracker

#### Initialize Tracker

```http id="biz-init-tracker"
POST /api/business/trackers/init/:ideaId
```

**What it does:**
Creates a tracker for a business idea if one does not already exist.

---

#### Get Tracker by Idea

```http id="biz-get-tracker"
GET /api/business/trackers?ideaId=<ideaId>
```

**What it does:**
Returns the tracker and progress percentage for a given idea.

---

#### Update Tracker Item

```http id="biz-update-tracker-item"
PUT /api/business/trackers/:trackerId/items/:itemId
```

**What it does:**
Updates a tracker checklist item, including completion state and notes.

---

## 💰 Finance Module Endpoints

These endpoints support finance profile management, break-even calculation, exchange rates, financial intelligence, expenses, and revenue.

### Finance Profile

#### Create Finance Profile

```http id="fin-create-profile"
POST /api/finance
Authorization: Bearer {token}
```

**What it does:**
Creates a finance profile for a user or startup.

---

#### Get Finance Profile

```http id="fin-get-profile"
GET /api/finance/:id
Authorization: Bearer {token}
```

**What it does:**
Returns a finance profile by ID.

---

#### Update Finance Profile

```http id="fin-update-profile"
PUT /api/finance/:id
Authorization: Bearer {token}
```

**What it does:**
Updates an existing finance profile.

---

#### Delete Finance Profile

```http id="fin-delete-profile"
DELETE /api/finance/:id
Authorization: Bearer {token}
```

**What it does:**
Deletes a finance profile.

---

### Financial Analysis

#### Break-even Calculation

```http id="fin-breakeven"
GET /api/finance/breakeven/:id
```

**What it does:**
Calculates estimated break-even months for a finance profile.

---

#### Exchange Rate

```http id="fin-exchange"
GET /api/finance/exchange?from=USD&to=LKR
```

**What it does:**
Returns the currency conversion rate between two currencies.

---

#### Financial Intelligence Report

```http id="fin-intelligence"
GET /api/finance/intelligence/:id
Authorization: Bearer {token}
```

**What it does:**
Generates an intelligent financial report for a profile.

---

### Expenses

#### Add Expense

```http id="fin-add-expense"
POST /api/finance/expenses
```

**What it does:**
Adds an expense record.

---

#### Get Expenses by Profile

```http id="fin-get-expenses"
GET /api/finance/expenses/:profileId
```

**What it does:**
Returns all expense records for a finance profile.

---

#### Update Expense

```http id="fin-update-expense"
PUT /api/finance/expenses/:id
```

**What it does:**
Updates an expense record.

---

#### Delete Expense

```http id="fin-delete-expense"
DELETE /api/finance/expenses/:id
```

**What it does:**
Deletes an expense record.

---

### Revenue

#### Add Revenue

```http id="fin-add-revenue"
POST /api/finance/revenue
```

**What it does:**
Adds a revenue entry.

---

#### Get Revenue by Profile

```http id="fin-get-revenue"
GET /api/finance/revenue/:profileId
```

**What it does:**
Returns revenue records for a finance profile.

---

#### Update Revenue

```http id="fin-update-revenue"
PUT /api/finance/revenue/:id
```

**What it does:**
Updates a revenue record.

---

#### Delete Revenue

```http id="fin-delete-revenue"
DELETE /api/finance/revenue/:id
```

**What it does:**
Deletes a revenue record.

---

## 📢 Marketing Module Endpoints

These endpoints support marketing authentication, articles, templates, campaigns, mentors, mentor requests, mentor applications, and AI campaign analysis.

### Marketing Articles

#### Get All Articles

```http id="mkt-get-articles"
GET /api/marketing/articles
```

**What it does:**
Returns all marketing articles.

---

#### Get Article by ID

```http id="mkt-get-article"
GET /api/marketing/articles/:id
```

**What it does:**
Returns a single marketing article.

---

#### Create Article

```http id="mkt-create-article"
POST /api/marketing/articles
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Creates a new article.

---

#### Update Article

```http id="mkt-update-article"
PUT /api/marketing/articles/:id
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Updates an article.

---

#### Delete Article

```http id="mkt-delete-article"
DELETE /api/marketing/articles/:id
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Deletes an article.

---

### Marketing Templates

#### Get All Templates

```http id="mkt-get-templates"
GET /api/marketing/templates
Authorization: Bearer {token}
```

**What it does:**
Returns all marketing templates available to logged-in users.

---

#### Get Template by ID

```http id="mkt-get-template"
GET /api/marketing/templates/:id
Authorization: Bearer {token}
```

**What it does:**
Returns a specific template.

---

#### Create Template

```http id="mkt-create-template"
POST /api/marketing/templates
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Creates a marketing template.

---

#### Update Template

```http id="mkt-update-template"
PUT /api/marketing/templates/:id
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Updates a template.

---

#### Delete Template

```http id="mkt-delete-template"
DELETE /api/marketing/templates/:id
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Deletes a template.

---

### Marketing Campaigns

#### Create Campaign

```http id="mkt-create-campaign"
POST /api/marketing/campaigns
Authorization: Bearer {token}
```

**What it does:**
Creates a new marketing campaign for the logged-in user.

---

#### Get My Campaigns

```http id="mkt-get-campaigns"
GET /api/marketing/campaigns
Authorization: Bearer {token}
```

**What it does:**
Returns campaigns owned by the logged-in user.

---

#### Get Campaign by ID

```http id="mkt-get-campaign"
GET /api/marketing/campaigns/:id
Authorization: Bearer {token}
```

**What it does:**
Returns a single campaign if the user is the owner or an admin.

---

#### Update Campaign

```http id="mkt-update-campaign"
PUT /api/marketing/campaigns/:id
Authorization: Bearer {token}
```

**What it does:**
Updates a campaign if the user is the owner or an admin.

---

#### Delete Campaign

```http id="mkt-delete-campaign"
DELETE /api/marketing/campaigns/:id
Authorization: Bearer {token}
```

**What it does:**
Deletes a campaign if the user is the owner or an admin.

---

### Marketing Mentors

#### Get Marketing Mentors

```http id="mkt-get-mentors"
GET /api/marketing/mentors
Authorization: Bearer {token}
```

**What it does:**
Returns approved marketing mentors.

---

### Marketing Mentor Requests

#### Create Mentor Request

```http id="mkt-create-mentor-request"
POST /api/marketing/mentor-requests
Authorization: Bearer {token}
```

**Access:** User only
**What it does:** Sends a mentor support request.

---

#### Get Mentor Requests

```http id="mkt-get-mentor-requests"
GET /api/marketing/mentor-requests
Authorization: Bearer {token}
```

**What it does:**
Returns mentor requests filtered by role:

* user sees own requests
* mentor sees assigned requests
* admin sees all

---

#### Respond to Mentor Request

```http id="mkt-respond-mentor-request"
PUT /api/marketing/mentor-requests/:id/respond
Authorization: Bearer {token}
```

**Access:** Assigned mentor or admin
**What it does:** Updates request status, reply, schedule, or meeting link.

---

### Mentor Applications

#### Apply to Become Mentor

```http id="mkt-apply-mentor"
POST /api/marketing/mentor-applications
Authorization: Bearer {token}
```

**What it does:**
Allows a logged-in user to submit a mentor application.

---

#### Get Mentor Applications

```http id="mkt-get-mentor-apps"
GET /api/marketing/mentor-applications
Authorization: Bearer {token}
```

**What it does:**
Returns applications:

* admin sees all
* user sees own

---

#### Approve Mentor Application

```http id="mkt-approve-mentor-app"
PUT /api/marketing/mentor-applications/:id/approve
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Approves the application and promotes the user role to `mentor`.

---

#### Reject Mentor Application

```http id="mkt-reject-mentor-app"
PUT /api/marketing/mentor-applications/:id/reject
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Rejects a mentor application.

---

### AI Campaign Analysis

#### Analyze Campaign with AI

```http id="mkt-ai-analyze"
POST /api/ai/marketing-campaigns/:id/analyze
Authorization: Bearer {token}
```

**What it does:**
Analyzes a campaign using Gemini-based AI and returns performance insights.

---

## ⚖️ Legal Support Module Endpoints

These endpoints support legal tasks, evidence submissions, progress tracking, mentor help requests, toolkit access, mentor review workflows, admin task management, and AI-based legal compliance guidance.

### Legal Tasks

#### Get All Legal Tasks

```http id="legal-get-tasks"
GET /api/legal/tasks
Authorization: Bearer {token}
```

**What it does:**
Returns all legal tasks available to the logged-in user.

---

#### Get Legal Task by ID

```http id="legal-get-task"
GET /api/legal/tasks/:taskId
Authorization: Bearer {token}
```

**What it does:**
Returns a single legal task.

---

### Legal Submissions

#### Submit Evidence for Task

```http id="legal-submit-evidence"
POST /api/legal/tasks/:taskId/submissions
Authorization: Bearer {token}
```

**What it does:**
Uploads or records evidence submission for a legal task.

---

#### Get My Submissions

```http id="legal-get-my-submissions"
GET /api/legal/submissions/me
Authorization: Bearer {token}
```

**What it does:**
Returns all legal submissions created by the logged-in user.

---

#### Get My Submission for a Specific Task

```http id="legal-get-my-task-submission"
GET /api/legal/tasks/:taskId/submission/me
Authorization: Bearer {token}
```

**What it does:**
Returns the user's submission for a specific legal task.

---

#### Get My Progress

```http id="legal-progress"
GET /api/legal/progress/me
Authorization: Bearer {token}
```

**What it does:**
Returns legal task progress for the logged-in user.

---

### Legal Help Requests

#### Create Legal Help Request

```http id="legal-create-help-request"
POST /api/legal/help-requests
Authorization: Bearer {token}
```

**What it does:**
Creates a help request to a legal mentor.

---

#### Backward-Compatible Help Request Alias

```http id="legal-create-help-request-alias"
POST /api/legal/tasks/help-requests
Authorization: Bearer {token}
```

**What it does:**
Alternative route for the same legal help request action.

---

#### Get My Legal Help Requests

```http id="legal-get-my-help-requests"
GET /api/legal/help-requests/me
Authorization: Bearer {token}
```

**What it does:**
Returns help requests created by the logged-in user.

---

### Legal Mentors

#### Get Legal Mentors

```http id="legal-get-mentors"
GET /api/legal/mentors
Authorization: Bearer {token}
```

**What it does:**
Returns legal mentors. The backend merges mentors from the legal mentor collection and approved mentor applications.

---

#### Get Legal Mentor by ID

```http id="legal-get-mentor"
GET /api/legal/mentors/:id
Authorization: Bearer {token}
```

**What it does:**
Returns a single legal mentor profile.

---

### Mentor Review Endpoints

#### Get Legal Reviews Under Review

```http id="legal-mentor-reviews"
GET /api/legal/mentor/reviews
Authorization: Bearer {token}
```

**Access:** Mentor or admin
**What it does:** Returns legal submissions currently under review.

---

#### Update Legal Submission Review

```http id="legal-mentor-update-submission"
PATCH /api/legal/mentor/submissions/:id
Authorization: Bearer {token}
```

**Access:** Mentor or admin
**What it does:** Updates submission status and mentor feedback.

---

#### Get Submission History for a User

```http id="legal-mentor-user-history"
GET /api/legal/mentor/submissions/user/:userId
Authorization: Bearer {token}
```

**Access:** Mentor or admin
**What it does:** Returns full submission history for a given user.

---

#### Get Mentor Submission History

```http id="legal-mentor-history"
GET /api/legal/mentor/submissions/history
Authorization: Bearer {token}
```

**Access:** Mentor or admin
**What it does:** Returns reviewed submission history.

---

### Legal Toolkits

#### Get All Legal Toolkits

```http id="legal-get-toolkits"
GET /api/legal/toolkits
Authorization: Bearer {token}
```

**What it does:**
Returns all active legal toolkits.

---

#### Get Legal Toolkit by ID

```http id="legal-get-toolkit"
GET /api/legal/toolkits/:id
Authorization: Bearer {token}
```

**What it does:**
Returns a single legal toolkit.

---

#### Create Legal Toolkit

```http id="legal-create-toolkit"
POST /api/legal/toolkits
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Creates a legal toolkit resource.

---

#### Update Legal Toolkit

```http id="legal-update-toolkit"
PUT /api/legal/toolkits/:id
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Updates a legal toolkit.

---

#### Delete Legal Toolkit

```http id="legal-delete-toolkit"
DELETE /api/legal/toolkits/:id
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Deletes a legal toolkit.

---

### Admin Legal Task Management

#### Create Legal Task

```http id="legal-admin-create-task"
POST /api/legal/admin/tasks
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Creates a legal task.

---

#### Get All Admin Tasks

```http id="legal-admin-get-tasks"
GET /api/legal/admin/tasks
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Returns all legal tasks for admin management.

---

#### Get Admin Task by ID

```http id="legal-admin-get-task"
GET /api/legal/admin/tasks/:taskId
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Returns one legal task for admin editing.

---

#### Update Admin Task

```http id="legal-admin-update-task"
PUT /api/legal/admin/tasks/:taskId
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Updates a legal task.

---

#### Delete Admin Task

```http id="legal-admin-delete-task"
DELETE /api/legal/admin/tasks/:taskId
Authorization: Bearer {token}
```

**Access:** Admin only
**What it does:** Deletes a legal task.

---

### AI Legal Guidance

#### Legal Compliance AI

```http id="legal-ai-compliance"
POST /api/legal/ai/compliance
Authorization: Bearer {token}
```

**What it does:**
Generates legal compliance guidance based on a user question.

---

## 🧩 API Notes

* The backend is built using **Express.js** and follows a **modular route structure**.
* Authentication is mainly handled through JWT middleware.
* Some business and finance routes are not protected consistently in the current implementation, while most marketing and legal routes are protected.
* `/api/auth` and `/api/marketing/auth` both point to the same authentication controller in the current codebase.
* The server root route returns:

  ```text id="server-root-text"
  VentureAssist Backend Running...
  ```

---
## ⚡ System Features & Architecture

VentureAssist is not just a REST API system. It is a **multi-module startup support platform** with workflow-driven logic, AI integration, and mentor-based collaboration.

---

## 🔄 System Workflow

### 🧩 Overall Startup Flow

```
User → Register/Login → Access Dashboard
     → Choose Module (Business / Finance / Marketing / Legal)
     → Perform Actions (Create / Analyze / Track)
     → Request Mentor Support (if needed)
     → Mentor Reviews → Provides Feedback
     → User Improves → Process Completed
```

---

### ⚖️ Legal Module Workflow (Your Core Module)

```
User → View Legal Tasks
     → Submit Evidence (documents)
     → Track Progress
     → Request Mentor Help
     → Mentor Reviews Submission
     → Mentor Responds (Approved / Rejected / Feedback)
     → Task Completed
```

---

### 💡 Business Idea Workflow

```
User → Create Idea
     → Generate SWOT Analysis
     → View Toolkits
     → Request Mentor Guidance
     → Track Progress (Checklist)
     → Improve Idea
```

---

### 💰 Finance Workflow

```
User → Create Finance Profile
     → Add Expenses & Revenue
     → Calculate Break-even
     → View Financial Intelligence Report
     → Optimize Financial Plan
```

---

### 📢 Marketing Workflow

```
User → Create Campaign
     → Use Templates
     → Analyze Campaign (AI)
     → Request Mentor Support
     → Improve Strategy
```

---

## 🤖 AI Integration

VentureAssist integrates AI to support smarter decision-making:

### 🔹 Features

* Legal compliance guidance
* Marketing campaign analysis
* Business idea evaluation (future enhancement)

### 🔹 Endpoints Used

* `/api/legal/ai/compliance`
* `/api/ai/marketing-campaigns/:id/analyze`

### 🔹 Purpose

* Provide intelligent recommendations
* Reduce manual effort
* Improve startup success rate

---

## 🧑‍🏫 Mentor System

The platform supports a **mentor-based guidance system**:

### 🔹 Features

* Users can request mentor help
* Mentors review submissions
* Mentors provide feedback & decisions
* Admin manages mentor approvals

### 🔹 Flow

```
User → Request Mentor → Mentor Assigned → Review → Response → Completed
```

---

## 🔐 Security Features

VentureAssist ensures secure application behavior:

* JWT-based authentication
* Role-based authorization (User / Mentor / Admin)
* Protected API routes
* Input validation
* Secure file uploads (Multer)

---

## 📁 File & Document Handling

* Legal evidence uploads handled via backend
* Stored in `/uploads` directory or cloud storage
* Used in mentor review workflow

---

## ⚙️ System Configuration

Configuration is managed through `.env` variables:

### Example:

```env id="cfg1"
PORT=5050
MONGO_URI=your_database
JWT_SECRET=your_secret
OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key
```

---

## 🧠 Architecture Pattern

The backend follows a **layered architecture**:

```
Routes → Controllers → Services → Models → Database
```

### Benefits:

* Clean code separation
* Easy debugging
* Scalable design

---

## 🔗 External Integrations

* OpenAI / Gemini API (AI features)
* MongoDB Atlas (cloud database)
* REST APIs for frontend-backend communication

---

## 📊 System Highlights

* Multi-module startup support system
* AI-powered assistance
* Mentor-driven workflow
* Modular and scalable architecture
* Real-world business use case

---

## 🧪 Testing Guide

---

### 1. Test Authentication

#### Register User

```http
POST http://localhost:5050/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "testuser@example.com",
  "password": "password123"
}
```

---

#### Login User

```http
POST http://localhost:5050/api/auth/login
Content-Type: application/json

{
  "email": "testuser@example.com",
  "password": "password123"
}
```

👉 Save the returned `token` for all protected requests:

```
Authorization: Bearer {token}
```

---

### 2. Test Business Idea Module

#### Create Business Idea

```http
POST http://localhost:5050/api/business/ideas
Content-Type: application/json

{
  "title": "Online Grocery App",
  "description": "Delivery-based grocery service",
  "industry": "Retail"
}
```

---

#### Get All Ideas

```http
GET http://localhost:5050/api/business/ideas
```

---

#### Generate SWOT Analysis

```http
POST http://localhost:5050/api/business/ideas/{ideaId}/swot/generate
```

---

#### Get Progress Tracker

```http
GET http://localhost:5050/api/business/trackers?ideaId={ideaId}
```

---

### 3. Test Finance Module

#### Create Finance Profile

```http
POST http://localhost:5050/api/finance
Authorization: Bearer {token}
Content-Type: application/json

{
  "startupName": "Test Startup",
  "initialInvestment": 500000,
  "monthlyExpenses": 50000
}
```

---

#### Add Expense

```http
POST http://localhost:5050/api/finance/expenses
Content-Type: application/json

{
  "profileId": "{profileId}",
  "amount": 10000,
  "category": "Marketing"
}
```

---

#### Add Revenue

```http
POST http://localhost:5050/api/finance/revenue
Content-Type: application/json

{
  "profileId": "{profileId}",
  "amount": 20000,
  "source": "Sales"
}
```

---

#### Break-even Calculation

```http
GET http://localhost:5050/api/finance/breakeven/{profileId}
```

---

### 4. Test Marketing Module

#### Create Campaign

```http
POST http://localhost:5050/api/marketing/campaigns
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Instagram Promotion",
  "budget": 15000,
  "targetAudience": "Young adults"
}
```

---

#### Get Campaigns

```http
GET http://localhost:5050/api/marketing/campaigns
Authorization: Bearer {token}
```

---

#### Analyze Campaign (AI)

```http
POST http://localhost:5050/api/ai/marketing-campaigns/{campaignId}/analyze
Authorization: Bearer {token}
```

---

### 5. Test Legal Support Module

#### Get Legal Tasks

```http
GET http://localhost:5050/api/legal/tasks
Authorization: Bearer {token}
```

---

#### Submit Legal Evidence

```http
POST http://localhost:5050/api/legal/tasks/{taskId}/submissions
Authorization: Bearer {token}
Content-Type: application/json

{
  "description": "Uploaded business registration document"
}
```

---

#### Request Mentor Help

```http
POST http://localhost:5050/api/legal/help-requests
Authorization: Bearer {token}
Content-Type: application/json

{
  "taskId": "{taskId}",
  "message": "Need help verifying documents"
}
```

---

#### Get My Submissions

```http
GET http://localhost:5050/api/legal/submissions/me
Authorization: Bearer {token}
```

---

#### AI Legal Guidance

```http
POST http://localhost:5050/api/legal/ai/compliance
Authorization: Bearer {token}
Content-Type: application/json

{
  "question": "What legal steps are required to register a business?"
}
```

---

### 6. Test Mentor Workflow

#### Get Mentor Requests

```http
GET http://localhost:5050/api/legal/help-requests/me
Authorization: Bearer {token}
```

---

#### Mentor Review Submission (Mentor Role)

```http
PATCH http://localhost:5050/api/legal/mentor/submissions/{submissionId}
Authorization: Bearer {mentor_token}
Content-Type: application/json

{
  "status": "approved",
  "feedback": "Documents are valid"
}
```

---

### 7. Quick System Test Flow

👉 Recommended full test sequence:

```
Register → Login → Create Business Idea
→ Create Finance Profile
→ Create Marketing Campaign
→ Submit Legal Task Evidence
→ Request Mentor Help
→ Mentor Review
→ AI Analysis
```

---

## 🔧 Troubleshooting

### ❌ Server not starting

```bash
Error: EADDRINUSE
```

👉 Solution:

```bash
lsof -i :5050
kill -9 <PID>
```

---

### ❌ MongoDB connection error

* Check `MONGO_URI`
* Ensure MongoDB is running (`mongod`)
* Check Atlas network access

---

### ❌ API not responding

* Verify backend is running on port 5050
* Check frontend `.env`:

```
VITE_API_BASE_URL=http://localhost:5050
```

---

### ❌ Unauthorized error (401)

* Token missing or invalid
* Add header:

```
Authorization: Bearer {token}
```

---

### ❌ AI not working

* Add valid API key:

```
OPENAI_API_KEY=your_key
or
GEMINI_API_KEY=your_key
```

---
## 📊 Database Schema Overview

### 👤 User Model

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user | mentor | admin),
  createdAt: Date
}
```

---

### 💡 Business Idea Model

```javascript
{
  title: String,
  description: String,
  industry: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

---

### 📊 Business Tracker Model

```javascript
{
  idea: ObjectId (ref: Business),
  items: [
    {
      title: String,
      completed: Boolean,
      notes: String
    }
  ],
  progress: Number,
  createdAt: Date
}
```

---

### 💰 Finance Model

```javascript
{
  startupName: String,
  initialInvestment: Number,
  monthlyExpenses: Number,
  owner: ObjectId (ref: User),
  createdAt: Date
}
```

---

### 💸 Expense Model

```javascript
{
  profileId: ObjectId (ref: Finance),
  amount: Number,
  category: String,
  createdAt: Date
}
```

---

### 💵 Revenue Model

```javascript
{
  profileId: ObjectId (ref: Finance),
  amount: Number,
  source: String,
  createdAt: Date
}
```

---

### 📢 Marketing Campaign Model

```javascript
{
  name: String,
  budget: Number,
  targetAudience: String,
  createdBy: ObjectId (ref: User),
  createdAt: Date
}
```

---

### 📄 Legal Task Model

```javascript
{
  title: String,
  description: String,
  category: String,
  steps: [String],
  requiredDocuments: [String],
  order: Number,
  active: Boolean
}
```

---

### 📎 Legal Submission Model

```javascript
{
  taskId: ObjectId (ref: LegalTask),
  userId: ObjectId (ref: User),
  description: String,
  status: String (pending | approved | rejected),
  feedback: String,
  createdAt: Date
}
```

---

### 📨 Help Request Model

```javascript
{
  userId: ObjectId (ref: User),
  taskId: ObjectId (ref: LegalTask),
  message: String,
  status: String (pending | responded),
  mentorId: ObjectId (ref: User),
  createdAt: Date
}
```

---

## 🔒 Security Best Practices

### 🛡️ Production Checklist

* [ ] Change `JWT_SECRET` to a strong random string
* [ ] Set `NODE_ENV=production`
* [ ] Use MongoDB Atlas with authentication enabled
* [ ] Restrict CORS to production domain
* [ ] Enable HTTPS (SSL/TLS)
* [ ] Store environment variables securely
* [ ] Validate all inputs before processing
* [ ] Secure file uploads (limit size & type)

---

### 🔐 API Security Features

✅ **JWT Authentication** – Secure login system
✅ **Role-Based Access Control** – User / Mentor / Admin
✅ **Password Hashing** – bcrypt encryption
✅ **Protected Routes** – Middleware validation
✅ **Input Validation** – Prevent invalid data
✅ **CORS Protection** – Control cross-origin requests

---

## 📈 Performance & Scalability

### 📊 Database Indexes

```javascript
// User email
db.users.createIndex({ email: 1 }, { unique: true })

// Business ideas
db.businesses.createIndex({ createdBy: 1 })

// Finance profiles
db.finances.createIndex({ owner: 1 })

// Legal tasks
db.legaltasks.createIndex({ category: 1 })

// Submissions
db.submissions.createIndex({ userId: 1, taskId: 1 })
```

---

### ⚙️ Recommended Production Settings

* Use MongoDB Atlas for scalability
* Optimize queries using indexes
* Use pagination for large datasets
* Limit API response size
* Use caching for repeated requests (future enhancement)

---

### 🚀 Scalability Features

* Modular architecture (Business, Finance, Marketing, Legal)
* Service-based backend logic
* RESTful API design
* Easily extendable with new modules

---

## 🤖 System Capabilities

* Multi-module startup support platform
* AI-powered legal & marketing guidance
* Mentor-based review system
* Workflow-driven task management
* Real-world business use case

---

## 📝 License

This project is developed for **academic purposes (AF - SE3040)**.

---

## 👥 Contributors

* Sathurgini K – Legal Module
* Pirathap S – Business Module
* Nithusika S – Finance Module
* M Sanjeevan – Marketing Module

---

## 📞 Support

For issues:

1. Check API endpoints
2. Verify `.env` configuration
3. Review server logs
4. Test using Postman

---

## 🎯 Quick Start Commands

```bash
# Install dependencies
npm install

# Start backend
cd server
npm run dev

# Start frontend
cd client
npm run dev

# Test API
curl http://localhost:5050/api
```

---

**Version:** 1.0.0
**Node.js:** 16+
**MongoDB:** 5+

---
