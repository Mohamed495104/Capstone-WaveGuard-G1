import React from "react";
import { Box, Typography } from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PeopleIcon from "@mui/icons-material/People";
import DeleteIcon from "@mui/icons-material/Delete";
import PublicIcon from "@mui/icons-material/Public";
import { StatsContainerStyle, StatItemStyle } from "@/app/(protected)/challenges/challenge.styles";

const StatItem = ({ icon, value, label }) => (
    <Box sx={StatItemStyle}>
        {icon}
        <Typography variant="h5" component="p" sx={{ fontWeight: "bold", mt: 1 }}>
            {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {label}
        </Typography>
    </Box>
);

const StatsCard = ({ stats }) => {
    const statItems = [
        {
            icon: <EmojiEventsIcon color="primary" sx={{ fontSize: 40 }} />,
            value: stats?.totalChallenges || 0,
            label: "Total Challenges",
        },
        {
            icon: <PeopleIcon color="primary" sx={{ fontSize: 40 }} />,
            value: stats?.activeVolunteers || 0,
            label: "Active Volunteers",
        },
        {
            icon: <DeleteIcon color="primary" sx={{ fontSize: 40 }} />,
            value: stats?.itemsCollected?.toLocaleString() || 0,
            label: "Items Collected",
        },
        {
            icon: <PublicIcon color="primary" sx={{ fontSize: 40 }} />,
            value: stats?.provinces || 0,
            label: "Provinces Involved",
        },
    ];

    return (
        <Box sx={StatsContainerStyle}>
            {statItems.map((item) => (
                <StatItem key={item.label} {...item} />
            ))}
        </Box>
    );
};

export default StatsCard;