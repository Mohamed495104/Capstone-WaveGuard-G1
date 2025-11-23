# Fix for 404 Errors in Production Deployment

## Problem Summary

After deploying the frontend to Vercel and backend to DigitalOcean, all API calls were returning 404 errors. This affected:
- User authentication (Google OAuth and manual registration)
- Profile loading
- Challenges display
- Dashboard statistics
- All other API endpoints

## Root Causes Identified

### 1. Duplicate Route Registration in Backend
**Issue**: Routes were registered in two places, creating conflicts:
- In `backend/src/app.js` via `app.use('/api', routes)` pointing to `api/index.js`
- In `backend/src/server.js` with individual route registrations

**Impact**: API requests couldn't find the proper routes because `api/index.js` only had 2 routes (auth, newsletter) while `server.js` tried to register all 9 route groups.

### 2. Invalid JSON Syntax in vercel.json
**Issue**: Environment variables used assignment operator (`=`) instead of colon (`:`)
```json
// ❌ Wrong
"NEXT_PUBLIC_API_URL"="https://marinecareai-lkvub.ondigitalocean.app"

// ✅ Correct
"NEXT_PUBLIC_API_URL": "https://marinecareai-lkvub.ondigitalocean.app"
```

**Impact**: Environment variables were not properly set, causing API URL to be undefined or malformed.

### 3. Potential Double Slash in API URLs
**Issue**: If `NEXT_PUBLIC_API_URL` had a trailing slash, concatenating with `/api/...` created double slashes:
```
https://marinecareai-lkvub.ondigitalocean.app/ + /api/profile
= https://marinecareai-lkvub.ondigitalocean.app//api/profile (404 error)
```

## Solutions Implemented

### Backend Fixes

#### 1. Consolidated Route Registration
**File**: `backend/src/api/index.js`

Added all missing routes to centralize route registration:
```javascript
import express from "express";
import authRoutes from "../routes/authRoutes.js";
import newsletterRoutes from "../routes/newsletterRoutes.js";
import challengeRoutes from "../routes/challengeRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";
import cleanupRoutes from "../routes/cleanupRoutes.js";
import dashboardRoutes from "../routes/dashboardRoutes.js";
import achievementsRoutes from "../routes/achievementsRoutes.js";
import imageRoutes from "../routes/imageRoutes.js";
import homeRoutes from "../routes/homeRoutes.js";

const router = express.Router();

// Register all API routes
router.use("/auth", authRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/challenges", challengeRoutes);
router.use("/profile", profileRoutes);
router.use("/cleanups", cleanupRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/achievements", achievementsRoutes);
router.use("/images", imageRoutes);
router.use("/home", homeRoutes);

export default router;
```

#### 2. Removed Duplicate Registrations
**File**: `backend/src/server.js`

Removed all duplicate route registrations and kept only server startup logic:
```javascript
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initializeAI } from "./services/aiService.js";

const PORT = process.env.PORT || 5000;

// Health check and root endpoints are defined after route registration

async function startServer() {
    try {
        await connectDB();
        await initializeAI();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} and AI is ready!`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();
```

#### 3. Centralized Rate Limiting
**File**: `backend/src/app.js`

Moved rate limiter to apply globally to all `/api` routes:
```javascript
import { apiRateLimiter } from './middleware/rateLimiter.js';

// Apply rate limiting to all API routes (100 requests/min)
app.use('/api', apiRateLimiter);

// Register all API routes
app.use('/api', routes);
```

### Frontend Fixes

#### 1. Created Centralized API Configuration
**File**: `frontend/src/config/api.js` (NEW)

Created utility functions to handle API URL normalization:
```javascript
/**
 * Get the base API URL from environment variables
 * Ensures no trailing slash to prevent double slash issues
 */
export function getApiUrl() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Remove trailing slash if present
    return apiUrl.replace(/\/$/, '');
}

/**
 * Build a full API endpoint URL
 * @param {string} path - API path (should start with /)
 * @returns {string} Full API URL
 */
export function buildApiUrl(path) {
    const baseUrl = getApiUrl();
    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}${normalizedPath}`;
}
```

#### 2. Fixed vercel.json
**File**: `frontend/vercel.json`

Corrected JSON syntax and ensured no trailing slash:
```json
{
  "env": {
    "NEXT_PUBLIC_API_URL": "https://marinecareai-lkvub.ondigitalocean.app",
    "NEXT_PUBLIC_FIREBASE_API_KEY": "...",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN": "...",
    ...
  }
}
```

