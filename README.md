# Smart Leads CRM Dashboard

A multi-tenant, production-ready SaaS CRM Dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. Featuring role-based authorization (RBAC), automatic event auditing, real-time weekly metrics trends, interactive charting, and responsive styling.

---

## 🚀 Live Demo

* **Frontend:** [https://smart-leads-dashboard.vercel.app](https://smart-leads-dashboard.vercel.app)
* **Backend API:** [https://smart-leads-api.onrender.com](https://smart-leads-api.onrender.com)

---

## 💎 Key Features

### 🔑 Authentication & RBAC
* **Secure Registration & Login:** JWT-based stateless authentication with secure cookie/header handlers.
* **Role-Based Access Control (RBAC):** 
  * `Admin`: Full permissions (View, Create, Edit, Delete leads, and Invite Users).
  * `Sales User`: Pipeline execution (View, Create, Edit leads; cannot delete leads or invite users).
* **Multi-Tenant Isolation:** Secure tenancy isolation ensures users can only access leads and invite members belonging to their registered organization.

### 📋 Leads Management & Audit Logging
* **Complete CRUD:** Optimized forms with validation, default selections, and notes fields.
* **Tamper-proof Lead Audit Trails:** Server-side auto-generated activity timelines recording every state change (Create, Edit, Status transitions) with editor tracking.
* **Filtering, Searching & Pagination:**
  * Debounced client-side searches.
  * Multi-attribute status/source filtering.
  * Server-side paginated queries with range pagination controls.
* **CSV Exports:** One-click client-side download utility.

### 📊 Dashboard & Interactive Analytics
* **Live Weekly Trend Metrics:** Computes lead creation volume comparing the current week vs. the previous week to display indicators (`+12.5%` or `-3.2%`).
* **Interactive Charting:** Dynamic Status Bar Charts and Source Mix Pie/Donut charts built using `recharts` that support fluid dark/light modes.
* **One-Click Print Reports:** Standardized `@media print` rules built to strip navigation and output high-contrast A4 print report sheets or PDFs immediately.

---

## 🛠 Tech Stack

| Frontend | Backend | Database & DevOps |
| :--- | :--- | :--- |
| React.js 19 & TypeScript | Node.js & Express.js | MongoDB & Mongoose |
| TailwindCSS | TypeScript | Vitest & Supertest |
| Zustand (State) | Zod Schema Validation | Docker & Docker Compose |
| TanStack React Query | JWT & BcryptJS | Vercel (Client Deployment) |
| Recharts | Helmet & CORS | Render (Server Deployment) |

---

## 📂 Project Structure

```txt
smart-leads-dashboard/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable Common UI & Dashboard Modules
│   │   ├── pages/          # Dashboard, Leads, LeadDetails, Login, Register
│   │   ├── services/       # Axios API integrations
│   │   ├── store/          # Zustand global states
│   │   └── types/          # TypeScript Type Definitions
├── server/                 # Express Backend API
│   ├── src/
│   │   ├── controllers/    # API Request Handlers
│   │   ├── models/         # Mongoose Schemas (User, Lead, Invitation)
│   │   ├── middleware/     # Auth, RBAC, Error Handlers
│   │   └── server.ts       # Express Application Entrypoint
└── docker-compose.yml      # Container Orchestration
```

---

## ⚙️ Setup & Local Installation

### 1. Prerequisites
Ensure you have the following installed locally:
* [Node.js (v18+)](https://nodejs.org)
* [MongoDB](https://www.mongodb.com/try/download/community) (or a MongoDB Atlas connection string)
* [Docker Desktop](https://www.docker.com/products/docker-desktop) *(Optional)*

### 2. Environment Configuration
Create a `.env` file in the `server` directory and a `.env` in the `client` directory matching the following configuration options.

#### Server Environment (`server/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=development
```

#### Client Environment (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Local Run Command Instructions

#### Run Backend API
```bash
cd server
npm install
npm run build
npm run dev
```
The API is now running at `http://localhost:5000`

#### Run Frontend Client
```bash
cd client
npm install
npm run dev
```
The application will launch on `http://localhost:5173`

---

### 4. Running via Docker Compose
To boot up the entire stack (Database, Server, Client) inside isolated containers:
```bash
docker compose up --build
```
* **Frontend:** `http://localhost:3000`
* **Backend:** `http://localhost:5000`

---

### 5. Running Tests
Verify security policies, RBAC access controls, and routing integrity:

```bash
# Run Server Tests
cd server
npm run test:run

# Run Client Tests
cd client
npm run test:run
```

---

## 📖 API Documentation

All routes expect `Content-Type: application/json` and must be authorized using a Bearer JWT Token in the Authorization header.

### 🛡 Auth Endpoints

#### User Registration
* **Endpoint:** `POST /api/auth/register`
* **Body:**
  ```json
  {
    "name": "Alex Admin",
    "email": "admin@example.com",
    "password": "Password123!",
    "organizationName": "Acme Corp"
  }
  ```
* **Response (201):**
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "user_id", "name": "Alex Admin", "email": "admin@example.com", "role": "admin" },
      "token": "jwt_token_string"
    }
  }
  ```

#### User Login
* **Endpoint:** `POST /api/auth/login`
* **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "Password123!"
  }
  ```

#### Accept Workspace Invitation
* **Endpoint:** `POST /api/auth/invitations/accept`
* **Body:**
  ```json
  {
    "token": "invitation_token_sent_via_email",
    "name": "Jane Sales",
    "password": "Password123!"
  }
  ```

---

### 👥 User Administration (Admin Only)

#### Invite Team Member
* **Endpoint:** `POST /api/users/invite`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**
  ```json
  {
    "email": "sales@example.com",
    "role": "sales"
  }
  ```

---

### 📋 Leads Resource Endpoints

#### Get All Leads (Paginated, Filtered, Searched)
* **Endpoint:** `GET /api/leads`
* **Headers:** `Authorization: Bearer <token>`
* **Query Parameters:**
  * `page` (default: 1)
  * `limit` (default: 10)
  * `search` (searches Lead Name, Email, Notes)
  * `status` (`New` | `Contacted` | `Qualified` | `Lost`)
  * `source` (`Website` | `Referral` | `LinkedIn` | `Cold Reach` | `Other`)
  * `sort` (`latest` | `oldest`)
* **Example Query:** `/api/leads?status=Qualified&search=Acme&sort=latest`

#### Create Lead
* **Endpoint:** `POST /api/leads`
* **Headers:** `Authorization: Bearer <token>`
* **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@company.com",
    "phone": "+1234567890",
    "status": "New",
    "source": "LinkedIn",
    "notes": "Interested in premium tier."
  }
  ```

#### Get Lead Details
* **Endpoint:** `GET /api/leads/:id`
* **Headers:** `Authorization: Bearer <token>`
* **Response (Includes Activities Timeline):**
  ```json
  {
    "success": true,
    "data": {
      "_id": "lead_id",
      "name": "John Doe",
      "activities": [
        {
          "type": "status_change",
          "description": "Lead created",
          "performedBy": "Alex Admin",
          "createdAt": "2026-05-19T18:00:00Z"
        }
      ]
    }
  }
  ```

#### Edit Lead
* **Endpoint:** `PUT /api/leads/:id`
* **Headers:** `Authorization: Bearer <token>`
* **Body:** Matches parameters of Create Lead. Logs automated audit entry to Timeline.

#### Delete Lead (Admin Only)
* **Endpoint:** `DELETE /api/leads/:id`
* **Headers:** `Authorization: Bearer <token>`

---

### 📊 Analytics & Reporting

#### Get Dashboard Analytics
* **Endpoint:** `GET /api/dashboard/summary`
* **Headers:** `Authorization: Bearer <token>`
* **Response (200):**
  ```json
  {
    "success": true,
    "data": {
      "totalLeads": 150,
      "activeUsers": 5,
      "pendingInvitations": 2,
      "trends": {
        "totalLeads": 12.5
      },
      "statusBreakdown": [
        { "label": "New", "count": 40 },
        { "label": "Qualified", "count": 60 }
      ],
      "sourceBreakdown": [
        { "label": "LinkedIn", "count": 80 },
        { "label": "Website", "count": 70 }
      ],
      "recentLeads": [...]
    }
  }
  ```
