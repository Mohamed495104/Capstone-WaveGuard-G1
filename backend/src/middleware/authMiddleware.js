import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Missing Authorization header" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = await admin.auth().verifyIdToken(token);

        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
