# Marine Care - System Architecture

> Complete system architecture documentation for the Marine Care application

**Last Updated:** November 2024  
**Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Component Diagram](#component-diagram)
4. [Data Flow Diagrams](#data-flow-diagrams)
5. [Technology Stack](#technology-stack)
6. [Infrastructure](#infrastructure)
7. [Scalability Considerations](#scalability-considerations)

---

## Overview

Marine Care is an AI-powered Progressive Web App designed to help volunteers participate in shoreline cleanup efforts. The application enables users to:

- Upload photos of collected trash with AI-powered classification
- Join and participate in cleanup challenges
- Track personal and community cleanup impact
- Earn badges and achievements for participation
- View leaderboards and community statistics

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend Framework | Next.js 15 (React 19) | SSR, SEO, PWA support |
| Backend Framework | Express.js | Simple REST API, Node.js ecosystem |
| Database | MongoDB Atlas | Document flexibility, geospatial queries |
| Authentication | Firebase Auth | Secure, managed auth service |
| AI Classification | Hugging Face/Transformers | On-demand trash classification |
| Image Storage | GridFS (MongoDB) | Integrated with database |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser/PWA)                         │
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │   Dashboard     │  │   Challenges    │  │     Upload      │     │
│  │   (Analytics)   │  │  (Browse/Join)  │  │  (AI/Manual)    │     │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘     │
│           │                    │                     │               │
│           └────────────────────┴─────────────────────┘               │
│                              │                                       │
│                   ┌──────────▼──────────┐                           │
│                   │   Firebase Auth     │                           │
│                   │  (Google Sign-in)   │                           │
│                   └──────────┬──────────┘                           │
└──────────────────────────────┼──────────────────────────────────────┘
                               │ ID Token
                               │
                    ═══════════▼════════════
                    HTTP REST API (Axios)
                    ═══════════▼════════════
                               │
┌──────────────────────────────▼──────────────────────────────────────┐
│                         BACKEND (Node.js/Express)                    │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    MIDDLEWARE LAYER                          │  │
│  │                                                              │  │
│  │  ┌───────────────────┐  ┌────────────────┐  ┌─────────────┐ │  │
│  │  │ verifyFirebase   │→ │ ensureUser     │→ │   Error     │ │  │
│  │  │     Token        │  │   Exists       │  │  Handling   │ │  │
│  │  └───────────────────┘  └────────────────┘  └─────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                               │                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    ROUTES & CONTROLLERS                      │  │
│  │                                                              │  │
│  │  challengeRoutes ────▶ challengeController                  │  │
│  │  cleanupRoutes ──────▶ cleanupController                    │  │
│  │  dashboardRoutes ────▶ dashboardController                  │  │
│  │  profileRoutes ──────▶ profileController                    │  │
│  │  achievementsRoutes ─▶ achievementsController               │  │
│  │  authRoutes ─────────▶ authController                       │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                               │                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    BUSINESS LOGIC SERVICES                   │  │
│  │                                                              │  │
│  │  aiService ────────────▶ Classify trash images              │  │
│  │  fileService ──────────▶ GridFS image storage               │  │
│  │  updateUserStats() ────▶ Increment user totals              │  │
│  │  updateChallengeStats()▶ Update challenge data              │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                               │                                     │
└───────────────────────────────┼─────────────────────────────────────┘
                                │
                     ═══════════▼════════════
                        MongoDB Connection
                     ═══════════▼════════════
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                       DATABASE (MongoDB Atlas)                       │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │    users     │  │  challenges  │  │   cleanups   │              │
│  ├──────────────┤  ├──────────────┤  ├──────────────┤              │
│  │ firebaseUid  │  │ title        │  │ userId       │              │
│  │ name         │  │ status       │  │ challengeId  │              │
│  │ email        │  │ goal         │  │ itemCount    │              │
│  │ totalItems   │  │ totalTrash   │  │ classification│             │
│  │ joinedChallenges│totalVolunteers│ logType      │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     GridFS (Image Storage)                   │  │
│  │                                                              │  │
│  │  fs.files ──────────▶ Metadata (filename, contentType)      │  │
│  │  fs.chunks ─────────▶ Binary image chunks                   │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Diagram

### Frontend Components

```
Frontend (Next.js 15 / React 19)
│
├── Pages (App Router)
│   ├── / (Landing Page)
│   ├── /login
│   ├── /signup
│   ├── /dashboard
│   ├── /challenges
│   ├── /challenges/[id]
│   ├── /upload
│   ├── /profile
│   └── /achievements
│
├── Components
│   ├── Common (Navbar, Footer, Loader)
│   ├── Cards (ChallengeCard, AchievementCard)
│   ├── Sections (Hero, Stats, CTA)
│   └── Auth (withAuth HOC)
│
├── Context
│   ├── AuthContext (Firebase user state)
│   └── JoinedChallengesContext
│
├── Hooks
│   └── useAuth (login, signup, logout)
│
├── Theme
│   ├── palette (colors)
│   └── typography (fonts)
│
└── Utils
    ├── api.js (API calls with auth)
    └── validation.js
```

### Backend Components

```
Backend (Node.js / Express)
│
├── Routes
│   ├── authRoutes (/api/auth/*)
│   ├── challengeRoutes (/api/challenges/*)
│   ├── cleanupRoutes (/api/cleanups/*)
│   ├── dashboardRoutes (/api/dashboard/*)
│   ├── profileRoutes (/api/profile/*)
│   ├── achievementsRoutes (/api/achievements/*)
│   ├── homeRoutes (/api/home/*)
│   └── imageRoutes (/api/images/*)
│
├── Controllers
│   ├── authController
│   ├── challengeController
│   ├── cleanupController
│   ├── dashboardController
│   ├── profileController
│   ├── achievementsController
│   └── homeController
│
├── Middleware
│   ├── authMiddleware (Firebase token verification)
│   ├── userMiddleware (MongoDB user sync)
│   ├── rateLimiter (brute force protection)
│   └── errorMiddleware
│
├── Models
│   ├── User
│   ├── Challenge
│   ├── Cleanup
│   └── Achievement
│
├── Services
│   ├── aiService (trash classification)
│   ├── fileService (GridFS)
│   └── imageService
│
└── Config
    ├── db.js (MongoDB connection)
    └── firebase.js (Admin SDK)
```

---

## Data Flow Diagrams

### User Authentication Flow

```
User clicks "Sign in with Google"
        │
        ▼
┌─────────────────────────────┐
│  Firebase Auth SDK          │
│  signInWithPopup()          │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Google OAuth Flow          │
│  - Select Google account    │
│  - Authorize app            │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  AuthContext updates        │
│  - setUser(currentUser)     │
│  - Get ID token             │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  POST /api/auth/sync        │
│  - Verify token             │
│  - Find/create MongoDB user │
└──────┬──────────────────────┘
       │
       ▼
   User Authenticated
```

### Cleanup Upload Flow

```
User uploads photo
        │
        ▼
┌─────────────────────────────┐
│  POST /api/cleanups/upload  │
│  FormData: image, challengeId│
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Middleware Chain           │
│  1. verifyFirebaseToken     │
│  2. ensureUserExists        │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Controller Logic           │
│  1. Save image to GridFS    │
│  2. Classify with AI        │
│  3. Create Cleanup record   │
│  4. Update User stats       │
│  5. Update Challenge stats  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Response                   │
│  { label, confidence }      │
└─────────────────────────────┘
```

### Dashboard Analytics Flow

```
User visits Dashboard
        │
        ▼
┌─────────────────────────────┐
│  GET /api/dashboard/stats   │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  Aggregation Queries                        │
│                                             │
│  1. User stats (totalItems, rank)          │
│  2. Monthly progress (6 months)            │
│  3. Waste distribution by category         │
│  4. Recent activity (last 5)               │
│  5. Community totals                        │
└──────┬──────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│  Response with all data     │
│  Renders charts & stats     │
└─────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with SSR |
| React | 19.x | UI library |
| Material UI | 7.x | Component library |
| Axios | 1.x | HTTP client |
| Firebase | 12.x | Client-side authentication |
| Recharts | 3.x | Data visualization |
| Framer Motion | 12.x | Animations |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime environment |
| Express | 5.x | Web framework |
| MongoDB | 8.x | Database (via Mongoose) |
| Firebase Admin | 13.x | Server-side auth |
| @xenova/transformers | 2.x | AI classification |
| Multer | 2.x | File upload handling |
| Sharp | 0.34.x | Image processing |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Railway/Render | Backend hosting |
| MongoDB Atlas | Database hosting |
| Firebase | Authentication service |

---

## Infrastructure

### Development Environment

```
┌────────────┐     ┌────────────┐     ┌──────────┐
│  Frontend  │────▶│  Backend   │────▶│ MongoDB  │
│ :3000      │     │  :5000     │     │ Atlas    │
└────────────┘     └────────────┘     └──────────┘
```

### Production Environment

```
┌────────────────┐
│   Users/Web    │
└───────┬────────┘
        │
   ┌────▼────┐
   │ Vercel  │ ← Frontend (CDN)
   │  CDN    │
   └────┬────┘
        │
   ┌────▼─────────┐
   │   Railway/   │ ← Backend API
   │   Render     │
   └────┬─────────┘
        │
   ┌────▼──────┐
   │  MongoDB  │ ← Database
   │   Atlas   │
   └───────────┘
```

---

## Scalability Considerations

### Current Architecture (MVP)

- Single backend instance
- MongoDB Atlas free tier (512MB)
- Suitable for < 1000 users

### Future Scaling Options

```
Scaled Architecture:
┌────────────┐
│  Frontend  │
└─────┬──────┘
      │
 ┌────▼───────────┐
 │ Load Balancer  │
 └───────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌────────┐
│Backend │ │Backend │
│Node 1  │ │Node 2  │
└───┬────┘ └───┬────┘
    │          │
    └────┬─────┘
         ▼
   ┌──────────────┐
   │ Redis Cache  │
   └──────┬───────┘
          │
          ▼
   ┌──────────────┐
   │MongoDB Cluster│
   │ (Replica Set) │
   └───────────────┘
```

### Scaling Strategies

1. **Horizontal Scaling**: Add more backend instances behind a load balancer
2. **Database Scaling**: Upgrade MongoDB Atlas tier, enable sharding
3. **Caching**: Add Redis for frequently accessed data
4. **CDN**: Use Cloudflare or AWS CloudFront for static assets
5. **Image Optimization**: Move to dedicated object storage (S3, Cloudinary)

---

## Related Documentation

- [Backend Architecture](./BACKEND_ARCHITECTURE.md) - Detailed backend design
- [Frontend Design System](./FRONTEND_DESIGN_SYSTEM.md) - UI/UX documentation
- [Database Architecture](./DATABASE.md) - Data models and relationships
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Authentication](./AUTHENTICATION.md) - Auth flow details

---

*Document maintained by the Marine Care development team*
