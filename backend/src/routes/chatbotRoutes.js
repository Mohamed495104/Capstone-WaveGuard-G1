import express from "express";
import { chat, getSuggestions, clearCache } from "../controllers/chatbotController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { chatbotRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Chatbot endpoints with explicit rate limiting
// Note: chatbotRateLimiter (10 msg/min) is applied BEFORE verifyFirebaseToken in the middleware chain
// This ensures rate limiting happens before authentication, preventing abuse
router.post("/chat", chatbotRateLimiter, verifyFirebaseToken, chat);              // POST /api/chatbot/chat - Main chat endpoint
router.get("/suggestions", getSuggestions);                                        // GET /api/chatbot/suggestions - Get quick replies (public endpoint)
router.post("/clear-cache", chatbotRateLimiter, verifyFirebaseToken, clearCache); // POST /api/chatbot/clear-cache - Clear response cache (admin only)

export default router;
