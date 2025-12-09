"use client";

import React, { useState } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Alert,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Snackbar,
    Link as MuiLink,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import Link from "next/link";

import {
    PageContainer,
    HeroSection,
    HeroContent,
    ContentContainer,
    MainGrid,
    FormCard,
    SidebarCard,
    FAQCard,
    StyledTextField,
    SubmitButton,
    ContactMethodCard,
    IconWrapper,
    ResponseBadge,
} from "./support.styles";

// Category options
const CATEGORIES = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "account", label: "Account Help" },
    { value: "challenge", label: "Challenge Related" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "partnership", label: "Partnership Inquiry" },
    { value: "other", label: "Other" },
];

// FAQ data
const FAQ_DATA = [
    {
        question: "How do I join a cleanup challenge?",
        answer: "Navigate to the Challenges page, browse available challenges in your area, and click 'Join Challenge'. You'll need to be logged in to participate."
    },
    {
        question: "Why can't I upload photos to a challenge?",
        answer: "Make sure you're within 5km of the challenge location and have allowed location access. Photos must be in JPEG, PNG, or WebP format under 10MB."
    },
    {
        question: "How does the AI trash classification work?",
        answer: "Our AI model analyzes uploaded images to identify common marine debris types (plastic bottles, bags, etc.) and automatically categorizes them for accurate impact tracking."
    },
    {
        question: "Can I create my own cleanup challenge?",
        answer: "Yes! Go to Challenges > Create New Challenge. You'll need to select a location near a beach, lake, or coastline within 5km of your current position."
    },
    {
        question: "How do I update my profile information?",
        answer: "Click on your profile icon and select 'Profile'. From there, you can edit your name, bio, location, and upload a profile picture."
    },
    {
        question: "What types of water bodies are allowed for challenges?",
        answer: "We support challenges at beaches, coastlines, large lakes, rivers, and conservation areas. Small ponds and streams are not eligible to ensure meaningful cleanup activities."
    },
];

