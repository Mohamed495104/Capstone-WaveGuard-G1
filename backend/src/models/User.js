import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: { type: String, required: true, unique: true },
        name: String,
        email: { type: String, required: true, unique: true },
        profileImage: String,

        // New fields
        location: { type: String, default: "" },
        bio: { type: String, default: "" },

        // Stats
        totalItemsCollected: { type: Number, default: 0 },
        totalChallenges: { type: Number, default: 0 },
        impactScore: { type: Number, default: 0 },

        // Relations
        badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
        joinedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserChallenge" }],
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);