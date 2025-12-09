# Marine Care - API Reference

> Complete API documentation for all endpoints

**Last Updated:** November 2024  
**Version:** 1.0  
**Base URL (Development):** `http://localhost:5000/api`  
**Base URL (Production):** `https://your-backend-url.ondigitalocean.app/api`

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Auth Endpoints](#auth-endpoints)
4. [Challenge Endpoints](#challenge-endpoints)
5. [Cleanup Endpoints](#cleanup-endpoints)
6. [Dashboard Endpoints](#dashboard-endpoints)
7. [Profile Endpoints](#profile-endpoints)
8. [Achievement Endpoints](#achievement-endpoints)
9. [Home Endpoints](#home-endpoints)
10. [Image Endpoints](#image-endpoints)
11. [Location Endpoints](#location-endpoints)
12. [Support Endpoints](#support-endpoints)
13. [Error Responses](#error-responses)

---

## Overview

The Marine Care API is a RESTful API built with Express.js. All responses are in JSON format.

### Request Headers

```
Content-Type: application/json
Authorization: Bearer <firebase-id-token>  (for protected endpoints)
```

### Response Format

**Success:**
```json
{
    "success": true,
    "data": { ... }
}
```

**Error:**
```json
{
    "success": false,
    "message": "Error description"
}
```

---

## Authentication

Protected endpoints require a Firebase ID token in the Authorization header.

### Getting a Token (Frontend)

```javascript
import { auth } from '@/lib/firebase';

const token = await auth.currentUser.getIdToken();
// Use in header: Authorization: Bearer <token>
```

### API Call Helper (Frontend)

```javascript
import { apiCall } from '@/utils/api';

// Automatically includes auth token
const response = await apiCall('get', '/api/profile');
```

---

## Auth Endpoints

### Register User

Creates a new user account in both Firebase and MongoDB.

```
POST /api/auth/register
```

**Rate Limit:** 5 requests/min

**Request Body:**
```json
{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
}
```

**Validation:**
- Email: Valid format, unique
- Password: Min 8 chars, upper/lower/number/special
- Name: 2-50 characters

**Response (201):**
```json
{
    "success": true,
    "user": {
        "_id": "65c2a...",
        "email": "user@example.com",
        "name": "John Doe",
        "totalItemsCollected": 0,
        "totalCleanups": 0
    }
}
```

**Errors:**
- `400` - Invalid input or email already registered
- `500` - Registration failed

---

### Sync User

Syncs Firebase user with MongoDB (creates if not exists).

```
POST /api/auth/sync
```

**Rate Limit:** 5 requests/min

**Request Body:**
```json
{
    "idToken": "eyJhbGciOi..."
}
```

**Response (200):**
```json
{
    "success": true,
    "user": {
        "_id": "65c2a...",
        "firebaseUid": "firebase-uid",
        "email": "user@example.com",
        "name": "John Doe"
    }
}
```

---

### Check Email

Checks if an email is already registered.

```
GET /api/auth/check-email?email=user@example.com
```

**Rate Limit:** 30 requests/min

**Response (200):**
```json
{
    "exists": true
}
```

---

## Challenge Endpoints

### List Challenges

Gets all challenges with optional filtering.

```
GET /api/challenges
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status (active, upcoming, completed) |
| province | string | Filter by province code (ON, BC, etc.) |

**Response (200):**
```json
[
    {
        "_id": "65c2a123...",
        "title": "Toronto Waterfront Cleanup",
        "description": "Join us to clean...",
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
            "plastic_bag": 120
        }
    }
]
```

---

### Get Challenge Statistics

Gets aggregated statistics for all challenges.

```
GET /api/challenges/stats
```

**Response (200):**
```json
{
    "totalChallenges": 15,
    "activeVolunteers": 1501,
    "itemsCollected": 22861,
    "provinces": 10
}
```

---

### Get Single Challenge

Gets details for a specific challenge.

```
GET /api/challenges/:id
```

**Response (200):**
```json
{
    "_id": "65c2a123...",
    "title": "Toronto Waterfront Cleanup",
    "description": "...",
    "status": "active",
    "totalTrashCollected": 3421,
    "totalVolunteers": 234,
    "goal": 5000,
    "wasteBreakdown": { ... }
}
```

---

### Join Challenge

🔒 **Requires Authentication**

Joins the authenticated user to a challenge.

```
POST /api/challenges/:id/join
```

**Response (200):**
```json
{
    "message": "Joined successfully",
    "challenge": {
        "_id": "65c2a123...",
        "title": "Toronto Waterfront Cleanup",
        "totalVolunteers": 235
    }
}
```

**Side Effects:**
- Adds challenge to `user.joinedChallenges`
- Increments `user.totalChallenges`
- Increments `challenge.totalVolunteers`

---

### Leave Challenge

🔒 **Requires Authentication**

Removes the authenticated user from a challenge.

```
POST /api/challenges/:id/leave
```

**Response (200):**
```json
{
    "message": "Left successfully",
    "challenge": {
        "_id": "65c2a123...",
        "totalVolunteers": 234
    }
}
```

---

### Get Joined Challenges

🔒 **Requires Authentication**

Gets all challenges the user has joined.

```
GET /api/challenges/joined
```

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| status | string | Filter by status |

**Response (200):**
```json
[
    {
        "_id": "65c2a123...",
        "title": "Toronto Waterfront Cleanup",
        "status": "active"
    }
]
```

---

## Cleanup Endpoints

### Upload Cleanup Photo

🔒 **Requires Authentication**

Uploads a cleanup photo for AI classification.

```
POST /api/cleanups/upload
```

**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image | File | Yes | Image file (max 10MB) |
| challengeId | string | Yes | Challenge MongoDB ID |
| latitude | number | Yes | User's current latitude |
| longitude | number | Yes | User's current longitude |

**Example:**
```javascript
const formData = new FormData();
formData.append('image', file);
formData.append('challengeId', '65c2a123...');
formData.append('latitude', '43.6532');
formData.append('longitude', '-79.3832');

await apiCall('post', '/api/cleanups/upload', formData);
```

**Response (200):**
```json
{
    "message": "Success! AI classified as: plastic_bottle",
    "result": {
        "label": "plastic_bottle",
        "confidence": 0.87
    }
}
```

**Error Responses:**
```json
// Location too far (400)
{
    "message": "You are too far from the challenge location (8.5 km away)",
    "distance": 8.5,
    "maxDistance": 5,
    "error": "LOCATION_TOO_FAR"
}

// AI unavailable (503)
{
    "message": "AI classification is currently unavailable",
    "error": "AI_UNAVAILABLE"
}
```

**Side Effects:**
- Creates Cleanup record
- Updates `user.totalItemsCollected`
- Updates `user.totalCleanups`
- Updates `challenge.totalTrashCollected`
- Updates `challenge.wasteBreakdown`

---

### Manual Cleanup Log

🔒 **Requires Authentication**

Manually logs a cleanup without AI.

```
POST /api/cleanups/manual
```

**Request Body:**
```json
{
    "challengeId": "65c2a123...",
    "label": "plastic_bottle",
    "itemCount": 10,
    "latitude": 43.6532,
    "longitude": -79.3832
}
```

**Valid Labels:**
- `plastic_bottle`
- `metal_can`
- `plastic_bag`
- `paper_cardboard`
- `cigarette_butt`
- `glass_bottle`
- `unknown`

**Response (200):**
```json
{
    "message": "Successfully logged 10 item(s) as plastic_bottle."
}
```

---

## Dashboard Endpoints

### Get Dashboard Stats

🔒 **Requires Authentication**

Gets user's dashboard analytics.

```
GET /api/dashboard/stats
```

**Response (200):**
```json
{
    "user": {
        "totalItemsCollected": 427,
        "totalCleanups": 12,
        "impactScore": 8900,
        "rank": 47
    },
    "monthlyProgress": [
        { "month": "Jun", "year": 2024, "items": 50 },
        { "month": "Jul", "year": 2024, "items": 65 },
        { "month": "Aug", "year": 2024, "items": 75 },
        { "month": "Sep", "year": 2024, "items": 85 },
        { "month": "Oct", "year": 2024, "items": 110 }
    ],
    "wasteDistribution": [
        { "label": "plastic_bottle", "count": 150 },
        { "label": "metal_can", "count": 85 },
        { "label": "plastic_bag", "count": 120 }
    ],
    "recentActivity": [
        {
            "challengeId": "65c2a123...",
            "challengeTitle": "Toronto Waterfront Cleanup",
            "location": "Toronto, ON",
            "itemCount": 34,
            "date": "2024-10-08T00:00:00.000Z"
        }
    ],
    "community": {
        "totalItems": 12547,
        "totalVolunteers": 2891
    }
}
```

---

## Profile Endpoints

### Get Profile

🔒 **Requires Authentication**

Gets the current user's profile.

```
GET /api/profile
```

**Response (200):**
```json
{
    "_id": "65c2a...",
    "firebaseUid": "firebase-uid",
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
    "createdAt": "2024-09-01T00:00:00.000Z"
}
```

---

### Update Profile

🔒 **Requires Authentication**

Updates the current user's profile.

```
PATCH /api/profile
```

**Request Body:**
```json
{
    "name": "John Doe",
    "location": "Vancouver, BC",
    "bio": "Updated bio text"
}
```

**Response (200):**
```json
{
    "_id": "65c2a...",
    "name": "John Doe",
    "location": "Vancouver, BC",
    "bio": "Updated bio text"
}
```

---

### Upload Profile Image

🔒 **Requires Authentication**

Uploads a new profile picture.

```
POST /api/profile/upload-image
```

**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image | File | Yes | Image file (max 10MB) |

**Response (200):**
```json
{
    "success": true,
    "user": {
        "profileImage": "/api/images/65c2a..."
    }
}
```

---

## Achievement Endpoints

### Get Achievements

🔒 **Requires Authentication**

Gets user's achievements and badge progress.

```
GET /api/achievements
```

**Response (200):**
```json
{
    "badges": [
        {
            "name": "First Cleanup",
            "description": "Completed your first cleanup",
            "icon": "🎉",
            "rarity": "common",
            "earnedAt": "2024-09-05T12:00:00.000Z"
        },
        {
            "name": "Century Club",
            "description": "Collected 100 items",
            "icon": "💯",
            "rarity": "uncommon",
            "earnedAt": "2024-09-28T14:30:00.000Z"
        }
    ],
    "progress": {
        "nextBadge": "500 Club",
        "currentCount": 427,
        "requiredCount": 500,
        "percentage": 85.4
    }
}
```

---

### Get Leaderboard

🔒 **Requires Authentication**

Gets the global leaderboard.

```
GET /api/achievements/leaderboard
```

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | number | 10 | Number of results (max 100) |

**Response (200):**
```json
[
    {
        "_id": "65c2a...",
        "name": "Sarah Chen",
        "location": "Vancouver, BC",
        "profileImage": "https://...",
        "totalItemsCollected": 482,
        "rank": 1
    },
    {
        "_id": "65c2b...",
        "name": "Michael Torres",
        "location": "Toronto, ON",
        "profileImage": "https://...",
        "totalItemsCollected": 427,
        "rank": 2
    }
]
```

---

### Get Milestones

🔒 **Requires Authentication**

Gets achievement milestones and user's progress.

```
GET /api/achievements/milestones
```

**Response (200):**
```json
{
    "milestones": [
        {
            "name": "First Cleanup",
            "threshold": 1,
            "achieved": true
        },
        {
            "name": "Century Club",
            "threshold": 100,
            "achieved": true
        },
        {
            "name": "500 Club",
            "threshold": 500,
            "achieved": false,
            "progress": 85.4
        }
    ]
}
```

---

## Home Endpoints

### Get Public Statistics

Gets public statistics for the landing page.

```
GET /api/home/stats
```

**Response (200):**
```json
{
    "totalItems": 22861,
    "totalVolunteers": 1501,
    "totalChallenges": 15,
    "activeChallenges": 8
}
```

---

### Get Login Page Stats

Gets statistics for the login page.

```
GET /api/home/login-stats
```

**Response (200):**
```json
{
    "totalItems": 22861,
    "totalVolunteers": 1501
}
```

---

## Image Endpoints

### Get Image

Retrieves an image from GridFS.

```
GET /api/images/:id
```

**Response:** Image binary with appropriate Content-Type header

---

## Error Responses

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Server Error - Internal error |
| 503 | Service Unavailable - AI service down |

### Error Response Format

```json
{
    "success": false,
    "message": "Human-readable error message",
    "error": "ERROR_CODE"  // Optional
}
```

### Common Errors

**Authentication:**
```json
{ "message": "No token provided" }
{ "message": "Invalid token" }
{ "message": "Session expired. Please login again." }
```

**Validation:**
```json
{ "message": "Invalid email format" }
{ "message": "Password must be at least 8 characters" }
{ "message": "Invalid challenge ID" }
```

**Rate Limiting:**
```json
{ "message": "Too many attempts. Try again in 15 minutes." }
```

---

## Rate Limits

| Endpoint | Limit | Block Duration |
|----------|-------|----------------|
| `POST /api/auth/register` | 5/min | 15 minutes |
| `POST /api/auth/sync` | 5/min | 15 minutes |
| `GET /api/auth/check-email` | 30/min | - |
| All other API routes | 100/min | - |

---

## Testing with cURL

### Get challenges (public)
```bash
curl http://localhost:5000/api/challenges
```

### Join a challenge (authenticated)
```bash
curl -X POST http://localhost:5000/api/challenges/65c2a.../join \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Upload cleanup photo
```bash
curl -X POST http://localhost:5000/api/cleanups/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@photo.jpg" \
  -F "challengeId=65c2a..." \
  -F "latitude=43.6532" \
  -F "longitude=-79.3832"
```

---

## Location Endpoints

These endpoints provide location search and verification features for challenge creation.

### Search Locations

Search for Canadian locations using Nominatim geocoding.

```
GET /api/location/search
```

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (min 2 characters) |

**Example Request:**

```bash
curl "http://localhost:5000/api/location/search?q=Vancouver%20Beach"
```

**Success Response (200):**

```json
{
    "success": true,
    "count": 5,
    "locations": [
        {
            "placeId": 12345678,
            "name": "English Bay Beach, Vancouver, British Columbia, Canada",
            "latitude": 49.2860,
            "longitude": -123.1435,
            "type": "beach",
            "category": "natural",
            "address": {
                "name": "English Bay Beach",
                "city": "Vancouver",
                "state": "British Columbia",
                "country": "Canada"
            }
        }
    ]
}
```

### Verify Water Proximity

Check if a location is near water bodies (shoreline, lake, beach, river).

```
GET /api/location/verify-water
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `lat` | number | Yes | - | Latitude |
| `lon` | number | Yes | - | Longitude |
| `radius` | number | No | 5000 | Search radius in meters |

**Example Request:**

```bash
curl "http://localhost:5000/api/location/verify-water?lat=49.2860&lon=-123.1435"
```

**Success Response (200):**

```json
{
    "success": true,
    "isNearWater": true,
    "waterFeaturesCount": 3,
    "closestWater": {
        "type": "coastline",
        "name": "English Bay",
        "distance": 0.45
    },
    "searchRadius": 5,
    "message": "Found 3 water feature(s) within 5km"
}
```

### Combined Location Verification

Verify both user proximity to location AND water proximity in one call.

```
POST /api/location/verify
```

**Request Body:**

```json
{
    "userLat": 49.2850,
    "userLon": -123.1430,
    "locationLat": 49.2860,
    "locationLon": -123.1435,
    "maxDistanceKm": 5
}
```

**Success Response (200):**

```json
{
    "success": true,
    "isValid": true,
    "userDistance": 0.12,
    "isUserNearLocation": true,
    "isNearWater": true,
    "maxDistanceKm": 5,
    "message": "Location verified successfully"
}
```

---

## Support Endpoints

Contact form and support request management.

### Submit Contact Request

Submit a new support/contact request. Stored in MongoDB for tracking.

```
POST /api/support/contact
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Sender's name (max 100 chars) |
| `email` | string | Yes | Sender's email address |
| `category` | string | Yes | One of: general, technical, account, challenge, feedback, partnership, other |
| `subject` | string | Yes | Message subject (max 200 chars) |
| `message` | string | Yes | Message content (max 5000 chars) |

**Example Request:**

```bash
curl -X POST http://localhost:5000/api/support/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "category": "technical",
    "subject": "Issue with photo upload",
    "message": "I am unable to upload photos to challenges..."
  }'
```

**Success Response (201):**

```json
{
    "success": true,
    "message": "Your message has been submitted successfully. We'll get back to you within 24-48 hours.",
    "data": {
        "ticketId": "64a1b2c3d4e5f6g7h8i9j0k1",
        "category": "Technical Support",
        "submittedAt": "2024-11-30T12:00:00.000Z"
    }
}
```

**Error Response (400):**

```json
{
    "success": false,
    "message": "All fields are required: name, email, category, subject, message"
}
```

### Get Support Requests (Admin)

Retrieve all support requests. Reserved for future admin functionality.

```
GET /api/support/requests
```

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | No | - | Filter by status (pending, in_progress, resolved, closed) |
| `category` | string | No | - | Filter by category |
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 20 | Results per page |

### Update Support Request (Admin)

Update a support request status. Reserved for future admin functionality.

```
PATCH /api/support/requests/:id
```

**Request Body:**

```json
{
    "status": "in_progress",
    "adminNotes": "Investigating the issue",
    "respondedBy": "admin@marinecare.ca"
}
```

---

## Related Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Overall system design
- [Backend Architecture](./BACKEND_ARCHITECTURE.md) - Backend details
- [Authentication](./AUTHENTICATION.md) - Auth flow documentation
- [Database](./DATABASE.md) - Data models and relationships

---

*Document maintained by the Marine Care development team*
