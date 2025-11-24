import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firebaseUid: { type: String, required: true, unique: true },
        name: { type: String },
        email: { type: String, required: true, unique: true },
        profileImage: String,

        // Basic info
        location: { type: String, default: "" },
        bio: { type: String, default: "" },

        // Address details (for profile location with autocomplete)
        address: {
            fullAddress: { type: String, default: "" },      // Full formatted address
            streetAddress: { type: String, default: "" },    // House no, street
            city: { type: String, default: "" },             // City/Town
            province: { type: String, default: "" },         // Province
            postalCode: { type: String, default: "" },       // Postal code
            country: { type: String, default: "Canada" },    // Country
            coordinates: {                                    // GeoJSON coordinates
                latitude: { type: Number },
                longitude: { type: Number }
            }
        },

        // Live stats
        totalItemsCollected: { type: Number, default: 0 },
        totalCleanups: { type: Number, default: 0 },
        totalChallenges: { type: Number, default: 0 },
        impactScore: { type: Number, default: 0 },

        // Relations
        joinedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
