import React from "react";
import { Box, Typography, Button } from "@mui/material";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { CtaBoxStyle } from "@/app/(protected)/challenges/challenge.styles";

const CTASection = () => {
    return (
        <Box sx={CtaBoxStyle}>
            <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold' }}>
                Can't find a challenge near you?
            </Typography>
            <Typography variant="body1" sx={{ my: 2, maxWidth: '500px', mx: 'auto' }}>
                Take the lead! Propose a new cleanup challenge in your community and inspire others to join the cause.
            </Typography>
            <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<AddCircleOutlineIcon />}
            >
                Propose a New Challenge
            </Button>
        </Box>
    );
};

export default CTASection;