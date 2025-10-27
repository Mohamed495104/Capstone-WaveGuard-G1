import Challenge from "../models/Challenge.js";

// @desc    Fetch all challenges
export const getChallenges = async (req, res) => {
    try {
        const challenges = await Challenge.find({}).sort({ startDate: 1 });
        res.json(challenges);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// @desc    Get aggregated stats for the challenges page
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