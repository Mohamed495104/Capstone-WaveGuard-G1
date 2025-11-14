import express from "express";
import { chat, getSuggestions, clearCache } from "../controllers/chatbotController.js";
import { verifyFirebaseToken } from "../middleware/authMiddleware.js";
import { chatbotRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// Apply chatbot-specific rate limiting (10 messages/min)
router.use(chatbotRateLimiter);

// Chatbot endpoints
router.post("/chat", verifyFirebaseToken, chat);              // POST /api/chatbot/chat - Main chat endpoint
router.get("/suggestions", getSuggestions);                    // GET /api/chatbot/suggestions - Get quick replies
router.post("/clear-cache", verifyFirebaseToken, clearCache);  // POST /api/chatbot/clear-cache - Clear response cache

export default router;
