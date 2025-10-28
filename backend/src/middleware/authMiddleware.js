import admin from "../config/firebase.js";

export const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
<<<<<<< HEAD
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
=======
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Missing or malformed Authorization header" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "Missing bearer token" });
        }

        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        // Do not leak sensitive details
        console.error("Token verification failed");
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
>>>>>>> main
