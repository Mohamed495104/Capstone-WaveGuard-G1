"use client";
import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Container,
    Typography,
    CircularProgress,
    useMediaQuery,
    useTheme,
    IconButton,
    MenuItem,
    FormControl,
    Select,
    InputLabel,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
    PageContainerStyle,
    HeaderBoxStyle,
    HeaderTitleStyle,
    HeaderSubtitleStyle,
} from "./challenge.styles";

import StatsCard from "@/components/common/StatCard";
import ChallengeCard from "@/components/cards/ChallengeCard";
import CTASection from "@/components/sections/CTASection";
import withAuth from "@/components/auth/withAuth";
import { useJoinedChallenges } from "@/context/JoinedChallengesContext";

import {
    challenges as mockChallenges,
    mockStats,
    regions as regionList,
} from "@/data/challenges";

function ChallengesPage() {
    const router = useRouter();

    const [challenges, setChallenges] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { joinedChallenges } = useJoinedChallenges();

    const [selectedRegion, setSelectedRegion] = useState("All");
    const [selectedStatus, setSelectedStatus] = useState("All");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const activeScrollRef = useRef(null);
    const upcomingScrollRef = useRef(null);
    const completedScrollRef = useRef(null);

    const uniqueRegions = ["All", ...new Set(regionList.filter((r) => r && r !== "All"))];

    const provinceToRegion = {
        ON: "Central",
        QC: "Central",
        BC: "West",
        AB: "West",
        SK: "West",
        MB: "West",
        NS: "East",
        NB: "East",
        PE: "East",
        NL: "East",
        YT: "North",
        NT: "North",
        NU: "North",
    };

    const getRegionFromProvince = (province) => provinceToRegion[province] || "Central";

    const fetchData = async () => {
        try {
            setLoading(true);
            const [challengesRes, statsRes] = await Promise.all([
                axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/challenges`),
                axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/challenges/stats`),
            ]);

            const challengesWithRegion = (challengesRes.data || []).map((challenge) => ({
                ...challenge,
                region: challenge.region || getRegionFromProvince(challenge.province),
            }));

            setChallenges(challengesWithRegion);
            setStats(statsRes.data || mockStats);
        } catch (error) {
            console.warn("API failed, using mock data:", error.message);
            setChallenges(mockChallenges);
            setStats(mockStats);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [joinedChallenges]);

    const filterChallenges = (list) => {
        let filtered = [...list];

        if (selectedRegion !== "All") {
            filtered = filtered.filter(
                (c) => c.region?.toLowerCase() === selectedRegion.toLowerCase()
            );
        }
        if (selectedStatus !== "All") {
            filtered = filtered.filter(
                (c) => c.status?.toLowerCase() === selectedStatus.toLowerCase()
            );
        }
        return filtered;
    };

    const activeChallenges = filterChallenges(
        challenges.filter((c) => c.status?.toLowerCase() === "active")
    );
    const upcomingChallenges = filterChallenges(
        challenges.filter((c) => c.status?.toLowerCase() === "upcoming")
    );
    const completedChallenges = filterChallenges(
        challenges.filter((c) => c.status?.toLowerCase() === "completed")
    );

    const scroll = (ref, direction) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: direction === "left" ? -400 : 400,
                behavior: "smooth",
            });
        }
    };

    const ScrollableRow = ({ title, icon, challenges, scrollRef }) => {
        if (challenges.length === 0) return null;

        return (
            <Box sx={{ mb: 6 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {icon}
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "#1e293b" }}>
                            {title}
                        </Typography>
                    </Box>

                    {!isMobile && (
                        <Box sx={{ display: "flex", gap: 1 }}>
                            <IconButton onClick={() => scroll(scrollRef, "left")}>
                                <ChevronLeftIcon />
                            </IconButton>
                            <IconButton onClick={() => scroll(scrollRef, "right")}>
                                <ChevronRightIcon />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                <Box
                    ref={scrollRef}
                    sx={{
                        display: "flex",
                        gap: 3,
                        overflowX: "auto",
                        pb: 2,
                    }}
                >
                    {challenges.map((challenge) => (
                        <Box
                            key={challenge._id}
                            sx={{
                                minWidth: { xs: "280px", sm: "340px" },
                                maxWidth: { xs: "280px", sm: "340px" },
                            }}
                        >
                            <ChallengeCard challenge={challenge} />
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={PageContainerStyle}>
            <Container maxWidth="xl">
                <Box sx={HeaderBoxStyle}>
                    <Typography variant="h4" sx={HeaderTitleStyle}>
                        🌊 Cleanup Challenges
                    </Typography>
                    <Typography variant="body1" sx={HeaderSubtitleStyle}>
                        Join hands in restoring our coastlines — every cleanup counts!
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "50vh" }}>
                        <CircularProgress size={60} />
                    </Box>
                ) : (
                    <>
                        <StatsCard stats={stats} />

                        {/* FILTER SECTION */}
                        <Box
                            sx={{
                                mb: 5,
                                p: 3,
                                backgroundColor: "white",
                                borderRadius: "16px",
                                border: "1px solid #e5e7eb",
                                display: "flex",
                                gap: 2,
                                flexWrap: "wrap",
                            }}
                        >
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Filter by Region</InputLabel>
                                <Select
                                    value={selectedRegion}
                                    label="Filter by Region"
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                >
                                    {uniqueRegions.map((region) => (
                                        <MenuItem key={region} value={region}>
                                            {region}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel>Filter by Status</InputLabel>
                                <Select
                                    value={selectedStatus}
                                    label="Filter by Status"
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                >
                                    {["All", "Active", "Upcoming", "Completed"].map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {/* ACTIVE */}
                        <ScrollableRow
                            title="Active Challenges"
                            icon={<TrendingUpIcon sx={{ color: "#10b981", fontSize: 28 }} />}
                            challenges={activeChallenges}
                            scrollRef={activeScrollRef}
                        />

                        {/* UPCOMING */}
                        <ScrollableRow
                            title="Upcoming Challenges"
                            icon={<ScheduleIcon sx={{ color: "#f59e0b", fontSize: 28 }} />}
                            challenges={upcomingChallenges}
                            scrollRef={upcomingScrollRef}
                        />

                        {/* COMPLETED */}
                        <ScrollableRow
                            title="Completed Challenges"
                            icon={<CheckCircleIcon sx={{ color: "#6b7280", fontSize: 28 }} />}
                            challenges={completedChallenges}
                            scrollRef={completedScrollRef}
                        />
                        <CTASection onCreateClick={() => router.push("/challenges/create")} />
                    </>
                )}
            </Container>
        </Box>
    );
}

export default withAuth(ChallengesPage);
