import Challenge from "../models/Challenge.js";
import User from "../models/User.js";
import mongoose from "mongoose";

import {
    validateLocation,
    shouldBypassLocationCheck,
    isLocationVerificationEnabled,
    getMaxAllowedDistance
} from "../utils/locationUtils.js";

import { uploadImageToGridFS } from "../utils/gridfsUpload.js";

// ---------------------- STATUS UTILS ----------------------

const getChallengeStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return "upcoming";
    if (now >= start && now <= end) return "active";
    return "completed";
};

const updateChallengeStatuses = (challenges) => {
    return challenges.map((challenge) => ({
        ...challenge.toObject(),
        status: getChallengeStatus(challenge.startDate, challenge.endDate),
    }));
};

// ---------------------- CREATE CHALLENGE ----------------------

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
      bannerImage,
      location,
    } = req.body;

    if (!title || !locationName || !province || !region || !goal || !startDate || !endDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Pick banner from uploaded file OR from bannerImage URL
    let finalBannerImage = bannerImage || null;

    if (req.file && req.file.buffer) {
      const fileId = await uploadImageToGridFS(
        req.file.buffer,
        req.file.originalname || `challenge-${Date.now()}.jpg`
      );
      finalBannerImage = `/api/images/${fileId}`;
    }

    if (!finalBannerImage) {
      return res.status(400).json({ message: "Banner image missing" });
    }

    if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
      return res.status(400).json({ message: "Invalid location coordinates" });
    }

    const status = getChallengeStatus(startDate, endDate);

    const challenge = new Challenge({
      title,
      description,
      locationName,
      province,
      region,
      bannerImage: finalBannerImage,
      goal,
      goalUnit: "items",
      startDate,
      endDate,
      status,
      totalTrashCollected: 0,
      totalVolunteers: 0,
      wasteBreakdown: {},
      location,
      createdBy: req.mongoUser?._id || null,
    });

    await challenge.save();

    return res.json({
      message: "Challenge created successfully",
      challenge,
    });

  } catch (error) {
    console.error("Error creating challenge:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// ---------------------- GET ALL CHALLENGES ----------------------

export const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({}).sort({ startDate: 1 });
        res.json(updateChallengeStatuses(challenges));
    } catch (error) {
        console.error("Error fetching challenges:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ---------------------- GET CHALLENGE STATS ----------------------

export const getChallengeStats = async (req, res) => {
    try {
        const totalChallenges = await Challenge.countDocuments();

        const activeVolunteersResult = await Challenge.aggregate([
            { $group: { _id: null, total: { $sum: "$totalVolunteers" } } },
        ]);

        const itemsCollectedResult = await Challenge.aggregate([
            { $group: { _id: null, total: { $sum: "$totalTrashCollected" } } },
        ]);

        const provincesResult = await Challenge.distinct("province");

        res.json({
            totalChallenges,
            activeVolunteers: activeVolunteersResult[0]?.total || 0,
            itemsCollected: itemsCollectedResult[0]?.total || 0,
            provinces: provincesResult.length || 0,
        });

    } catch (error) {
        console.error("Error getting stats:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ---------------------- GET SINGLE CHALLENGE ----------------------

export const getChallengeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challenge ID" });
        }

        const challenge = await Challenge.findById(id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        res.json({
            ...challenge.toObject(),
            status: getChallengeStatus(challenge.startDate, challenge.endDate),
        });

    } catch (error) {
        console.error("Error fetching challenge:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ---------------------- JOIN CHALLENGE ----------------------

export const joinChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const { location } = req.body;
        const userId = req.mongoUser._id;
        const userEmail = req.mongoUser.email;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challenge ID" });
        }

        const challenge = await Challenge.findById(id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        const computedStatus = getChallengeStatus(challenge.startDate, challenge.endDate);
        if (computedStatus === "completed") {
            return res.status(400).json({ message: "Cannot join a completed challenge" });
        }

        const user = await User.findById(userId);
        if (user.joinedChallenges.includes(id)) {
            return res.status(400).json({ message: "Already joined this challenge" });
        }

        // Location verification logic
        if (isLocationVerificationEnabled() && !shouldBypassLocationCheck(userEmail)) {

            if (!location || typeof location.latitude !== "number" || typeof location.longitude !== "number") {
                return res.status(400).json({
                    message: "Location is required to join this challenge",
                    error: "LOCATION_REQUIRED",
                });
            }

            const maxDistance = getMaxAllowedDistance();
            const validation = validateLocation(location, challenge.location, maxDistance);

            if (!validation.isValid) {
                return res.status(403).json({
                    message: validation.message,
                    distance: validation.distance,
                    maxDistance,
                    error: "LOCATION_TOO_FAR",
                });
            }
        }

        // Update user + challenge
        await User.findByIdAndUpdate(userId, {
            $addToSet: { joinedChallenges: id },
            $inc: { totalChallenges: 1 },
        });

        const updatedChallenge = await Challenge.findByIdAndUpdate(
            id,
            { $inc: { totalVolunteers: 1 } },
            { new: true }
        );

        res.json({
            message: "Joined successfully",
            challenge: {
                ...updatedChallenge.toObject(),
                status: computedStatus,
            },
        });

    } catch (error) {
        console.error("Error joining challenge:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ---------------------- LEAVE CHALLENGE ----------------------

export const leaveChallenge = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.mongoUser._id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid challenge ID" });
        }

        const challenge = await Challenge.findById(id);
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found" });
        }

        const user = await User.findById(userId);
        if (!user.joinedChallenges.includes(id)) {
            return res.status(400).json({ message: "You haven't joined this challenge" });
        }

        await User.findByIdAndUpdate(userId, {
            $pull: { joinedChallenges: id },
            $inc: { totalChallenges: -1 },
        });

        const updatedChallenge = await Challenge.findByIdAndUpdate(
            id,
            { $inc: { totalVolunteers: -1 } },
            { new: true }
        );

        res.json({
            message: "Left successfully",
            challenge: updatedChallenge,
        });

    } catch (error) {
        console.error("Error leaving challenge:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ---------------------- GET JOINED CHALLENGES ----------------------

export const getJoinedChallenges = async (req, res) => {
    try {
        const userId = req.mongoUser._id;
        const { status } = req.query;

        const user = await User.findById(userId).populate("joinedChallenges");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let joined = user.joinedChallenges.map((challenge) => ({
            ...challenge.toObject(),
            status: getChallengeStatus(challenge.startDate, challenge.endDate),
        }));

        if (status && ["active", "upcoming", "completed"].includes(status.toLowerCase())) {
            joined = joined.filter((c) => c.status.toLowerCase() === status.toLowerCase());
        }

        res.json(joined);

    } catch (error) {
        console.error("Error fetching joined challenges:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
