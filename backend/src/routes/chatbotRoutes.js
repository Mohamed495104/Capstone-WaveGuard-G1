import express from "express";
import { chat, getSuggestions, clearCache } from "../controllers/chatbotController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { chatbotRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Chatbot endpoints with rate limiting applied to each route
router.post("/chat", chatbotRateLimiter, verifyFirebaseToken, chat);              // POST /api/chatbot/chat - Main chat endpoint
router.get("/suggestions", getSuggestions);                                        // GET /api/chatbot/suggestions - Get quick replies (no rate limit needed)
router.post("/clear-cache", chatbotRateLimiter, verifyFirebaseToken, clearCache); // POST /api/chatbot/clear-cache - Clear response cache

export default router;
