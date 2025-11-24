import admin from "../config/firebase.js";
import User from "../models/User.js";
import { validateEmail, validatePassword, validateName, sanitizeInput } from "../utils/validation.js";

// Helper: check Firebase Auth for user by email
const firebaseEmailExists = async (email) => {
    try {
        const userRecord = await admin.auth().getUserByEmail(email);
        return !!userRecord;
    } catch (err) {
        // Firebase throws error if not found
        return false;
    }
};

export const checkEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email || typeof email !== "string") {
            return res.status(400).json({ exists: false, message: "Email required" });
        }

        // Validate email format first
        const validation = validateEmail(email);
        if (!validation.valid) {
            return res.status(400).json({ exists: false, message: validation.error });
        }

        const sanitizedEmail = validation.sanitized;

        // Check MongoDB first
        const user = await User.findOne({ email: sanitizedEmail });
        if (user) return res.json({ exists: true, message: "Email already registered (database)" });

        // Check Firebase if not in MongoDB
        const existsInFirebase = await firebaseEmailExists(sanitizedEmail);
        if (existsInFirebase) {
            return res.json({ exists: true, message: "Email already registered (Firebase)" });
        }

        res.json({ exists: false, message: "Email available" });
    } catch (error) {
        console.error("Email check failed", error);
        res.status(500).json({ exists: false, message: "Server error" });
    }
};

/**
 * @desc    Register a new user in Firebase and MongoDB
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Basic validation
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "Please provide email, password, and name" });
        }

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.valid) {
            return res.status(400).json({ success: false, message: emailValidation.error });
        }

        // Validate password
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.valid) {
            return res.status(400).json({ success: false, message: passwordValidation.error });
        }

        // Validate name
        const nameValidation = validateName(name);
        if (!nameValidation.valid) {
            return res.status(400).json({ success: false, message: nameValidation.error });
        }

        const sanitizedEmail = emailValidation.sanitized;
        const sanitizedName = nameValidation.sanitized;

        // 1. Check if user already exists in MongoDB
        let mongoUserExists;
        try {
            mongoUserExists = await User.findOne({ email: sanitizedEmail });
        } catch (dbError) {
            console.error("MongoDB query error during registration:", dbError.message);
            return res.status(500).json({ 
                success: false, 
                message: "Database connection error. Please try again later." 
            });
        }
        
        if (mongoUserExists) {
            return res.status(400).json({ success: false, message: "Email is already registered" });
        }

        let firebaseUser;
        try {
            // 2. Create user in Firebase Auth
            firebaseUser = await admin.auth().createUser({
                email: sanitizedEmail,
                password: password,
                displayName: sanitizedName,
            });

            // 3. Create user in MongoDB
            let newUser;
            try {
                newUser = await User.create({
                    firebaseUid: firebaseUser.uid,
                    email: sanitizedEmail,
                    name: sanitizedName,
                });
            } catch (dbError) {
                console.error("MongoDB user creation error:", dbError.message);
                // Re-throw to trigger the outer catch block which handles rollback
                throw dbError;
            }

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: {
                    id: newUser._id,
                    firebaseUid: newUser.firebaseUid,
                    name: newUser.name,
                    email: newUser.email,
                },
            });

        } catch (error) {
            // 4. Rollback: If MongoDB creation fails, delete the Firebase user
            // This prevents de-synced "ghost" users
            if (firebaseUser) {
                try {
                    await admin.auth().deleteUser(firebaseUser.uid);
                    console.error(`Rollback: Deleted Firebase user ${firebaseUser.uid} due to MongoDB error.`);
                } catch (rollbackError) {
                    console.error(`Failed to rollback Firebase user ${firebaseUser.uid}:`, rollbackError);
                }
            }

            console.error("Registration Error:", error.message);
            console.error("Error code:", error.code);
            // Log detailed error information for debugging production issues
            // (Sensitive data is not exposed to client, only logged server-side)
            console.error("Error details:", {
                code: error.code,
                message: error.message,
                name: error.name,
                // Don't log full stack in production to reduce log size
                ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
            });
            
            // Handle Firebase-specific errors
            if (error.code === 'auth/email-already-exists') {
                return res.status(400).json({ success: false, message: "Email is already registered" });
            }
            if (error.code === 'auth/invalid-password') {
                return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
            }

            return res.status(500).json({ success: false, message: "Server error during registration. Please try again." });
        }
    } catch (error) {
        console.error("Unexpected registration error:", error.message);
        console.error("Error code:", error.code);
        // Log detailed error information for debugging production issues
        // (Sensitive data is not exposed to client, only logged server-side)
        console.error("Unexpected error details:", {
            code: error.code,
            message: error.message,
            name: error.name,
            // Don't log full stack in production to reduce log size
            ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
        });
        return res.status(500).json({ success: false, message: "Server error during registration. Please try again." });
    }
};


/**
 * @desc    Sync Firebase user to MongoDB (on login)
 * @route   POST /api/auth/sync
 * @access  Public (Relies on ID token)
 */
