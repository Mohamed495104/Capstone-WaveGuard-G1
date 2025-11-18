import express from 'express';
import multer from "multer";

import {
    getChallenges,
    getChallengeStats,
    getChallengeById,
    joinChallenge,
    leaveChallenge,
    getJoinedChallenges,
    createChallenge
} from '../controllers/challengeController.js';

import { verifyFirebaseToken } from '../middleware/authMiddleware.js';
import { ensureUserExists } from '../middleware/userMiddleware.js';
import { uploadChallengeBanner } from "../controllers/challengeUploadController.js";

const router = express.Router();
const upload = multer(); // in-memory buffer

// Public routes
router.get('/', getChallenges);
router.get('/stats', getChallengeStats);

// Protected Routes
router.get('/joined', verifyFirebaseToken, ensureUserExists, getJoinedChallenges);

// Upload banner first → GridFS returns URL
router.post(
    "/upload-banner",
    verifyFirebaseToken,
    ensureUserExists,
    upload.single("image"),
    uploadChallengeBanner
);

// Create challenge (requires authenticated user)
router.post(
    "/",
    verifyFirebaseToken,
    ensureUserExists,
    upload.single("image"),  // Frontend sends it as `image`
    createChallenge
);

// Public route but must be BELOW /stats
router.get('/:id', getChallengeById);

// Join + Leave
router.post('/:id/join', verifyFirebaseToken, ensureUserExists, joinChallenge);
router.post('/:id/leave', verifyFirebaseToken, ensureUserExists, leaveChallenge);

export default router;
