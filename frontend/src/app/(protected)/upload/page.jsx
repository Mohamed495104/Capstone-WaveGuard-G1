"use client";
import React, { useState, useRef } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Paper,
    Grid,
    IconButton,
} from "@mui/material";
import {
    CloudUpload,
    CameraAlt,
    Close,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import withAuth from "@/components/auth/withAuth";

function UploadPage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const wasteTypes = [
        { icon: "🍾", label: "Plastic Bottles" },
        { icon: "🥫", label: "Aluminum Cans" },
        { icon: "🛍️", label: "Plastic Bags" },
        { icon: "🍔", label: "Food Wrappers" },
        { icon: "🚬", label: "Cigarette Butts" },
        { icon: "🍷", label: "Glass Bottles" },
    ];

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleTakePhoto = () => {
        // Implement camera functionality
        console.log("Opening camera...");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: "#f8fafb",
                pb: 4,
            }}
        >
            <Container maxWidth="lg" sx={{ pt: { xs: 2, sm: 3, md: 4 } }}>
                {/* Header */}
                <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4, md: 5 } }}>
                    <Typography
                        variant="h4"
                        sx={{
                            fontWeight: 700,
                            color: "#0d1b2a",
                            mb: 1.5,
                            fontSize: { xs: "1.75rem", sm: "2rem", md: "2.125rem" },
                        }}
                    >
                        Upload Cleanup Photos
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: "#64748b",
                            maxWidth: 600,
                            mx: "auto",
                            fontSize: { xs: "0.95rem", sm: "1rem" },
                            px: 2,
                        }}
                    >
                        Our AI automatically identifies and classifies waste from your
                        photos. Just upload and let WaveGuard do the rest!
                    </Typography>
                </Box>

                {/* Upload Zone */}
                <Paper
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    sx={{
                        p: { xs: 3, sm: 4, md: 5 },
                        mb: 4,
                        borderRadius: "16px",
                        border: isDragging
                            ? "2px dashed #0891b2"
                            : "2px dashed #e2e8f0",
                        backgroundColor: isDragging ? "#f0f9ff" : "#fff",
                        transition: "all 0.3s ease",
                        textAlign: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: 80,
                                height: 80,
                                borderRadius: "50%",
                                backgroundColor: "#e0f2fe",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mb: 1,
                            }}
                        >
                            <CloudUpload sx={{ fontSize: 40, color: "#0891b2" }} />
                        </Box>

                        <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, color: "#0d1b2a" }}
                        >
                            Drop your photos here
                        </Typography>

                        <Typography
                            variant="body2"
                            sx={{ color: "#64748b", mb: 1 }}
                        >
                            or click to browse from your device
                        </Typography>

                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                            <Button
                                variant="contained"
                                startIcon={<CloudUpload />}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    backgroundColor: "#0891b2",
                                    color: "#fff",
                                    px: 3,
                                    py: 1.2,
                                    borderRadius: "10px",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    "&:hover": {
                                        backgroundColor: "#0e7490",
                                    },
                                }}
                            >
                                Choose File
                            </Button>

                            <Button
                                variant="outlined"
                                startIcon={<CameraAlt />}
                                onClick={handleTakePhoto}
                                sx={{
                                    borderColor: "#0891b2",
                                    color: "#0891b2",
                                    px: 3,
                                    py: 1.2,
                                    borderRadius: "10px",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    "&:hover": {
                                        borderColor: "#0e7490",
                                        backgroundColor: "#f0f9ff",
                                    },
                                }}
                            >
                                Take Photo
                            </Button>
                        </Box>

                        <Typography
                            variant="caption"
                            sx={{ color: "#94a3b8", mt: 1 }}
                        >
                            Supports: JPG, PNG, HEIC • Max size: 10MB
                        </Typography>
                    </Box>

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileSelect}
                    />
                </Paper>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                    <Paper
                        sx={{
                            p: 3,
                            mb: 4,
                            borderRadius: "16px",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 600, color: "#0d1b2a" }}
                        >
                            Selected Photos ({selectedFiles.length})
                        </Typography>
                        <Grid container spacing={2}>
                            {selectedFiles.map((file, index) => (
                                <Grid item xs={6} sm={4} md={3} key={index}>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            paddingTop: "100%",
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            backgroundColor: "#f1f5f9",
                                        }}
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                        <IconButton
                                            onClick={() => removeFile(index)}
                                            sx={{
                                                position: "absolute",
                                                top: 8,
                                                right: 8,
                                                backgroundColor: "rgba(0,0,0,0.6)",
                                                color: "#fff",
                                                width: 28,
                                                height: 28,
                                                "&:hover": {
                                                    backgroundColor: "rgba(0,0,0,0.8)",
                                                },
                                            }}
                                        >
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}

                {/* How AI Detection Works */}
                <Paper
                    sx={{
                        p: { xs: 3, sm: 4 },
                        mb: 4,
                        borderRadius: "16px",
                        backgroundColor: "#f0f9ff",
                        border: "1px solid #e0f2fe",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                            color: "#0d1b2a",
                            mb: 3,
                        }}
                    >
                        How AI Detection Works
                    </Typography>

                    <Grid container spacing={3}>
                        {[
                            {
                                step: "1",
                                title: "Upload Photo",
                                desc: "Take a photo of your collected waste items",
                            },
                            {
                                step: "2",
                                title: "AI Analysis",
                                desc: "Advanced AI identifies and counts each waste type",
                            },
                            {
                                step: "3",
                                title: "Track Impact",
                                desc: "Your data contributes to community insights",
                            },
                        ].map((item, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Box
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            backgroundColor: "#0891b2",
                                            color: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                            fontSize: "1.25rem",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {item.step}
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 600,
                                                color: "#0d1b2a",
                                                mb: 0.5,
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#64748b" }}
                                        >
                                            {item.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* Detectable Waste Types */}
                <Paper
                    sx={{
                        p: { xs: 2.5, sm: 4 },
                        borderRadius: "18px",
                        background:
                            "linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.85) 100%)",
                        backdropFilter: "blur(10px)",
                        boxShadow: {
                            xs: "0 4px 20px rgba(0,0,0,0.05)",
                            sm: "none",
                        },
                        border: { xs: "1px solid rgba(14,116,144,0.1)", sm: "1px solid #e2e8f0" },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            color: "#0d1b2a",
                            mb: { xs: 2.5, sm: 3 },
                            fontSize: { xs: "1.1rem", sm: "1.25rem" },
                            textAlign: { xs: "center", sm: "left" },
                        }}
                    >
                        Detectable Waste Types
                    </Typography>

                    <Grid
                        container
                        spacing={{ xs: 1.8, sm: 2 }}
                        justifyContent="center"
                        alignItems="stretch"
                    >
                        {wasteTypes.map((type, index) => (
                            <Grid item xs={6} sm={4} md={4} key={index}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2, sm: 2.5 },
                                        borderRadius: "16px",
                                        background:
                                            "linear-gradient(145deg, #f9fafb 0%, #f0f9ff 100%)",
                                        border: "1px solid rgba(8,145,178,0.1)",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 1,
                                        transition: "all 0.25s ease",
                                        cursor: "pointer",
                                        boxShadow: "0 3px 10px rgba(0,0,0,0.04)",
                                        "&:active": {
                                            transform: "scale(0.96)",
                                        },
                                        "&:hover": {
                                            background:
                                                "linear-gradient(145deg, #ecfeff 0%, #e0f7ff 100%)",
                                            boxShadow: "0 6px 18px rgba(8,145,178,0.15)",
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            fontSize: "2rem",
                                            width: 52,
                                            height: 52,
                                            borderRadius: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            background:
                                                "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)",
                                            mb: 0.5,
                                            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.5)",
                                        }}
                                    >
                                        {type.icon}
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            color: "#0f172a",
                                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                            textAlign: "center",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {type.label}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>
            </Container>
        </Box>
    );
}
export default withAuth(UploadPage);