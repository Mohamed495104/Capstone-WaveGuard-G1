"use client";
import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Grid, CircularProgress } from "@mui/material";
import withAuth from "@/components/auth/withAuth";
import axios from "axios";
import { PageContainerStyle, HeaderBoxStyle, HeaderTitleStyle, HeaderSubtitleStyle } from "./challenge.styles";

// --- UPDATED COMPONENT IMPORTS ---
import StatsCard from "@/components/common/StatCard";
import ChallengeCard from "@/components/cards/ChallengeCard";
import CTASection from "@/components/sections/CTASection";
// --- END ---

function ChallengesPage() {
    const [challenges, setChallenges] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [challengesRes, statsRes] = await Promise.all([
                    axios.get("/api/challenges"),
                    axios.get("/api/challenges/stats"),
                ]);
                setChallenges(challengesRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Failed to fetch challenges data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <Box sx={PageContainerStyle}>
            <Container maxWidth="lg">
                <Box sx={HeaderBoxStyle}>
                    <Typography variant="h4" sx={HeaderTitleStyle}>
                        Cleanup Challenges
                    </Typography>
                    <Typography variant="body1" sx={HeaderSubtitleStyle}>
                        Join local and national cleanup events across Canada. Every contribution counts!
                    </Typography>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}><CircularProgress /></Box>
                ) : (
                    <>
                        <StatsCard stats={stats} />
                        <Grid container spacing={4} sx={{ mt: 4 }}>
                            {challenges.map((challenge) => (
                                <Grid item key={challenge._id} xs={12} sm={6} md={4}>
                                    <ChallengeCard challenge={challenge} />
                                </Grid>
                            ))}
                        </Grid>
                        <CTASection />
                    </>
                )}
            </Container>
        </Box>
    );
}

export default withAuth(ChallengesPage);