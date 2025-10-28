import admin from "../config/firebase.js";
import User from "../models/User.js";

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

        const user = await User.findOne({ email });
        if (user) return res.json({ exists: true, message: "Email already registered" });

        res.json({ exists: false, message: "Email available" });
    } catch (error) {
<<<<<<< HEAD
        console.error("Email check failed:", error.message);
=======
        console.error("Email check failed");
>>>>>>> main
        res.status(500).json({ exists: false, message: "Server error" });
    }
};

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
