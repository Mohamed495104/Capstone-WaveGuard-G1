# Marine Care - Technical Stack

> Technical summary of technologies and services used in the Marine Care application

**Last Updated:** December 2025  
**Version:** 1.1

---

## Table of Contents

1. [Overview](#overview)
2. [Frontend Technologies](#frontend-technologies)
3. [Backend Technologies](#backend-technologies)
4. [Database & Storage](#database--storage)
5. [Authentication & Security](#authentication--security)
6. [AI & Machine Learning](#ai--machine-learning)
7. [Development Tools](#development-tools)
8. [Deployment & Hosting](#deployment--hosting)
9. [Version Information](#version-information)

---

## Overview

Marine Care is a full-stack Progressive Web Application (PWA) designed for shoreline cleanup management. The application uses modern web technologies with a focus on performance, security, and developer experience.

### Architecture Summary

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 16 / React 19 | User interface, SSR |
| Backend | Node.js / Express 5 | REST API |
| Database | MongoDB Atlas | Data persistence |
| Auth | Firebase Authentication | User management |
| AI | Hugging Face Transformers | Trash classification |
| Hosting | Vercel (frontend) / DigitalOcean (backend) | Cloud deployment |

---

## Frontend Technologies

### Core Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.x | React framework with App Router, SSR, and SSG |
| **React** | 19.x | UI component library |

**Why Next.js?**
- Server-side rendering for SEO and performance
- App Router for modern routing patterns
- Built-in optimization (images, fonts, scripts)
- API routes for serverless functions
- PWA support with next-pwa

### UI Components

| Technology | Version | Purpose |
|------------|---------|---------|
| **Material UI (MUI)** | 7.x | Pre-built React components |
| **MUI Icons** | 7.x | Icon library |
| **Emotion** | 11.x | CSS-in-JS styling engine |

**Why Material UI?**
- Comprehensive component library
- Consistent design language
- Built-in accessibility
- Customizable theming
- Mobile-responsive by default

### Data Visualization

| Technology | Version | Purpose |
|------------|---------|---------|
| **Recharts** | 3.x | Charts and graphs |

**Used For:**
- Monthly progress line charts
- Waste distribution pie charts
- Items by type bar charts
- Dashboard analytics

### Animation

| Technology | Version | Purpose |
|------------|---------|---------|
| **Framer Motion** | 12.x | Page transitions, micro-interactions |

**Used For:**
- Page transition animations
- Card hover effects
- Loading state animations
- Achievement unlock effects

### HTTP Client

| Technology | Version | Purpose |
|------------|---------|---------|
| **Axios** | 1.x | HTTP requests to backend API |

**Features Used:**
- Request/response interceptors
- Automatic JSON parsing
- Error handling
- Credentials handling for auth

### PWA Support

| Technology | Version | Purpose |
|------------|---------|---------|
| **next-pwa** | 5.x | Service worker generation |

**Features:**
- Offline capability
- App installation prompts
- Push notifications (future)
- Cache management

### Analytics

| Technology | Version | Purpose |
|------------|---------|---------|
| **Vercel Analytics** | 1.x | Web analytics |

---

## Backend Technologies

### Runtime & Framework

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20.x | JavaScript runtime |
| **Express** | 5.x | Web application framework |

**Why Express?**
- Simple and minimal
- Large middleware ecosystem
- Well-documented
- High performance
- Flexible routing

### Database ORM

| Technology | Version | Purpose |
|------------|---------|---------|
| **Mongoose** | 8.x | MongoDB ODM |

**Features Used:**
- Schema definitions
- Validation
- Middleware (pre/post hooks)
- Population (joins)
- Aggregation helpers

### File Upload

| Technology | Version | Purpose |
|------------|---------|---------|
| **Multer** | 2.x | Multipart form data handling |
| **Sharp** | 0.34.x | Image processing |

**Sharp Used For:**
- Image resizing
- Format conversion
- Compression
- Metadata extraction

### Security

| Technology | Version | Purpose |
|------------|---------|---------|
| **CORS** | 2.x | Cross-origin resource sharing |
| **cookie-parser** | 1.x | Cookie parsing |
| **bcryptjs** | 3.x | Password hashing (if needed) |
| **jsonwebtoken** | 9.x | JWT handling (backup auth) |

### Environment

| Technology | Version | Purpose |
|------------|---------|---------|
| **dotenv** | 17.x | Environment variables |

---

## Database & Storage

### Primary Database

| Technology | Service | Purpose |
|------------|---------|---------|
| **MongoDB** | MongoDB Atlas | Document database |

**Why MongoDB?**
- Flexible document schema
- Native JSON support
- Geospatial queries (for location)
- Aggregation framework
- GridFS for file storage
- Free tier available

**Collections:**
- `users` - User profiles and stats
- `challenges` - Cleanup challenges
- `cleanups` - Cleanup records
- `achievements` - Badge definitions
- `newsletters` - Newsletter subscriptions

### File Storage

| Technology | Purpose |
|------------|---------|
| **GridFS** | Large file storage in MongoDB |

**Used For:**
- Cleanup photos
- Profile images
- Challenge banner images

**Benefits:**
- Integrated with MongoDB
- No separate service needed
- Automatic chunking
- Metadata support

---

## Authentication & Security

### Authentication Provider

| Technology | Service | Purpose |
|------------|---------|---------|
| **Firebase Authentication** | Google Cloud | User authentication |

**Auth Methods:**
- Email/Password registration
- Google OAuth (Sign in with Google)

**Features:**
- Secure password storage
- Token-based authentication
- Session management
- Password reset
- Email verification (optional)

### Backend Verification

| Technology | Version | Purpose |
|------------|---------|---------|
| **Firebase Admin SDK** | 13.x | Server-side token verification |

**Features:**
- Token verification
- User management
- Custom claims (future)
- Token revocation

### Security Measures

| Feature | Implementation |
|---------|---------------|
| **Rate Limiting** | Custom middleware (5/min auth, 100/min API) |
| **Input Validation** | Server-side validation utilities |
| **XSS Prevention** | Input sanitization |
| **CORS** | Whitelist of allowed origins |
| **Token Verification** | Firebase Admin SDK with revocation check |

---

## AI & Machine Learning

### AI Provider

| Technology | Version | Purpose |
|------------|---------|---------|
| **@xenova/transformers** | 2.x | On-device ML inference |

**Why Transformers.js?**
- No external API calls needed
- Fast inference
- Runs on Node.js
- Pre-trained models available
- Privacy-friendly (no data sent externally)

### Classification Model

| Category | Description |
|----------|-------------|
| **Type** | Image classification |
| **Categories** | 7 waste types |
| **Output** | Label + confidence score |

**Waste Categories:**
- `plastic_bottle`
- `metal_can`
- `plastic_bag`
- `paper_cardboard`
- `cigarette_butt`
- `glass_bottle`
- `unknown`

---

## Development Tools

### Package Management

| Tool | Purpose |
|------|---------|
| **npm** | Package manager |

### Code Quality

| Tool | Purpose |
|------|---------|
| **ESLint** | JavaScript linting |
| **eslint-config-next** | Next.js specific rules |

### Development Server

| Tool | Purpose |
|------|---------|
| **nodemon** | Auto-restart on file changes (backend) |
| **Next.js dev server** | Hot module replacement (frontend) |

### Version Control

| Tool | Purpose |
|------|---------|
| **Git** | Source control |
| **GitHub** | Repository hosting |

---

## Deployment & Hosting

### Frontend Hosting

| Service | Purpose |
|---------|---------|
| **Vercel** | Next.js hosting (recommended) |

**Features:**
- Zero-config deployment
- Global CDN
- Automatic HTTPS
- Preview deployments
- Analytics included

### Backend Hosting

| Service | Purpose |
|---------|---------|
| **DigitalOcean App Platform** | Node.js hosting (primary) |

**DigitalOcean Features:**
- GitHub integration
- Automatic deployments
- Environment variables
- Logs and monitoring
- $200 free credit with GitHub Student Pack

### Database Hosting

| Service | Purpose |
|---------|---------|
| **MongoDB Atlas** | Managed MongoDB |

**Free Tier:**
- 512MB storage
- Shared cluster
- Sufficient for MVP

### Environment Configuration

| Environment | Frontend URL | Backend URL |
|-------------|--------------|-------------|
| Development | localhost:3000 | localhost:5000 |
| Production | your-app.vercel.app | your-app.ondigitalocean.app |

---

## Version Information

### Frontend Dependencies

```json
{
    "next": "16.0.8",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "@mui/material": "^7.3.4",
    "@mui/icons-material": "^7.3.4",
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "axios": "^1.12.2",
    "firebase": "^12.4.0",
    "framer-motion": "^12.23.22",
    "recharts": "^3.3.0",
    "next-pwa": "^5.6.0",
    "@vercel/analytics": "^1.6.1"
}
```

### Backend Dependencies

```json
{
    "express": "^5.1.0",
    "mongoose": "^8.19.1",
    "firebase-admin": "^13.5.0",
    "@xenova/transformers": "^2.17.2",
    "multer": "^2.0.2",
    "sharp": "^0.34.4",
    "cors": "^2.8.5",
    "cookie-parser": "^1.4.6",
    "dotenv": "^17.2.3",
    "bcryptjs": "^3.0.2",
    "jsonwebtoken": "^9.0.2"
}
```

### Runtime Requirements

| Component | Minimum Version |
|-----------|-----------------|
| Node.js | 18.x (20.x recommended) |
| npm | 9.x |
| MongoDB | 6.x |

---

## Quick Start Commands

### Frontend Development

```bash
cd frontend
npm install
npm run dev
# Opens http://localhost:3000
```

### Backend Development

```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:5000
```

### Database Seeding

```bash
cd backend
npm run seed
```

### Production Build

```bash
# Frontend
cd frontend
npm run build
npm start

# Backend
cd backend
npm start
```

---

## Related Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Overall system design
- [Backend Architecture](./BACKEND_ARCHITECTURE.md) - Backend details
- [Frontend Design System](./FRONTEND_DESIGN_SYSTEM.md) - UI documentation
- [API Reference](./API_REFERENCE.md) - Endpoint documentation

---

*Document maintained by the Marine Care development team*
