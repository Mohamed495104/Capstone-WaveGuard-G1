import { styled } from "@mui/material/styles";

// General Page Styles
export const PageContainerStyle = {
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    py: 4,
};

export const HeaderBoxStyle = {
    textAlign: "center",
    mb: 5,
};

export const HeaderTitleStyle = {
    fontWeight: "bold",
    color: "navy.main",
};

export const HeaderSubtitleStyle = {
    mt: 1,
    color: "text.secondary",
    maxWidth: "600px",
    mx: "auto",
};

// Stats Bar Styles
export const StatsContainerStyle = {
    display: "grid",
    gridTemplateColumns: {
        xs: "1fr 1fr",
        md: "1fr 1fr 1fr 1fr",
    },
    gap: 3,
    p: 3,
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.05)",
};

export const StatItemStyle = {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
};

// Challenge Card Styles
export const CardStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    borderRadius: "16px",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.05)",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
        transform: "translateY(-5px)",
        boxShadow: "0 12px 40px 0 rgba(0, 0, 0, 0.08)",
    },
};

export const CardContentStyle = {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
};

export const ProgressBarContainer = {
    width: "100%",
    mt: "auto", // Pushes progress bar to the bottom
    pt: 2,
};

// CTA Section Styles
export const CtaBoxStyle = {
    textAlign: "center",
    backgroundColor: "navy.light",
    borderRadius: "16px",
    padding: { xs: 3, sm: 5 },
    mt: 6,
    color: "white",
};