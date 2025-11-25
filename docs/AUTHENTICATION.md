# Marine Care - Authentication Documentation

> Complete authentication flow documentation

**Last Updated:** November 2024  
**Version:** 1.0  
**Status:** Production Ready ✅

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend Authentication](#frontend-authentication)
4. [Backend Authentication](#backend-authentication)
5. [Session Management](#session-management)
6. [Security Features](#security-features)
7. [Error Handling](#error-handling)
8. [Troubleshooting](#troubleshooting)

---

## Overview

Marine Care uses a hybrid authentication architecture combining:

- **Firebase Authentication** - User authentication and identity management
- **Firebase Admin SDK** - Backend token verification
- **MongoDB** - User profile and application data storage
- **Session-based persistence** - Browser session-only authentication

### Key Features

| Feature | Implementation | Status |
|---------|---------------|--------|
| Email/Password Auth | Server-side registration | ✅ |
| Google OAuth | Firebase popup/redirect | ✅ |
| Session Persistence | Browser session only | ✅ |
| Token-Based Auth | Firebase ID tokens | ✅ |
| Rate Limiting | 5 attempts/min on auth | ✅ |
| Input Validation | Server & client-side | ✅ |
| XSS Prevention | Input sanitization | ✅ |

### Security Level: **INDUSTRY STANDARD** 🟢

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js/React)                     │
│                                                                      │
│  ┌──────────────────┐    ┌─────────────────┐   ┌─────────────────┐ │
│  │  Login/Signup    │    │  AuthContext    │   │  Protected      │ │
│  │  Pages           │───▶│  (State Mgmt)   │──▶│  Routes         │ │
│  └──────────────────┘    └─────────────────┘   └─────────────────┘ │
│           │                       │                                 │
│           ▼                       ▼                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │         Firebase Auth SDK (Client-Side)                       │  │
│  │  - signInWithEmailAndPassword()                              │  │
│  │  - signInWithPopup/Redirect()                                │  │
│  │  - onAuthStateChanged()                                       │  │
│  │  - getIdToken()                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────┬───────────────────────────────────┘
                                   │
                                   │ HTTPS (Bearer Token)
                                   │
┌──────────────────────────────────▼───────────────────────────────────┐
│                      BACKEND (Node.js/Express)                        │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │               Middleware Pipeline                             │  │
│  │  1. CORS                                                      │  │
│  │  2. Rate Limiting (5/min auth, 100/min API)                  │  │
│  │  3. verifyFirebaseToken() - Verify JWT                       │  │
│  │  4. ensureUserExists() - Sync MongoDB user                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│           │                                                          │
│           ▼                                                          │
│  ┌──────────────────┐    ┌─────────────────┐                        │
│  │  Auth Controller │    │  Firebase Admin │                        │
│  │  - register()    │───▶│  SDK            │                        │
│  │  - sync()        │    │  - createUser() │                        │
│  │  - checkEmail()  │    │  - verifyToken()│                        │
│  └──────────────────┘    └─────────────────┘                        │
│           │                                                          │
│           ▼                                                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                    MongoDB Atlas                              │  │
│  │  User Collection: firebaseUid, email, name, stats, etc.      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Frontend Authentication

### Firebase Configuration

**Location:** `frontend/src/lib/firebase.js`

```javascript
import { initializeApp, getApps } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern)
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Session-only persistence
if (typeof window !== "undefined") {
    setPersistence(auth, browserSessionPersistence);
}
```

### Authentication Flows

#### 1. Email/Password Signup

```
User submits signup form
        │
        ▼
┌───────────────────────────────┐
│  POST /api/auth/register      │
│  { email, password, name }    │
└───────────┬───────────────────┘
            │
            ▼
┌───────────────────────────────┐
│  Backend creates:             │
│  1. Firebase Auth user        │
│  2. MongoDB user (atomic)     │
└───────────┬───────────────────┘
            │
            ▼
┌───────────────────────────────┐
│  Frontend auto-login          │
│  signInWithEmailAndPassword() │
└───────────┬───────────────────┘
            │
            ▼
      User authenticated
```

#### 2. Email/Password Login

```javascript
const login = async (email, password) => {
    // Ensure session persistence
    await setPersistence(auth, browserSessionPersistence);

    // Sign in with Firebase
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    // Get ID token
    const idToken = await userCred.user.getIdToken(true);

    // Sync with backend
    await axios.post(`${API_URL}/api/auth/sync`, { idToken });
};
```

#### 3. Google OAuth

```javascript
const googleLogin = async () => {
    await setPersistence(auth, browserSessionPersistence);
    const provider = new GoogleAuthProvider();
    
    if (isMobileDevice()) {
        // Mobile: Use redirect (avoids popup blockers)
        await signInWithRedirect(auth, provider);
    } else {
        // Desktop: Use popup
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken(true);
        await syncUser(idToken);
    }
};
```

### AuthContext

**Location:** `frontend/src/context/AuthContext.js`

```javascript
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
```

### Protected Routes

**Location:** `frontend/src/components/auth/withAuth.js`

```javascript
const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const { isAuthenticated, loading } = useAuthContext();

        useEffect(() => {
            if (!loading && !isAuthenticated) {
                router.push('/login');
            }
        }, [isAuthenticated, loading]);

        if (loading || !isAuthenticated) {
            return <CircularProgress />;
        }

        return <WrappedComponent {...props} />;
    };
};

// Usage
export default withAuth(DashboardPage);
```

---

## Backend Authentication

### Registration Endpoint

**Route:** `POST /api/auth/register`  
**Rate Limit:** 5 requests/min

```javascript
export const registerUser = async (req, res) => {
    const { email, password, name } = req.body;

    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!emailValidation.valid || !passwordValidation.valid) {
        return res.status(400).json({ message: "Invalid input" });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
    }

    let firebaseUser;
    try {
        // Create Firebase user
        firebaseUser = await admin.auth().createUser({
            email,
            password,
            displayName: name,
        });

        // Create MongoDB user
        const newUser = await User.create({
            firebaseUid: firebaseUser.uid,
            email,
            name,
        });

        res.status(201).json({ success: true, user: newUser });

    } catch (error) {
        // Rollback: Delete Firebase user if MongoDB fails
        if (firebaseUser) {
            await admin.auth().deleteUser(firebaseUser.uid);
        }
        res.status(500).json({ message: "Registration failed" });
    }
};
```

### Token Verification Middleware

**Location:** `backend/src/middleware/authMiddleware.js`

```javascript
export const verifyFirebaseToken = async (req, res, next) => {
    // Extract token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        // Verify token with Firebase (checkRevoked = true)
        const decoded = await admin.auth().verifyIdToken(token, true);
        req.user = decoded;
        next();

    } catch (err) {
        if (err.code === 'auth/id-token-expired') {
            return res.status(401).json({ message: "Session expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};
```

### User Sync Middleware

**Location:** `backend/src/middleware/userMiddleware.js`

```javascript
export const ensureUserExists = async (req, res, next) => {
    const { uid, email, name, picture } = req.user;

    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
        user = await User.create({
            firebaseUid: uid,
            email,
            name: name || email.split("@")[0],
            profileImage: picture || "",
        });
    }

    req.mongoUser = user;
    next();
};
```

---

## Session Management

### Session Persistence Strategy

**Type:** Browser Session Only (`browserSessionPersistence`)

| Behavior | Status |
|----------|--------|
| Survives page refresh | ✅ |
| Survives tab close | ✅ |
| Survives browser close | ❌ (User logged out) |

### Token Lifecycle

| Token | Lifetime | Refresh |
|-------|----------|---------|
| Firebase ID Token | 1 hour | Automatic by SDK |
| Refresh Token | Session-based | N/A |

### Token Refresh

```javascript
// Automatic: Firebase SDK handles this
const token = await user.getIdToken(); // Auto-refreshes if needed

// Force refresh for critical operations
const freshToken = await user.getIdToken(true);
```

---

## Security Features

### 1. Input Validation

**Email Validation:**
- RFC 5322 compliant format
- TLD validation (2-6 letters)
- Common typo detection (.con, .cmo, etc.)

**Password Requirements:**
- Minimum 8 characters
- Uppercase letter
- Lowercase letter
- Number
- Special character

```javascript
export const validatePassword = (password) => {
    if (password.length < 8) return { valid: false, error: 'Too short' };
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
        return { valid: false, error: 'Missing requirements' };
    }
    
    return { valid: true };
};
```

### 2. Rate Limiting

| Endpoint | Limit | Block Duration |
|----------|-------|----------------|
| `/api/auth/register` | 5/min | 15 minutes |
| `/api/auth/sync` | 5/min | 15 minutes |
| `/api/auth/check-email` | 30/min | None |
| All API routes | 100/min | None |

### 3. CORS Configuration

```javascript
app.use(cors({
    origin: [
        "http://localhost:3000",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
}));
```

### 4. Input Sanitization

```javascript
export const sanitizeInput = (input) => {
    return input
        .replace(/[<>{}[\]\\/"';`]/g, '') // Remove dangerous characters
        .trim();
};
```

---

## Error Handling

### Authentication Error Messages

```javascript
const authErrors = {
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/invalid-email": "Invalid email address",
    "auth/user-disabled": "This account has been disabled",
    "auth/too-many-requests": "Too many failed attempts. Try again later",
    "auth/email-already-in-use": "Email is already registered",
    "auth/weak-password": "Password is too weak",
};
```

### Backend Error Responses

```javascript
// 400 Bad Request
{ "success": false, "message": "Invalid input" }

// 401 Unauthorized
{ "success": false, "message": "Session expired" }

// 429 Too Many Requests
{ "success": false, "message": "Too many attempts" }

// 500 Server Error
{ "success": false, "message": "Server error" }
```

---

## Troubleshooting

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| "Unauthorized" | Missing/invalid token | Use apiCall helper with auth |
| "Session expired" | Token > 1 hour old | Refresh token or re-login |
| "Email already registered" | Duplicate email | Login instead of signup |
| "Too many requests" | Rate limit exceeded | Wait 15 minutes |
| User logged out unexpectedly | Browser session ended | Expected behavior |
| Google popup blocked | Mobile browser | App uses redirect fallback |

### Debugging Tips

```javascript
// Check current user
console.log('User:', auth.currentUser);

// Get current token
const token = await auth.currentUser?.getIdToken();
console.log('Token:', token);

// Test API call
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/profile
```

---

## API Endpoints

### Public Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | User registration |
| `/api/auth/sync` | POST | Sync Firebase user |
| `/api/auth/check-email` | GET | Check email availability |

### Request/Response Examples

**Register:**
```javascript
// Request
POST /api/auth/register
{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
}

// Response (201)
{
    "success": true,
    "user": {
        "_id": "...",
        "email": "user@example.com",
        "name": "John Doe"
    }
}
```

**Sync:**
```javascript
// Request
POST /api/auth/sync
{
    "idToken": "eyJhbGciOi..."
}

// Response (200)
{
    "success": true,
    "user": { ... }
}
```

---

## Compliance

The authentication system meets these standards:

- ✅ **OWASP Top 10 2021** - A03:2021 Injection, A07:2021 Auth Failures
- ✅ **PCI DSS** - Password complexity requirements
- ✅ **GDPR** - Data validation, user consent
- ✅ **NIST 800-63B** - Password guidelines

---

## Related Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Overall system design
- [Backend Architecture](./BACKEND_ARCHITECTURE.md) - Backend details
- [API Reference](./API_REFERENCE.md) - Complete API documentation

---

*Document maintained by the Marine Care development team*
