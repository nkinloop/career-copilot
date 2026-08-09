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
- Secure generated filenames
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
                    │      User           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js Frontend  │
                    │ React + Tailwind    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Next.js API Routes│
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
       └──────────────────┘          └──────────────────┘
                 │
                 ▼
       ┌──────────────────┐
       │ Private Resume   │
       │ Storage          │
       └──────────────────┘