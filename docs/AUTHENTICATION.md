# Marine Care - Authentication Documentation

> Complete authentication flow documentation with HttpOnly Session Cookies

**Last Updated:** December 2024  
**Version:** 2.1  
**Status:** Production Ready ✅

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Frontend Authentication](#frontend-authentication)
4. [Backend Authentication](#backend-authentication)
5. [Session Management](#session-management)
6. [SessionReady State (New)](#sessionready-state-new)
7. [Security Features](#security-features)
8. [Error Handling](#error-handling)
9. [Troubleshooting](#troubleshooting)

---

## Overview

Marine Care uses a **secure hybrid authentication architecture** combining:

- **Firebase Authentication** - User authentication and identity management
- **Firebase Admin SDK** - Backend token verification
- **MongoDB** - User profile and application data storage
- **HttpOnly Session Cookies** - XSS-protected session management
- **SessionReady State** - Frontend state tracking for secure API calls

### Key Features

| Feature | Implementation | Status |
|---------|---------------|--------|
| Email/Password Auth | Server-side registration | ✅ |
| Google OAuth | Firebase popup/redirect | ✅ |
| **HttpOnly Session Cookies** | XSS-protected sessions | ✅ **NEW** |
| **SessionReady State** | Frontend session tracking | ✅ **NEW** |
| Session Persistence | 14-day cookie expiration | ✅ |
| Rate Limiting | 5 attempts/min on auth | ✅ |
| Input Validation | Server & client-side | ✅ |
| XSS Prevention | HttpOnly cookies + sanitization | ✅ |

### Security Level: **ENHANCED SECURITY** 🟢

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js/React)                         │
│                                                                          │
│  ┌──────────────────┐    ┌─────────────────────┐   ┌─────────────────┐  │
│  │  Login/Signup    │    │    AuthContext      │   │  Protected      │  │
│  │  Pages           │───▶│  (sessionReady)     │──▶│  Routes         │  │
│  └──────────────────┘    └─────────────────────┘   └─────────────────┘  │
│           │                       │                                      │
│           ▼                       ▼                                      │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │         Firebase Auth SDK (Client-Side)                           │   │
│  │  - signInWithEmailAndPassword()                                   │   │
│  │  - signInWithPopup/Redirect()                                     │   │
│  │  - onAuthStateChanged()                                           │   │
│  │  - getIdToken()                                                   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│           │                                                              │
│           │ 1. Get Firebase ID Token                                     │
│           ▼                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │       POST /api/auth/create-session                               │   │
│  │       { idToken }                                                 │   │
│  │       Response: Set-Cookie: session=<HttpOnly cookie>             │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│           │                                                              │
│           │ 2. Set sessionReady = true                                   │
│           ▼                                                              │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │       API Calls with withCredentials: true                        │   │
│  │       Cookie: session=<HttpOnly cookie> (automatic)               │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS (HttpOnly Cookie)
                                    │
┌──────────────────────────────────▼───────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                            │
│                                                                           │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │               Middleware Pipeline                                  │    │
│  │  1. CORS (credentials: true)                                      │    │
│  │  2. cookie-parser                                                 │    │
│  │  3. Rate Limiting (5/min auth, 100/min API)                       │    │
│  │  4. verifySessionCookie() OR verifyAuth() (hybrid)                │    │
│  │  5. ensureUserExists() - Sync MongoDB user                        │    │
│  └──────────────────────────────────────────────────────────────────┘    │
│           │                                                               │
│           ▼                                                               │
│  ┌──────────────────┐    ┌─────────────────────────┐                     │
│  │  Auth Controller │    │  Firebase Admin SDK     │                     │
│  │  - register()    │───▶│  - createUser()         │                     │
│  │  - createSession │    │  - verifyIdToken()      │                     │
│  │  - logout()      │    │  - createSessionCookie()│                     │
│  └──────────────────┘    │  - verifySessionCookie()│                     │
│           │              └─────────────────────────┘                     │
│           ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │                    MongoDB Atlas                                   │    │
│  │  User Collection: firebaseUid, email, name, stats, etc.           │    │
│  └──────────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────────┘
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

#### 1. Email/Password Signup (Updated with Session Cookie)

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
┌───────────────────────────────┐
│  Get Firebase ID Token        │
│  POST /api/auth/create-session│
│  Response: HttpOnly cookie    │
└───────────┬───────────────────┘
            │
            ▼
┌───────────────────────────────┐
│  markSessionReady()           │
│  sessionReady = true          │
└───────────┬───────────────────┘
            │
            ▼
      User authenticated
      (Ready for API calls)
```

#### 2. Email/Password Login (Updated)

```javascript
const login = async (email, password) => {
    // Ensure session persistence
    await setPersistence(auth, browserSessionPersistence);

    // Sign in with Firebase
    const userCred = await signInWithEmailAndPassword(auth, email, password);

    // Get ID token
    const idToken = await userCred.user.getIdToken(true);

    // Create HttpOnly session cookie (NEW)
    await createSession(idToken);
    
    // Session is now ready for authenticated API calls
    markSessionReady();
};

// Helper function for session creation
const createSession = async (idToken) => {
    await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/create-session`,
        { idToken },
        { withCredentials: true } // Important: Send/receive cookies
    );
};
```

#### 3. Google OAuth (Updated)

```javascript
const googleLogin = async () => {
    await setPersistence(auth, browserSessionPersistence);
    const provider = new GoogleAuthProvider();
    
    if (isMobileDevice()) {
        // Mobile: Use redirect (avoids popup blockers)
        // Session is created in AuthContext after redirect result
        await signInWithRedirect(auth, provider);
    } else {
        // Desktop: Use popup
        const result = await signInWithPopup(auth, provider);
        const idToken = await result.user.getIdToken(true);
        
        // Create HttpOnly session cookie (NEW)
        await createSession(idToken);
        await syncUser(idToken);
        markSessionReady();
    }
};
```

### AuthContext (Updated with sessionReady)

**Location:** `frontend/src/context/AuthContext.js`

The AuthContext now includes **sessionReady state tracking** to ensure API calls only happen after the HttpOnly session cookie is set.

```javascript
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sessionReady, setSessionReady] = useState(false); // NEW: Track session cookie state
    const [authVersion, setAuthVersion] = useState(0); // Track auth state changes

    // Callback to mark session as ready (called after session cookie is set)
    const markSessionReady = useCallback(() => {
        setSessionReady(true);
        setAuthVersion(prev => prev + 1);
    }, []);

    // Callback to mark session as not ready (called during logout)
    const markSessionNotReady = useCallback(() => {
        setSessionReady(false);
    }, []);

    useEffect(() => {
        // Handle redirect result for mobile Google sign-in
        const checkRedirectResult = async () => {
            const result = await getRedirectResult(auth);
            if (result && result.user) {
                const idToken = await result.user.getIdToken(true);
                await createSession(idToken);
                setSessionReady(true);
            }
        };

        checkRedirectResult();

        // Listen for Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            
            if (!currentUser) {
                setSessionReady(false);
                setLoading(false);
                return;
            }

            // For page refresh: Verify if session is still valid
            // Create new session if needed
            if (currentUser && !sessionCreationInProgress.current) {
                const isValid = await verifySession();
                if (isValid) {
                    setSessionReady(true);
                } else {
                    // Session expired - create new one
                    const idToken = await currentUser.getIdToken(true);
                    await createSession(idToken);
                    setSessionReady(true);
                }
            }
            
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        sessionReady,      // NEW: Expose session readiness
        loading,
        authVersion,
        markSessionReady,   // NEW: For useAuth hook
        markSessionNotReady, // NEW: For logout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
```

### Protected Routes (Updated)

**Location:** `frontend/src/components/auth/withAuth.js`

Components can now also wait for `sessionReady` before making authenticated API calls:

```javascript
const withAuth = (WrappedComponent) => {
    return (props) => {
        const router = useRouter();
        const { isAuthenticated, sessionReady, loading } = useAuthContext();

        useEffect(() => {
            if (!loading && !isAuthenticated) {
                router.push('/login');
            }
        }, [isAuthenticated, loading]);

        // Wait for both authentication AND session cookie
        if (loading || !isAuthenticated || !sessionReady) {
            return <CircularProgress />;
        }

        return <WrappedComponent {...props} />;
    };
};

// Usage
export default withAuth(DashboardPage);
```

---

## SessionReady State (New)

### Why SessionReady?

The `sessionReady` state solves a critical timing issue:

1. **Problem:** After Firebase login, there's a brief moment where `isAuthenticated` is `true` but the HttpOnly session cookie hasn't been set yet.
2. **Impact:** API calls made during this window fail with 401 Unauthorized.
3. **Solution:** `sessionReady` tracks when the session cookie is actually set and ready.

### How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                     Authentication Flow                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. User clicks "Login"                                             │
│     └─> isAuthenticated: false, sessionReady: false                 │
│                                                                      │
│  2. Firebase signInWithEmailAndPassword() succeeds                  │
│     └─> isAuthenticated: true, sessionReady: false ⚠️               │
│         (DON'T make API calls yet!)                                 │
│                                                                      │
│  3. POST /api/auth/create-session (HttpOnly cookie set)             │
│     └─> isAuthenticated: true, sessionReady: true ✅                │
│         (NOW it's safe to make API calls)                           │
│                                                                      │
│  4. Page refresh (Firebase auth state restored)                     │
│     └─> isAuthenticated: true, sessionReady: false ⚠️               │
│         (Verify session cookie is still valid)                      │
│                                                                      │
│  5. verifySession() or create new session                           │
│     └─> isAuthenticated: true, sessionReady: true ✅                │
│                                                                      │
│  6. User clicks "Logout"                                            │
│     └─> markSessionNotReady() called                                │
│     └─> POST /api/auth/logout (cookie cleared)                      │
│     └─> isAuthenticated: false, sessionReady: false                 │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Usage in Components

```javascript
// In any component that needs to make authenticated API calls
const { isAuthenticated, sessionReady, loading } = useAuthContext();

// Wait for both before making API calls
useEffect(() => {
    if (isAuthenticated && sessionReady) {
        // Safe to make authenticated API calls now
        fetchUserProfile();
    }
}, [isAuthenticated, sessionReady]);
```

---

## Backend Authentication

### New Endpoints

| Endpoint | Method | Description | Rate Limit |
|----------|--------|-------------|------------|
| `/api/auth/register` | POST | User registration | 5/min |
| `/api/auth/sync` | POST | Sync Firebase user (legacy) | 5/min |
| `/api/auth/create-session` | POST | **NEW:** Create HttpOnly session cookie | 5/min |
| `/api/auth/logout` | POST | **NEW:** Clear session cookie | None |
| `/api/auth/check-email` | GET | Check email availability | 30/min |

### Create Session Endpoint (New)

**Route:** `POST /api/auth/create-session`  
**Purpose:** Creates an HttpOnly session cookie from Firebase ID token

```javascript
export const createSessionCookie = async (req, res) => {
    const { idToken } = req.body;

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Create session cookie (14-day expiration)
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set HttpOnly cookie
    const cookieOptions = {
        maxAge: expiresIn,
        httpOnly: true,                    // XSS Protection
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
    };

    res.cookie('session', sessionCookie, cookieOptions);

    // Also sync user to MongoDB
    let user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
        user = await User.create({
            firebaseUid: decodedToken.uid,
            email: decodedToken.email,
            name: decodedToken.name || decodedToken.email.split("@")[0],
        });
    }

    return res.status(200).json({ success: true, user });
};
```

### Session Cookie Verification Middleware

**Location:** `backend/src/middleware/authMiddleware.js`

```javascript
export const verifySessionCookie = async (req, res, next) => {
    const sessionCookie = req.cookies?.session;
    
    if (!sessionCookie) {
        return res.status(401).json({ message: "Unauthorized - No session found" });
    }

    try {
        // Verify session cookie (checkRevoked = true)
        const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
        req.user = decodedClaims;
        next();
    } catch (err) {
        // Clear invalid cookie
        res.clearCookie('session', { httpOnly: true, secure: true, sameSite: 'none', path: '/' });
        
        if (err.code === 'auth/session-cookie-expired') {
            return res.status(401).json({ message: "Session expired" });
        }
        return res.status(401).json({ message: "Invalid session" });
    }
};

// Hybrid middleware: Try session cookie first, fallback to Bearer token
export const verifyAuth = async (req, res, next) => {
    const sessionCookie = req.cookies?.session;
    
    // Try session cookie first (preferred)
    if (sessionCookie) {
        try {
            const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
            req.user = decoded;
            return next();
        } catch (err) {
            res.clearCookie('session', { httpOnly: true });
        }
    }

    // Fallback to Bearer token (backward compatibility)
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
        try {
            const token = authHeader.split(" ")[1];
            const decoded = await admin.auth().verifyIdToken(token, true);
            req.user = decoded;
            return next();
        } catch (err) {
            // Fall through to 401
        }
    }

    return res.status(401).json({ message: "Unauthorized" });
};
```

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

### Session Architecture (Updated)

Marine Care now uses a **dual-layer session architecture**:

1. **Firebase Auth State** - Client-side authentication state (managed by Firebase SDK)
2. **HttpOnly Session Cookie** - Server-side session for secure API authentication

```
┌─────────────────────────────────────────────────────────────────┐
│                     Dual-Layer Sessions                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Layer 1: Firebase Auth State (Client)                          │
│  ├─ Stored in: Browser memory                                   │
│  ├─ Persistence: browserSessionPersistence                      │
│  ├─ Purpose: UI state (isAuthenticated)                         │
│  └─ Managed by: Firebase SDK                                    │
│                                                                  │
│  Layer 2: HttpOnly Session Cookie (Server)                      │
│  ├─ Stored in: Browser cookie (HttpOnly)                        │
│  ├─ Duration: 14 days                                           │
│  ├─ Purpose: API authentication                                 │
│  └─ Managed by: Backend via Firebase Admin SDK                  │
│                                                                  │
│  Synchronization: sessionReady state                            │
│  ├─ true: Both layers are in sync                               │
│  └─ false: Cookie not yet set or cleared                        │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Session Persistence Strategy

| Behavior | Firebase Auth | Session Cookie |
|----------|---------------|----------------|
| Survives page refresh | ✅ | ✅ |
| Survives tab close | ✅ | ✅ |
| Survives browser close | ❌ | ✅ (14 days) |
| Protected from XSS | ❌ | ✅ (HttpOnly) |

### Token Lifecycle (Updated)

| Token | Lifetime | Refresh | Storage |
|-------|----------|---------|---------|
| Firebase ID Token | 1 hour | Automatic by SDK | Memory |
| **Session Cookie** | **14 days** | **On page refresh** | **HttpOnly Cookie** |

### Session Verification on Page Refresh

When the page is refreshed:

1. Firebase restores auth state → `isAuthenticated = true`, `sessionReady = false`
2. AuthContext calls `verifySession()` to check if cookie is valid
3. If valid → `sessionReady = true`
4. If invalid/expired → Creates new session cookie → `sessionReady = true`

```javascript
// In AuthContext
const verifySession = async () => {
    try {
        await axios.get(`${API_URL}/api/profile`, { withCredentials: true });
        return true;
    } catch {
        return false;
    }
};
```

---

## Security Features

### 1. HttpOnly Session Cookies (New - XSS Protection)

The most significant security improvement is the use of **HttpOnly session cookies**:

```javascript
// Cookie configuration
const cookieOptions = {
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    httpOnly: true,                    // NOT accessible via JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
};
```

**Why HttpOnly Cookies?**

| Attack Vector | Bearer Token (Old) | HttpOnly Cookie (New) |
|---------------|-------------------|----------------------|
| **XSS (Cross-Site Scripting)** | ❌ Vulnerable - Token in localStorage/memory | ✅ Protected - Cannot be read by JavaScript |
| **CSRF (Cross-Site Request Forgery)** | ✅ Protected - Not auto-sent | ⚠️ Mitigated - sameSite attribute |
| **Token Theft via DevTools** | ❌ Vulnerable | ✅ Protected - Not in Application tab |

### 2. Input Validation

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

### 3. Rate Limiting

| Endpoint | Limit | Block Duration |
|----------|-------|----------------|
| `/api/auth/register` | 5/min | 15 minutes |
| `/api/auth/sync` | 5/min | 15 minutes |
| `/api/auth/create-session` | 5/min | 15 minutes |
| `/api/auth/check-email` | 30/min | None |
| All API routes | 100/min | None |

### 4. CORS Configuration (Updated for Cookies)

```javascript
app.use(cors({
    origin: [
        "http://localhost:3000",
        process.env.FRONTEND_URL
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true, // REQUIRED for cross-origin cookies
}));

// Cookie parser middleware
app.use(cookieParser());
```

### 5. Input Sanitization

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

### Common Issues (Updated)

| Issue | Cause | Solution |
|-------|-------|----------|
| "Unauthorized - No session found" | Session cookie not set | Ensure `withCredentials: true` on API calls |
| "Session expired" | Cookie > 14 days old | Re-login to create new session |
| **API calls fail after login** | **sessionReady = false** | **Wait for sessionReady before making API calls** |
| "Email already registered" | Duplicate email | Login instead of signup |
| "Too many requests" | Rate limit exceeded | Wait 15 minutes |
| User logged out unexpectedly | Browser session ended | Expected behavior |
| Google popup blocked | Mobile browser | App uses redirect fallback |
| Cookies not set (cross-origin) | CORS misconfigured | Ensure `credentials: true` in CORS |

### Debugging Tips (Updated)

```javascript
// Check authentication state
const { isAuthenticated, sessionReady, loading } = useAuthContext();
console.log('isAuthenticated:', isAuthenticated);
console.log('sessionReady:', sessionReady);  // NEW: Must be true for API calls
console.log('loading:', loading);

// Check Firebase user
console.log('Firebase User:', auth.currentUser);

// Check session cookie (will show as [HttpOnly] in DevTools)
// Go to DevTools > Application > Cookies > [your domain]
// Look for 'session' cookie

// Test API call with cookies (browser)
fetch('http://localhost:5000/api/profile', { 
    credentials: 'include'  // IMPORTANT for cookies
}).then(r => r.json()).then(console.log);

// Test API call with curl (using cookie)
curl -b "session=<session_cookie_value>" http://localhost:5000/api/profile
```

### sessionReady Troubleshooting

If `sessionReady` is always `false`:

1. **Check network requests** - Is `/api/auth/create-session` being called after login?
2. **Check cookie settings** - Is `withCredentials: true` set on axios requests?
3. **Check CORS** - Is backend allowing credentials from frontend origin?
4. **Check cookie in DevTools** - Is `session` cookie present in Application > Cookies?

```javascript
// Debug session creation
const createSession = async (idToken) => {
    console.log('Creating session...');
    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/create-session`,
            { idToken },
            { withCredentials: true }
        );
        console.log('Session created:', response.data);
        markSessionReady();
    } catch (err) {
        console.error('Session creation failed:', err.response?.data);
    }
};
```

---

## API Endpoints (Updated)

### Public Endpoints

| Endpoint | Method | Description | New |
|----------|--------|-------------|-----|
| `/api/auth/register` | POST | User registration | |
| `/api/auth/sync` | POST | Sync Firebase user (legacy) | |
| `/api/auth/create-session` | POST | Create HttpOnly session cookie | ✅ NEW |
| `/api/auth/logout` | POST | Clear session cookie | ✅ NEW |
| `/api/auth/check-email` | GET | Check email availability | |

### Request/Response Examples (Updated)

**Create Session (NEW):**
```javascript
// Request
POST /api/auth/create-session
Content-Type: application/json
{
    "idToken": "eyJhbGciOi..." // Firebase ID token
}

// Response (200)
// Headers: Set-Cookie: session=<httponly_cookie>; HttpOnly; Path=/; ...
{
    "success": true,
    "message": "Session created successfully",
    "user": {
        "id": "...",
        "firebaseUid": "...",
        "name": "John Doe",
        "email": "user@example.com"
    }
}
```

**Logout (NEW):**
```javascript
// Request
POST /api/auth/logout
// Cookies: session=<session_cookie> (auto-sent)

// Response (200)
// Headers: Set-Cookie: session=; HttpOnly; Path=/; Max-Age=0 (cleared)
{
    "success": true,
    "message": "Logged out successfully"
}
```

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
- ✅ **XSS Protection** - HttpOnly session cookies (NEW)

---

## Summary of Authentication Improvements

| Feature | Before | After |
|---------|--------|-------|
| Session Storage | Bearer token in memory | HttpOnly cookie |
| XSS Protection | ❌ Token accessible via JS | ✅ Cookie inaccessible to JS |
| Session Duration | Firebase token (1 hour) | 14-day cookie |
| API Authentication | Bearer header | Cookie (automatic) |
| Session State Tracking | isAuthenticated only | isAuthenticated + **sessionReady** |
| Page Refresh Handling | Re-fetch token | Verify/renew cookie automatically |
| Cross-Origin Support | Bearer header | `withCredentials: true` + CORS |

---

## Related Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Overall system design
- [Backend Architecture](./BACKEND_ARCHITECTURE.md) - Backend details
- [API Reference](./API_REFERENCE.md) - Complete API documentation
- [PWA Summary](./PWA_SUMMARY.md) - PWA capabilities

---

*Document maintained by the Marine Care development team*  
*Last Updated: November 2024 | Version 2.0*
