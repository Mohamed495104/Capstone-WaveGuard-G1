import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
    {
        totalTrashCollected: { type: Number, default: 0 },
        activeVolunteers: { type: Number, default: 0 },
        activeChallenges: { type: Number, default: 0 },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.model("Analytics", analyticsSchema);
