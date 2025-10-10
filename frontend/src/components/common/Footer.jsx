'use client';
import { Box, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Box
            sx={{
                textAlign: 'center',
                py: 3,
                mt: 8,
                color: 'text.secondary',
                fontSize: 14,
            }}
        >
            <Typography variant="body2">
                © {new Date().getFullYear()} WaveGuard | Protecting Canada’s Shorelines 🌊
            </Typography>
        </Box>
    );
}
