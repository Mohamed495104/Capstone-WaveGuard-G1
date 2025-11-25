"use client";
import { styled } from "@mui/material/styles";
import { Box, Button } from "@mui/material";

/* ADVANCED KEYFRAME ANIMATIONS */
const fadeInUp = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(60px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const fadeIn = `
    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;

const slideInLeft = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

const slideInRight = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;

const scaleIn = `
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.8) rotate(-5deg);
        }
        to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
        }
    }
`;

const float = `
    @keyframes float {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-15px);
        }
    }
`;

const wave = `
    @keyframes wave {
        0%, 100% {
            transform: rotate(0deg);
        }
        25% {
            transform: rotate(5deg);
        }
        75% {
            transform: rotate(-5deg);
        }
    }
`;

const shimmer = `
    @keyframes shimmer {
        0% {
            background-position: -1000px 0;
        }
        100% {
            background-position: 1000px 0;
        }
    }
`;

const pulse = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.08);
            opacity: 0.9;
        }
    }
`;

const rotateIn = `
    @keyframes rotateIn {
        from {
            opacity: 0;
            transform: rotate(-180deg) scale(0.5);
        }
        to {
            opacity: 1;
            transform: rotate(0deg) scale(1);
        }
    }
`;

const bounceIn = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
        }
        50% {
            opacity: 1;
            transform: scale(1.05) translateY(0);
        }
        70% {
            transform: scale(0.95);
        }
        100% {
            transform: scale(1);
        }
    }