export const syncUser = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken || typeof idToken !== "string") {
            return res.status(400).json({ success: false, message: "Missing Firebase ID token" });
        }

        const decoded = await admin.auth().verifyIdToken(idToken);
        let { uid, name, email, picture } = decoded;

        // Sanitize inputs
        if (email) {
            const emailValidation = validateEmail(email);
            if (emailValidation.valid) {
                email = emailValidation.sanitized;
            }
        }

        if (name && typeof name === 'string') {
            name = sanitizeInput(name);
        }

        // Find existing user or create a new one (upsert logic)
        // This is safe for login/Google Sign-In as it won't create duplicates
        let user;
        try {
            user = await User.findOne({ firebaseUid: uid });

            if (!user) {
                console.log(`Sync: User ${uid} not found in MongoDB. Creating...`);
                user = await User.create({
                    firebaseUid: uid,
                    name: name || (email ? email.split("@")[0] : "Anonymous"),
                    email,
                    profileImage: picture || "",
                });
            }
        } catch (dbError) {
            console.error("MongoDB error during sync:", dbError.message);
            return res.status(500).json({ 
                success: false, 
                message: "Database error during user sync. Please try again." 
            });
        }

        return res.status(200).json({
            success: true,
            message: "User synced successfully",
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error("Firebase auth/sync error:", error.message);
        console.error("Error code:", error.code);
        // Log detailed error information for debugging production issues
        console.error("Sync error details:", {
            code: error.code,
            message: error.message,
            name: error.name,
            // Don't log full stack in production to reduce log size
            ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
        });
        res.status(401).json({ success: false, message: "Invalid or expired Firebase token" });
    }
};

/**
 * @desc    Create session cookie from Firebase ID token (XSS Protection)
 * @route   POST /api/auth/create-session
 * @access  Public (Relies on ID token)
 */
export const createSessionCookie = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken || typeof idToken !== "string") {
            return res.status(400).json({ success: false, message: "Missing Firebase ID token" });
        }

        // Verify the ID token first
        const decodedToken = await admin.auth().verifyIdToken(idToken);

        // Set session expiration (14 days)
        const expiresIn = 60 * 60 * 24 * 14 * 1000; // 14 days in milliseconds

        // Create the session cookie
        const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

        // Set cookie options
        // For cross-origin requests (Vercel frontend + DigitalOcean backend),
        // we need sameSite: 'none' and secure: true in production
        // For development (localhost), we use sameSite: 'lax' and secure: false
        const cookieOptions = {
            maxAge: expiresIn,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        };

        // Set the session cookie
        res.cookie('session', sessionCookie, cookieOptions);

        // Sync user to MongoDB
        let { uid, name, email, picture } = decodedToken;

        // Sanitize inputs
        if (email) {
            const emailValidation = validateEmail(email);
            if (emailValidation.valid) {
                email = emailValidation.sanitized;
            }
        }

        if (name && typeof name === 'string') {
            name = sanitizeInput(name);
        }

        // Find or create user
        let user;
        try {
            user = await User.findOne({ firebaseUid: uid });

            if (!user) {
                console.log(`Session: User ${uid} not found in MongoDB. Creating...`);
                user = await User.create({
                    firebaseUid: uid,
                    name: name || (email ? email.split("@")[0] : "Anonymous"),
                    email,
                    profileImage: picture || "",
                });
            }
        } catch (dbError) {
            console.error("MongoDB error during session creation:", dbError.message);
            return res.status(500).json({ 
                success: false, 
                message: "Database error during session creation. Please try again." 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Session created successfully",
            user: {
                id: user._id,
                firebaseUid: user.firebaseUid,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
            },
        });
    } catch (error) {
        console.error("Session creation error:", error.message);
        console.error("Error code:", error.code);
        // Log detailed error information for debugging production issues
        console.error("Session error details:", {
            code: error.code,
            message: error.message,
            name: error.name,
            // Don't log full stack in production to reduce log size
            ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
        });
        res.status(401).json({ success: false, message: "Failed to create session. Invalid or expired token." });
    }
};

/**
 * @desc    Clear session cookie (logout)
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const clearSessionCookie = async (req, res) => {
    try {
        // Clear the session cookie
        res.clearCookie('session', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.error("Logout error:", error.message);
        res.status(500).json({ success: false, message: "Logout failed" });
    }
};
