import mongoose from "mongoose";

const cleanupSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true }, // Firebase UID reference
        image: { type: String, required: true },  // base64 encoded image
        aiResult: { type: String },               // classification result
        location: { type: String },
        challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge" },
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export default mongoose.model("Cleanup", cleanupSchema);
