"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: { main: "#0891b2" },
        secondary: { main: "#06b6d4" },
        background: { default: "#000", paper: "rgba(255,255,255,0.08)" },
        text: { primary: "#fff", secondary: "rgba(255,255,255,0.7)" },
    },
    typography: {
        fontFamily: "Inter, sans-serif",
    },
});

export default theme;
