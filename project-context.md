# Career Copilot — Project Context & Development Handoff

## 1. Project Overview

We are building an AI-powered full-stack web application called **Career Copilot**.

The goal is to create a platform that helps students/job seekers manage their complete career/job-search journey.

Core idea:

```text
User
 ↓
Career Profile
 ↓
Resume
 ↓
AI Resume Analysis
 ↓
Jobs
 ↓
Job Match
 ↓
Skill Gap Analysis
 ↓
Career Roadmap
 ↓
Application Tracking
 ↓
Interview Preparation
 ↓
AI Career Copilot
```

The project is being built **from scratch**, and the developer/user is still learning programming and full-stack development.

Therefore, every step must be explained clearly before asking the user to execute commands or write code.

---

# 2. Development Philosophy

The project must be built incrementally.

Do NOT dump a huge amount of code at once.

For every new concept:

1. Explain what it is.
2. Explain why we need it.
3. Show where it belongs in the architecture.
4. Give the exact command/code.
5. Ask the user to execute it.
6. Verify the result.
7. Only then continue.

If an error occurs:

* Ask the user to paste the complete error.
* Explain the cause.
* Give the fix.
* Don't make the user randomly install packages or change configuration.

The user wants to understand the project, not merely copy/paste code.

---

# 3. Current Technology Stack

Current stack:

* Next.js
* React
* TypeScript
* Tailwind CSS
* ESLint
* npm
* Git

Planned technologies/features will be added gradually:

* PostgreSQL
* Prisma
* Authentication
* AI integration
* Resume/file processing
* Job APIs
* Application tracking
* Interview system
* AI career assistant
* Possibly object/file storage

Do NOT install all of these at once.

We are currently only working on the frontend/application foundation.

---

# 4. User's Development Environment

Operating system:

```text
Windows
```

Installed versions at project start:

```text
Node.js: v24.16.0
npm: 11.13.0
Git: 2.55.0.windows.3
VS Code: 1.132.0
```

Project location:

```text
C:\Users\maury\OneDrive\Desktop\career-copilot
```

The user is using PowerShell inside VS Code.

---

# 5. Project Creation

The project was created using:

```powershell
npx create-next-app@latest .
```

The Next.js installer was asked:

```text
Would you like to use the recommended Next.js defaults?
```

User selected:

```text
Yes, use recommended defaults
```

Installation succeeded.

Output included:

```text
added 358 packages
found 0 vulnerabilities
Success! Created career-copilot
```

The generated application is using the modern Next.js App Router and Tailwind setup.

---

# 6. Development Server

The development server is currently run with:

```powershell
npm run dev
```

Application URL:

```text
http://localhost:3000
```

The user successfully confirmed that the application runs.

To stop the development server:

```text
Ctrl + C
```

---

# 7. React Concepts Already Explained

The user has already been introduced to:

## React components

Example:

```tsx
function Welcome() {
  return <h1>Welcome to Career Copilot</h1>;
}
```

Components are reusable UI pieces.

## JSX

Example:

```tsx
return <h1>Career Copilot</h1>;
```

JSX allows UI markup-like syntax inside TypeScript/JavaScript.

## Props

Example:

```tsx
function ScoreCard({ title, score }) {
  return (
    <div>
      <h2>{title}</h2>
      <p>{score}%</p>
    </div>
  );
}
```

Usage:

```tsx
<ScoreCard title="Resume" score={82} />
```

## State

The user has been introduced to:

```tsx
const [open, setOpen] = useState(false);
```

State will later be used for things such as:

* sidebar toggling
* search
* upload progress
* interview questions
* modals
* filters

## Server vs Client Components

The user has been introduced to the concept that Next.js App Router components are Server Components by default.

Client components are needed for browser-side interactivity/state and use:

```tsx
"use client";
```

This should be explained in detail when it becomes relevant rather than prematurely.

---

# 8. Current Project Structure

Current important structure:

```text
career-copilot/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── Navbar.tsx
│   └── Sidebar.tsx
│
├── public/
├── node_modules/
│
├── package.json
├── package-lock.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
├── next-env.d.ts
├── .gitignore
└── README.md
```

---

# 9. Important Files Already Explained

## app/page.tsx

Represents the homepage route:

```text
/
```

## app/layout.tsx

Root/shared application layout.

It contains:

* Navbar
* Sidebar
* `{children}`

The current architecture is:

```text
layout.tsx
│
├── Navbar
│
├── Sidebar
│
└── children
      │
      └── page.tsx
```

`children` represents the current route/page.

## components/

Contains reusable UI components.

Currently:

```text
components/
├── Navbar.tsx
└── Sidebar.tsx
```

## public/

Static files.

## node_modules/

Installed npm packages.

Never manually edit it.

## package.json

Contains:

* project metadata
* dependencies
* scripts

The user has learned that:

```powershell
npm run dev
```

uses the `dev` script from `package.json`.

---

# 10. Current Navbar

File:

```text
components/Navbar.tsx
```

Current code:

```tsx
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-bold">Career Copilot</h1>

      <div>
        <span>Welcome 👋</span>
      </div>
    </nav>
  );
}
```

This is currently a basic placeholder navbar.

It will later become a proper application navbar.

---

# 11. Current Sidebar

File:

```text
components/Sidebar.tsx
```

Current code:

```tsx
export default function Sidebar() {
  return (
    <aside className="w-64 border-r min-h-screen p-4">
      <nav className="space-y-2">
        <div>🏠 Dashboard</div>
        <div>📄 Resume</div>
        <div>💼 Jobs</div>
        <div>🧠 Skills</div>
        <div>🗺️ Career Roadmap</div>
        <div>📋 Applications</div>
        <div>🎤 Interview Prep</div>
        <div>🤖 AI Copilot</div>
      </nav>
    </aside>
  );
}
```

