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
import { CloudUpload, CameraAlt, Close } from "@mui/icons-material";
import withAuth from "@/components/auth/withAuth";
import {
    PageContainerStyle,
    MainContainerStyle,
    HeaderBoxStyle,
    HeaderTitleStyle,
    HeaderSubtitleStyle,
    UploadZoneStyle,
    UploadIconContainerStyle,
    ChooseFileButtonStyle,
    TakePhotoButtonStyle,
    PreviewCardStyle,
    PreviewImageContainerStyle,
    PreviewImageStyle,
    RemoveFileButtonStyle,
    InfoCardStyle,
    StepIconStyle,
    WasteTypesContainerStyle,
    WasteTypeCardStyle,
    WasteTypeIconContainerStyle,
} from "./upload.styles";

function UploadPage() {
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

    const howItWorksSteps = [
        { step: "1", title: "Upload Photo", desc: "Take a photo of your collected waste items" },
        { step: "2", title: "AI Analysis", desc: "Advanced AI identifies and counts each waste type" },
        { step: "3", title: "Track Impact", desc: "Your data contributes to community insights" },
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
        console.log("Opening camera...");
    };

    return (
        <Box sx={PageContainerStyle}>
            <Container maxWidth="lg" sx={MainContainerStyle}>
                {/* Header */}
                <Box sx={HeaderBoxStyle}>
                    <Typography variant="h4" sx={HeaderTitleStyle}>
                        Upload Cleanup Photos
                    </Typography>
                    <Typography variant="body1" sx={HeaderSubtitleStyle}>
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
                        ...UploadZoneStyle,
                        border: isDragging ? "2px dashed #0891b2" : "2px dashed #e2e8f0",
                        backgroundColor: isDragging ? "#f0f9ff" : "#fff",
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <Box sx={UploadIconContainerStyle}>
                            <CloudUpload sx={{ fontSize: 40, color: "#0891b2" }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#0d1b2a" }}>
                            Drop your photos here
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                            or click to browse from your device
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
                            <Button variant="contained" startIcon={<CloudUpload />} onClick={() => fileInputRef.current?.click()} sx={ChooseFileButtonStyle}>
                                Choose File
                            </Button>
                            <Button variant="outlined" startIcon={<CameraAlt />} onClick={handleTakePhoto} sx={TakePhotoButtonStyle}>
                                Take Photo
                            </Button>
                        </Box>
                        <Typography variant="caption" sx={{ color: "#94a3b8", mt: 1 }}>
                            Supports: JPG, PNG, HEIC • Max size: 10MB
                        </Typography>
                    </Box>
                    <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: "none" }} onChange={handleFileSelect} />
                </Paper>

                {/* Selected Files Preview */}
                {selectedFiles.length > 0 && (
                    <Paper sx={PreviewCardStyle}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#0d1b2a" }}>
                            Selected Photos ({selectedFiles.length})
                        </Typography>
                        <Grid container spacing={2}>
                            {selectedFiles.map((file, index) => (
                                <Grid item xs={6} sm={4} md={3} key={index}>
                                    <Box sx={PreviewImageContainerStyle}>
                                        <img src={URL.createObjectURL(file)} alt={file.name} style={PreviewImageStyle} />
                                        <IconButton onClick={() => removeFile(index)} sx={RemoveFileButtonStyle}>
                                            <Close fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}

                {/* How AI Detection Works */}
                <Paper sx={InfoCardStyle}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: "#0d1b2a", mb: 3 }}>
                        How AI Detection Works
                    </Typography>
                    <Grid container spacing={3}>
                        {howItWorksSteps.map((item, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                <Box sx={{ display: "flex", gap: 2 }}>
                                    <Box sx={StepIconStyle}>{item.step}</Box>
                                    <Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0d1b2a", mb: 0.5 }}>
                                            {item.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                                            {item.desc}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Paper>

                {/* Detectable Waste Types */}
                <Paper sx={WasteTypesContainerStyle}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#0d1b2a", mb: { xs: 2.5, sm: 3 }, fontSize: { xs: "1.1rem", sm: "1.25rem" }, textAlign: { xs: "center", sm: "left" } }}>
                        Detectable Waste Types
                    </Typography>
                    <Grid container spacing={{ xs: 1.8, sm: 2 }} justifyContent="center" alignItems="stretch">
                        {wasteTypes.map((type, index) => (
                            <Grid item xs={6} sm={4} md={4} key={index}>
                                <Paper elevation={0} sx={WasteTypeCardStyle}>
                                    <Box sx={WasteTypeIconContainerStyle}>{type.icon}</Box>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#0f172a", fontSize: { xs: "0.8rem", sm: "0.9rem" }, textAlign: "center", lineHeight: 1.2 }}>
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