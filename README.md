# Career Copilot 🚀

An AI-powered personal career workspace that helps job seekers manage their **resumes, skills, job opportunities, applications, interview preparation, and personalized career growth** from one place.

🔗 **Live Demo:** https://ca4ee4.vercel.app

---

## ✨ Features

### 📄 Resume Management

* Upload and manage multiple resumes.
* PDF validation with file-size limits.
* Secure user-specific resume storage.
* Resume files are stored using **Vercel Blob** for production-ready cloud storage.
* View uploaded resumes directly from the application.
* AI-powered resume analysis.

### 🤖 AI Resume Analysis

Career Copilot analyzes uploaded resumes and extracts:

* Professional summary
* Skills
* Strengths
* Weaknesses
* Experience
* Education
* Improvement suggestions

Detected skills can also be automatically associated with the user's skill profile.

### 🎯 Smart Job Matching

* Browse available job opportunities.
* View detailed job information.
* Analyze job descriptions.
* Match your skills against job requirements.
* Get AI-powered recommendations for suitable opportunities.

### 🧠 AI Career Copilot

An AI-powered workspace designed to provide personalized career assistance based on the user's career data.

### 📊 Dashboard

The dashboard provides an overview of:

* Career progress
* Resume information
* Skills
* Job applications
* Recommended opportunities
* Career insights

### 💼 Application Tracking

Track job applications and organize your job-search workflow from a centralized dashboard.

### 🛣️ Career Roadmap

Generate and manage a personalized career roadmap based on your skills, goals, and career direction.

### 🎤 Interview Preparation

Practice interview-related questions and use AI-powered assistance to prepare for job interviews.

### 🧩 Skill Management

* Track existing skills.
* Add and manage skills.
* Automatically save skills detected from resume analysis.
* Use skills for job matching and career recommendations.

### 🔐 Authentication

Secure authentication system with:

* Credentials-based authentication
* Password hashing with bcrypt
* Session management using NextAuth
* Protected application routes

---

## 🏗️ Tech Stack

### Frontend

* **Next.js 16**
* **React 19**
* **TypeScript**
* **Tailwind CSS**
* **Lucide React**

### Backend

* **Next.js App Router**
* **Next.js API Routes**
* **NextAuth.js**
* **Prisma ORM**

### Database

* **PostgreSQL**
* **Supabase PostgreSQL**
* **Prisma Client**
* **Prisma PostgreSQL Adapter**

### AI

* **Google Gemini API**
* **@google/genai**

Used for:

* Resume analysis
* Job analysis
* Job matching
* Career recommendations
* AI career assistance

### File Storage

* **Vercel Blob**

Resume files are stored in cloud storage instead of the server's local filesystem, making uploads compatible with Vercel's serverless deployment environment.

### PDF Processing

* **unpdf**

Used to extract text from uploaded PDF resumes before sending the relevant content to the AI model.

---

## 🏛️ Architecture

```text
                    ┌──────────────────────┐
                    │      Career Copilot  │
                    │      Next.js App     │
                    └──────────┬───────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
      ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
      │ Next.js API │   │  NextAuth   │   │ Gemini AI   │
      │   Routes    │   │             │   │             │
      └──────┬──────┘   └─────────────┘   └─────────────┘
             │
       ┌─────┴──────────────┐
       │                    │
       ▼                    ▼
┌───────────────┐    ┌───────────────┐
│    Prisma     │    │  Vercel Blob  │
│  PostgreSQL   │    │ Resume Storage│
└───────┬───────┘    └───────────────┘
        │
        ▼
┌─────────────────┐
│ Supabase        │
│ PostgreSQL      │
└─────────────────┘
```

---

## 📁 Project Structure

```text
career-copilot/
│
├── app/
│   ├── ai-copilot/
│   ├── applications/
│   ├── dashboard/
│   ├── interview/
│   ├── jobs/
│   ├── login/
│   ├── onboarding/
│   ├── profile/
│   ├── resume/
│   ├── roadmap/
│   ├── signup/
│   ├── skills/
│   │
│   └── api/
│       ├── ai-copilot/
│       ├── applications/
│       ├── auth/
│       ├── dashboard/
│       ├── interview/
│       ├── jobs/
│       ├── onboarding/
│       ├── profile/
│       ├── resumes/
│       ├── roadmap/
│       └── users/
│
├── components/
│   ├── dashboard/
│   └── ...
│
├── lib/
│   ├── ai-errors.ts
│   ├── current-user.ts
│   ├── prisma.ts
│   └── ...
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── .env.local
├── next.config.ts
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/nkinloop/career-copilot.git
cd career-copilot
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file:

```env
DATABASE_URL="your_postgresql_connection_string"

NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

GEMINI_API_KEY="your_gemini_api_key"

