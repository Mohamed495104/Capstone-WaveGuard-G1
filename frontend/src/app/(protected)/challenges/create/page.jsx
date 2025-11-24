"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Chip,
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
    startNow: false, // New: instant start option
  });

  const [userLocation, setUserLocation] = useState(null); // Auto-fetched user GPS
  const [selectedLocation, setSelectedLocation] = useState(null); // Selected location from search
  const [locationError, setLocationError] = useState("");
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [errors, setErrors] = useState({});
  const [bannerPreview, setBannerPreview] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  
  // Location search states
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [searchingLocations, setSearchingLocations] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [waterVerified, setWaterVerified] = useState(false);
  const [verifyingWater, setVerifyingWater] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "",
    message: "",
  });

  // Auto-fetch user location on component mount
  useEffect(() => {
    fetchUserLocation();
  }, []);

  // Debounced location search
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (locationSearchQuery.length >= 2) {
        searchLocations(locationSearchQuery);
      } else {
        setLocationSuggestions([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delaySearch);
  }, [locationSearchQuery]);

  // Search Canadian locations using Nominatim via backend
  const searchLocations = async (query) => {
    if (!query || query.length < 2) return;
    
    setSearchingLocations(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/location/search?q=${encodeURIComponent(query)}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setLocationSuggestions(data.locations || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error("Location search error:", error);
    } finally {
      setSearchingLocations(false);
    }
  };

  // Verify if location is near water bodies
  const verifyWaterProximity = async (lat, lon) => {
    setVerifyingWater(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/location/verify-water?lat=${lat}&lon=${lon}`,
        { credentials: 'include' }
      );
      
      if (response.ok) {
        const data = await response.json();
        setWaterVerified(data.isNearWater);
        
        if (data.isNearWater) {
          setSnackbar({
            open: true,
            severity: "success",
            message: data.closestWater 
              ? `✓ Water verified: ${data.closestWater.name} (${data.closestWater.type}) - ${data.closestWater.distance}km away`
              : "✓ Location is near water bodies",
          });
        } else {
          setSnackbar({
            open: true,
            severity: "warning",
            message: "⚠️ This location may not be near shorelines/lakes. Consider selecting a coastal area.",
          });
        }
        return data.isNearWater;
      }
    } catch (error) {
      console.error("Water verification error:", error);
      // Allow creation on error (graceful degradation)
      setWaterVerified(true);
      return true;
    } finally {
      setVerifyingWater(false);
    }
  };

  // Handle location selection from suggestions
  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setLocationSearchQuery(location.name);
    setShowSuggestions(false);
    setForm(prev => ({
      ...prev,
      locationName: location.name.split(',')[0], // First part of address
    }));
    
    // Auto-detect province from location
    const address = location.address || {};
    if (address.state || address.province) {
      const provinceName = address.state || address.province;
      const provinceCode = PROVINCES.find(p => 
        p.name.toLowerCase() === provinceName.toLowerCase()
      )?.code;
      if (provinceCode) {
        setForm(prev => ({
          ...prev,
          province: provinceCode,
          region: PROVINCE_TO_REGION[provinceCode] || "",
        }));
      }
    }
    
    // Verify water proximity for selected location
    await verifyWaterProximity(location.latitude, location.longitude);
  };

  const fetchUserLocation = async () => {
    setFetchingLocation(true);
    setLocationError("");
    
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      
      setSnackbar({
        open: true,
        severity: "success",
        message: "Location detected successfully!",
      });
    } catch (error) {
      console.error("Location error:", error);
      setLocationError(
        error.code === 1 
          ? "Location permission denied. Please enable location access to create challenges." 
          : "Could not fetch location. Please try again."
      );
      setSnackbar({
        open: true,
        severity: "error",
        message: "Failed to get location. You must be within 5km of a shoreline to create challenges.",
      });
    } finally {
      setFetchingLocation(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!bannerFile) newErrors.banner = "Banner image is required";
    if (!form.locationName.trim()) newErrors.locationName = "Location name required";
    if (!form.province) newErrors.province = "Province is required";
    if (!form.goal) newErrors.goal = "Goal is required";
    
    // Validate dates only if not starting now
    if (!form.startNow) {
      if (!form.startDate) newErrors.startDate = "Start date required";
      if (!form.endDate) newErrors.endDate = "End date required";
      
      // Check if end date is after start date
      if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }
    
    // Check if user location is available
    if (!userLocation) {
      newErrors.location = "Location detection required. Please allow location access.";
    }
    
    // Check if a location has been selected from search
    if (!selectedLocation) {
      newErrors.selectedLocation = "Please select a location from the search suggestions";
    }

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
    
    if (name === "startNow") {
      setForm((prev) => ({
        ...prev,
        startNow: checked,
        // Clear date fields when switching to instant start
        ...(checked && { startDate: "", endDate: "" })
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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

    // Calculate dates based on startNow checkbox
    let startDate, endDate;
    if (form.startNow) {
      // Start now: set start to current time, end to 30 days from now
      startDate = new Date().toISOString();
      const end = new Date();
      end.setDate(end.getDate() + 30); // Default 30-day duration
      endDate = end.toISOString();
    } else {
      startDate = new Date(form.startDate).toISOString();
      endDate = new Date(form.endDate).toISOString();
    }

    // Use selected location coordinates (from search) for the challenge
    // User's GPS location is used for proximity verification
    const payload = {
      title: form.title,
      description: form.description,
      locationName: form.locationName,
      province: form.province,
      region: form.region,
      goal: Number(String(form.goal).trim()),
      startDate,
      endDate,
      // Challenge location = selected location from search
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      // User's current GPS for verification
      userLatitude: userLocation.latitude,
      userLongitude: userLocation.longitude,
      bannerImage,
      totalVolunteers: 0,
      totalTrashCollected: 0,
      goalUnit: "items",
      location: {
        coordinates: [Number(selectedLocation.longitude), Number(selectedLocation.latitude)],
      },
      waterVerified, // Flag indicating water proximity was checked
    };

    // Debug: Log the goal value being sent
    console.log("Creating challenge with goal:", payload.goal, "from form value:", form.goal);

    try {
      await apiCall("post", `${process.env.NEXT_PUBLIC_API_URL}/api/challenges`, payload);

      setSnackbar({
        open: true,
        severity: "success",
        message: "Challenge created successfully!",
      });

      setTimeout(() => router.push("/challenges"), 800);
    } catch (error) {
      console.error("Create challenge error:", error);
      const errorMsg = error.response?.data?.message || "Failed to create challenge.";
      setSnackbar({
        open: true,
        severity: "error",
        message: errorMsg,
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

            {/* Location Search with Autocomplete */}
            <Box sx={{ mb: 3, position: 'relative' }}>
              <TextField
                id="locationSearch"
                label="Search Location (City, Beach, Park in Canada) *"
                fullWidth
                value={locationSearchQuery}
                onChange={(e) => {
                  setLocationSearchQuery(e.target.value);
                  setSelectedLocation(null);
                  setWaterVerified(false);
                }}
                onFocus={() => locationSuggestions.length > 0 && setShowSuggestions(true)}
                error={!!errors.selectedLocation}
                helperText={errors.selectedLocation || "Start typing to search Canadian locations"}
                InputProps={{
                  endAdornment: searchingLocations ? <CircularProgress size={20} /> : null
                }}
              />
              
              {/* Location Suggestions Dropdown */}
              {showSuggestions && locationSuggestions.length > 0 && (
                <Paper
                  sx={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    maxHeight: 300,
                    overflow: 'auto',
                    mt: 0.5,
                    boxShadow: 3
                  }}
                >
                  <List dense>
                    {locationSuggestions.map((loc, idx) => (
                      <ListItem key={loc.placeId || idx} disablePadding>
                        <ListItemButton 
                          onClick={() => handleLocationSelect(loc)}
                          sx={{ py: 1.5 }}
                        >
                          <ListItemText 
                            primary={loc.name.split(',').slice(0, 2).join(', ')}
                            secondary={loc.name.split(',').slice(2).join(', ')}
                            primaryTypographyProps={{ fontWeight: 500 }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}
              
              {/* Selected Location & Water Verification Status */}
              {selectedLocation && (
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={`📍 ${selectedLocation.name.split(',')[0]}`}
                    onDelete={() => {
                      setSelectedLocation(null);
                      setLocationSearchQuery("");
                      setWaterVerified(false);
                    }}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                  />
                  {verifyingWater ? (
                    <Chip 
                      label="Verifying water proximity..." 
                      icon={<CircularProgress size={16} />}
                      variant="outlined"
                    />
                  ) : waterVerified ? (
                    <Chip 
                      label="✓ Near water" 
                      color="success"
                      variant="outlined"
                    />
                  ) : (
                    <Chip 
                      label="⚠️ Not near water" 
                      color="warning"
                      variant="outlined"
                    />
                  )}
                </Box>
              )}
            </Box>

            {/* Location Name (auto-filled or manual override) */}
            <TextField
              id="locationName"
              label="Location Display Name *"
              name="locationName"
              fullWidth
              sx={{ mb: 3 }}
              value={form.locationName}
              onChange={handleChange}
              error={!!errors.locationName}
              helperText={errors.locationName || "This name will be shown in the challenge"}
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

            {/* Start Now Checkbox */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.startNow}
                  onChange={handleChange}
                  name="startNow"
                  color="primary"
                />
              }
              label="Start challenge now (30-day duration)"
              sx={{ mb: 2 }}
            />

            {/* Dates - Only show if not starting now */}
            {!form.startNow && (
              <>
                <TextField
                  id="startDate"
                  label="Start Date *"
                  type="datetime-local"
                  name="startDate"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 3 }}
                  value={form.startDate}
                  onChange={handleChange}
                  error={!!errors.startDate}
                  helperText={errors.startDate}
                  inputProps={{
                    'aria-label': 'Challenge start date and time'
                  }}
                />

                <TextField
                  id="endDate"
                  label="End Date *"
                  type="datetime-local"
                  name="endDate"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 3 }}
                  value={form.endDate}
                  onChange={handleChange}
                  error={!!errors.endDate}
                  helperText={errors.endDate}
                  inputProps={{
                    'aria-label': 'Challenge end date and time'
                  }}
                />
              </>
            )}


            {/* Location Status */}
            <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: userLocation ? '#f0fdf4' : '#fef2f2', border: `1px solid ${userLocation ? '#86efac' : '#fecaca'}` }}>
              <Typography sx={{ fontWeight: 600, mb: 1, color: userLocation ? '#166534' : '#991b1b' }}>
                {fetchingLocation ? '📍 Detecting location...' : userLocation ? '✓ Location Verified' : '⚠️ Location Required'}
              </Typography>
              <Typography variant="body2" sx={{ color: userLocation ? '#166534' : '#991b1b' }}>
                {fetchingLocation 
                  ? 'Please allow location access when prompted.'
                  : userLocation
                    ? `Latitude: ${userLocation.latitude.toFixed(6)}, Longitude: ${userLocation.longitude.toFixed(6)}`
                    : locationError || 'Location detection is required. You must be within 5km of the challenge location.'
                }
              </Typography>
              {!userLocation && !fetchingLocation && (
                <Button 
                  onClick={fetchUserLocation}
                  size="small"
                  sx={{ mt: 1, textTransform: 'none' }}
                >
                  Try Again
                </Button>
              )}
              {errors.location && (
                <Typography sx={{ color: 'error.main', mt: 1, fontSize: '0.875rem' }}>
                  {errors.location}
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!userLocation || !selectedLocation || fetchingLocation || verifyingWater}
              sx={{ py: 1.4, fontWeight: 600, background: "#0a5c85ff", mt: 2 }}
            >
              {fetchingLocation ? 'Detecting Location...' : verifyingWater ? 'Verifying Location...' : 'Create Challenge'}
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