# Marine Care - Deployment Guide

> Deployment instructions for hosting Marine Care in production

**Last Updated:** November 2024  
**Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Post-Deployment Checklist](#post-deployment-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Overview

### Architecture

```
┌────────────────┐
│   Users/Web    │
└───────┬────────┘
        │
   ┌────▼────┐
   │ Vercel  │ ← Frontend (Next.js)
   │  CDN    │
   └────┬────┘
        │
   ┌────▼─────────┐
   │   Railway/   │ ← Backend (Express API)
   │   Render     │
   └────┬─────────┘
        │
   ┌────▼──────┐
   │  MongoDB  │ ← Database
   │   Atlas   │
   └───────────┘
```

### Hosting Services

| Component | Recommended Service | Cost |
|-----------|-------------------|------|
| Frontend | Vercel | Free tier |
| Backend | Railway or Render | Free tier |
| Database | MongoDB Atlas | Free tier (512MB) |
| Auth | Firebase | Free tier |

**Total Cost:** $0 (using free tiers)  
**Setup Time:** 30-45 minutes

---

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account with repository access
- [ ] Vercel account (sign up at [vercel.com](https://vercel.com))
- [ ] Railway or Render account
- [ ] MongoDB Atlas account ([mongodb.com/atlas](https://www.mongodb.com/atlas))
- [ ] Firebase project configured

### Required Files

Ensure these files exist in your repository:

```
backend/
├── .env.example    # Environment template
├── package.json    # Dependencies
└── src/
    └── server.js   # Entry point

frontend/
├── .env.example    # Environment template
├── package.json    # Dependencies
└── next.config.mjs # Next.js configuration
```

---

## Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up or log in
3. Click **"Build a Database"**
4. Select **"M0 Free"** tier
5. Choose a cloud provider and region (closest to your users)
6. Click **"Create Cluster"**

### Step 2: Configure Access

1. **Database Access:**
   - Go to **Security → Database Access**
   - Click **"Add New Database User"**
   - Create username and password (save these!)
   - Set **"Read and write to any database"**

2. **Network Access:**
   - Go to **Security → Network Access**
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is required for Railway/Render deployment

### Step 3: Get Connection String

1. Go to **Database → Connect**
2. Click **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   ```
4. Replace `<username>`, `<password>`, and `<database>` with your values

---

## Backend Deployment

### Option A: Railway (Recommended)

1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Configure the service:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

6. Add environment variables:
   - `MONGO_URI` = Your MongoDB connection string
   - `FRONTEND_URL` = Your Vercel frontend URL
   - `PORT` = 5000
   - `NODE_ENV` = production

7. Deploy and note your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render

1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Connect your repository
5. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

6. Add environment variables (same as Railway)
7. Deploy and note your backend URL

### Option C: DigitalOcean (For Students)

If you have GitHub Student Pack ($200 credit):

1. Go to [DigitalOcean](https://www.digitalocean.com)
2. Create App Platform application
3. Connect your GitHub repository
4. Configure environment variables
5. Deploy

---

## Frontend Deployment

### Vercel Deployment

1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import your repository
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend`

6. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

7. Click **"Deploy"**
8. Note your frontend URL (e.g., `https://your-app.vercel.app`)

### Update Backend CORS

After frontend deployment, update your backend's `FRONTEND_URL` environment variable to include your Vercel URL.

---

## Environment Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster...` |
| `FRONTEND_URL` | Frontend URL (for CORS) | `https://your-app.vercel.app` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `production` |

### Frontend Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

### Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Project Settings**

**For Frontend:**
- Go to **General** → **Your apps** → **Web app**
- Copy the config values

**For Backend:**
- Go to **Service accounts** → **Generate new private key**
- Save as `backend/src/config/serviceAccount.json`
- **Important:** Add this file to `.gitignore`

---

## Post-Deployment Checklist

### Verify Deployment

- [ ] Frontend loads without errors
- [ ] API health check responds (visit `/api/home/stats`)
- [ ] Login/signup works
- [ ] Google OAuth works
- [ ] Database connection successful
- [ ] Image upload works
- [ ] All protected routes require authentication

### Security Checks

- [ ] HTTPS enabled on all endpoints
- [ ] Environment variables are set (not exposed)
- [ ] CORS configured correctly
- [ ] Rate limiting is active
- [ ] Service account file is NOT in repository

### Performance Checks

- [ ] Frontend loads in < 3 seconds
- [ ] API responses are < 500ms
- [ ] Images are optimized
- [ ] Caching is configured

---

## Troubleshooting

### Common Issues

#### "MongoDB connection error"

1. Verify `MONGO_URI` is correct
2. Check if IP whitelist includes `0.0.0.0/0`
3. Verify database user has correct permissions

#### "CORS error"

1. Verify `FRONTEND_URL` in backend matches your Vercel URL
2. Check if protocol (https/http) is correct
3. Restart backend after changing environment variables

#### "Firebase authentication failed"

1. Verify all Firebase environment variables are set
2. Check if Firebase project has Email/Google auth enabled
3. Verify authorized domains include your Vercel URL

#### "Build failed on Vercel"

1. Check build logs for specific errors
2. Verify `next.config.mjs` exists
3. Ensure all dependencies are in `package.json`

#### "Railway/Render deployment failed"

1. Verify root directory is set to `backend`
2. Check if `start` script exists in `package.json`
3. Review deployment logs for specific errors

### Getting Help

1. Check deployment platform documentation
2. Review error logs in hosting dashboard
3. Test locally with production environment variables

---

## Quick Reference

### Development URLs

```
Frontend: http://localhost:3000
Backend:  http://localhost:5000
```

### Production URLs (Example)

```
Frontend: https://marine-care.vercel.app
Backend:  https://marine-care-api.railway.app
Database: mongodb+srv://...@cluster.mongodb.net/marine-care
```

### Deployment Commands

```bash
# Frontend (Vercel deploys automatically from GitHub)
# Manual deploy: npx vercel --prod

# Backend (Railway/Render deploy automatically from GitHub)
# Manual build: npm run build
```

---

## Related Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Overall system design
- [Backend Architecture](./BACKEND_ARCHITECTURE.md) - Backend details
- [Technical Stack](./TECHNICAL_STACK.md) - Technologies used

---

*Document maintained by the Marine Care development team*