export default function SupportPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        category: "",
        subject: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError("");
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError("Please enter your name");
            return false;
        }
        if (!formData.email.trim()) {
            setError("Please enter your email address");
            return false;
        }
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address");
            return false;
        }
        if (!formData.category) {
            setError("Please select a category");
            return false;
        }
        if (!formData.subject.trim()) {
            setError("Please enter a subject");
            return false;
        }
        if (!formData.message.trim()) {
            setError("Please enter your message");
            return false;
        }
        if (formData.message.length < 20) {
            setError("Message must be at least 20 characters");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/support/contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSuccess(true);
                setSnackbar({
                    open: true,
                    message: "Message sent successfully! We'll respond within 24-48 hours.",
                    severity: "success"
                });
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    category: "",
                    subject: "",
                    message: "",
                });
            } else {
                setError(data.message || "Failed to send message. Please try again.");
            }
        } catch (err) {
            console.error("Support form error:", err);
            setError("Failed to send message. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <PageContainer>
            {/* Hero Section */}
            <HeroSection>
                <HeroContent>
                    <Box sx={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        gap: 1.5,
                        mb: 3,
                        px: 3,
                        py: 1.5,
                        background: "rgba(103, 232, 195, 0.2)",
                        borderRadius: "30px",
                        border: "1px solid rgba(103, 232, 195, 0.5)",
                    }}>
                        <SupportAgentIcon sx={{ color: "#67e8c3" }} />
                        <Typography sx={{ color: "#67e8c3", fontWeight: 600, fontSize: "14px", letterSpacing: "0.5px" }}>
                            WE'RE HERE TO HELP
                        </Typography>
                    </Box>
                    <Typography 
                        variant="h2" 
                        sx={{ 
                            fontWeight: 800, 
                            mb: 2,
                            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                            lineHeight: 1.2,
                        }}
                    >
                        Contact & Support
                    </Typography>
                    <Typography 
                        sx={{ 
                            fontSize: { xs: "1rem", md: "1.125rem" },
                            opacity: 0.95,
                            maxWidth: "600px",
                            margin: "0 auto",
                            lineHeight: 1.7,
                        }}
                    >
                        Have questions about Marine Care? Need help with a challenge or technical issue? 
                        Our team is ready to assist you on your ocean conservation journey.
                    </Typography>
                </HeroContent>
            </HeroSection>

            {/* Main Content */}
            <ContentContainer>
                <MainGrid>
                    {/* Contact Form */}
                    <FormCard>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 700, 
                                color: "#003554", 
                                mb: 1,
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                            }}
                        >
                            <SendIcon sx={{ color: "#0891b2" }} />
                            Send Us a Message
                        </Typography>
                        <Typography sx={{ color: "#64748b", mb: 4 }}>
                            Fill out the form below and we'll get back to you as soon as possible.
                        </Typography>

                        {success && (
                            <Alert 
                                severity="success" 
                                sx={{ mb: 3, borderRadius: "12px" }}
                                icon={<CheckCircleOutlineIcon />}
                            >
                                Your message has been sent successfully! We'll respond within 24-48 hours.
                            </Alert>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Your Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        inputProps={{ maxLength: 100 }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="category-label">Category</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            name="category"
                                            value={formData.category}
                                            label="Category"
                                            onChange={handleChange}
                                            required
                                            sx={{
                                                borderRadius: "12px",
                                                backgroundColor: "#f8fafb",
                                                "&:hover": { backgroundColor: "#fff" },
                                                "&.Mui-focused": {
                                                    backgroundColor: "#fff",
                                                },
                                            }}
                                        >
                                            {CATEGORIES.map((cat) => (
                                                <MenuItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <StyledTextField
                                        fullWidth
                                        label="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        inputProps={{ maxLength: 200 }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <StyledTextField
                                        fullWidth
                                        label="Your Message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        multiline
                                        rows={6}
                                        inputProps={{ maxLength: 5000 }}
                                        helperText={`${formData.message.length}/5000 characters`}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <SubmitButton
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        disabled={loading}
                                        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                    >
                                        {loading ? "Sending..." : "Send Message"}
                                    </SubmitButton>
                                </Grid>
                            </Grid>
                        </form>
                    </FormCard>

                    {/* Sidebar */}
                    <Box>
                        {/* Contact Methods */}
                        <SidebarCard>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 700, 
                                    color: "#003554", 
                                    mb: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <HelpOutlineIcon sx={{ color: "#0891b2" }} />
                                Other Ways to Reach Us
                            </Typography>

                            <ContactMethodCard>
                                <IconWrapper>
                                    <EmailIcon />
                                </IconWrapper>
                                <Box>
                                    <Typography sx={{ fontWeight: 600, color: "#003554", mb: 0.5 }}>
                                        Email Support
                                    </Typography>
                                    <MuiLink 
                                        href="mailto:support@marinecare.ca"
                                        sx={{ 
                                            color: "#0891b2", 
                                            textDecoration: "none",
                                            "&:hover": { textDecoration: "underline" }
                                        }}
                                    >
                                        support@marinecare.ca
                                    </MuiLink>
                                </Box>
                            </ContactMethodCard>

                            <ContactMethodCard>
                                <IconWrapper>
                                    <AccessTimeIcon />
                                </IconWrapper>
                                <Box>
                                    <Typography sx={{ fontWeight: 600, color: "#003554", mb: 0.5 }}>
                                        Response Time
                                    </Typography>
                                    <Typography sx={{ color: "#64748b", fontSize: "14px" }}>
                                        Within 24-48 hours
                                    </Typography>
                                </Box>
                            </ContactMethodCard>

                            <ResponseBadge>
                                <CheckCircleOutlineIcon sx={{ fontSize: 18 }} />
                                We respond to all inquiries
                            </ResponseBadge>
                        </SidebarCard>

                        {/* FAQ Section */}
                        <FAQCard>
                            <Typography 
                                variant="h6" 
                                sx={{ 
                                    fontWeight: 700, 
                                    color: "#003554", 
                                    mb: 3,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <HelpOutlineIcon sx={{ color: "#0891b2" }} />
                                Frequently Asked Questions
                            </Typography>

                            {FAQ_DATA.map((faq, index) => (
                                <Accordion 
                                    key={index}
                                    sx={{
                                        boxShadow: "none",
                                        border: "1px solid #e3f2fd",
                                        borderRadius: "12px !important",
                                        mb: 1.5,
                                        "&:before": { display: "none" },
                                        "&.Mui-expanded": {
                                            margin: "0 0 12px 0",
                                        },
                                    }}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon sx={{ color: "#0891b2" }} />}
                                        sx={{
                                            minHeight: "52px",
                                            "&.Mui-expanded": { minHeight: "52px" },
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: 600, color: "#003554", fontSize: "14px" }}>
                                            {faq.question}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ pt: 0 }}>
                                        <Typography sx={{ color: "#64748b", fontSize: "14px", lineHeight: 1.6 }}>
                                            {faq.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </FAQCard>
                    </Box>
                </MainGrid>
            </ContentContainer>

            {/* Success Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ borderRadius: "12px" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </PageContainer>
    );
}
