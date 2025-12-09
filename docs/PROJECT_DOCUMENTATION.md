# 🌊 Marine Care - AI-Powered Shoreline Cleanup Management

---

## Group Members

- **Dinesh Babu Ilamaran** - Frontend Lead
- **Mohamed Ijas** - Backend Lead
- **Dharanya Selvaraj** - AI Integration Lead
- **Siri Reddy Borem** - Documentation & Testing

---

**Course:** PROG8751 Capstone (Web Development)  
**Date:** Fall 2025  
**Instructor:** [Professor's Name]  
**Institution:** Conestoga College

---

## Project Summary

Marine Care is an AI-powered Progressive Web App (PWA) designed to empower travelers and beach-goers to become active volunteers in shoreline protection efforts across Canada. The application addresses the growing problem of plastic pollution in coastal and freshwater ecosystems by making cleanup activities more organized, measurable, and engaging through intelligent waste classification technology. Users can upload photos of collected trash and receive instant AI-powered identification of waste types, participate in community cleanup challenges at various Canadian locations, track their personal and collective environmental impact, and earn badges and achievements for their conservation efforts. The app generates valuable data for marine researchers by aggregating detailed waste classification statistics, geographic distribution patterns, and volunteer participation metrics. By gamifying the cleanup experience with challenges, leaderboards, and achievements, Marine Care transforms casual beach visitors into engaged environmental stewards while building a comprehensive dataset to inform future conservation strategies and policy decisions.

---

## Key Features & Showcase Video

### Top Features

- **📸 AI-Powered Waste Classification** - Upload photos of collected trash and receive instant identification of waste types (plastic bottles, metal cans, plastic bags, paper/cardboard, cigarette butts, glass bottles) using Hugging Face Transformers, with confidence scores for accurate data collection

- **🗺️ Canada-Focused Cleanup Challenges** - Browse and join location-based cleanup challenges at Canadian shorelines and freshwater ecosystems, featuring real-time progress tracking, volunteer counts, and goal-based achievements

- **📊 Impact Analytics Dashboard** - Comprehensive personal and community statistics including monthly progress charts, waste distribution visualizations, leaderboard rankings, and environmental impact scores

- **🏆 Gamification & Achievements** - Earn badges and rewards for participation milestones, compete on leaderboards, and unlock achievements ranging from "First Cleanup" to legendary conservation accomplishments

- **💚 Secure Donations** - Support ocean cleanup initiatives through integrated PayPal payment processing, enabling users to contribute financially to marine conservation efforts

### Showcase Video

📹 **Showcase Video:** Coming soon (pending final upload)

---

## Final Architecture

### System Architecture Diagram

The Marine Care application follows a modern three-tier architecture with clear separation between the client, server, and database layers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Browser/PWA)                           │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │   Dashboard     │  │   Challenges    │  │     Upload      │              │
│  │   (Analytics)   │  │  (Browse/Join)  │  │  (AI/Manual)    │              │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│           │                    │                     │                       │
│           └────────────────────┴─────────────────────┘                       │
│                              │                                               │
│                   ┌──────────▼──────────┐                                   │
│                   │   Firebase Auth     │                                   │
│                   │  (Google OAuth)     │                                   │
│                   └──────────┬──────────┘                                   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │               Next.js 16 / React 19 / Material UI 7                  │   │
│  │               Recharts, Framer Motion, Axios, Firebase SDK           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ HTTPS (Bearer Token)
                                   │
                        ═══════════▼════════════
                         REST API Communication
                        ═══════════▼════════════
                                   │
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                         SERVER LAYER (Node.js/Express)                       │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        MIDDLEWARE PIPELINE                           │  │
│  │                                                                      │  │
│  │  CORS ──▶ Rate Limiting ──▶ verifyFirebaseToken ──▶ ensureUserExists│  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                   │                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        ROUTES & CONTROLLERS                          │  │
│  │                                                                      │  │
│  │  /api/auth/* ──────▶ Authentication (register, sync)                │  │
│  │  /api/challenges/* ─▶ Challenge CRUD, join/leave                    │  │
│  │  /api/cleanups/* ───▶ Photo upload, AI classification               │  │
│  │  /api/dashboard/* ──▶ User analytics & stats                        │  │
│  │  /api/achievements/*▶ Badges & rewards                              │  │
│  │  /api/profile/* ────▶ User profile management                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                   │                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        BUSINESS SERVICES                             │  │
│  │                                                                      │  │
│  │  AI Service ──────▶ @xenova/transformers (waste classification)     │  │
│  │  File Service ────▶ GridFS (image storage)                          │  │
│  │  Image Service ───▶ Sharp (image processing)                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                         ═══════════▼════════════
                          MongoDB Connection
                         ═══════════▼════════════
                                    │
┌───────────────────────────────────▼─────────────────────────────────────────┐
│                         DATABASE LAYER (MongoDB Atlas)                       │
│                                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                 │
│  │     users      │  │   challenges   │  │    cleanups    │                 │
│  │  (profiles)    │  │  (events)      │  │   (records)    │                 │
│  └────────────────┘  └────────────────┘  └────────────────┘                 │
│                                                                             │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                 │
│  │  achievements  │  │  newsletters   │  │  notifications │                 │
│  │   (badges)     │  │ (subscribers)  │  │   (alerts)     │                 │
│  └────────────────┘  └────────────────┘  └────────────────┘                 │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                     GridFS (Image Storage)                           │  │
│  │                                                                      │  │
│  │  fs.files ──────▶ Metadata (filename, contentType, uploadDate)      │  │
│  │  fs.chunks ─────▶ Binary image data in 255KB chunks                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Schema (ER Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIP DIAGRAM                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────┐
│            User               │
│───────────────────────────────│
│ _id: ObjectId (PK)            │
│ firebaseUid: String (unique)  │◄────────────────────────────────┐
│ name: String                  │                                 │
│ email: String (unique)        │                                 │
│ profileImage: String          │                                 │
│ location: String              │                                 │
│ bio: String                   │                                 │
│ address: {                    │                                 │
│   fullAddress, city,          │                                 │
│   province, postalCode,       │                                 │
│   country, coordinates        │                                 │
│ }                             │                                 │
│ totalItemsCollected: Number   │                                 │
│ totalCleanups: Number         │                                 │
│ totalChallenges: Number       │                                 │
│ impactScore: Number           │                                 │
│ joinedChallenges: [ObjectId]──┼─────────┐                       │
│ createdAt: Date               │         │                       │
│ updatedAt: Date               │         │                       │
└───────────────────────────────┘         │                       │
                                          │ Many-to-Many          │
                                          │                       │
┌───────────────────────────────┐         │                       │
│          Challenge            │◄────────┘                       │
│───────────────────────────────│                                 │
│ _id: ObjectId (PK)            │◄─────────────────────┐          │
│ title: String                 │                      │          │
│ description: String           │                      │          │
│ bannerImage: String           │                      │          │
│ startDate: Date               │                      │          │
│ endDate: Date                 │                      │          │
│ status: Enum [active,         │                      │          │
│   completed, upcoming]        │                      │          │
│ locationName: String          │                      │          │
│ province: String              │                      │          │
│ location: {                   │                      │          │
│   type: "Point",              │                      │          │
│   coordinates: [lng, lat]     │                      │          │
│ }                             │                      │          │
│ goal: Number                  │                      │          │
│ goalUnit: String              │                      │          │
│ totalTrashCollected: Number   │                      │          │
│ totalVolunteers: Number       │                      │          │
│ wasteBreakdown: {             │                      │          │
│   plastic_bottle, metal_can,  │                      │          │
│   plastic_bag, paper_cardboard│                      │          │
│   cigarette_butt, glass_bottle│                      │          │
│ }                             │                      │          │
│ createdBy: ObjectId (FK)──────┼──────────────────────┼──────────┘
│ createdAt: Date               │                      │
│ updatedAt: Date               │                      │
└───────────────────────────────┘                      │
                                                       │
┌───────────────────────────────┐                      │
│           Cleanup             │                      │
│───────────────────────────────│                      │
│ _id: ObjectId (PK)            │                      │
│ userId: ObjectId (FK)─────────┼──────────────────────┼──────────┐
│ challengeId: ObjectId (FK)────┼──────────────────────┘          │
│ imageFileId: ObjectId (FK)────┼─────────────┐                   │
│ logType: Enum [ai, manual]    │             │                   │
│ status: Enum [processing,     │             │                   │
│   completed, failed]          │             │                   │
│ classificationResult: {       │             │                   │
│   label: Enum [plastic_bottle,│             │                   │
│     metal_can, plastic_bag,   │             │                   │
│     paper_cardboard,          │             │                   │
│     cigarette_butt,           │             │                   │
│     glass_bottle, unknown],   │             │                   │
│   confidence: Number          │             │                   │
│ }                             │             │ One-to-One        │
│ itemCount: Number             │             │                   │
│ createdAt: Date               │             │                   │
│ updatedAt: Date               │             │                   │
└───────────────────────────────┘             │                   │
                                              │                   │
┌───────────────────────────────┐             │                   │
│      GridFS (fs.files)        │◄────────────┘                   │
│───────────────────────────────│                                 │
│ _id: ObjectId (PK)            │                                 │
│ filename: String              │                                 │
│ contentType: String           │                                 │
│ length: Number                │                                 │
│ chunkSize: Number             │                                 │
│ uploadDate: Date              │                                 │
│ metadata: {                   │                                 │
│   uploadedAt, originalName    │                                 │
│ }                             │                                 │
└───────────────────────────────┘                                 │
                                                                  │
┌───────────────────────────────┐                                 │
│         Achievement           │                                 │
│───────────────────────────────│                                 │
│ _id: ObjectId (PK)            │                                 │
│ name: String (unique)         │                                 │
│ description: String           │                                 │
│ icon: String (emoji)          │                                 │
│ category: Enum [participation,│                                 │
│   collection, impact, special]│                                 │
│ rarity: Enum [common,         │                                 │
│   uncommon, rare, legendary]  │                                 │
│ threshold: Number             │                                 │
│ field: String                 │                                 │
│ createdAt: Date               │                                 │
│ updatedAt: Date               │                                 │
└───────────────────────────────┘                                 │
                                                                  │
                    ┌─────────────────────────────────────────────┘
                    │
                    ▼
            Relationship Key:
            ─────────────────
            User ──< Cleanup (One-to-Many: A user can have many cleanups)
            Challenge ──< Cleanup (One-to-Many: A challenge can have many cleanups)
            User >──< Challenge (Many-to-Many: Users join multiple challenges)
            Cleanup ── GridFS (One-to-One: Each cleanup may have one image)
```

### Data Flow Diagrams

**Cleanup Upload Flow:**
```
User uploads photo ──▶ POST /api/cleanups/upload ──▶ Middleware (Auth) ──▶
──▶ Save to GridFS ──▶ AI Classification (@xenova/transformers) ──▶
──▶ Create Cleanup Record ──▶ Update User Stats ──▶ Update Challenge Stats ──▶
──▶ Response { label, confidence }
```

**Authentication Flow:**
```
User clicks login ──▶ Firebase Auth (Google OAuth/Email) ──▶ Get ID Token ──▶
──▶ POST /api/auth/sync ──▶ Verify Token (Firebase Admin) ──▶
──▶ Find/Create MongoDB User ──▶ User Authenticated
```

---

## Technology Stack

### Front-End

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.x | React framework with App Router, SSR, SSG |
| **React** | 19.x | UI component library |
| **Material UI (MUI)** | 7.x | Pre-built React components |
| **Emotion** | 11.x | CSS-in-JS styling engine |
| **Recharts** | 3.x | Data visualization (charts and graphs) |
| **Framer Motion** | 12.x | Animations and page transitions |
| **Axios** | 1.x | HTTP client for API requests |
| **Firebase SDK** | 12.x | Client-side authentication |
| **next-pwa** | 5.x | Progressive Web App support |
| **Vercel Analytics** | 1.x | Web analytics |

### Back-End

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime environment |
| **Express** | 5.x | Web application framework |
| **Mongoose** | 8.x | MongoDB ODM |
| **Firebase Admin SDK** | 13.x | Server-side token verification |
| **Multer** | 2.x | File upload handling |
| **Sharp** | 0.34.x | Image processing and optimization |
| **CORS** | 2.x | Cross-origin resource sharing |
| **dotenv** | 17.x | Environment variable management |
| **bcryptjs** | 3.x | Password hashing |
| **jsonwebtoken** | 9.x | JWT handling |

### Database

| Technology | Service | Purpose |
|------------|---------|---------|
| **MongoDB** | MongoDB Atlas | Document database (NoSQL) |
| **GridFS** | Integrated | Large file storage for images |

### APIs

| API | Purpose |
|-----|---------|
| **Firebase Authentication** | User authentication (Email/Password, Google OAuth) |
| **PayPal API** | Secure donation processing |
| **Location Services** | Canadian location verification |

### AI Model

| Technology | Version | Purpose |
|------------|---------|---------|
| **Hugging Face Transformers** | @xenova/transformers 2.x | On-device AI inference for waste classification |

**Classification Categories:**
- `plastic_bottle` - Plastic bottles and containers
- `metal_can` - Aluminum and metal cans
- `plastic_bag` - Plastic bags and film
- `paper_cardboard` - Paper and cardboard items
- `cigarette_butt` - Cigarette filters and butts
- `glass_bottle` - Glass bottles and containers
- `unknown` - Unidentified waste items

### Deployment/Hosting

| Component | Service | Features |
|-----------|---------|----------|
| **Frontend** | Vercel | Zero-config deployment, Global CDN, HTTPS, Preview deployments |
| **Backend** | DigitalOcean App Platform | GitHub integration, Auto-deployments, Environment variables |
| **Database** | MongoDB Atlas | Managed MongoDB, Free tier (512MB), Automatic backups |
| **Authentication** | Firebase | Managed auth service, OAuth providers |

---

## Challenges & Key Learnings

### Technical Challenges

**1. AI Model Integration and Performance**

Integrating the Hugging Face Transformers library for waste classification posed significant challenges. Initially, we explored calling external APIs for image classification, but this introduced latency issues and dependency on third-party service availability. The team pivoted to using `@xenova/transformers`, which allows AI inference directly on the server without external API calls. This decision required learning about model loading optimization, handling memory constraints on serverless deployments, and implementing efficient caching strategies. We learned that on-device AI models provide better privacy guarantees and eliminate external dependencies, though they require careful consideration of server resources and cold start times.

**2. Real-Time Statistics Synchronization**

Maintaining consistent statistics across users, challenges, and the global leaderboard proved challenging, especially when multiple users were logging cleanups simultaneously. We implemented atomic MongoDB operations using `$inc` and `$addToSet` operators to ensure data integrity without complex transaction management. This taught us the importance of designing database operations that are inherently safe for concurrent access and the value of MongoDB's atomic update capabilities for maintaining aggregate statistics.

**3. Firebase and MongoDB User Synchronization**

Coordinating user data between Firebase Authentication and MongoDB required careful handling of edge cases. We implemented a middleware pattern that automatically creates or syncs MongoDB user records whenever a Firebase-authenticated user makes an API request. The biggest learning was implementing proper rollback mechanisms during registration - if MongoDB user creation failed after Firebase user creation, we needed to clean up the Firebase user to prevent orphaned accounts. This experience reinforced the importance of designing idempotent operations and proper error recovery strategies.

### Teamwork Challenges

**1. Coordinating Full-Stack Development**

With team members working on different parts of the stack (frontend, backend, AI integration, testing), we faced integration challenges when combining components. We established clear API contracts early in development, used shared type definitions, and implemented comprehensive API documentation. Regular code reviews and pair programming sessions helped ensure consistent coding standards across the project.

**2. Time Management with Academic Schedules**

Balancing capstone development with other academic commitments required strict prioritization and sprint planning. We adopted a modified Agile approach with weekly sprints and daily async standups via Discord. This taught us the importance of realistic scope estimation and the value of MVP-focused development - building core features first before adding enhancements.

### Key Learnings

- **Progressive Web App Development**: Building for offline-first mobile experiences requires thoughtful caching strategies and graceful degradation
- **Authentication Security**: Implementing industry-standard auth requires understanding token lifecycle, rate limiting, and input validation
- **Database Design**: Document databases require different design thinking than relational databases, especially for aggregation queries
- **Team Collaboration**: Clear communication channels and documentation are essential for distributed team development

---

## Accessibility Statement

Marine Care is committed to providing an accessible experience for all users, including those with disabilities. We have implemented the following accessibility features to ensure our application meets WCAG 2.1 AA standards:

### Implemented Accessibility Features

**Visual Accessibility:**
- High contrast color combinations meeting WCAG AA requirements (minimum 4.5:1 contrast ratio for normal text)
- Information is never conveyed by color alone - icons and text labels supplement color indicators
- Focus indicators are visible on all interactive elements without relying solely on color
- Semantic color usage with proper contrast for success, warning, error, and information states

**Keyboard Navigation:**
- All interactive elements are fully accessible via keyboard navigation
- Tab order follows logical visual layout
- Skip navigation links allow users to bypass repetitive content
- Focus management ensures focus is not trapped in any component

**Screen Reader Support:**
- Semantic HTML structure (proper heading hierarchy, landmarks, lists)
- ARIA labels on all interactive elements (buttons, links, form controls)
- Live regions for dynamic content updates (toast notifications, loading states)
- Alternative text for all images and icons

**Mobile Accessibility:**
- Minimum touch target size of 44x44 pixels for all interactive elements
- Responsive design that maintains accessibility at all viewport sizes
- Pull-to-refresh and swipe gestures have keyboard-accessible alternatives

**Forms and Inputs:**
- Clear labels associated with all form fields
- Error messages are announced to screen readers
- Required fields are indicated both visually and programmatically
- Password strength indicators provide accessible feedback

### Validation Tools Used

The application has been tested using:
- **AChecker** - Automated accessibility testing
- **Lighthouse** - Google's accessibility audit tool
- **WAVE** - Web Accessibility Evaluation Tool
- **VoiceOver (macOS/iOS)** - Screen reader testing
- **Keyboard-only navigation testing** - Manual testing without mouse input

### Continuous Commitment

We continuously review and improve our accessibility features based on user feedback and evolving web standards. If you encounter any accessibility barriers while using Marine Care, please contact our team so we can address them promptly.

---

## Future Work

Marine Care has significant potential for future enhancements that would increase its impact on marine conservation efforts:

### Planned Features

**1. Enhanced AI Classification**
- Train custom models on Canadian-specific waste types and marine debris
- Implement multi-object detection to classify multiple items in a single photo
- Add species identification for wildlife sightings during cleanups
- Provide recyclability information and proper disposal guidance for each waste type

**2. Community Features**
- Implement team/organization accounts for coordinated cleanup events
- Add social features including user profiles, following, and activity feeds
- Create in-app messaging for challenge coordination
- Enable photo sharing and community galleries

**3. Advanced Analytics**
- Develop researcher portal with exportable datasets and visualization tools
- Implement predictive analytics for pollution hotspot identification
- Add seasonal trend analysis and weather correlation
- Create municipality dashboards for local government partnerships

**4. Mobile Enhancements**
- Develop native iOS and Android applications for improved performance
- Add augmented reality (AR) features for gamified trash discovery
- Implement offline-first architecture with background sync
- Enable push notifications for challenge reminders and achievements

**5. Geographic Expansion**
- Extend location database beyond Canada to support global shorelines
- Partner with international marine conservation organizations
- Support multiple languages and regional waste classification standards
- Integrate with existing environmental monitoring networks

**6. Monetization and Sustainability**
- Implement corporate sponsorship tiers for cleanup challenges
- Create verified impact certificates for volunteer hours
- Develop partnerships with recycling facilities for proper waste routing
- Enable recurring donation subscriptions

**7. Data and Research Integration**
- Integrate with academic research institutions for data sharing
- Implement standardized data export formats (CSV, GeoJSON) for researchers
- Add API endpoints for third-party applications and dashboards
- Create annual impact reports with visualization exports

---

*© 2025 Marine Care Team - Conestoga College Capstone Project*