BLOB_READ_WRITE_TOKEN="your_vercel_blob_token"
```

Depending on the enabled authentication/database configuration, additional environment variables may be required.

> Never commit `.env`, `.env.local`, API keys, database credentials, or other secrets to GitHub.

---

## 🗄️ Database Setup

The project uses Prisma with PostgreSQL.

Generate the Prisma client:

```bash
npx prisma generate
```

Apply the database schema:

```bash
npx prisma db push
```

For development, you can inspect the database using:

```bash
npx prisma studio
```

---

## ▶️ Run the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 🏭 Production Build

The project uses the following build command:

```bash
npm run build
```

The build performs:

```text
Prisma Generate
      ↓
Next.js Production Build
```

Start the production server locally with:

```bash
npm start
```

---

## ☁️ Deployment

The application is deployed using **Vercel**.

### Vercel Configuration

Recommended settings:

```text
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Required Production Environment Variables

Configure the required environment variables in the Vercel project settings.

Important variables include:

```text
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
GEMINI_API_KEY
BLOB_READ_WRITE_TOKEN
```

The exact variables depend on the enabled services and authentication configuration.

---

## 📦 Resume Storage

Resume uploads originally used the server's local filesystem.

That approach works during local development but is not suitable for Vercel's serverless environment because deployed functions use a read-only filesystem for application files.

The project therefore uses:

```text
User
  ↓
Resume Upload
  ↓
Next.js API Route
  ↓
PDF Validation
  ↓
Vercel Blob
  ↓
Blob Storage Path saved in PostgreSQL
```

This allows resume files to persist independently of individual serverless function executions.

---

## 🔒 Security Considerations

Career Copilot includes several safeguards around resume uploads and user data.

### Resume validation

Uploaded files are checked for:

* PDF MIME type
* PDF magic bytes
* Maximum file size
* Authenticated user ownership

### User-specific storage

Resume files are stored using a user-specific path:

```text
userId/random-file-name.pdf
```

This prevents users from directly accessing another user's stored resume through the application's API.

### Environment variables

Sensitive credentials are stored through environment variables rather than being committed to source control.

---

## 🧪 API Overview

The application exposes API routes for major career-workspace functionality.

Examples include:

```text
/api/auth/*
/api/dashboard
/api/jobs
/api/jobs/[id]
/api/jobs/[id]/analyze
/api/jobs/[id]/match
/api/jobs/[id]/recommend
/api/resumes
/api/resumes/[id]/analyze
/api/resumes/[id]/file
/api/resumes/upload
/api/applications
/api/interview
/api/onboarding
/api/profile
/api/roadmap
/api/users/me/skills
```

These APIs connect the frontend with authentication, PostgreSQL, AI services, resume storage, and career-management functionality.

---

## 📄 Resume AI Analysis Flow

```text
Upload Resume
      │
      ▼
Validate PDF
      │
      ▼
Upload to Vercel Blob
      │
      ▼
Save Storage Path in PostgreSQL
      │
      ▼
Retrieve Resume
      │
      ▼
Extract PDF Text using unpdf
      │
      ▼
Send Resume Text to Gemini
      │
      ▼
Structured AI Analysis
      │
      ├── Summary
      ├── Skills
      ├── Strengths
      ├── Weaknesses
      ├── Experience
      ├── Education
      └── Suggestions
      │
      ▼
Save Detected Skills
```

---

## 🎯 Project Goals

Career Copilot is designed to reduce the fragmentation of the modern job-search process.

Instead of using separate tools for:

* Resume management
* Job searching
* Application tracking
* Interview preparation
* Skill tracking
* Career planning

Career Copilot brings these workflows together into one AI-powered workspace.

---

## 🚀 Future Improvements

Potential future enhancements include:

* Advanced job recommendation algorithms
* Automated application tracking
* Calendar-based interview scheduling
* AI-generated cover letters
* Resume optimization for individual job descriptions
* ATS compatibility scoring
* More detailed career analytics
* GitHub and LinkedIn profile integration
* Automated job alerts
* Advanced interview simulations
* Personalized learning recommendations
* Multi-resume comparison
* Resume version history

---

## 🧑‍💻 Development

### Useful commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Generate Prisma Client
npx prisma generate

# Update database schema
npx prisma db push

# Open Prisma Studio
npx prisma studio

# Production build
npm run build

# Start production server
npm start

# Run lint
npm run lint
```

---

## 📌 Current Deployment

**Production:** https://ca4ee4.vercel.app

**Repository:** https://github.com/nkinloop/career-copilot

---

## 👨‍💻 Author

**Nishant Maurya**

Built as an AI-powered career management and job-search platform using modern full-stack technologies.

---

## ⭐ Acknowledgements

Built with:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Prisma
* PostgreSQL
* Supabase
* Vercel
* Google Gemini
* NextAuth
* unpdf

---

## 📜 License

This project is currently intended as a personal/portfolio project.
