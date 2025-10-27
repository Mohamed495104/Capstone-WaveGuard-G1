import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        description: String,
        bannerImage: String,
        startDate: Date,
        endDate: Date,
        status: { type: String, enum: ["active", "completed", "upcoming"], default: "active" },

        // --- NEW & UPDATED FIELDS ---
        locationName: { type: String, required: true },
        province: { type: String, required: true },
        goal: { type: Number, required: true },
        goalUnit: { type: String, default: "items" },
        // --- END ---

        // Geo location
        location: {
            type: { type: String, enum: ["Point"], default: "Point" },
            coordinates: { type: [Number], required: true }, // [long, lat]
        },

        totalTrashCollected: { type: Number, default: 0 },
        totalVolunteers: { type: Number, default: 0 },

        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

challengeSchema.index({ location: "2dsphere" });

export default mongoose.model("Challenge", challengeSchema);