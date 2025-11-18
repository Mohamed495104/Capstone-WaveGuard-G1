"use client";
import React, { useState, useRef, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { useAuthContext } from "@/context/AuthContext";
import {
  validateEmail,
  validatePassword,
  validateName,
  getPasswordStrength,
} from "@/utils/validation";
import {
  Box,
  Typography,
  Button,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  Container,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  CheckCircle,
  Google as GoogleIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import {
  GlassCard,
  StyledTextField,
  BackgroundStyle,
  PrimaryButtonStyle,
  FeatureBoxStyle,
} from "./signup.styles";

export default function SignupPage() {
  const { signup, googleLogin } = useAuth();
  const { isAuthenticated } = useAuthContext();
  const router = useRouter();

  const [isLoaded, setIsLoaded] = useState(false);
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
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState({
    checking: false,
    exists: false,
    message: "",
  });
  const [passwordStrength, setPasswordStrength] = useState({
    strength: "none",
    color: "#999999",
    text: "",
  });
  const debounceRef = useRef(null);

  // Redirect away if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home");
    }
  }, [isAuthenticated, router]);

  // Fade-in animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // === Validation helpers ===
  const checkEmailAvailability = (email) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const validation = validateEmail(email);
    if (!validation.valid) {
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
            ? " This email is already registered."
            : " Email available for registration.",
        });
      } catch (err) {
        if (err.response?.data?.message) {
          setEmailStatus({ checking: false, exists: false, message: "" });
          setFormErrors((prev) => ({
            ...prev,
            email: err.response.data.message,
          }));
        } else {
          setEmailStatus({ checking: false, exists: false, message: "" });
        }
      }
    }, 600);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "name": {
        const val = validateName(value);
        return val.valid ? "" : val.error;
      }
      case "email": {
        const val = validateEmail(value);
        if (!val.valid) return val.error;
        if (emailStatus.exists) return "This email is already registered.";
        return "";
      }
      case "password": {
        const val = validatePassword(value);
        return val.valid ? "" : val.error;
      }
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== form.password) return "Passwords do not match";
        return "";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(form).forEach((field) => {
      const error = validateField(field, form[field]);
      if (error) errors[field] = error;
    });
    if (!agree) {
      errors.agree =
        "You must agree to the Terms of Service and Privacy Policy to continue";
    }
    return errors;
  };

  // === Handlers ===
  const toggleShowPassword = () => setShowPassword((p) => !p);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email") checkEmailAvailability(value);
    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }

    if (touched[name]) {
      const error = validateField(name, value);
      setFormErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, form[name]);
    if (error) {
      setFormErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      await signup(form.email, form.password, form.name);
      setSuccessMessage("Account created! Redirecting you to your dashboard…");
    } catch (err) {
      setFormErrors({
        global: err.message || "Signup failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    try {
      await googleLogin();
    } catch (err) {
      setGoogleLoading(false);
      setFormErrors({
        global: err.message || "Could not start Google sign-in.",
      });
    }
  };

  if (isAuthenticated) return null;

  return (
    <Box
      component="main"
      role="main"
      sx={{
        ...BackgroundStyle,
        opacity: isLoaded ? 1 : 0,
        transition: "opacity 0.8s ease-in-out",
      }}
    >
      <Container maxWidth="xl" sx={{ py: { xs: 3, sm: 4, md: 6 } }}>
        <Grid
          container
          spacing={{ xs: 3, sm: 4, md: 6 }}
          alignItems="center"
          justifyContent="center"
        >
          {/* LEFT PANEL – Branding */}
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
            }}
          >
            {/* Logo + Title */}
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
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Image
                  src="/images/logoblue-optimized.webp"
                  alt="WaveGuard logo"
                  width={36}
                  height={36}
                  style={{ objectFit: "contain" }}
                />
              </Box>
              <Typography
                component="h1" // first-level heading for page
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
              component="p"
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

            {/* Features */}
            <Box sx={FeatureBoxStyle} aria-label="WaveGuard signup features">
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

          {/* RIGHT PANEL – Form */}
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
          >
            <GlassCard
              sx={{ width: "100%", maxWidth: { xs: "100%", sm: 480, md: 440 } }}
            >
              {/* Header */}
              <Typography
                component="h2" // second-level heading
                variant="h5"
                align="center"
                fontWeight={700}
                color="#fff"
                mb={0.5}
              >
                Create Your Account
              </Typography>
              <Typography
                variant="body2"
                align="center"
                color="rgba(255,255,255,0.7)"
                mb={3}
              >
                Join 2,800+ volunteers making a real difference
              </Typography>

              {/* Messages */}
              {successMessage && (
                <Typography
                  align="center"
                  sx={{
                    color: "#10b981",
                    backgroundColor: "rgba(16,185,129,0.1)",
                    p: 1,
                    borderRadius: "8px",
                    mb: 2,
                    fontWeight: 500,
                  }}
                >
                  {successMessage}
                </Typography>
              )}

              {formErrors.global && (
                <Typography
                  align="center"
                  sx={{
                    color: "#ef4444",
                    backgroundColor: "rgba(239,68,68,0.1)",
                    p: 1,
                    borderRadius: "8px",
                    mb: 2,
                    fontWeight: 500,
                  }}
                >
                  {formErrors.global}
                </Typography>
              )}

              {/* Google Button */}
              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoogleSignup}
                disabled={googleLoading}
                startIcon={<GoogleIcon />}
                aria-label="Continue with Google"
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

              {/* OR Divider */}
              <Box sx={{ position: "relative", my: 2.5 }}>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                <Typography
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    px: 2,
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    backgroundColor: "transparent",
                  }}
                >
                  OR
                </Typography>
              </Box>

              {/* SIGNUP FORM */}
              <form onSubmit={handleSignup} aria-label="Signup form">
                {/* Name */}
                <Box sx={{ mb: 2.5 }}>
                  <StyledTextField
                    id="signup-name"
                    name="name"
                    placeholder="Full Name"
                    fullWidth
                    value={form.name}
                    onChange={handleChange}
                    onBlur={() => handleBlur("name")}
                    error={touched.name && !!formErrors.name}
                    inputProps={{
                      "aria-label": "Full name",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: "rgba(255,255,255,0.6)" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {touched.name && formErrors.name && (
                    <Typography
                      sx={{
                        color: "#ef4444",
                        fontSize: "0.8rem",
                        mt: 0.5,
                        ml: 0.5,
                      }}
                    >
                      {formErrors.name}
                    </Typography>
                  )}
                </Box>

                {/* Email */}
                <Box sx={{ mb: 2.5 }}>
                  <StyledTextField
                    id="signup-email"
                    name="email"
                    placeholder="Email"
                    fullWidth
                    value={form.email}
                    onChange={handleChange}
                    onBlur={() => handleBlur("email")}
                    error={touched.email && !!formErrors.email}
                    inputProps={{
                      "aria-label": "Email address",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: "rgba(255,255,255,0.6)" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {emailStatus.checking ? (
                    <Typography
                      sx={{
                        color: "#facc15",
                        fontSize: "0.8rem",
                        mt: 0.5,
                        ml: 0.5,
                      }}
                    >
                      Checking email...
                    </Typography>
                  ) : emailStatus.message ? (
                    <Typography
                      sx={{
                        color: emailStatus.exists ? "#ef4444" : "#10b981",
                        fontSize: "0.8rem",
                        mt: 0.5,
                        ml: 0.5,
                      }}
                    >
                      {emailStatus.message}
                    </Typography>
                  ) : (
                    touched.email &&
                    formErrors.email && (
                      <Typography
                        sx={{
                          color: "#ef4444",
                          fontSize: "0.8rem",
                          mt: 0.5,
                          ml: 0.5,
                        }}
                      >
                        {formErrors.email}
                      </Typography>
                    )
                  )}
                </Box>

                {/* Password */}
                <Box sx={{ mb: 2.5 }}>
                  <StyledTextField
                    id="signup-password"
                    name="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={form.password}
                    onChange={handleChange}
                    onBlur={() => handleBlur("password")}
                    error={touched.password && !!formErrors.password}
                    inputProps={{
                      "aria-label": "Password",
                    }}
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
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            sx={{ color: "rgba(255,255,255,0.6)" }}
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
                  {/* Password Strength Indicator */}
                  {form.password && passwordStrength.strength !== "none" && (
                    <Box sx={{ mt: 1 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.7)",
                          }}
                        >
                          Password Strength
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: passwordStrength.color,
                            fontWeight: 600,
                          }}
                        >
                          {passwordStrength.text}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={
                          passwordStrength.strength === "weak"
                            ? 33
                            : passwordStrength.strength === "medium"
                            ? 66
                            : passwordStrength.strength === "strong"
                            ? 100
                            : 0
                        }
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: "rgba(255,255,255,0.1)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: passwordStrength.color,
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Box>
                  )}
                  {touched.password && formErrors.password && (
                    <Typography
                      sx={{
                        color: "#ef4444",
                        fontSize: "0.8rem",
                        mt: 0.5,
                        ml: 0.5,
                      }}
                    >
                      {formErrors.password}
                    </Typography>
                  )}
                </Box>

                {/* Confirm Password */}
                <Box sx={{ mb: 2.5 }}>
                  <StyledTextField
                    id="signup-confirm-password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onBlur={() => handleBlur("confirmPassword")}
                    error={
                      touched.confirmPassword && !!formErrors.confirmPassword
                    }
                    inputProps={{
                      "aria-label": "Confirm password",
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "rgba(255,255,255,0.6)" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                  {touched.confirmPassword && formErrors.confirmPassword && (
                    <Typography
                      sx={{
                        color: "#ef4444",
                        fontSize: "0.8rem",
                        mt: 0.5,
                        ml: 0.5,
                      }}
                    >
                      {formErrors.confirmPassword}
                    </Typography>
                  )}
                </Box>

                {/* Terms */}
                <Box sx={{ mb: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        sx={{
                          color: "rgba(255,255,255,0.6)",
                          "&.Mui-checked": { color: "#0891b2" },
                        }}
                      />
                    }
                    label={
                      <Typography
                        variant="body2"
                        color="rgba(255,255,255,0.8)"
                      >
                        I agree to the{" "}
                        <span
                          style={{
                            color: "#0891b2",
                            cursor: "pointer",
                          }}
                          // Add routing if you create these pages later
                        >
                          Terms of Service
                        </span>{" "}
                        and{" "}
                        <span
                          style={{
                            color: "#0891b2",
                            cursor: "pointer",
                          }}
                        >
                          Privacy Policy
                        </span>
                      </Typography>
                    }
                  />
                  {formErrors.agree && (
                    <Typography
                      sx={{
                        color: "#ef4444",
                        fontSize: "0.8rem",
                        mt: 0.5,
                        ml: 0.5,
                      }}
                    >
                      {formErrors.agree}
                    </Typography>
                  )}
                </Box>

                {/* Submit */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={PrimaryButtonStyle}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>

                <Divider
                  sx={{
                    my: { xs: 1.5, sm: 2 },
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />

                {/* Redirects */}
                <Typography
                  variant="body2"
                  align="center"
                  color="rgba(255,255,255,0.8)"
                  sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, mb: 1 }}
                >
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

                <Typography
                  variant="body2"
                  align="center"
                  color="rgba(255,255,255,0.7)"
                  sx={{ fontSize: { xs: "0.75rem", sm: "0.8125rem" } }}
                >
                  <span
                    style={{
                      color: "#0891b2",
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
