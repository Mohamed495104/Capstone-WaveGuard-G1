import { HfInference } from '@huggingface/inference';
import Challenge from '../models/Challenge.js';
import User from '../models/User.js';
import Achievement from '../models/Achievement.js';

// Initialize Hugging Face Inference client (no API key needed for public models)
const hf = new HfInference();

// Cache for storing responses (simple in-memory cache)
const responseCache = new Map();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// Intent detection - determines what the user is asking about
function detectIntent(message) {
    const lower = message.toLowerCase();
    
    // Challenge-related queries
    if (lower.includes('challenge') || lower.includes('cleanup') || lower.includes('event')) {
        if (lower.includes('join') || lower.includes('participate')) {
            return 'challenge_join';
        }
        if (lower.includes('when') || lower.includes('date') || lower.includes('time')) {
            return 'challenge_dates';
        }
        if (lower.includes('where') || lower.includes('location') || lower.includes('province')) {
            return 'challenge_location';
        }
        return 'challenge_info';
    }
    
    // User statistics and progress
    if (lower.includes('stat') || lower.includes('progress') || lower.includes('my') || 
        lower.includes('how many') || lower.includes('collected')) {
        return 'user_stats';
    }
    
    // Achievement queries
    if (lower.includes('achievement') || lower.includes('badge') || lower.includes('unlock') ||
        lower.includes('reward')) {
        return 'achievements';
    }
    
    // Leaderboard queries
    if (lower.includes('rank') || lower.includes('leaderboard') || lower.includes('top') ||
        lower.includes('leader')) {
        return 'leaderboard';
    }
    
    // Location-based queries
    if (lower.includes('near me') || lower.includes('nearby') || lower.includes('close') ||
        lower.includes('around')) {
        return 'location_query';
    }
    
    // How-to questions
    if (lower.includes('how') || lower.includes('upload') || lower.includes('photo') ||
        lower.includes('picture') || lower.includes('submit')) {
        return 'how_to';
    }
    
    // Waste/trash information
    if (lower.includes('waste') || lower.includes('trash') || lower.includes('type') ||
        lower.includes('plastic') || lower.includes('bottle')) {
        return 'waste_info';
    }
    
    // General greeting or unknown
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') ||
        lower.includes('help')) {
        return 'greeting';
    }
    
    return 'general';
}

