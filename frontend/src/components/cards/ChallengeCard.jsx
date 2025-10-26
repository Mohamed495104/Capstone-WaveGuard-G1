import React from "react";
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    LinearProgress,
    Chip,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { CardStyle, CardContentStyle, ProgressBarContainer } from "@/app/(protected)/challenges/challenge.styles";

const ChallengeCard = ({ challenge }) => {
    const {
        title,
        bannerImage,
        locationName,
        totalTrashCollected,
        goal,
        status,
    } = challenge;

    const progress = goal > 0 ? (totalTrashCollected / goal) * 100 : 0;

    const getStatusChip = () => {
        switch (status) {
            case "active":
                return <Chip label="Active" color="success" size="small" />;
            case "completed":
                return <Chip label="Completed" color="primary" size="small" />;
            case "upcoming":
                return <Chip label="Upcoming" color="warning" size="small" />;
            default:
                return null;
        }
    };

    return (
        <Card sx={CardStyle}>
            <CardMedia
                component="img"
                height="160"
                image={bannerImage || "/images/placeholder.jpg"}
                alt={`Banner for ${title}`}
            />
            <CardContent sx={CardContentStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                        {title}
                    </Typography>
                    {getStatusChip()}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", mb: 2 }}>
                    <LocationOnIcon fontSize="small" sx={{ mr: 0.5 }} />
                    <Typography variant="body2">{locationName}</Typography>
                </Box>

                <Box sx={ProgressBarContainer}>
                    <Typography variant="body2" color="text.secondary">
                        {totalTrashCollected.toLocaleString()} / {goal.toLocaleString()} items collected
                    </Typography>
                    <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ height: 8, borderRadius: 5, mt: 0.5 }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default ChallengeCard;