"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Menu, MenuItem, Divider } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

export default function MobileHeader() {
    const [anchorEl, setAnchorEl] = useState(null);
    const router = useRouter();
    const { logout } = useAuth();

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
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
            >
                <MoreVertIcon sx={{ fontSize: 28 }} />
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
                sx={{ zIndex: 1300 }}
            >
                <MenuItem onClick={handleProfile}>
                    <AccountCircleRoundedIcon sx={{ mr: 1 }} />
                    Profile
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: "#ef4444" }}>
                    Logout
                </MenuItem>
            </Menu>
        </Box>
    );
}