// Build context based on intent and retrieve relevant data
async function buildContext(intent, userId, message) {
    try {
        switch(intent) {
            case 'challenge_info':
            case 'challenge_join':
            case 'challenge_dates':
            case 'challenge_location': {
                // Fetch active challenges
                const challenges = await Challenge.find({ status: 'active' })
                    .select('title description province locationName startDate endDate goal totalTrashCollected')
                    .limit(5)
                    .lean();
                
                // Check if user specified a province
                const provinceMatch = message.match(/\b(ON|BC|AB|QC|NS|NB|MB|SK|PE|NL|YT|NT|NU|Ontario|British Columbia|Alberta|Quebec|Nova Scotia|New Brunswick|Manitoba|Saskatchewan|Prince Edward Island|Newfoundland|Yukon|Northwest Territories|Nunavut)\b/i);
                
                if (provinceMatch && challenges.length > 0) {
                    const filteredChallenges = challenges.filter(c => 
                        c.province.toLowerCase().includes(provinceMatch[0].toLowerCase())
                    );
                    if (filteredChallenges.length > 0) {
                        return JSON.stringify({
                            challenges: filteredChallenges.map(c => ({
                                title: c.title,
                                location: `${c.locationName}, ${c.province}`,
                                startDate: c.startDate,
                                endDate: c.endDate,
                                progress: `${c.totalTrashCollected}/${c.goal}`,
                                percentComplete: Math.round((c.totalTrashCollected / c.goal) * 100)
                            }))
                        });
                    }
                }
                
                return JSON.stringify({
                    challenges: challenges.map(c => ({
                        title: c.title,
                        location: `${c.locationName}, ${c.province}`,
                        startDate: c.startDate,
                        endDate: c.endDate,
                        progress: `${c.totalTrashCollected}/${c.goal}`,
                        percentComplete: Math.round((c.totalTrashCollected / c.goal) * 100)
                    }))
                });
            }
            
            case 'user_stats': {
                if (!userId) {
                    return JSON.stringify({ error: 'User must be logged in to see stats' });
                }
                
                const user = await User.findOne({ firebaseUid: userId })
                    .select('totalItemsCollected totalCleanups totalChallenges impactScore name')
                    .lean();
                
                if (!user) {
                    return JSON.stringify({ error: 'User not found' });
                }
                
                return JSON.stringify({
                    userName: user.name || 'User',
                    itemsCollected: user.totalItemsCollected || 0,
                    cleanups: user.totalCleanups || 0,
                    challenges: user.totalChallenges || 0,
                    impactScore: user.impactScore || 0
                });
            }
            
            case 'achievements': {
                if (!userId) {
                    return JSON.stringify({ error: 'User must be logged in to see achievements' });
                }
                
                const user = await User.findOne({ firebaseUid: userId }).lean();
                if (!user) {
                    return JSON.stringify({ error: 'User not found' });
                }
                
                const achievements = await Achievement.find({ user: user._id })
                    .select('title description isUnlocked progress goal icon')
                    .limit(10)
                    .lean();
                
                const unlocked = achievements.filter(a => a.isUnlocked);
                const inProgress = achievements.filter(a => !a.isUnlocked).slice(0, 3);
                
                return JSON.stringify({
                    totalAchievements: achievements.length,
                    unlocked: unlocked.map(a => ({
                        title: a.title,
                        description: a.description,
                        icon: a.icon
                    })),
                    inProgress: inProgress.map(a => ({
                        title: a.title,
                        progress: a.progress,
                        goal: a.goal,
                        percentComplete: Math.round((a.progress / a.goal) * 100)
                    }))
                });
            }
            
            case 'location_query': {
                // For location queries, we need current challenges grouped by province
                const challenges = await Challenge.find({ status: 'active' })
                    .select('title province locationName')
                    .lean();
                
                const byProvince = challenges.reduce((acc, c) => {
                    if (!acc[c.province]) {
                        acc[c.province] = [];
                    }
                    acc[c.province].push({
                        title: c.title,
                        location: c.locationName
                    });
                    return acc;
                }, {});
                
                return JSON.stringify({ challengesByProvince: byProvince });
            }
            
            case 'how_to': {
                return JSON.stringify({
                    instructions: [
                        'Navigate to the Upload page',
                        'Select the challenge you are participating in',
                        'Take a photo or select one from your gallery',
                        'Our AI will automatically identify the waste types',
                        'Confirm the details and submit'
                    ],
                    note: 'Your cleanup will be counted towards your personal stats and the challenge goal'
                });
            }
            
            case 'waste_info': {
                return JSON.stringify({
                    wasteTypes: [
                        { type: 'plastic_bottle', name: 'Plastic Bottles', recyclable: true },
                        { type: 'metal_can', name: 'Metal Cans', recyclable: true },
                        { type: 'plastic_bag', name: 'Plastic Bags', recyclable: false },
                        { type: 'paper_cardboard', name: 'Paper & Cardboard', recyclable: true },
                        { type: 'cigarette_butt', name: 'Cigarette Butts', recyclable: false },
                        { type: 'glass_bottle', name: 'Glass Bottles', recyclable: true }
                    ],
                    note: 'Our AI can automatically identify these waste types from your photos'
                });
            }
            
            case 'greeting': {
                return JSON.stringify({
                    message: 'WaveGuard Assistant is here to help you with challenges, statistics, achievements, and more!'
                });
            }
            
            default: {
                return JSON.stringify({
                    generalInfo: 'WaveGuard is an AI-powered shoreline cleanup management app. You can join challenges, track your impact, and earn achievements.'
                });
            }
        }
    } catch (error) {
        console.error('Error building context:', error);
        return JSON.stringify({ error: 'Unable to retrieve information at this time' });
    }
}

// Generate a cache key for the request
function getCacheKey(message, userId) {
    // Normalize the message for caching
    const normalizedMessage = message.toLowerCase().trim();
    return `${userId || 'anonymous'}_${normalizedMessage}`;
}

