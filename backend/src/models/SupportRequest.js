import mongoose from "mongoose";

const supportRequestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            maxlength: [100, "Name cannot exceed 100 characters"]
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"]
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: {
                values: ["general", "technical", "account", "challenge", "feedback", "partnership", "other"],
                message: "Invalid category selected"
            }
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
            maxlength: [200, "Subject cannot exceed 200 characters"]
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
            maxlength: [5000, "Message cannot exceed 5000 characters"]
        },
        status: {
            type: String,
            enum: ["pending", "in_progress", "resolved", "closed"],
            default: "pending"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium"
        },
        // Optional: Track if user was logged in
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false
        },
        // Admin notes (for internal use)
        adminNotes: {
            type: String,
            default: ""
        },
        // Track response
        respondedAt: {
            type: Date
        },
        respondedBy: {
            type: String
        }
    },
    { 
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// Index for faster queries
supportRequestSchema.index({ email: 1, createdAt: -1 });
supportRequestSchema.index({ status: 1, createdAt: -1 });
supportRequestSchema.index({ category: 1 });

// Virtual for display category name
supportRequestSchema.virtual("categoryDisplayName").get(function() {
    const categoryNames = {
        general: "General Inquiry",
        technical: "Technical Support",
        account: "Account Help",
        challenge: "Challenge Related",
        feedback: "Feedback & Suggestions",
        partnership: "Partnership Inquiry",
        other: "Other"
    };
    return categoryNames[this.category] || this.category;
});

export default mongoose.model("SupportRequest", supportRequestSchema);
