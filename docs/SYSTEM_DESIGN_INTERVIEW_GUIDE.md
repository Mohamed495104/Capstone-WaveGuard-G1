# 🎯 Marine Care - System Design Interview Guide

> **FAANG-Level System Design Case Study and Interview Preparation**

**Document Version:** 2.0  
**Last Updated:** January 2026  
**Purpose:** Comprehensive System Design Interview Preparation using Marine Care as Case Study

---

## Table of Contents

1. [Interview Format Overview](#interview-format-overview)
2. [System Design Framework](#system-design-framework)
3. [Case Study: Marine Care](#case-study-marine-care)
4. [Functional Requirements](#functional-requirements)
5. [Non-Functional Requirements](#non-functional-requirements)
6. [Capacity Estimation](#capacity-estimation)
7. [High-Level Design](#high-level-design)
8. [Detailed Component Design](#detailed-component-design)
9. [Data Model Design](#data-model-design)
10. [API Design](#api-design)
11. [Scaling Strategy](#scaling-strategy)
12. [Trade-offs and Decisions](#trade-offs-and-decisions)
13. [Common Interview Questions](#common-interview-questions)

---

## Interview Format Overview

### Typical 45-Minute System Design Interview Structure

```
┌──────────────────────────────────────────────────────────────┐
│  PHASE 1: Requirements Clarification (5-7 minutes)           │
│  ────────────────────────────────────────────────────────    │
│  Goal: Understand what to build                              │
│  Actions:                                                    │
│  - Ask clarifying questions                                  │
│  - Define functional requirements                            │
│  - Define non-functional requirements                        │
│  - Establish scope boundaries                                │
│  - Agree on scale (users, data, requests)                    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  PHASE 2: Capacity Estimation (3-5 minutes)                  │
│  ────────────────────────────────────────────────────────    │
│  Goal: Understand scale and constraints                      │
│  Actions:                                                    │
│  - Estimate DAU/MAU                                          │
│  - Calculate QPS (Queries Per Second)                        │
│  - Estimate storage requirements                             │
│  - Calculate bandwidth needs                                 │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  PHASE 3: High-Level Design (10-15 minutes)                  │
│  ────────────────────────────────────────────────────────    │
│  Goal: Create overall architecture                           │
│  Actions:                                                    │
│  - Draw box diagram                                          │
│  - Identify major components                                 │
│  - Show data flow                                            │
│  - Discuss technologies                                      │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  PHASE 4: Detailed Design (15-20 minutes)                    │
│  ────────────────────────────────────────────────────────    │
│  Goal: Deep dive into critical components                    │
│  Actions:                                                    │
│  - Design database schema                                    │
│  - Design APIs                                               │
│  - Discuss scaling strategies                                │
│  - Address bottlenecks                                       │
│  - Talk about trade-offs                                     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  PHASE 5: Q&A and Extensions (5-8 minutes)                   │
│  ────────────────────────────────────────────────────────    │
│  Goal: Handle additional scenarios                           │
│  Actions:                                                    │
│  - Address interviewer questions                             │
│  - Discuss failure scenarios                                 │
│  - Talk about monitoring                                     │
│  - Discuss future extensions                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## System Design Framework

### RADIO Framework (Recommended Approach)

```
R - Requirements (Functional & Non-Functional)
A - API Design (Endpoints, Data Format)
D - Data Model (Database Schema, Relationships)
I - Interface (High-Level Components)
O - Optimizations (Caching, CDN, Scaling)
```

---

## Case Study: Marine Care

### Problem Statement

**Design a mobile-first web application that allows volunteers to participate in shoreline cleanup efforts, upload photos of collected waste for AI classification, join challenges, track their impact, and view leaderboards.**

### Key Features to Design

1. User authentication and profile management
2. Photo upload with AI classification
3. Challenge creation and participation
4. Real-time leaderboards and statistics
5. Dashboard with analytics
6. Mobile-responsive Progressive Web App

---

## Functional Requirements

### Core Requirements (MVP)

```
┌────────────────────────────────────────────────────────────┐
│  USER MANAGEMENT                                            │
│  ─────────────────────────────────────────────────────────  │
│  FR1: Users can register/login via email or Google OAuth   │
│  FR2: Users can view/edit their profile                    │
│  FR3: Users can view their cleanup history                 │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  CLEANUP LOGGING                                            │
│  ─────────────────────────────────────────────────────────  │
│  FR4: Users can upload cleanup photos                      │
│  FR5: System classifies waste type using AI                │
│  FR6: Users can manually log cleanups                      │
│  FR7: System records location of cleanup                   │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  CHALLENGES                                                 │
│  ─────────────────────────────────────────────────────────  │
│  FR8: Users can view list of active challenges             │
│  FR9: Users can join/leave challenges                      │
│  FR10: Users can see challenge progress                    │
│  FR11: System tracks challenge statistics                  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│  ANALYTICS & LEADERBOARDS                                   │
│  ─────────────────────────────────────────────────────────  │
│  FR12: Users can view personal dashboard                   │
│  FR13: Users can view leaderboards                         │
│  FR14: System shows waste distribution charts              │
│  FR15: System tracks user achievements                     │
└────────────────────────────────────────────────────────────┘
```

---

## Non-Functional Requirements

### Quality Attributes

```
┌─────────────────────────────────────────────────────────────┐
│  PERFORMANCE                                                 │
│  ───────────────────────────────────────────────────────────│
│  NFR1: API response time < 200ms for 95% of requests       │
│  NFR2: Image upload and classification < 3 seconds          │
│  NFR3: Dashboard loads in < 2 seconds                       │
│  NFR4: Support 1000 concurrent users initially              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  SCALABILITY                                                 │
│  ───────────────────────────────────────────────────────────│
│  NFR5: Horizontally scalable architecture                   │
│  NFR6: Handle 10x traffic growth without redesign           │
│  NFR7: Database can scale to millions of records            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  RELIABILITY                                                 │
│  ───────────────────────────────────────────────────────────│
│  NFR8: 99.9% uptime (43 minutes downtime/month max)        │
│  NFR9: Data durability 99.999% (no data loss)              │
│  NFR10: Graceful degradation if AI service fails           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  SECURITY                                                    │
│  ───────────────────────────────────────────────────────────│
│  NFR11: End-to-end HTTPS encryption                         │
│  NFR12: Secure authentication (OAuth 2.0)                   │
│  NFR13: Rate limiting to prevent abuse                      │
│  NFR14: Input validation and sanitization                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  USABILITY                                                   │
│  ───────────────────────────────────────────────────────────│
│  NFR15: Mobile-first responsive design                      │
│  NFR16: Offline capability (PWA)                            │
│  NFR17: Accessible (WCAG 2.1 Level AA)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  MAINTAINABILITY                                             │
│  ───────────────────────────────────────────────────────────│
│  NFR18: Modular architecture                                │
│  NFR19: Comprehensive documentation                         │
│  NFR20: Monitoring and logging                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Capacity Estimation

### Traffic Estimates

```
Assumptions:
───────────────────────────────────────────────────────
Total Users:           100,000 (registered)
Daily Active Users:    10,000 (10% of total)
Monthly Active Users:  30,000 (30% of total)

User Actions per Day:
- View challenges:     3 times/user
- Upload cleanup:      0.5 times/user (every 2 days)
- Check dashboard:     2 times/user
- View leaderboard:    1 time/user

Calculation:
───────────────────────────────────────────────────────
Total Daily Requests:
= 10,000 DAU × (3 + 0.5 + 2 + 1) requests
= 10,000 × 6.5 = 65,000 requests/day

Requests Per Second (QPS):
= 65,000 / 86,400 seconds
= ~0.75 QPS average
= ~3-5 QPS peak (assuming 5x peak factor)

Write Requests:
= 10,000 DAU × 0.5 uploads/day
= 5,000 uploads/day
= ~0.06 writes/second
```

### Storage Estimates

```
Per User Data:
───────────────────────────────────────────────────────
User Profile:          1 KB
Per Cleanup Log:       1 KB (metadata)
Per Image:            500 KB (compressed)
Cleanups per user:     50 (over lifetime)

Calculation:
───────────────────────────────────────────────────────
User Data:
= 100,000 users × 1 KB = 100 MB

Cleanup Metadata:
= 100,000 users × 50 cleanups × 1 KB
= 5,000,000 cleanups × 1 KB = 5 GB

Images:
= 5,000,000 cleanups × 500 KB = 2.5 TB

Total Storage:
= 100 MB + 5 GB + 2.5 TB
≈ 2.5 TB for 100K users

For 1M users (10x growth):
≈ 25 TB

For 10M users (100x growth):
≈ 250 TB
```

### Bandwidth Estimates

```
Upload Bandwidth:
───────────────────────────────────────────────────────
Image uploads:         5,000 uploads/day
Average image size:    500 KB
Total upload:          5,000 × 500 KB = 2.5 GB/day
                      ≈ 2.5 GB / 86,400 sec
                      ≈ 30 KB/second average
                      ≈ 150 KB/second peak

Download Bandwidth:
───────────────────────────────────────────────────────
Dashboard requests:    20,000/day
Avg response size:     50 KB (JSON + images)
Total download:        20,000 × 50 KB = 1 GB/day
                      ≈ 12 KB/second average
                      ≈ 60 KB/second peak

Total Bandwidth:
Average: ~40 KB/s (negligible)
Peak: ~200 KB/s (easily handled)
```

### Memory Estimates

```
Application Server Memory:
───────────────────────────────────────────────────────
Node.js baseline:      100 MB
Active connections:    1000 × 10 KB = 10 MB
Cache (Redis):         500 MB
AI Model (loaded):     500 MB
Total per server:      ~1.1 GB

Recommended: 2 GB RAM per server

Database Memory:
───────────────────────────────────────────────────────
Working set (indexes + hot data): ~2 GB
Recommended: 8 GB RAM for database
```

---

## High-Level Design

### System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                          │
├───────────────────────────────────────────────────────────────┤
│  ┌────────────┐  ┌────────────┐  ┌────────────┐             │
│  │  Browser   │  │   Mobile   │  │    PWA     │             │
│  │  (Desktop) │  │   Browser  │  │ (Installed)│             │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘             │
│         │               │                │                    │
│         └───────────────┴────────────────┘                    │
│                         │                                     │
│                    HTTPS/HTTP2                                │
└─────────────────────────┼─────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                         CDN LAYER                             │
├───────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Vercel Edge Network / Cloudflare                      │  │
│  │  - Static assets caching                               │  │
│  │  - SSL termination                                     │  │
│  │  - DDoS protection                                     │  │
│  │  - Geographic distribution                             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────┐              ┌──────────────────┐
│  FRONTEND APP    │              │   BACKEND API    │
│  (Next.js/React) │              │  (Node.js/Express)│
│                  │              │                  │
│  - SSR Rendering │◀────API─────│  - REST Endpoints│
│  - Client Logic  │    Calls     │  - Business Logic│
│  - State Mgmt    │              │  - Auth Handling │
│  - Caching       │              │  - Rate Limiting │
└──────────────────┘              └────────┬─────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
         ┌────────────────────┐  ┌───────────────┐    ┌────────────────┐
         │  Authentication    │  │    AI/ML      │    │  File Storage  │
         │    Service         │  │   Service     │    │    Service     │
         │  (Firebase Auth)   │  │               │    │   (GridFS)     │
         │                    │  │ - Image       │    │                │
         │ - Token Verify     │  │   Classification    │ - Binary Store │
         │ - User Management  │  │ - Transformers │    │ - Chunking     │
         └────────────────────┘  │ - Model Cache  │    │ - Streaming    │
                                 └───────────────┘    └────────────────┘
                                           │
                                           ▼
                                 ┌────────────────────┐
                                 │   DATA LAYER       │
                                 │   (MongoDB Atlas)  │
                                 │                    │
                                 │  ┌──────────────┐  │
                                 │  │    users     │  │
                                 │  ├──────────────┤  │
                                 │  │  challenges  │  │
                                 │  ├──────────────┤  │
                                 │  │   cleanups   │  │
                                 │  ├──────────────┤  │
                                 │  │achievements  │  │
                                 │  └──────────────┘  │
                                 │                    │
                                 │  Indexes:          │
                                 │  - B-tree          │
                                 │  - Geospatial      │
                                 │  - Compound        │
                                 └────────────────────┘
```

### Request Flow Example: Upload Cleanup Photo

```
┌─────────────────────────────────────────────────────────────┐
│  1. User Action                                              │
│  User selects photo and uploads via mobile app               │
└────────────────────────┬────────────────────────────────────┘
                         │ POST /api/cleanups/upload
                         │ FormData: { image, challengeId }
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  2. API Gateway / Load Balancer                              │
│  - Route to healthy backend instance                         │
│  - SSL termination                                           │
│  - Rate limiting check                                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  3. Backend Server                                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  3a. Middleware Chain                               │    │
│  │  - Parse multipart form data                        │    │
│  │  - Verify Firebase token                            │    │
│  │  - Find/create MongoDB user                         │    │
│  │  - Validate file (type, size)                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  3b. Controller Logic                               │    │
│  │  Step 1: Save image to GridFS                       │    │
│  │  Step 2: Classify image with AI service             │    │
│  │  Step 3: Create Cleanup record                      │    │
│  │  Step 4: Update User stats                          │    │
│  │  Step 5: Update Challenge stats                     │    │
│  └─────────────────────────────────────────────────────┘    │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   GridFS     │  │  AI Service  │  │   MongoDB    │
│              │  │              │  │              │
│ Save image   │  │ Classify     │  │ Update docs  │
│ Return ID    │  │ Return label │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
        │                │                │
        └────────────────┴────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Response                                                 │
│  {                                                           │
│    success: true,                                            │
│    data: {                                                   │
│      cleanupId: "507f1f77bcf86cd799439011",                  │
│      classification: {                                       │
│        label: "plastic_bottle",                              │
│        confidence: 0.87                                      │
│      }                                                       │
│    }                                                         │
│  }                                                           │
└─────────────────────────────────────────────────────────────┘
```

---

## Detailed Component Design

### 1. Authentication System

```
┌──────────────────────────────────────────────────────────┐
│              AUTHENTICATION ARCHITECTURE                  │
└──────────────────────────────────────────────────────────┘

Flow: Google Sign-In
───────────────────────────────────────────────────────────
1. User clicks "Sign in with Google"
2. Frontend redirects to Firebase Auth
3. Firebase handles OAuth flow with Google
4. Firebase returns ID token to client
5. Client stores token in memory (not localStorage for security)
6. Client sends token in Authorization header for API calls
7. Backend verifies token with Firebase Admin SDK
8. Backend finds/creates MongoDB user
9. Backend attaches user to request context

Security Measures:
───────────────────────────────────────────────────────────
✓ HttpOnly cookies for session (XSS protection)
✓ Secure HTTPS-only transmission
✓ Short-lived tokens (1 hour, auto-refresh)
✓ Token revocation support
✓ Rate limiting on auth endpoints
✓ IP-based blocking for brute force

Token Structure (JWT):
───────────────────────────────────────────────────────────
{
  "iss": "https://securetoken.google.com/marine-care",
  "aud": "marine-care",
  "auth_time": 1705220174,
  "user_id": "abc123xyz",
  "sub": "abc123xyz",
  "iat": 1705220174,
  "exp": 1705223774,  // 1 hour expiry
  "email": "user@example.com",
  "email_verified": true,
  "firebase": {
    "identities": {
      "google.com": ["1234567890"]
    },
    "sign_in_provider": "google.com"
  }
}
```

### 2. AI Classification System

```
┌──────────────────────────────────────────────────────────┐
│           AI CLASSIFICATION ARCHITECTURE                  │
└──────────────────────────────────────────────────────────┘

Model: CLIP (Contrastive Language-Image Pre-training)
Provider: Hugging Face Transformers
Model: Xenova/clip-vit-base-patch32
Size: ~350MB

Architecture:
───────────────────────────────────────────────────────────
┌──────────────────┐
│  Image Input     │
│  (JPEG/PNG)      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Preprocessing   │
│  - Resize to     │
│    224x224       │
│  - Normalize     │
│  - Convert to    │
│    tensor        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  CLIP Vision     │
│  Encoder         │
│  (ViT-B/32)      │
│  - Extract       │
│    features      │
│  - Generate      │
│    embeddings    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Zero-Shot       │
│  Classification  │
│  - Compare with  │
│    candidate     │
│    labels        │
│  - Calculate     │
│    similarity    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Result          │
│  {               │
│    label: "...", │
│    conf: 0.87    │
│  }               │
└──────────────────┘

Candidate Labels:
───────────────────────────────────────────────────────────
1. "plastic bottle"
2. "metal can"
3. "plastic bag"
4. "paper or cardboard"
5. "cigarette butt"
6. "glass bottle"
7. "unknown trash"

Performance Optimization:
───────────────────────────────────────────────────────────
1. Singleton Pattern
   - Load model once at startup
   - Reuse for all requests
   - Saves ~5-10 seconds per request

2. Model Caching
   - Cache model weights
   - Reduce startup time
   - Store in /tmp or persistent volume

3. Async Processing
   - Non-blocking classification
   - Queue for batch processing
   - Parallel processing multiple images

4. Fallback Strategy
   - If AI fails, allow manual entry
   - Graceful degradation
   - Log failures for monitoring

Error Handling:
───────────────────────────────────────────────────────────
try {
    const classification = await classifyImage(buffer);
    cleanup.logType = 'ai';
    cleanup.classificationResult = classification;
} catch (error) {
    console.error('AI classification failed:', error);
    // Fallback: Allow user to manually classify
    cleanup.logType = 'manual';
    cleanup.classificationResult = {
        label: req.body.manualCategory || 'unknown',
        confidence: 0
    };
}
```

---

## (Document continues... This is approximately 60% of interview guide content)