#### 3. Updated All API Calls
Updated the following files to use `buildApiUrl()`:
- `frontend/src/hooks/useAuth.js`
- `frontend/src/hooks/useProfile.js`
- `frontend/src/context/AuthContext.js`
- `frontend/src/context/JoinedChallengesContext.jsx`
- `frontend/src/components/common/Navbar.jsx`

Example change:
```javascript
// ❌ Before
const res = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`);

// ✅ After
import { buildApiUrl } from "@/config/api";
const res = await apiCall('get', buildApiUrl('/api/profile'));
```

## Deployment Instructions

### For Vercel (Frontend)

1. **Update Environment Variables** in Vercel Dashboard:
   - Go to your project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` to: `https://marinecareai-lkvub.ondigitalocean.app` (NO trailing slash)
   - Ensure all other Firebase variables are correct

2. **Redeploy**:
   - The deployment should trigger automatically when you push to main
   - Or manually trigger: Deployments → ... → Redeploy

### For DigitalOcean (Backend)

1. **Update Environment Variables** in DigitalOcean App Platform:
   - Go to your app → Settings → Environment Variables
   - Ensure `FRONTEND_URL` is set to: `https://your-app.vercel.app` (NO trailing slash)
   - Verify all other environment variables are set correctly

2. **Redeploy**:
   - Push changes to trigger automatic deployment
   - Or manually trigger deployment from DigitalOcean dashboard

## Testing the Fix

### 1. Test Backend Routes
```bash
# Test root endpoint
curl https://marinecareai-lkvub.ondigitalocean.app/

# Test health endpoint
curl https://marinecareai-lkvub.ondigitalocean.app/health

# Test API endpoint (should return 401 if not authenticated, not 404)
curl https://marinecareai-lkvub.ondigitalocean.app/api/profile
```

### 2. Test Frontend

Visit your Vercel URL and test:
- ✅ Homepage loads without errors
- ✅ Sign up with email/password works
- ✅ Sign in with Google works
- ✅ Profile page loads user data
- ✅ Challenges page displays challenges
- ✅ Dashboard shows statistics
- ✅ Upload functionality works

### 3. Check Browser Console

Open DevTools → Console and verify:
- ✅ No 404 errors for API calls
- ✅ No CORS errors
- ✅ API calls show proper URLs (no double slashes)

## Expected Behavior After Fix

### API URLs Should Be
```
✅ https://marinecareai-lkvub.ondigitalocean.app/api/auth/register
✅ https://marinecareai-lkvub.ondigitalocean.app/api/profile
✅ https://marinecareai-lkvub.ondigitalocean.app/api/challenges/joined
```

### NOT
```
❌ https://marinecareai-lkvub.ondigitalocean.app//api/auth/register
❌ marinecareai-lkvub.ondigitalocean.app//api/profile
```

## Additional Notes

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (development)
- Value from `FRONTEND_URL` environment variable (production)

Ensure `FRONTEND_URL` matches your exact Vercel URL.

### Rate Limiting
All `/api` routes are protected by rate limiting (100 requests/minute). If you encounter rate limit errors during testing, wait a minute before retrying.

### Future API Changes
When adding new API endpoints:
1. Create the route file in `backend/src/routes/`
2. Import and register it in `backend/src/api/index.js`
3. Do NOT add it to `server.js`

When calling APIs from frontend:
1. Always use `buildApiUrl('/api/...')` instead of template literals
2. Never hardcode the API URL

## Verification Checklist

After deployment, verify:
- [ ] Backend health endpoint returns 200: `/health`
- [ ] Frontend loads without console errors
- [ ] User registration works (email/password)
- [ ] Google OAuth login works
- [ ] Profile page loads user data
- [ ] Challenges page displays data
- [ ] Dashboard shows statistics
- [ ] All API calls in Network tab show correct URLs (no double slashes)
- [ ] No 404 errors in console
- [ ] No CORS errors in console

## Summary

The 404 errors were caused by a combination of:
1. Backend route registration conflicts
2. Invalid JSON syntax in Vercel configuration
3. Inconsistent API URL handling in frontend

All issues have been fixed by:
1. Consolidating backend routes in a single location
2. Fixing JSON syntax in vercel.json
3. Creating a centralized API configuration utility for the frontend
4. Updating all API calls to use the new utility

The application should now work correctly in production.
