# 🚗 Car Service & Mechanic Hub

A full-stack, enterprise-grade vehicle service management platform built with **Node.js, Express, MongoDB Atlas, and React (Vite)**. The platform features strict role-based access control, an automated round-robin & workload-balanced mechanic dispatch system, real-time service stage tracking, and transactional email notifications.

---

## 🌟 Key Features

### 👤 Customer Portal
- **Service Catalog**: Browse categorized service offerings with transparent pricing and turnaround times.
- **Fleet Management**: Register and manage vehicles with brand, model, license plate, year, and fuel type.
- **Appointment Booking**: Schedule maintenance appointments with preferred date and time slots.
- **Live 5-Stage Status Tracker**: Real-time milestone tracking (`Received` ➔ `Confirmed` ➔ `In Service` ➔ `Completed` ➔ `Ready for Pickup`).
- **Service History**: Historical logs of previous maintenance records, technician notes, and invoices.
- **In-App Notifications**: Real-time alerts for booking confirmations, status changes, and vehicle readiness.

### 🔧 Mechanic Portal
- **Technician Workspace**: Dedicated dashboard displaying assigned jobs, current queue, and completion stats.
- **Fair Job Offer Workflow**: Accept or decline incoming service requests. Declining an offer instantly and automatically transfers the job to the next eligible technician without admin intervention.
- **Real-Time Job Progression**: Update service stages (`In Service`, `Completed`, `Ready for Pickup`) and attach detailed diagnostic notes.
- **Workload Management**: Automatic availability tracking based on active assignments.

### 🛡️ Administrator Console
- **Comprehensive Analytics**: Workshop KPIs, active customer count, mechanic workload metrics, and booking revenue.
- **Full Booking CRUD**: Create bookings on behalf of customers, view details in-place, modify technician assignments, update statuses, or cancel/delete bookings.
- **Automated & Manual Reassignment**: One-click intelligent auto-dispatch or manual override with complete audit logs.
- **Mechanic Management**: Onboard technicians, monitor live workloads, toggle active status, and view assignment logs.
- **Fleet & User Directory**: View all registered customer profiles and vehicle registries.
- **Service & Category Catalog**: Create, edit, and deactivate service packages with custom icons, pricing, and category classifications.
- **System Activity & SMTP Diagnostics**: Live audit trail of system events and real-time Gmail SMTP configuration tester.

---

## ⚙️ Automated Mechanic Assignment Engine

The dispatch service (`assignmentService.js`) implements an equitable, workload-balanced round-robin algorithm:
1. **Filter Active & Available Mechanics**: Excludes inactive accounts and mechanics who previously declined the booking.
2. **Workload Minimization**: Selects technicians with the lowest number of active jobs (`In Service` / `Confirmed`).
3. **Round-Robin Fair Rotation**: When workloads are tied, breaks ties deterministically using `lastAssignedAt` (longest idle technician first) and `_id`.
4. **Instant Escalation & Handoff**: If a technician declines an offer, the system records the rejection reason and immediately dispatches the job to the next best candidate.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, React Router v7, Axios, Bootstrap 5, Bootstrap Icons |
| **Backend** | Node.js, Express 5, Mongoose, JWT (JSON Web Tokens), Bcrypt.js |
| **Database** | MongoDB Atlas (Cloud Database) |
| **Email & Alerts** | Nodemailer (Gmail SMTP integration) |
| **Security** | Role-Based Access Control Middleware, Rate Limiting, HTTP Security Headers |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB Atlas cluster or local MongoDB instance

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dharshini201/Car-Service-Mechanic-Hub.git
   cd Car-Service-Mechanic-Hub
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` in `backend/` and configure your credentials:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Provide your MongoDB URI and Gmail SMTP App Password:
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/carservice
   JWT_SECRET=your_jwt_secret_key_here

   EMAIL_SERVICE=gmail
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_digit_app_password
   EMAIL_FROM=your_email@gmail.com
   ```

3. **Install Dependencies**:
   ```bash
   # Root & orchestration
   npm install

   # Backend
   cd backend && npm install

   # Frontend
   cd ../frontend && npm install
   cd ..
   ```