This is currently a static placeholder.

It will later become:

* clickable
* route-aware
* responsive
* styled properly
* possibly collapsible

---

# 12. Current app/layout.tsx

The intended current layout code is:

```tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Career Copilot",
  description: "Your AI-powered career assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        <div className="flex">
          <Sidebar />

          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

IMPORTANT:

The previous assistant asked the user to apply this change and then confirm:

```text
layout working
```

The user has not yet explicitly confirmed this final layout change.

Therefore, the next chat should FIRST ask/check whether the user has applied the layout change successfully before moving on.

---

# 13. Current app/page.tsx

After moving Navbar and Sidebar into the root layout, intended homepage code is:

```tsx
export default function Home() {
  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold">
        Welcome to Career Copilot
      </h1>

      <p className="mt-2 text-gray-600">
        Your AI-powered career assistant.
      </p>
    </section>
  );
}
```

Again, verify that the user has actually applied this version.

---

# 14. Architecture Direction

The application will eventually have routes similar to:

```text
/
├── dashboard
├── resume
├── jobs
├── applications
├── skills
├── roadmap
├── interview
└── ai-copilot
```

Likely structure:

```text
app/
│
├── layout.tsx
├── page.tsx
│
├── dashboard/
│   └── page.tsx
│
├── resume/
│   └── page.tsx
│
├── jobs/
│   └── page.tsx
│
├── applications/
│   └── page.tsx
│
├── skills/
│   └── page.tsx
│
├── roadmap/
│   └── page.tsx
│
├── interview/
│   └── page.tsx
│
└── ai-copilot/
    └── page.tsx
```

The user has been told that Next.js uses file-system based routing.

For example:

```text
app/dashboard/page.tsx
```

becomes:

```text
/dashboard
```

---

# 15. Planned Career Copilot Features

The MVP should eventually include:

## Authentication

* Sign up
* Login
* Logout
* User profile
* Protected dashboard

## Career Profile

* Name
* Education
* Experience
* Target role
* Location
* Skills
* Experience level

## Resume

* Upload resume
* Store resume
* Extract resume text
* Analyze resume
* Resume score
* Missing skills
* Improvement suggestions

## Jobs

* Search jobs
* Filters
* Job cards
* Job details
* Match percentage
* Required skills
* User skill comparison

## Applications

Track:

```text
Saved
Applied
Interview
Offer
Rejected
```

with dates and notes.

## Skills

Show:

* Current skills
* Required skills
* Missing skills
* Skill progress

## Career Roadmap

AI-generated roadmap based on:

* target role
* current skills
* missing skills
* experience
* resume

## Interview Prep

* Generate questions
* Practice answers
* AI feedback
* Technical interview
* Behavioral interview

## AI Career Copilot

The user can ask questions such as:

```text
What skills am I missing for a Data Analyst role?

Which jobs should I apply to?

How can I improve my resume?

Create a 30-day learning plan.

What should I prepare for my interview?
```

The AI should eventually use the user's stored career data rather than acting as a generic chatbot.

---

# 16. Future Full-Stack Architecture

Eventually the architecture should roughly become:

```text
                    Browser
                       │
                       ▼
                Next.js Frontend
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
       Next.js Server       API / Server Logic
             │                   │
             └─────────┬─────────┘
                       │
          ┌────────────┼────────────┐
          │            │            │
          ▼            ▼            ▼
      PostgreSQL      AI API      Job APIs
          │
          ▼
       Prisma ORM
```

Potential file structure later:

```text
app/
components/
lib/
services/
prisma/
types/
public/
```

But do NOT create all these folders immediately.

Build them when the relevant functionality is introduced.

---

# 17. Current Learning Level

The user is still learning:

* C++
* JavaScript/Node.js
* full-stack development
* command line
* project structure

Therefore explanations should be beginner-friendly but should not oversimplify important architecture.

Use analogies where helpful.

Always explain:

```text
WHAT
WHY
WHERE
HOW
```

before introducing a new technology.

---

# 18. Immediate Next Step

The immediate next task is:

## Verify the new root layout.

User was instructed to:

1. Update `app/layout.tsx` to include Navbar and Sidebar.
2. Simplify `app/page.tsx`.
3. Save.
4. Verify `http://localhost:3000`.

If successful, proceed to:

# Phase 0.8 — Create `/dashboard`

Create:

```text
app/dashboard/page.tsx
```

This will teach the user:

* Next.js routing
* folder-based routes
* page components
* navigation
* why the shared layout persists

Then start building the actual dashboard UI.

---

# 19. Development Rule

Do NOT jump immediately into AI/database/authentication.

Recommended progression:

```text
Phase 0
Project setup
       ↓
Phase 1
React + Next.js fundamentals
       ↓
Phase 2
Application UI
       ↓
Phase 3
Routing
       ↓
Phase 4
Authentication
       ↓
Phase 5
Database
       ↓
Phase 6
Career profile
       ↓
Phase 7
Resume upload & analysis
       ↓
Phase 8
Jobs
       ↓
Phase 9
Job matching
       ↓
Phase 10
Applications
       ↓
Phase 11
Skills & roadmap
       ↓
Phase 12
Interview system
       ↓
Phase 13
AI Career Copilot
       ↓
Phase 14
Testing
       ↓
Phase 15
Deployment
```

The exact technologies may be adjusted as the project develops.

---

# 20. Important Instruction for Future Chat

If this document is provided to a new ChatGPT conversation, continue from the **Immediate Next Step** rather than restarting the project.

Do NOT tell the user to recreate the project or reinstall Node.js/Next.js unless an actual problem requires it.

The user wants to build this project from scratch with detailed guidance and wants to understand the architecture and code while building it.
