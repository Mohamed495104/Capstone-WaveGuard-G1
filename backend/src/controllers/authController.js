import admin from "../config/firebase.js";
import User from "../models/User.js";

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
<<<<<<< HEAD
        if (!email) return res.status(400).json({ exists: false, message: "Email required" });
=======
        if (!email || typeof email !== "string") {
            return res.status(400).json({ exists: false, message: "Email required" });
        }
>>>>>>> main

        // Check MongoDB first
        const user = await User.findOne({ email });
        if (user) return res.json({ exists: true, message: "Email already registered (database)" });

        // Check Firebase if not in MongoDB
        const existsInFirebase = await firebaseEmailExists(email);
        if (existsInFirebase) {
            return res.json({ exists: true, message: "Email already registered (Firebase)" });
        }

        res.json({ exists: false, message: "Email available" });
    } catch (error) {
<<<<<<< HEAD
<<<<<<< HEAD
        console.error("Email check failed:", error.message);
=======
        console.error("Email check failed");
>>>>>>> main
=======
        console.error("Email check failed", error);
>>>>>>> main
        res.status(500).json({ exists: false, message: "Server error" });
    }
};

// ---- YOU WERE MISSING THIS EXPORT ----
export const syncUser = async (req, res) => {
    try {
        const { idToken } = req.body;
<<<<<<< HEAD
        if (!idToken) return res.status(400).json({ success: false, message: "Missing Firebase ID token" });
=======
        if (!idToken || typeof idToken !== "string") {
            return res.status(400).json({ success: false, message: "Missing Firebase ID token" });
        }
>>>>>>> main

        const decoded = await admin.auth().verifyIdToken(idToken);
        const { uid, name, email, picture } = decoded;

        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({
                firebaseUid: uid,
<<<<<<< HEAD
                name: name || email.split("@")[0],
=======
                name: name || (email ? email.split("@")[0] : "Anonymous"),
>>>>>>> main
                email,
                profileImage: picture || "",
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
<<<<<<< HEAD
        console.error("Firebase auth error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired Firebase token" });
    }
};
=======
        console.error("Firebase auth error");
        res.status(401).json({ success: false, message: "Invalid or expired Firebase token" });
    }
};
>>>>>>> main
