"use client";

import { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Stack, Avatar } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { navItems } from "./navConfig";
import PersonOutline from "@mui/icons-material/PersonOutline";
import { apiCall } from "@/utils/api";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [profileImage, setProfileImage] = useState('');
    const isActive = (path) => (path === "/" ? pathname === "/" : pathname?.startsWith(path));

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

    return (
        // Add aria-label to AppBar if it serves as a banner/site header (which it does)
        <AppBar
            position="sticky"
            elevation={0}
            color="transparent"
            sx={{
                top: 0,
                display: { xs: "none", md: "block" },
                backgroundColor: "#ffffff",
                borderBottom: "1px solid #e5e7eb",
                backdropFilter: "blur(8px)",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1.75,
                    px: { md: 4, lg: 6 },
                    minHeight: { md: 70 }
                }}
            >
                {/* Left: Logo + Brand Name */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                        cursor: "pointer",
                        transition: "transform 0.2s ease",
                        "&:hover": {
                            transform: "scale(1.02)"
                        }
                    }}
                    onClick={() => router.push("/home")}
                    // Add role="link" and aria-label since this stack acts as a click target
                    role="link" 
                    aria-label="WaveGuard home"
                >
                    <Box
                        component="img"
                        src="/images/logoblue.png"
                        // 1. FIXED: Missing alternative text. 
                        alt="WaveGuard logo - ocean wave icon" 
                        sx={{
                            height: 44,
                            width: 44,
                            borderRadius: "50%",
                            boxShadow: "0 2px 8px rgba(8, 145, 178, 0.2)",
                        }}
                    />
                    <Typography
                        // 2. FIXED: Hierarchy. Use role="heading" with aria-level to declare the site title hierarchy, if you cannot use a native h1.
                        // However, since this is a global element, using <p> or <span> is often acceptable, but we'll use a role here for clarity.
                        variant="h6"
                        component="span" // Use span to avoid multiple H tags if H1 is elsewhere
                        sx={{
                            fontWeight: 700,
                            fontSize: "1.25rem",
                            color: "#0f172a",
                            letterSpacing: "-0.02em",
                            display: { xs: "none", lg: "block" }
                        }}
                    >
                        WaveGuard
                    </Typography>
                </Stack>

                {/* Right: nav items + profile */}
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                >
                    {/* Nav items */}
                    {/* 3. FIXED: Semantic grouping. Wrap main nav links in a <nav> tag. */}
                    <Stack
                        component="nav" 
                        aria-label="Primary site navigation"
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        sx={{
                            bgcolor: "#f8fafc",
                            borderRadius: 4,
                            p: 0.75,
                            border: "1px solid #e2e8f0"
                        }}
                    >
                        {navItems.map(({ label, path, icon: Icon }) => (
                            // Buttons should ideally be Link components, but as long as they function as navigation and have text content, they are fine.
                            <Button
                                key={path}
                                onClick={() => router.push(path)}
                                startIcon={<Icon sx={{ fontSize: 20 }} />}
                                // ... (styles remain the same)
                                sx={{
                                    textTransform: "none",
                                    fontWeight: isActive(path) ? 600 : 500,
                                    fontSize: "0.9375rem",
                                    color: isActive(path) ? "#ffffff" : "#64748b",
                                    px: 2.5,
                                    py: 1.1,
                                    borderRadius: 3,
                                    bgcolor: isActive(path) ? "#0891b2" : "transparent",
                                    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                                    position: "relative",
                                    overflow: "hidden",
                                    boxShadow: isActive(path) ? "0 2px 8px rgba(8, 145, 178, 0.3)" : "none",
                                    "&:hover": {
                                        bgcolor: isActive(path) ? "#0e7490" : "#ffffff",
                                        color: isActive(path) ? "#ffffff" : "#0f172a",
                                        transform: "translateY(-1px)",
                                        boxShadow: isActive(path)
                                            ? "0 4px 12px rgba(8, 145, 178, 0.4)"
                                            : "0 2px 6px rgba(0, 0, 0, 0.08)",
                                    },
                                    "& .MuiButton-startIcon": {
                                        marginRight: 0.75,
                                    }
                                }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Stack>

                    {/* Profile button */}
                    <IconButton
                        size="medium"
                        onClick={() => router.push("/profile")}
                        // 4. FIXED: Explicit Label. Added descriptive aria-label for screen readers.
                        aria-label="View user profile settings"
                        sx={{
                            bgcolor: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            width: 44,
                            height: 44,
                            p: 0,
                            transition: "all 0.2s ease",
                            "&:hover": {
                                bgcolor: "#0891b2",
                                borderColor: "#0891b2",
                                transform: "scale(1.05)",
                                boxShadow: "0 4px 12px rgba(8, 145, 178, 0.3)",
                                "& .MuiAvatar-root": {
                                    bgcolor: "#0e7490",
                                }
                            },
                        }}
                    >
                        <Avatar
                            src={profileImage || undefined}
                            // 5. FIXED: Image alt text within Avatar component. If profileImage is present, it needs alt text.
                            // If it's a decorative default icon, alt can be empty, but since profileImage is dynamic, use an aria-label on the Avatar itself.
                            alt={profileImage ? "User profile picture" : "Default profile icon"} 
                            sx={{
                                width: 40,
                                height: 40,
                                bgcolor: "#0891b2",
                                fontSize: 16,
                                fontWeight: 600,
                            }}
                        >
                            {!profileImage && <PersonOutline sx={{ fontSize: 22, color: "#ffffff" }} />}
                        </Avatar>
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}