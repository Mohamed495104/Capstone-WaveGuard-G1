# 🔧 Production Deployment Checklist - Authentication Fix

## Critical Issues Fixed

### 1. ✅ Backend 500 Error on Registration
**Issue:** Server crashes with 500 error when users try to sign up manually  
**Root Cause:** Duplicate cookie setting with undefined variable in `createSessionCookie` function  
**Fix Applied:** Removed duplicate `res.cookie()` call and fixed variable reference  
**Status:** FIXED in this PR

### 2. ✅ Google Auth Session Creation Failing
**Issue:** Google auth succeeds but profile is empty, 401 errors on session creation  
**Root Cause:** Same cookie setting bug + poor error logging made debugging difficult  
**Fix Applied:** Fixed cookie bug + enhanced error logging  
**Status:** FIXED in this PR

### 3. ✅ MongoDB Connection Error Handling
**Issue:** No proper error handling when database connection fails  
**Root Cause:** Missing try-catch blocks around MongoDB operations  
**Fix Applied:** Wrapped all DB operations in try-catch with proper error messages  
**Status:** FIXED in this PR

---

## Environment Variables Setup

### Backend (DigitalOcean App Platform)

**CRITICAL:** Ensure these environment variables are set EXACTLY as shown:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database - MUST include database name at the end
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/waveguard?retryWrites=true&w=majority

# CORS - Frontend URL (NO trailing slash!)
# ❌ WRONG: https://your-app.vercel.app/
# ✅ CORRECT: https://your-app.vercel.app
FRONTEND_URL=https://your-app.vercel.app

# Firebase Admin SDK (from Firebase Console -> Service Accounts)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Location Features
LOCATION_VERIFICATION_ENABLED=true
LOCATION_MAX_DISTANCE_KM=5
TESTING_MODE=false

# AI Model Cache (optional - DigitalOcean provides /tmp)
AI_MODEL_CACHE_DIR=/tmp/ai-models
```

### Frontend (Vercel)

**CRITICAL:** Ensure these environment variables are set EXACTLY as shown:

```env
# Backend API URL (NO trailing slash!)
# ❌ WRONG: https://marinecareai-xxxxx.ondigitalocean.app/
# ✅ CORRECT: https://marinecareai-xxxxx.ondigitalocean.app
NEXT_PUBLIC_API_URL=https://marinecareai-xxxxx.ondigitalocean.app

# Firebase Client SDK (from Firebase Console -> Project Settings)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Google Places API (Optional - for location autocomplete)
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

---

## Deployment Steps

### 1. Backend Deployment (DigitalOcean)

1. **Push latest changes to GitHub**
   ```bash
   git pull origin main
   # Verify the fixes are present
   git log --oneline -5
   ```

2. **DigitalOcean will auto-deploy** if you have GitHub integration set up
   - Or manually trigger rebuild: App Settings → Force Rebuild

3. **Verify environment variables**
   - Go to App Settings → Environment Variables
   - Verify each variable from the list above
   - **CRITICAL:** Remove trailing slashes from `FRONTEND_URL`

4. **Check deployment logs**
   - Look for: "✅ Firebase Admin SDK initialized successfully"
   - Look for: "✅ MongoDB Connected"
   - Look for: "✅ GridFS Bucket initialized"
   - Look for: "🔒 CORS allowed origins: [...]"

5. **Test health endpoint**
   ```bash
   curl https://marinecareai-xxxxx.ondigitalocean.app/health
   ```
   
   Should return:
   ```json
   {
     "status": "healthy",
     "environment": "production",
     "cors": {
       "frontendUrl": "https://your-app.vercel.app",
       "allowedOrigins": ["http://localhost:3000", "https://capstone-marinecare.vercel.app", "https://your-app.vercel.app"]
     },
     "mongodb": {
       "connected": true,
       "state": 1
     }
   }
   ```

### 2. Frontend Deployment (Vercel)

1. **Update environment variables in Vercel Dashboard**
   - Go to Settings → Environment Variables
   - Verify `NEXT_PUBLIC_API_URL` has NO trailing slash
   - Example: `https://marinecareai-xxxxx.ondigitalocean.app`

2. **Trigger redeploy**
   - Option 1: Deployments → Latest → ⋯ → Redeploy
   - Option 2: Push new commit to trigger auto-deploy
   
   ```bash
   git commit --allow-empty -m "Trigger redeploy with updated backend"
   git push
   ```

3. **Check deployment logs**
   - Look for successful build
   - No errors about missing environment variables

---

## Testing Checklist

### ✅ Manual Registration Flow

1. Open your Vercel app: `https://your-app.vercel.app/signup`
2. Fill in registration form
3. Click "Create Account"
4. **Expected Result:**
   - ✅ No console errors
   - ✅ Redirected to `/home`
   - ✅ Profile shows user name and email
   - ✅ User can navigate app

5. **Check Browser Console** - Should see:
   ```
   ✅ No 500 errors
   ✅ No "Failed to load resource" errors
   ✅ POST https://your-backend/api/auth/register → 201 Created
   ```

### ✅ Google Authentication Flow

1. Open signup/login page
2. Click "Continue with Google"
3. Complete Google sign-in
4. **Expected Result:**
   - ✅ Redirected to `/home`
   - ✅ Profile shows Google name, email, and picture
   - ✅ Dashboard shows user stats
   - ✅ Can join challenges

5. **Check Browser Console** - Should see:
   ```
   ✅ No 401 errors
   ✅ No "Failed to create session" errors
   ✅ POST https://your-backend/api/auth/create-session → 200 OK
   ✅ No CORS errors
   ```

