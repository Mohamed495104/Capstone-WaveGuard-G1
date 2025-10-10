"use client";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    const handleClick = () => {
        document.body.style.transition = "all 1s ease-in-out";
        router.push("/signup");
    };

    return (
        <Box
            sx={{
                height: "100vh",
                width: "100vw",
                backgroundImage: "url('/images/image1.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                color: "#fff",
                p: 2,
            }}
        >
            <Typography variant="h3" fontWeight={700} mb={2}>
                Welcome to WaveGuard
            </Typography>
            <Typography variant="h6" mb={4} sx={{ opacity: 0.85 }}>
                Join 2,800+ volunteers making a real environmental impact.
            </Typography>
            <Button
                onClick={handleClick}
                variant="contained"
                sx={{
                    backgroundColor: "#fff",
                    color: "#0891b2",
                    fontWeight: 700,
                    px: 5,
                    py: 1.5,
                    borderRadius: "12px",
                    textTransform: "none",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
                }}
            >
                Get Started
            </Button>
        </Box>
    );
}
