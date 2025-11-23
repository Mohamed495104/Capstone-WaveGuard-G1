# Quick Deployment Guide for 404 Fix

## 🚀 Steps to Deploy the Fix

### Step 1: Deploy to GitHub
```bash
# The changes are already committed and pushed
# If you're working locally, sync with the PR branch:
git checkout copilot/fix-cors-policy-errors
git pull origin copilot/fix-cors-policy-errors
```

### Step 2: Update Vercel (Frontend)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your WaveGuard project

2. **Update Environment Variables**
   - Go to Settings → Environment Variables
   - Find `NEXT_PUBLIC_API_URL`
   - **IMPORTANT**: Ensure it's set to `https://marinecareai-lkvub.ondigitalocean.app` (NO trailing slash!)
   - Click "Save"

3. **Trigger Redeployment**
   - Option A: Merge the PR to main branch (automatic deployment)
   - Option B: Go to Deployments → Latest Deployment → ... → Redeploy

### Step 3: Update DigitalOcean (Backend)

1. **Go to DigitalOcean App Platform**
   - Visit: https://cloud.digitalocean.com/apps
   - Select your backend app

2. **Update Environment Variables** (if needed)
   - Go to Settings → App-Level Environment Variables
   - Verify `FRONTEND_URL` is set to your Vercel URL (e.g., `https://waveguard.vercel.app`)
   - **IMPORTANT**: NO trailing slash!

3. **Trigger Redeployment**
   - Option A: Push to main branch (automatic deployment)
   - Option B: Click "Create Deployment" in the console

### Step 4: Wait for Deployments

- **Vercel**: Usually takes 2-3 minutes
- **DigitalOcean**: Usually takes 5-10 minutes

### Step 5: Test the Application

Visit your frontend URL and test these scenarios:

#### Test 1: Manual Registration
1. Go to Sign Up page
2. Enter email, password, and name
3. Click "Sign Up"
4. **Expected**: Successful registration and redirect to home page

#### Test 2: Google OAuth
1. Go to Login page
2. Click "Sign in with Google"
3. Complete Google auth flow
4. **Expected**: Successful login and redirect to home page with profile loaded

#### Test 3: Profile Page
1. After logging in, go to Profile page
2. **Expected**: Profile data loads without errors

#### Test 4: Challenges Page
1. Go to Challenges page
2. **Expected**: Challenges list displays

#### Test 5: Check Browser Console
1. Open DevTools → Console
2. **Expected**: 
   - No 404 errors
   - No CORS errors
   - API URLs look like: `https://marinecareai-lkvub.ondigitalocean.app/api/...` (single slash)

## ✅ Success Criteria

Your deployment is successful if:
- [x] No 404 errors in browser console
- [x] User can register with email/password
- [x] User can login with Google
- [x] Profile page loads correctly
- [x] Challenges page displays data
- [x] Dashboard shows statistics

## ❌ If Issues Persist

### Issue: Still getting 404 errors

**Check 1: Verify Environment Variables**
```bash
# Frontend (Vercel) should have:
NEXT_PUBLIC_API_URL=https://marinecareai-lkvub.ondigitalocean.app

# Backend (DigitalOcean) should have:
FRONTEND_URL=https://your-app.vercel.app
PORT=8080  # or whatever DigitalOcean uses
NODE_ENV=production
```

**Check 2: Verify Backend is Running**
```bash
# Test backend health endpoint
curl https://marinecareai-lkvub.ondigitalocean.app/health

# Should return:
# {"status":"healthy","timestamp":"...","uptime":123,"environment":"production"}
```

**Check 3: Check Build Logs**
- In Vercel: Go to Deployments → Latest → View Build Logs
- In DigitalOcean: Go to Activity → Latest Deployment → View Logs

### Issue: CORS errors

**Solution**: Verify `FRONTEND_URL` in DigitalOcean matches your exact Vercel URL

**Check**:
```bash
# In DigitalOcean backend logs, look for:
# "Only allow trusted frontend origins for CORS"
# Make sure it includes your Vercel URL
```

### Issue: Rate limit errors

**Solution**: Wait 60 seconds between requests. The API has rate limiting (100 req/min).

## 📝 Environment Variable Reference

### Vercel (Frontend)
```env
NEXT_PUBLIC_API_URL=https://marinecareai-lkvub.ondigitalocean.app
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDg4mS6DUD1jQYL-0ORUcmVO7vaJg_I1k0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=waveguard-407d8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=waveguard-407d8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=waveguard-407d8.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=78895315385
NEXT_PUBLIC_FIREBASE_APP_ID=1:78895315385:web:da2b67816e63c745c35e68
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-5Q8Q7XJBQY
```

### DigitalOcean (Backend)
```env
NODE_ENV=production
PORT=8080
MONGO_URI=your_mongodb_atlas_connection_string
FRONTEND_URL=https://your-app.vercel.app
FIREBASE_PROJECT_ID=waveguard-407d8
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
LOCATION_VERIFICATION_ENABLED=true
LOCATION_MAX_DISTANCE_KM=5
TESTING_MODE=false
```

## 🎯 Next Steps After Successful Deployment

1. **Monitor for 24 hours**
   - Check error logs
   - Monitor user signups
   - Watch for any new issues

2. **Update documentation**
   - Document the deployment process
   - Update README if needed

3. **Notify stakeholders**
   - Let your team/instructor know the fix is deployed
   - Share the Vercel URL for testing

## 📞 Need Help?

If you encounter issues:
1. Check the detailed documentation in `404_FIX_DOCUMENTATION.md`
2. Review backend logs in DigitalOcean
3. Review frontend build logs in Vercel
4. Check browser console for specific error messages

## 🔄 Rolling Back (if needed)

If the fix causes new issues:

**Vercel:**
1. Go to Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

**DigitalOcean:**
1. Go to Activity
2. Find previous successful deployment
3. Click "Rollback to this Deployment"

---

**Last Updated**: November 23, 2024  
**Fix Status**: Ready for Deployment ✅
