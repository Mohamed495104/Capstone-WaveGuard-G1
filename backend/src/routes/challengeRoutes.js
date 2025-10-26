import express from "express";
import { getChallenges, getChallengeStats } from "../controllers/challengeController.js";
import { protect } from "../middleware/authMiddleware.js"; // Assuming you have this

const router = express.Router();
router.get("/", getChallenges);
router.get("/stats", getChallengeStats);

export default router;