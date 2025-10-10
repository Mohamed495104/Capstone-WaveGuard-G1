'use client';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

export default function Navbar() {
    return (
        <AppBar position="static" color="transparent" elevation={0}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                <Typography variant="h6" fontWeight={600} color="primary">
                    WaveGuard
                </Typography>
                <Box></Box> {/* nav links will go here later */}
            </Toolbar>
        </AppBar>
    );
}
