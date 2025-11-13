"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BottomNavigation, BottomNavigationAction, Paper, Box } from "@mui/material";
import { navItems, mobileOrder } from "./navConfig";
import { useTheme } from "@mui/material/styles";

export default function MobileBottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [value, setValue] = useState(0);
    const theme = useTheme();

    const items = useMemo(
        () => navItems.filter((n) => mobileOrder.includes(n.path)).sort((a, b) => mobileOrder.indexOf(a.path) - mobileOrder.indexOf(b.path)),
        []
    );

    useEffect(() => {
        const idx = items.findIndex((i) => (i.path === "/" ? pathname === "/" : pathname?.startsWith(i.path)));
        setValue(idx === -1 ? 0 : idx);
    }, [pathname, items]);

    return (
        <Paper
            elevation={0}
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                display: { xs: "block", md: "none" },
                borderTop: theme.palette.mode === 'dark' ? '1px solid #334155' : '1px solid #e5e7eb',
                overflow: "hidden",
                bgcolor: theme.palette.background.paper,
                zIndex: 1300,
                boxShadow: theme.palette.mode === 'dark' 
                    ? '0 -2px 10px rgba(0, 0, 0, 0.3)' 
                    : '0 -2px 10px rgba(0, 0, 0, 0.05)',
            }}
        >
            <BottomNavigation
                showLabels
                value={value}
                onChange={(_, newValue) => {
                    setValue(newValue);
                    router.push(items[newValue].path);
                }}
                sx={{
                    height: 72,
                    pb: "env(safe-area-inset-bottom)",
                    bgcolor: theme.palette.background.paper,
                    "& .MuiBottomNavigationAction-root": {
                        color: theme.palette.mode === 'dark' ? '#94a3b8' : '#94a3b8',
                        minWidth: 0,
                        pt: 1.75,
                        pb: 1.25,
                        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        position: "relative",
                        "& .MuiBottomNavigationAction-label": {
                            fontSize: "0.6875rem",
                            fontWeight: 500,
                            mt: 0.75,
                            opacity: 0.9,
                            transition: "all 0.25s ease",
                            color: "inherit",
                        },
                        "& .MuiSvgIcon-root": {
                            fontSize: 26,
                            transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                        },
                    },
                    "& .Mui-selected": {
                        color: theme.palette.primary.main,
                        "& .MuiBottomNavigationAction-label": {
                            fontWeight: 700,
                            fontSize: "0.75rem",
                            opacity: 1,
                            transform: "translateY(-2px)",
                        },
                        "& .MuiSvgIcon-root": {
                            transform: "scale(1.15)",
                        },
                    },
                }}
            >
                {items.map(({ label, icon: Icon, path }, index) => {
                    const isSelected = value === index;
                    return (
                        <BottomNavigationAction
                            key={path}
                            label={label}
                            icon={
                                <Box
                                    sx={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    {isSelected && (
                                        <Box
                                            sx={{
                                                position: "absolute",
                                                top: -12,
                                                width: 32,
                                                height: 3,
                                                borderRadius: "0 0 4px 4px",
                                                bgcolor: theme.palette.primary.main,
                                                animation: "slideDown 0.3s ease",
                                                "@keyframes slideDown": {
                                                    from: {
                                                        transform: "translateY(-8px)",
                                                        opacity: 0,
                                                    },
                                                    to: {
                                                        transform: "translateY(0)",
                                                        opacity: 1,
                                                    },
                                                },
                                            }}
                                        />
                                    )}
                                    <Icon />
                                </Box>
                            }
                        />
                    );
                })}
            </BottomNavigation>
        </Paper>
    );
}