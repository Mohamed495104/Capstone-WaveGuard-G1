/**
 * Centralized API Route Registration
 * 
 * This module consolidates all API route registrations in one place to prevent
 * duplicate route registration issues that were causing 404 errors in production.
 * 
 * Previously, routes were registered in both:
 * - server.js (individual registrations)
 * - app.js (through this index.js)
 * 
 * This caused conflicts where requests couldn't match routes properly.
 * 
 * All API routes are now registered here and mounted at /api in app.js:
 * - /api/auth           - Authentication endpoints
 * - /api/newsletter     - Newsletter subscription
 * - /api/challenges     - Challenge CRUD and join/leave operations
 * - /api/profile        - User profile management
 * - /api/cleanups       - Cleanup uploads and tracking
 * - /api/dashboard      - Dashboard statistics
 * - /api/achievements   - User achievements
 * - /api/images         - Image serving
 * - /api/home           - Home page data
 */
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
