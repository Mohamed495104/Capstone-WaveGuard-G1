"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import { Box, Stack, Typography, IconButton, Button, Alert, CircularProgress } from "@mui/material";

import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

/* Styled Components */
const FooterContainer = styled("footer")(() => ({
    background: "#F5F9FA",
    padding: "80px 100px 40px",
    color: "#003554",
    fontFamily: "Inter, sans-serif",
    "@media (max-width: 1024px)": {
        padding: "60px 40px 30px",
    },
    "@media (max-width: 768px)": {
        padding: "40px 20px 100px",
        marginBottom: 0,
    },
}));

const TopSection = styled("div")(() => ({
    display: "grid",
    gridTemplateColumns: "minmax(350px, 450px) 1fr",
    gap: "80px",
    maxWidth: "1400px",
    margin: "0 auto 50px",
    "@media (max-width: 1200px)": {
        gap: "60px",
    },
    "@media (max-width: 1024px)": {
        gridTemplateColumns: "1fr",
        gap: "40px",
        marginBottom: "40px",
    },
}));

const About = styled("div")(() => ({
    maxWidth: "100%",
    '@media (max-width: 1024px)': {
        textAlign: 'center',
    },
}));

const LogoRow = styled("div")(() => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
    '@media (max-width: 1024px)': {
        justifyContent: 'center',
    },
}));

const LogoText = styled("h4")(() => ({
    color: "#0891B2",
    fontWeight: 700,
    fontSize: 22,
    margin: 0,
    "@media (max-width: 768px)": {
        fontSize: 20,
    },
}));

const Description = styled("p")(() => ({
    color: "#003554",
    lineHeight: 1.7,
    fontSize: 15,
    marginBottom: 24,
    '@media (max-width: 1024px)': {
        textAlign: 'center',
    },
    "@media (max-width: 768px)": {
        fontSize: 14,
        lineHeight: 1.6,
    },
}));

const NewsletterSection = styled("div")(() => ({
    marginTop: 24,
    '@media (max-width: 1024px)': {
        textAlign: 'left',
        maxWidth: '400px',
        margin: '24px auto 0 auto',
    },
}));

const NewsletterTitle = styled("h5")(() => ({
    fontSize: 15,
    fontWeight: 600,
    color: "#003554",
    marginBottom: 12,
}));

const NewsletterForm = styled("form")(() => ({
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginBottom: 8,
}));

const EmailInput = styled("input")(() => ({
    flex: 1,
    border: "1px solid #D1E5ED",
    borderRadius: 8,
    padding: "11px 14px",
    fontSize: 14,
    color: "#003554",
    background: "#ffffff",
    outline: "none",
    transition: "border-color 0.3s ease, boxShadow 0.3s ease",
    "&:focus": {
        borderColor: "#0891B2",
        boxShadow: "0 0 0 3px rgba(8, 145, 178, 0.1)",
    },
    "&::placeholder": {
        color: "#9BB5C0",
    },
}));

const SubmitButton = styled("button")(() => ({
    background: "#0891B2",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "11px 18px",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
        background: "#0077A3",
        transform: "translateY(-1px)",
    },
    "&:active": {
        transform: "translateY(0)",
    },
}));

const NewsletterHint = styled("span")(() => ({
    fontSize: 12,
    color: "#003554",
    lineHeight: 1.4,
}));

const LinksSection = styled("nav")(() => ({
    display: "flex",
    flexDirection: 'column',

    // FIX: Center content horizontally when stacked on mobile/tablet
    "@media (max-width: 1024px)": {
        alignItems: 'center',
    },
    // Align content to the left on desktop and push the entire block right
    "@media (min-width: 1025px)": {
        alignItems: 'flex-start',
        marginLeft: 'auto',
    },
    // Default alignment for Flexbox children inside
    alignItems: 'flex-start',
}));

const LinkColumn = styled("div")(() => ({
    // Retained
}));

const ColumnTitle = styled("h5")(() => ({
    color: "#003554",
    fontWeight: 600,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'left',
}));

const LinkList = styled("ul")(() => ({
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
}));

const LinkItem = styled("li")(() => ({
    color: "#003554",
    fontSize: 14,
    marginBottom: 12,
    cursor: "pointer",
    "&:hover": {
        color: "#0891B2",
    },
    "& a": {
        color: "inherit",
        textDecoration: "none",
        "&:hover": {
            color: "#0891B2",
        },
    },
}));


