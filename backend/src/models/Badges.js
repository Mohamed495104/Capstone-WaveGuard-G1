import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: String,
        icon: String,
        criteria: {
            type: String,
            enum: ["items_collected", "challenges_completed", "impact_score"],
        },
        threshold: { type: Number, required: true }, // e.g. 100 items for Bronze
    },
    { timestamps: true }
);

export default mongoose.model("Badge", badgeSchema);
