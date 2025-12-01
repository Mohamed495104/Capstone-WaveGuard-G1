/**
 * Support Routes
 * Handles contact form and support request endpoints
 */

import express from "express";
import {
    submitSupportRequest,
    getSupportRequests,
    updateSupportRequest
} from "../controllers/supportController.js";

const router = express.Router();

// Public route - submit contact form
router.post("/contact", submitSupportRequest);

// Admin routes (can add authentication middleware later)
router.get("/requests", getSupportRequests);
router.patch("/requests/:id", updateSupportRequest);

export default router;
