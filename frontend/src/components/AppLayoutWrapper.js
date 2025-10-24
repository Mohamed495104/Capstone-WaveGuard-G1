"use client";

import {
    CssBaseline,
    ThemeProvider,
    createTheme,
    Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import SmoothPageTransition from "@/components/PageTransition";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const MobileBottomNav = dynamic(
    () => import("@/components/common/MobileBottomNav"),
    { ssr: false }
);

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#0891b2" },
        background: { default: "#ffffff", paper: "#ffffff" },
        text: { primary: "#0a0a0a", secondary: "rgba(0,0,0,0.6)" },
    },
    typography: { fontFamily: "Inter, sans-serif" },
    shape: { borderRadius: 12 },
});

export default function AppLayoutWrapper({ children }) {
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        setIsAuthenticated(!!(token && refreshToken));
    }, [pathname]);

    const hideLayout =
        pathname === "/" ||
        pathname.startsWith("/auth") ||
        pathname === "/login" ||
        pathname === "/signup";

    const showLayout = !hideLayout && (isAuthenticated || pathname === "/landing");

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {showLayout && <Navbar />}

            <Box
                component="main"
                sx={{
                    minHeight: "100dvh",
                    backgroundColor: "#fff",
                    pb: { xs: "calc(64px + env(safe-area-inset-bottom))", md: 0 },
                }}
            >
                <SmoothPageTransition>{children}</SmoothPageTransition>
            </Box>

            {showLayout && <Footer />}
            {showLayout && <MobileBottomNav />}
        </ThemeProvider>
    );
}