`;

const slideUpFade = `
    @keyframes slideUpFade {
        from {
            opacity: 0;
            transform: translateY(80px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
`;

const glowPulse = `
    @keyframes glowPulse {
        0%, 100% {
            box-shadow: 0 0 20px rgba(103, 232, 195, 0.3);
        }
        50% {
            box-shadow: 0 0 40px rgba(103, 232, 195, 0.6);
        }
    }
`;

const backgroundZoom = `
    @keyframes backgroundZoom {
        from {
            transform: scale(1.2);
            opacity: 0;
        }
        to {
            transform: scale(1.05);
            opacity: 1;
        }
    }
`;

const typewriter = `
    @keyframes typewriter {
        from {
            width: 0;
        }
        to {
            width: 100%;
        }
    }
`;

const flipIn = `
    @keyframes flipIn {
        from {
            opacity: 0;
            transform: perspective(1000px) rotateY(-90deg);
        }
        to {
            opacity: 1;
            transform: perspective(1000px) rotateY(0deg);
        }
    }
`;

const elasticIn = `
    @keyframes elasticIn {
        0% {
            opacity: 0;
            transform: scale(0) rotate(-360deg);
        }
        50% {
            transform: scale(1.2) rotate(0deg);
        }
        65% {
            transform: scale(0.9);
        }
        80% {
            transform: scale(1.1);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
`;

/* HERO SECTION */
export const HeroSection = styled(Box)(() => ({
  position: "relative",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  overflow: "hidden",
  "@media (max-width: 768px)": {
    minHeight: "calc(100vh - 56px)",
    height: "auto",
    paddingTop: "20px",
    paddingBottom: "40px",
  },
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      'url("/images/hero1-optimized.webp") center center / cover no-repeat',
    filter: "blur(1px) brightness(1.0)",
    transform: "scale(1.05)",
    zIndex: 0,
    animation: "backgroundZoom 2s cubic-bezier(0.4, 0, 0.2, 1) forwards",
    [`${backgroundZoom}`]: {},
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(8,145,178,0.85) 25%, rgba(103,232,195,0.6) 90%)",
    zIndex: 1,
    animation: "fadeIn 1.5s ease-out 0.5s backwards",
    [`${fadeIn}`]: {},
  },
}));

export const HeroOverlay = styled(Box)(() => ({
  position: "relative",
  zIndex: 2,
  maxWidth: 800,
  color: "#fff",
  padding: "0 20px",
  "@media (max-width: 768px)": {
    padding: "0 16px",
    maxWidth: "100%",
  },
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
  opacity: 0,
  animation: "bounceIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.8s forwards",
  backdropFilter: "blur(10px)",
  position: "relative",
  overflow: "hidden",
  [`${bounceIn}`]: {},
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
    animation: "shimmer 3s infinite 1.5s",
    [`${shimmer}`]: {},
  },
  "@media (max-width: 768px)": {
    fontSize: 12,
    padding: "5px 14px",
    marginBottom: 14,
  },
}));

export const HeroTitle = styled("h1")(() => ({
  fontSize: 52,
  fontWeight: 700,
  lineHeight: 1.2,
  marginBottom: 16,
  opacity: 0,
  animation: "slideUpFade 1.2s cubic-bezier(0.16, 1, 0.3, 1) 1s forwards",
  textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  [`${slideUpFade}`]: {},
  "@media (max-width: 768px)": {
    fontSize: 32,
    lineHeight: 1.25,
    marginBottom: 12,
    wordWrap: "break-word",
    hyphens: "auto",
  },
  "@media (max-width: 480px)": {
    fontSize: 28,
  },
}));

export const HeroDesc = styled("p")(() => ({
  fontSize: 18,
  color: "#d9f3f8",
  marginBottom: 40,
  lineHeight: 1.6,
  opacity: 0,
  animation: "fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 1.3s forwards",
  textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
  [`${fadeInUp}`]: {},
  "@media (max-width: 768px)": {
    fontSize: 14,
    lineHeight: 1.5,
    marginBottom: 30,
    padding: "0 8px",
  },
}));

export const HeroButtons = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  gap: 16,
  marginBottom: 60,
  opacity: 0,
  animation:
    "scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.6s forwards",
  [`${scaleIn}`]: {},
  "@media (max-width: 768px)": {
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
    width: "100%",
    padding: "0 20px",
  },
}));

export const PrimaryButton = styled(Button)(() => ({
  background: "#0891b2",
  color: "#fff",
  padding: "12px 28px",
  borderRadius: 6,
  fontSize: 15,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "0",
    height: "0",
    borderRadius: "50%",
    background: "rgba(255, 255, 255, 0.2)",
    transform: "translate(-50%, -50%)",
    transition: "width 0.6s, height 0.6s",
  },
  "&:hover": {
    background: "#067b96",
    transform: "translateY(-4px) scale(1.05)",
    boxShadow: "0 8px 30px rgba(8, 145, 178, 0.5)",
  },
  "&:hover::before": {
    width: "300px",
    height: "300px",
  },
  "&:active": {
    transform: "translateY(-2px) scale(1.02)",
  },
  "@media (max-width: 768px)": {
    width: "100%",
    maxWidth: "280px",
    padding: "11px 24px",
    fontSize: 14,
  },
}));

export const OutlineButton = styled(Button)(() => ({
  border: "1.5px solid #fff",
  background: "transparent",
  color: "#fff",
  padding: "12px 28px",
  borderRadius: 6,
  fontSize: 15,
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "rgba(255, 255, 255, 0.1)",
    transition: "left 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  "&:hover": {
    background: "rgba(255,255,255,0.15)",
    transform: "translateY(-4px) scale(1.05)",
    boxShadow: "0 8px 30px rgba(255, 255, 255, 0.3)",
    borderColor: "#67e8c3",
  },
  "&:hover::before": {
    left: "100%",
  },
  "&:active": {
    transform: "translateY(-2px) scale(1.02)",
  },
  "@media (max-width: 768px)": {
    width: "100%",
    maxWidth: "280px",
    padding: "11px 24px",
    fontSize: 14,
  },
}));

export const StatsBox = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  gap: 60,
  flexWrap: "wrap",
  marginTop: 40,
  opacity: 0,
  animation: "fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 1.8s forwards",
  [`${fadeInUp}`]: {},
  "& > div": {
    transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    cursor: "pointer",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-5px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "0",
      height: "3px",
      background: "linear-gradient(90deg, #67e8c3, #0891b2)",
      transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      borderRadius: "2px",
    },
    "&:hover": {
      transform: "translateY(-10px) scale(1.05)",
    },
    "&:hover::after": {
      width: "80%",
    },
    "&:nth-of-type(1)": {
      animation: "slideInLeft 0.8s cubic-bezier(0.4, 0, 0.2, 1) 2s forwards",
      opacity: 0,
      [`${slideInLeft}`]: {},
    },
    "&:nth-of-type(2)": {
      animation:
        "bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 2.2s forwards",
      opacity: 0,
      [`${bounceIn}`]: {},
    },
    "&:nth-of-type(3)": {
      animation: "slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1) 2.4s forwards",
      opacity: 0,
      [`${slideInRight}`]: {},
    },
  },
  "@media (max-width: 768px)": {
    gap: 24,
    marginTop: 30,
    padding: "0 12px",
    "& > div": {
      minWidth: "90px",
      "& .MuiTypography-h5": {
        fontSize: "1.3rem",
        fontWeight: 700,
      },
      "& .MuiTypography-root:not(.MuiTypography-h5)": {
        fontSize: "0.75rem",
      },
    },
  },
}));

/* WORK SECTION */
export const WorkSection = styled(Box)(() => ({
  background: "#f8fafb",
  padding: "96px 32px",
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background:
      "radial-gradient(circle, rgba(8,145,178,0.03) 0%, transparent 70%)",
    animation: "wave 20s infinite linear",
    [`${wave}`]: {},
  },
  "@media (max-width: 768px)": {
    padding: "50px 16px",
    "& .MuiTypography-h4": {
      fontSize: "1.5rem",
      lineHeight: 1.3,
      marginBottom: "8px !important",
    },
    "& > .MuiTypography-root:not(.MuiTypography-h4)": {
      fontSize: "0.875rem",
      padding: "0 8px",
      marginBottom: "40px !important",
    },
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
  opacity: 0,
  animation:
    "elasticIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.3s forwards",
  position: "relative",
  [`${elasticIn}`]: {},
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-3px",
    borderRadius: 50,
    background: "linear-gradient(45deg, #0077b6, #67e8c3, #0077b6)",
    backgroundSize: "200% 200%",
    opacity: 0,
    transition: "opacity 0.3s",
    zIndex: -1,
    animation: "shimmer 3s infinite",
    [`${shimmer}`]: {},
  },
  "&:hover::before": {
    opacity: 0.3,
  },
  "@media (max-width: 768px)": {
    fontSize: 11,
    padding: "5px 12px",
    marginBottom: 10,
  },
}));

export const WorkGrid = styled("div")(() => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 32,
  justifyItems: "center",
  perspective: "1000px",
  "@media (max-width: 768px)": {
    gridTemplateColumns: "1fr",
    gap: 20,
    maxWidth: "400px",
    margin: "0 auto",
  },
}));

export const WorkCard = styled("div")(() => ({
  background: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  padding: "32px 24px",
  maxWidth: 280,
  width: "100%",
  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  textAlign: "center",
  opacity: 0,
  transformStyle: "preserve-3d",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "0",
    left: "-100%",
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(90deg, transparent, rgba(103,232,195,0.2), transparent)",
    transition: "left 0.6s",
  },
  "&:nth-of-type(1)": {
    animation: "flipIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards",
    [`${flipIn}`]: {},
  },
  "&:nth-of-type(2)": {
    animation: "flipIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.7s forwards",
    [`${flipIn}`]: {},
  },
  "&:nth-of-type(3)": {
    animation: "flipIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.9s forwards",
    [`${flipIn}`]: {},
  },
  "&:nth-of-type(4)": {
    animation: "flipIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1.1s forwards",
    [`${flipIn}`]: {},
  },
  "&:hover": {
    transform: "translateY(-15px) scale(1.05) rotateX(5deg)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },
  "&:hover::before": {
    left: "100%",
  },
  "& img": {
    transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
  },
  "&:hover img": {
    transform: "scale(1.15) rotate(360deg)",
    filter: "drop-shadow(0 8px 16px rgba(0,119,182,0.3))",
  },
  "@media (max-width: 768px)": {
    padding: "24px 20px",
    maxWidth: "100%",
    "& img": {
      width: "56px !important",
      height: "56px !important",
    },
    "& .MuiTypography-h6": {
      fontSize: "1.05rem",
      marginTop: "8px !important",
    },
    "& .MuiTypography-root:not(.MuiTypography-h6)": {
      fontSize: "0.85rem",
      lineHeight: 1.5,
    },
  },
}));

/* CLEANUP SECTION */
export const CleanSection = styled(Box)(() => ({
  backgroundColor: "#e0f7fa",
  padding: "96px 32px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle at 20% 50%, rgba(103,232,195,0.1) 0%, transparent 50%)",
    animation: "pulse 4s infinite ease-in-out",
    [`${pulse}`]: {},
  },
  "@media (max-width: 768px)": {
    padding: "50px 16px",
  },
}));

export const CleanBox = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 50,
  maxWidth: 1100,
  flexWrap: "wrap",
  justifyContent: "center",
  position: "relative",
  zIndex: 1,
  "& > div:first-of-type": {
    opacity: 0,
    animation: "slideInLeft 1s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards",
    [`${slideInLeft}`]: {},
    "& img": {
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      filter: "drop-shadow(0 10px 30px rgba(0,0,0,0.2))",
      "&:hover": {
        transform: "scale(1.08) rotate(2deg)",
        filter: "drop-shadow(0 15px 40px rgba(0,119,182,0.3))",
      },
    },
  },
  "@media (max-width: 900px)": {
    flexDirection: "column",
    textAlign: "center",
    gap: 24,
    "& > div:first-of-type img": {
      width: "100% !important",
      height: "auto !important",
      maxWidth: "400px",
    },
  },
}));

export const CleanText = styled(Box)(() => ({
  maxWidth: 500,
  color: "#004b63",
  opacity: 0,
  animation: "slideInRight 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards",
  [`${slideInRight}`]: {},
  "@media (max-width: 900px)": {
    maxWidth: "100%",
    padding: "0 8px",
  },
  "& .badge": {
    display: "inline-block",
    background: "#fff",
    color: "#0077b6",
    fontSize: 13,
    fontWeight: 500,
    padding: "6px 14px",
    borderRadius: 50,
    marginBottom: 14,
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "0",
      height: "0",
      background: "rgba(0,119,182,0.1)",
      borderRadius: "50%",
      transform: "translate(-50%, -50%)",
      transition: "width 0.6s, height 0.6s",
    },
    "&:hover::before": {
      width: "200px",
      height: "200px",
    },
    "@media (max-width: 768px)": {
      fontSize: 11,
      padding: "5px 12px",
      marginBottom: 10,
    },
  },
  "& h3": {
    color: "#003554",
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 14,
    position: "relative",
    display: "inline-block",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-8px",
      left: "0",
      width: "0",
      height: "4px",
      background: "linear-gradient(90deg, #0077b6, #67e8c3)",
      transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      borderRadius: "2px",
    },
    "&:hover::after": {
      width: "100%",
    },
    "@media (max-width: 768px)": {
      fontSize: 22,
      lineHeight: 1.3,
      marginBottom: 10,
    },
  },
  "& p": {
    fontSize: 15,
    marginBottom: 18,
    lineHeight: 1.6,
    "@media (max-width: 768px)": {
      fontSize: 14,
      marginBottom: 14,
      lineHeight: 1.5,
    },
  },
  "& ul": {
    listStyle: "none",
    padding: 0,
    fontSize: 15,
    lineHeight: 1.8,
    "@media (max-width: 768px)": {
      fontSize: 14,
      lineHeight: 1.7,
      textAlign: "left",
      maxWidth: "320px",
      margin: "0 auto",
    },
  },
  "& li": {
    position: "relative",
    paddingLeft: 28,
    marginBottom: 10,
    opacity: 0,
    animation: "fadeInUp 0.5s ease-out forwards",
    [`${fadeInUp}`]: {},
    "&:nth-of-type(1)": { animationDelay: "0.8s" },
    "&:nth-of-type(2)": { animationDelay: "1s" },
    "&:nth-of-type(3)": { animationDelay: "1.2s" },
    "&:nth-of-type(4)": { animationDelay: "1.4s" },
    "@media (max-width: 768px)": {
      paddingLeft: 24,
      marginBottom: 8,
    },
  },
  "& li::before": {
    content: "'✔'",
    position: "absolute",
    left: 0,
    top: 0,
    color: "#00a6d6",
    fontWeight: "bold",
    animation: "pulse 2s infinite",
    [`${pulse}`]: {},
  },
}));

/* MISSION SECTION */
export const MissionSection = styled(Box)(() => ({
  position: "relative",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      'url("/images/coast-optimized.webp") center center / cover no-repeat',
    filter: "brightness(1.05)",
    transform: "scale(1.05)",
    zIndex: 0,
    animation: "backgroundZoom 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards",
    [`${backgroundZoom}`]: {},
  },
  "&::after": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to right, rgba(8,145,178,0.85) 25%, rgba(103,232,195,0.6) 90%)",
    zIndex: 1,
    animation: "fadeIn 1.5s ease-out 0.5s backwards",
    [`${fadeIn}`]: {},
  },
  "@media (max-width: 768px)": {
    height: "auto",
    minHeight: "80vh",
    padding: "60px 16px",
  },
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
    fontWeight: 500,
    padding: "6px 14px",
    borderRadius: 50,
    marginBottom: 14,
    letterSpacing: 1,
    opacity: 0,
    animation:
      "rotateIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.5s forwards",
    backdropFilter: "blur(10px)",
    position: "relative",
    overflow: "hidden",
    [`${rotateIn}`]: {},
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      animation: "shimmer 3s infinite 2s",
      [`${shimmer}`]: {},
    },
    "@media (max-width: 768px)": {
      fontSize: 11,
      padding: "5px 12px",
      marginBottom: 10,
    },
  },
  "& h3": {
    fontSize: 52,
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: 16,
    opacity: 0,
    animation: "slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards",
    textShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    position: "relative",
    [`${slideUpFade}`]: {},
    "@media (max-width: 768px)": {
      fontSize: 28,
      lineHeight: 1.25,
      marginBottom: 12,
      wordWrap: "break-word",
      hyphens: "auto",
    },
    "@media (max-width: 480px)": {
      fontSize: 24,
    },
  },
  "& p": {
    fontSize: 18,
    color: "#d9f3f8",
    marginBottom: 40,
    lineHeight: 1.6,
    opacity: 0,
    animation: "fadeInUp 1s cubic-bezier(0.4, 0, 0.2, 1) 1.1s forwards",
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    [`${fadeInUp}`]: {},
    "@media (max-width: 768px)": {
      fontSize: 14,
      lineHeight: 1.5,
      marginBottom: 30,
      padding: "0 8px",
    },
  },
  "& > div": {
    opacity: 0,
    animation:
      "scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) 1.4s forwards",
    [`${scaleIn}`]: {},
  },
  "@media (max-width: 768px)": {
    padding: "0 16px",
    maxWidth: "100%",
  },
}));

export const MissionButton = styled(Button)(() => ({
  padding: "12px 28px",
  fontSize: 15,
  borderRadius: 6,
  background: "#fff",
  color: "#0077b6",
  fontWeight: 600,
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "0",
    height: "0",
    borderRadius: "50%",
    background: "rgba(0,119,182,0.2)",
    transform: "translate(-50%, -50%)",
    transition: "width 0.6s, height 0.6s",
  },
  "&:hover": {
    background: "#e0f7fa",
    color: "#005c85",
    transform: "translateY(-5px) scale(1.08)",
    boxShadow: "0 10px 40px rgba(255, 255, 255, 0.4)",
  },
  "&:hover::before": {
    width: "300px",
    height: "300px",
  },
  "&:active": {
    transform: "translateY(-3px) scale(1.05)",
  },
  "@media (max-width: 768px)": {
    width: "100%",
    maxWidth: "280px",
    padding: "11px 24px",
    fontSize: 14,
  },
}));
