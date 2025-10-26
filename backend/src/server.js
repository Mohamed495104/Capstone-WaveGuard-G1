import app from './app.js';
import connectDB from './config/db.js';
import challengeRoutes from "./routes/challengeRoutes.js";
const PORT = process.env.PORT || 5000;

app.use("/api/challenges", challengeRoutes);
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
