# 🤖 WaveGuard AI Chatbot - User Guide

**Last Updated:** November 14, 2024  
**Status:** ✅ Implemented and Ready to Use

---

## 📖 What is the WaveGuard Assistant?

The WaveGuard Assistant is an AI-powered chatbot integrated into the WaveGuard application. It helps users quickly find information about cleanup challenges, track their progress, view achievements, and learn how to use the app—all through natural conversation.

---

## 🎯 What Can the Chatbot Do?

### 1. **Challenge Information** 🌊
Ask about active cleanup challenges, their locations, dates, and progress.

**Example Questions:**
- "What challenges are available?"
- "Show me challenges in Ontario"
- "When does the Toronto cleanup end?"
- "What's the progress on the Vancouver challenge?"

### 2. **Personal Statistics** 📊
View your cleanup statistics and impact scores.

**Example Questions:**
- "Show my statistics"
- "How many items have I collected?"
- "What's my impact score?"
- "How many cleanups have I completed?"

### 3. **Achievements & Badges** 🏆
Track your achievements and see what you've unlocked.

**Example Questions:**
- "Show my achievements"
- "What badges have I earned?"
- "How do I unlock new achievements?"
- "What's my next milestone?"

### 4. **Location-Based Queries** 📍
Find cleanup challenges near you or in specific provinces.

**Example Questions:**
- "Find cleanups near me"
- "What provinces have active cleanups?"
- "Show me beach cleanups in BC"

### 5. **How-To & Instructions** 📸
Learn how to use WaveGuard features.

**Example Questions:**
- "How do I upload a photo?"
- "How do I join a challenge?"
- "What happens when I submit a cleanup?"
- "How does the AI classification work?"

### 6. **Waste Information** ♻️
Learn about the types of waste you can log.

**Example Questions:**
- "What types of waste can I log?"
- "What's the most common trash type?"
- "Are plastic bottles recyclable?"

---

## 💬 How to Use the Chatbot

### Opening the Chat

1. **Look for the chat icon** (💬) in the bottom-right corner of your screen
2. **Click/tap the icon** to open the chat window
3. The chatbot will greet you with a welcome message

### Sending Messages

1. **Type your question** in the input field at the bottom
2. **Press Enter** or click the **Send button** (➤)
3. Wait a few seconds for the AI to respond
4. The chatbot will provide a helpful answer based on your question

### Quick Replies

When you first open the chat, you'll see **quick reply chips** with common questions:
- 🌊 What challenges are available?
- 📊 Show my statistics
- 🏆 View my achievements
- 📸 How do I upload a photo?
- 📍 Find cleanups near me

**Just click any chip** to automatically send that question!

### Closing the Chat

- Click the **X button** in the top-right corner of the chat window
- Or click the chat icon again to minimize it

---

## ✨ Features

### Intelligent Responses
The chatbot uses **AI (Hugging Face Mistral-7B model)** to understand your questions and provide relevant, conversational answers.

### Real-Time Data
All information comes from **live database queries**, ensuring you always get the most up-to-date information about challenges, your stats, and achievements.

### Fast Responses
- Common questions are **cached** for instant responses
- AI responses typically take **2-5 seconds**
- Typing indicator shows when the bot is thinking

### Error Handling
If something goes wrong, the chatbot will:
- Provide a **user-friendly error message**
- Suggest trying again or rephrasing your question
- Fall back to template responses if the AI is unavailable

### Rate Limiting
To ensure fair use and prevent abuse:
- You can send **up to 10 messages per minute**
- If you exceed this limit, you'll see a friendly message asking you to slow down

---

## 🔒 Privacy & Security

### What Data is Used?
The chatbot accesses:
- ✅ Your personal statistics (items collected, cleanups, etc.)
- ✅ Your achievements and progress
- ✅ Public challenge information
- ❌ NO sensitive personal data (passwords, payment info, etc.)

### Authentication Required
You **must be logged in** to use the chatbot. This ensures:
- Personalized responses based on your account
- Secure access to your statistics
- Protection of user data

### Data Storage
- Responses are **temporarily cached** for performance (1 hour)
- No conversation history is permanently stored
- All data queries respect your privacy settings

---

## 💡 Tips for Best Results

### 1. **Be Specific**
Instead of: "Tell me about challenges"  
Try: "What challenges are active in Ontario?"

### 2. **Ask One Thing at a Time**
The chatbot works best with focused questions. If you have multiple questions, ask them separately.

### 3. **Use Natural Language**
You don't need to use special commands. Just ask as you would ask a friend:
- ✅ "How many items have I collected?"
- ✅ "Show me my progress"
- ✅ "What challenges can I join?"

### 4. **Check Quick Replies First**
The quick reply chips cover the most common questions and give instant responses!