4. **Seed Administrator Account** (Optional):
   ```bash
   cd backend
   node seed/adminSeeder.js
   cd ..
   ```

5. **Start Development Servers**:
   ```bash
   # From root directory (runs backend on port 5001 & frontend on port 5173 concurrently):
   npm run dev
   ```

---

## 🌐 Production Deployment Guide

### 1. Backend Deployment (Render)

1. Sign in to [Render](https://render.com) and click **New +** ➔ **Web Service**.
2. Connect your GitHub repository (`Car-Service-Mechanic-Hub` or `car-service-mechanic-hub-backend`).
3. Set the following build and runtime settings:
   - **Environment**: `Node`
   - **Root Directory**: `backend` (leave empty if deploying directly from the `backend` repository)
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
4. Add the required Environment Variables in Render:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/carservice?retryWrites=true&w=majority`
   - `JWT_SECRET`: `your_secure_jwt_secret`
   - `FRONTEND_URL`: `https://your-frontend-app.vercel.app`
   - `CLIENT_URL`: `https://your-frontend-app.vercel.app`
   - `ALLOWED_ORIGINS`: `https://your-frontend-app.vercel.app`
5. Click **Deploy Web Service**. Once deployed, copy your Render service URL (e.g. `https://car-service-backend.onrender.com`).

### 2. Frontend Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com) and click **Add New...** ➔ **Project**.
2. Import your GitHub repository (`Car-Service-Mechanic-Hub` or `car-service-mechanic-hub-frontend`).
3. Configure the Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `frontend` (leave as root if importing `car-service-mechanic-hub-frontend`).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://car-service-backend.onrender.com` (Your deployed Render backend URL)
5. Click **Deploy**.
6. When deployment finishes, copy your Vercel URL and paste it into the Render backend's `FRONTEND_URL` and `CLIENT_URL` environment variables so CORS is matched.

---

## 📁 Repository Structure

```
Car-Service-Mechanic-Hub/
├── backend/
│   ├── config/              # Database connection
│   ├── controllers/         # Express route controllers (Admin, Auth, Booking, Mechanic, User, etc.)
│   ├── middleware/          # JWT auth, role validation, rate limiting, error handling
│   ├── models/              # Mongoose data schemas (User, Mechanic, Vehicle, Booking, Service, etc.)
│   ├── routes/              # Express API route endpoints
│   ├── services/            # Assignment engine & email dispatch service
│   ├── utils/               # Token generators & transactional email utilities
│   ├── server.js            # Express application bootstrap
│   └── .env.example         # Template environment variables
├── frontend/
│   ├── public/              # Static assets & icons
│   ├── src/
│   │   ├── assets/          # Images & visual media
│   │   ├── components/      # UI components (Navbar, Sidebar, BookingCard, VehicleCard, etc.)
│   │   ├── context/         # AuthContext & NotificationContext
│   │   ├── pages/
│   │   │   ├── admin/       # Admin Dashboard, ManageBookings, ManageMechanics, etc.
│   │   │   ├── auth/        # Login, Register, ForgotPassword, ResetPassword
│   │   │   ├── customer/    # CustomerDashboard, BookService, BookingDetails, Vehicles, etc.
│   │   │   └── mechanic/    # MechanicDashboard, ServiceRequests, UpdateServiceStatus, etc.
│   │   ├── services/        # Frontend API client modules
│   │   ├── App.jsx          # Router and layout configuration
│   │   └── main.jsx         # React application entry point
│   ├── index.html
│   └── vite.config.js
├── .gitignore               # Strict exclude rules for secrets, dependencies & artifacts
├── package.json             # Root workspace configuration
└── README.md                # Project documentation
```

---

## 🔒 Security Best Practices

- **Zero Secret Leakage**: All API keys, database credentials, and email credentials are kept out of source control.
- **Strict Role Separation**: Customer, Mechanic, and Admin permissions are strictly validated on both frontend routes and backend controllers.
- **Sanitized Inputs**: All database inputs are sanitized and type-checked against Mongoose ObjectIds to avoid injection and CastErrors.
- **Production Headers**: X-Frame-Options, X-Content-Type-Options, and X-XSS-Protection enabled.

---

## 📄 License
This project is licensed under the MIT License.
