# Career Copilot

An AI-powered career assistant built with Next.js that helps users analyze resumes, discover relevant job opportunities, evaluate job-resume compatibility, and prepare for their career journey.

## Overview

Career Copilot is designed as a personal AI-powered workspace for career development.

The application combines resume intelligence, job discovery, AI-powered recommendations, interview preparation, and career planning into a single platform.

### What it can do

- Upload and securely store resumes
- Analyze resumes using Google Gemini
- Extract and evaluate skills and career information
- Discover relevant job opportunities
- Match resumes against job descriptions
- Generate job recommendations
- Generate interview preparation material
- Generate personalized career roadmaps
- Provide an AI career copilot for career-related questions
- Manage user skills and career information
- Secure user authentication and authorization
- Provide a dark, glassmorphism-inspired interface

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

### AI Career Copilot

Career Copilot uses Google's Gemini API to provide AI-powered functionality including:

- Resume analysis
- Job recommendations
- Resume-job matching
- Interview preparation
- Career roadmap generation
- Career-related conversational assistance

### Job Discovery

Users can browse available job opportunities and evaluate how well their profile matches specific roles.

### Authentication

The application uses NextAuth for authentication and maintains user-specific data securely.

Protected API routes derive the authenticated user's identity from the server-side session rather than trusting user IDs supplied by the client.

### Security

The application includes several security measures:

- Server-side authentication
- API authorization checks
- User ownership validation
- Private resume storage
- Secure server-generated filenames
- PDF magic-byte validation
- File-size restrictions
- Path traversal protection
- Sanitized API error responses
- Protection against exposing raw AI/provider errors
- Server-side identity derivation
- Protected resume download endpoints

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
- Prisma PostgreSQL adapter

## Resume Processing

- PDF parsing with `unpdf`
- Server-side filesystem storage

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

## Project Structure

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
node --version
npm --version

1. Clone the repository
git clone https://github.com/nkinloop/career-copilot.git
cd career-copilot
2. Install dependencies
npm install

3. Configure Environment Variables
Create a .env.local file in the project root.
Add the following variables:
**DATABASE_URL="your_postgresql_connection_string"
DIRECT_URL="your_postgresql_direct_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
AUTH_SECRET="your_random_secret"**

Environment Variables

| Variable         | Purpose                                             |
| ---------------- | --------------------------------------------------- |
| `DATABASE_URL`   | PostgreSQL database connection                      |
| `DIRECT_URL`     | Direct PostgreSQL connection used by Prisma         |
| `GEMINI_API_KEY` | Google Gemini API access                            |
| `AUTH_SECRET`    | Secret used for authentication and session security |

Important: Use your own API keys and database credentials when running the project locally. Never use or request another developer's credentials.

Generate an Authentication Secret
You can generate a secure random secret with:
openssl rand -base64 32
On Windows PowerShell, you can also use:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
**Database Setup**
Career Copilot uses PostgreSQL with Prisma ORM.
The Prisma schema is located at:
