'use client';
import { useState, useRef, useEffect } from 'react';
import {
    Box,
    Fab,
    Paper,
    Typography,
    TextField,
    IconButton,
    Chip,
    CircularProgress,
    Collapse,
    Avatar,
    Alert
} from '@mui/material';
import {
    ChatBubble as ChatIcon,
    Close as CloseIcon,
    Send as SendIcon,
    SmartToy as BotIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

export default function ChatBot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    // Fetch quick reply suggestions on mount
    useEffect(() => {
        fetchSuggestions();
    }, []);

    // Scroll to bottom when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchSuggestions = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/suggestions`);
            const data = await response.json();
            if (data.success) {
                setSuggestions(data.suggestions);
            }
        } catch (error) {
            console.error('Failed to fetch suggestions:', error);
        }
    };

    const sendMessage = async (messageText = input) => {
        if (!messageText.trim()) return;

        const userMessage = {
            role: 'user',
            text: messageText,
            timestamp: new Date().toISOString()
        };

        // Add user message to chat
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            // Get auth token
            const token = user ? await user.getIdToken() : null;
            
            if (!token) {
                throw new Error('Please log in to use the chatbot');
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message: messageText })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to get response');
            }

            if (data.success) {
                const botMessage = {
                    role: 'bot',
                    text: data.answer,
                    timestamp: new Date().toISOString(),
                    cached: data.cached,
                    fallback: data.fallback
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                throw new Error(data.message || 'Failed to get response');
            }
        } catch (error) {
            console.error('Chat error:', error);
            setError(error.message);
            
            // Add error message to chat
            const errorMessage = {
                role: 'bot',
                text: `Sorry, I encountered an error: ${error.message}. Please try again.`,
                timestamp: new Date().toISOString(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestionText) => {
        sendMessage(suggestionText);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const toggleChat = () => {
        setOpen(!open);
        if (!open && messages.length === 0) {
            // Add welcome message when first opening
            const welcomeMessage = {
                role: 'bot',
                text: "👋 Hello! I'm WaveGuard Assistant. I can help you with:\n\n• 🌊 Finding cleanup challenges\n• 📊 Checking your progress\n• 🏆 Viewing achievements\n• 📸 Learning how to upload photos\n• 📍 Locating cleanups near you\n\nWhat would you like to know?",
                timestamp: new Date().toISOString()
            };
            setMessages([welcomeMessage]);
        }
    };

    return (
        <>
            {/* Chat Window */}
            <Collapse in={open}>
                <Paper
                    elevation={8}
                    sx={{
                        position: 'fixed',
                        bottom: { xs: 70, sm: 90 },
                        right: { xs: 16, sm: 24 },
                        width: { xs: 'calc(100vw - 32px)', sm: 380 },
                        height: { xs: '70vh', sm: 550 },
                        maxHeight: '80vh',
                        borderRadius: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        zIndex: 1300,
                        bgcolor: 'background.paper'
                    }}
                >
                    {/* Header */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BotIcon />
                            <Typography variant="h6" fontWeight={600}>
                                WaveGuard Assistant
                            </Typography>
                        </Box>
                        <IconButton
                            size="small"
                            onClick={toggleChat}
                            sx={{ color: 'inherit' }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Messages Area */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: 'auto',
                            p: 2,
                            bgcolor: 'grey.50',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1.5
                        }}
                    >
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    alignItems: 'flex-start',
                                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                                }}
                            >
                                {msg.role === 'bot' && (
                                    <Avatar
                                        sx={{
                                            bgcolor: msg.isError ? 'error.main' : 'primary.main',
                                            width: 32,
                                            height: 32
                                        }}
                                    >
                                        <BotIcon fontSize="small" />
                                    </Avatar>
                                )}
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 1.5,
                                        maxWidth: '75%',
                                        bgcolor: msg.role === 'user' ? 'primary.main' : msg.isError ? 'error.light' : 'white',
                                        color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                                        borderRadius: 2,
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                        {msg.text}
                                    </Typography>
                                    {msg.fallback && (
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                            (Quick response)
                                        </Typography>
                                    )}
                                </Paper>
                                {msg.role === 'user' && (
                                    <Avatar
                                        sx={{
                                            bgcolor: 'secondary.main',
                                            width: 32,
                                            height: 32
                                        }}
                                    >
                                        <PersonIcon fontSize="small" />
                                    </Avatar>
                                )}
                            </Box>
                        ))}
                        
                        {/* Typing Indicator */}
                        {loading && (
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                    <BotIcon fontSize="small" />
                                </Avatar>
                                <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
                                    <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                                        <CircularProgress size={16} />
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                            Typing...
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        )}
                        
                        <div ref={messagesEndRef} />
                    </Box>

                    {/* Quick Replies */}
                    {!loading && messages.length <= 1 && suggestions.length > 0 && (
                        <Box
                            sx={{
                                p: 1.5,
                                bgcolor: 'background.paper',
                                borderTop: 1,
                                borderColor: 'divider',
                                display: 'flex',
                                gap: 1,
                                flexWrap: 'wrap'
                            }}
                        >
                            {suggestions.map((suggestion, index) => (
                                <Chip
                                    key={index}
                                    label={`${suggestion.icon} ${suggestion.text}`}
                                    onClick={() => handleSuggestionClick(suggestion.text)}
                                    size="small"
                                    clickable
                                    sx={{ fontSize: '0.75rem' }}
                                />
                            ))}
                        </Box>
                    )}

                    {/* Error Alert */}
                    {error && (
                        <Alert severity="error" onClose={() => setError(null)} sx={{ mx: 2, mb: 1 }}>
                            {error}
                        </Alert>
                    )}

                    {/* Input Area */}
                    <Box
                        sx={{
                            p: 2,
                            bgcolor: 'background.paper',
                            borderTop: 1,
                            borderColor: 'divider'
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading || !user}
                                multiline
                                maxRows={3}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3
                                    }
                                }}
                            />
                            <IconButton
                                color="primary"
                                onClick={() => sendMessage()}
                                disabled={!input.trim() || loading || !user}
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': {
                                        bgcolor: 'primary.dark'
                                    },
                                    '&.Mui-disabled': {
                                        bgcolor: 'grey.300',
                                        color: 'grey.500'
                                    }
                                }}
                            >
                                <SendIcon />
                            </IconButton>
                        </Box>
                        {!user && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Please log in to use the chatbot
                            </Typography>
                        )}
                    </Box>
                </Paper>
            </Collapse>

            {/* Floating Action Button */}
            {!open && (
                <Fab
                    color="primary"
                    onClick={toggleChat}
                    sx={{
                        position: 'fixed',
                        bottom: { xs: 16, sm: 24 },
                        right: { xs: 16, sm: 24 },
                        zIndex: 1200
                    }}
                >
                    <ChatIcon />
                </Fab>
            )}
        </>
    );
}
