"use client";

import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Divider, Avatar } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonOutline from "@mui/icons-material/PersonOutline";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import { useAuthContext } from "@/context/AuthContext";
import { apiCall } from "@/utils/api";

export default function MobileHeader() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [profileImage, setProfileImage] = useState('');
    const router = useRouter();
    const { logout } = useAuth();
    const { sessionReady, authVersion } = useAuthContext();

    // Fetch user profile to get profile image - only when session is ready
    useEffect(() => {
        const fetchUserProfile = async () => {
            // Wait for session to be ready before making API calls
            if (!sessionReady) {
                return;
            }
            
            try {
                const res = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {}, false, { useCache: false });
                if (res?.data?.profileImage) {
                    // Ensure profile image URL is properly formatted
                    const imageUrl = res.data.profileImage.startsWith('http') 
                        ? res.data.profileImage 
                        : `${process.env.NEXT_PUBLIC_API_URL}${res.data.profileImage}`;
                    setProfileImage(imageUrl);
                } else {
                    setProfileImage('');
                }
            } catch (error) {
                if (error.isRateLimitError) {
                    console.warn('Rate limit reached when fetching profile:', error.message);
                } else if (error.response?.status === 401) {
                    // Session expired or invalid, don't log as error
                    console.warn('Session expired when fetching profile');
                } else {
                    console.error('Failed to fetch profile:', error);
                }
                // Keep default empty string on error
            }
        };

        fetchUserProfile();
    }, [sessionReady, authVersion]);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleProfile = () => {
        router.push("/profile");
        handleMenuClose();
    };

    const handleSupport = () => {
        router.push("/support");
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
                bgcolor: "#fff",
                borderBottom: "1px solid rgba(0,0,0,0.07)",
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                py: 1,
                boxShadow: "0 1px 6px rgba(0,0,0,0.03)",
            }}
        >
            <Box display="flex" alignItems="center">
                <Box
                    component="img"
                    src="/images/2.png"
                    alt="MarineCare"
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
                    MarineCare
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
                        minWidth: 180,
                        borderRadius: 2,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
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
                            bgcolor: "rgba(8, 145, 178, 0.08)",
                        }
                    }}
                >
                    <AccountCircleRoundedIcon sx={{ fontSize: 22, color: "#0891b2" }} />
                    <Typography variant="body2" fontWeight={500}>
                        Profile
                    </Typography>
                </MenuItem>
                <MenuItem
                    onClick={handleSupport}
                    sx={{
                        py: 1.5,
                        px: 2,
                        gap: 1.5,
                        "&:hover": {
                            bgcolor: "rgba(8, 145, 178, 0.08)",
                        }
                    }}
                >
                    <SupportAgentIcon sx={{ fontSize: 22, color: "#0891b2" }} />
                    <Typography variant="body2" fontWeight={500}>
                        Support
                    </Typography>
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