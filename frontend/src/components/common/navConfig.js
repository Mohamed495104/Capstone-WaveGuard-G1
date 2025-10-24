"use client";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";

export const navItems = [
    { label: "Home", path: "/", icon: HomeRoundedIcon },
    { label: "Challenges", path: "/challenges", icon: PhotoCameraRoundedIcon },
    { label: "Upload", path: "/upload", icon: AddPhotoAlternateRoundedIcon },
    { label: "Dashboard", path: "/dashboard", icon: DashboardRoundedIcon },
    { label: "Achievements", path: "/achievements", icon: EmojiEventsRoundedIcon },
];

export const mobileOrder = ["/", "/challenges", "/upload", "/dashboard", "/achievements"];