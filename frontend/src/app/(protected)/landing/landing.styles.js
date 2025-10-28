"use client";
import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

/* HERO SECTION */
export const HeroSection = styled(Box)(() => ({
  position: "relative",
  height: "90vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  overflow: "hidden",
  "@media (max-width: 1200px)": { height: "85vh" },
  "@media (max-width: 1024px)": { height: "78vh" },
  "@media (max-width: 768px)": {
    minHeight: "calc(100vh - 56px)",
    padding: "40px 16px",
    height: "auto",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: 'url("/images/hero1.jpg") center center / cover no-repeat',
    filter: "brightness(1.05)",
    transform: "scale(1.02)",
    zIndex: 0,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(8,145,178,0.85) 25%, rgba(103,232,195,0.6) 90%)",
    zIndex: 1,
  },
}));

export const HeroOverlay = styled(Box)(() => ({
  position: "relative",
  zIndex: 2,
  maxWidth: 800,
  color: "#fff",
  padding: "0 20px",
  "@media (max-width: 1024px)": { maxWidth: 700 },
  "@media (max-width: 768px)": { padding: "0 16px", maxWidth: "100%" },
}));

export const HeroTag = styled("p")(() => ({
  fontSize: 14,
  letterSpacing: 1,
  background: "rgba(255,255,255,0.15)",
  borderRadius: 20,
  padding: "6px 16px",
  display: "inline-block",
  marginBottom: 18,
  color: "#e3f9ff",
  "@media (max-width: 768px)": { fontSize: 12, padding: "5px 14px" },
}));

export const HeroTitle = styled("h1")(() => ({
  fontSize: 52,
  fontWeight: 700,
  lineHeight: 1.2,
  marginBottom: 16,
  "@media (max-width: 1200px)": { fontSize: 46 },
  "@media (max-width: 1024px)": { fontSize: 40 },
  "@media (max-width: 768px)": { fontSize: 32, marginBottom: 12 },
  "@media (max-width: 480px)": { fontSize: 26 },
}));

export const HeroDesc = styled("p")(() => ({
  fontSize: 18,
  color: "#d9f3f8",
  marginBottom: 40,
  lineHeight: 1.6,
  "@media (max-width: 1024px)": { fontSize: 16, marginBottom: 35 },
  "@media (max-width: 768px)": { fontSize: 15, marginBottom: 30 },
}));

export const HeroButtons = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  gap: 16,
  marginBottom: 60,
  flexWrap: "wrap",
  "@media (max-width: 1024px)": { marginBottom: 50 },
  "@media (max-width: 768px)": {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
  },
}));

export const PrimaryButton = styled(Button)(() => ({
  background: "#0891b2",
  color: "#fff",
  padding: "12px 28px",
  borderRadius: 6,
  fontSize: 15,
  fontWeight: 600,
  "&:hover": { background: "#067b96" },
  "@media (max-width: 768px)": { width: "100%", maxWidth: 280, fontSize: 14 },
}));

export const OutlineButton = styled(Button)(() => ({
  border: "1.5px solid #fff",
  color: "#fff",
  padding: "12px 28px",
  borderRadius: 6,
  fontSize: 15,
  fontWeight: 600,
  "&:hover": { background: "rgba(255,255,255,0.1)" },
  "@media (max-width: 768px)": { width: "100%", maxWidth: 280, fontSize: 14 },
}));

export const StatsBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  gap: 60,
  flexWrap: "wrap",
  marginTop: 40,
  "@media (max-width: 1200px)": { gap: 50 },
  "@media (max-width: 1024px)": { gap: 40 },
  "@media (max-width: 768px)": { gap: 24, marginTop: 30 },
}));

/*  PLATFORM WORK SECTION */
export const WorkSection = styled(Box)(() => ({
  background: "#f8fafb",
  padding: "96px 32px",
  textAlign: "center",
  "@media (max-width: 1200px)": { padding: "80px 28px" },
  "@media (max-width: 1024px)": { padding: "80px 24px" },
  "@media (max-width: 768px)": {
    padding: "50px 16px",
    "& .MuiTypography-h4": { fontSize: "1.5rem" },
  },
}));

