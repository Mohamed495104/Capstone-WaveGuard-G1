"use client";

import React, { useState, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { apiCall } from "@/utils/api";
import withAuth from "@/components/auth/withAuth";

const PROVINCES = [
  { code: "ON", name: "Ontario" },
  { code: "QC", name: "Quebec" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "SK", name: "Saskatchewan" },
  { code: "MB", name: "Manitoba" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
  { code: "PE", name: "Prince Edward Island" },
  { code: "NL", name: "Newfoundland and Labrador" },
  { code: "YT", name: "Yukon" },
  { code: "NT", name: "Northwest Territories" },
  { code: "NU", name: "Nunavut" },
];

const PROVINCE_TO_REGION = {
  ON: "Central",
  QC: "Central",
  BC: "West",
  AB: "West",
  SK: "West",
  MB: "West",
  NS: "East",
  NB: "East",
  PE: "East",
  NL: "East",
  YT: "North",
  NT: "North",
  NU: "North",
};

function CreateChallengePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    locationName: "",
    province: "",
    region: "",
    goal: "",
    startDate: "",
    endDate: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({});
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!bannerFile) newErrors.banner = "Banner image is required";
    if (!form.locationName.trim()) newErrors.locationName = "Location name required";
    if (!form.province) newErrors.province = "Province is required";
    if (!form.goal) newErrors.goal = "Goal is required";
    if (!form.startDate) newErrors.startDate = "Start date required";
    if (!form.endDate) newErrors.endDate = "End date required";
    if (!form.latitude) newErrors.latitude = "Latitude required";
    if (!form.longitude) newErrors.longitude = "Longitude required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "province") {
      setForm((prev) => ({
        ...prev,
        province: value,
        region: PROVINCE_TO_REGION[value] || "",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const uploadBanner = async () => {
    if (!bannerFile) return null;

    const fd = new FormData();
    fd.append("image", bannerFile);

    try {
      const res = await apiCall(
        "post",
        `${process.env.NEXT_PUBLIC_API_URL}/api/challenges/upload-banner`,
        fd
      );
      return res.data.bannerImage;
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return setSnackbar({
        open: true,
        severity: "error",
        message: "Please fix the highlighted fields.",
      });
    }

    const bannerImage = await uploadBanner();

    const payload = {
      ...form,
      goal: Number(form.goal),
      bannerImage,
      totalVolunteers: 0,
      totalTrashCollected: 0,
      goalUnit: "items",
      location: {
        coordinates: [Number(form.longitude), Number(form.latitude)],
      },
    };

    try {
      await apiCall("post", `${process.env.NEXT_PUBLIC_API_URL}/api/challenges`, payload);

      setSnackbar({
        open: true,
        severity: "success",
        message: "Challenge created successfully!",
      });

      setTimeout(() => router.push("/challenges"), 800);
    } catch {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to create challenge.",
      });
    }
  };

  return (
    <Box sx={{ backgroundColor: "#f0f2f5", py: 6, minHeight: "100vh" }}>
      <Container maxWidth="md">
        <Paper sx={{ p: 4, borderRadius: 3, background: "#fff" }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Create New Challenge
          </Typography>

          <Typography sx={{ mb: 4, color: "#64748b" }}>
            Fill all required fields to create your cleanup event.
          </Typography>

          {/* ACCESSIBLE IMAGE UPLOAD */}
          <Box sx={{ mb: 3 }}>
            <Typography 
              component="label" 
              htmlFor="banner-upload-input"
              sx={{ fontWeight: 600, mb: 1, display: 'block' }}
            >
              Upload Banner Image *
            </Typography>

            <Box
              component="button"
              type="button"
              aria-label="Upload banner image"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                background: "#f8fafc",
                height: "200px",
                width: "100%",
                cursor: "pointer",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: 0,
              }}
            >
              {bannerPreview ? (
                <img
                  src={bannerPreview}
                  alt="Banner preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Typography sx={{ color: "#36393eff" }}>
                  Click to upload an image
                </Typography>
              )}
            </Box>

            {errors.banner && (
              <Typography sx={{ color: "red", mt: 1 }}>{errors.banner}</Typography>
            )}

            <input
              id="banner-upload-input"
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleBannerSelect}
              aria-label="Banner image file input"
              style={{ 
                position: 'absolute',
                left: '-10000px',
                top: 'auto',
                width: '1px',
                height: '1px',
                overflow: 'hidden'
              }}
            />
          </Box>

          {/* FORM */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Title */}
            <TextField
              id="title"
              label="Challenge Title *"
              name="title"
              fullWidth
              sx={{ mb: 3 }}
              value={form.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />

            {/* Description */}
            <Box sx={{ mb: 3 }}>
              <label htmlFor="description-textarea" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>
                Description *
              </label>
              <textarea
                id="description-textarea"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
                aria-label="Challenge description"
                aria-required="true"
                aria-invalid={!!errors.description}
                style={{
                  width: '100%',
                  padding: '16.5px 14px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  border: errors.description ? '1px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.description) {
                    e.target.style.borderColor = '#1976d2';
                    e.target.style.borderWidth = '2px';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.description ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)';
                  e.target.style.borderWidth = '1px';
                }}
              />
              {errors.description && (
                <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                  {errors.description}
                </Typography>
              )}
            </Box>

            {/* Location */}
            <TextField
              id="locationName"
              label="Location Name (City / Beach / Park) *"
              name="locationName"
              fullWidth
              sx={{ mb: 3 }}
              value={form.locationName}
              onChange={handleChange}
              error={!!errors.locationName}
              helperText={errors.locationName}
            />

            {/* Province */}
            <Box sx={{ mb: 3 }}>
              <label htmlFor="province-select" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '14px', color: '#374151' }}>
                Province *
              </label>
              <select
                id="province-select"
                name="province"
                value={form.province}
                onChange={handleChange}
                aria-label="Select province"
                aria-required="true"
                aria-invalid={!!errors.province}
                style={{
                  width: '100%',
                  padding: '16.5px 14px',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  border: errors.province ? '1px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
                  borderRadius: '4px',
                  outline: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => {
                  if (!errors.province) {
                    e.target.style.borderColor = '#1976d2';
                    e.target.style.borderWidth = '2px';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.province ? '#d32f2f' : 'rgba(0, 0, 0, 0.23)';
                  e.target.style.borderWidth = '1px';
                }}
              >
                <option value="">Select a province</option>
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
              {errors.province && (
                <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.5, ml: 1.75 }}>
                  {errors.province}
                </Typography>
              )}
            </Box>

            {/* Region (read only) */}
            <TextField
              id="region"
              label="Region"
              name="region"
              fullWidth
              InputProps={{ readOnly: true }}
              sx={{ mb: 3 }}
              value={form.region}
            />

            {/* Goal */}
            <TextField
              id="goal"
              label="Goal (Number of Items) *"
              name="goal"
              type="number"
              fullWidth
              sx={{ mb: 3 }}
              value={form.goal}
              onChange={handleChange}
              error={!!errors.goal}
              helperText={errors.goal}
            />

            {/* Dates */}
            <TextField
              id="startDate"
              label="Start Date *"
              type="date"
              name="startDate"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              value={form.startDate}
              onChange={handleChange}
              error={!!errors.startDate}
              helperText={errors.startDate}
              inputProps={{
                'aria-label': 'Challenge start date'
              }}
            />

            <TextField
              id="endDate"
              label="End Date *"
              type="date"
              name="endDate"
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 3 }}
              value={form.endDate}
              onChange={handleChange}
              error={!!errors.endDate}
              helperText={errors.endDate}
              inputProps={{
                'aria-label': 'Challenge end date'
              }}
            />

            {/* Coordinates */}
            <TextField
              id="latitude"
              label="Latitude *"
              name="latitude"
              fullWidth
              sx={{ mb: 3 }}
              value={form.latitude}
              onChange={handleChange}
              error={!!errors.latitude}
              helperText={errors.latitude}
            />

            <TextField
              id="longitude"
              label="Longitude *"
              name="longitude"
              fullWidth
              sx={{ mb: 3 }}
              value={form.longitude}
              onChange={handleChange}
              error={!!errors.longitude}
              helperText={errors.longitude}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: 1.4, fontWeight: 600, background: "#0a5c85ff", mt: 2 }}
            >
              Create Challenge
            </Button>
          </form>
        </Paper>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default withAuth(CreateChallengePage);