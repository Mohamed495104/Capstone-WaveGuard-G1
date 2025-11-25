import express from 'express';
import multer from 'multer';
import {
    getChallenges,
    getChallengeStats,
    getChallengeById,
    joinChallenge,
    leaveChallenge,
    getJoinedChallenges,
    createChallenge,
    uploadBanner,
    deleteChallenge,
} from '../controllers/challengeController.js';

import { verifyAuth } from '../middleware/authMiddleware.js';
import { ensureUserExists } from '../middleware/userMiddleware.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Configure multer for banner image uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Public routes that anyone can access - add rate limiting to prevent abuse
router.get('/', rateLimiter, getChallenges);
router.get('/stats', rateLimiter, getChallengeStats);

// Protected routes - require authentication
// Upload banner (must come before /:id to avoid route conflict)
router.post('/upload-banner', verifyAuth, ensureUserExists, upload.single('image'), uploadBanner);

// Create challenge
router.post('/', verifyAuth, ensureUserExists, createChallenge);

// Get joined challenges (must come before /:id to avoid route conflict)
router.get('/joined', verifyAuth, ensureUserExists, getJoinedChallenges);

// Get single challenge by ID - add rate limiting
router.get('/:id', rateLimiter, getChallengeById);

// Join a challenge - already has auth which provides rate limiting
router.post('/:id/join', verifyAuth, ensureUserExists, joinChallenge);

// Leave a challenge - already has auth which provides rate limiting
router.post('/:id/leave', verifyAuth, ensureUserExists, leaveChallenge);

// Delete a challenge (only creator can delete)
router.delete('/:id', verifyAuth, ensureUserExists, deleteChallenge);

export default router;