export const WorkBadge = styled("span")(() => ({
  display: "inline-block",
  background: "#e0f7fa",
  color: "#0077b6",
  fontSize: 13,
  fontWeight: 500,
  padding: "6px 14px",
  borderRadius: 50,
  marginBottom: 14,
}));

export const WorkGrid = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: 32,
  justifyItems: "center",
  alignItems: "stretch",
  "@media (max-width: 1024px)": { gridTemplateColumns: "repeat(4, 1fr)"},
  "@media (max-width: 768px)": { gridTemplateColumns: "1fr", gap: 24 },
}));

export const WorkCard = styled("div")(() => ({
  background: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  padding: "32px 24px",
  width: "100%",
  maxWidth: 280,
  textAlign: "center",
  transition: "all 0.3s ease",
  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 8px 18px rgba(0,0,0,0.08)" },
  "@media (max-width: 1200px)": { maxWidth: "100%" },
  "@media (max-width: 768px)": { maxWidth: "100%", padding: "24px 20px" },
}));

/*  MISSION SECTION */
export const MissionSection = styled(Box)(() => ({
  position: "relative",
  height: "90vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background: 'url("/images/coast.jpg") center center / cover no-repeat',
    filter: "brightness(1.05)",
    transform: "scale(1.02)",
    zIndex: 0,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(8,145,178,0.85) 25%, rgba(103,232,195,0.6) 90%)",
    zIndex: 1,
  },
  "@media (max-width: 1200px)": { height: "82vh" },
  "@media (max-width: 1024px)": { height: "76vh" },
  "@media (max-width: 768px)": { height: "auto", minHeight: "80vh", padding: "60px 16px" },
}));

export const MissionContent = styled(Box)(() => ({
  position: "relative",
  zIndex: 2,
  maxWidth: 800,
  color: "#ffffff",
  padding: "0 20px",
  "& .badge": {
    display: "inline-block",
    background: "rgba(255,255,255,0.15)",
    color: "#e3f9ff",
    fontSize: 13,
    padding: "6px 14px",
    borderRadius: 50,
    marginBottom: 14,
  },
  "& h3": {
    fontSize: 52,
    fontWeight: 700,
    marginBottom: 16,
    "@media (max-width: 1200px)": { fontSize: 46 },
    "@media (max-width: 1024px)": { fontSize: 38 },
    "@media (max-width: 768px)": { fontSize: 28 },
  },
  "& p": {
    fontSize: 18,
    color: "#d9f3f8",
    marginBottom: 40,
    lineHeight: 1.6,
    "@media (max-width: 1024px)": { fontSize: 16, marginBottom: 35 },
    "@media (max-width: 768px)": { fontSize: 14, marginBottom: 30 },
  },
}));

export const MissionButton = styled(Button)(() => ({
  padding: "12px 28px",
  fontSize: 15,
  borderRadius: 6,
  background: "#fff",
  color: "#0077b6",
  fontWeight: 600,
  "&:hover": { background: "#e0f7fa", color: "#005c85" },
  "@media (max-width: 768px)": { width: "100%", maxWidth: 280, fontSize: 14 },
}));

/* TIPS SECTION */
export const TipsSection = styled(Box)(() => ({
  background: "#e0f7fa30",
  padding: "90px 32px",
  textAlign: "center",
  "@media (max-width: 1200px)": { padding: "80px 28px" },
  "@media (max-width: 1024px)": { padding: "70px 24px" },
  "@media (max-width: 768px)": { padding: "50px 16px" },
}));

export const TipsGrid = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 32,
  justifyItems: "center",
  alignItems: "stretch",
  maxWidth: "1100px",
  margin: "0 auto",
  "@media (max-width: 1200px)": { gridTemplateColumns: "repeat(2, 1fr)", gap: 28 },
  "@media (max-width: 768px)": { gridTemplateColumns: "1fr", gap: 24 },
}));

export const TipCard = styled("div")(() => ({
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  padding: "14px",
  width: "100%",
  textAlign: "center",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": { transform: "translateY(-6px)", boxShadow: "0 8px 18px rgba(0,0,0,0.08)" },
  "@media (max-width: 1200px)": { maxWidth: "90%" },
  "@media (max-width: 768px)": { maxWidth: "100%", padding: "24px 20px" },
}));
