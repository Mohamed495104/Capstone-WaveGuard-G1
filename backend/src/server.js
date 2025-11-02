import app from './app.js';
import connectDB from './config/db.js';

// Import route files
import challengeRoutes from "./routes/challengeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";


const PORT = process.env.PORT || 5000;

// Register routes
app.use("/api/challenges", challengeRoutes);
app.use("/api/profile", profileRoutes);


// Connect to DB and start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
