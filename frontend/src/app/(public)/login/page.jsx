"use client";
import React, { useState, useRef } from "react";
import useAuth from "@/hooks/useAuth";
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
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import axios from "axios";
import { auth } from "@/lib/firebase";
import {
    GlassCard,
    StyledTextField,
    BackgroundStyle,
    PrimaryButtonStyle,
} from "./login.styles";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [touched, setTouched] = useState({ email: false, password: false });
    const [formErrors, setFormErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [loginMessage, setLoginMessage] = useState("");
    const [emailStatus, setEmailStatus] = useState({
        checking: false,
        exists: false,
        message: "",
    });
    const { login, googleLogin } = useAuth();
    const debounceRef = useRef(null);

    const isValidEmail = (email) =>
        /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

    const validateField = (name, value) => {
        switch (name) {
            case "email":
                if (!value.trim()) return "Email address is required";
                if (!isValidEmail(value)) return "Enter a valid email address";
                if (!emailStatus.checking && !emailStatus.exists && value)
                    return "No account found with this email.";
                return "";
            case "password":
                if (!value) return "Password is required";
                if (value.length < 6)
                    return "Password must be at least 6 characters";
                return "";
            default:
                return "";
        }
    };

    const toggleShowPassword = () => setShowPassword((p) => !p);

    // Debounced email check (live validation)
    const checkEmailExists = (email) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (!email || !isValidEmail(email)) {
            setEmailStatus({ checking: false, exists: false, message: "" });
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                setEmailStatus({ checking: true, exists: false, message: "" });
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/check-email`,
                    { params: { email } }
                );
                const exists = res.data.exists;
                setEmailStatus({
                    checking: false,
                    exists,
                    message: exists
                        ? ""
                        : "No account found with this email.",
                });
                setFormErrors((prev) => ({
                    ...prev,
                    email: !exists ? "No account found with this email." : undefined,
                }));
            } catch {
                setEmailStatus({ checking: false, exists: false, message: "" });
            }
        }, 600);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (name === "email") checkEmailExists(value);
        if (touched[name]) {
            const error = validateField(name, value);
            setFormErrors((prev) => ({ ...prev, [name]: error || undefined }));
        }
    };

    const handleBlur = (field) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
        const error = validateField(field, form[field]);
        if (error) setFormErrors((prev) => ({ ...prev, [field]: error }));
    };

    const validateForm = () => {
        const errors = {};
        Object.entries(form).forEach(([key, value]) => {
            const err = validateField(key, value);
            if (err) errors[key] = err;
        });
        return errors;
    };
    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setTouched({ email: true, password: true });
        const errors = validateForm();
        setFormErrors(errors);
        if (Object.keys(errors).length) return;
        try {
            setLoading(true);
            await login(form.email, form.password);
            setLoginMessage("Login successful! Redirecting...");
            setTimeout(() => router.push("/landing"), 1500);
        } catch (err) {
            const msgMap = {
                "auth/user-not-found": "No account found with this email.",
                "auth/wrong-password": "Incorrect password. Try again.",
                "auth/invalid-email": "Invalid email format.",
                "auth/too-many-requests": "Too many failed attempts. Try again later.",
                "auth/user-disabled": "Account disabled.",
            };
            setFormErrors({
                global: msgMap[err.code] || "Invalid Credentials",
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle Google Login
    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            await googleLogin();
            setLoginMessage("Signed in successfully with Google!");
            setTimeout(() => router.push("/landing"), 1500);
        } catch (err) {
            setFormErrors({ global: err.message || "Google login failed. Please try again later." });
        } finally {
            setGoogleLoading(false);
        }
    };

    const analyticsData = [
        { IconComponent: PeopleIcon, value: "2,847", label: "Active Volunteers", change: "+12%", color: "#0891b2" },
        { IconComponent: PublicIcon, value: "12.5K", label: "Items Collected", change: "+24%", color: "#10b981" },
        { IconComponent: EmojiEventsIcon, value: "47", label: "Active Challenges", change: "+5", color: "#f59e0b" },
        { IconComponent: TrendingUpIcon, value: "89%", label: "Impact Rate", change: "+7%", color: "#8b5cf6" },
    ];

    return (
        <Box sx={BackgroundStyle}>
            <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 4 }, py: { xs: 4, md: 6 } }}>
                <Grid container spacing={{ xs: 3, md: 6 }} alignItems="stretch" justifyContent="center">
                    {/* LEFT - Login Form */}
                    <Grid item xs={12} md={6} lg={5} sx={{ order: { xs: 2, md: 1 }, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <GlassCard sx={{ width: "100%", maxWidth: 420 }}>
                            <Box textAlign="center" mb={3}>
                                <Typography variant="h5" fontWeight={700} color="#fff">WaveGuard</Typography>
                                <Typography variant="body2" color="rgba(255,255,255,0.8)">Continue your impact journey</Typography>
                            </Box>

                            <Typography align="center" variant="h6" color="#fff" mb={2} fontWeight={600}>
                                Welcome Back
                            </Typography>

                            {formErrors.global && (
                                <Typography align="center" sx={{ color: "#ef4444", background: "rgba(239,68,68,0.1)", p: 1, borderRadius: 1, mb: 2 }}>
                                    {formErrors.global}
                                </Typography>
                            )}
                            {loginMessage && (
                                <Typography align="center" sx={{ color: "#10b981", background: "rgba(16,185,129,0.1)", p: 1, borderRadius: 1, mb: 2 }}>
                                    {loginMessage}
                                </Typography>
                            )}

                            {/* Google Sign-In */}
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                startIcon={<GoogleIcon />}
                                sx={{
                                    mb: 2,
                                    py: 1.2,
                                    borderColor: "rgba(255,255,255,0.2)",
                                    color: "#fff",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    "&:hover": { background: "rgba(255,255,255,0.1)" },
                                }}
                            >
                                {googleLoading ? "Signing in with Google..." : "Continue with Google"}
                            </Button>

                            <Divider sx={{ my: 2, borderColor: "rgba(255,255,255,0.15)" }}>
                                <Typography variant="body2" color="rgba(255,255,255,0.6)" sx={{ px: 1 }}>or</Typography>
                            </Divider>

                            {/* Email/Password Login */}
                            <form onSubmit={handleLogin}>
                                <Box mb={2}>
                                    <StyledTextField
                                        name="email"
                                        placeholder="Email Address"
                                        fullWidth
                                        value={form.email}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("email")}
                                        error={touched.email && (!!formErrors.email || (!emailStatus.exists && !emailStatus.checking && emailStatus.message))}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email sx={{ color: "rgba(255,255,255,0.6)" }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    {/* Show message dynamically */}
                                    {emailStatus.checking ? (
                                        <Typography sx={{ color: "#facc15", fontSize: "0.8rem", mt: 0.5 }}>
                                            Checking email...
                                        </Typography>
                                    ) : emailStatus.message ? (
                                        <Typography
                                            sx={{
                                                color: emailStatus.exists ? "#10b981" : "#ef4444",
                                                fontSize: "0.8rem",
                                                mt: 0.5,
                                            }}
                                        >
                                            {emailStatus.message}
                                        </Typography>
                                    ) : touched.email && formErrors.email ? (
                                        <Typography sx={{ color: "#ef4444", fontSize: "0.8rem", mt: 0.5 }}>
                                            {formErrors.email}
                                        </Typography>
                                    ) : null}
                                </Box>


                                <Box mb={2}>
                                    <StyledTextField
                                        name="password"
                                        placeholder="Password"
                                        fullWidth
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur("password")}
                                        error={touched.password && !!formErrors.password}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock sx={{ color: "rgba(255,255,255,0.6)" }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={toggleShowPassword}
                                                        sx={{ color: "rgba(255,255,255,0.6)" }}
                                                        size="small"
                                                    >
                                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
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

                                <Typography
                                    variant="body2"
                                    align="right"
                                    color="#0891b2"
                                    sx={{ cursor: "pointer", mb: 2, "&:hover": { color: "#06b6d4" } }}
                                    onClick={() => router.push("/forgot-password")}
                                >
                                    Forgot password?
                                </Typography>

                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    sx={PrimaryButtonStyle}
                                >
                                    {loading ? "Signing In..." : "Sign In"}
                                </Button>
                            </form>

                            <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.15)" }} />

                            <Typography align="center" color="rgba(255,255,255,0.8)">
                                Don't have an account?{" "}
                                <span onClick={() => router.push("/signup")} style={{ color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                  Create an account
                </span>
                            </Typography>
                        </GlassCard>
                    </Grid>

                    {/* Analytics */}
                    <Grid item xs={12} md={6} lg={5} sx={{ order: { xs: 1, md: 2 }, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: { xs: "center", md: "flex-start" } }}>
                        <Typography variant="h4" fontWeight={700} color="#fff" mb={1} sx={{ textAlign: { xs: "center", md: "left" } }}>
                            Our Global Impact
                        </Typography>
                        <Typography color="rgba(255,255,255,0.8)" mb={3} sx={{ maxWidth: 480, textAlign: { xs: "center", md: "left" } }}>
                            Real-time insights from our community of eco-warriors making a difference worldwide.
                        </Typography>
                        <Grid container spacing={2} sx={{ maxWidth: 480 }}>
                            {analyticsData.map(({ IconComponent, value, label, change, color }, i) => (
                                <Grid item xs={6} key={i}>
                                    <Box
                                        sx={{
                                            backdropFilter: "blur(16px)",
                                            backgroundColor: "rgba(255,255,255,0.12)",
                                            border: "1px solid rgba(255,255,255,0.15)",
                                            borderRadius: 3,
                                            p: { xs: 2, sm: 3 },
                                            minHeight: { xs: 140, sm: 160 },
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            transition: "transform 0.2s ease, background 0.2s ease",
                                            "&:hover": { transform: "translateY(-4px)", backgroundColor: "rgba(255,255,255,0.18)" },
                                        }}
                                    >
                                        <IconComponent sx={{ color, fontSize: { xs: 28, sm: 34 }, mb: 1 }} />
                                        <Typography color="#fff" fontWeight={700} fontSize={{ xs: "1.2rem", sm: "1.4rem" }}>
                                            {value}
                                        </Typography>
                                        <Typography color="rgba(255,255,255,0.8)" fontSize={{ xs: "0.75rem", sm: "0.85rem" }}>
                                            {label}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                mt: 1,
                                                px: 1.5,
                                                py: 0.3,
                                                fontSize: "0.7rem",
                                                borderRadius: 2,
                                                fontWeight: 600,
                                                color,
                                                backgroundColor: `${color}20`,
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
        </Box>
    );
}