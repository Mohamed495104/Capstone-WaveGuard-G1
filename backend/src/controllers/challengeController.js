import Challenge from "../models/Challenge.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import { Readable } from "stream";
import { gridfsBucket } from "../config/db.js";
import { 
    validateLocation, 
    shouldBypassLocationCheck, 
    isLocationVerificationEnabled,
    getMaxAllowedDistance 
} from "../utils/locationUtils.js";

// Helper function to determine challenge status based on dates
const getChallengeStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) {
        return 'upcoming';
    } else if (now >= start && now <= end) {
        return 'active';
    } else {
        return 'completed';
    }
};

// Helper function to update challenge statuses based on current date
const updateChallengeStatuses = async (challenges) => {
    return challenges.map(challenge => {
        const computedStatus = getChallengeStatus(challenge.startDate, challenge.endDate);
        // Return the challenge with computed status
        return {
            ...challenge.toObject(),
            status: computedStatus
        };
    });
};

// Fetch all challenges
export const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({}).sort({ startDate: 1 });
        
        // Update statuses based on current date
        const challengesWithStatus = await updateChallengeStatuses(challenges);
        
        res.json(challengesWithStatus);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Get aggregated stats for the challenges page
export const getChallengeStats = async (req, res) => {
    try {
        const totalChallenges = await Challenge.countDocuments();

        const activeVolunteersResult = await Challenge.aggregate([
            { $group: { _id: null, total: { $sum: "$totalVolunteers" } } }
        ]);

        const itemsCollectedResult = await Challenge.aggregate([
            { $group: { _id: null, total: { $sum: "$totalTrashCollected" } } }
        ]);

        const provincesResult = await Challenge.distinct("province");

        res.json({
            totalChallenges,
            activeVolunteers: activeVolunteersResult[0]?.total || 0,
            itemsCollected: itemsCollectedResult[0]?.total || 0,
            provinces: provincesResult.length || 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get single challenge by ID
// GET /api/challenges/:id
// access  Public
export const getChallengeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challenge ID" });
        }

        const challenge = await Challenge.findById(id).populate('createdBy', 'name email profileImage');
        
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        // Compute status based on dates
        const computedStatus = getChallengeStatus(challenge.startDate, challenge.endDate);
        const challengeWithStatus = {
            ...challenge.toObject(),
            status: computedStatus
        };

        res.json(challengeWithStatus);
    } catch (error) {
        console.error("Error fetching challenge:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Join a challenge
// POST /api/challenges/:id/join
// Private
export const joinChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const { location } = req.body; // { latitude, longitude }
        const userId = req.mongoUser._id;
        const userEmail = req.mongoUser.email;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challenge ID" });
        }

        // Check if challenge exists
        const challenge = await Challenge.findById(id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }
        
        // Compute the real-time status
        const computedStatus = getChallengeStatus(challenge.startDate, challenge.endDate);
        
        // Prevent joining completed challenges
        if (computedStatus === 'completed') {
            return res.status(400).json({ message: "Cannot join a completed challenge" });
        }

        // Location verification (before checking if already joined)
        if (isLocationVerificationEnabled() && !shouldBypassLocationCheck(userEmail)) {
            if (!location || typeof location.latitude !== 'number' || typeof location.longitude !== 'number') {
                return res.status(400).json({ 
                    message: "Location is required to join this challenge",
                    error: "LOCATION_REQUIRED"
                });
            }

            const maxDistance = getMaxAllowedDistance();
            const validation = validateLocation(location, challenge.location, maxDistance);
            
            if (!validation.isValid) {
                return res.status(403).json({ 
                    message: validation.message,
                    distance: validation.distance,
                    maxDistance: maxDistance,
                    error: "LOCATION_TOO_FAR"
                });
            }

            console.log(`[Location] User ${userEmail} verified for challenge ${id}: ${validation.message}`);
        }

        // Use atomic operation to check and add in one step (prevents race condition)
        const userUpdateResult = await User.findOneAndUpdate(
            { 
                _id: userId,
                joinedChallenges: { $ne: id } // Only update if not already joined
            },
            {
                $addToSet: { joinedChallenges: id },
                $inc: { totalChallenges: 1 }
            },
            { new: true }
        );

        // If no document was modified, user already joined
        if (!userUpdateResult) {
            return res.status(400).json({ message: "Already joined this challenge" });
        }

        // Increment challenge volunteer count
        const updatedChallenge = await Challenge.findByIdAndUpdate(
            id,
            { $inc: { totalVolunteers: 1 } },
            { new: true }
        );

        res.json({
            message: "Joined successfully",
            challenge: {
                ...updatedChallenge.toObject(),
                status: computedStatus
            }
        });
    } catch (error) {
        console.error("Error joining challenge:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Leave a challenge
// @route   POST /api/challenges/:id/leave
// @access  Private
export const leaveChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.mongoUser._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challenge ID" });
        }

        // Check if challenge exists
        const challenge = await Challenge.findById(id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        // Use atomic operation to check and remove in one step (prevents race condition)
        const userUpdateResult = await User.findOneAndUpdate(
            { 
                _id: userId,
                joinedChallenges: id // Only update if challenge is in the array
            },
            {
                $pull: { joinedChallenges: id },
                $inc: { totalChallenges: -1 }
            },
            { new: true }
        );

        // If no document was modified, user hasn't joined
        if (!userUpdateResult) {
            return res.status(400).json({ message: "You haven't joined this challenge" });
        }

        // Decrement challenge volunteer count atomically (ensure it doesn't go below 0)
        const updatedChallenge = await Challenge.findByIdAndUpdate(
            id,
            { $inc: { totalVolunteers: -1 } },
            { new: true }
        );

        // Ensure volunteer count doesn't go negative (safety check)
        if (updatedChallenge.totalVolunteers < 0) {
            await Challenge.findByIdAndUpdate(id, { totalVolunteers: 0 });
            updatedChallenge.totalVolunteers = 0;
        }

        res.json({
            message: "Left successfully",
            challenge: updatedChallenge
        });
    } catch (error) {
        console.error("Error leaving challenge:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get user's joined challenges
// @route   GET /api/challenges/joined
// @access  Private
export const getJoinedChallenges = async (req, res) => {
    try {
        const userId = req.mongoUser._id;
        const { status } = req.query;

        const user = await User.findById(userId).populate('joinedChallenges');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let joinedChallenges = user.joinedChallenges;
        
        // Update statuses based on current date
        joinedChallenges = joinedChallenges.map(challenge => ({
            ...challenge.toObject(),
            status: getChallengeStatus(challenge.startDate, challenge.endDate)
        }));

        // Filter by status if provided
        if (status && ['active', 'upcoming', 'completed'].includes(status.toLowerCase())) {
            joinedChallenges = joinedChallenges.filter(
                challenge => challenge.status.toLowerCase() === status.toLowerCase()
            );
        }

        res.json(joinedChallenges);
    } catch (error) {
        console.error("Error fetching joined challenges:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Create a new challenge
// @route   POST /api/challenges
// @access  Private (authenticated users)
export const createChallenge = async (req, res) => {
    try {
        const {
            title,
            description,
            locationName,
            province,
            region,
            goal,
            startDate,
            endDate,
            latitude,
            longitude,
            bannerImage,
            goalUnit = "items"
        } = req.body;

        // Validate required fields
        if (!title || !locationName || !province || !goal || !startDate || !endDate || !latitude || !longitude) {
            return res.status(400).json({ 
                message: "Missing required fields: title, locationName, province, goal, startDate, endDate, latitude, longitude" 
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
            return res.status(400).json({ 
                message: "End date must be after start date" 
            });
        }

        // Location verification for challenge creation
        // Only verify if location verification is enabled
        if (isLocationVerificationEnabled()) {
            // Check if user should bypass location check
            const userEmail = req.user?.email || req.mongoUser?.email;
            const shouldBypass = shouldBypassLocationCheck(userEmail);

            if (!shouldBypass) {
                // User provided location for the challenge center
                const challengeLocation = {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                };

                // Get user's current location from request body (if provided)
                const { userLatitude, userLongitude } = req.body;
                
                if (userLatitude && userLongitude) {
                    const userLocation = {
                        latitude: parseFloat(userLatitude),
                        longitude: parseFloat(userLongitude)
                    };

                    // Validate user is near the challenge location
                    const userLocationObj = {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude
                    };
                    
                    const challengeLocationObj = {
                        coordinates: [challengeLocation.longitude, challengeLocation.latitude] // GeoJSON format [lng, lat]
                    };
                    
                    const validation = validateLocation(
                        userLocationObj,
                        challengeLocationObj,
                        getMaxAllowedDistance()
                    );

                    if (!validation.isValid) {
                        const maxDistance = getMaxAllowedDistance();
                        return res.status(403).json({ 
                            message: `You must be within ${maxDistance}km of the challenge location to create a challenge. You are ${validation.distance}km away.` 
                        });
                    }
                }
            }
        }

        // Determine initial status based on start date
        const now = new Date();
        let status = 'active';
        if (start > now) {
            status = 'upcoming';
        } else if (end < now) {
            status = 'completed';
        }

        // Create new challenge
        const newChallenge = new Challenge({
            title,
            description,
            locationName,
            province,
            region,
            goal: parseInt(goal, 10),
            goalUnit,
            startDate: start,
            endDate: end,
            status,
            location: {
                type: "Point",
                coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            bannerImage: bannerImage || "",
            totalTrashCollected: 0,
            totalVolunteers: 0,
            createdBy: req.mongoUser?._id
        });

        await newChallenge.save();

        res.status(201).json({
            message: "Challenge created successfully",
            challenge: newChallenge
        });
    } catch (error) {
        console.error("Error creating challenge:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
// Helper function to upload image to GridFS
function uploadImageToGridFS(buffer, filename) {
    if (!gridfsBucket) {
        throw new Error("GridFS bucket not initialized");
    }
    return new Promise((resolve, reject) => {
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);

        const uploadStream = gridfsBucket.openUploadStream(filename, {
            contentType: 'image/jpeg'
        });

        readable.pipe(uploadStream);

        uploadStream.on('finish', () => {
            resolve(uploadStream.id.toString());
        });

        uploadStream.on('error', (error) => {
            reject(error);
        });
    });
}

// @desc    Upload challenge banner image
// @route   POST /api/challenges/upload-banner
// @access  Private (authenticated users)
export const uploadBanner = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No image file provided" });
        }

        const { buffer, originalname } = req.file;
        
        // Upload to GridFS
        const fileId = await uploadImageToGridFS(buffer, originalname || "challenge-banner.jpg");
        
        // Return the image ID
        res.status(200).json({
            message: "Banner uploaded successfully",
            bannerImage: `/api/images/${fileId}`
        });
    } catch (error) {
        console.error("Error uploading banner:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
