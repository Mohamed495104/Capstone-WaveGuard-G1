import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import routes from './api/index.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';

dotenv.config();

const app = express();

// Build array of allowed origins, removing duplicates and empty values
const allowedOrigins = [
    "http://localhost:3000",
    "https://capstone-marinecare.vercel.app",
    process.env.FRONTEND_URL,
].filter(Boolean); // Remove undefined/null values

// Remove duplicates
const uniqueOrigins = [...new Set(allowedOrigins)];

console.log("🔒 CORS allowed origins:", uniqueOrigins);

// Only allow trusted frontend origins for CORS
app.use(
    cors({
        origin: uniqueOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true, // Required for cookies
        allowedHeaders: ["Content-Type", "Authorization"],
        exposedHeaders: ["Set-Cookie"],
    })
);
app.use(express.json());
app.use(cookieParser()); // Parse cookies for session authentication

app.use('/api', routes);
app.use(errorMiddleware);

export default app;