### ✅ Session Persistence

1. Sign in with either method
2. Navigate to different pages (dashboard, challenges, profile)
3. **Expected Result:**
   - ✅ Stay logged in
   - ✅ No repeated login prompts
   - ✅ Profile data persists across pages

4. Close browser and reopen
5. **Expected Result:**
   - ❌ Should be logged out (session-only persistence)
   - ✅ Can log back in successfully

---

## Common Issues & Solutions

### Issue: Still Getting 500 Error on Registration

**Possible Causes:**
1. Old code still deployed (not updated)
2. Environment variables missing
3. MongoDB connection failing

**Solutions:**
```bash
# 1. Verify latest code is deployed
curl https://your-backend/api/health
# Check that "mongodb.connected" is true

# 2. Check DigitalOcean logs
# Go to: Runtime Logs tab in DigitalOcean dashboard
# Look for error messages

# 3. Force rebuild in DigitalOcean
# App Settings → Force Rebuild and Deploy

# 4. Verify MongoDB connection string
# Make sure it includes database name: .../waveguard?retryWrites=true
```

### Issue: Google Auth Still Showing 401 Errors

**Possible Causes:**
1. CORS not configured correctly
2. Session cookie not being set
3. Firebase configuration mismatch

**Solutions:**
```bash
# 1. Check CORS configuration
curl -I -X OPTIONS https://your-backend/api/auth/create-session \
  -H "Origin: https://your-vercel-app.vercel.app" \
  -H "Access-Control-Request-Method: POST"

# Should return:
# Access-Control-Allow-Origin: https://your-vercel-app.vercel.app
# Access-Control-Allow-Credentials: true

# 2. Verify Firebase Project ID matches
# Backend FIREBASE_PROJECT_ID must equal Frontend NEXT_PUBLIC_FIREBASE_PROJECT_ID

# 3. Check browser cookies
# Open DevTools → Application → Cookies
# Should see "session" cookie with:
# - HttpOnly: true
# - Secure: true
# - SameSite: None
```

### Issue: Profile Page Empty After Login

**Possible Causes:**
1. User not synced to MongoDB
2. Session cookie not set
3. API calls failing with 401

**Solutions:**
```bash
# 1. Check network tab in DevTools
# Look for:
# POST /api/auth/create-session → should be 200 OK
# GET /api/profile → should be 200 OK (not 401)

# 2. Verify user was created in MongoDB
# Check MongoDB Atlas → Browse Collections → Users
# Should see user with email and firebaseUid

# 3. Check backend logs for user creation
# Should see: "Session: User xxx not found in MongoDB. Creating..."
```

---

## Verification Commands

### Backend Health Check
```bash
# Check overall health
curl https://your-backend/api/health | jq

# Expected output:
{
  "status": "healthy",
  "mongodb": { "connected": true },
  "cors": { "allowedOrigins": [...] }
}
```

### Test Registration Endpoint
```bash
# Test with curl (replace with your backend URL)
curl -X POST https://your-backend/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "name": "Test User"
  }'

# Expected: 201 Created with user data
# Or: 400 Bad Request if email already exists
# NOT: 500 Internal Server Error
```

### Test Session Creation
```bash
# This requires a valid Firebase ID token
# Best tested via the frontend, not curl
```

---

## Rollback Plan

If issues persist after deployment:

1. **Check what changed:**
   ```bash
   git log --oneline -10
   git diff HEAD~1 HEAD
   ```

2. **Rollback in DigitalOcean:**
   - Go to App Settings → Deployments
   - Find previous working deployment
   - Click ⋯ → Rollback to this deployment

3. **Rollback in Vercel:**
   - Go to Deployments
   - Find previous working deployment
   - Click ⋯ → Promote to Production

---

## Support & Debugging

### DigitalOcean Logs
```bash
# View in dashboard: Runtime Logs tab
# Or use CLI:
doctl apps logs <app-id> --type run
```

### Vercel Logs
```bash
# View in dashboard: Deployments → Click deployment → View Function Logs
# Or use CLI:
vercel logs <deployment-url>
```

### MongoDB Logs
```bash
# View in MongoDB Atlas
# Clusters → Your Cluster → Metrics → View Logs
```

---

## Post-Deployment Monitoring

### Metrics to Watch

1. **Error Rate**
   - Should be < 1% after fixes
   - Monitor 500 errors specifically

2. **Response Times**
   - `/api/auth/register`: < 2s
   - `/api/auth/create-session`: < 1s
   - `/api/profile`: < 500ms

3. **User Flow Success Rate**
   - Registration completion: > 95%
   - Google auth completion: > 98%
   - Session persistence: 100%

### Set Up Alerts

1. **DigitalOcean:**
   - App Settings → Alerts
   - Alert on: Error rate > 5%, Response time > 3s

2. **Vercel:**
   - Project Settings → Monitoring
   - Enable: Error tracking, Performance monitoring

3. **MongoDB Atlas:**
   - Alerts → Create New Alert
   - Alert on: Connection failures, High CPU

---

## Success Criteria

✅ Manual registration works without 500 errors  
✅ Google authentication creates session successfully  
✅ Profile page shows user data after login  
✅ No 401 errors in browser console  
✅ Session persists across page navigation  
✅ Health endpoint returns all systems healthy  
✅ CORS allows frontend domain  
✅ MongoDB connection stable  

---

**Last Updated:** November 24, 2024  
**Status:** Authentication fixes deployed and tested  
**Next Steps:** Monitor production for 24-48 hours, gather user feedback
