# 🔧 Production Deployment Fix - Vercel + DigitalOcean

## Current Issues & Solutions

### Issue 1: 404 Errors on All API Endpoints ❌

**Root Cause:** Double slash in API URLs (`//api/` instead of `/api/`)

**Example Error:**
```
marinecareai-lkvub.ondigitalocean.app//api/auth/check-email
                                      ^^  (double slash here!)
```

**Solution:** Fix the `NEXT_PUBLIC_API_URL` environment variable in Vercel

#### Step-by-Step Fix:

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your WaveGuard frontend project

2. **Check Environment Variables**
   - Go to **Settings** → **Environment Variables**
   - Find `NEXT_PUBLIC_API_URL`

3. **Correct the Value**
   - ❌ **WRONG:** `https://marinecareai-lkvub.ondigitalocean.app/` (has trailing slash)
   - ✅ **CORRECT:** `https://marinecareai-lkvub.ondigitalocean.app` (NO trailing slash)

4. **Update and Redeploy**
   - Click **Edit** on the `NEXT_PUBLIC_API_URL` variable
   - Remove the trailing slash
   - Click **Save**
   - Go to **Deployments** tab
   - Click the **...** menu on the latest deployment
   - Click **Redeploy** (or push a new commit to trigger rebuild)

5. **Verify Fix**
   - After redeployment, open browser console
   - API calls should now be:
     ```
     https://marinecareai-lkvub.ondigitalocean.app/api/auth/check-email
                                                   ^ (single slash - correct!)
     ```

---

### Issue 2: Empty Profile Data ✅ (Expected Behavior)

**This is normal!** When users sign up with Google:
- ✅ Email is saved
- ✅ Profile picture is saved
- ❌ Location, bio, etc. are empty (users must fill these manually)

**No action needed** - users can edit their profile to add missing information.

---

### Issue 3: No Challenges/Stats Showing ❌

**Root Cause:** Production database is empty (not seeded)

**Solution:** Seed the production database

#### Option A: Using DigitalOcean Console (Recommended)

1. **Open DigitalOcean Dashboard**
   - Go to: https://cloud.digitalocean.com/apps
   - Select your backend app (marinecareai-lkvub)

2. **Access Console**
   - Click on the **Console** tab
   - Wait for terminal to load

3. **Run Seed Command**
   ```bash
   npm run seed
   ```

4. **Wait for Completion**
   - You should see: "✅ Successfully inserted 12 challenges"
   - This creates 6 active, 3 upcoming, 3 completed challenges

#### Option B: Seed Locally with Production DB

```bash
cd backend

# Temporarily set production MongoDB URI
export MONGO_URI="your-production-mongodb-atlas-uri"

# Run seed script
npm run seed

# Verify
echo "Check your production database in MongoDB Atlas"
```

**After Seeding, You Should See:**
- ✅ 12 challenges on homepage
- ✅ Dashboard stats populated
- ✅ Challenges page showing data
- ✅ Working join/leave functionality

---

## Complete Setup Checklist

### ✅ Backend (DigitalOcean App Platform)

- [ ] Backend deployed to DigitalOcean
- [ ] Environment variables configured:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGO_URI=<your-mongodb-atlas-uri>`
  - `FRONTEND_URL=<your-vercel-url>` (NO trailing slash!)
  - `FIREBASE_PROJECT_ID=<your-id>`
  - `FIREBASE_CLIENT_EMAIL=<your-email>`
  - `FIREBASE_PRIVATE_KEY=<your-key>`
  - `LOCATION_VERIFICATION_ENABLED=true`
  - `LOCATION_MAX_DISTANCE_KM=5`
  - `TESTING_MODE=false`
- [ ] Backend URL noted: `https://marinecareai-lkvub.ondigitalocean.app`
- [ ] Health check works: `https://marinecareai-lkvub.ondigitalocean.app/health`
- [ ] Database seeded with challenges

### ✅ Frontend (Vercel)

- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured:
  - `NEXT_PUBLIC_API_URL=https://marinecareai-lkvub.ondigitalocean.app` (NO trailing slash!)
  - `NEXT_PUBLIC_FIREBASE_API_KEY=<your-key>`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-domain>`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-id>`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-bucket>`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-id>`
  - `NEXT_PUBLIC_FIREBASE_APP_ID=<your-id>`
