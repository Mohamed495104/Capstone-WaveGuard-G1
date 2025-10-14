import User from "../models/User.js";

export const ensureUserExists = async (req, res, next) => {
    try {
        let user = await User.findOne({ uid: req.user.uid });

        if (!user) {
            user = new User({
                uid: req.user.uid,
                email: req.user.email || "no-email",
                name: req.user.name || "Anonymous",
            });
            await user.save();
        }

        req.mongoUser = user; // attach user for later use
        next();
    } catch (err) {
        res.status(500).json({ message: "Error ensuring user exists", err });
    }
};
