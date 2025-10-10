"use client";
import React, { useState, useRef } from "react";
import {
    Box,
    Card,
    TextField,
    Typography,
    Button,
    InputAdornment,
    IconButton,
    FormControlLabel,
    Checkbox,
    Grid,
    Divider,
    Container,
} from "@mui/material";
import {
    Visibility,
    VisibilityOff,
    Email,
    Lock,
    Person,
    CheckCircle,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import axios from "axios";

// Glass card with responsive padding
const GlassCard = styled(Card)(({ theme }) => ({
    backdropFilter: "blur(20px)",
    backgroundColor: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "20px",
    padding: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
        borderRadius: "16px",
    },
    [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(2.5),
    },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: "10px",
        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.35)" },
        "&.Mui-focused fieldset": { borderColor: "rgba(255,255,255,0.5)" },
    },
    "& .MuiInputBase-input": {
        color: "#fff",
        fontSize: "15px",
        [theme.breakpoints.down('sm')]: {
            fontSize: "14px",
            padding: "14px",
        },
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.7)",
    },
}));

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
    });
    const [emailStatus, setEmailStatus] = useState({
        checking: false,
        exists: false,
        message: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agree, setAgree] = useState(false);
    const [loading, setLoading] = useState(false);

    const debounceRef = useRef(null);

    // Enhanced email validation - blocks common typos
    const isValidEmail = (email) => {
        if (!email) return false;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) return false;

        // Block common typos
        const commonTypos = ['.con', '.cmo', '.ocm', '.comme', '.gamil', '.gmai', '.yahooo', '.yaho', '.gmial', '.gmil'];
        const lowerEmail = email.toLowerCase();
        return !commonTypos.some(typo => lowerEmail.endsWith(typo));
    };

    // Enhanced password validation - must have at least 6 letters + numbers/special chars
    const isValidPassword = (password) => {
        if (!password || password.length < 6) return false;

        const letterCount = (password.match(/[a-zA-Z]/g) || []).length;
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[@$!%*?&#]/.test(password);

        // Must have at least 6 letters AND at least one number or special character
        return letterCount >= 4 && (hasNumber || hasSpecialChar);
    };

    // Real-time field validation
    const validateField = (name, value) => {
        switch (name) {
            case 'name':
                if (!value.trim()) {
                    return "Full name is required";
                } else if (value.trim().length < 2) {
                    return "Name must be at least 2 characters";
                }
                return "";

            case 'email':
                if (!value.trim()) {
                    return "Email address is required";
                }
                if (!isValidEmail(value)) {
                    const email = value.toLowerCase();
                    const hasCommonTypo = ['.con', '.cmo', '.ocm', '.comme', '.gamil', '.gmai', '.yahooo', '.yaho', '.gmial', '.gmil']
                        .some(typo => email.endsWith(typo));

                    if (hasCommonTypo) {
                        return "Please check your email - did you mean .com?";
                    } else if (!/@/.test(value)) {
                        return "Email must contain an @ symbol";
                    } else if (!/\.[a-zA-Z]{2,}$/.test(value)) {
                        return "Email must end with a valid domain (e.g., .com, .org)";
                    } else {
                        return "Please enter a valid email address";
                    }
                }
                if (emailStatus.exists) {
                    return "This email is already registered. Please use another or sign in.";
                }
                return "";

            case 'password':
                if (!value) {
                    return "Password is required";
                }
                if (value.length < 8) {
                    return "Password must be at least 6 characters long";
                }
                if (!isValidPassword(value)) {
                    const letterCount = (value.match(/[a-zA-Z]/g) || []).length;
                    const hasNumber = /\d/.test(value);
                    const hasSpecialChar = /[@$!%*?&#]/.test(value);

                    if (letterCount < 6) {
                        return "Password must contain at least 4 letters";
                    } else if (!hasNumber && !hasSpecialChar) {
                        return "Password must include at least one number or special character (@$!%*?&#)";
                    } else {
                        return "Password must have 6+ letters and include numbers or special characters";
                    }
                }
                return "";

            case 'confirmPassword':
                if (!value) {
                    return "Please confirm your password";
                }
                if (value !== form.password) {
                    return "Passwords do not match";
                }
                return "";

            default:
                return "";
        }
    };

    const handleEmailCheck = (email) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        // Reset status if email is empty or invalid
        if (!email || !isValidEmail(email)) {
            setEmailStatus({ checking: false, exists: false, message: "" });
            return;
        }

        // Only check availability if email format is valid
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
                        ? "This email is already registered"
                        : "This email is available",
                });

                // Update email error if exists
                if (exists && touched.email) {
                    setFormErrors(prev => ({
                        ...prev,
                        email: "This email is already registered. Please use another or sign in."
                    }));
                }
            } catch {
                setEmailStatus({
                    checking: false,
                    exists: false,
                    message: "",
                });
            }
        }, 500);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        // Validate on change if field has been touched
        if (touched[name]) {
            const error = validateField(name, value);
            setFormErrors(prev => {
                const newErrors = { ...prev };
                if (error) {
                    newErrors[name] = error;
                } else {
                    delete newErrors[name];
                }
                return newErrors;
            });
        }
    };

    const handleBlur = (fieldName) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));

        // Validate on blur
        const error = validateField(fieldName, form[fieldName]);
        if (error) {
            setFormErrors(prev => ({ ...prev, [fieldName]: error }));
        }
    };

    const toggleShowPassword = () => setShowPassword((p) => !p);

    // Full form validation
    const validateForm = () => {
        const errors = {};

        // Validate all fields
        Object.keys(form).forEach(field => {
            const error = validateField(field, form[field]);
            if (error) {
                errors[field] = error;
            }
        });

        // Check terms agreement
        if (!agree) {
            errors.agree = "You must agree to the Terms of Service and Privacy Policy to continue";
        }

        return errors;
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        // Mark all fields as touched on submit attempt
        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
        });

        const errors = validateForm();
        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        try {
            setLoading(true);
            const userCred = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );
            const token = await userCred.user.getIdToken();

            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/sync`,
                { idToken: token }
            );

            // Full UI cleanup after success
            setForm({ name: "", email: "", password: "", confirmPassword: "" });
            setEmailStatus({ checking: false, exists: false, message: "" });
            setFormErrors({});
            setTouched({ name: false, email: false, password: false, confirmPassword: false });
            setAgree(false);

            // Show success banner and redirect
            setSuccessMessage("🎉 Registered successfully! You can log in now.");
            setTimeout(() => router.push("/login"), 3000);
        } catch (err) {
            let errorMessage = "Registration failed. Please try again.";

            if (err.code === 'auth/email-already-in-use') {
                errorMessage = "This email is already registered. Please sign in instead.";
                setFormErrors(prev => ({ ...prev, email: errorMessage }));
            } else if (err.code === 'auth/weak-password') {
                errorMessage = "Password is too weak. Please use a stronger password.";
                setFormErrors(prev => ({ ...prev, password: errorMessage }));
            } else if (err.code === 'auth/invalid-email') {
                errorMessage = "Invalid email address format.";
                setFormErrors(prev => ({ ...prev, email: errorMessage }));
            } else {
                setFormErrors({ global: err.message || errorMessage });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                backgroundImage: {
                    xs: `linear-gradient(rgba(0,60,110,0.75), rgba(0,120,180,0.75)), url('/images/image1.png')`,
                    md: `linear-gradient(rgba(0,60,110,0.55), rgba(0,120,180,0.55)), url('/images/image1.png')`
                },
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: { xs: "scroll", md: "fixed" },
                overflowY: "auto",
                display: "flex",
                alignItems: "center",
            }}
        >
            <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
                <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} alignItems="center" justifyContent="center">
                    {/* LEFT PANEL - Brand & Features */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={5}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: { xs: "center", md: "flex-end" },
                            textAlign: { xs: "center", md: "right" },
                            color: "#fff",
                            order: { xs: 1, md: 1 },
                        }}
                    >
                        {/* Logo & Brand */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: { xs: "center", md: "flex-end" },
                                mb: { xs: 2, sm: 3, md: 4 },
                                gap: { xs: 1.5, sm: 2 },
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: 44, sm: 48, md: 52 },
                                    height: { xs: 44, sm: 48, md: 52 },
                                    borderRadius: { xs: "10px", md: "12px" },
                                    backgroundColor: "rgba(255,255,255,0.9)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                                    <path
                                        d="M16 2L4 8v12c0 7.5 5.2 14.5 12 16 6.8-1.5 12-8.5 12-16V8L16 2z"
                                        fill="#0891b2"
                                    />
                                </svg>
                            </Box>
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 700,
                                    letterSpacing: "0.5px",
                                    fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
                                }}
                            >
                                WaveGuard
                            </Typography>
                        </Box>

                        {/* Tagline */}
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 400,
                                mb: { xs: 3, sm: 4, md: 5 },
                                opacity: 0.9,
                                maxWidth: { xs: "100%", sm: 500, md: 420 },
                                lineHeight: 1.4,
                                fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
                                px: { xs: 2, sm: 0 },
                            }}
                        >
                            Start your impact journey today. Join our global community of
                            eco-volunteers creating cleaner coasts and a sustainable future.
                        </Typography>

                        {/* Features Box */}
                        <Box
                            sx={{
                                backdropFilter: "blur(20px)",
                                backgroundColor: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: { xs: "12px", md: "16px" },
                                p: { xs: 2, sm: 2.5, md: 3 },
                                width: "100%",
                                maxWidth: { xs: "100%", sm: 500, md: 420 },
                                display: { xs: "none", sm: "block" },
                            }}
                        >
                            {[
                                "AI-powered waste classification",
                                "Track your environmental impact",
                                "Join community challenges",
                                "Earn badges and achievements",
                            ].map((f, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        mb: i < 3 ? { xs: 1.5, md: 2 } : 0,
                                    }}
                                >
                                    <CheckCircle
                                        sx={{
                                            color: "#0891b2",
                                            fontSize: { xs: 18, md: 20 },
                                            mr: { xs: 1.5, md: 2 },
                                            opacity: 0.9,
                                            flexShrink: 0,
                                        }}
                                    />
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            opacity: 0.95,
                                            fontSize: { xs: "0.9rem", md: "1rem" },
                                        }}
                                    >
                                        {f}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* RIGHT PANEL - Signup Form */}
                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={5}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            order: { xs: 2, md: 2 },
                        }}
                    >
                        <GlassCard sx={{ width: "100%", maxWidth: { xs: "100%", sm: 480, md: 440 } }}>
                            {/* Header */}
                            <Typography
                                variant="h5"
                                align="center"
                                fontWeight={700}
                                color="#fff"
                                mb={0.5}
                                sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                            >
                                Create Your Account
                            </Typography>
                            <Typography
                                variant="body2"
                                align="center"
                                color="rgba(255,255,255,0.7)"
                                mb={3}
                                sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                            >
                                Join 2,800+ volunteers making a real difference
                            </Typography>

                            {/* Success Message */}
                            {successMessage && (
                                <Typography
                                    align="center"
                                    sx={{
                                        color: "#10b981",
                                        backgroundColor: "rgba(16,185,129,0.1)",
                                        p: { xs: 1, sm: 1.2 },
                                        borderRadius: "8px",
                                        mb: 2,
                                        fontWeight: 500,
                                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    }}
                                >
                                    {successMessage}
                                </Typography>
                            )}

                            {/* Global Error */}
                            {formErrors.global && (
                                <Typography
                                    align="center"
                                    sx={{
                                        color: "#ef4444",
                                        backgroundColor: "rgba(239,68,68,0.1)",
                                        p: { xs: 1, sm: 1.2 },
                                        borderRadius: "8px",
                                        mb: 2,
                                        fontWeight: 500,
                                        fontSize: { xs: "0.8rem", sm: "0.875rem" },
                                    }}
                                >
                                    {formErrors.global}
                                </Typography>
                            )}

                            <form onSubmit={handleSignup}>
                                {/* Name Field */}
                                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                                    <StyledTextField
                                        name="name"
                                        placeholder="Full Name"
                                        fullWidth
                                        value={form.name}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('name')}
                                        error={touched.name && !!formErrors.name}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person sx={{ color: "rgba(255,255,255,0.6)", fontSize: { xs: 20, sm: 24 } }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {touched.name && formErrors.name && (
                                        <Typography sx={{ color: "#ef4444", fontSize: { xs: "0.75rem", sm: "0.8125rem" }, mt: 0.5, ml: 0.5 }}>
                                            {formErrors.name}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Email Field */}
                                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                                    <StyledTextField
                                        name="email"
                                        placeholder="Email"
                                        fullWidth
                                        value={form.email}
                                        onChange={(e) => {
                                            handleChange(e);
                                            handleEmailCheck(e.target.value);
                                        }}
                                        onBlur={() => handleBlur('email')}
                                        error={touched.email && !!formErrors.email}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email sx={{ color: "rgba(255,255,255,0.6)", fontSize: { xs: 20, sm: 24 } }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {isValidEmail(form.email) && !formErrors.email && emailStatus.message && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 0.5,
                                                ml: 0.5,
                                                color: emailStatus.exists ? "#ef4444" : "#10b981",
                                                fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                                            }}
                                        >
                                            {emailStatus.checking ? "Checking availability..." : emailStatus.message}
                                        </Typography>
                                    )}
                                    {touched.email && formErrors.email && (
                                        <Typography sx={{ color: "#ef4444", fontSize: { xs: "0.75rem", sm: "0.8125rem" }, mt: 0.5, ml: 0.5 }}>
                                            {formErrors.email}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Password Field */}
                                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                                    <StyledTextField
                                        name="password"
                                        placeholder="Password"
                                        type={showPassword ? "text" : "password"}
                                        fullWidth
                                        value={form.password}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('password')}
                                        error={touched.password && !!formErrors.password}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock sx={{ color: "rgba(255,255,255,0.6)", fontSize: { xs: 20, sm: 24 } }} />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={toggleShowPassword}
                                                        sx={{ color: "rgba(255,255,255,0.6)", p: { xs: 0.5, sm: 1 } }}
                                                        size="small"
                                                    >
                                                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {touched.password && formErrors.password && (
                                        <Typography sx={{ color: "#ef4444", fontSize: { xs: "0.75rem", sm: "0.8125rem" }, mt: 0.5, ml: 0.5 }}>
                                            {formErrors.password}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Confirm Password Field */}
                                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                                    <StyledTextField
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        type={showPassword ? "text" : "password"}
                                        fullWidth
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        onBlur={() => handleBlur('confirmPassword')}
                                        error={touched.confirmPassword && !!formErrors.confirmPassword}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Lock sx={{ color: "rgba(255,255,255,0.6)", fontSize: { xs: 20, sm: 24 } }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {touched.confirmPassword && formErrors.confirmPassword && (
                                        <Typography sx={{ color: "#ef4444", fontSize: { xs: "0.75rem", sm: "0.8125rem" }, mt: 0.5, ml: 0.5 }}>
                                            {formErrors.confirmPassword}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Terms Checkbox */}
                                <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={agree}
                                                onChange={(e) => {
                                                    setAgree(e.target.checked);
                                                    if (e.target.checked && formErrors.agree) {
                                                        const newErrors = { ...formErrors };
                                                        delete newErrors.agree;
                                                        setFormErrors(newErrors);
                                                    }
                                                }}
                                                sx={{
                                                    color: "rgba(255,255,255,0.6)",
                                                    "&.Mui-checked": { color: "#0891b2" },
                                                    padding: { xs: "6px", sm: "9px" },
                                                }}
                                                size="small"
                                            />
                                        }
                                        label={
                                            <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem" } }}>
                                                I agree to the{" "}
                                                <span
                                                    style={{
                                                        color: "#0891b2",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Terms of Service
                                                </span>{" "}
                                                and{" "}
                                                <span
                                                    style={{
                                                        color: "#0891b2",
                                                        textDecoration: "underline",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Privacy Policy
                                                </span>
                                            </Typography>
                                        }
                                    />
                                    {formErrors.agree && (
                                        <Typography sx={{ color: "#ef4444", fontSize: { xs: "0.75rem", sm: "0.8125rem" }, mt: 0.5, ml: 0.5 }}>
                                            {formErrors.agree}
                                        </Typography>
                                    )}
                                </Box>

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={loading}
                                    sx={{
                                        mt: { xs: 1.5, sm: 2 },
                                        mb: { xs: 1.5, sm: 2 },
                                        background: "#fff",
                                        color: "#0891b2",
                                        py: { xs: 1.1, sm: 1.3 },
                                        fontWeight: 700,
                                        fontSize: { xs: "0.9rem", sm: "0.9375rem" },
                                        borderRadius: "10px",
                                        textTransform: "none",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
                                        "&:hover": { background: "rgba(255,255,255,0.95)" },
                                        "&:disabled": {
                                            background: "rgba(255,255,255,0.5)",
                                            color: "rgba(8,145,178,0.5)"
                                        },
                                    }}
                                >
                                    {loading ? "Creating Account..." : "Create Account"}
                                </Button>

                                <Divider sx={{ my: { xs: 1.5, sm: 2 }, borderColor: "rgba(255,255,255,0.1)" }} />

                                {/* Sign In Link */}
                                <Typography variant="body2" align="center" color="rgba(255,255,255,0.8)" sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, mb: 1 }}>
                                    Already have an account?{" "}
                                    <span
                                        style={{
                                            color: "#fff",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => router.push("/login")}
                                    >
                                        Sign in
                                    </span>
                                </Typography>

                                {/* Forgot Password Link */}
                                <Typography variant="body2" align="center" color="rgba(255,255,255,0.7)" sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem" } }}>
                                    <span
                                        style={{
                                            color: "#0891b2",
                                            textDecoration: "underline",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => router.push("/forgot-password")}
                                    >
                                        Forgot your password?
                                    </span>
                                </Typography>
                            </form>
                        </GlassCard>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}