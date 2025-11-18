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
  FormControlLabel,
  Checkbox,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { useRouter } from "next/navigation";
import { apiCall } from "@/utils/api";
import withAuth from "@/components/auth/withAuth";
import { getCurrentLocation, formatLocationError } from "@/utils/geolocation";

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
    activateInstantly: false,
  });

  const [errors, setErrors] = useState({});
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);

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
    
    // Only validate dates if not activating instantly
    if (!form.activateInstantly) {
      if (!form.startDate) newErrors.startDate = "Start date required";
      if (!form.endDate) newErrors.endDate = "End date required";
    }
    
    if (!form.latitude) newErrors.latitude = "Latitude required";
    if (!form.longitude) newErrors.longitude = "Longitude required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "province") {
      setForm((prev) => ({
        ...prev,
        province: value,
        region: PROVINCE_TO_REGION[value] || "",
      }));
      return;
    }

    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
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

  const handleGetLocation = async () => {
    setFetchingLocation(true);
    try {
      const location = await getCurrentLocation();
      setForm((prev) => ({
        ...prev,
        latitude: location.latitude.toFixed(6),
        longitude: location.longitude.toFixed(6),
      }));
      setSnackbar({
        open: true,
        severity: "success",
        message: "Location retrieved successfully!",
      });
      // Clear any previous errors for lat/long
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.latitude;
        delete newErrors.longitude;
        return newErrors;
      });
    } catch (error) {
      setSnackbar({
        open: true,
        severity: "error",
        message: formatLocationError(error),
      });
    } finally {
      setFetchingLocation(false);
    }
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

    // Calculate dates based on instant activation
    let startDate = form.startDate;
    let endDate = form.endDate;
    
    if (form.activateInstantly) {
      // Set start date to now
      startDate = new Date().toISOString();
      // Set end date to 30 days from now if not specified
      if (!endDate) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        endDate = futureDate.toISOString();
      }
    }

    const payload = {
      ...form,
      goal: Number(form.goal),
      bannerImage,
      startDate,
      endDate,
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

            {/* Instant Activation Option */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.activateInstantly}
                  onChange={handleChange}
                  name="activateInstantly"
                  color="primary"
                />
              }
              label="Activate challenge instantly (starts now)"
              sx={{ mb: 2 }}
            />

            {/* Dates - Only show if not instant activation */}
            {!form.activateInstantly && (
              <>
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
              </>
            )}

            {/* Optional End Date for instant activation */}
            {form.activateInstantly && (
              <TextField
                id="endDate"
                label="End Date (Optional - defaults to 30 days)"
                type="date"
                name="endDate"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
                value={form.endDate}
                onChange={handleChange}
              />
            )}

            {/* Location Coordinates Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Typography sx={{ fontWeight: 600 }}>
                  Challenge Location Coordinates *
                </Typography>
                <Tooltip title="Use your current location">
                  <IconButton
                    onClick={handleGetLocation}
                    disabled={fetchingLocation}
                    color="primary"
                    size="small"
                  >
                    {fetchingLocation ? (
                      <CircularProgress size={20} />
                    ) : (
                      <MyLocationIcon />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              <Typography sx={{ color: "#64748b", fontSize: "0.875rem", mb: 2 }}>
                Click the location icon to auto-fetch your current coordinates
              </Typography>
            </Box>

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
              helperText={errors.latitude || "Example: 43.6532"}
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
              helperText={errors.longitude || "Example: -79.3832"}
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