/* Component */
export default function Footer() {
    const [email, setEmail] = useState('');
    const [newsletterStatus, setNewsletterStatus] = useState(''); // 'success', 'error', 'loading', ''
    const [newsletterMessage, setNewsletterMessage] = useState('');

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !email.trim()) {
            setNewsletterStatus('error');
            setNewsletterMessage('Please enter your email address');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setNewsletterStatus('error');
            setNewsletterMessage('Please enter a valid email address');
            return;
        }

        setNewsletterStatus('loading');
        setNewsletterMessage('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email.trim() }),
            });

            const data = await response.json();

            if (response.ok) {
                setNewsletterStatus('success');
                setNewsletterMessage(data.message || 'Successfully subscribed to our newsletter!');
                setEmail(''); // Clear the input
                // Clear success message after 5 seconds
                setTimeout(() => {
                    setNewsletterStatus('');
                    setNewsletterMessage('');
                }, 5000);
            } else {
                setNewsletterStatus('error');
                setNewsletterMessage(data.message || 'Failed to subscribe. Please try again.');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            setNewsletterStatus('error');
            setNewsletterMessage('Failed to subscribe. Please try again later.');
        }
    };

    const coreNavigationLinks = [
        { label: "Home", href: "/home" },
        { label: "Challenges", href: "/challenges" },
        { label: "Upload", href: "/upload" },
        { label: "Dashboard", href: "/dashboard" },
        { label: "Achievements", href: "/achievements" },
        { label: "Profile", href: "/profile" },
    ];

    const navigationGroup = [
        {
            title: "Quick Navigation",
            items: coreNavigationLinks,
        },
    ];


    return (
        <FooterContainer role="contentinfo">
            {/* Top Section */}
            <TopSection>
                {/* About Section */}
                <About>
                    <LogoRow>
                        <Link href="/" passHref aria-label="Marine Care home">
                            <Image
                                src="/images/2.png"
                                alt="Marine Care wave logo"
                                width={36}
                                height={36}
                            />
                        </Link>
                        <LogoText>Marine Care</LogoText>
                    </LogoRow>

                    <Description>
                        AI-powered platform connecting volunteers across Canada to protect
                        our 243,042 km of coastline. Together, we're making cleanup efforts
                        measurable and impactful.
                    </Description>

                    {/* Newsletter */}
                    <NewsletterSection>
                        <NewsletterTitle>Subscribe to our newsletter</NewsletterTitle>

                        <NewsletterForm onSubmit={handleNewsletterSubmit}>
                            <label htmlFor="newsletter-email" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden' }}>Email address for newsletter</label>
                            <EmailInput
                                id="newsletter-email"
                                type="email"
                                placeholder="your@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={newsletterStatus === 'loading'}
                            />
                            <SubmitButton 
                                type="submit" 
                                aria-label="Subscribe to newsletter"
                                disabled={newsletterStatus === 'loading'}
                            >
                                {newsletterStatus === 'loading' ? (
                                    <CircularProgress size={16} sx={{ color: '#fff' }} />
                                ) : (
                                    '→'
                                )}
                            </SubmitButton>
                        </NewsletterForm>
                        
                        {/* Newsletter Status Messages */}
                        {newsletterStatus === 'success' && (
                            <Alert 
                                severity="success" 
                                sx={{ mt: 1, fontSize: '13px', py: 0.5 }}
                                onClose={() => { setNewsletterStatus(''); setNewsletterMessage(''); }}
                            >
                                {newsletterMessage}
                            </Alert>
                        )}
                        {newsletterStatus === 'error' && (
                            <Alert 
                                severity="error" 
                                sx={{ mt: 1, fontSize: '13px', py: 0.5 }}
                                onClose={() => { setNewsletterStatus(''); setNewsletterMessage(''); }}
                            >
                                {newsletterMessage}
                            </Alert>
                        )}
                        
                        {!newsletterStatus && (
                            <NewsletterHint>
                                Get updates on cleanup challenges and impact reports.
                            </NewsletterHint>
                        )}
                    </NewsletterSection>
                </About>

                {/* Links Section (Single Vertical Column, Centered on Mobile) */}
                <LinksSection aria-label="Quick navigation links">
                    {navigationGroup.map((group, idx) => (
                        <LinkColumn key={idx}>
                            <ColumnTitle>{group.title}</ColumnTitle>
                            <LinkList>
                                {group.items.map((item) => (
                                    <LinkItem key={item.label}>
                                        <Link href={item.href || '#'} passHref>
                                            {item.label}
                                        </Link>
                                    </LinkItem>
                                ))}
                            </LinkList>
                        </LinkColumn>
                    ))}
                </LinksSection>
            </TopSection>

            {/* --- FINAL SOCIAL AND LEGAL BAR --- */}
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "32px",
                borderTop: "1px solid #D1E5ED",
                maxWidth: "1400px",
                margin: "0 auto",
                flexWrap: 'wrap',
                '@media (max-width: 768px)': {
                    flexDirection: 'column',
                    gap: 2,
                    alignItems: 'center',
                }
            }}>
                {/* Left: Copyright and Email Link */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ '@media (max-width: 768px)': { mb: 2 } }}>
                    <Typography variant="body2" sx={{ color: '#003554', fontSize: 13, fontWeight: 500 }}>
                        © {new Date().getFullYear()} Marine Care.
                    </Typography>
                    <Button
                        href="mailto:support@marinecare.ca"
                        startIcon={<MailOutlineIcon />}
                        sx={{ color: '#0891B2', textTransform: 'none', fontSize: 13, fontWeight: 600 }}
                    >
                        support@marinecare.ca
                    </Button>
                </Stack>

                {/* Right: Social Icons */}
                <Stack direction="row" spacing={1.5}>
                    <IconButton href="https://facebook.com/marinecare" target="_blank" aria-label="Visit Marine Care on Facebook">
                        <FacebookIcon sx={{ color: '#003554' }} />
                    </IconButton>
                    <IconButton href="https://twitter.com/marinecare" target="_blank" aria-label="Visit Marine Care on Twitter">
                        <TwitterIcon sx={{ color: '#003554' }} />
                    </IconButton>
                    <IconButton href="https://instagram.com/marinecare" target="_blank" aria-label="Visit Marine Care on Instagram">
                        <InstagramIcon sx={{ color: '#003554' }} />
                    </IconButton>
                    <IconButton href="https://youtube.com/marinecare" target="_blank" aria-label="Visit Marine Care on YouTube">
                        <YouTubeIcon sx={{ color: '#003554' }} />
                    </IconButton>
                </Stack>
            </Box>
        </FooterContainer>
    );
}