### 5. **Rephrase if Needed**
If you don't get the answer you expected, try asking the question differently.

---

## 🚫 Known Limitations

### What the Chatbot CANNOT Do:
- ❌ Perform actions (e.g., join challenges, upload photos)
- ❌ Access other users' private information
- ❌ Make database changes on your behalf
- ❌ Provide real-time location tracking
- ❌ Send notifications or emails

### For Actions:
If you need to:
- **Join a challenge** → Use the Challenges page
- **Upload a photo** → Use the Upload page
- **Update your profile** → Use the Profile page
- **View detailed stats** → Use the Dashboard page

The chatbot is for **information and guidance only**.

---

## 📱 Mobile Experience

The chatbot is **fully responsive** and works great on mobile devices:

### Mobile-Optimized Features:
- ✅ Full-screen chat window on small screens
- ✅ Touch-friendly buttons and inputs
- ✅ Optimized for one-handed use
- ✅ Positioned above the bottom navigation bar
- ✅ Smooth animations and transitions

### Mobile Tips:
- The chat icon appears in the bottom-right
- The chat window takes up most of the screen for better readability
- Quick replies scroll horizontally on narrow screens

---

## 🐛 Troubleshooting

### "Please log in to use the chatbot"
**Solution:** You must be logged in. Go to the login page and sign in with your account.

### "Too many requests. Please slow down."
**Solution:** You've sent more than 10 messages in one minute. Wait a moment and try again.

### "Sorry, I encountered an error..."
**Possible Causes:**
- Network connection issues
- Server temporarily unavailable
- AI service timeout

**Solution:** 
- Check your internet connection
- Wait a moment and try again
- If the problem persists, use the app's regular navigation

### Bot Gives Irrelevant Answers
**Solution:** Try rephrasing your question more clearly or use the quick reply buttons for common questions.

---

## 🎓 Example Conversations

### Example 1: Finding Challenges
```
You: What challenges are happening in BC?

Bot: 🌊 There are 2 active cleanup challenges in British Columbia:

1. Vancouver English Bay Cleanup
   - Location: Vancouver, BC
   - Ends: December 15, 2024
   - Progress: 75% (1,875/2,500 items)

2. Victoria Inner Harbor Cleanup
   - Location: Victoria, BC
   - Ends: January 31, 2025
   - Progress: 32% (640/2,000 items)

Would you like to join one of these challenges?
```

### Example 2: Checking Progress
```
You: How am I doing?

Bot: 📊 Great work! Here's your impact:

• Items Collected: 142
• Cleanups Completed: 8
• Challenges Joined: 3
• Impact Score: 1,250 points

You're 58 items away from the 'Cleanup Crusader' badge! Keep it up! 🎉
```

### Example 3: Learning How To Use the App
```
You: How do I upload a cleanup photo?

Bot: 📸 Uploading a cleanup photo is easy:

1. Go to the Upload page
2. Select the challenge you're participating in
3. Take a photo or select one from your gallery
4. Our AI will automatically identify the waste types
5. Confirm the details and submit!

Your contribution will be counted towards your stats and the challenge goal.
Need help with anything else?
```

---

## 🔄 Updates & Improvements

The WaveGuard Assistant is continuously being improved! Future updates may include:

### Planned Features:
- 🔮 Personalized cleanup recommendations
- 🗣️ Voice input/output support
- 🌍 Multi-language support
- 📊 More detailed analytics queries
- 🎯 Proactive tips and reminders

### Feedback
We'd love to hear your feedback! If you have suggestions for improving the chatbot, please contact the WaveGuard team.

---

## ❓ FAQ

### Q: Is the chatbot free to use?
**A:** Yes! The chatbot is completely free for all WaveGuard users.

### Q: Does it work offline?
**A:** No, the chatbot requires an internet connection to function.

### Q: How accurate are the responses?
**A:** The chatbot pulls data directly from the database, so information about challenges, your stats, and achievements is always accurate and up-to-date.

### Q: Can I delete my chat history?
**A:** Chat history is not permanently stored. It only exists during your current session and is cleared when you close the chat or log out.

### Q: What AI model does it use?
**A:** The chatbot uses the Mistral-7B-Instruct model from Hugging Face, a powerful open-source AI designed for conversational tasks.

### Q: Can I use it on all pages?
**A:** Yes! The chat icon is available on all authenticated pages within the app.

---

## 📞 Need More Help?

If the chatbot can't answer your question or you need additional assistance:

1. **Check the app documentation** in the help section
2. **Contact support** through the app's contact form
3. **Visit the FAQ page** for more information
4. **Email the team** at support@waveguard.com (if applicable)

---

**Enjoy using the WaveGuard AI Assistant! 🌊🤖**

*Making cleanup information accessible, one conversation at a time.*
