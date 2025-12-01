import { styled } from "@mui/material/styles";
import { Box, Card, TextField, Button } from "@mui/material";

export const PageContainer = styled(Box)(({ theme }) => ({
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafb 0%, #ffffff 100%)",
    paddingTop: "40px",
    paddingBottom: "80px",
    [theme.breakpoints.down('md')]: {
        paddingTop: "20px",
        paddingBottom: "60px",
    },
}));

export const HeroSection = styled(Box)(({ theme }) => ({
    background: "linear-gradient(135deg, #003554 0%, #006494 50%, #0077b6 100%)",
    padding: "80px 24px",
    textAlign: "center",
    color: "#fff",
    marginBottom: "60px",
    position: "relative",
    overflow: "hidden",
    "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: "url('/images/hero1-optimized.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.1,
    },
    [theme.breakpoints.down('md')]: {
        padding: "60px 20px",
        marginBottom: "40px",
    },
    [theme.breakpoints.down('sm')]: {
        padding: "40px 16px",
        marginBottom: "32px",
    },
}));

export const HeroContent = styled(Box)({
    position: "relative",
    zIndex: 2,
    maxWidth: "800px",
    margin: "0 auto",
});

export const ContentContainer = styled(Box)(({ theme }) => ({
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 24px",
    [theme.breakpoints.down('md')]: {
        padding: "0 20px",
    },
    [theme.breakpoints.down('sm')]: {
        padding: "0 16px",
    },
}));

export const MainGrid = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "1fr 400px",
    gap: "40px",
    alignItems: "start",
    [theme.breakpoints.down('lg')]: {
        gridTemplateColumns: "1fr 350px",
        gap: "32px",
    },
    [theme.breakpoints.down('md')]: {
        gridTemplateColumns: "1fr",
        gap: "40px",
    },
}));

export const FormCard = styled(Card)(({ theme }) => ({
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e3f2fd",
    background: "#fff",
    [theme.breakpoints.down('md')]: {
        padding: "32px",
    },
    [theme.breakpoints.down('sm')]: {
        padding: "24px 20px",
    },
}));

export const SidebarCard = styled(Card)(({ theme }) => ({
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e3f2fd",
    background: "#fff",
    [theme.breakpoints.down('sm')]: {
        padding: "24px 20px",
    },
}));

export const FAQCard = styled(Card)(({ theme }) => ({
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
    border: "1px solid #e3f2fd",
    background: "#fff",
    marginTop: "24px",
    [theme.breakpoints.down('sm')]: {
        padding: "24px 20px",
    },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: "12px",
        backgroundColor: "#f8fafb",
        transition: "all 0.3s ease",
        "&:hover": {
            backgroundColor: "#fff",
        },
        "&.Mui-focused": {
            backgroundColor: "#fff",
            "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#0891b2",
                borderWidth: "2px",
            },
        },
    },
    "& .MuiInputLabel-root": {
        color: "#64748b",
        "&.Mui-focused": {
            color: "#0891b2",
        },
    },
}));

export const SubmitButton = styled(Button)(({ theme }) => ({
    padding: "14px 32px",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: 600,
    textTransform: "none",
    background: "linear-gradient(135deg, #0891b2 0%, #0077b6 100%)",
    boxShadow: "0 4px 12px rgba(8, 145, 178, 0.3)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
        background: "linear-gradient(135deg, #0077b6 0%, #006494 100%)",
        boxShadow: "0 6px 20px rgba(8, 145, 178, 0.4)",
        transform: "translateY(-2px)",
    },
    "&:active": {
        transform: "translateY(0)",
    },
    "&:disabled": {
        background: "#e2e8f0",
        boxShadow: "none",
    },
}));

export const ContactMethodCard = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    borderRadius: "12px",
    background: "#f8fafb",
    marginBottom: "12px",
    transition: "all 0.3s ease",
    "&:hover": {
        background: "#e0f7fa",
        transform: "translateX(4px)",
    },
    "&:last-child": {
        marginBottom: 0,
    },
}));

export const IconWrapper = styled(Box)(({ theme }) => ({
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0891b2 0%, #0077b6 100%)",
    color: "#fff",
    flexShrink: 0,
}));

export const ResponseBadge = styled(Box)(({ theme }) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "20px",
    background: "rgba(103, 232, 195, 0.15)",
    color: "#059669",
    fontSize: "14px",
    fontWeight: 600,
    marginTop: "16px",
}));
