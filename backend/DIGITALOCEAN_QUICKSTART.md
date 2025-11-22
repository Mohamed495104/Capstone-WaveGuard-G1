# 🚀 Quick Start - DigitalOcean Deployment

## For Students with GitHub Student Pack

### 1. Get Your Credit
- Visit: https://education.github.com/pack
- Activate DigitalOcean benefit ($200 credit)

### 2. Read the Guide
📖 **[Complete Guide: ../DIGITALOCEAN_DEPLOYMENT.md](../DIGITALOCEAN_DEPLOYMENT.md)**

### 3. Deploy (Choose One)

#### Option A: Use Helper Script (Easiest)
```bash
cd backend
./deploy-digitalocean.sh
```

#### Option B: Manual via DigitalOcean Dashboard
1. Go to https://cloud.digitalocean.com/apps
2. Create App → Connect GitHub repo
3. Source directory: `backend`
4. Add environment variables (see below)
5. Deploy!

### 4. Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/waveguard
FRONTEND_URL=https://your-app.vercel.app
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
LOCATION_VERIFICATION_ENABLED=true
LOCATION_MAX_DISTANCE_KM=5
TESTING_MODE=false
```

### 5. Update Frontend

After deployment, update your frontend:
```env
NEXT_PUBLIC_API_URL=https://your-app.ondigitalocean.app
```

---

## Testing Locally with Docker

### Build and Test
```bash
# Build Docker image
docker build -t waveguard-backend .

# Run container
docker run -p 5000:5000 --env-file .env waveguard-backend

# Test health
curl http://localhost:5000/health
```

### Using Docker Compose
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Cost with Student Credit

- **Monthly:** $5
- **Student Credit:** $200
- **FREE for:** 40 months (3+ years!)

---

## Files Reference

- `Dockerfile` - Production Docker configuration
- `docker-compose.yml` - Local development setup
- `.do/app.yaml` - App Platform configuration
- `deploy-digitalocean.sh` - Interactive deployment helper
- `.dockerignore` - Build optimization

---

## Documentation

📚 **Full Guides:**
- [DIGITALOCEAN_DEPLOYMENT.md](../DIGITALOCEAN_DEPLOYMENT.md) - Complete guide (20KB)
- [DIGITALOCEAN_SETUP_SUMMARY.md](../DIGITALOCEAN_SETUP_SUMMARY.md) - Overview (10KB)
- [DIGITALOCEAN_IMPLEMENTATION.md](../DIGITALOCEAN_IMPLEMENTATION.md) - Implementation details

📋 **Quick Reference:**
- [HOSTING_INSTRUCTIONS.md](../HOSTING_INSTRUCTIONS.md) - General hosting guide
- [backend/README.md](./README.md) - Backend documentation

---

## Support

**Issues?** Check troubleshooting section in DIGITALOCEAN_DEPLOYMENT.md

**Resources:**
- DigitalOcean Docs: https://docs.digitalocean.com/products/app-platform/
- GitHub Student Pack: https://education.github.com/pack

---

**Status:** ✅ Production Ready  
**Last Updated:** November 22, 2024
