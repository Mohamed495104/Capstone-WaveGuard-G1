# 🏗️ Marine Care - System Design Patterns

> **Comprehensive Analysis of Design Patterns in Current Architecture**

**Document Version:** 2.0  
**Last Updated:** January 2026  
**Purpose:** Understanding Industry-Level System Design Patterns

---

## Table of Contents

1. [Overview](#overview)
2. [Architectural Patterns](#architectural-patterns)
3. [Design Principles (SOLID, DRY, KISS)](#design-principles-solid-dry-kiss)
4. [API Design Patterns](#api-design-patterns)
5. [Data Access Patterns](#data-access-patterns)
6. [Security Patterns](#security-patterns)
7. [Related Documentation](#related-documentation)

---

## Overview

### System Design Philosophy

Marine Care implements **battle-tested architectural patterns** from large-scale systems, adapted for a focused MVP scope. This document analyzes how industry-standard patterns are applied throughout the codebase.

### Pattern Categories Implemented

```
Architecture Layer          Patterns Applied
─────────────────────────────────────────────────────────────
Frontend Layer             ├── Component-Based Architecture
                          ├── Container/Presenter Pattern
                          ├── Context API (State Management)
                          ├── Custom Hooks (Business Logic)
                          └── HOC Pattern (Authentication)

API Layer                  ├── RESTful Resource Design
                          ├── Middleware Chain Pattern
                          ├── Request/Response Transformation
                          └── Error Handling Middleware

Business Logic Layer       ├── Service Layer Pattern
                          ├── Strategy Pattern (AI Models)
                          ├── Singleton Pattern (Model Loading)
                          └── Factory Pattern (Service Creation)

Data Access Layer          ├── Repository Pattern (Mongoose)
                          ├── Active Record Pattern
                          ├── Unit of Work Pattern (Transactions)
                          └── Identity Map (Mongoose Cache)

Infrastructure Layer       ├── Dependency Injection
                          ├── Configuration Management
                          └── Connection Pooling
```

---

## Architectural Patterns

### 1. Layered Architecture Pattern

**Definition**: Organization of application into distinct horizontal layers, where each layer depends only on layers below it.

#### Current Implementation

```
┌──────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                          │
│  Technology: Next.js 16 + React 19 + Material UI 7           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Pages (App Router)                                    │  │
│  │  - Server-Side Rendering (SSR)                         │  │
│  │  - Client-Side Navigation                              │  │
│  │  - SEO Optimization                                    │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Components (Reusable UI)                              │  │
│  │  - Atomic Design Principles                            │  │
│  │  - Material UI Customization                           │  │
│  │  - Framer Motion Animations                            │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  State Management                                      │  │
│  │  - Context API for Global State                       │  │
│  │  - Local State (useState)                             │  │
│  │  - Server State Caching                               │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │  HTTP/REST API
                           │  (Axios + Auth Headers)
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    APPLICATION TIER                           │
│  Technology: Node.js 20 + Express 5                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Routes (Endpoint Definitions)                         │  │
│  │  - RESTful URL Structure                               │  │
│  │  - HTTP Method Mapping                                 │  │
│  │  - Middleware Composition                              │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Middleware Chain                                      │  │
│  │  1. CORS Handling                                      │  │
│  │  2. Body Parsing                                       │  │
│  │  3. Rate Limiting                                      │  │
│  │  4. Authentication (Firebase Tokens)                   │  │
│  │  5. User Synchronization                               │  │
│  │  6. File Upload Processing                             │  │
│  │  7. Error Handling                                     │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Controllers (Request Handlers)                        │  │
│  │  - Input Validation                                    │  │
│  │  - Business Logic Orchestration                        │  │
│  │  - Response Formatting                                 │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Services (Business Logic)                             │  │
│  │  - AI Classification Service                           │  │
│  │  - Image Processing Service                            │  │
│  │  - File Storage Service                                │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           │  Mongoose ODM
                           │  (Connection Pool)
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                     DATA TIER                                 │
│  Technology: MongoDB Atlas 8.x + GridFS                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Mongoose Models (Schema Layer)                        │  │
│  │  - Schema Validation                                   │  │
│  │  - Middleware Hooks                                    │  │
│  │  - Virtual Properties                                  │  │
│  │  - Static Methods                                      │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  MongoDB Collections                                   │  │
│  │  - users                                               │  │
│  │  - challenges                                          │  │
│  │  - cleanups                                            │  │
│  │  - achievements                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  GridFS (Binary Storage)                               │  │
│  │  - fs.files (metadata)                                 │  │
│  │  - fs.chunks (binary chunks)                           │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Indexes (Query Optimization)                          │  │
│  │  - B-tree Indexes                                      │  │
│  │  - 2dsphere (Geospatial)                               │  │
│  │  - Compound Indexes                                    │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

#### Benefits of This Pattern

| Benefit | Implementation | Impact |
|---------|----------------|--------|
| **Separation of Concerns** | Each layer handles distinct responsibilities | Easier to understand and maintain code |
| **Independent Development** | Teams can work on different layers simultaneously | Faster development cycles |
| **Technology Flexibility** | Can swap implementations without affecting other layers | Future-proof architecture |
| **Testability** | Each layer can be tested in isolation | Higher code quality |
| **Scalability** | Layers can be scaled independently | Better resource utilization |

#### Potential Challenges

| Challenge | Mitigation Strategy |
|-----------|---------------------|
| **Performance Overhead** | Use caching at multiple levels |
| **Increased Complexity** | Clear documentation and naming conventions |
| **Cross-Layer Communication** | Well-defined interfaces and DTOs |

---

### 2. MVC (Model-View-Controller) Pattern

**Definition**: Separation of application into three interconnected components - Model (data), View (presentation), Controller (logic).

#### MVC in Marine Care Context

```
┌─────────────────────────────────────────────────────────────────┐
│                           VIEW LAYER                             │
│  Location: frontend/src/                                         │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  React Components (Presentation Logic)                  │    │
│  │  ├── pages/dashboard/page.js                            │    │
│  │  │   → Renders dashboard UI                             │    │
│  │  │   → Fetches data via useEffect                       │    │
│  │  │   → Passes data to child components                  │    │
│  │  │                                                       │    │
│  │  ├── pages/challenges/page.js                           │    │
│  │  │   → Displays challenge list                          │    │
│  │  │   → Filters and search functionality                 │    │
│  │  │                                                       │    │
│  │  └── components/                                        │    │
│  │      ├── ChallengeCard.js  (Pure presentation)          │    │
│  │      ├── StatCard.js        (Data visualization)        │    │
│  │      └── UploadForm.js      (User input)                │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────────┬─────────────────────────────────┘
                                │ API Calls (utils/api.js)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CONTROLLER LAYER                          │
│  Location: backend/src/controllers/                             │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Express Controllers (Business Logic Orchestration)     │    │
│  │                                                         │    │
│  │  dashboardController.js                                 │    │
│  │  ├── getStats(req, res)                                 │    │
│  │  │   1. Extract user from req.mongoUser                 │    │
│  │  │   2. Call Model methods to fetch data                │    │
│  │  │   3. Transform data for response                     │    │
│  │  │   4. Return JSON response                            │    │
│  │  │                                                       │    │
│  │  challengeController.js                                 │    │
│  │  ├── getAllChallenges(req, res)                         │    │
│  │  │   1. Parse query parameters (filters, sort)          │    │
│  │  │   2. Call Challenge.find() with filters              │    │
│  │  │   3. Format response                                 │    │
│  │  │                                                       │    │
│  │  ├── joinChallenge(req, res)                            │    │
│  │  │   1. Validate challengeId                            │    │
│  │  │   2. Update User.joinedChallenges                    │    │
│  │  │   3. Increment Challenge.totalVolunteers             │    │
│  │  │   4. Return success response                         │    │
│  │  │                                                       │    │
│  │  cleanupController.js                                   │    │
│  │  └── uploadCleanup(req, res)                            │    │
│  │      1. Extract image buffer from req.file              │    │
│  │      2. Call aiService.classifyImage()                  │    │
│  │      3. Save to GridFS via fileService                  │    │
│  │      4. Create Cleanup record                           │    │
│  │      5. Update user and challenge stats                 │    │
│  │      6. Return classification result                    │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Mongoose ODM
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          MODEL LAYER                             │
│  Location: backend/src/models/                                  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Mongoose Models (Data Structure & Persistence)        │    │
│  │                                                         │    │
│  │  User.js                                                │    │
│  │  ├── Schema Definition                                  │    │
│  │  │   - firebaseUid: String (unique)                     │    │
│  │  │   - email: String (unique)                           │    │
│  │  │   - totalItemsCollected: Number                      │    │
│  │  │   - joinedChallenges: [ObjectId]                     │    │
│  │  │                                                       │    │
│  │  ├── Instance Methods                                   │    │
│  │  │   - user.addCleanup()                                │    │
│  │  │                                                       │    │
│  │  └── Static Methods                                     │    │
│  │      - User.findByFirebaseUid(uid)                      │    │
│  │      - User.getLeaderboard(limit)                       │    │
│  │                                                         │    │
│  │  Challenge.js                                           │    │
│  │  ├── Schema Definition                                  │    │
│  │  │   - title, description, location                     │    │
│  │  │   - totalTrashCollected: Number                      │    │
│  │  │   - wasteBreakdown: Object                           │    │
│  │  │                                                       │    │
│  │  └── Static Methods                                     │    │
│  │      - Challenge.findActive()                           │    │
│  │      - Challenge.findByProvince(province)               │    │
│  │      - Challenge.getNearby(coords, radius)              │    │
│  │                                                         │    │
│  │  Cleanup.js                                             │    │
│  │  └── Schema Definition                                  │    │
│  │      - userId, challengeId, imageFileId                 │    │
│  │      - classificationResult: { label, confidence }      │    │
│  │      - itemCount: Number                                │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

#### Data Flow Through MVC

```
User Action (Click "Upload Photo")
         │
         ▼
┌─────────────────────────────┐
│  VIEW (UploadForm.js)       │
│  - Capture file input       │
│  - Show loading state       │
└──────────┬──────────────────┘
           │ POST /api/cleanups/upload
           ▼
┌─────────────────────────────┐
│  CONTROLLER                 │
│  (cleanupController.js)     │
│  1. Validate input          │
│  2. Process file            │
│  3. Update models           │
│  4. Return response         │
└──────────┬──────────────────┘
           │ Mongoose operations
           ▼
┌─────────────────────────────┐
│  MODEL (Cleanup.js)         │
│  - Save to database         │
│  - Run validations          │
│  - Trigger hooks            │
└──────────┬──────────────────┘
           │ Response
           ▼
┌─────────────────────────────┐
│  VIEW (UploadForm.js)       │
│  - Display success          │
│  - Show classification      │
│  - Update UI                │
└─────────────────────────────┘
```

---

### 3. Repository Pattern

**Definition**: An abstraction layer between business logic and data access, providing a collection-like interface for accessing domain objects.

#### Implementation in Marine Care

```javascript
// ❌ ANTI-PATTERN: Direct Database Access in Controller
export const getAllChallenges = async (req, res) => {
    try {
        // Tightly coupled to MongoDB implementation
        const challenges = await mongoose.connection.db
            .collection('challenges')
            .find({ status: 'active' })
            .toArray();
        
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ GOOD: Repository Pattern with Mongoose
// models/Challenge.js (Acts as Repository)
const challengeSchema = new mongoose.Schema({
    title: String,
    status: String,
    province: String,
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: [Number]
    },
    totalTrashCollected: Number,
    totalVolunteers: Number
});

// Repository Methods (Static Methods)
challengeSchema.statics.findActive = function() {
    return this.find({ status: 'active' })
        .sort({ createdAt: -1 });
};

challengeSchema.statics.findByProvince = function(province) {
    return this.find({ province, status: 'active' });
};

challengeSchema.statics.findNearby = function(longitude, latitude, radiusInMeters = 50000) {
    return this.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                $maxDistance: radiusInMeters
            }
        }
    });
};

challengeSchema.statics.getTopChallenges = function(limit = 10) {
    return this.find({ status: 'active' })
        .sort({ totalVolunteers: -1 })
        .limit(limit);
};

export default mongoose.model('Challenge', challengeSchema);

// controllers/challengeController.js (Uses Repository)
import Challenge from '../models/Challenge.js';

export const getAllChallenges = async (req, res) => {
    try {
        const { province, nearby } = req.query;
        
        let challenges;
        if (province) {
            challenges = await Challenge.findByProvince(province);
        } else if (nearby) {
            const [lon, lat] = nearby.split(',').map(parseFloat);
            challenges = await Challenge.findNearby(lon, lat);
        } else {
            challenges = await Challenge.findActive();
        }
        
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTopChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.getTopChallenges(10);
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
```

#### Benefits of Repository Pattern

```
┌──────────────────────────────────────────────────────────────┐
│                      BENEFITS                                 │
├──────────────────────────────────────────────────────────────┤
│  1. Abstraction                                              │
│     Business logic doesn't know about database details       │
│                                                              │
│  2. Testability                                              │
│     Easy to mock repositories for unit testing               │
│                                                              │
│  3. Centralization                                           │
│     Data access logic in one place                           │
│                                                              │
│  4. Consistency                                              │
│     Uniform API for data operations                          │
│                                                              │
│  5. Maintainability                                          │
│     Easier to change database implementation                 │
│                                                              │
│  6. Reusability                                              │
│     Complex queries written once, used everywhere            │
└──────────────────────────────────────────────────────────────┘
```

---

### 4. Middleware Chain Pattern

**Definition**: A series of processing components that handle a request sequentially, each with the opportunity to process, transform, or short-circuit the request.

#### Middleware Pipeline Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                   CLIENT REQUEST                              │
│  POST /api/cleanups/upload                                   │
│  Headers: { Authorization: "Bearer <token>" }                │
│  Body: FormData { image, challengeId, itemCount }            │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  MIDDLEWARE 1: CORS                                           │
│  Purpose: Handle cross-origin requests                       │
│  Actions:                                                    │
│  - Check origin header                                       │
│  - Set CORS headers                                          │
│  - Allow credentials                                         │
│  Decision: ✓ Continue → next()                              │
└────────────────────────┬─────────────────────────────────────┘
                         │ next()
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  MIDDLEWARE 2: Body Parser                                    │
│  Purpose: Parse request body                                 │
│  Actions:                                                    │
│  - Parse JSON bodies                                         │
│  - Parse URL-encoded bodies                                  │
│  - Attach to req.body                                        │
│  Decision: ✓ Continue → next()                              │
└────────────────────────┬─────────────────────────────────────┘
                         │ next()
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  MIDDLEWARE 3: Rate Limiter                                   │
│  Purpose: Prevent abuse                                      │
│  Actions:                                                    │
│  - Get client IP                                             │
│  - Check request count                                       │
│  - Increment counter                                         │
│  Decision: Request count < limit?                            │
│     ✓ Yes → next()                                           │
│     ✗ No → 429 Too Many Requests                             │
└────────────────────────┬─────────────────────────────────────┘
                         │ next()
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  MIDDLEWARE 4: Firebase Authentication                        │
│  Purpose: Verify user identity                               │
│  Actions:                                                    │
│  - Extract Bearer token                                      │
│  - Verify with Firebase Admin SDK                            │
│  - Decode user claims                                        │
│  - Attach to req.user                                        │
│  Decision: Token valid?                                      │
│     ✓ Yes → next()                                           │
│     ✗ No → 401 Unauthorized                                  │
└────────────────────────┬─────────────────────────────────────┘
                         │ next()
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  MIDDLEWARE 5: User Synchronization                           │
│  Purpose: Ensure MongoDB user exists                         │
│  Actions:                                                    │
│  - Look up user by firebaseUid                               │
│  - Create if doesn't exist                                   │
│  - Attach to req.mongoUser                                   │
│  Decision: ✓ Continue → next()                              │
└────────────────────────┬─────────────────────────────────────┘
                         │ next()
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  MIDDLEWARE 6: Multer (File Upload)                           │
│  Purpose: Handle multipart/form-data                         │
│  Actions:                                                    │
│  - Parse multipart form                                      │
│  - Validate file type (image/*)                              │
│  - Validate file size (< 10MB)                               │
│  - Store in memory buffer                                    │
│  - Attach to req.file                                        │
│  Decision: Valid file?                                       │
│     ✓ Yes → next()                                           │
│     ✗ No → 400 Bad Request                                   │
└────────────────────────┬─────────────────────────────────────┘
                         │ next()
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  CONTROLLER: uploadCleanup                                    │
│  Purpose: Business logic execution                           │
│  Actions:                                                    │
│  1. Classify image with AI                                   │
│  2. Save image to GridFS                                     │
│  3. Create Cleanup record                                    │
│  4. Update User stats                                        │
│  5. Update Challenge stats                                   │
│  6. Return response                                          │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  MIDDLEWARE 7: Error Handler                                  │
│  Purpose: Catch and format errors                            │
│  Actions:                                                    │
│  - Log error details                                         │
│  - Format error response                                     │
│  - Hide sensitive info in production                         │
│  - Return error response                                     │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│                   CLIENT RESPONSE                             │
│  Status: 201 Created                                         │
│  Body: {                                                     │
│    success: true,                                            │
│    data: {                                                   │
│      cleanupId: "...",                                       │
│      classification: { label: "plastic_bottle", ... }        │
│    }                                                         │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
```

#### Implementation Code

```javascript
// Route definition with middleware chain
router.post('/cleanups/upload',
    rateLimiter,              // 1. Rate limiting
    verifyAuth,               // 2. Authentication
    ensureUserExists,         // 3. User sync
    upload.single('image'),   // 4. File upload
    uploadCleanup             // 5. Business logic
);

// Middleware implementations
// middleware/rateLimiter.js
export const rateLimiter = (req, res, next) => {
    const clientIP = req.ip;
    const requestCount = getRequestCount(clientIP);
    
    if (requestCount > RATE_LIMIT) {
        return res.status(429).json({
            success: false,
            message: 'Too many requests'
        });
    }
    
    incrementRequestCount(clientIP);
    next();
};

// middleware/authMiddleware.js
export const verifyAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
};

// middleware/userMiddleware.js
export const ensureUserExists = async (req, res, next) => {
    try {
        let user = await User.findOne({ firebaseUid: req.user.uid });
        
        if (!user) {
            user = await User.create({
                firebaseUid: req.user.uid,
                email: req.user.email,
                name: req.user.name
            });
        }
        
        req.mongoUser = user;
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'User synchronization failed'
        });
    }
};
```

#### Benefits of Middleware Chain

```
┌────────────────────────────────────────────────────────┐
│  COMPOSABILITY                                          │
│  Mix and match middleware for different routes         │
│                                                        │
│  // Public route - no auth                            │
│  router.get('/challenges', getAllChallenges);         │
│                                                        │
│  // Protected route - auth required                   │
│  router.post('/challenges/:id/join',                  │
│      verifyAuth,                                       │
│      ensureUserExists,                                 │
│      joinChallenge                                     │
│  );                                                    │
│                                                        │
│  // File upload - auth + file handling                │
│  router.post('/cleanups/upload',                      │
│      rateLimiter,                                      │
│      verifyAuth,                                       │
│      ensureUserExists,                                 │
│      upload.single('image'),                           │
│      uploadCleanup                                     │
│  );                                                    │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  REUSABILITY                                            │
│  Write once, use everywhere                            │
│                                                        │
│  const protectedRoute = [                             │
│      verifyAuth,                                       │
│      ensureUserExists                                  │
│  ];                                                    │
│                                                        │
│  router.get('/profile', ...protectedRoute, getProfile);│
│  router.patch('/profile', ...protectedRoute, updateProfile);│
│  router.get('/dashboard', ...protectedRoute, getDashboard);│
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  TESTABILITY                                            │
│  Test each middleware in isolation                     │
│                                                        │
│  describe('verifyAuth', () => {                        │
│      it('should reject invalid tokens', async () => { │
│          const req = { headers: { authorization: '' } };│
│          const res = { status: jest.fn(), json: jest.fn() };│
│          await verifyAuth(req, res, jest.fn());        │
│          expect(res.status).toHaveBeenCalledWith(401); │
│      });                                               │
│  });                                                   │
└────────────────────────────────────────────────────────┘
```

---

### 5. Service Layer Pattern

**Definition**: Encapsulation of business logic in dedicated service classes that operate on domain models.

#### Service Architecture in Marine Care

```
┌──────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                            │
│  Location: backend/src/services/                             │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  AI Service (aiService.js)                             │  │
│  │  ─────────────────────────────────────────────────────  │  │
│  │  Responsibility: Machine Learning Operations           │  │
│  │                                                        │  │
│  │  State Management:                                     │  │
│  │  - Singleton pattern for model instance               │  │
│  │  - Model loaded once and reused                        │  │
│  │  - Memory-efficient ML pipeline                        │  │
│  │                                                        │  │
│  │  Methods:                                              │  │
│  │  ├── initializeAI()                                    │  │
│  │  │   - Load Hugging Face model                        │  │
│  │  │   - Configure pipeline                             │  │
│  │  │   - Handle initialization errors                   │  │
│  │  │   - Retry logic for reliability                    │  │
│  │  │                                                     │  │
│  │  └── classifyImage(buffer)                            │  │
│  │      - Validate input buffer                          │  │
│  │      - Create temporary file                          │  │
│  │      - Run classification pipeline                    │  │
│  │      - Map results to categories                      │  │
│  │      - Clean up temporary files                       │  │
│  │      - Return { label, confidence }                   │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Image Service (imageService.js)                       │  │
│  │  ─────────────────────────────────────────────────────  │  │
│  │  Responsibility: Image Processing & Storage            │  │
│  │                                                        │  │
│  │  Methods:                                              │  │
│  │  ├── saveToGridFS(buffer, filename, metadata)         │  │
│  │  │   - Create GridFS bucket                           │  │
│  │  │   - Open upload stream                             │  │
│  │  │   - Write buffer chunks                            │  │
│  │  │   - Return file ID                                 │  │
│  │  │                                                     │  │
│  │  ├── getFromGridFS(fileId)                            │  │
│  │  │   - Open download stream                           │  │
│  │  │   - Stream file chunks                             │  │
│  │  │   - Return readable stream                         │  │
│  │  │                                                     │  │
│  │  ├── processImage(buffer)                             │  │
│  │  │   - Resize to standard dimensions                  │  │
│  │  │   - Optimize compression                           │  │
│  │  │   - Convert format if needed                       │  │
│  │  │   - Return processed buffer                        │  │
│  │  │                                                     │  │
│  │  └── deleteFromGridFS(fileId)                         │  │
│  │      - Find file by ID                                │  │
│  │      - Delete file chunks                             │  │
│  │      - Delete file metadata                           │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

#### Service Layer Benefits

```
Controller (Thin Logic)              Service (Business Logic)
──────────────────────────────────── ─────────────────────────────────
✓ HTTP concerns                      ✓ Business rules
✓ Request validation                 ✓ Complex algorithms
✓ Response formatting                ✓ External integrations
✓ Error handling                     ✓ Heavy computations
✗ Business logic                     ✓ Reusable operations
✗ Complex operations                 ✓ Testable units
```

#### Example: AI Classification Service

```javascript
// services/aiService.js
import { pipeline } from '@xenova/transformers';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

/**
 * AI Classification Service
 * Singleton pattern for model management
 */
class AIService {
    constructor() {
        this.classifier = null;
        this.isInitialized = false;
        this.candidateLabels = [
            'plastic bottle',
            'metal can',
            'plastic bag',
            'paper or cardboard',
            'cigarette butt',
            'glass bottle',
            'unknown trash'
        ];
        
        this.labelMap = {
            'plastic bottle': 'plastic_bottle',
            'metal can': 'metal_can',
            'plastic bag': 'plastic_bag',
            'paper or cardboard': 'paper_cardboard',
            'cigarette butt': 'cigarette_butt',
            'glass bottle': 'glass_bottle',
            'unknown trash': 'unknown'
        };
    }
    
    /**
     * Initialize AI model
     * Called once at server startup
     */
    async initialize() {
        if (this.isInitialized) {
            return;
        }
        
        console.log('[AIService] Loading model...');
        
        try {
            this.classifier = await pipeline(
                'zero-shot-image-classification',
                'Xenova/clip-vit-base-patch32',
                {
                    cache_dir: process.env.AI_MODEL_CACHE_DIR,
                    progress_callback: (progress) => {
                        if (progress.progress) {
                            console.log(`[AIService] Loading: ${progress.file} (${progress.progress.toFixed(1)}%)`);
                        }
                    }
                }
            );
            
            this.isInitialized = true;
            console.log('[AIService] Model loaded successfully');
            
        } catch (error) {
            console.error('[AIService] Failed to load model:', error.message);
            throw error;
        }
    }
    
    /**
     * Classify image buffer
     * @param {Buffer} buffer - Image buffer
     * @returns {Promise<{label: string, confidence: number}>}
     */
    async classifyImage(buffer) {
        if (!this.isInitialized) {
            throw new Error('AI model not initialized');
        }
        
        if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
            throw new Error('Invalid image buffer');
        }
        
        const tempFile = join(
            tmpdir(),
            `marine-care-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`
        );
        
        try {
            // Write buffer to temp file
            writeFileSync(tempFile, buffer);
            
            // Classify image
            const results = await this.classifier(tempFile, this.candidateLabels);
            
            // Get top result
            results.sort((a, b) => b.score - a.score);
            const top = results[0];
            
            // Map to our categories
            const label = this.labelMap[top.label] || 'unknown';
            const confidence = parseFloat(top.score.toFixed(4));
            
            return { label, confidence };
            
        } finally {
            // Clean up temp file
            try {
                unlinkSync(tempFile);
            } catch (err) {
                console.warn('[AIService] Failed to delete temp file:', err.message);
            }
        }
    }
    
    /**
     * Check if service is ready
     */
    isReady() {
        return this.isInitialized;
    }
}

// Export singleton instance
export const aiService = new AIService();
export const initializeAI = () => aiService.initialize();
export const classifyImage = (buffer) => aiService.classifyImage(buffer);
```

#### Using Services in Controllers

```javascript
// controllers/cleanupController.js
import { classifyImage } from '../services/aiService.js';
import { saveToGridFS } from '../services/imageService.js';
import Cleanup from '../models/Cleanup.js';
import User from '../models/User.js';
import Challenge from '../models/Challenge.js';

export const uploadCleanup = async (req, res) => {
    try {
        // 1. Validate input (Controller responsibility)
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No image provided'
            });
        }
        
        const { challengeId, itemCount = 1 } = req.body;
        
        if (!challengeId) {
            return res.status(400).json({
                success: false,
                message: 'Challenge ID required'
            });
        }
        
        // 2. Delegate to services (Service responsibility)
        const classification = await classifyImage(req.file.buffer);
        const fileId = await saveToGridFS(
            req.file.buffer,
            `cleanup-${Date.now()}.jpg`,
            { userId: req.mongoUser._id, challengeId }
        );
        
        // 3. Create database records (Controller orchestration)
        const cleanup = await Cleanup.create({
            userId: req.mongoUser._id,
            challengeId,
            imageFileId: fileId,
            classificationResult: classification,
            itemCount,
            logType: 'ai',
            status: 'completed'
        });
        
        // 4. Update statistics (Controller orchestration)
        await Promise.all([
            User.findByIdAndUpdate(req.mongoUser._id, {
                $inc: {
                    totalItemsCollected: itemCount,
                    totalCleanups: 1
                }
            }),
            Challenge.findByIdAndUpdate(challengeId, {
                $inc: {
                    totalTrashCollected: itemCount,
                    [`wasteBreakdown.${classification.label}`]: itemCount
                }
            })
        ]);
        
        // 5. Return response (Controller responsibility)
        res.status(201).json({
            success: true,
            data: {
                cleanupId: cleanup._id,
                classification
            }
        });
        
    } catch (error) {
        console.error('[uploadCleanup] Error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to process cleanup'
        });
    }
};
```

---

## Design Principles (SOLID, DRY, KISS)

### 1. SOLID Principles

#### S - Single Responsibility Principle

**Definition**: A class/module should have one, and only one, reason to change.

**Implementation in Marine Care:**

```javascript
// ❌ BAD: Multiple responsibilities
class UserManager {
    async createUser(data) {
        // Validation
        if (!this.validateEmail(data.email)) {
            throw new Error('Invalid email');
        }
        
        // Password hashing
        data.password = await bcrypt.hash(data.password, 10);
        
        // Database operation
        const user = await db.users.insertOne(data);
        
        // Email sending
        await this.sendWelcomeEmail(user.email);
        
        // Logging
        await this.logUserCreation(user);
        
        return user;
    }
    
    validateEmail(email) { /* ... */ }
    sendWelcomeEmail(email) { /* ... */ }
    logUserCreation(user) { /* ... */ }
}

// ✅ GOOD: Single responsibility per module
// validation.js
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// authService.js
export const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};

// emailService.js
export const sendWelcomeEmail = async (email, name) => {
    // Send welcome email
};

// userRepository.js
export const createUser = async (userData) => {
    return User.create(userData);
};

// logger.js
export const logUserCreation = (user) => {
    console.log(`User created: ${user.email}`);
};

// authController.js (Orchestration)
export const register = async (req, res) => {
    // Validate
    if (!validateEmail(req.body.email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    
    // Hash password
    const hashedPassword = await hashPassword(req.body.password);
    
    // Create user
    const user = await createUser({
        ...req.body,
        password: hashedPassword
    });
    
    // Send email (non-blocking)
    sendWelcomeEmail(user.email, user.name).catch(console.error);
    
    // Log
    logUserCreation(user);
    
    res.status(201).json({ success: true, user });
};
```

---

(Document continues... This represents approximately 50% of the comprehensive content. Would you like me to continue with the remaining sections?)
