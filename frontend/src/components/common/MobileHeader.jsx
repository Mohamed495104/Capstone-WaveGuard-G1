"use client";

import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Divider, Avatar, Switch } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutline from "@mui/icons-material/PersonOutline";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { apiCall } from "@/utils/api";
import { useTheme as useCustomTheme } from "@/context/ThemeContext";
import { useTheme } from "@mui/material/styles";

export default function MobileHeader() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileImage, setProfileImage] = useState('');
    const router = useRouter();
    const { logout } = useAuth();
    const { mode, toggleTheme } = useCustomTheme();
    const muiTheme = useTheme();

    // Fetch user profile to get profile image
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`);
                if (res?.data?.profileImage) {
                    // Ensure profile image URL is properly formatted
                    const imageUrl = res.data.profileImage.startsWith('http') 
                        ? res.data.profileImage 
                        : `${process.env.NEXT_PUBLIC_API_URL}${res.data.profileImage}`;
                    setProfileImage(imageUrl);
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
                // Keep default empty string on error
            }
        };

        fetchUserProfile();
    }, []);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleProfile = () => {
        router.push("/profile");
        handleMenuClose();
    };

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        handleMenuClose();
    };

    return (
        <Box
            component="header"
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1200,
                height: 56,
                bgcolor: muiTheme.palette.background.paper,
                borderBottom: `1px solid ${muiTheme.palette.mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.07)'}`,
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                boxShadow: muiTheme.palette.mode === 'dark' 
                    ? "0 1px 6px rgba(0,0,0,0.3)" 
                    : "0 1px 6px rgba(0,0,0,0.03)",
            }}
        >
            <Box display="flex" alignItems="center">
                <Box
                    component="img"
                    src="/images/logoblue.png"
                    alt="WaveGuard"
                    sx={{
                        height: 32,
                        width: 32,
                        borderRadius: "50%",
                        mr: 1.2,
                    }}
                />
                <Typography
                    variant="h6"
                    fontWeight={700}
                    sx={{
                        fontSize: { xs: 18, sm: 20 },
                        letterSpacing: 0.2,
                        color: "#0891b2",
                    }}
                >
                    WaveGuard
                </Typography>
            </Box>

            <IconButton
                size="large"
                aria-label="profile menu"
                onClick={handleMenuOpen}
                sx={{
                    ml: 1,
                    p: 0.5,
                }}
            >
                <Avatar
                    src={profileImage || undefined}
                    sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "#0891b2",
                        fontSize: 16,
                        fontWeight: 600,
                    }}
                >
                    {!profileImage && <PersonOutline sx={{ fontSize: 24 }} />}
                </Avatar>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                sx={{
                    zIndex: 1300,
                    mt: 1,
                }}
                PaperProps={{
                    sx: {
                        minWidth: 200,
                        borderRadius: 2,
                        boxShadow: muiTheme.palette.mode === 'dark'
                            ? "0 4px 20px rgba(0,0,0,0.5)"
                            : "0 4px 20px rgba(0,0,0,0.1)",
                        bgcolor: muiTheme.palette.background.paper,
                    }
                }}
            >
                <MenuItem
                    onClick={handleProfile}
                    sx={{
                        py: 1.5,
                        px: 2,
                        gap: 1.5,
                        "&:hover": {
                            bgcolor: muiTheme.palette.mode === 'dark' 
                                ? "rgba(6, 182, 212, 0.15)" 
                                : "rgba(8, 145, 178, 0.08)",
                        }
                    }}
                >
                    <AccountCircleRoundedIcon sx={{ fontSize: 22, color: muiTheme.palette.primary.main }} />
                    <Typography variant="body2" fontWeight={500}>
                        Profile
                    </Typography>
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                    sx={{
                        py: 1.5,
                        px: 2,
                        gap: 1.5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        "&:hover": {
                            bgcolor: muiTheme.palette.mode === 'dark' 
                                ? "rgba(6, 182, 212, 0.15)" 
                                : "rgba(8, 145, 178, 0.08)",
                        }
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleTheme();
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {mode === 'dark' ? (
                            <LightModeIcon sx={{ fontSize: 22, color: muiTheme.palette.primary.main }} />
                        ) : (
                            <DarkModeIcon sx={{ fontSize: 22, color: muiTheme.palette.primary.main }} />
                        )}
                        <Typography variant="body2" fontWeight={500}>
                            Dark Mode
                        </Typography>
                    </Box>
                    <Switch
                        checked={mode === 'dark'}
                        onChange={toggleTheme}
                        size="small"
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: muiTheme.palette.primary.main,
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: muiTheme.palette.primary.main,
                            },
                        }}
                    />
                </MenuItem>
                <Divider sx={{ my: 0.5 }} />
                <MenuItem
                    onClick={handleLogout}
                    sx={{
                        py: 1.5,
                        px: 2,
                        gap: 1.5,
                        color: "#ef4444",
                        "&:hover": {
                            bgcolor: "rgba(239, 68, 68, 0.08)",
                        }
                    }}
                >
                    <LogoutRoundedIcon sx={{ fontSize: 22 }} />
                    <Typography variant="body2" fontWeight={500}>
                        Logout
                    </Typography>
                </MenuItem>
            </Menu>
        </Box>
    );
}