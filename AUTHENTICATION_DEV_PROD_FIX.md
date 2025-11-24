# Authentication Development/Production Environment Fix

## Summary

Fixed authentication to work seamlessly in **both development and production** environments by making cookie settings environment-aware.

## Problem

The authentication system was previously **hardcoded for production** settings only:
- `secure: true` (requires HTTPS)
- `sameSite: 'none'` (for cross-origin requests)

This prevented authentication from working in development environments because:
- Development uses HTTP (`http://localhost:3000` and `http://localhost:5000`)
- Browsers reject `secure: true` cookies over HTTP
- `sameSite: 'none'` requires `secure: true`

## Solution

Updated cookie settings in `backend/src/controllers/authController.js` to be **environment-aware**:

### Before (Production Only)
```javascript
const cookieOptions = {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true,           // ❌ Hardcoded - breaks in development
    sameSite: 'none',       // ❌ Hardcoded - not needed in development
    path: '/',
};
```

### After (Development + Production)
```javascript
const cookieOptions = {
    maxAge: expiresIn,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',           // ✅ Environment-aware
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',  // ✅ Environment-aware
    path: '/',
};
```

## Changes Made

### 1. `createSessionCookie` Function (Lines 287-288)
- **secure**: `true` → `process.env.NODE_ENV === 'production'`
- **sameSite**: `'none'` → `process.env.NODE_ENV === 'production' ? 'none' : 'lax'`

### 2. `clearSessionCookie` Function (Lines 369-370)
- **secure**: `true` → `process.env.NODE_ENV === 'production'`
- **sameSite**: `'none'` → `process.env.NODE_ENV === 'production' ? 'none' : 'lax'`

### 3. Consistency with `authMiddleware.js`
The changes align with existing patterns in `backend/src/middleware/authMiddleware.js` (lines 27-28 and 95-97).

## Behavior by Environment

### Development (`NODE_ENV=development` or not set)
```javascript
{
    httpOnly: true,
    secure: false,      // ✅ Works with HTTP
    sameSite: 'lax',    // ✅ Standard same-site protection
    path: '/',
}
```

**Use Case**: Local development
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`
- Same domain (localhost), so cookies work with `sameSite: 'lax'`

### Production (`NODE_ENV=production`)
```javascript
{
    httpOnly: true,
    secure: true,       // ✅ Requires HTTPS
    sameSite: 'none',   // ✅ Allows cross-origin cookies
    path: '/',
}
```

**Use Case**: Production deployment
- Frontend: `https://capstone-marinecare.vercel.app`
- Backend: `https://marinecare-l4gas.ondigitalocean.app`
- Different domains, so needs `sameSite: 'none'` for cross-origin

## Setup Instructions

### Development Setup

1. **Backend (.env)**
   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   NODE_ENV=development
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   MONGO_URI=mongodb://localhost:27017/waveguard
   # ... other Firebase credentials
   ```

2. **Frontend (.env.local)**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   # ... Firebase config
   ```

3. **Start Services**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm install
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm install
   npm run dev
   ```

4. **Test Authentication**
   - Visit: `http://localhost:3000`
   - Sign up or log in
   - ✅ Cookies should work correctly

### Production Setup

1. **Backend Environment Variables (DigitalOcean/Railway/Render)**
   ```env
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-app.vercel.app
   MONGO_URI=mongodb+srv://...
   # ... other Firebase credentials
   ```

2. **Frontend Environment Variables (Vercel)**
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.ondigitalocean.app
   # ... Firebase config
   ```

3. **Deploy**
   - Push to GitHub (auto-deploys on Vercel)
   - Deploy backend to DigitalOcean/Railway/Render

4. **Test Authentication**
   - Visit your production URL
   - Sign up or log in
   - ✅ Cross-origin cookies should work correctly

## Verification

### Development
```bash
# Check cookie in browser DevTools
# Application → Cookies → http://localhost:3000
# Should see 'session' cookie with:
# - Secure: ❌ (unchecked)
# - SameSite: Lax
```

### Production
```bash
# Check cookie in browser DevTools
# Application → Cookies → https://your-app.vercel.app
# Should see 'session' cookie with:
# - Secure: ✅ (checked)
# - SameSite: None
```

## Testing Checklist

- [x] Syntax validation passed
- [x] Code review completed (no issues)
- [x] Security scan completed (no vulnerabilities)
- [x] Cookie settings consistent across all auth files
- [ ] Manual testing in development environment
- [ ] Manual testing in production environment

## Security

✅ **No security vulnerabilities introduced**
- HttpOnly flag remains enabled (prevents XSS)
- Environment-aware security settings
- Production still requires HTTPS (`secure: true`)
- All changes reviewed and scanned

## Files Modified

1. `backend/src/controllers/authController.js`
   - `createSessionCookie` function (lines 287-288)
   - `clearSessionCookie` function (lines 369-370)

## References

- [MDN - SameSite Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite)
- [MDN - Secure Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#restrict_access_to_cookies)
- `backend/src/middleware/authMiddleware.js` - Existing pattern reference
