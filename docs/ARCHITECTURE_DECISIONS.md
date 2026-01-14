# 📋 Marine Care - Architecture Decision Records (ADR)

> **Documenting Key Architectural Decisions and Their Rationale**

**Document Version:** 2.0  
**Last Updated:** January 2026  
**Purpose:** System Design Decision Documentation for Interview Discussions

---

## Table of Contents

1. [Overview](#overview)
2. [ADR Template](#adr-template)
3. [Technology Stack Decisions](#technology-stack-decisions)
4. [Architecture Pattern Decisions](#architecture-pattern-decisions)
5. [Database Design Decisions](#database-design-decisions)
6. [Security Decisions](#security-decisions)
7. [Deployment Decisions](#deployment-decisions)
8. [Future Decisions](#future-decisions)

---

## Overview

### What is an ADR?

Architecture Decision Records (ADRs) are short documents that capture important architectural decisions made during a project, along with their context and consequences. They help:

- Preserve the reasoning behind decisions
- Onboard new team members
- Revisit decisions when context changes
- Demonstrate thought process in interviews

### ADR Format

Each ADR follows a consistent structure:
- **Status**: Proposed | Accepted | Deprecated | Superseded
- **Context**: What is the issue we're seeing that is motivating this decision?
- **Decision**: What is the change that we're proposing/doing?
- **Consequences**: What becomes easier or more difficult to do because of this change?

---

## ADR Template

```markdown
# ADR-XXX: [Short title of solved problem]

Date: YYYY-MM-DD
Status: [Proposed | Accepted | Deprecated | Superseded]

## Context

What is the issue that we're seeing that is motivating this decision or change?

## Decision

What is the change that we're actually proposing/doing?

## Consequences

What becomes easier or more difficult to do because of this change?

### Positive
- Benefit 1
- Benefit 2

### Negative
- Trade-off 1
- Trade-off 2

### Neutral
- Note 1

## Alternatives Considered

What other options were evaluated?

1. Alternative 1
   - Pros: ...
   - Cons: ...

2. Alternative 2
   - Pros: ...
   - Cons: ...

## Related Decisions

- ADR-XXX: ...
```

---

## Technology Stack Decisions

### ADR-001: Use Next.js for Frontend Framework

**Date**: September 2024  
**Status**: Accepted

#### Context

We need a modern React framework that provides:
- Server-side rendering for SEO
- File-based routing
- Built-in optimization
- Progressive Web App support
- Good developer experience

#### Decision

Use **Next.js 15** (latest stable) as the frontend framework.

#### Consequences

**Positive**:
- ✓ Excellent SEO out of the box with SSR
- ✓ Automatic code splitting and optimization
- ✓ Built-in image optimization
- ✓ Large community and ecosystem
- ✓ Vercel deployment integration
- ✓ PWA support via next-pwa

**Negative**:
- ✗ Larger bundle size than vanilla React
- ✗ Learning curve for Next.js-specific patterns
- ✗ Some limitations with App Router (newer than Pages Router)

**Neutral**:
- Server components require understanding of RSC
- Opinionated project structure

#### Alternatives Considered

1. **Create React App (CRA)**
   - Pros: Simpler, familiar
   - Cons: No SSR, deprecated, requires manual config
   - Verdict: Too basic for our needs

2. **Vite + React**
   - Pros: Faster builds, lighter weight
   - Cons: No built-in SSR, requires manual PWA setup
   - Verdict: Good option but more configuration needed

3. **Remix**
   - Pros: Modern patterns, great DX
   - Cons: Smaller ecosystem, fewer resources
   - Verdict: Too new, less community support

---

### ADR-002: Use MongoDB as Primary Database

**Date**: September 2024  
**Status**: Accepted

#### Context

We need a database that:
- Handles flexible document schemas
- Supports geospatial queries (location-based challenges)
- Scales horizontally
- Has good Node.js integration
- Provides managed cloud hosting

#### Decision

Use **MongoDB Atlas** as the primary database with Mongoose as the ODM.

#### Consequences

**Positive**:
- ✓ Flexible schema perfect for evolving requirements
- ✓ Native geospatial indexing (2dsphere)
- ✓ Excellent Node.js ecosystem (Mongoose)
- ✓ Managed service reduces operational complexity
- ✓ GridFS for integrated file storage
- ✓ Aggregation pipeline for complex analytics

**Negative**:
- ✗ No ACID transactions across documents (mitigated in v4+)
- ✗ Can lead to data duplication (denormalization)
- ✗ Learning curve for NoSQL mindset
- ✗ Index management requires attention

**Neutral**:
- Requires careful schema design
- Need to handle data consistency manually

#### Alternatives Considered

1. **PostgreSQL**
   - Pros: ACID compliance, relational integrity, mature
   - Cons: Rigid schema, complex geospatial setup, harder to scale horizontally
   - Verdict: Too rigid for MVP iteration speed

2. **MySQL**
   - Pros: Widely used, stable, good tools
   - Cons: Similar drawbacks to PostgreSQL
   - Verdict: Not as flexible as needed

3. **DynamoDB**
   - Pros: Serverless, auto-scaling, AWS integration
   - Cons: Vendor lock-in, complex querying, learning curve
   - Verdict: Over-engineered for current needs

---

### ADR-003: Use Firebase for Authentication

**Date**: September 2024  
**Status**: Accepted

#### Context

We need an authentication system that:
- Supports OAuth providers (Google, Facebook)
- Handles email/password authentication
- Provides secure token management
- Scales automatically
- Requires minimal backend implementation

#### Decision

Use **Firebase Authentication** for user authentication with Firebase Admin SDK on the backend.

#### Consequences

**Positive**:
- ✓ Battle-tested security
- ✓ Zero backend authentication logic needed
- ✓ Built-in OAuth integrations
- ✓ Automatic token refresh
- ✓ Free tier sufficient for MVP
- ✓ Email verification built-in
- ✓ Password reset flows included

**Negative**:
- ✗ Vendor lock-in to Firebase/Google
- ✗ Limited customization of auth UI
- ✗ Requires syncing with MongoDB for user data
- ✗ Additional SDK weight on frontend

**Neutral**:
- Need to duplicate user data in MongoDB
- Token verification on every API request

#### Alternatives Considered

1. **Auth0**
   - Pros: More features, flexible
   - Cons: More expensive, complex setup
   - Verdict: Over-featured for MVP

2. **JWT + bcrypt (Custom)**
   - Pros: Full control, no vendor lock-in
   - Cons: Security risk, time-consuming, OAuth complex
   - Verdict: Not worth the development time/risk

3. **Supabase Auth**
   - Pros: Open source, PostgreSQL integration
   - Cons: Not using PostgreSQL, smaller community
   - Verdict: Doesn't fit with MongoDB choice

---

### ADR-004: Use Hugging Face Transformers for AI Classification

**Date**: October 2024  
**Status**: Accepted

#### Context

We need an AI model that can:
- Classify trash types from images
- Run on commodity hardware (no GPU required)
- Work without internet (self-hosted)
- Be cost-effective (no API calls)
- Provide reasonable accuracy

#### Decision

Use **@xenova/transformers** (Transformers.js) with **CLIP** (zero-shot image classification) model.

#### Consequences

**Positive**:
- ✓ No external API costs
- ✓ Works offline
- ✓ Runs on CPU (Railway/DigitalOcean compatible)
- ✓ Flexible labels (zero-shot)
- ✓ Good accuracy (~80-90%)
- ✓ Model loaded once, reused

**Negative**:
- ✗ Large model size (~350MB)
- ✗ Slower than cloud APIs (1-2 sec vs ~200ms)
- ✗ Memory intensive (requires ~500MB RAM)
- ✗ Cold start penalty on first use
- ✗ Limited to pre-trained capabilities

**Neutral**:
- Need fallback for AI failures
- Model caching strategy required

#### Alternatives Considered

1. **Google Cloud Vision API**
   - Pros: Fast, accurate, scalable
   - Cons: Cost ($1.50 per 1000 images), internet required
   - Verdict: Too expensive at scale

2. **Custom TensorFlow Model**
   - Pros: Full control, optimized
   - Cons: Requires ML expertise, training data, GPU for training
   - Verdict: Out of scope for MVP

3. **Clarifai**
   - Pros: Pre-built trash models
   - Cons: Expensive, API dependency
   - Verdict: Cost prohibitive

---

## Architecture Pattern Decisions

### ADR-005: Use Layered Architecture Pattern

**Date**: September 2024  
**Status**: Accepted

#### Context

We need an architecture pattern that:
- Separates concerns clearly
- Makes testing easier
- Allows team members to work independently
- Supports future refactoring
- Is well-understood industry pattern

#### Decision

Implement a **layered architecture** with:
1. Presentation Layer (React components)
2. API Layer (Express routes/middleware)
3. Business Logic Layer (Controllers/Services)
4. Data Access Layer (Mongoose models)
5. Data Storage Layer (MongoDB)

#### Consequences

**Positive**:
- ✓ Clear separation of concerns
- ✓ Easy to test each layer independently
- ✓ Well-documented pattern
- ✓ Team can work on different layers simultaneously
- ✓ Easy to replace implementations (e.g., swap database)

**Negative**:
- ✗ More boilerplate code
- ✗ Potential performance overhead (multiple layers)
- ✗ Can be over-engineered for simple operations

**Neutral**:
- Requires discipline to maintain boundaries
- Need clear interfaces between layers

#### Alternatives Considered

1. **MVC (Model-View-Controller)**
   - Pros: Simpler, well-known
   - Cons: Less clear with React (which is already V)
   - Verdict: Doesn't fit well with React architecture

2. **Microservices**
   - Pros: Ultimate scalability
   - Cons: Over-engineered for MVP, operational complexity
   - Verdict: Premature optimization

3. **Monolithic (No layers)**
   - Pros: Simplest, fastest development
   - Cons: Becomes unmaintainable quickly
   - Verdict: Technical debt from day one

---

### ADR-006: Use Middleware Chain Pattern for Request Processing

**Date**: September 2024  
**Status**: Accepted

#### Context

We need a way to handle cross-cutting concerns like:
- Authentication
- Rate limiting
- Request validation
- Error handling
- Logging
- File upload processing

#### Decision

Use **Express middleware chain pattern** for request processing.

```javascript
router.post('/cleanups/upload',
    rateLimiter,          // Rate limiting
    verifyAuth,           // Authentication
    ensureUserExists,     // User sync
    upload.single('image'), // File upload
    uploadCleanup         // Business logic
);
```

#### Consequences

**Positive**:
- ✓ Composable and reusable
- ✓ Clear request flow
- ✓ Easy to add/remove middleware
- ✓ Testable in isolation
- ✓ Industry standard pattern

**Negative**:
- ✗ Order matters (can be confusing)
- ✗ Error handling can be tricky
- ✗ Request object mutation can lead to bugs

**Neutral**:
- Need clear documentation of middleware order
- Error handling middleware must be last

---

### ADR-007: Use Repository Pattern via Mongoose Models

**Date**: October 2024  
**Status**: Accepted

#### Context

We need a consistent way to:
- Access database
- Encapsulate query logic
- Make testing easier
- Potentially swap database implementations

#### Decision

Use **Repository Pattern** implemented through Mongoose static methods.

```javascript
// Repository methods as static methods
challengeSchema.statics.findActive = function() {
    return this.find({ status: 'active' });
};

challengeSchema.statics.findByProvince = function(province) {
    return this.find({ province, status: 'active' });
};

// Usage in controllers
const challenges = await Challenge.findActive();
```

#### Consequences

**Positive**:
- ✓ Centralized data access logic
- ✓ Easier to test (mock repositories)
- ✓ Consistent API across application
- ✓ Database implementation details hidden

**Negative**:
- ✗ Additional abstraction layer
- ✗ Can be overkill for simple queries

**Neutral**:
- Mongoose already provides some repository functionality
- Need to decide which queries belong in repository

---

## Database Design Decisions

### ADR-008: Use Document Embedding for Waste Breakdown

**Date**: October 2024  
**Status**: Accepted

#### Context

Challenge documents need to track waste breakdown by category. Should this be:
- Embedded sub-document?
- Separate collection with references?

#### Decision

**Embed waste breakdown** as a sub-document in Challenge schema.

```javascript
wasteBreakdown: {
    plastic_bottle: { type: Number, default: 0 },
    metal_can: { type: Number, default: 0 },
    plastic_bag: { type: Number, default: 0 },
    // ...
}
```

#### Consequences

**Positive**:
- ✓ Single query to get all challenge data
- ✓ Atomic updates with $inc
- ✓ No joins needed
- ✓ Better performance for reads

**Negative**:
- ✗ Denormalized data
- ✗ Can't query waste breakdown independently
- ✗ Need to update multiple challenges if category changes

**Neutral**:
- Waste categories are relatively static
- Alternative would be over-engineered

---

### ADR-009: Use GridFS for Image Storage

**Date**: October 2024  
**Status**: Accepted

#### Context

We need to store images uploaded by users. Options:
- GridFS (MongoDB)
- Cloud storage (S3, Cloudinary)
- File system on server

#### Decision

Use **GridFS** (MongoDB's file storage system) for MVP.

#### Consequences

**Positive**:
- ✓ Integrated with MongoDB (single data store)
- ✓ No additional service/cost
- ✓ Automatic chunking for large files
- ✓ Streaming support
- ✓ Consistent backup strategy

**Negative**:
- ✗ Not optimized for large-scale image serving
- ✗ Uses MongoDB storage quota
- ✗ No CDN integration
- ✗ Slower than dedicated storage

**Neutral**:
- Good for MVP, should migrate to S3/Cloudinary at scale
- Need to implement image optimization

#### Migration Path

At 10,000+ users or 100GB+ images:
- Migrate to AWS S3 or Cloudinary
- Use CDN for image delivery
- Implement image optimization pipeline
- Keep GridFS for backward compatibility

---

### ADR-010: Use Geospatial Indexes for Location Queries

**Date**: October 2024  
**Status**: Accepted

#### Context

Challenges are location-based. We need to:
- Find challenges near a user
- Filter by province
- Display on maps

#### Decision

Use **MongoDB 2dsphere indexes** for geospatial queries.

```javascript
challengeSchema.index({ location: '2dsphere' });

// Query nearby challenges
Challenge.find({
    location: {
        $near: {
            $geometry: {
                type: 'Point',
                coordinates: [longitude, latitude]
            },
            $maxDistance: 50000 // 50km
        }
    }
});
```

#### Consequences

**Positive**:
- ✓ Native MongoDB feature
- ✓ Efficient radius queries
- ✓ Supports GeoJSON standard
- ✓ Works with many mapping libraries

**Negative**:
- ✗ Index overhead
- ✗ GeoJSON format can be confusing [lon, lat] vs [lat, lon]
- ✗ Limited to Earth's surface (not generic)

---

## Security Decisions

### ADR-011: Use HttpOnly Cookies for Session Management

**Date**: November 2024  
**Status**: Accepted

#### Context

We need to store authentication tokens securely. Options:
- localStorage (vulnerable to XSS)
- sessionStorage (lost on tab close)
- HttpOnly cookies (XSS-safe)

#### Decision

Use **HttpOnly cookies** for storing Firebase session tokens.

#### Consequences

**Positive**:
- ✓ Protected from XSS attacks
- ✓ Automatic inclusion in requests
- ✓ Can set Secure and SameSite flags
- ✓ Industry best practice

**Negative**:
- ✗ Vulnerable to CSRF (mitigated with SameSite)
- ✗ Doesn't work with mobile apps (need alternative for native apps)
- ✗ Requires CORS configuration

**Neutral**:
- Need CSRF tokens for state-changing operations
- Requires backend support for cookie handling

---

### ADR-012: Implement Rate Limiting at Multiple Levels

**Date**: October 2024  
**Status**: Accepted

#### Context

Need to prevent:
- Brute force attacks
- API abuse
- DDoS attacks
- Resource exhaustion

#### Decision

Implement **multi-level rate limiting**:
1. Authentication endpoints: 5 req/min
2. API endpoints: 100 req/min
3. Upload endpoints: 10 req/min

#### Consequences

**Positive**:
- ✓ Prevents abuse
- ✓ Protects backend resources
- ✓ Reduces costs
- ✓ Improves stability

**Negative**:
- ✗ Can impact legitimate users during bursts
- ✗ Requires careful tuning
- ✗ Need Redis for distributed rate limiting

---

## Deployment Decisions

### ADR-013: Deploy Frontend on Vercel

**Date**: September 2024  
**Status**: Accepted

#### Context

Need hosting platform for Next.js frontend with:
- Global CDN
- Automatic deployments
- Preview environments
- SSL/HTTPS
- Good performance

#### Decision

Deploy frontend on **Vercel**.

#### Consequences

**Positive**:
- ✓ Built for Next.js
- ✓ Free tier generous
- ✓ Automatic deployments from Git
- ✓ Preview deployments for PRs
- ✓ Global edge network
- ✓ Zero configuration

**Negative**:
- ✗ Vendor lock-in
- ✗ Costs increase with scale
- ✗ Limited backend capabilities (serverless functions only)

---

### ADR-014: Deploy Backend on Railway/DigitalOcean

**Date**: September 2024  
**Status**: Accepted

#### Context

Need hosting for Node.js backend that:
- Supports long-running processes (AI model)
- Affordable
- Easy deployment
- Scalable

#### Decision

Deploy backend on **Railway** (primary) or **DigitalOcean App Platform** (alternative).

#### Consequences

**Positive**:
- ✓ Supports long-running processes
- ✓ Easy deployment from Git
- ✓ Affordable pricing
- ✓ Automatic HTTPS
- ✓ Environment variable management

**Negative**:
- ✗ Not as mature as AWS/GCP
- ✗ Fewer regions than major cloud providers
- ✗ Limited advanced features

---

## Future Decisions

### ADR-015: Consider Microservices Migration (Proposed)

**Date**: TBD (Future)  
**Status**: Proposed

#### Context

As the system grows beyond 100,000 users, we may need:
- Independent scaling of components
- Better fault isolation
- Faster deployments
- Team autonomy

#### Proposed Decision

Migrate to microservices architecture with:
- User Service
- Challenge Service
- Cleanup Service
- AI Service (already separate-ish)
- Analytics Service

#### Expected Consequences

**Positive**:
- Independent scaling
- Isolated failures
- Faster development cycles
- Technology flexibility per service

**Negative**:
- Operational complexity
- Distributed system challenges
- Need service mesh/API gateway
- Higher infrastructure costs

#### When to Decide

Trigger conditions:
- 100,000+ active users
- Team size > 10 developers
- Deployment bottlenecks
- Scaling pain points

---

## Related Documentation

- [System Design Patterns](./SYSTEM_DESIGN_PATTERNS.md)
- [Scalability Strategies](./SCALABILITY_STRATEGIES.md)
- [System Design Interview Guide](./SYSTEM_DESIGN_INTERVIEW_GUIDE.md)
- [Technical Stack](./TECHNICAL_STACK.md)

---

*Document maintained by the Marine Care development team*
