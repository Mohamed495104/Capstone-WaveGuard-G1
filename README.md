# 🌊 Marine Care

> An AI-powered Progressive Web App for shoreline cleanup management

---

## About

Marine Care is a mobile-first Progressive Web App designed to help volunteers participate in shoreline cleanup efforts. The app addresses plastic pollution in coastlines and freshwater ecosystems by making cleanup activities more organized and measurable through AI-powered waste classification.

### Key Features

- 📸 **AI Photo Classification** - Upload photos of collected trash and let AI identify waste types
- 📍 **Location Verification** - Verify cleanup locations for data accuracy
- 🏆 **Challenges & Events** - Join or create community cleanup challenges and events
- 📊 **Impact Tracking** - Track personal and community cleanup impact
- 🎖️ **Achievements** - Earn badges and rewards for participation
- 📈 **Analytics Dashboard** - View detailed statistics and progress charts
- 💚 **Donations** - Support ocean cleanup initiatives via secure PayPal integration

---

## Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 16, React 19, Material UI 7, Recharts, Framer Motion |
| **Backend** | Node.js 20, Express 5, Mongoose |
| **Database** | MongoDB Atlas, GridFS (image storage) |
| **Authentication** | Firebase Authentication (Email/Password, Google OAuth) |
| **AI** | Hugging Face Transformers (@xenova/transformers) |
| **Deployment** | Vercel (frontend), DigitalOcean (backend) |

---

## Quick Start

### Prerequisites

- Node.js 18+ (20 recommended)
- npm 9+
- MongoDB Atlas account
- Firebase project

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Mohamed495104/Marine-Care.git
cd Marine-Care

# Frontend setup
cd frontend
npm install
npm run dev
# Opens http://localhost:3000

# Backend setup (new terminal)
cd backend
npm install
npm run dev
# Runs on http://localhost:5000

# Seed database
npm run seed
```

### Environment Variables

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
```

**Backend** (`backend/.env`):
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/database
FRONTEND_URL=http://localhost:3000
PORT=5000
```

---

## Documentation

All documentation is organized in the `docs/` folder:

| Document | Description |
|----------|-------------|
| [Case Study](./docs/CASE_STUDY.md) | **Comprehensive project case study** |
| [Project Documentation](./docs/PROJECT_DOCUMENTATION.md) | Complete project overview and summary |
| [System Architecture](./docs/SYSTEM_ARCHITECTURE.md) | Overall system architecture and diagrams |
| [Frontend Design System](./docs/FRONTEND_DESIGN_SYSTEM.md) | UI/UX design system documentation |
| [Backend Architecture](./docs/BACKEND_ARCHITECTURE.md) | Backend architecture and workflow |
| [Authentication](./docs/AUTHENTICATION.md) | Complete authentication flow |
| [Database](./docs/DATABASE.md) | Database models, relationships, indexing |
| [API Reference](./docs/API_REFERENCE.md) | Complete API endpoint documentation |
| [Technical Stack](./docs/TECHNICAL_STACK.md) | Technologies and services summary |
| [Deployment](./docs/DEPLOYMENT.md) | Deployment and hosting guide |
| [PWA Summary](./docs/PWA_SUMMARY.md) | Progressive Web App capabilities |

---

## Project Structure

```
Marine-Care/
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Firebase config
│   │   ├── theme/         # MUI theme customization
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
│
├── backend/               # Express backend API
│   └── src/
│       ├── config/        # Database & Firebase config
│       ├── controllers/   # Route controllers
│       ├── middleware/    # Auth, rate limiting
│       ├── models/        # Mongoose models
│       ├── routes/        # API routes
│       ├── services/      # AI, file services
│       └── utils/         # Validation utilities
│
└── docs/                  # Documentation
```

---

## API Overview

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/sync` | POST | Sync Firebase user |
| `/api/challenges` | GET | List challenges |
| `/api/challenges` | POST | Create a new challenge |
| `/api/challenges/:id/join` | POST | Join challenge |
| `/api/location/search` | GET | Search Canadian locations |
| `/api/location/verify-water` | GET | Verify water proximity |
| `/api/cleanups/upload` | POST | Upload photo (AI) |
| `/api/cleanups/manual` | POST | Manual cleanup log |
| `/api/dashboard/stats` | GET | User analytics |
| `/api/achievements` | GET | User badges |

See [API Reference](./docs/API_REFERENCE.md) for complete documentation.

---

## Team

- **Dinesh Babu Ilamaran** - Frontend Incharge
- **Mohamed Ijas** - Lead, Backend and Integration Incharge
- **Dharanya Selvaraj** - AI Integration Incharge
- **Siri Reddy Borem** - Documentation & Testing Incharge

**Course:** PROG8751 Capstone (Web Development)  
**Institution:** Conestoga College

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

*Capstone Project - 2024/2025*
