import express from "express";
import authRoutes from "../routes/authRoutes.js";
import newsletterRoutes from "../routes/newsletterRoutes.js";
import challengeRoutes from "../routes/challengeRoutes.js";
import profileRoutes from "../routes/profileRoutes.js";
import cleanupRoutes from "../routes/cleanupRoutes.js";
import dashboardRoutes from "../routes/dashboardRoutes.js";
import achievementsRoutes from "../routes/achievementsRoutes.js";
import imageRoutes from "../routes/imageRoutes.js";
import homeRoutes from "../routes/homeRoutes.js";

const router = express.Router();

// Register all API routes
router.use("/auth", authRoutes);
router.use("/newsletter", newsletterRoutes);
router.use("/challenges", challengeRoutes);
router.use("/profile", profileRoutes);
router.use("/cleanups", cleanupRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/achievements", achievementsRoutes);
router.use("/images", imageRoutes);
router.use("/home", homeRoutes);

export default router;
