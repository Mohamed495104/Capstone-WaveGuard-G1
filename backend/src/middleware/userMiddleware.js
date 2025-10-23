import User from "../models/User.js";

export const ensureUserExists = async (req, res, next) => {
    try {
        // Validate decoded user object from auth middleware
        if (!req.user || !req.user.uid || !req.user.email) {
            return res.status(400).json({ message: "Missing user information from token" });
        }

        let user = await User.findOne({ firebaseUid: req.user.uid });

        if (!user) {
            user = new User({
                firebaseUid: req.user.uid,
                email: req.user.email || "no-email",
                name: req.user.name || "Anonymous",
                profileImage: req.user.picture || "",
            });
            await user.save();
        }

        req.mongoUser = user; // attach user for later use
        next();
    } catch (err) {
        console.error("Error ensuring user exists");
        res.status(500).json({ message: "Error ensuring user exists", err: err.message });
    }
};