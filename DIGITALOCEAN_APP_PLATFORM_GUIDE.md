# 🚀 DigitalOcean App Platform Deployment - Simplified Guide

> **Deploy WaveGuard backend on DigitalOcean App Platform (No Docker needed!)**

## Quick Overview

You're deploying the backend using **DigitalOcean App Platform** - a Platform-as-a-Service (PaaS) similar to Railway or Render. This means:
- ✅ No Docker configuration needed
- ✅ Auto-deploy from GitHub (push to main = deploy)
- ✅ Built-in monitoring and logs
- ✅ $200 student credit = 40 months FREE

---

## Step 1: Create DigitalOcean App

### 1.1 Initial Setup

1. **Login to DigitalOcean**
   - Go to https://cloud.digitalocean.com/
   - Sign in with your account

2. **Redeem Student Credit** (if not done)
   - Visit https://education.github.com/pack
   - Find DigitalOcean offer
   - Follow redemption link from email

3. **Create New App**
   - Click **"Create"** → **"Apps"**
   - Or go to: https://cloud.digitalocean.com/apps/new

### 1.2 Connect Repository

1. **Choose Source**
   - Select **"GitHub"** as source
   - Click **"Manage Access"** → Authorize DigitalOcean

2. **Select Repository**
   - Repository: `Mohamed495104/Capstone-WaveGuard-G1`
   - Branch: `main`
   - Click **"Next"**

3. **Configure Source Directory**
   - Source Directory: `/backend`
   - Autodeploy: **✅ Enable** (deploys on every push)
   - Click **"Next"**

---

## Step 2: Configure App

### 2.1 Service Configuration

DigitalOcean will auto-detect it's a Node.js app. Configure:

- **Service Name:** `waveguard-api` (or any name you prefer)
- **Type:** Web Service
- **Build Command:** `npm install`
- **Run Command:** `npm start`
- **HTTP Port:** `5000`
- **Plan:** Basic ($5/mo) - 512MB RAM, 1 vCPU

### 2.2 Environment Variables

Click **"Edit"** next to Environment Variables and add:

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/waveguard?retryWrites=true&w=majority
FRONTEND_URL=https://your-app.vercel.app
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
LOCATION_VERIFICATION_ENABLED=true
LOCATION_MAX_DISTANCE_KM=5
TESTING_MODE=false
```

**Important Notes:**
- For `MONGO_URI`: Get from MongoDB Atlas (Database → Connect)
- For `FRONTEND_URL`: Use your Vercel URL **WITHOUT trailing slash**
- For Firebase: Get from Firebase Console → Service Account JSON
- Mark sensitive values (MongoDB URI, Firebase keys) as **encrypted**

---

## Step 3: Deploy

1. **Review Settings**
   - App Name: `waveguard-backend` (or your choice)
   - Region: New York (nyc) or closest to you
   - Review all configurations

2. **Click "Create Resources"**
   - Initial deployment takes 3-5 minutes
   - App Platform will:
     - Build your app
     - Run `npm install`
     - Start with `npm start`
     - Run health checks

3. **Get Your URL**
   - After deployment: `https://your-app.ondigitalocean.app`
   - Example: `https://marinecareai-lkvub.ondigitalocean.app`
   - **Save this URL** - you'll need it for frontend!

---

## Step 4: Update Frontend (Vercel)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your frontend project

2. **Update Environment Variable**
   - Go to **Settings** → **Environment Variables**
   - Find `NEXT_PUBLIC_API_URL`
   - Update to: `https://your-app.ondigitalocean.app`
   - **CRITICAL:** NO trailing slash!

3. **Redeploy Frontend**
   - Go to **Deployments** tab
   - Click **...** menu → **Redeploy**
   - Wait for deployment to complete

---

## Step 5: Seed Database

Your production database is empty. You need to seed it with sample data.

### Using DigitalOcean Console (Easiest)

1. **Open Console**
   - DigitalOcean Dashboard → Your App
   - Click **"Console"** tab
   - Wait for terminal to load

2. **Run Seed Command**
   ```bash
   npm run seed
   ```

3. **Verify Success**
   - Should see: "✅ Successfully inserted 12 challenges"
   - Creates: 6 active, 3 upcoming, 3 completed challenges

---

## Step 6: Test Deployment

### Backend Health Check

Visit: `https://your-app.ondigitalocean.app/health`

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-11-23T...",
  "uptime": 123.45,
  "environment": "production"
}
```

### Frontend Testing

Visit your Vercel URL and test:
- [ ] Sign up/Sign in with Google
- [ ] Profile loads (email, picture)
- [ ] Homepage shows challenges
- [ ] Dashboard shows stats
- [ ] Can join/leave challenges
- [ ] **Check browser console - should be NO 404 errors**

---

## Common Issues & Fixes

### Issue: 404 Errors on All API Endpoints

**Cause:** Trailing slash in `NEXT_PUBLIC_API_URL`

**Fix:**
```env
# WRONG
NEXT_PUBLIC_API_URL=https://marinecareai-lkvub.ondigitalocean.app/
                                                               ^ (remove this!)

