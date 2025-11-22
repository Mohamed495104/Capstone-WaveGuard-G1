# WaveGuard Backend

Node.js/Express backend for the WaveGuard shoreline cleanup application.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your values

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

### Production Deployment

**Choose your hosting platform:**

1. **DigitalOcean App Platform** ⭐ Recommended for students
   - See [DIGITALOCEAN_DEPLOYMENT.md](../DIGITALOCEAN_DEPLOYMENT.md)
   - $200 GitHub Student Pack credit = 40 months free!
   - Use helper script: `./deploy-digitalocean.sh`

2. **Railway** - Good free alternative
   - See [HOSTING_INSTRUCTIONS.md](../HOSTING_INSTRUCTIONS.md#option-b-railway)

3. **Render** - Free tier with limitations
   - See [HOSTING_INSTRUCTIONS.md](../HOSTING_INSTRUCTIONS.md#option-c-render)

## 📁 Project Structure

```
backend/
├── src/
│   ├── api/           # API route definitions
│   ├── controllers/   # Request handlers
│   ├── models/        # MongoDB models
│   ├── middleware/    # Auth, validation, rate limiting
│   ├── services/      # AI, Firebase services
│   ├── utils/         # Helper functions
│   ├── config/        # Database, environment config
│   ├── app.js         # Express app setup
│   └── server.js      # Server entry point
├── .do/               # DigitalOcean config
│   └── app.yaml
├── Dockerfile         # Docker configuration
├── docker-compose.yml # Docker Compose setup
├── deploy-digitalocean.sh  # Deployment helper script
├── package.json
└── .env.example       # Environment variables template
```

## 🔐 Environment Variables

See `.env.example` for all required variables.

Key variables:
- `NODE_ENV` - development or production
- `MONGO_URI` - MongoDB connection string
- `FRONTEND_URL` - Your frontend URL (for CORS)
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` - Firebase Admin SDK
- `LOCATION_VERIFICATION_ENABLED` - Enable/disable location checks

## 🐳 Docker

**Build and run with Docker:**
```bash
# Build image
docker build -t waveguard-backend .

# Run container
docker run -p 5000:5000 --env-file .env waveguard-backend

# Or use Docker Compose
docker-compose up -d
```

**Helper script:**
```bash
./deploy-digitalocean.sh
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with initial data

## 📚 Documentation

- [API Documentation](../API_DOCUMENTATION.md)
- [Backend Architecture](../BACKEND_ARCHITECTURE.md)
- [DigitalOcean Deployment](../DIGITALOCEAN_DEPLOYMENT.md)
- [General Hosting Guide](../HOSTING_INSTRUCTIONS.md)
- [Seeding Guide](./SEEDING_GUIDE.md)

## Backend Security Practices

- All API endpoints strictly validate authentication tokens using Firebase Admin SDK.
- CORS is locked down to trusted frontend URLs only.
- No sensitive info (tokens, passwords, internal errors) is ever logged or returned in API responses.
- All user data and tokens are validated for type and presence before usage.
- Error responses are generic to avoid leaking server internals.
