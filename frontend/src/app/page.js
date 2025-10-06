"use client";
import { Container, Typography, Button, Box } from "@mui/material";

export default function HomePage() {
    return (
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="h4" gutterBottom>
                Welcome to WaveGuard 🌊
            </Typography>
            <Typography variant="body1" gutterBottom>
                Join cleanup challenges and track your impact.
            </Typography>

            <Box sx={{ mt: 4 }}>
                <Button variant="contained" size="large" fullWidth sx={{ mb: 2 }}>
                    Login
                </Button>
                <Button variant="outlined" size="large" fullWidth>
                    Register
                </Button>
            </Box>
        </Container>
    );
}
