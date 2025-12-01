/**
 * Support Controller
 * Handles contact form submissions and support requests
 */

import SupportRequest from "../models/SupportRequest.js";

// Category validation mapping
const VALID_CATEGORIES = ["general", "technical", "account", "challenge", "feedback", "partnership", "other"];

/**
 * Submit a new support/contact request
 * @route POST /api/support/contact
 * @access Public
 */
export const submitSupportRequest = async (req, res) => {
    try {
        const { name, email, category, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !category || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required: name, email, category, subject, message"
            });
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address"
            });
        }

        // Validate category
        if (!VALID_CATEGORIES.includes(category)) {
            return res.status(400).json({
                success: false,
                message: `Invalid category. Valid options are: ${VALID_CATEGORIES.join(", ")}`
            });
        }

        // Validate field lengths
        if (name.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Name cannot exceed 100 characters"
            });
        }

        if (subject.length > 200) {
            return res.status(400).json({
                success: false,
                message: "Subject cannot exceed 200 characters"
            });
        }

        if (message.length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Message cannot exceed 5000 characters"
            });
        }

        // Determine priority based on category
        let priority = "medium";
        if (category === "technical" || category === "account") {
            priority = "high";
        } else if (category === "feedback" || category === "other") {
            priority = "low";
        }

        // Create new support request
        const supportRequest = new SupportRequest({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            category,
            subject: subject.trim(),
            message: message.trim(),
            priority,
            status: "pending"
        });

        await supportRequest.save();

        console.log(`[Support] New request submitted: ${supportRequest._id} - ${category} - ${email}`);

        res.status(201).json({
            success: true,
            message: "Your message has been submitted successfully. We'll get back to you within 24-48 hours.",
            data: {
                ticketId: supportRequest._id,
                category: supportRequest.categoryDisplayName,
                submittedAt: supportRequest.createdAt
            }
        });

    } catch (error) {
        console.error("[Support] Error submitting request:", error);
        
        // Handle validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(". ")
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to submit your request. Please try again later."
        });
    }
};

/**
 * Get all support requests (Admin only - for future use)
 * @route GET /api/support/requests
 * @access Admin
 */
export const getSupportRequests = async (req, res) => {
    try {
        const { status, category, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (category) filter.category = category;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [requests, total] = await Promise.all([
            SupportRequest.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .lean(),
            SupportRequest.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: requests,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error("[Support] Error fetching requests:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch support requests"
        });
    }
};

/**
 * Update support request status (Admin only - for future use)
 * @route PATCH /api/support/requests/:id
 * @access Admin
 */
export const updateSupportRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes, respondedBy } = req.body;

        const updateData = {};
        if (status) updateData.status = status;
        if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
        if (respondedBy) {
            updateData.respondedBy = respondedBy;
            updateData.respondedAt = new Date();
        }

        const request = await SupportRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Support request not found"
            });
        }

        res.json({
            success: true,
            message: "Support request updated successfully",
            data: request
        });

    } catch (error) {
        console.error("[Support] Error updating request:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update support request"
        });
    }
};
