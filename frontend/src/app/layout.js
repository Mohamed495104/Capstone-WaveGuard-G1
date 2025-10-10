"use client";
import "./globals.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { Inter } from "next/font/google";
import SmoothPageTransition from "@/components/PageTransition";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: { main: "#0891b2" },
        background: { default: "#000" },
    },
    typography: { fontFamily: inter.style.fontFamily },
});

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SmoothPageTransition>{children}</SmoothPageTransition>
        </ThemeProvider>
        </body>
        </html>
    );
}
