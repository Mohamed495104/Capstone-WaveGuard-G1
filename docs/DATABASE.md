# Marine Care - Database Architecture

> Database architecture documentation including models, relationships, and indexing

**Last Updated:** December 2024  
**Version:** 1.1

---

## Table of Contents

1. [Overview](#overview)
2. [Database Configuration](#database-configuration)
3. [Data Models](#data-models)
4. [Entity Relationships](#entity-relationships)
5. [Indexes](#indexes)
6. [GridFS Image Storage](#gridfs-image-storage)
7. [Aggregation Queries](#aggregation-queries)
8. [Data Seeding](#data-seeding)

---

## Overview

Marine Care uses MongoDB Atlas as its primary database, with Mongoose as the ODM (Object Document Mapper). The database stores user profiles, cleanup challenges, cleanup records, and achievements.

### Database Architecture

```
MongoDB Atlas
    │
    ├── Collections
    │   ├── users
    │   ├── challenges
    │   ├── cleanups
    │   ├── achievements
    │   ├── newsletters
    │   └── notifications
    │
    └── GridFS (Image Storage)
        ├── fs.files
        └── fs.chunks
```

### Key Features

- **Document-based storage** - Flexible schema for evolving requirements
- **Geospatial queries** - Location-based challenge search
- **GridFS** - Built-in file storage for images
- **Aggregation framework** - Complex analytics queries
- **Indexing** - Optimized query performance

---

## Database Configuration

### Connection Setup

**Location:** `backend/src/config/db.js`

```javascript
import mongoose from "mongoose";

export async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // Connection options handled by driver defaults
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
}
```

### Environment Configuration

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

---

## Data Models

### User Model

**Collection:** `users`  
**Location:** `backend/src/models/User.js`

```javascript
const userSchema = new mongoose.Schema({
    // Firebase Integration
    firebaseUid: { type: String, required: true, unique: true },
    
    // Basic Info
    name: { type: String },
    email: { type: String, required: true, unique: true },
    profileImage: String,
    location: { type: String, default: "" },
    bio: { type: String, default: "" },
    
    // Address (Optional detailed location)
    address: {
        fullAddress: { type: String, default: "" },
        streetAddress: { type: String, default: "" },
        city: { type: String, default: "" },
        province: { type: String, default: "" },
        postalCode: { type: String, default: "" },
        country: { type: String, default: "Canada" },
        coordinates: {
            latitude: { type: Number },
            longitude: { type: Number }
        }
    },
    
    // Live Statistics
    totalItemsCollected: { type: Number, default: 0 },
    totalCleanups: { type: Number, default: 0 },
    totalChallenges: { type: Number, default: 0 },
    impactScore: { type: Number, default: 0 },
    
    // Relationships
    joinedChallenges: [{ type: ObjectId, ref: "Challenge" }],
    
}, { timestamps: true });
```

**Sample Document:**
```json
{
    "_id": "65c2a987654321098765432a",
    "firebaseUid": "firebase-uid-123",
    "name": "John Doe",
    "email": "john@example.com",
    "profileImage": "https://...",
    "location": "Toronto, ON",
    "bio": "Ocean conservation enthusiast",
    "totalItemsCollected": 427,
    "totalCleanups": 12,
    "totalChallenges": 3,
    "impactScore": 8900,
    "joinedChallenges": ["65c2a123...", "65c2a456..."],
    "createdAt": "2024-09-01T00:00:00.000Z",
    "updatedAt": "2024-10-10T12:30:00.000Z"
}
```

---

### Challenge Model

**Collection:** `challenges`  
**Location:** `backend/src/models/Challenge.js`

```javascript
const wasteBreakdownSchema = new mongoose.Schema({
    plastic_bottle: { type: Number, default: 0 },
    metal_can: { type: Number, default: 0 },
    plastic_bag: { type: Number, default: 0 },
    paper_cardboard: { type: Number, default: 0 },
    cigarette_butt: { type: Number, default: 0 },
    glass_bottle: { type: Number, default: 0 },
}, { _id: false });

const challengeSchema = new mongoose.Schema({
    // Basic Info
    title: { type: String, required: true },
    description: String,
    bannerImage: String,
    
    // Dates
    startDate: Date,
    endDate: Date,
    status: { 
        type: String, 
        enum: ["active", "completed", "upcoming"], 
        default: "active" 
    },
    
    // Location
    locationName: { type: String, required: true },
    province: { type: String, required: true },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true }, // [longitude, latitude]
    },
    
    // Goals
    goal: { type: Number, default: 0 },
    goalUnit: { type: String, default: "items" },
    
    // Live Statistics
    totalTrashCollected: { type: Number, default: 0 },
    totalVolunteers: { type: Number, default: 0 },
    wasteBreakdown: { type: wasteBreakdownSchema, default: () => ({}) },
    
    // Metadata
    createdBy: { type: ObjectId, ref: "User" },
    
}, { timestamps: true });

// Geospatial index
challengeSchema.index({ location: "2dsphere" });
```

**Sample Document:**
```json
{
    "_id": "65c2a123456789012345678a",
    "title": "Toronto Waterfront Cleanup",
    "description": "Join us to clean the Toronto waterfront...",
    "bannerImage": "/images/challenge1.jpg",
    "startDate": "2024-10-15T00:00:00.000Z",
    "endDate": "2024-10-22T00:00:00.000Z",
    "status": "active",
    "locationName": "Toronto, ON",
    "province": "ON",
    "location": {
        "type": "Point",
        "coordinates": [-79.3832, 43.6532]
    },
    "goal": 5000,
    "goalUnit": "items",
    "totalTrashCollected": 3421,
    "totalVolunteers": 234,
    "wasteBreakdown": {
        "plastic_bottle": 150,
        "metal_can": 85,
        "plastic_bag": 120,
        "paper_cardboard": 60,
        "cigarette_butt": 45,
        "glass_bottle": 30
    }
}
```

---

### Cleanup Model

**Collection:** `cleanups`  
**Location:** `backend/src/models/Cleanup.js`

```javascript
const classificationResultSchema = new mongoose.Schema({
    label: {
        type: String,
        enum: [
            "plastic_bottle",
            "metal_can",
            "plastic_bag",
            "paper_cardboard",
            "cigarette_butt",
            "glass_bottle",
            "unknown"
        ],
        required: true,
    },
    confidence: { type: Number, default: 0 },
}, { _id: false });

const cleanupSchema = new mongoose.Schema({
    // Relationships
    userId: { type: ObjectId, ref: "User", required: true, index: true },
    challengeId: { type: ObjectId, ref: "Challenge", required: true, index: true },
    
    // Image Storage
    imageFileId: { type: ObjectId }, // GridFS file ID
    
    // Classification
    logType: { type: String, enum: ["ai", "manual"], default: "ai" },
    status: { type: String, enum: ["processing", "completed", "failed"], default: "processing" },
    classificationResult: { type: classificationResultSchema },
    
    // Count
    itemCount: { type: Number, default: 1 },
    
}, { timestamps: true });
```

**Sample Document:**
```json
{
    "_id": "65c2a789012345678901234a",
    "userId": "65c2a987654321098765432a",
    "challengeId": "65c2a123456789012345678a",
    "imageFileId": "65c2a111222333444555666a",
    "logType": "ai",
    "status": "completed",
    "classificationResult": {
        "label": "plastic_bottle",
        "confidence": 0.87
    },
    "itemCount": 1,
    "createdAt": "2024-10-08T14:30:00.000Z"
}
```

---

### Achievement Model

**Collection:** `achievements`  
**Location:** `backend/src/models/Achievement.js`

```javascript
const achievementSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, default: "🏆" },
    category: {
        type: String,
        enum: ["participation", "collection", "impact", "special"],
        default: "participation"
    },
    rarity: {
        type: String,
        enum: ["common", "uncommon", "rare", "legendary"],
        default: "common"
    },
    threshold: { type: Number, default: 1 },
    field: { type: String, required: true }, // Which user field to check
}, { timestamps: true });
```

---

## Entity Relationships

### ER Diagram

```
┌─────────────────────────┐
│        User             │
│─────────────────────────│
│ _id: ObjectId           │
│ firebaseUid: String     │◄────────────┐
│ name: String            │             │
│ email: String           │             │
│ totalItemsCollected     │             │
│ joinedChallenges: [     │             │
│   ObjectId ──────┐      │             │
│ ]                │      │             │
└──────────────────┼──────┘             │
                   │                    │
                   │ References         │
                   │                    │
                   ▼                    │
┌──────────────────────────┐            │
│      Challenge           │            │
│──────────────────────────│            │
│ _id: ObjectId            │◄───────┐   │
│ title: String            │        │   │
│ status: String           │        │   │
│ goal: Number             │        │   │
│ totalTrashCollected      │        │   │
│ totalVolunteers          │        │   │
│ wasteBreakdown: {...}    │        │   │
│ location: GeoJSON        │        │   │
└──────────────────────────┘        │   │
                                    │   │
                                    │   │
┌─────────────────────────────┐     │   │
│        Cleanup              │     │   │
│─────────────────────────────│     │   │
│ _id: ObjectId               │     │   │
│ userId: ObjectId ───────────┼─────┘   │
│ challengeId: ObjectId ──────┼─────────┘
│ imageFileId: ObjectId ──────┼──────┐
│ classificationResult: {...} │      │
│ itemCount: Number           │      │
│ logType: String             │      │
│ status: String              │      │
└─────────────────────────────┘      │
                                     │ References
                                     ▼
                          ┌──────────────────┐
                          │ GridFS (Images)  │
                          │──────────────────│
                          │ fs.files         │
                          │ fs.chunks        │
                          └──────────────────┘
```

### Relationship Summary

| From | To | Type | Description |
|------|----|------|-------------|
| User | Challenge | Many-to-Many | Users can join multiple challenges |
| Cleanup | User | Many-to-One | Each cleanup belongs to one user |
| Cleanup | Challenge | Many-to-One | Each cleanup belongs to one challenge |
| Cleanup | GridFS | One-to-One | Each cleanup may have one image |

---

## Indexes

### User Collection Indexes

```javascript
// Primary lookup index
userSchema.index({ firebaseUid: 1 }, { unique: true });

// Email uniqueness
userSchema.index({ email: 1 }, { unique: true });

// Leaderboard queries
userSchema.index({ totalItemsCollected: -1 });
userSchema.index({ impactScore: -1 });
```

### Challenge Collection Indexes

```javascript
// Status filtering
challengeSchema.index({ status: 1 });

// Date range queries
challengeSchema.index({ startDate: 1, endDate: 1 });

// Province filtering
challengeSchema.index({ province: 1 });

// Geospatial queries (location-based search)
challengeSchema.index({ location: "2dsphere" });
```

### Cleanup Collection Indexes

```javascript
// User's cleanup history
cleanupSchema.index({ userId: 1, createdAt: -1 });

// Challenge statistics
cleanupSchema.index({ challengeId: 1 });

// Recent activity queries
cleanupSchema.index({ createdAt: -1 });

// Combined query optimization
cleanupSchema.index({ userId: 1, challengeId: 1 });
```

---

## GridFS Image Storage

### Overview

GridFS is MongoDB's specification for storing large files (>16MB). Marine Care uses GridFS for cleanup photos.

### Collections

| Collection | Purpose |
|------------|---------|
| `fs.files` | File metadata (filename, contentType, uploadDate) |
| `fs.chunks` | Binary file data in 255KB chunks |

### Upload Flow

```javascript
import { GridFSBucket } from 'mongodb';

export const uploadToGridFS = async (fileBuffer, filename, contentType) => {
    const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'fs'
    });
    
    const uploadStream = bucket.openUploadStream(filename, {
        contentType,
        metadata: {
            uploadedAt: new Date(),
            originalName: filename
        }
    });
    
    uploadStream.write(fileBuffer);
    uploadStream.end();
    
    return new Promise((resolve, reject) => {
        uploadStream.on('finish', () => resolve(uploadStream.id));
        uploadStream.on('error', reject);
    });
};
```

### Retrieval Flow

```javascript
export const getFromGridFS = async (fileId) => {
    const bucket = new GridFSBucket(mongoose.connection.db, {
        bucketName: 'fs'
    });
    
    return bucket.openDownloadStream(new ObjectId(fileId));
};
```

### File Metadata Structure

```json
{
    "_id": "65c2a111222333444555666a",
    "length": 245678,
    "chunkSize": 261120,
    "uploadDate": "2024-10-08T14:30:00.000Z",
    "filename": "cleanup-1234567890.jpg",
    "contentType": "image/jpeg",
    "metadata": {
        "uploadedAt": "2024-10-08T14:30:00.000Z",
        "originalName": "photo.jpg"
    }
}
```

---

## Aggregation Queries

### Dashboard Statistics

```javascript
// Monthly progress for last 6 months
const monthlyData = await Cleanup.aggregate([
    { $match: { userId: new ObjectId(userId) } },
    {
        $group: {
            _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
            },
            items: { $sum: '$itemCount' }
        }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 6 }
]);
```

### Waste Distribution

```javascript
// Breakdown by category for a user
const wasteDistribution = await Cleanup.aggregate([
    { $match: { userId: new ObjectId(userId) } },
    {
        $group: {
            _id: '$classificationResult.label',
            count: { $sum: '$itemCount' }
        }
    }
]);
```

### User Ranking

```javascript
// Get user's rank by items collected
const rank = await User.countDocuments({
    totalItemsCollected: { $gt: user.totalItemsCollected }
}) + 1;
```

### Leaderboard

```javascript
// Top 10 users by items collected
const leaderboard = await User.find()
    .select('name location totalItemsCollected profileImage')
    .sort({ totalItemsCollected: -1 })
    .limit(10);
```

### Community Statistics

```javascript
// Global totals
const communityStats = await User.aggregate([
    {
        $group: {
            _id: null,
            totalItems: { $sum: '$totalItemsCollected' },
            totalVolunteers: { $sum: 1 }
        }
    }
]);
```

---

## Data Seeding

### Seed Script

**Location:** `backend/src/scripts/seedChallenges.js`

```javascript
import mongoose from 'mongoose';
import Challenge from '../models/Challenge.js';
import { connectDB } from '../config/db.js';

const challenges = [
    {
        title: "Toronto Waterfront Cleanup",
        description: "Join us to clean the Toronto waterfront...",
        locationName: "Toronto, ON",
        province: "ON",
        location: {
            type: "Point",
            coordinates: [-79.3832, 43.6532]
        },
        startDate: new Date("2024-10-15"),
        endDate: new Date("2024-10-22"),
        status: "active",
        goal: 5000,
        goalUnit: "items"
    },
    // ... more challenges
];

async function seed() {
    await connectDB();
    await Challenge.deleteMany({});
    await Challenge.insertMany(challenges);
    console.log('✅ Challenges seeded');
    process.exit(0);
}

seed();
```

### Running Seeds

```bash
npm run seed
```

---

## Best Practices

### Query Optimization

1. **Use indexes** for frequently queried fields
2. **Limit projections** - select only needed fields
3. **Use aggregation** for complex calculations
4. **Avoid N+1 queries** - use population wisely

### Data Integrity

1. **Atomic updates** - use `$inc`, `$push`, `$addToSet`
2. **Rollback handling** - for multi-document operations
3. **Validation** - use Mongoose schema validation
4. **Unique constraints** - prevent duplicate data

### Example: Atomic Challenge Join

```javascript
// Update both user and challenge atomically
await User.findByIdAndUpdate(userId, {
    $addToSet: { joinedChallenges: challengeId },
    $inc: { totalChallenges: 1 }
});

await Challenge.findByIdAndUpdate(challengeId, {
    $inc: { totalVolunteers: 1 }
});
```

---

## Related Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Overall system design
- [Backend Architecture](./BACKEND_ARCHITECTURE.md) - Backend details
- [API Reference](./API_REFERENCE.md) - Complete API documentation

---

*Document maintained by the Marine Care development team*
