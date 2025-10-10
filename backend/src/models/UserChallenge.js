import mongoose from "mongoose";

const userChallengeSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        challenge: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
        itemsCollected: { type: Number, default: 0 },
        impactScore: { type: Number, default: 0 },
        rank: { type: Number, default: 0 },
        joinedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("UserChallenge", userChallengeSchema);
