# Production Deployment Fix Guide

## Issues Fixed

This guide addresses the following issues that occur when deploying frontend on Vercel and backend on DigitalOcean:

1. ❌ Registration failing with "registration failed" error
2. ❌ Google authentication working but no user data loading (401 errors)
3. ❌ Session/cookie not being sent between cross-origin domains

## Root Cause

When the frontend (Vercel) and backend (DigitalOcean) are on **different domains**, browsers enforce strict security policies:

- Cookies with `sameSite: 'strict'` are **blocked** in cross-origin contexts
- Cookies require `sameSite: 'none'` AND `secure: true` for cross-origin requests
- CORS must be properly configured with `credentials: true`

## Changes Made

### 1. Cookie Configuration (Backend)

Updated cookie settings in:
- `backend/src/controllers/authController.js`
- `backend/src/middleware/authMiddleware.js`

**Before:**
```javascript
const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',  // ❌ This blocks cross-origin cookies!
    path: '/',
};
```

**After:**
```javascript
const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // ✅ Allows cross-origin in production
    path: '/',
};
```

### 2. Error Handling (Backend)

Improved error handling in `registerUser` function to catch all potential errors and provide better error messages.

## Deployment Checklist

### Backend (DigitalOcean)

1. **Set Environment Variables** in DigitalOcean App Platform:

   ```bash
   NODE_ENV=production
   PORT=8080  # DigitalOcean auto-assigns this, but verify
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
   FRONTEND_URL=https://capstone-marinecare.vercel.app
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

2. **Verify CORS Configuration** in `backend/src/app.js`:

   ```javascript
   cors({
       origin: ["http://localhost:3000", "https://capstone-marinecare.vercel.app", process.env.FRONTEND_URL].filter(Boolean),
       methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
       credentials: true,  // ✅ Must be true for cookies
   })
   ```

3. **Deploy and Verify**:
   - Push code to your repository
   - DigitalOcean will auto-deploy
   - Check build logs for errors
   - Verify `NODE_ENV=production` is set

### Frontend (Vercel)

1. **Set Environment Variables** in Vercel Dashboard:

   ```bash
   NEXT_PUBLIC_API_URL=https://marinecare-l4gas.ondigitalocean.app
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

2. **Important Notes**:
   - ⚠️ **NO trailing slash** in `NEXT_PUBLIC_API_URL`
   - ✅ All variables must start with `NEXT_PUBLIC_` for browser access
   - 🔄 Vercel auto-redeploys when you add/change environment variables

3. **Deploy and Verify**:
   - Push code to your repository (Vercel auto-deploys from main branch)
   - Or manually trigger deployment from Vercel dashboard
   - Check deployment logs for errors

### Firebase (Console)

1. **Add Authorized Domains**:
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Add both:
     - `capstone-marinecare.vercel.app`
     - `marinecare-l4gas.ondigitalocean.app`

2. **Verify OAuth Settings** (for Google Sign-In):
   - Ensure redirect URIs are configured
   - Check that Google provider is enabled

## Testing the Fix

### Test Registration

1. Go to `https://capstone-marinecare.vercel.app/signup`
2. Enter valid email, password, and name
3. Click "Create Account"
4. Expected: Success message, redirect to home page
5. ❌ If it fails, check browser console for errors

### Test Google Authentication

1. Go to `https://capstone-marinecare.vercel.app/login`
2. Click "Continue with Google"
3. Complete Google sign-in flow
4. Expected: Redirect to home page with user data loaded
5. ❌ If 401 errors occur, check cookies in browser DevTools

### Verify Cookies in Browser

1. Open browser DevTools (F12)
2. Go to Application/Storage → Cookies
3. Look for `session` cookie from backend domain
4. Verify it has:
   - ✅ `SameSite=None`
   - ✅ `Secure=true`
   - ✅ `HttpOnly=true`

## Troubleshooting

### Issue: Still Getting 401 Errors

**Possible Causes:**
1. `NODE_ENV` not set to `production` on backend
2. Backend cookie settings not deployed
3. CORS origin doesn't match frontend URL exactly

**Solution:**
```bash
# Check backend environment variables
echo $NODE_ENV  # Should be 'production'

# Verify backend is using latest code
git log -1  # Check latest commit is deployed

# Test backend directly
curl -X POST https://marinecare-l4gas.ondigitalocean.app/api/auth/create-session \
  -H "Content-Type: application/json" \
  -d '{"idToken":"test"}' \
  -v  # Look for Set-Cookie header with SameSite=None
```

### Issue: Registration Still Failing

**Possible Causes:**
1. MongoDB connection issues
2. Firebase Admin SDK misconfigured
3. Missing environment variables

**Solution:**
```bash
# Check backend logs in DigitalOcean
# Look for errors like:
# - "MongoServerError"
# - "Firebase auth error"
# - "FIREBASE_PRIVATE_KEY is not defined"

# Verify MongoDB Atlas is accessible
# - Check Network Access allows connections from anywhere (0.0.0.0/0)
# - Verify database user has read/write permissions
```

### Issue: CORS Errors in Browser

**Symptoms:**
- Browser console shows "CORS policy" errors
- Network tab shows OPTIONS requests failing

**Solution:**
1. Verify backend CORS origin matches frontend URL exactly
2. Ensure `credentials: true` is set in CORS config
3. Check that backend allows required methods (GET, POST, etc.)

## Additional Resources

- [MDN: SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [CORS with Credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#requests_with_credentials)
- [Firebase Admin SDK Setup](https://firebase.google.com/docs/admin/setup)
- [MongoDB Atlas Network Access](https://docs.atlas.mongodb.com/security/ip-access-list/)

## Summary

The fix involves updating cookie settings to allow cross-origin requests between Vercel and DigitalOcean. The key changes are:

1. ✅ `sameSite: 'none'` in production (instead of 'strict')
2. ✅ `secure: true` in production (required with sameSite=none)
3. ✅ Proper CORS configuration with `credentials: true`
4. ✅ Improved error handling for better debugging

After deploying these changes and verifying environment variables, both registration and Google authentication should work correctly in production.
