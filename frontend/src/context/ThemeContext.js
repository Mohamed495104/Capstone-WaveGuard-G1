"use client";
import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { createTheme, ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [mode, setMode] = useState("light");

    // Load theme preference from localStorage on mount
    useEffect(() => {
        const savedMode = localStorage.getItem("themeMode");
        if (savedMode === "dark" || savedMode === "light") {
            setMode(savedMode);
        }
    }, []);

    // Toggle between light and dark mode
    const toggleTheme = () => {
        setMode((prevMode) => {
            const newMode = prevMode === "light" ? "dark" : "light";
            localStorage.setItem("themeMode", newMode);
            return newMode;
        });
    };

    // Create theme based on current mode
    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    primary: {
                        main: mode === "light" ? "#0891b2" : "#06b6d4",
                    },
                    background: {
                        default: mode === "light" ? "#ffffff" : "#0f172a",
                        paper: mode === "light" ? "#ffffff" : "#1e293b",
                    },
                    text: {
                        primary: mode === "light" ? "#0a0a0a" : "#f1f5f9",
                        secondary: mode === "light" ? "rgba(0,0,0,0.6)" : "rgba(241,245,249,0.7)",
                    },
                },
                typography: {
                    fontFamily: "Inter, sans-serif",
                },
                shape: {
                    borderRadius: 12,
                },
            }),
        [mode]
    );

    const value = {
        mode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={value}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
