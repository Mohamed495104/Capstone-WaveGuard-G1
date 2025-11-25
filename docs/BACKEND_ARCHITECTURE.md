# Marine Care - Backend Architecture

> Backend architecture and workflow documentation

**Last Updated:** November 2024  
**Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Middleware Pipeline](#middleware-pipeline)
5. [Route Architecture](#route-architecture)
6. [Controller Patterns](#controller-patterns)
7. [Service Layer](#service-layer)
8. [Error Handling](#error-handling)
9. [File Upload & Storage](#file-upload--storage)
10. [AI Integration](#ai-integration)
11. [Security Implementation](#security-implementation)

---

## Overview

The Marine Care backend is a Node.js/Express REST API that provides:

- User authentication and profile management
- Challenge management and participation
- Cleanup logging with AI-powered image classification
- Dashboard analytics and statistics
- Achievement tracking and leaderboards

### Design Principles

1. **RESTful API Design**: Standard HTTP methods and status codes
2. **Middleware-First**: Authentication and validation in middleware
3. **Clean Separation**: Routes → Controllers → Services → Models
4. **Atomic Operations**: Database transactions for data integrity
5. **Security-First**: Input validation, rate limiting, proper auth

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20.x | Runtime environment |
| Express | 5.x | Web framework |
| MongoDB | 8.x | Database (via Mongoose) |
| Firebase Admin | 13.x | Server-side token verification |
| @xenova/transformers | 2.x | AI trash classification |
| Multer | 2.x | File upload handling |
| Sharp | 0.34.x | Image processing |
| cookie-parser | 1.x | Cookie handling |
| CORS | 2.x | Cross-origin resource sharing |
| dotenv | 17.x | Environment variables |

---

## Project Structure

```
backend/
├── src/
│   ├── api/                    # External API integrations
│   ├── config/
│   │   ├── db.js              # MongoDB connection
│   │   └── firebase.js        # Firebase Admin SDK setup
│   ├── controllers/
│   │   ├── achievementsController.js
│   │   ├── authController.js
│   │   ├── challengeController.js
│   │   ├── cleanupController.js
│   │   ├── dashboardController.js
│   │   ├── homeController.js
│   │   ├── imageController.js
│   │   └── profileController.js
│   ├── data/                   # Seed data and constants
│   ├── middleware/
│   │   ├── authMiddleware.js  # Firebase token verification
│   │   ├── errorMiddleware.js # Global error handler
│   │   ├── rateLimiter.js     # Rate limiting
│   │   └── userMiddleware.js  # MongoDB user sync
│   ├── models/
│   │   ├── Achievement.js
│   │   ├── Challenge.js
│   │   ├── Cleanup.js
│   │   ├── Newsletter.js
│   │   ├── Notification.js
│   │   └── User.js
│   ├── routes/
│   │   ├── achievementsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── challengeRoutes.js
│   │   ├── cleanupRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── homeRoutes.js
│   │   ├── imageRoutes.js
│   │   ├── locationRoutes.js
│   │   ├── newsletterRoutes.js
│   │   └── profileRoutes.js
│   ├── scripts/
│   │   └── seedChallenges.js  # Database seeding
│   ├── services/
│   │   ├── aiService.js       # AI classification
│   │   ├── fileService.js     # GridFS operations
│   │   └── imageService.js    # Image processing
│   ├── utils/
│   │   └── validation.js      # Input validation utilities
│   ├── app.js                  # Express app configuration
│   └── server.js               # Server entry point
├── .env.example                # Environment template
├── package.json
└── README.md
```

---

## Middleware Pipeline

### Request Flow

```
Client Request
     │
     ▼
┌─────────────────────────────────────────┐
│           Express Middleware            │
├─────────────────────────────────────────┤
│ 1. CORS                                 │
│ 2. cookie-parser                        │
│ 3. express.json()                       │
│ 4. express.urlencoded()                 │
│ 5. Rate Limiter (on specific routes)    │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│           Route Handler                 │
├─────────────────────────────────────────┤
│ 6. verifyFirebaseToken (protected)      │
│ 7. ensureUserExists (protected)         │
│ 8. Controller Logic                     │
└─────────────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────────┐
│           Error Middleware              │
├─────────────────────────────────────────┤
│ 9. errorMiddleware (catches all errors) │
└─────────────────────────────────────────┘
     │
     ▼
  Response
```

### Auth Middleware Chain

```javascript
// Protected route pattern
router.get("/profile",
    verifyFirebaseToken,  // 1. Verify Firebase ID token
    ensureUserExists,     // 2. Get/create MongoDB user
    getProfile            // 3. Controller function
);
```

### verifyFirebaseToken

```javascript
export const verifyFirebaseToken = async (req, res, next) => {
    // 1. Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // 2. Verify with Firebase (checkRevoked = true)
        const decoded = await admin.auth().verifyIdToken(token, true);
        
        // 3. Attach user info to request
        req.user = decoded;
        next();
    } catch (err) {
        if (err.code === 'auth/id-token-expired') {
            return res.status(401).json({ message: "Session expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};
```

### ensureUserExists

```javascript
export const ensureUserExists = async (req, res, next) => {
    const { uid, email, name, picture } = req.user;

    // Find or create MongoDB user
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
        user = await User.create({
            firebaseUid: uid,
            email,
            name: name || "Anonymous",
            profileImage: picture || "",
        });
    }

    req.mongoUser = user;
    next();
};
```

---

## Route Architecture

### Public Routes (No Auth Required)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/sync` | Sync Firebase user |
| GET | `/api/auth/check-email` | Check email availability |
| GET | `/api/home/stats` | Public statistics |
| GET | `/api/challenges` | List all challenges |
| GET | `/api/challenges/stats` | Challenge statistics |

### Protected Routes (Auth Required)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/profile` | Get user profile |
| PATCH | `/api/profile` | Update profile |
| POST | `/api/profile/upload-image` | Upload profile picture |
| GET | `/api/challenges/joined` | User's joined challenges |
| POST | `/api/challenges/:id/join` | Join a challenge |
| POST | `/api/challenges/:id/leave` | Leave a challenge |
| POST | `/api/cleanups/upload` | Upload cleanup photo |
| POST | `/api/cleanups/manual` | Manual cleanup log |
| GET | `/api/dashboard/stats` | Dashboard analytics |
| GET | `/api/achievements` | User achievements |
| GET | `/api/achievements/leaderboard` | Leaderboard |

---

## Controller Patterns

### Standard Controller Structure

```javascript
export const controllerFunction = async (req, res) => {
    try {
        // 1. Extract and validate input
        const { param1, param2 } = req.body;
        
        // 2. Business logic
        const result = await someService(param1, param2);
        
        // 3. Return success response
        res.status(200).json({
            success: true,
            data: result
        });
        
    } catch (error) {
        console.error('Operation failed:', error);
        res.status(500).json({
            success: false,
            message: 'Operation failed'
        });
    }
};
```

### Challenge Controller Example

```javascript
export const joinChallenge = async (req, res) => {
    const { id } = req.params;
    const userId = req.mongoUser._id;

    try {
        // Update user's joined challenges
        await User.findByIdAndUpdate(userId, {
            $addToSet: { joinedChallenges: id },
            $inc: { totalChallenges: 1 }
        });

        // Increment challenge volunteer count
        const challenge = await Challenge.findByIdAndUpdate(id, {
            $inc: { totalVolunteers: 1 }
        }, { new: true });

        res.json({
            message: 'Joined successfully',
            challenge
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to join challenge' });
    }
};
```

---

## Service Layer

### AI Service

The AI service uses @xenova/transformers for trash classification.

```javascript
// services/aiService.js
import { pipeline } from '@xenova/transformers';

let classifier = null;

export const classifyImage = async (imageBuffer) => {
    // Lazy load the model
    if (!classifier) {
        classifier = await pipeline('image-classification', 'model-name');
    }

    // Classify the image
    const results = await classifier(imageBuffer);
    
    // Map to our waste categories
    const label = mapToCategory(results[0].label);
    
    return {
        label,
        confidence: results[0].score
    };
};
```

### File Service (GridFS)

```javascript
// services/fileService.js
import { GridFSBucket } from 'mongodb';

export const uploadToGridFS = async (fileBuffer, filename, contentType) => {
    const bucket = new GridFSBucket(mongoose.connection.db);
    
    const uploadStream = bucket.openUploadStream(filename, {
        contentType
    });
    
    uploadStream.write(fileBuffer);
    uploadStream.end();
    
    return uploadStream.id;
};

export const getFromGridFS = async (fileId) => {
    const bucket = new GridFSBucket(mongoose.connection.db);
    return bucket.openDownloadStream(fileId);
};
```

---

## Error Handling

### Error Middleware

```javascript
// middleware/errorMiddleware.js
export const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err);

    // Don't expose internal errors in production
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(err.status || 500).json({
        success: false,
        message: isDevelopment ? err.message : 'Internal server error',
        ...(isDevelopment && { stack: err.stack })
    });
};
```

### Standard Error Responses

| Status | Code | Description |
|--------|------|-------------|
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Internal error |

### Error Response Format

```json
{
    "success": false,
    "message": "Error description"
}
```

---

## File Upload & Storage

### Multer Configuration

```javascript
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});
```

### Upload Flow

```
Client uploads image
        │
        ▼
┌───────────────────────┐
│ Multer parses file    │
│ (memory storage)      │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ Sharp processes image │
│ (resize, optimize)    │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ GridFS stores image   │
│ (returns fileId)      │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│ AI classifies image   │
│ (label, confidence)   │
└───────────┬───────────┘
            │
            ▼
    Save cleanup record
```

---

## AI Integration

### Classification Categories

```javascript
const WASTE_CATEGORIES = [
    'plastic_bottle',
    'metal_can',
    'plastic_bag',
    'paper_cardboard',
    'cigarette_butt',
    'glass_bottle',
    'unknown'
];
```

### AI Response Format

```json
{
    "label": "plastic_bottle",
    "confidence": 0.87
}
```

### Fallback Handling

If AI classification fails, the upload still succeeds with manual categorization option.

---

## Security Implementation

### Rate Limiting

```javascript
// middleware/rateLimiter.js
const CONFIG = {
    AUTH_MAX_REQUESTS: 5,       // 5 requests/min
    API_MAX_REQUESTS: 100,      // 100 requests/min
    BLOCK_DURATION_MS: 15 * 60 * 1000,  // 15 min block
    WINDOW_MS: 60 * 1000,       // 1 minute window
};

export const authRateLimiter = (req, res, next) => {
    const clientId = getClientIP(req);
    
    if (isBlocked(clientId)) {
        return res.status(429).json({
            message: "Too many attempts. Try again later."
        });
    }
    
    incrementCount(clientId);
    
    if (exceedsLimit(clientId)) {
        blockClient(clientId);
        return res.status(429).json({
            message: "Rate limit exceeded."
        });
    }
    
    next();
};
```

### Input Validation

```javascript
// utils/validation.js
export const validateEmail = (email) => {
    // RFC 5322 compliant regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
    
    if (!email || !emailRegex.test(email)) {
        return { valid: false, error: 'Invalid email format' };
    }
    
    return { valid: true, sanitized: email.toLowerCase() };
};

export const validatePassword = (password) => {
    if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters' };
    }
    
    // Require complexity
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        return { valid: false, error: 'Password must include upper, lower, number, and special character' };
    }
    
    return { valid: true };
};

export const sanitizeInput = (input) => {
    return input.replace(/[<>{}[\]\\/"';`]/g, '').trim();
};
```

### CORS Configuration

```javascript
app.use(cors({
    origin: [
        "http://localhost:3000",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
```

---

## Environment Variables

### Required Variables

```env
# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Firebase (Service Account)
# Place serviceAccount.json in src/config/

# Frontend
FRONTEND_URL=https://your-app.vercel.app

# Optional
PORT=5000
NODE_ENV=production
```

---

## Related Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Overall system design
- [Database Architecture](./DATABASE.md) - Data models and relationships
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [Authentication](./AUTHENTICATION.md) - Auth flow details

---

*Document maintained by the Marine Care development team*
