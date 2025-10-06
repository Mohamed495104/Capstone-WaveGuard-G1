import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        participants: [{ type: String }], // Firebase UIDs
        totalCollected: {
            plastic: { type: Number, default: 0 },
            cans: { type: Number, default: 0 },
            cigaretteButts: { type: Number, default: 0 },
            other: { type: Number, default: 0 }
        }
    },
    { timestamps: true }
);

export default mongoose.model("Challenge", challengeSchema);
