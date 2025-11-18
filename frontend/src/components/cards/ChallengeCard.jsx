import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    LinearProgress,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    Snackbar,
    Alert,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from "next/navigation";
import { useJoinedChallenges } from "@/context/JoinedChallengesContext";
import { getCurrentLocation, formatLocationError } from "@/utils/geolocation";

const ChallengeCard = ({ challenge }) => {
    const {
        _id,
        title,
        bannerImage,
        locationName,
        totalTrashCollected,
        goal,
        status,
        totalVolunteers,
        startDate,
        endDate,
    } = challenge;

    const router = useRouter();
    const { isJoined, joinChallenge } = useJoinedChallenges();
    const joined = isJoined(_id);

    const [openDialog, setOpenDialog] = useState(false);
    const [isJoining, setIsJoining] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    let bannerUrl = bannerImage;

    if (bannerImage?.startsWith("http")) {
        bannerUrl = bannerImage;
    } else if (bannerImage?.startsWith("/challangeimg")) {
        // Serves local images from /public/challangeimg/
        bannerUrl = bannerImage;
    } else {
        bannerUrl = `${process.env.NEXT_PUBLIC_API_URL}${bannerImage}`;
    }

    // When user clicks on the card
    const handleCardClick = () => {
        router.push(`/challenges/${_id}`);
    };

    // Open confirmation dialog
    const handleButtonClick = (e) => {
        e.stopPropagation();
        if (joined) {
            router.push(`/challenges/${_id}`);
        } else {
            setOpenDialog(true);
        }
    };

    const handleConfirmJoin = async () => {
        try {
            setIsJoining(true);

            // Get location
            let userLocation;
            try {
                setSnackbar({
                    open: true,
                    message: "Getting your location...",
                    severity: "info",
                });

                userLocation = await getCurrentLocation();
            } catch (locationError) {
                setSnackbar({
                    open: true,
                    message: formatLocationError(locationError),
                    severity: "error",
                });
                setIsJoining(false);
                setOpenDialog(false);
                return;
            }

            // Join challenge
            await joinChallenge(_id, userLocation);

            setSnackbar({
                open: true,
                message: "Successfully joined the challenge!",
                severity: "success",
            });

            setOpenDialog(false);
            setIsJoining(false);

            setTimeout(() => {
                router.push(`/challenges/${_id}`);
            }, 500);
        } catch (error) {
            const errorData = error.response?.data;
            const errorCode = errorData?.error;

            setIsJoining(false);
            setOpenDialog(false);

            if (errorCode === "LOCATION_TOO_FAR") {
                setSnackbar({
                    open: true,
                    message: `You're too far away to join this challenge.`,
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
    };

    const progress = goal > 0 ? Math.min((totalTrashCollected / goal) * 100, 100) : 0;

    const getStatusConfig = () => {
        const statuses = {
            active: { label: "Active", bgColor: "#10b981" },
            completed: { label: "Completed", bgColor: "#6b7280" },
            upcoming: { label: "Upcoming", bgColor: "#f59e0b" },
        };
        return statuses[status] || statuses.active;
    };

    const statusConfig = getStatusConfig();

    const formatDate = (date) => {
        if (!date) return "";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleCancelJoin = () => setOpenDialog(false);
    const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

    return (
        <>
            <Card
                onClick={handleCardClick}
                sx={{
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    transition: "0.3s",
                    "&:hover": {
                        transform: "translateY(-6px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                    },
                }}
            >
                {/* Banner Image */}
                <Box sx={{ height: 180, position: "relative" }}>
                    <CardMedia
                        component="img"
                        image={bannerUrl}
                        alt={title}
                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <Chip
                        label={statusConfig.label}
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            background: statusConfig.bgColor,
                            color: "white",
                            fontWeight: 600,
                        }}
                    />
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                        {title}
                    </Typography>

                    <Box sx={{ display: "flex", mb: 1 }}>
                        <LocationOnIcon sx={{ mr: 0.5, color: "#64748b" }} />
                        <Typography variant="body2" color="text.secondary">
                            {locationName}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", mb: 2 }}>
                        <CalendarTodayIcon sx={{ mr: 0.5, color: "#64748b" }} />
                        <Typography variant="body2" color="text.secondary">
                            {formatDate(startDate)} – {formatDate(endDate)}
                        </Typography>
                    </Box>

                    <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {totalTrashCollected} / {goal} items collected
                    </Typography>

                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 6, mb: 2, borderRadius: 3 }}
                    />

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Box sx={{ display: "flex" }}>
                            <PeopleIcon sx={{ mr: 0.5, color: "#64748b" }} />
                            <Typography variant="body2" color="text.secondary">
                                {totalVolunteers} volunteers
                            </Typography>
                        </Box>

                        {(status === "active" || status === "upcoming") && (
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={joined ? <CheckCircleIcon /> : null}
                                sx={{
                                    backgroundColor: joined ? "#10b981" : "#0ea5e9",
                                    color: "white",
                                    px: 2.5,
                                }}
                                onClick={handleButtonClick}
                            >
                                {joined ? "Joined" : "Join"}
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>

            {/* Join Confirmation Dialog */}
            <Dialog open={openDialog} onClose={handleCancelJoin}>
                <DialogTitle>Join Challenge?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to join <strong>{title}</strong>?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelJoin}>Cancel</Button>
                    <Button onClick={handleConfirmJoin} variant="contained">
                        {isJoining ? "Joining…" : "Join Challenge"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
            </Snackbar>
        </>
    );
};

export default ChallengeCard;