# CORRECT
NEXT_PUBLIC_API_URL=https://marinecareai-lkvub.ondigitalocean.app
```

After fixing, redeploy frontend in Vercel.

### Issue: No Challenges Showing

**Cause:** Database not seeded

**Fix:** Run `npm run seed` in DigitalOcean Console (see Step 5)

### Issue: Profile Data Empty

**Expected Behavior!** Google Sign-In only provides:
- Email ✅
- Profile picture ✅

Users must manually add:
- Location ❌
- Bio ❌

This is normal - users can edit their profile.

---

## Monitoring & Logs

### View Runtime Logs

1. DigitalOcean Dashboard → Your App
2. Click **"Runtime Logs"** tab
3. View real-time application logs
4. Filter by level (Info, Warning, Error)

### View Metrics

1. Click **"Insights"** tab
2. View:
   - CPU usage
   - Memory usage
   - Request rate
   - Response time

### Set Up Alerts

1. Click **"Settings"** → **"Alerts"**
2. Create alerts for:
   - Deployment failed
   - High CPU/Memory
   - App crashes

---

## Auto-Deploy

After initial setup, deployment is automatic:

```bash
# Make changes locally
git add .
git commit -m "Update backend"
git push origin main

# DigitalOcean automatically:
# 1. Detects the push
# 2. Builds the app
# 3. Deploys with zero downtime
# 4. Sends you email notification
```

No manual steps needed! 🎉

---

## Environment Variables Reference

### Required Variables

| Variable | Example | Where to Get |
|----------|---------|--------------|
| `NODE_ENV` | `production` | Set manually |
| `PORT` | `5000` | Set manually |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB Atlas |
| `FRONTEND_URL` | `https://app.vercel.app` | Vercel (NO slash!) |
| `FIREBASE_PROJECT_ID` | `your-project-id` | Firebase Console |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk@...` | Service Account JSON |
| `FIREBASE_PRIVATE_KEY` | `"-----BEGIN..."` | Service Account JSON |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LOCATION_VERIFICATION_ENABLED` | `true` | Enable location checks |
| `LOCATION_MAX_DISTANCE_KM` | `5` | Max distance for location verification |
| `TESTING_MODE` | `false` | Bypass checks (dev only) |

---

## Cost Breakdown

### With Student Credit

| Item | Cost | Coverage |
|------|------|----------|
| App Platform Basic | $5/month | - |
| Student Credit | - | $200 |
| **Free Duration** | - | **40 months** |
| **Total Cost** | - | **$0** 🎉 |

### Complete Stack

| Component | Service | Cost |
|-----------|---------|------|
| Backend | DigitalOcean | $0 (credit) |
| Frontend | Vercel | $0 |
| Database | MongoDB Atlas | $0 |
| Auth | Firebase | $0 |
| **Total** | | **$0/month** |

---

## Scaling (Future)

When you need more resources:

1. **Go to Settings** → **Resources**
2. **Edit Plan**
3. **Choose larger size:**
   - Basic ($12/mo) - 1GB RAM
   - Professional ($24/mo) - 2GB RAM

Or enable auto-scaling:
- Edit App Spec
- Add `autoscaling` configuration
- Set min/max instances

---

## Support

### Documentation
- DigitalOcean App Platform: https://docs.digitalocean.com/products/app-platform/
- MongoDB Atlas: https://www.mongodb.com/docs/atlas
- Firebase: https://firebase.google.com/docs

### Dashboards
- DigitalOcean: https://cloud.digitalocean.com/apps
- Vercel: https://vercel.com/dashboard
- MongoDB: https://cloud.mongodb.com
- Firebase: https://console.firebase.google.com

---

## Quick Reference

### URLs to Save

After deployment:
- Backend: `https://__________.ondigitalocean.app`
- Frontend: `https://__________.vercel.app`
- Health Check: `https://__________.ondigitalocean.app/health`

### Important Commands

**Seed Database:**
```bash
# In DigitalOcean Console
npm run seed
```

**Check Health:**
```bash
curl https://your-app.ondigitalocean.app/health
```

**Force Redeploy:**
```bash
# DigitalOcean Dashboard
Settings → Force Rebuild and Deploy
```

---

**Status:** ✅ Production Ready  
**Last Updated:** November 23, 2024  
**Deployment Type:** App Platform (No Docker)
