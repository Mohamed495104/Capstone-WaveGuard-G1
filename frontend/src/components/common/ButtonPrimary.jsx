'use client';
import { Button } from '@mui/material';

export default function ButtonPrimary({ children, ...props }) {
    return (
        <Button
            variant="contained"
            color="primary"
            fullWidth
            disableElevation
            sx={{
                borderRadius: 8,
                py: 1.4,
                fontWeight: 500,
                textTransform: 'none',
                fontSize: '1rem',
            }}
            {...props}
        >
            {children}
        </Button>
    );
}
