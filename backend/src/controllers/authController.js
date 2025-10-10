import admin from "../config/firebase.js";
import User from "../models/User.js";

export const checkEmail = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ exists: false, message: "Email required" });

        const user = await User.findOne({ email });
        if (user) return res.json({ exists: true, message: "Email already registered" });

        res.json({ exists: false, message: "Email available" });
    } catch (error) {
        console.error("Email check failed:", error.message);
        res.status(500).json({ exists: false, message: "Server error" });
    }
};

export const syncUser = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) return res.status(400).json({ success: false, message: "Missing Firebase ID token" });

        const decoded = await admin.auth().verifyIdToken(idToken);
        const { uid, name, email, picture } = decoded;

        let user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            user = await User.create({
                firebaseUid: uid,
                name: name || email.split("@")[0],
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
        console.error("❌ Firebase auth error:", error);
        res.status(401).json({ success: false, message: "Invalid or expired Firebase token" });
    }
};
