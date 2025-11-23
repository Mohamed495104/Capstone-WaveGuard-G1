import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './api/index.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

// Only allow trusted frontend origins for CORS
app.use(
    cors({
        origin: ["http://localhost:3000", process.env.FRONTEND_URL].filter(Boolean),
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true, // Required for cookies
    })
);
app.use(express.json());
app.use(cookieParser()); // Parse cookies for session authentication

// Apply rate limiting to all API routes (100 requests/min)
app.use('/api', apiRateLimiter);

// Register all API routes
app.use('/api', routes);

// Error handling middleware (must be last)
app.use(errorMiddleware);

export default app;