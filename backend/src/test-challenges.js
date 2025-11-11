import mongoose from "mongoose";
import dotenv from "dotenv";
import Challenge from "./models/Challenge.js";

dotenv.config();

const getChallengeStatus = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    console.log("  Current time (UTC):", now.toISOString());
    console.log("  Start date (UTC):", start.toISOString());
    console.log("  End date (UTC):", end.toISOString());
    console.log("  now < start:", now < start);
    console.log("  now >= start && now <= end:", now >= start && now <= end);
    console.log("  now > end:", now > end);
    
    if (now < start) {
        return 'upcoming';
    } else if (now >= start && now <= end) {
        return 'active';
    } else {
        return 'completed';
    }
};

async function testChallenges() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected\n");

        const challenges = await Challenge.find({}).sort({ startDate: 1 });
        console.log(`Found ${challenges.length} challenges\n`);

        let activeCount = 0;
        let upcomingCount = 0;
        let completedCount = 0;

        for (const challenge of challenges) {
            const computedStatus = getChallengeStatus(challenge.startDate, challenge.endDate);
            console.log(`\n=== ${challenge.title} ===`);
            console.log(`  Stored Status: ${challenge.status}`);
            console.log(`  Computed Status: ${computedStatus}`);
            
            if (computedStatus === 'active') activeCount++;
            else if (computedStatus === 'upcoming') upcomingCount++;
            else completedCount++;
        }

        console.log("\n\n=== SUMMARY ===");
        console.log(`Active: ${activeCount}`);
        console.log(`Upcoming: ${upcomingCount}`);
        console.log(`Completed: ${completedCount}`);

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.connection.close();
        console.log("\n👋 Database connection closed");
    }
}

testChallenges();
