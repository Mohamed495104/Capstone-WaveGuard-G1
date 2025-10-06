import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        uid: { type: String, required: true, unique: true }, // Firebase UID
        name: { type: String, default: "Anonymous" },
        email: { type: String, required: true, unique: true },
        badges: [{ type: String }],
        stats: {
            plastic: { type: Number, default: 0 },
            cans: { type: Number, default: 0 },
            cigaretteButts: { type: Number, default: 0 },
            other: { type: Number, default: 0 },
            totalCleanups: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
