import mongoose from "mongoose";

const leaderboardSchema = new mongoose.Schema(
    {
        challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        totalItems: { type: Number, default: 0 },
        impactScore: { type: Number, default: 0 },
        rank: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model("Leaderboard", leaderboardSchema);
