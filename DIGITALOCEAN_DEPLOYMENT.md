# 🌊 DigitalOcean Backend Deployment Guide

> **Complete guide for deploying WaveGuard backend on DigitalOcean using your $200 GitHub Student Pack credit**

## 📋 Table of Contents

1. [Why DigitalOcean?](#why-digitalocean)
2. [Prerequisites](#prerequisites)
3. [Deployment Options](#deployment-options)
4. [Option 1: App Platform (Recommended)](#option-1-app-platform-recommended)
5. [Option 2: Docker on Droplet](#option-2-docker-on-droplet-advanced)
6. [Environment Variables Setup](#environment-variables-setup)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Cost Estimation](#cost-estimation)

---

## 🎯 Why DigitalOcean?

**Advantages over Render free tier:**
- ✅ **$200 GitHub Student Pack credit** - 40 months free on basic-xxs plan
- ✅ **More storage space** - No storage limitations like Render
- ✅ **Better performance** - Dedicated resources even on smallest tier
- ✅ **No sleep time** - App stays running 24/7
- ✅ **Professional monitoring** - Built-in metrics and alerts
- ✅ **Easy scaling** - Simple upgrade path as app grows

**Perfect for:** Students, startups, production apps with $200 credit

---

## ✅ Prerequisites

Before starting, ensure you have:

- [x] **GitHub account** - For repository access
- [x] **DigitalOcean account** - [Sign up here](https://www.digitalocean.com/)
- [x] **GitHub Student Pack activated** - [Get it here](https://education.github.com/pack)
- [x] **DigitalOcean student credit redeemed** - Check your email after activating pack
- [x] **MongoDB Atlas cluster** - Free M0 cluster ([setup guide](./HOSTING_INSTRUCTIONS.md#step-1-setup-mongodb-atlas-database))
- [x] **Firebase credentials** - Already configured in your project
- [x] **Frontend deployed** - Get Vercel URL (for CORS configuration)

**Time Required:** 20-30 minutes  
**Cost:** $5/month (covered by $200 credit = 40 months free!)

---

## 🚀 Deployment Options

### Comparison

| Feature | App Platform | Docker on Droplet |
|---------|--------------|-------------------|
| **Ease of Setup** | ⭐⭐⭐⭐⭐ Very Easy | ⭐⭐⭐ Moderate |
| **Auto-Deploy** | ✅ Built-in | ❌ Manual setup needed |
| **Maintenance** | ⭐⭐⭐⭐⭐ Fully Managed | ⭐⭐ Self-managed |
| **Cost** | $5/month | $6/month (cheapest droplet) |
| **Scaling** | ⭐⭐⭐⭐ Easy | ⭐⭐⭐ Manual |
| **Best For** | Production, Quick deploy | Custom setups, Learning |

**Recommendation:** Use **App Platform** unless you need custom Docker configuration

---

## 🎯 Option 1: App Platform (Recommended)

### Step-by-Step Guide

#### 1.1 Create DigitalOcean App

1. **Login to DigitalOcean**
   - Go to [DigitalOcean Dashboard](https://cloud.digitalocean.com/)
   - Sign in with your account

2. **Create New App**
   - Click **"Create"** → **"Apps"**
   - Or go directly to: https://cloud.digitalocean.com/apps/new

3. **Connect GitHub Repository**
   - Choose **"GitHub"** as source
   - Click **"Manage Access"** → Authorize DigitalOcean
   - Select repository: **Mohamed495104/Capstone-WaveGuard-G1**
   - Branch: **main**
   - Click **"Next"**

4. **Configure Source**
   - Source Directory: `/backend`
   - Autodeploy: **Enable** (deploys on every push to main)
   - Click **"Next"**

#### 1.2 Configure App Resources

1. **Edit App Configuration**
   - DigitalOcean will auto-detect it's a Node.js app
   - Click **"Edit Plan"** or **"Edit"** next to the detected service

2. **Set Resource Type**
   - Type: **Web Service** (already selected)
   - Name: `waveguard-api` or `backend`

3. **Configure Build & Run**
   - Build Command: `npm ci --only=production`
   - Run Command: `npm start`
   - HTTP Port: `5000`

4. **Select Plan Size**
   - Choose: **Basic** plan
   - Size: **Basic ($5/mo)** - 512MB RAM, 1 vCPU
   - This is perfect for the backend and covered by student credit!

5. **Set HTTP Routes**
   - Path: `/` (default)
   - HTTPS: **Enabled** (automatically)

#### 1.3 Add Environment Variables

Click **"Environment Variables"** and add each variable:

**Required Variables:**

```env
NODE_ENV=production
PORT=5000
```

**Database (MongoDB Atlas):**
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/waveguard?retryWrites=true&w=majority
```
*(Mark as SECRET/encrypted)*

**Frontend Configuration:**
```env
FRONTEND_URL=https://your-app.vercel.app
```
*(Replace with your actual Vercel URL - no trailing slash!)*

**Firebase Admin SDK:**
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
```
*(Mark all as SECRET/encrypted)*

**Location Features:**
```env
LOCATION_VERIFICATION_ENABLED=true
LOCATION_MAX_DISTANCE_KM=5
TESTING_MODE=false
```

**AI Model Cache:**
```env
AI_MODEL_CACHE_DIR=/tmp/ai-models
```

**How to mark as SECRET:**
- Click the 🔒 icon next to the value field
- Or check "Encrypt" checkbox
- This hides sensitive values in logs and UI

#### 1.4 Configure Advanced Settings (Optional)

**Health Checks:**
- Path: `/health`
- Initial Delay: `60` seconds (AI model loading takes time)
- Period: `30` seconds
- Success Threshold: `1`
- Failure Threshold: `3`

**Auto-Scaling (Optional for production):**
- Min Instances: `1`
- Max Instances: `3`
- *(Only enable if expecting high traffic)*

#### 1.5 Review & Deploy

1. **Review Configuration**
   - App Name: `waveguard-backend` or your choice
   - Region: **New York (nyc)** or closest to your users
   - Review all settings

2. **Deploy!**
   - Click **"Create Resources"**
   - Deployment will start automatically
   - Initial deployment takes 5-10 minutes (AI model loading)

3. **Get Your URL**
   - After deployment, you'll get a URL like:
   - `https://waveguard-backend-xxxxx.ondigitalocean.app`
   - Or set up a custom domain if you have one

✅ **Save this URL** - You'll need it for frontend configuration!

---

### 1.6 Alternative: Deploy Using App Spec (app.yaml)

If you prefer configuration-as-code:

1. **Upload App Spec**
   - In App creation, choose **"Upload Your App Spec"**
   - Use the file: `backend/.do/app.yaml`
   - This file is already configured in the repository

2. **Update App Spec Variables**
   - After upload, go to **"Settings"** → **"App Spec"**
   - Add your actual values for secrets (MONGO_URI, Firebase keys, etc.)

3. **Deploy**
   - Click **"Save"** and app will deploy automatically

---

## 🐳 Option 2: Docker on Droplet (Advanced)

For those who want more control or are learning DevOps.

### 2.1 Create Droplet

1. **Create New Droplet**
   - Go to [DigitalOcean Dashboard](https://cloud.digitalocean.com/)
   - Click **"Create"** → **"Droplets"**

2. **Choose Configuration**
   - Distribution: **Ubuntu 22.04 LTS**
   - Plan: **Basic** → **Regular** → **$6/month** (1GB RAM)
   - Datacenter: Choose closest to your users (e.g., New York, San Francisco)
   - Authentication: **SSH Key** (recommended) or Password

3. **Create Droplet**
   - Hostname: `waveguard-backend`
   - Tags: `production`, `backend`
   - Click **"Create Droplet"**
   - Wait ~60 seconds for provisioning

4. **Note the IP Address**
   - Copy the IPv4 address (e.g., `142.93.xxx.xxx`)

### 2.2 Initial Server Setup

**Connect to Droplet:**
```bash
ssh root@your_droplet_ip
```

**Update System:**
```bash
apt update && apt upgrade -y
```

**Install Docker:**
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Verify installation
docker --version
docker-compose --version
```

**Create Application User:**
```bash
adduser waveguard
usermod -aG docker waveguard
su - waveguard
```

### 2.3 Deploy Application

**Clone Repository:**
```bash
cd ~
git clone https://github.com/Mohamed495104/Capstone-WaveGuard-G1.git
cd Capstone-WaveGuard-G1/backend
```

**Create Environment File:**
```bash
nano .env
```

Add all environment variables (see [Environment Variables](#environment-variables-setup) section).

**Build and Run:**
```bash
# Build Docker image
docker build -t waveguard-backend .

# Run container
docker run -d \
  --name waveguard-api \
  --restart unless-stopped \
  -p 5000:5000 \
  --env-file .env \
  waveguard-backend

# Or use Docker Compose
docker-compose up -d
```

**Verify Running:**
```bash
docker ps
docker logs waveguard-api
curl http://localhost:5000/health
```

### 2.4 Setup Nginx Reverse Proxy

**Install Nginx:**
```bash
sudo apt install nginx -y
```

**Configure Nginx:**
```bash
sudo nano /etc/nginx/sites-available/waveguard
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable Site:**
```bash
sudo ln -s /etc/nginx/sites-available/waveguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 2.5 Setup SSL with Let's Encrypt (Optional)

**Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx -y
```

**Get SSL Certificate:**
```bash
sudo certbot --nginx -d your_domain.com
```

Follow prompts and choose redirect HTTP to HTTPS.

### 2.6 Setup Auto-Deploy (Optional)

Create deploy script:
```bash
nano ~/deploy.sh
```

```bash
#!/bin/bash
cd ~/Capstone-WaveGuard-G1/backend
git pull origin main
docker-compose down
docker-compose up -d --build
```

Make executable:
```bash
chmod +x ~/deploy.sh
```

To deploy updates:
```bash
./deploy.sh
```

---

## 🔐 Environment Variables Setup

### Complete List

Copy these to your DigitalOcean environment variables:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/waveguard?retryWrites=true&w=majority

# Frontend (CORS)
FRONTEND_URL=https://your-app.vercel.app

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Location Features
LOCATION_VERIFICATION_ENABLED=true
LOCATION_MAX_DISTANCE_KM=5
TESTING_MODE=false
TESTING_BYPASS_EMAILS=dev@waveguard.com

# AI Configuration
AI_MODEL_CACHE_DIR=/tmp/ai-models
```

### Where to Get Values

**MongoDB Atlas:**
- See [HOSTING_INSTRUCTIONS.md](./HOSTING_INSTRUCTIONS.md#step-1-setup-mongodb-atlas-database)
- Database → Connect → Get connection string

**Frontend URL:**
- Your Vercel deployment URL
- Example: `https://waveguard.vercel.app`
- **No trailing slash!**

**Firebase Credentials:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Project Settings → Service Accounts
4. Click **"Generate New Private Key"**
5. Download JSON file
6. Extract values:
   - `project_id` → FIREBASE_PROJECT_ID
   - `client_email` → FIREBASE_CLIENT_EMAIL  
   - `private_key` → FIREBASE_PRIVATE_KEY

**Important for FIREBASE_PRIVATE_KEY:**
- Keep the quotes: `"-----BEGIN..."`
- Keep the `\n` characters
- In DigitalOcean UI, paste as-is
- Mark as encrypted/secret

---

## 🎉 Post-Deployment

### 1. Update Frontend

Update your Vercel frontend environment variable:

```env
NEXT_PUBLIC_API_URL=https://your-app.ondigitalocean.app
```

Redeploy frontend or it will auto-deploy from Git.

### 2. Test Backend

**Health Check:**
```bash
curl https://your-app.ondigitalocean.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-11-22T...",
  "uptime": 123.45,
  "environment": "production"
}
```

**Test API Endpoints:**
```bash
# Get challenges (should return data)
curl https://your-app.ondigitalocean.app/api/challenges

# Home data
curl https://your-app.ondigitalocean.app/api/home
```

### 3. Seed Database (One-time)

**Option A: Use App Platform Console**
1. Go to your app in DigitalOcean dashboard
2. Click **"Console"** tab
3. Run: `npm run seed`

**Option B: Locally with Production DB**
```bash
cd backend
# Temporarily update .env with production MONGO_URI
npm run seed
# Revert .env
```

### 4. Verify End-to-End

Visit your frontend URL and test:
- [ ] Homepage loads
- [ ] User can login (Firebase auth)
- [ ] View challenges (data from MongoDB)
- [ ] Upload cleanup photo (backend API + AI)
- [ ] View profile
- [ ] Dashboard shows stats

---

## 📊 Monitoring & Maintenance

### DigitalOcean Dashboard Monitoring

**App Platform includes:**
- ✅ CPU & Memory usage graphs
- ✅ Request rate metrics
- ✅ Response time tracking
- ✅ Error rate monitoring
- ✅ Deployment history
- ✅ Real-time logs

**Access Monitoring:**
1. Go to your app in DigitalOcean dashboard
2. Click **"Insights"** tab
3. View real-time metrics

### View Logs

**Real-time Logs:**
1. DigitalOcean Dashboard → Your App
2. Click **"Runtime Logs"** tab
3. Live tail of application logs

**Filter Logs:**
- Component: Select `api` or your service name
- Level: Info, Warning, Error
- Time range: Last hour, day, week

### Set Up Alerts

**Create Alert:**
1. App Dashboard → **"Alerts"**
2. Click **"Create Alert"**
3. Choose alert type:
   - Deployment failed
   - High CPU usage
   - High memory usage
   - Domain configuration failed

4. Add notification email

### Update Application

**Auto-Deploy (Default):**
- Just push to `main` branch
- DigitalOcean automatically detects and deploys
- Zero downtime deployments

**Manual Deploy:**
1. App Dashboard → **"Settings"**
2. Scroll to **"App Spec"**
3. Click **"Force Rebuild and Deploy"**

### Scale Up (When Needed)

**Vertical Scaling:**
1. App Dashboard → **"Resources"**
2. Click service → **"Edit Plan"**
3. Choose larger size:
   - Basic ($12/mo) - 1GB RAM, 1 vCPU
   - Professional ($24/mo) - 2GB RAM, 1 vCPU
4. Click **"Save"** - seamless migration

**Horizontal Scaling:**
1. App Dashboard → **"Settings"** → **"App Spec"**
2. Edit YAML, add autoscaling:
```yaml
autoscaling:
  min_instance_count: 1
  max_instance_count: 3
```
3. Save and deploy

---

## 🐛 Troubleshooting

### Common Issues

#### App Won't Start / Crashes

**Check logs:**
```bash
# In DigitalOcean console or Runtime Logs tab
```

**Common causes:**
1. **Missing environment variables**
   - Verify all required vars are set
   - Check spelling and values

2. **MongoDB connection failed**
   - Verify MONGO_URI is correct
   - Check MongoDB Atlas network access (0.0.0.0/0)
   - Test connection string locally first

3. **Firebase initialization failed**
   - Verify FIREBASE_PRIVATE_KEY has `\n` characters
   - Ensure quotes are included
   - Check PROJECT_ID and CLIENT_EMAIL

4. **AI model loading timeout**
   - First deployment takes longer (60s+)
   - Increase health check initial delay to 90s
   - Check available memory (might need to upgrade plan)

#### CORS Errors

**Symptoms:** Frontend can't connect to backend

**Solution:**
1. Verify `FRONTEND_URL` exactly matches Vercel URL
2. Must be `https://` (not `http://`)
3. No trailing slash: `https://app.vercel.app` ✅ not `https://app.vercel.app/` ❌
4. Redeploy backend after changing

#### 502 Bad Gateway

**Causes:**
1. App is starting (wait 1-2 minutes)
2. Health check failing (check `/health` endpoint)
3. App crashed (check logs)

**Solution:**
```bash
# Check health endpoint
curl https://your-app.ondigitalocean.app/health

# If it's down, check logs for errors
# Force redeploy if needed
```

#### High Memory Usage / App Slow

**Cause:** AI model loads into memory (~200-300MB)

**Solutions:**
1. Upgrade to Basic plan ($12/mo, 1GB RAM)
2. Optimize AI model caching
3. Consider lazy-loading model on first use

#### Environment Variable Not Working

**Check:**
1. Variable name spelled exactly (case-sensitive)
2. Value is correct (no extra spaces)
3. Secrets are marked as encrypted
4. App redeployed after adding variable

#### Database Connection Timeout

**Check:**
1. MongoDB Atlas allows 0.0.0.0/0 (all IPs)
2. Database user has correct permissions
3. Connection string includes database name
4. Password is URL-encoded (no special characters issues)

---

## 💰 Cost Estimation

### With GitHub Student Pack ($200 Credit)

**App Platform - Basic Plan:**
- Cost: **$5/month**
- Your credit: **$200**
- **Free for 40 months!** 🎉

### Monthly Cost Breakdown

| Component | Service | Plan | Cost |
|-----------|---------|------|------|
| **Backend** | DigitalOcean App Platform | Basic | $5/mo |
| **Database** | MongoDB Atlas | M0 Free | $0/mo |
| **Auth** | Firebase | Spark | $0/mo |
| **Frontend** | Vercel | Hobby | $0/mo |
| **Total** | | | **$5/mo** |

**With student credit: $0/mo for 40 months**

### After Credit Expires

**Option 1: Continue on DigitalOcean**
- $5/month - Very affordable
- Professional plan $12-24/month if you need more resources

**Option 2: Migrate to Free Tier**
- Move back to Render Free tier
- Or Railway with $5 credit/month
- Database stays on MongoDB Atlas Free

### Scaling Costs (Future)

When app grows and needs more resources:

| Tier | Plan | RAM | vCPU | Price |
|------|------|-----|------|-------|
| **Basic** | Current | 512MB | 1 | $5/mo |
| **Basic XS** | Upgrade | 1GB | 1 | $12/mo |
| **Professional** | Production | 2GB | 1 | $24/mo |
| **Professional L** | High Traffic | 4GB | 2 | $48/mo |

---

## 📞 Quick Reference

### Important URLs

After deployment, save these:

- **Backend API:** `https://__________.ondigitalocean.app`
- **Frontend:** `https://__________.vercel.app`
- **DigitalOcean Dashboard:** `https://cloud.digitalocean.com/apps`
- **MongoDB Atlas:** `https://cloud.mongodb.com`
- **Firebase Console:** `https://console.firebase.google.com`

### Important Files in Repo

- `backend/Dockerfile` - Docker configuration
- `backend/.do/app.yaml` - DigitalOcean App Spec
- `backend/docker-compose.yml` - Docker Compose for local/droplet
- `backend/.dockerignore` - Files excluded from Docker build
- `backend/.env.example` - Environment variables template

### Useful Commands

**App Platform:**
```bash
# View logs
doctl apps logs <app-id>

# Restart app
doctl apps update <app-id> --spec .do/app.yaml

# View app info
doctl apps get <app-id>
```

**Docker on Droplet:**
```bash
# View logs
docker logs waveguard-api

# Restart
docker restart waveguard-api

# Rebuild
docker-compose down && docker-compose up -d --build

# Shell into container
docker exec -it waveguard-api /bin/bash
```

---

## ✨ Summary

**You now have:**

1. ✅ **Backend on DigitalOcean** - Using your $200 credit
2. ✅ **No storage limitations** - Unlike Render free tier
3. ✅ **Auto-deploy from GitHub** - Push to main = automatic deployment
4. ✅ **40 months free** - $200 credit covers $5/month for 40 months
5. ✅ **Production-ready** - Professional monitoring and scaling
6. ✅ **Better performance** - Dedicated resources, no sleep time

**Next steps:**

1. Test all features thoroughly
2. Update frontend with new backend URL
3. Monitor performance in DigitalOcean dashboard
4. Continue developing - auto-deploy handles the rest!

---

## 🆘 Need Help?

**Documentation:**
- [DigitalOcean App Platform Docs](https://docs.digitalocean.com/products/app-platform/)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [Main Hosting Guide](./HOSTING_INSTRUCTIONS.md)

**Community:**
- [DigitalOcean Community](https://www.digitalocean.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/digital-ocean)

**Support:**
- DigitalOcean has 24/7 ticket support
- Check your student pack benefits

---

**Last Updated:** November 22, 2024  
**Version:** 1.0  
**Status:** Production Ready ✅
