# ATS Resume Builder & Analyzer 🚀

A production-grade, full-stack **MERN** application designed to help job seekers build ATS-compliant resumes, score them against real job descriptions, identify missing keywords, and export vectorized, parseable PDFs.

Built with a **luxury editorial pure-white UI**, responsive floating navigation, and a heuristic ATS scoring engine.

---

## 🌟 Key Highlights

- 📄 **16+ ATS-Optimized Templates**: Designed for engineering, product, executive, creative, and consulting roles with single and two-column layouts.
- 🎯 **Real-Time ATS Scoring Engine (0–100%)**: Heuristic algorithm that evaluates keyword density, required vs. preferred skills, action verbs, measurable impact, and section completeness.
- 🔍 **Job Description Keyword Diagnostics**: Paste any job description to instantly see matched skills, missing terms, and actionable recommendations with one-click keyword copying.
- ⚡ **Interactive Resume Builder**: Drag-and-drop section ordering, rich bullet-point editing, real-time A4 document canvas with zoom controls, font switching, and auto-save.
- 🖨️ **Text-Selectable Vectorized PDF Export**: Generates clean, parser-friendly PDFs that pass Workday, Taleo, Greenhouse, and Lever screeners with 100% fidelity.
- 🔒 **Secure Authentication**: JWT-based authentication with bcrypt password hashing, session persistence, and secure token-based password reset workflows.
- 🎨 **Luxury Editorial Design System**: Pure crisp white canvas (`#FFFFFF`), high-contrast typography (Google Fonts *Newsreader* & *Plus Jakarta Sans*), subtle botanical accents, and smooth micro-interactions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Framer Motion, Lucide Icons, Axios, React Hot Toast |
| **Styling** | Vanilla CSS Design System with CSS Variables (Pure White Aesthetic & Editorial Typography) |
| **Backend** | Node.js, Express.js, REST API Architecture |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT), Bcrypt.js password hashing |
| **Validation & Security**| Zod schema validation, Helmet security headers, CORS |
| **Email Service** | Nodemailer (SMTP / Brevo API integration for password reset) |

---

## 📁 Repository Structure

```
ATS-Resume-Builder/
├── client/                     # Frontend React SPA (Vite)
│   ├── public/                 # Static assets & icons
│   └── src/
│       ├── api/                # Axios API client & error handlers
│       ├── components/         # Shared UI components
│       │   ├── builder/        # Form blocks (Personal, Experience, Skills, etc.)
│       │   ├── templates/      # 16+ ATS Resume Template definitions & CSS
│       │   ├── Navbar.jsx      # Floating responsive navigation bar
│       │   ├── Footer.jsx      # Full-width responsive footer
│       │   └── ScoreRing.jsx   # Animated SVG ATS score gauge
│       ├── context/            # AuthContext & global state
│       ├── lib/                # ATS scoring helpers & default presets
│       ├── pages/              # Landing, Dashboard, Builder, Analyzer, Auth, Admin
│       ├── App.jsx             # Route definitions & guards
│       ├── index.css           # Global design tokens & editorial styling
│       └── main.jsx            # React root mount
│
├── server/                     # Backend API (Node.js & Express)
│   └── src/
│       ├── config/             # MongoDB connection configuration
│       ├── controllers/        # Auth, Resume, ATS analysis controllers
│       ├── middleware/         # Auth verification, rate limiting, error handlers
│       ├── models/             # Mongoose schemas (User, Resume)
│       ├── routes/             # API routes (/api/auth, /api/resumes, /api/ats)
│       ├── services/           # atsAnalyzer (Heuristic ATS scoring & JD parser)
│       ├── utils/              # Email transporter & Zod schemas
│       ├── seed.js             # Database seeder with demo resumes & users
│       └── index.js            # Express server entry point
│
├── .env.example                # Example environment variables
├── package.json                # Monorepo root workspace scripts
└── README.md                   # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance or free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/zaid154/ATS-Resume-Builder.git
cd ATS-Resume-Builder
```

---

### Step 2: Install Dependencies

Install root, client, and server dependencies with a single command:

```bash
npm run install:all
```

---

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in your configuration:

```env
# Server Configuration
PORT=5001
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# Database
MONGO_URI=mongodb://127.0.0.1:27017/ats_resume
# OR MongoDB Atlas URI:
# MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/ats_resume?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRES=7d

# Email / Password Reset (Optional for local dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="ATS Resume <no-reply@atsresume.com>"
```

---

### Step 4: Seed Demo Data (Optional)

Populate the database with pre-built resumes and sample users:

```bash
npm run seed --prefix server
```

---

### Step 5: Start Development Servers

Run both the frontend (Vite) and backend (Express) concurrently:

```bash
npm run dev
```

- **Frontend Client**: `http://localhost:3000`
- **Backend API**: `http://localhost:5001/api/health`

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Login with email & password |
| `GET` | `/api/auth/me` | Private | Get authenticated user profile |
| `POST` | `/api/auth/forgot-password` | Public | Send password reset link via email |
| `POST` | `/api/auth/reset-password/:token` | Public | Reset password with token |

### 📄 Resumes (`/api/resumes`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/resumes` | Private | Fetch all resumes for current user |
| `POST` | `/api/resumes` | Private | Create a new resume |
| `GET` | `/api/resumes/:id` | Private | Retrieve a single resume by ID |
| `PUT` | `/api/resumes/:id` | Private | Update resume content (Auto-save) |
| `POST` | `/api/resumes/:id/duplicate` | Private | Duplicate an existing resume |
| `DELETE` | `/api/resumes/:id` | Private | Delete a resume |

### 🎯 ATS Scoring & Analysis (`/api/ats`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ats/analyze` | Private | Score resume against a Job Description (`{ resumeId, jobDescription }`) |

---

## 🧠 How the ATS Scoring Algorithm Works

The built-in ATS engine (`server/src/services/atsAnalyzer.js`) runs independent of third-party AI rate limits, delivering instant, reproducible evaluation:

```
Total ATS Score (100%) =
  ├── Keyword & Skill Alignment (40%)  → Normalized term matching & synonyms
  ├── Measurable Impact (15%)          → Quantified metrics, % boosts, $ savings
  ├── Section Completeness (15%)       → Experience, Skills, Education, Summary
  ├── Action Verbs & Syntax (12%)      → Strong active verbs starting every bullet
  ├── Contact Information (10%)        → Email, phone, location, LinkedIn/GitHub
  └── Word Count & Density (8%)        → Optimal length (400–900 words)
```

---

## 📦 Production Deployment

To create an optimized production build:

```bash
# Build frontend bundle
npm run build --prefix client

# Start production server
npm start --prefix server
```

The compiled static assets in `client/dist` can be served directly by Express, Nginx, Vercel, or AWS S3/CloudFront.

---

## 👨‍💻 Author & Credits

- **Developer**: Mohd Zaid
- **GitHub**: [@zaid154](https://github.com/zaid154)
- **Portfolio**: [portfolio-zeta-drab-97.vercel.app](https://portfolio-zeta-drab-97.vercel.app/)
- **Email**: [trendykart.app@gmail.com](mailto:trendykart.app@gmail.com) · [zaidm1323@gmail.com](mailto:zaidm1323@gmail.com)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
