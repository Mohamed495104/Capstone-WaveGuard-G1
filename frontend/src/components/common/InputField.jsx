'use client';
import { TextField } from '@mui/material';

export default function InputField({ label, ...props }) {
    return (
        <TextField
            label={label}
            fullWidth
            variant="outlined"
            margin="normal"
            InputProps={{
                style: { borderRadius: 10 },
            }}
            {...props}
        />
    );
}
