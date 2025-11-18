"use client";
import React, { useState, useRef, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { validateEmail, validatePassword } from "@/utils/validation";
import {
    Box,
    Typography,
    Button,
    InputAdornment,
    IconButton,
    Divider,
    Container,
    Grid,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Google as GoogleIcon,
} from "@mui/icons-material";

import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleIcon from "@mui/icons-material/People";
import PublicIcon from "@mui/icons-material/Public";

import { useRouter } from "next/navigation";
import axios from "axios";

import {
    GlassCard,
    StyledTextField,
    BackgroundStyle,
    PrimaryButtonStyle,
} from "./login.styles";

export default function LoginPage() {
    const router = useRouter();
    const { login, googleLogin } = useAuth();

    const [form, setForm] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({ email: false, password: false });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");

    const [analyticsData, setAnalyticsData] = useState([
        { IconComponent: PeopleIcon, value: "...", label: "Active Volunteers", change: "+0%", color: "#0891b2" },
        { IconComponent: PublicIcon, value: "...", label: "Items Collected", change: "+0%", color: "#10b981" },
        { IconComponent: EmojiEventsIcon, value: "...", label: "Active Challenges", change: "+0", color: "#f59e0b" },
        { IconComponent: TrendingUpIcon, value: "...", label: "Impact Rate", change: "+0%", color: "#8b5cf6" },
    ]);

    const debounceRef = useRef(null);
    const [emailStatus, setEmailStatus] = useState({
        checking: false,
        exists: false,
        message: "",
    });

    // Fetch login stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/home/login-stats`);
                if (res.ok) {
                    const data = await res.json();

                    const formatK = (n) => n >= 1000 ? (n / 1000).toFixed(1) + "K" : n;

                    setAnalyticsData([
                        {
                            IconComponent: PeopleIcon,
                            value: data.activeVolunteers,
                            label: "Active Volunteers",
                            change: data.changes.volunteersChange,
                            color: "#0891b2"
                        },
                        {
                            IconComponent: PublicIcon,
                            value: formatK(data.itemsCollected),
                            label: "Items Collected",
                            change: data.changes.itemsChange,
                            color: "#10b981"
                        },
                        {
                            IconComponent: EmojiEventsIcon,
                            value: data.activeChallenges,
                            label: "Active Challenges",
                            change: data.changes.challengesChange,
                            color: "#f59e0b"
                        },
                        {
                            IconComponent: TrendingUpIcon,
                            value: `${data.impactRate}%`,
                            label: "Impact Rate",
                            change: data.changes.impactRateChange,
                            color: "#8b5cf6"
                        },
                    ]);
                }
            } catch (e) {
                console.log("Stats error", e);
            }
        };

        fetchStats();
    }, []);

    // Invisible label style
    const hiddenLabel = {
        position: "absolute",
        left: "-9999px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
    };

    return (
        <Box sx={BackgroundStyle}>
            <main role="main" style={{ width: "100%" }}>
                {/* ACCESSIBILITY REQUIRED H1 */}
                <h1 style={hiddenLabel}>WaveGuard Login Page</h1>

                <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
                    <Grid container spacing={{ xs: 3, md: 6 }} justifyContent="center">
                        
                        {/* LEFT PANEL – LOGIN FORM */}
                        <Grid item xs={12} md={6} lg={5} sx={{ display: "flex", justifyContent: "center" }}>
                            <GlassCard sx={{ width: "100%", maxWidth: 420 }}>

                                {/* Title */}
                                <Box textAlign="center" mb={3}>
                                    <Typography variant="h5" color="#fff" fontWeight={700}>
                                        WaveGuard
                                    </Typography>
                                    <Typography variant="body2" color="rgba(255,255,255,0.8)">
                                        Continue your impact journey
                                    </Typography>
                                </Box>

                                <Typography
                                    variant="h6"
                                    align="center"
                                    color="#fff"
                                    fontWeight={600}
                                    mb={2}
                                    sx={{ fontSize: "1.15rem" }}
                                >
                                    Welcome Back
                                </Typography>

                                {/* Messages */}
                                {formErrors.global && (
                                    <Typography align="center" sx={{
                                        color: "#ef4444",
                                        background: "rgba(239,68,68,0.12)",
                                        p: 1, mb: 2, borderRadius: 1
                                    }}>
                                        {formErrors.global}
                                    </Typography>
                                )}
                                {loginMessage && (
                                    <Typography align="center" sx={{
                                        color: "#10b981",
                                        background: "rgba(16,185,129,0.12)",
                                        p: 1, mb: 2, borderRadius: 1
                                    }}>
                                        {loginMessage}
                                    </Typography>
                                )}

                                {/* GOOGLE LOGIN */}
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<GoogleIcon />}
                                    onClick={async () => {
                                        try {
                                            setGoogleLoading(true);
                                            await googleLogin();
                                            setLoginMessage("Signed in successfully!");
                                            setTimeout(() => router.push("/home"), 1000);
                                        } catch (e) {
                                            setFormErrors({ global: "Google login failed" });
                                        } finally {
                                            setGoogleLoading(false);
                                        }
                                    }}
                                    disabled={googleLoading}
                                    aria-label="Sign in with Google"
                                    sx={{
                                        mb: 2,
                                        py: 1.2,
                                        borderColor: "rgba(255,255,255,0.25)",
                                        color: "#fff",
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": { background: "rgba(255,255,255,0.12)" }
                                    }}
                                >
                                    {googleLoading ? "Signing in..." : "Continue with Google"}
                                </Button>

                                <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.2)" }}>
                                    <Typography sx={{ color: "rgba(255,255,255,0.75)" }}>
                                        or
                                    </Typography>
                                </Divider>

                                {/* LOGIN FORM */}
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        const emailValid = validateEmail(form.email).valid;
                                        const passValid = form.password.length >= 6;

                                        if (!emailValid || !passValid) {
                                            setTouched({ email: true, password: true });
                                            setFormErrors({
                                                email: emailValid ? undefined : "Invalid email address",
                                                password: passValid ? undefined : "Password must be at least 6 characters",
                                            });
                                            return;
                                        }

                                        try {
                                            setLoading(true);
                                            await login(form.email, form.password);
                                            setLoginMessage("Login successful!");
                                            setTimeout(() => router.push("/home"), 1000);
                                        } catch (err) {
                                            setFormErrors({
                                                global:
                                                    "Incorrect email or password. Please try again.",
                                            });
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                >

                                    {/* Hidden LABEL for accessibility */}
                                    <label htmlFor="email" style={hiddenLabel}>
                                        Email Address
                                    </label>

                                    <Box mb={2}>
                                        <StyledTextField
                                            id="email"
                                            name="email"
                                            placeholder="Email Address"
                                            fullWidth
                                            value={form.email}
                                            onChange={(e) => {
                                                setForm({ ...form, email: e.target.value });
                                                if (touched.email) {
                                                    const valid = validateEmail(e.target.value).valid;
                                                    setFormErrors((prev) => ({
                                                        ...prev,
                                                        email: valid ? undefined : "Invalid email address",
                                                    }));
                                                }
                                            }}
                                            onBlur={() => {
                                                setTouched((p) => ({ ...p, email: true }));
                                                const valid = validateEmail(form.email).valid;
                                                setFormErrors((prev) => ({
                                                    ...prev,
                                                    email: valid ? undefined : "Invalid email address",
                                                }));
                                            }}
                                            error={touched.email && !!formErrors.email}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Email sx={{ color: "rgba(255,255,255,0.7)" }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        {touched.email && formErrors.email && (
                                            <Typography sx={{ color: "#ef4444", fontSize: "0.8rem", mt: 0.5 }}>
                                                {formErrors.email}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Password */}
                                    <label htmlFor="password" style={hiddenLabel}>
                                        Password
                                    </label>

                                    <Box mb={2}>
                                        <StyledTextField
                                            id="password"
                                            name="password"
                                            placeholder="Password"
                                            fullWidth
                                            type={showPassword ? "text" : "password"}
                                            value={form.password}
                                            onChange={(e) => {
                                                setForm({ ...form, password: e.target.value });
                                                if (touched.password) {
                                                    const valid = e.target.value.length >= 6;
                                                    setFormErrors((prev) => ({
                                                        ...prev,
                                                        password: valid ? undefined : "Password must be at least 6 characters",
                                                    }));
                                                }
                                            }}
                                            onBlur={() => {
                                                setTouched((p) => ({ ...p, password: true }));
                                                const valid = form.password.length >= 6;
                                                setFormErrors((prev) => ({
                                                    ...prev,
                                                    password: valid ? undefined : "Password must be at least 6 characters",
                                                }));
                                            }}
                                            error={touched.password && !!formErrors.password}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Lock sx={{ color: "rgba(255,255,255,0.7)" }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            aria-label="Toggle password visibility"
                                                            size="small"
                                                            sx={{ color: "rgba(255,255,255,0.8)" }}
                                                        >
                                                            {showPassword ? (
                                                                <VisibilityOff fontSize="small" />
                                                            ) : (
                                                                <Visibility fontSize="small" />
                                                            )}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        {touched.password && formErrors.password && (
                                            <Typography sx={{ color: "#ef4444", fontSize: "0.8rem", mt: 0.5 }}>
                                                {formErrors.password}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Forgot password */}
                                    <Typography
                                        variant="body2"
                                        align="right"
                                        sx={{
                                            cursor: "pointer",
                                            color: "rgba(255,255,255,0.9)",
                                            mb: 2,
                                            "&:hover": { color: "#fff" },
                                            fontWeight: 500,
                                        }}
                                        onClick={() => router.push("/forgot-password")}
                                        role="link"
                                    >
                                        Forgot password?
                                    </Typography>

                                    {/* Submit */}
                                    <Button
                                        fullWidth
                                        type="submit"
                                        variant="contained"
                                        disabled={loading}
                                        sx={PrimaryButtonStyle}
                                        aria-label="Sign In"
                                    >
                                        {loading ? "Signing In..." : "Sign In"}
                                    </Button>

                                </form>

                                <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.15)" }} />

                                {/* Create account */}
                                <Typography align="center" color="rgba(255,255,255,0.9)">
                                    Don’t have an account?{" "}
                                    <span
                                        onClick={() => router.push("/signup")}
                                        style={{
                                            color: "#fff",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                        }}
                                    >
                                        Create an account
                                    </span>
                                </Typography>

                            </GlassCard>
                        </Grid>

                        {/* RIGHT PANEL – STATS */}
                        <Grid item xs={12} md={6} lg={5}>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                color="#fff"
                                align="center"
                                mb={1}
                            >
                                Our Global Impact
                            </Typography>

                            <Typography
                                align="center"
                                color="rgba(255,255,255,0.85)"
                                mb={3}
                                sx={{ maxWidth: 480, mx: "auto" }}
                            >
                                Real-time insights from our eco-warriors making a global impact.
                            </Typography>

                            {/* Stats Grid */}
                            <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 480, mx: "auto" }}>
                                {analyticsData.map(({ IconComponent, value, label, change, color }, i) => (
                                    <Grid item xs={6} key={i} sx={{ display: "flex", justifyContent: "center" }}>
                                        <Box
                                            sx={{
                                                backdropFilter: "blur(14px)",
                                                backgroundColor: "rgba(255,255,255,0.12)",
                                                border: "1px solid rgba(255,255,255,0.15)",
                                                borderRadius: 3,
                                                p: 3,
                                                width: "100%",
                                                maxWidth: 180,
                                                textAlign: "center",
                                            }}
                                        >
                                            <IconComponent sx={{ color, fontSize: 32, mb: 1 }} />
                                            <Typography color="#fff" fontWeight={700} fontSize="1.3rem">
                                                {value}
                                            </Typography>
                                            <Typography color="rgba(255,255,255,0.85)" fontSize="0.9rem">
                                                {label}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    mt: 1,
                                                    px: 1.5,
                                                    py: 0.2,
                                                    borderRadius: 2,
                                                    color,
                                                    backgroundColor: `${color}30`,
                                                    fontSize: "0.75rem",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {change} this week
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                    </Grid>
                </Container>
            </main>
        </Box>
    );
}
