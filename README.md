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

Project Structure


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

Prerequisites

Before running Career Copilot locally, make sure you have:

Node.js 20 or later
npm
PostgreSQL
A Google Gemini API key

Check your installed versions:

node --version
npm --version

Getting Started
1. Clone the repository
git clone https://github.com/nkinloop/career-copilot.git
cd career-copilot
2. Install dependencies
npm install

3. Configure environment variables

Create a .env.local file in the project root.

DATABASE_URL="your_postgresql_connection_string"
DIRECT_URL="your_postgresql_direct_connection_string"
GEMINI_API_KEY="your_gemini_api_key"
AUTH_SECRET="your_random_secret"
Environment Variables
Variable	Purpose
DATABASE_URL	PostgreSQL database connection
DIRECT_URL	Direct PostgreSQL connection used by Prisma
GEMINI_API_KEY	Google Gemini API access
AUTH_SECRET	Secret used for authentication/session security
Important: Use your own API keys and database credentials when running the project locally. Never use or request another developer's credentials.

Generate an authentication secret

You can generate a secure random secret with:
openssl rand -base64 32
On Windows PowerShell, you can also use:

[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

Database Setup

Career Copilot uses PostgreSQL with Prisma ORM.

The Prisma schema is located at:

prisma/schema.prisma

Database migrations are stored in:

prisma/migrations/

After configuring your PostgreSQL connection, apply the existing migrations:

npx prisma migrate deploy

Then generate the Prisma client:

npx prisma generate

Make sure your PostgreSQL database is running and the connection strings in your environment file are valid before running the migration commands.

Run the Application

Start the development server:

npm run dev

Then open:

http://localhost:3000
Production Build

To create a production build:

npm run build

Start the production server:

npm start
Using Google Gemini

Several Career Copilot features use Google's Gemini API, including:

Resume analysis
Job recommendations
Resume-job matching
Interview preparation
Career roadmap generation
AI career assistance

The Gemini API key is accessed server-side through:

GEMINI_API_KEY="your_gemini_api_key"

The key should never be hardcoded into frontend code or committed to GitHub.

To use the AI features locally, developers should create their own Gemini API key and configure it in their local environment.

Security

Career Copilot includes multiple server-side security protections.

Authentication

Protected pages and API routes require authentication.

Authorization

API routes derive the authenticated user's identity from the server-side session rather than trusting a user ID supplied by the client.

Resume Security

Uploaded resumes are:

Validated as PDFs
Limited to 5 MB
Stored using server-generated filenames
Stored outside publicly accessible paths
Accessible only through authenticated endpoints
Checked for ownership before access
Path Traversal Protection

Resume file paths are resolved against controlled server directories and sanitized before filesystem access.

API Error Handling

API responses avoid exposing:

Internal exception messages
Raw AI/provider responses
Database errors
Filesystem errors
Sensitive implementation details
Environment & Secrets

The following files should never be committed:

.env
.env.local

The repository's .gitignore already excludes environment files.

Before pushing changes to GitHub, verify that secrets are not tracked:

git ls-files .env .env.local

The command should return nothing.

Known Limitations
Resume files currently use server-side filesystem storage.
Local filesystem storage is not ideal for horizontally scaled production deployments.
AI features depend on the configured Gemini API and its usage limits.
Job availability depends on the job data sources configured by the application.
Production deployments should use persistent private/object storage for uploaded files.
AI-generated content should be reviewed by users rather than treated as authoritative career advice.
Future Improvements

Potential future improvements include:

Cloud-based private resume storage
Object storage integration
Background processing for resume analysis
Rate limiting for AI endpoints
Additional job data sources
Advanced job ranking and personalization
Automated resume improvement suggestions
More detailed career analytics
Improved job application tracking
Production deployment infrastructure
Automated testing and CI/CD
Development

Run the linter with:

npm run lint

Create a production build before submitting significant changes:

npm run build
Contributing

Contributions and suggestions are welcome.

For significant changes:

Fork the repository.
Create a feature branch.
Make your changes.
Run the linter and build.
Commit your changes.
Open a pull request.

Example:

git checkout -b feature/your-feature
npm run lint
npm run build
License

This project is currently provided for educational and portfolio purposes.

Author

Nishant Maurya

GitHub:
https://github.com/nkinloop

Repository:
https://github.com/nkinloop/career-copilot

