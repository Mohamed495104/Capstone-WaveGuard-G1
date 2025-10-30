"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme,
  LinearProgress,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import TimelineIcon from "@mui/icons-material/Timeline";
import axios from "axios";

import {
  PageContainerStyle,
  HeaderBoxStyle,
  HeaderTitleStyle,
  HeaderSubtitleStyle,
} from "./achievements.styles";

import AchievementCard from "@/components/cards/AchievementCard";
import LeaderboardRow from "@/components/cards/LeaderboardRow";
import withAuth from "@/components/auth/withAuth";

// ✅ Import mock data
import { mockAchievements, mockLeaderboard, mockMilestones } from "@/data/achievements";

function AchievementsPage() {
  // ✅ State setup
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [milestones, setMilestones] = useState([]); // added this line
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        try {
          const [achievementsRes, leaderboardRes] = await Promise.all([
            axios.get("/api/achievements"),
            axios.get("/api/leaderboard"),
          ]);
          setAchievements(achievementsRes.data);
          setLeaderboard(leaderboardRes.data);
        } catch (apiError) {
          console.warn("Using mock data:", apiError.message);
          setAchievements(mockAchievements);
          setLeaderboard(mockLeaderboard);
          setMilestones(mockMilestones); // ✅ ensures milestones are loaded
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Box sx={PageContainerStyle}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={HeaderBoxStyle}>
          <Typography variant={isMobile ? "h5" : "h4"} sx={HeaderTitleStyle}>
            🏆 Achievements & Leaderboard
          </Typography>
          <Typography
            variant={isMobile ? "body2" : "body1"}
            sx={HeaderSubtitleStyle}
          >
            Celebrate your cleanup impact and see how you rank among volunteers
            across Canada 🌊
          </Typography>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Summary Stats */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "repeat(4, 1fr)",
                },
                gap: 3,
                mb: 6,
              }}
            >
              {[
                { icon: <EmojiEventsIcon sx={{ color: "#00a6d6" }} />, label: "Achievements", value: "8 / 12" },
                { icon: <TimelineIcon sx={{ color: "#10b981" }} />, label: "Total Points", value: "8.9k" },
                { icon: <LeaderboardIcon sx={{ color: "#f59e0b" }} />, label: "Rank", value: "#47" },
                { icon: "🌟", label: "Completion", value: "85%" },
              ].map((stat, i) => (
                <Box
                  key={i}
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                    p: 3,
                    textAlign: "center",
                    border: "1px solid #e5e7eb",
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 8px 18px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography variant="h4" fontWeight={700} mb={1}>
                    {stat.icon}
                  </Typography>
                  <Typography fontSize={15} color="#475569" mb={0.5}>
                    {stat.label}
                  </Typography>
                  <Typography variant="h5" color="#0077b6" fontWeight={700}>
                    {stat.value}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Achievements Section */}
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
              >
                🧹 Your Achievements
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  },
                  gap: 3,
                }}
              >
                {achievements.map((a, i) => (
                  <AchievementCard key={i} achievement={a} />
                ))}
              </Box>
            </Box>

            {/* Milestones Section */}
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
              >
                🎯 Milestones
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: 3,
                }}
              >
                {/* Milestone List */}
                <Box
                  sx={{
                    flex: 2,
                    backgroundColor: "white",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.05)",
                    p: 3,
                  }}
                >
                  {milestones.map((m, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                        py: 1.2,
                        px: 2,
                        borderRadius: "8px",
                        backgroundColor: "#f8fafb",
                        "&:hover": {
                          backgroundColor: "#e0f7fa",
                          transition: "0.3s",
                        },
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ color: "#1e293b", fontWeight: 600 }}
                      >
                        🏁 {m.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          backgroundColor: "#e0f7fa",
                          color: "#0077b6",
                          borderRadius: "6px",
                          px: 1.5,
                          py: 0.5,
                          fontWeight: 600,
                        }}
                      >
                        {m.reward}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Next Milestone Progress */}
                <Box
                  sx={{
                    flex: 1,
                    backgroundColor: "#e6f9ff",
                    borderRadius: "12px",
                    border: "1px solid #bae6fd",
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
                    p: 3,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="#0369a1"
                    fontWeight={700}
                    mb={1}
                  >
                    ⏭ Next Milestone
                  </Typography>
                  <Typography variant="h6" color="#0077b6" fontWeight={700}>
                    500 items
                  </Typography>
                  <Typography variant="body2" color="#0f172a" mb={1.5}>
                    73 items away from earning +200 points 🪙
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Typography fontSize="13px" color="#475569" mb={0.5}>
                      Progress: 85%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={85}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#e2e8f0",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "#0ea5e9",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Leaderboard Section */}
            <Box sx={{ mb: 8 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700, mb: 3, color: "#1e293b" }}
              >
                🌎 National Leaderboard
              </Typography>
              <Box
                sx={{
                  backgroundColor: "white",
                  borderRadius: "12px",
                  boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#f9fafb", color: "#1e293b" }}>
                    <tr>
                      {["Rank", "Volunteer", "Items", "Points"].map((h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: "left",
                            padding: "14px 20px",
                            fontWeight: 700,
                            borderBottom: "1px solid #e2e8f0",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((row, i) => (
                      <LeaderboardRow key={i} row={row} />
                    ))}
                  </tbody>
                </table>
              </Box>
            </Box>
          </>
        )}
      </Container>
    </Box>
  );
}

export default withAuth(AchievementsPage);
