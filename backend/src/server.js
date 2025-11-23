import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initializeAI } from "./services/aiService.js";

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.status(200).send("Server is running 🚀");
});

// Health check endpoint for monitoring services (Railway, Render, uptime monitors)
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development"
    });
});


// Wrap the server start in an async function to load the AI model first
async function startServer() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Load AI Model into memory
        await initializeAI();

        // Start the server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT} and AI is ready!`);
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

startServer();