- [ ] Frontend URL noted: `https://<your-app>.vercel.app`
- [ ] API URL has NO trailing slash
- [ ] Redeployed after fixing API URL

### ✅ Database (MongoDB Atlas)

- [ ] MongoDB Atlas cluster created (free M0 tier)
- [ ] Database user created with password
- [ ] Network access allows 0.0.0.0/0 (all IPs)
- [ ] Connection string obtained
- [ ] Database seeded with sample data

---

## Testing Checklist

After fixing the API URL and seeding:

1. **Homepage**
   - [ ] Loads without errors
   - [ ] Shows challenge statistics
   - [ ] Shows active challenges

2. **Authentication**
   - [ ] Google Sign-In works
   - [ ] User redirected to homepage after login
   - [ ] Console shows NO 404 errors

3. **Profile Page**
   - [ ] Email displays correctly
   - [ ] Profile picture displays (if using Google)
   - [ ] Can edit name, location, bio

4. **Challenges Page**
   - [ ] Shows 12 challenges (after seeding)
   - [ ] Can filter by status (Active/Upcoming/Completed)
   - [ ] Can join/leave challenges

5. **Dashboard**
   - [ ] Shows user stats
   - [ ] Shows joined challenges
   - [ ] Shows leaderboard

---

## Common Mistakes to Avoid

### ❌ Trailing Slash in API URL
```env
# WRONG - has trailing slash
NEXT_PUBLIC_API_URL=https://marinecareai-lkvub.ondigitalocean.app/

# CORRECT - no trailing slash
NEXT_PUBLIC_API_URL=https://marinecareai-lkvub.ondigitalocean.app
```

### ❌ Trailing Slash in FRONTEND_URL (Backend)
```env
# WRONG - has trailing slash
FRONTEND_URL=https://your-app.vercel.app/

# CORRECT - no trailing slash
FRONTEND_URL=https://your-app.vercel.app
```

### ❌ Forgetting to Seed Database
- Empty database = No challenges = Stats showing 0
- **Solution:** Run `npm run seed` in DigitalOcean console

### ❌ Wrong MongoDB Connection String
```env
# WRONG - missing database name
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/

# CORRECT - includes database name
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/waveguard
```

---

## Quick Reference Commands

### DigitalOcean App Platform

**Check Logs:**
```bash
# In DigitalOcean Dashboard
Dashboard → Your App → Runtime Logs
```

**Restart App:**
```bash
# In DigitalOcean Dashboard
Dashboard → Your App → Settings → Force Rebuild and Deploy
```

**Seed Database:**
```bash
# In DigitalOcean Console tab
npm run seed
```

### Vercel

**Redeploy:**
```bash
# Option 1: Via Dashboard
Deployments → ... menu → Redeploy

# Option 2: Via Git
git commit --allow-empty -m "Trigger redeploy"
git push
```

**Check Build Logs:**
```bash
# In Vercel Dashboard
Deployments → Click deployment → View Build Logs
```

---

## Environment Variables Reference

### Frontend (Vercel)

```env
# Backend API - NO trailing slash!
NEXT_PUBLIC_API_URL=https://marinecareai-lkvub.ondigitalocean.app

# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Backend (DigitalOcean)

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/waveguard?retryWrites=true&w=majority

# CORS - NO trailing slash!
FRONTEND_URL=https://your-app.vercel.app

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Features
LOCATION_VERIFICATION_ENABLED=true
LOCATION_MAX_DISTANCE_KM=5
TESTING_MODE=false
```

---

## Next Steps After Fix

1. **Fix API URL in Vercel** (remove trailing slash)
2. **Redeploy frontend** on Vercel
3. **Seed production database** via DigitalOcean console
4. **Test the application:**
   - Sign up/Sign in
   - View challenges
   - Check profile
   - Verify dashboard stats

5. **Monitor for errors:**
   - Check browser console (should be clean)
   - Check DigitalOcean logs (backend)
   - Check Vercel logs (frontend)

---

## Support Resources

- **MongoDB Atlas:** https://cloud.mongodb.com
- **DigitalOcean Dashboard:** https://cloud.digitalocean.com/apps
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Firebase Console:** https://console.firebase.google.com

---

**Last Updated:** November 23, 2024  
**Status:** Production Deployment Troubleshooting Guide
