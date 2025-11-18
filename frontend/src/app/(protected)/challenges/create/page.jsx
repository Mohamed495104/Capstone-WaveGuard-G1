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
            <Typography sx={{ fontWeight: 600, mb: 1 }}>
              Upload Banner Image *
            </Typography>

            <button
              type="button"
              aria-label="Upload banner image"
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                background: "#f8fafc",
                height: "200px",
                width: "100%",
                cursor: "pointer",
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
                    borderRadius: "8px",
                  }}
                />
              ) : (
                <Typography sx={{ color: "#94a3b8" }}>
                  Click to upload an image
                </Typography>
              )}
            </button>

            {errors.banner && (
              <Typography sx={{ color: "red", mt: 1 }}>{errors.banner}</Typography>
            )}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleBannerSelect}
              style={{ display: "none" }}
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
            <TextField
              id="description"
              label="Description *"
              name="description"
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 3 }}
              value={form.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />

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
            <TextField
              id="province"
              select
              label="Province *"
              name="province"
              fullWidth
              sx={{ mb: 3 }}
              value={form.province}
              onChange={handleChange}
              error={!!errors.province}
              helperText={errors.province}
            >
              {PROVINCES.map((p) => (
                <MenuItem key={p.code} value={p.code}>
                  {p.name}
                </MenuItem>
              ))}
            </TextField>

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
              sx={{ py: 1.4, fontWeight: 600, background: "#0284c7", mt: 2 }}
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
