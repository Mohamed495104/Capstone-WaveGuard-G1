import app from './app.js';
import connectDB from './config/db.js';
<<<<<<< HEAD

const PORT = process.env.PORT || 5000;

=======
import challengeRoutes from "./routes/challengeRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"; // <-- Import profile routes
import logTokenRoutes from "./routes/logTokenRoutes.js";

const PORT = process.env.PORT || 5000;

app.use("/api/challenges", challengeRoutes);
<<<<<<< HEAD
>>>>>>> main
=======
app.use("/api/profile", profileRoutes);
app.use("/api/log-token", logTokenRoutes);
>>>>>>> main
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});