import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { ensureUserExists } from "../middleware/userMiddleware.js";

const router = express.Router();

// Protected test route
router.get("/profile", verifyToken, ensureUserExists, (req, res) => {
    res.json({
        message: "User authenticated",
        firebaseUser: req.user,
        mongoUser: req.mongoUser,
    });
});

export default router;
