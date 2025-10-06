"use client";
import { CssBaseline, BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PeopleIcon from "@mui/icons-material/People";
import { useState } from "react";

export default function RootLayout({ children }) {
    const [value, setValue] = useState(0);

    return (
        <html lang="en">
        <body>
        <CssBaseline />
        <main style={{ minHeight: "100vh", paddingBottom: "56px" }}>
            {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => setValue(newValue)}
            >
                <BottomNavigationAction label="Home" icon={<HomeIcon />} />
                <BottomNavigationAction label="Upload" icon={<AddAPhotoIcon />} />
                <BottomNavigationAction label="Stats" icon={<LeaderboardIcon />} />
                <BottomNavigationAction label="Community" icon={<PeopleIcon />} />
            </BottomNavigation>
        </Paper>
        </body>
        </html>
    );
}
