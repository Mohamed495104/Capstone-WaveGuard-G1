// donation.styles.js
export const styles = {
  pageWrapper: {
    bgcolor: "#fafbfc",
    minHeight: "100vh",
    py: 0,
  },

  container: {
    maxWidth: "1200px !important",
    px: { xs: 2, md: 4 },
    py: { xs: 3, md: 5 },
    mx: "auto",
  },

  // Hero Section
  heroSection: {
    textAlign: "center",
    mb: 6,
    px: { xs: 3, md: 6 },
    py: { xs: 8, md: 12 },
    background:
      "linear-gradient(135deg, #d4f1f4 0%, #b8e6e9 50%, #a5dde0 100%)",
    borderRadius: 3,
    position: "relative",
    overflow: "hidden",
  },

  heroTitle: {
    fontWeight: 800,
    color: "#1a1a2e",
    mb: 3,
    fontSize: { xs: "2rem", md: "2.75rem" },
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
  },

  heroDescription: {
    color: "#2d3748",
    maxWidth: "720px",
    mx: "auto",
    mb: 4,
    fontSize: { xs: "1rem", md: "1.1rem" },
    lineHeight: 1.75,
    fontWeight: 400,
  },

  heroCTA: {
    display: "flex",
    gap: 2,
    justifyContent: "center",
    flexWrap: "wrap",
  },

  primaryButton: {
    bgcolor: "#00bfa5",
    textTransform: "none",
    px: 5,
    py: 1.75,
    fontSize: "1rem",
    fontWeight: 600,
    borderRadius: 2,
    boxShadow: "0 4px 14px rgba(0, 191, 165, 0.35)",
    "&:hover": {
      bgcolor: "#00a591",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 20px rgba(0, 191, 165, 0.45)",
    },
    transition: "all 0.3s ease",
  },

  secondaryButton: {
    borderColor: "#00bfa5",
    color: "#00bfa5",
    textTransform: "none",
    px: 5,
    py: 1.75,
    fontSize: "1rem",
    fontWeight: 600,
    borderRadius: 2,
    borderWidth: 2,
    bgcolor: "white",
    "&:hover": {
      borderColor: "#00a591",
      bgcolor: "white",
      borderWidth: 2,
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    },
    transition: "all 0.3s ease",
  },

  // Stats Section
  statsSection: {
    mb: 6,
    width: "100%",
  },

  statCard: {
    textAlign: "center",
    p: 4,
    bgcolor: "white",
    borderRadius: 3,
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    transition: "all 0.3s ease",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    minHeight: "180px",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0, 191, 165, 0.12)",
    },
  },

  statNumber: {
    fontWeight: 700,
    color: "#00bfa5",
    mb: 1,
    fontSize: { xs: "2rem", md: "2.25rem" },
  },

  statLabel: {
    color: "#1a1a2e",
    fontWeight: 700,
    mb: 1,
    fontSize: "0.75rem",
    letterSpacing: "1px",
  },

  statSubtext: {
    color: "#718096",
    fontSize: "0.8rem",
  },

  // Section Styles
  sectionMargin: {
    mb: 6,
  },

  sectionTitle: {
    fontWeight: 700,
    color: "#1a1a2e",
    mb: 2,
    fontSize: { xs: "1.75rem", md: "2rem" },
    textAlign: "center",
  },

  sectionDescription: {
    color: "#4a5568",
    textAlign: "center",
    maxWidth: "750px",
    mx: "auto",
    mb: 4,
    fontSize: "1rem",
    lineHeight: 1.7,
  },

  // Impact Cards
  impactCard: {
    p: 4,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    borderRadius: 3,
    bgcolor: "white",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    minHeight: "320px",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 12px 32px rgba(0, 0, 0, 0.12)",
    },
  },

  iconBox: {
    width: 72,
    height: 72,
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mb: 2.5,
  },

  cardTitle: {
    fontWeight: 700,
    color: "#1a1a2e",
    mb: 1.5,
    fontSize: "1.25rem",
  },

  cardDescription: {
    color: "#4a5568",
    mb: 2.5,
    lineHeight: 1.7,
    flex: 1,
    fontSize: "0.95rem",
  },

  learnMoreButton: {
    textTransform: "none",
    color: "#00bfa5",
    p: 0,
    justifyContent: "flex-start",
    fontWeight: 600,
    fontSize: "0.95rem",
    "&:hover": {
      bgcolor: "transparent",
      textDecoration: "underline",
    },
  },

  // Distribution Card
  distributionCard: {
    p: 5,
    mb: 6,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
    borderRadius: 2,
    bgcolor: "white",
  },

  progressSection: {
    mt: 4,
  },

  progressItem: {
    mb: 3.5,
  },

  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    mb: 1.5,
  },

  progressPercent: {
    fontWeight: 700,
    color: "#00bfa5",
    fontSize: "1.1rem",
  },

  progressBar: {
    height: 10,
    borderRadius: 5,
    bgcolor: "#e2e8f0",
    "& .MuiLinearProgress-bar": {
      bgcolor: "#00bfa5",
      borderRadius: 5,
    },
  },

  disclaimer: {
    color: "#718096",
    display: "block",
    mt: 3,
    fontStyle: "italic",
    fontSize: "0.85rem",
  },

  // Testimonials - COMPLETELY REDESIGNED
  testimonialCard: {
    p: 4,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "all 0.3s ease",
    borderRadius: 3,
    bgcolor: "white",
    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e2e8f0",
    minHeight: "280px",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
      borderColor: "#00bfa5",
    },
  },

  rating: {
    mb: 2.5,
    "& .MuiRating-icon": {
      color: "#fbbf24",
      fontSize: "1.2rem",
    },
  },

  testimonialText: {
    color: "#4a5568",
    mb: 3,
    flex: 1,
    lineHeight: 1.8,
    fontSize: "0.95rem",
    fontWeight: 400,
  },

  testimonialAuthor: {
    display: "flex",
    alignItems: "center",
    gap: 1.5,
    pt: 2,
    borderTop: "1px solid #e2e8f0",
  },

  avatar: {
    bgcolor: "#00bfa5",
    width: 48,
    height: 48,
    fontSize: "1rem",
    fontWeight: 600,
  },

  authorName: {
    fontWeight: 700,
    color: "#1a1a2e",
    fontSize: "0.95rem",
    mb: 0.25,
  },

  authorLocation: {
    color: "#718096",
    fontSize: "0.8rem",
  },

  // FAQ Section
  faqContainer: {
    maxWidth: "800px",
    mx: "auto",
  },

  accordion: {
    mb: 1.5,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    borderRadius: "8px !important",
    "&:before": {
      display: "none",
    },
    "&.Mui-expanded": {
      margin: "0 0 12px 0",
    },
  },

  faqQuestion: {
    fontWeight: 600,
    color: "#1a1a2e",
    fontSize: "1rem",
  },

  faqAnswer: {
    color: "#4a5568",
    lineHeight: 1.7,
    fontSize: "0.95rem",
  },
};
