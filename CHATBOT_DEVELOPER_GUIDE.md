# 🛠️ WaveGuard AI Chatbot - Developer Guide

**Last Updated:** November 14, 2024  
**Status:** ✅ Production Ready

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [API Documentation](#api-documentation)
5. [Configuration](#configuration)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Maintenance](#maintenance)

---

## 🏗️ Architecture Overview

### Technology Stack

**Backend:**
- Node.js + Express
- Hugging Face Inference API (Mistral-7B-Instruct)
- MongoDB (for data retrieval)
- Firebase Authentication

**Frontend:**
- React (Next.js 15)
- Material UI (MUI)
- Axios for API calls
- Firebase Auth Context

### Data Flow

```
User Input → Frontend Component → Backend API Endpoint
                                        ↓
                                   Auth Middleware
                                        ↓
                                 Intent Detection
                                        ↓
                                 Context Builder
                                        ↓
                          MongoDB Queries (Challenge, User, Achievement)
                                        ↓
                                  Format Context
                                        ↓
                           Hugging Face API (Mistral-7B)
                                        ↓
                              Response Formatting
                                        ↓
                                  Cache Response
                                        ↓
                           Return to Frontend → Display
```

---

## 🔧 Backend Implementation

### File Structure

```
backend/src/
├── controllers/
│   └── chatbotController.js      # Main chatbot logic
├── routes/
│   └── chatbotRoutes.js          # API routes
├── middleware/
│   ├── authMiddleware.js         # Firebase token verification
│   └── rateLimiter.js            # Rate limiting (10 msg/min)
└── server.js                     # Route registration
```

### Key Components

#### 1. Intent Detection (`detectIntent()`)

Analyzes user messages to determine intent category:

```javascript
function detectIntent(message) {
    const lower = message.toLowerCase();
    
    // Challenge-related queries
    if (lower.includes('challenge') || lower.includes('cleanup')) {
        return 'challenge_info';
    }
    
    // User statistics
    if (lower.includes('stat') || lower.includes('progress')) {
        return 'user_stats';
    }
    
    // ... more intent categories
}
```

**Supported Intents:**
- `challenge_info` - Challenge information
- `challenge_join` - Joining challenges
- `challenge_dates` - Challenge dates
- `challenge_location` - Location-specific challenges
- `user_stats` - User statistics
- `achievements` - Achievement queries
- `leaderboard` - Leaderboard queries
- `location_query` - Location-based searches
- `how_to` - How-to questions
- `waste_info` - Waste type information
- `greeting` - Greetings and help
- `general` - General queries

#### 2. Context Building (`buildContext()`)

Retrieves relevant data from MongoDB based on detected intent:

```javascript
async function buildContext(intent, userId, message) {
    switch(intent) {
        case 'challenge_info':
            const challenges = await Challenge.find({ status: 'active' })
                .select('title province locationName startDate endDate goal totalTrashCollected')
                .limit(5)
                .lean();
            return JSON.stringify({ challenges });
            
        case 'user_stats':
            const user = await User.findOne({ firebaseUid: userId })
                .select('totalItemsCollected totalCleanups impactScore')
                .lean();
            return JSON.stringify({ user });
            
        // ... more context builders
    }
}
```

#### 3. Caching System

In-memory cache with TTL (Time To Live):

```javascript
const responseCache = new Map();
const CACHE_TTL = 3600000; // 1 hour

function getCacheKey(message, userId) {
    const normalizedMessage = message.toLowerCase().trim();
    return `${userId || 'anonymous'}_${normalizedMessage}`;
}

// Check cache before calling AI
const cached = responseCache.get(cacheKey);
if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    return res.json({ success: true, answer: cached.answer, cached: true });
}

// Store response after AI call
responseCache.set(cacheKey, { answer, timestamp: Date.now() });
```

#### 4. Hugging Face Integration

```javascript
import { HfInference } from '@huggingface/inference';

const hf = new HfInference();

const response = await hf.textGeneration({
    model: 'mistralai/Mistral-7B-Instruct-v0.2',
    inputs: prompt,
    parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false
    }
});
```

**Parameters Explained:**
- `max_new_tokens`: Maximum response length (250 tokens ≈ 200 words)
- `temperature`: Creativity (0.7 = balanced, higher = more creative)
- `top_p`: Nucleus sampling (0.95 = diverse but coherent)
- `return_full_text`: false = only return generated text, not the prompt

#### 5. Fallback Responses

When the AI is unavailable or slow, fallback to template responses:

```javascript
function getFallbackResponse(intent, context) {
    const data = JSON.parse(context);
    
    switch(intent) {
        case 'challenge_info':
            if (data.challenges && data.challenges.length > 0) {
                return formatChallengeList(data.challenges);
            }
            return "No active challenges at this time.";
            
        // ... more fallback handlers
    }
}
```

#### 6. Rate Limiting

Custom rate limiter in `middleware/rateLimiter.js`:

```javascript
// Configuration
const CONFIG = {
    CHATBOT_MAX_REQUESTS: 10,  // 10 messages per minute
    WINDOW_MS: 60 * 1000,      // 1 minute window
};

export const chatbotRateLimiter = createRateLimiter(CONFIG.CHATBOT_MAX_REQUESTS);
```

---

## 🎨 Frontend Implementation

### File Structure

```
frontend/src/
├── components/
│   └── ChatBot/
│       ├── ChatBot.jsx       # Main component
│       └── index.js          # Export
└── components/
    └── AppLayoutWrapper.js   # Integration point
```

### Component Architecture

#### ChatBot Component Structure

```jsx
export default function ChatBot() {
    // State Management
    const [open, setOpen] = useState(false);           // Chat window visibility
    const [messages, setMessages] = useState([]);       // Chat history
    const [input, setInput] = useState('');             // User input
    const [loading, setLoading] = useState(false);      // Loading state
    const [error, setError] = useState(null);           // Error state
    const [suggestions, setSuggestions] = useState([]); // Quick replies
    
    // Auth Context
    const { user } = useAuth();
    
    // Effects
    useEffect(() => {
        fetchSuggestions();  // Load quick replies on mount
    }, []);
    
    useEffect(() => {
        scrollToBottom();    // Scroll to bottom on new messages
    }, [messages]);
    
    // ... component logic
}
```

#### Key Features

**1. Message Format:**
```javascript
const message = {
    role: 'user' | 'bot',
    text: string,
    timestamp: ISO8601 string,
    cached?: boolean,
    fallback?: boolean,
    isError?: boolean
};
```

**2. API Integration:**
```javascript
const sendMessage = async (messageText) => {
    const token = await user.getIdToken();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: messageText })
    });
    
    const data = await response.json();
    // Handle response...
};
```

**3. UI Components:**
- **Floating Action Button (FAB):** Opens chat
- **Chat Window:** Collapsible container
- **Header:** Title and close button
- **Messages Area:** Scrollable message list
- **Quick Replies:** Clickable suggestion chips
- **Input Area:** Text field and send button
- **Typing Indicator:** Shows when bot is thinking

**4. Responsive Design:**
```jsx
<Paper
    sx={{
        width: { xs: 'calc(100vw - 32px)', sm: 380 },
        height: { xs: '70vh', sm: 550 },
        bottom: { xs: 70, sm: 90 },
        right: { xs: 16, sm: 24 },
    }}
>
```

- Mobile: Full width, 70% viewport height
- Desktop: Fixed 380px width, 550px height
- Positioned above bottom navigation on mobile

---

## 📡 API Documentation

### Endpoints

#### 1. POST `/api/chatbot/chat`

Send a message to the chatbot and get a response.

**Authentication:** Required (Firebase token)

**Request:**
```json
{
    "message": "What challenges are available in Ontario?"
}
```

**Response (Success):**
```json
{
    "success": true,
    "answer": "There are 2 active challenges in Ontario...",
    "cached": false,
    "fallback": false
}
```

**Response (Error):**
```json
{
    "success": false,
    "message": "Message is required"
}
```

**Rate Limit:** 10 requests per minute per user

**Status Codes:**
- `200` - Success
- `400` - Bad request (missing/invalid message)
- `401` - Unauthorized (missing/invalid token)
- `429` - Too many requests (rate limit exceeded)
- `500` - Server error

---

#### 2. GET `/api/chatbot/suggestions`

Get quick reply suggestions.

**Authentication:** Not required

**Response:**
```json
{
    "success": true,
    "suggestions": [
        { "text": "What challenges are available?", "icon": "🌊" },
        { "text": "Show my statistics", "icon": "📊" },
        { "text": "View my achievements", "icon": "🏆" },
        { "text": "How do I upload a photo?", "icon": "📸" },
        { "text": "Find cleanups near me", "icon": "📍" }
    ]
}
```

---

#### 3. POST `/api/chatbot/clear-cache`

Clear the response cache (admin/maintenance).

**Authentication:** Required (Firebase token)

**Response:**
```json
{
    "success": true,
    "message": "Cache cleared successfully"
}
```

---

## ⚙️ Configuration

### Environment Variables

**Backend (.env):**
```bash
# Server
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/waveguard

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Chatbot (optional - uses defaults if not set)
CHATBOT_CACHE_TTL=3600000        # Cache TTL in milliseconds (default: 1 hour)
CHATBOT_MAX_TOKENS=250           # Max response tokens (default: 250)
CHATBOT_TEMPERATURE=0.7          # AI temperature (default: 0.7)
```

**Frontend (.env.local):**
```bash
# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

### Customization Options

#### 1. Adjust Rate Limits

In `backend/src/middleware/rateLimiter.js`:
```javascript
const CONFIG = {
    CHATBOT_MAX_REQUESTS: 10,  // Change to 20 for more requests
    WINDOW_MS: 60 * 1000,      // Change to 120 * 1000 for 2-minute window
};
```

#### 2. Modify Cache Duration

In `backend/src/controllers/chatbotController.js`:
```javascript
const CACHE_TTL = 3600000;  // Change to 7200000 for 2 hours
```

#### 3. Change AI Model

```javascript
const response = await hf.textGeneration({
    model: 'google/flan-t5-xxl',  // Alternative: faster but less capable
    // or
    model: 'mistralai/Mistral-7B-Instruct-v0.2',  // Current: balanced
});
```

**Model Options:**
- `mistralai/Mistral-7B-Instruct-v0.2` - Best quality (recommended)
- `google/flan-t5-xxl` - Faster responses
- `meta-llama/Llama-2-7b-chat-hf` - Alternative with good quality

#### 4. Customize Chatbot Appearance

In `frontend/src/components/ChatBot/ChatBot.jsx`:
```jsx
// Change colors
sx={{ bgcolor: 'primary.main' }}  // Header color

// Change size
width: { xs: 'calc(100vw - 32px)', sm: 400 },  // Wider window

// Change position
bottom: { xs: 70, sm: 100 },  // Higher position
right: { xs: 16, sm: 32 },    // More right padding
```

---

## 🧪 Testing

### Manual Testing Checklist

**Backend:**
- [ ] Server starts without errors
- [ ] `/api/chatbot/chat` endpoint responds
- [ ] Rate limiting works (try 11 messages in 1 minute)
- [ ] Caching works (same question twice)
- [ ] Intent detection is accurate
- [ ] Context building retrieves correct data
- [ ] Fallback responses work when AI is unavailable

**Frontend:**
- [ ] Chat button appears in bottom-right
- [ ] Chat window opens/closes correctly
- [ ] Welcome message displays on first open
- [ ] Quick reply chips work
- [ ] Typing indicator shows during loading
- [ ] Messages display correctly (user vs bot)
- [ ] Error messages display properly
- [ ] Login requirement is enforced
- [ ] Responsive on mobile and desktop

### Test Queries

Try these questions to verify functionality:

1. **Challenge Info:** "What challenges are available?"
2. **Location Filter:** "Show me challenges in BC"
3. **User Stats:** "What are my statistics?"
4. **Achievements:** "Show my achievements"
5. **How-To:** "How do I upload a photo?"
6. **Greeting:** "Hello"
7. **Edge Case:** "asdfghjkl" (gibberish)
8. **Long Message:** 500+ character message

### Automated Testing (Future)

Consider adding:
- Unit tests for intent detection
- Integration tests for context builders
- E2E tests for full conversation flow
- Load tests for rate limiting

---

## 🚀 Deployment

### Prerequisites

1. MongoDB instance running
2. Firebase project configured
3. Environment variables set
4. Node.js 18+ installed

### Deployment Steps

**1. Install Dependencies:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

**2. Build Frontend:**
```bash
cd frontend
npm run build
```

**3. Start Backend:**
```bash
cd backend
npm start
```

**4. Start Frontend:**
```bash
cd frontend
npm start
```

### Docker Deployment (Optional)

Create a `Dockerfile` for the backend:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t waveguard-backend .
docker run -p 5000:5000 --env-file .env waveguard-backend
```

---

## 🔧 Maintenance

### Monitoring

**Key Metrics to Track:**
1. Response time (should be < 5 seconds)
2. Cache hit rate (aim for > 30%)
3. Error rate (should be < 5%)
4. Rate limit violations
5. Most common query types

### Cache Management

Clear cache periodically or when data changes:
```bash
curl -X POST http://localhost:5000/api/chatbot/clear-cache \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN"
```

### Performance Optimization

**1. Increase Cache TTL:**
For more static data, increase cache duration:
```javascript
const CACHE_TTL = 7200000;  // 2 hours
```

**2. Add More Fallbacks:**
Reduce AI calls by adding template responses for common queries.

**3. Optimize Database Queries:**
```javascript
// Add indexes for frequently queried fields
Challenge.index({ status: 1, province: 1 });
User.index({ firebaseUid: 1 });
```

### Troubleshooting

**Issue: AI responses are slow**
- Check Hugging Face API status
- Increase timeout from 10s to 15s
- Add more fallback responses

**Issue: High error rate**
- Check MongoDB connection
- Verify Firebase credentials
- Check server logs for specific errors

**Issue: Cache not working**
- Verify cache TTL is set correctly
- Check memory usage (clear old entries)
- Restart server to reset cache

### Updating the AI Model

To switch models or update parameters:

```javascript
// In chatbotController.js
const response = await hf.textGeneration({
    model: 'NEW_MODEL_NAME',
    inputs: prompt,
    parameters: {
        max_new_tokens: 300,      // Adjust as needed
        temperature: 0.8,         // Adjust creativity
        top_p: 0.95,
    }
});
```

Test thoroughly after any model changes!

---

## 📚 Additional Resources

- [Hugging Face Inference API Docs](https://huggingface.co/docs/api-inference/)
- [Mistral-7B Model Card](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2)
- [Material UI Documentation](https://mui.com/material-ui/getting-started/)
- [Next.js Documentation](https://nextjs.org/docs)

---

## 🤝 Contributing

When adding new features to the chatbot:

1. Add new intent categories in `detectIntent()`
2. Create context builders in `buildContext()`
3. Add fallback responses in `getFallbackResponse()`
4. Update this documentation
5. Test thoroughly before deploying

---

**Last Updated:** November 14, 2024  
**Version:** 1.0.0  
**Maintainer:** WaveGuard Development Team
