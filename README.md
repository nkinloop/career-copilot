# Career Copilot

> An AI-powered career assistant for resume intelligence, job discovery, resume-job matching, interview preparation, and personalized career planning.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google)](https://ai.google.dev/)

---

## Overview

Career Copilot is an AI-powered career workspace built with **Next.js**.

The application combines resume intelligence, job discovery, AI-powered recommendations, interview preparation, and career planning into a single platform.

The goal is to provide users with a centralized workspace where they can understand their professional profile, evaluate career opportunities, and receive AI-assisted guidance.

---

## Features

### Resume Management

- Upload PDF resumes
- Server-side PDF validation
- 5 MB upload limit
- Secure server-generated filenames
- Private resume storage
- Authenticated resume downloads
- Resume ownership validation
- AI-powered resume analysis
- Resume skill extraction and evaluation

### AI Career Copilot

Career Copilot uses Google's Gemini API for several AI-powered features:

- Resume analysis
- Job recommendations
- Resume-job matching
- Interview preparation
- Career roadmap generation
- Career-related conversational assistance

### Job Discovery

Users can:

- Browse available job opportunities
- View job details
- Evaluate resume-job compatibility
- Generate personalized job recommendations
- Analyze how their skills align with specific roles

### Interview Preparation

The application can generate AI-powered interview preparation material based on a user's career profile and target job.

### Career Roadmaps

Users can generate personalized career roadmaps designed around their current skills, career information, and target direction.

### User Profile & Skills

Users can manage career-related information and skills that are used by the application to personalize recommendations and AI-generated content.

### Authentication

The application uses **NextAuth** for authentication.

Protected API routes derive the authenticated user's identity from the server-side session instead of trusting user IDs supplied by the client.

### Interface

The application uses a modern dark interface with a glassmorphism-inspired visual design.

---

# Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide React
- Next Themes

## Backend

- Next.js App Router
- Next.js API Routes
- NextAuth
- Google Gemini API

## Database

- PostgreSQL
- Prisma ORM
- Prisma PostgreSQL Adapter

## Resume Processing

- `unpdf`
- Server-side filesystem storage
- PDF validation
- Secure file handling

---

# Architecture

At a high level, Career Copilot follows this flow:

```text
                    ┌─────────────────────┐
                    │        User         │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js Frontend  │
                    │  React + Tailwind   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js API Routes│
                    │                     │
                    │ Authentication      │
                    │ Authorization       │
                    │ Business Logic      │
                    └───────┬───────┬─────┘
                            │       │
                 ┌──────────┘       └──────────┐
                 ▼                             ▼
       ┌──────────────────┐          ┌──────────────────┐
       │   PostgreSQL     │          │   Google Gemini  │
       │   + Prisma       │          │       API        │
       └─────────┬────────┘          └──────────────────┘
                 │
                 ▼
       ┌──────────────────┐
       │ Private Resume   │
       │ Storage          │
       └──────────────────┘
```

---

# Project Structure

```text
career-copilot/
├── app/                    # Next.js application
│   ├── api/                # Backend API routes
│   ├── dashboard/          # Dashboard pages
│   ├── onboarding/         # User onboarding
│   └── ...
├── components/             # Reusable UI components
├── lib/                    # Database, authentication and utilities
├── prisma/                 # Prisma schema and migrations
├── private/                # Private resume storage
├── public/                 # Public static assets
├── types/                  # TypeScript type definitions
├── auth.ts                 # NextAuth configuration
├── proxy.ts                # Protected route handling
├── package.json
├── prisma.config.ts
└── README.md
```

---

# Prerequisites

Before running Career Copilot locally, make sure you have:

- **Node.js 20 or later**
- **npm**
- **PostgreSQL**
- **Google Gemini API key**

Check your installed versions:

```bash
node --version
npm --version
```

---

# Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/nkinloop/career-copilot.git
cd career-copilot
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Create a `.env.local` file in the project root.

Add:

```env
DATABASE_URL="your_postgresql_connection_string"
DIRECT_URL="your_postgresql_direct_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
AUTH_SECRET="your_random_secret"
```

### Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL database connection |
| `DIRECT_URL` | Direct PostgreSQL connection used by Prisma |
| `GEMINI_API_KEY` | Google Gemini API access |
| `AUTH_SECRET` | Secret used for authentication and session security |

> **Important:** Use your own database credentials and Gemini API key when running the project locally. Never use another developer's credentials.

---

# Generate an Authentication Secret

You can generate a secure random authentication secret with:

```bash
openssl rand -base64 32
```

On Windows PowerShell:

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Use the generated value for:

```env
AUTH_SECRET="your_generated_secret"
```

---

# Database Setup

Career Copilot uses **PostgreSQL** with **Prisma ORM**.

The Prisma schema is located at:

```text
prisma/schema.prisma
```

Database migrations are stored in:

```text
prisma/migrations/
```

After configuring your PostgreSQL connection, apply the existing migrations:

```bash
npx prisma migrate deploy
```

Then generate the Prisma client:

```bash
npx prisma generate
```

Make sure your PostgreSQL database is running and the connection strings in your environment file are valid before running these commands.

---

# Run the Application

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

# Production Build

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

# Using Google Gemini

Several Career Copilot features use Google's Gemini API:

- Resume analysis
- Job recommendations
- Resume-job matching
- Interview preparation
- Career roadmap generation
- AI career assistance

The Gemini API key is accessed server-side through:

```env
GEMINI_API_KEY="your_gemini_api_key"
```

The API key should:

- Never be hardcoded into frontend code
- Never be committed to GitHub
- Never be exposed to the browser
- Be stored only in environment variables

To use the AI features locally, create your own Gemini API key and configure it in `.env.local`.

---

# Security

Career Copilot includes several server-side security protections.

## Authentication

Protected pages and API routes require authentication.

## Authorization

API routes derive the authenticated user's identity from the server-side session rather than trusting a user ID supplied by the client.

This helps prevent unauthorized access to another user's resources.

## Resume Security

Uploaded resumes are:

- Validated as PDFs
- Limited to 5 MB
- Stored using server-generated filenames
- Stored outside publicly accessible paths
- Accessible only through authenticated endpoints
- Checked for ownership before access

## PDF Validation

Uploaded files are validated server-side rather than relying only on the filename or MIME type.

## Path Traversal Protection

Resume file paths are resolved against controlled server directories and sanitized before filesystem access.

## API Error Handling

API responses avoid exposing sensitive internal information such as:

- Internal exception messages
- Raw AI/provider responses
- Database errors
- Filesystem errors
- Sensitive implementation details

## Server-Side Identity

Ownership-sensitive API operations derive the current user's ID from the authenticated server-side session.

Client-provided user IDs are not trusted for ownership decisions.

---

# Environment & Secrets

The following files should **never** be committed to GitHub:

```text
.env
.env.local
```

The repository's `.gitignore` excludes environment files.

Before pushing changes, verify that environment files are not tracked:

```bash
git ls-files .env .env.local
```

The command should return nothing.

> Never commit API keys, database passwords, authentication secrets, or other private credentials.

---

# Local Development

After cloning the repository, the typical workflow is:

```bash
git clone https://github.com/nkinloop/career-copilot.git
cd career-copilot
npm install
```

Configure your environment variables, set up PostgreSQL, and run:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

The application will then be available at:

```text
http://localhost:3000
```

---

# Development Commands

## Start Development Server

```bash
npm run dev
```

## Run Linter

```bash
npm run lint
```

## Create Production Build

```bash
npm run build
```

## Start Production Server

```bash
npm start
```

## Apply Prisma Migrations

```bash
npx prisma migrate deploy
```

## Generate Prisma Client

```bash
npx prisma generate
```

---

# Known Limitations

- Resume files currently use server-side filesystem storage.
- Local filesystem storage is not ideal for horizontally scaled production deployments.
- Production deployments should use persistent private/object storage for uploaded resumes.
- AI features depend on the configured Gemini API and its usage limits.
- Job availability depends on the job data sources configured by the application.
- AI-generated content should be reviewed by users and should not be treated as authoritative career advice.
- Rate limiting and additional production infrastructure can be added for larger-scale deployments.

---

# Future Improvements

Potential future improvements include:

- Cloud-based private resume storage
- Object storage integration
- Background processing for resume analysis
- Rate limiting for AI endpoints
- Additional job data sources
- Advanced job ranking and personalization
- Automated resume improvement suggestions
- More detailed career analytics
- Improved job application tracking
- Production deployment infrastructure
- Automated testing
- CI/CD pipeline
- Enhanced AI personalization

---

# Contributing

Contributions and suggestions are welcome.

For significant changes:

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run the linter.
5. Run the production build.
6. Commit your changes.
7. Open a pull request.

Example:

```bash
git checkout -b feature/your-feature
npm run lint
npm run build
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

---

# License

This project is currently provided for **educational and portfolio purposes**.

---

# Author

**Nishant Maurya**

GitHub:  
https://github.com/nkinloop

Repository:  
https://github.com/nkinloop/career-copilot

---

## Disclaimer

Career Copilot provides AI-assisted career information and recommendations.

AI-generated recommendations may contain inaccuracies and should be reviewed by the user before making career, employment, or application decisions.
