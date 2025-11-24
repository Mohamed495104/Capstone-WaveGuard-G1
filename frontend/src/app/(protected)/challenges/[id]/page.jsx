"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  LinearProgress,
  Chip,
  Grid,
  Stack,
  Alert,
  Snackbar,
  Divider,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShieldIcon from "@mui/icons-material/Shield";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { useRouter } from "next/navigation";
import { use } from "react";

import withAuth from "@/components/auth/withAuth";
import { useAuthContext } from "@/context/AuthContext";
import { useJoinedChallenges } from "@/context/JoinedChallengesContext";
import { apiCall } from "@/utils/api";
import { getCurrentLocation, formatLocationError } from "@/utils/geolocation";

function ChallengeDetailsPage({ params }) {
  const { id } = use(params);

  const router = useRouter();
  const { user } = useAuthContext();
  const { joinChallenge, leaveChallenge, isJoined } = useJoinedChallenges();

  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Helper: Get proper banner image URL
  const getBannerImageUrl = (bannerImage) => {
    if (!bannerImage) return "";
    
    if (bannerImage.startsWith("http://") || bannerImage.startsWith("https://")) {
      return bannerImage;
    }
    
    if (bannerImage.startsWith("/api/")) {
      return `${process.env.NEXT_PUBLIC_API_URL}${bannerImage}`;
    }
    
    return `${process.env.NEXT_PUBLIC_API_URL}${bannerImage}`;
  };

  // Helper: Trash categories
  const getCategoryDisplay = (key, count) => {
    const categoryMap = {
      plastic_bottle: {
        type: "Plastic Bottles",
        color: "#0ea5e9",
        icon: "🥤",
      },
      plastic_bag: {
        type: "Plastic Bags",
        color: "#22c55e",
        icon: "🛍️",
      },
      cigarette_butt: {
        type: "Cigarette Butts",
        color: "#f97316",
        icon: "🚬",
      },
      metal_can: {
        type: "Metal Cans",
        color: "#64748b",
        icon: "🥫",
      },
      paper_cardboard: {
        type: "Paper / Cardboard",
        color: "#facc15",
        icon: "📦",
      },
      glass_bottle: {
        type: "Glass Bottles",
        color: "#22c55e",
        icon: "🍾",
      },
      other: {
        type: "Other Items",
        color: "#6366f1",
        icon: "♻️",
      },
    };

    return { ...(categoryMap[key] || categoryMap.other), count: count || 0 };
  };

  const getTrashCategories = () => {
    if (!challenge || !challenge.wasteBreakdown) return [];

    const b = challenge.wasteBreakdown || {};

    return [
      getCategoryDisplay("plastic_bottle", b.plastic_bottle),
      getCategoryDisplay("plastic_bag", b.plastic_bag),
      getCategoryDisplay("cigarette_butt", b.cigarette_butt),
      getCategoryDisplay("metal_can", b.metal_can),
      getCategoryDisplay("paper_cardboard", b.paper_cardboard),
      getCategoryDisplay("glass_bottle", b.glass_bottle),
      getCategoryDisplay("other", b.other),
    ];
  };

  const trashCategories = getTrashCategories();

  // Fetch challenge data
  const fetchChallenge = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      const response = await apiCall(
        "get",
        `${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${id}`
      );
      setChallenge(response.data);
    } catch (error) {
      console.error("Error fetching challenge:", error);
      setSnackbar({
        open: true,
        message: "Error loading challenge",
        severity: "error",
      });
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const refreshChallengeData = async () => {
    try {
      const response = await apiCall(
        "get",
        `${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${id}`
      );
      setChallenge((prev) => {
        if (!prev) return response.data;
        const n = response.data;

        if (
          prev.totalTrashCollected !== n.totalTrashCollected ||
          prev.totalVolunteers !== n.totalVolunteers ||
          JSON.stringify(prev.wasteBreakdown) !==
            JSON.stringify(n.wasteBreakdown)
        ) {
          return n;
        }
        return prev;
      });
    } catch (e) {
      console.error("Error refreshing challenge:", e);
    }
  };

  useEffect(() => {
    fetchChallenge(true);
  }, [id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshChallengeData();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [id]);

  // Helpers
  const formatDateReadable = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (loading || !challenge) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f3f4f6",
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Typography color="text.secondary">Challenge not found.</Typography>
        )}
      </Box>
    );
  }

  const progress =
    challenge.goal > 0
      ? Math.min((challenge.totalTrashCollected / challenge.goal) * 100, 100)
      : 0;

  const hasCoordinates =
    challenge.location &&
    Array.isArray(challenge.location.coordinates) &&
    challenge.location.coordinates.length === 2;

  const longitude = hasCoordinates ? challenge.location.coordinates[0] : null;
  const latitude = hasCoordinates ? challenge.location.coordinates[1] : null;

  const bannerImageUrl = getBannerImageUrl(challenge.bannerImage);

  return (
    <Box sx={{ bgcolor: "#f4f7fb", minHeight: "100vh", pb: 6 }}>
      {/* Back link */}
      <Container maxWidth="lg" sx={{ pt: 3, mb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push("/challenges")}
          sx={{
            textTransform: "none",
            color: "#64748b",
            fontWeight: 600,
            "&:hover": { bgcolor: "#e5edf6", color: "#111827" },
          }}
        >
          Back to Challenges
        </Button>
      </Container>

      {/* HERO / BANNER */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 260, sm: 320, md: 360 },
          overflow: "hidden",
          mb: { xs: 5, sm: 6 },
        }}
      >
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: bannerImageUrl ? `url(${bannerImageUrl})` : 'none',
            backgroundColor: bannerImageUrl ? 'transparent' : '#64748b',
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: "scale(1.02)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(15,23,42,0.5) 0%, rgba(15,23,42,0.9) 75%)",
          }}
        />
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            pb: { xs: 3, sm: 4 },
          }}
        >
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Chip
              label={challenge.status === "active" ? "Active" : challenge.status}
              size="small"
              sx={{
                bgcolor:
                  challenge.status === "active"
                    ? "#22c55e"
                    : challenge.status === "completed"
                    ? "#6b7280"
                    : "#f97316",
                color: "#fff",
                fontWeight: 700,
                fontSize: "0.75rem",
              }}
            />
            <Chip
              label="Beginner Friendly"
              size="small"
              sx={{
                bgcolor: "rgba(15,23,42,0.6)",
                color: "#e5e7eb",
                borderColor: "rgba(148,163,184,0.4)",
                borderWidth: 1,
                borderStyle: "solid",
                fontSize: "0.75rem",
              }}
            />
          </Stack>

          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontWeight: 800,
              color: "white",
              mb: 1,
              letterSpacing: "-0.03em",
              fontSize: { xs: "2rem", sm: "2.6rem", md: "3rem" },
            }}
          >
            {challenge.title}
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 0.75, sm: 3 }}
            sx={{ color: "#e5e7eb", fontSize: "0.9rem", mb: 3 }}
          >
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <LocationOnIcon sx={{ fontSize: 18 }} />
              <Typography component="span">
                {challenge.region || challenge.locationName}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <CalendarTodayIcon sx={{ fontSize: 18 }} />
              <Typography component="span">
                {formatDateReadable(challenge.startDate)} –{" "}
                {formatDateReadable(challenge.endDate)}
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.75}>
              <PeopleIcon sx={{ fontSize: 18 }} />
              <Typography component="span">
                {challenge.totalVolunteers.toLocaleString()} volunteers
              </Typography>
            </Stack>
          </Stack>

          {/* Join/Upload Buttons */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { xs: "stretch", sm: "center" } }}>
            {isJoined(challenge._id) ? (
              <>
                <Chip
                  label="✓ Joined Challenge"
                  sx={{
                    bgcolor: "rgba(34, 197, 94, 0.2)",
                    color: "#ffffff",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    py: 2.5,
                    px: 1,
                    borderRadius: 2,
                    border: "2px solid rgba(34, 197, 94, 0.5)",
                    backdropFilter: "blur(10px)",
                  }}
                />
                {challenge.status === "active" && (
                  <Button
                    variant="contained"
                    onClick={() => router.push("/upload")}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "1rem",
                      borderRadius: 2,
                      py: 1.5,
                      px: 4,
                      bgcolor: "#0ea5e9",
                      color: "#ffffff",
                      boxShadow: "0 4px 14px rgba(14, 165, 233, 0.4)",
                      "&:hover": { 
                        bgcolor: "#0284c7",
                        boxShadow: "0 6px 20px rgba(14, 165, 233, 0.6)",
                      },
                    }}
                  >
                    Upload Cleanup
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="contained"
                disabled={challenge.status !== "active"}
                onClick={async () => {
                  if (!user) return;
                  
                  try {
                    setSnackbar({
                      open: true,
                      message: "Requesting your location...",
                      severity: "info",
                    });

                    let userLocation;
                    try {
                      userLocation = await getCurrentLocation();
                    } catch (locationError) {
                      console.error("Location error:", locationError);
                      setSnackbar({
                        open: true,
                        message: "Location access denied. Please enable location permissions in your browser settings to join this challenge.",
                        severity: "error",
                      });
                      return;
                    }

                    await joinChallenge(challenge._id, userLocation);
                    await refreshChallengeData();

                    setSnackbar({
                      open: true,
                      message: "Successfully joined the challenge!",
                      severity: "success",
                    });
                  } catch (error) {
                    console.error("Error joining challenge:", error);
                    const errorData = error.response?.data;
                    const errorCode = errorData?.error;

                    if (errorCode === "LOCATION_TOO_FAR") {
                      const distance = errorData?.distance;
                      const maxDistance = errorData?.maxDistance;
                      setSnackbar({
                        open: true,
                        message: `You are ${distance} km from the challenge location (max allowed: ${maxDistance} km).`,
                        severity: "error",
                      });
                    } else if (errorCode === "LOCATION_REQUIRED") {
                      setSnackbar({
                        open: true,
                        message: "Location is required to join this challenge.",
                        severity: "error",
                      });
                    } else {
                      setSnackbar({
                        open: true,
                        message: errorData?.message || "Error joining challenge",
                        severity: "error",
                      });
                    }
                  }
                }}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1rem",
                  borderRadius: 2,
                  py: 1.5,
                  px: 4,
                  bgcolor: "#0ea5e9",
                  color: "#ffffff",
                  boxShadow: "0 4px 14px rgba(14, 165, 233, 0.4)",
                  "&:hover": { 
                    bgcolor: "#0284c7",
                    boxShadow: "0 6px 20px rgba(14, 165, 233, 0.6)",
                  },
                  "&:disabled": {
                    bgcolor: "rgba(255, 255, 255, 0.2)",
                    color: "rgba(255, 255, 255, 0.5)",
                  },
                }}
              >
                {challenge.status === "active" ? "Join Challenge" : "Challenge Not Active"}
              </Button>
            )}
          </Stack>
        </Container>
      </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="lg">
        {/* About card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: { xs: 2.5, sm: 3 },
            mb: 3,
            bgcolor: "#ffffff",
            boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}
          >
            About This Challenge
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#4b5563", lineHeight: 1.8, mb: 2.5 }}
          >
            {challenge.description}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "999px",
                    bgcolor: "#e0f2fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <PeopleIcon sx={{ fontSize: 20, color: "#0284c7" }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ textTransform: "uppercase", color: "#6b7280" }}
                  >
                    Organizer
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#111827" }}
                  >
                    {challenge.organizer || "Local Environmental Group"}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "999px",
                    bgcolor: "#dcfce7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 20, color: "#16a34a" }} />
                </Box>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{ textTransform: "uppercase", color: "#6b7280" }}
                  >
                    Time Commitment
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#111827" }}
                  >
                    2–4 hours per session
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Challenge Progress */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: { xs: 2.5, sm: 3 },
            mb: 3,
            bgcolor: "#ffffff",
            boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#0f172a" }}
            >
              Challenge Progress
            </Typography>
            <Chip
              label={`${progress.toFixed(1)}% of goal reached`}
              size="small"
              sx={{
                bgcolor: "#e0f2fe",
                color: "#0369a1",
                fontWeight: 600,
              }}
            />
          </Box>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            sx={{ mb: 1 }}
          >
            <Typography
              variant="body2"
              sx={{ color: "#6b7280", fontWeight: 500 }}
            >
              Items Collected
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: 700, color: "#0284c7" }}
            >
              {challenge.totalTrashCollected.toLocaleString()} /{" "}
              {challenge.goal.toLocaleString()}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 999,
              bgcolor: "#e5e7eb",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                backgroundColor: "#0ea5e9",
              },
            }}
          />

          {/* category breakdown */}
          <Grid container spacing={2} sx={{ mt: 2.5 }}>
            {trashCategories.map((cat) => (
              <Grid item xs={6} sm={3} md={3} key={cat.type}>
                <Box
                  sx={{
                    textAlign: "center",
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "#f9fafb",
                  }}
                >
                  <Typography sx={{ fontSize: "1.8rem", mb: 0.5 }}>
                    {cat.icon}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 800, color: "#0f172a", mb: 0.25 }}
                  >
                    {cat.count.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "#6b7280", fontWeight: 500 }}
                  >
                    {cat.type}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Cleanup Location Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: { xs: 2.5, sm: 3 },
            mb: 3,
            bgcolor: "#ffffff",
            boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}
          >
            Cleanup Location
          </Typography>

          <Stack spacing={1.2} sx={{ color: "#4b5563", mb: 2 }}>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <LocationOnIcon sx={{ fontSize: 20, color: "#0ea5e9" }} />
              <Typography variant="body2">
                {challenge.locationName} – {challenge.province}
                {challenge.region ? `, ${challenge.region}` : ""}
              </Typography>
            </Stack>

            <Typography variant="body2">
              <strong>Latitude:</strong>{" "}
              {latitude !== null ? latitude.toFixed(5) : "N/A"}
            </Typography>
            <Typography variant="body2">
              <strong>Longitude:</strong>{" "}
              {longitude !== null ? longitude.toFixed(5) : "N/A"}
            </Typography>
          </Stack>

          <Typography variant="caption" sx={{ color: "#9ca3af" }}>
            Coordinates are stored as GeoJSON (Point) with order:
            [longitude, latitude].
          </Typography>
        </Paper>

        {/* Details Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            p: { xs: 2.5, sm: 3 },
            mb: 3,
            bgcolor: "#ffffff",
            boxShadow: "0 18px 45px rgba(15,23,42,0.06)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 3, color: "#0f172a" }}
          >
            Details
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}
              >
                What to Bring
              </Typography>
              <Stack spacing={1.2} sx={{ color: "#4b5563", mb: 3 }}>
                {[
                  "Reusable gloves",
                  "Reusable bags or buckets",
                  "Closed-toe shoes",
                  "Sun protection & water",
                ].map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1}
                    alignItems="center"
                  >
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 18, color: "#22c55e" }}
                    />
                    <Typography variant="body2">{item}</Typography>
                  </Stack>
                ))}
              </Stack>

              <Divider sx={{ my: 2.5 }} />

              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 1.5, color: "#0f172a" }}
              >
                What to Expect
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#4b5563", lineHeight: 1.7 }}
              >
                Beach cleanup activities, AI-powered waste classification,
                community engagement, and environmental education.
                Supplies and guidance are provided on-site by the
                organizers.
              </Typography>
            </Grid>

            <Grid item xs={12} md={5}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: { xs: 2.5, sm: 3 },
                  bgcolor: "#ecfdf5",
                  boxShadow: "0 18px 45px rgba(15,23,42,0.04)",
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  mb={2}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "999px",
                      bgcolor: "#bbf7d0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ShieldIcon sx={{ fontSize: 20, color: "#16a34a" }} />
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, color: "#14532d" }}
                  >
                    Safety First
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ color: "#166534", lineHeight: 1.7 }}
                >
                  Always prioritize your safety. Avoid handling sharp,
                  heavy, or hazardous materials and report dangerous items
                  to event organizers. Follow local health and safety
                  guidance at all times.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default withAuth(ChallengeDetailsPage);