// Main chat endpoint
export const chat = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user?.uid; // From Firebase auth middleware
        
        // Validate input
        if (!message || message.trim() === '') {
            return res.status(400).json({ 
                success: false, 
                message: 'Message is required' 
            });
        }
        
        // Check message length
        if (message.length > 500) {
            return res.status(400).json({ 
                success: false, 
                message: 'Message is too long. Please keep it under 500 characters.' 
            });
        }
        
        // Check cache
        const cacheKey = getCacheKey(message, userId);
        const cached = responseCache.get(cacheKey);
        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            return res.json({ 
                success: true, 
                answer: cached.answer,
                cached: true 
            });
        }
        
        // Detect user intent
        const intent = detectIntent(message);
        
        // Build context with relevant data
        const context = await buildContext(intent, userId, message);
        
        // For simple greetings, return a quick response without calling LLM
        if (intent === 'greeting') {
            const answer = "👋 Hello! I'm WaveGuard Assistant, your AI-powered helper for shoreline cleanup management.\n\n" +
                "I can help you with:\n" +
                "• 🌊 Finding active cleanup challenges\n" +
                "• 📊 Checking your progress and statistics\n" +
                "• 🏆 Tracking your achievements\n" +
                "• 📍 Locating cleanups near you\n" +
                "• 📸 Learning how to upload cleanup photos\n\n" +
                "What would you like to know?";
            
            // Cache the response
            responseCache.set(cacheKey, { answer, timestamp: Date.now() });
            
            return res.json({ 
                success: true, 
                answer 
            });
        }
        
        // Construct prompt for the LLM
        const systemPrompt = "You are WaveGuard Assistant, a helpful AI chatbot for a shoreline cleanup management app. " +
            "You help users find cleanup challenges, track their progress, and understand how the app works. " +
            "Be friendly, concise, and encouraging. Use emojis sparingly but appropriately. " +
            "If the context contains data, use it to provide accurate, specific answers. " +
            "Keep responses under 200 words.";
        
        const prompt = `${systemPrompt}\n\nContext Data: ${context}\n\nUser Question: ${message}\n\nProvide a helpful answer:`;
        
        // Call Hugging Face API with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
        
        try {
            const response = await hf.textGeneration({
                model: 'mistralai/Mistral-7B-Instruct-v0.2',
                inputs: prompt,
                parameters: {
                    max_new_tokens: 250,
                    temperature: 0.7,
                    top_p: 0.95,
                    return_full_text: false
                }
            }, { signal: controller.signal });
            
            clearTimeout(timeoutId);
            
            // Extract and clean the response
            let answer = response.generated_text || response;
            if (typeof answer !== 'string') {
                answer = JSON.stringify(answer);
            }
            
            // Clean up the response
            answer = answer.trim();
            
            // Cache the successful response
            responseCache.set(cacheKey, { answer, timestamp: Date.now() });
            
            res.json({ 
                success: true, 
                answer 
            });
            
        } catch (aiError) {
            clearTimeout(timeoutId);
            
            // If AI fails, provide a fallback response based on intent
            let fallbackAnswer = getFallbackResponse(intent, context);
            
            res.json({ 
                success: true, 
                answer: fallbackAnswer,
                fallback: true 
            });
        }
        
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Sorry, I encountered an error. Please try again.' 
        });
    }
};

// Fallback responses when AI is unavailable
function getFallbackResponse(intent, context) {
    try {
        const data = JSON.parse(context);
        
        switch(intent) {
            case 'challenge_info':
            case 'challenge_location':
                if (data.challenges && data.challenges.length > 0) {
                    const challengeList = data.challenges.map((c, i) => 
                        `${i + 1}. **${c.title}** in ${c.location}\n   Progress: ${c.percentComplete}% (${c.progress} items)`
                    ).join('\n\n');
                    return `🌊 Here are the active cleanup challenges:\n\n${challengeList}\n\nJoin any challenge to start making an impact!`;
                }
                return "🌊 There are currently no active challenges. Check back soon!";
                
            case 'user_stats':
                if (data.error) {
                    return "Please log in to view your personal statistics.";
                }
                return `📊 **Your Impact Summary:**\n\n` +
                    `• Items Collected: ${data.itemsCollected}\n` +
                    `• Cleanups Completed: ${data.cleanups}\n` +
                    `• Challenges Joined: ${data.challenges}\n` +
                    `• Impact Score: ${data.impactScore} points\n\n` +
                    `Keep up the great work! 🎉`;
                    
            case 'achievements':
                if (data.error) {
                    return "Please log in to view your achievements.";
                }
                const unlockedCount = data.unlocked?.length || 0;
                const achievementText = data.unlocked?.slice(0, 3).map(a => 
                    `${a.icon} ${a.title}`
                ).join('\n') || 'Start participating to unlock achievements!';
                return `🏆 **Your Achievements:**\n\nUnlocked: ${unlockedCount}\n\n${achievementText}\n\nKeep going to unlock more!`;
                
            case 'how_to':
                return "📸 **How to Upload a Cleanup Photo:**\n\n" +
                    "1. Go to the Upload page\n" +
                    "2. Select your challenge\n" +
                    "3. Take or select a photo\n" +
                    "4. Our AI identifies the waste automatically\n" +
                    "5. Confirm and submit!\n\n" +
                    "Your contribution counts towards your stats and the challenge goal.";
                    
            default:
                return "I'm here to help you with WaveGuard! You can ask me about:\n\n" +
                    "• Active cleanup challenges\n" +
                    "• Your personal statistics\n" +
                    "• Achievements and badges\n" +
                    "• How to use the app\n\n" +
                    "What would you like to know?";
        }
    } catch (error) {
        return "I'm having trouble processing that right now. Please try asking in a different way!";
    }
}

// Get quick reply suggestions
export const getSuggestions = async (req, res) => {
    try {
        const suggestions = [
            { text: "What challenges are available?", icon: "🌊" },
            { text: "Show my statistics", icon: "📊" },
            { text: "View my achievements", icon: "🏆" },
            { text: "How do I upload a photo?", icon: "📸" },
            { text: "Find cleanups near me", icon: "📍" }
        ];
        
        res.json({ 
            success: true, 
            suggestions 
        });
    } catch (error) {
        console.error('Error getting suggestions:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to get suggestions' 
        });
    }
};

// Clear cache endpoint (for admin/maintenance)
export const clearCache = async (req, res) => {
    try {
        responseCache.clear();
        res.json({ 
            success: true, 
            message: 'Cache cleared successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to clear cache' 
        });
    }
};
