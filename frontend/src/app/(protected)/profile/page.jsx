'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiCall, requestCache } from '@/utils/api';
import { useAuthContext } from '@/context/AuthContext';
import { Box, Typography, Avatar, Button, TextField, Autocomplete, Switch, IconButton, CircularProgress, Tooltip, Alert } from '@mui/material';
import {
    EmailOutlined,
    LocationOnOutlined,
    CalendarTodayOutlined,
    ExitToAppOutlined,
    RecyclingOutlined,
    EmojiEventsOutlined,
    EditOutlined,
    PersonOutline,
    WorkspacesOutlined,
    Delete,
    VolunteerActivism,
    Filter3,
    CameraAlt,
} from '@mui/icons-material';
import { styles } from './profile.styles';
import withAuth from '@/components/auth/withAuth';

const ProfilePage = () => {
    const router = useRouter();
    const { user: authUser, authVersion } = useAuthContext(); // Get auth context
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [uploadSuccess, setUploadSuccess] = useState('');
    
    // Profile update state
    const [profileUpdateSuccess, setProfileUpdateSuccess] = useState('');
    const [profileUpdateError, setProfileUpdateError] = useState('');
    const [savingProfile, setSavingProfile] = useState(false);

    // User profile state
    const [userProfile, setUserProfile] = useState({
        name: '',
        email: '',
        location: '',
        bio: '',
        profileImage: '',
        totalItemsCollected: 0,
        totalChallenges: 0,
        impactScore: 0,
        badges: [],
        joinedChallenges: [],
        createdAt: null,
        // Address fields
        address: {
            fullAddress: '',
            streetAddress: '',
            city: '',
            province: '',
            postalCode: '',
            country: 'Canada',
            coordinates: { latitude: null, longitude: null }
        }
    });

    // Recent achievements state
    const [achievements, setAchievements] = useState([]);
    const [achievementsLoading, setAchievementsLoading] = useState(true);
    const [hasAchievements, setHasAchievements] = useState(false);

    // Address autocomplete state (Nominatim)
    const [addressOptions, setAddressOptions] = useState([]);
    const [addressInputValue, setAddressInputValue] = useState('');
    const [addressSearching, setAddressSearching] = useState(false);
    const addressSearchTimeout = useRef(null);

    // Temporary edit state
    const [editProfile, setEditProfile] = useState({ ...userProfile });

    // Settings state
    const [settings, setSettings] = useState({
        emailNotifications: true,
        weeklySummary: true,
        achievementAlerts: true,
        profileVisibility: true,
        showStatsOnLeaderboard: true,
    });

    // Track original settings to detect changes
    const [originalSettings, setOriginalSettings] = useState({
        emailNotifications: true,
        weeklySummary: true,
        achievementAlerts: true,
        profileVisibility: true,
        showStatsOnLeaderboard: true,
    });

    // Check if settings have changed
    const hasSettingsChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);

    // Search addresses using Nominatim API (debounced)
    const searchAddresses = async (query) => {
        if (!query || query.trim().length < 3) {
            setAddressOptions([]);
            return;
        }

        setAddressSearching(true);
        try {
            // Use our backend proxy for Nominatim to avoid CORS issues
            const response = await apiCall(
                'get',
                `${process.env.NEXT_PUBLIC_API_URL}/api/location/search?q=${encodeURIComponent(query)}`,
                {},
                false
            );

            if (response?.data?.locations) {
                setAddressOptions(response.data.locations);
            } else {
                setAddressOptions([]);
            }
        } catch (error) {
            console.error('Address search failed:', error);
            setAddressOptions([]);
        } finally {
            setAddressSearching(false);
        }
    };

    // Handle address input change with debounce
    const handleAddressInputChange = (event, newInputValue) => {
        setAddressInputValue(newInputValue);
        
        // Clear previous timeout
        if (addressSearchTimeout.current) {
            clearTimeout(addressSearchTimeout.current);
        }
        
        // Debounce search by 500ms (Nominatim rate limit is 1 req/sec)
        addressSearchTimeout.current = setTimeout(() => {
            searchAddresses(newInputValue);
        }, 500);
    };

    // Handle address selection from autocomplete
    const handleAddressSelect = (event, selectedLocation) => {
        if (!selectedLocation) return;

        // Parse address components from Nominatim result
        const address = selectedLocation.address || {};
        
        const newAddress = {
            fullAddress: selectedLocation.name || '',
            streetAddress: [address.house_number, address.road].filter(Boolean).join(' ') || '',
            city: address.city || address.town || address.village || address.municipality || '',
            province: address.state || address.province || '',
            postalCode: address.postcode || '',
            country: address.country || 'Canada',
            coordinates: {
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude
            }
        };

        setEditProfile(prev => ({
            ...prev,
            address: newAddress,
            location: newAddress.city && newAddress.province 
                ? `${newAddress.city}, ${newAddress.province}` 
                : newAddress.fullAddress
        }));

        // Update input to show formatted address
        setAddressInputValue(selectedLocation.name || '');
    };

    async function fetchProfile() {
        try {
            // Disable cache to always get fresh profile data (important for user switching)
            const res = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`, {}, false, { useCache: false });
            if (res?.data) {
                // Ensure profile image URL is properly formatted
                const profileImage = res.data.profileImage 
                    ? (res.data.profileImage.startsWith('http') 
                        ? res.data.profileImage 
                        : `${process.env.NEXT_PUBLIC_API_URL}${res.data.profileImage}`)
                    : '';
                
                // Handle address data
                const address = res.data.address || {
                    fullAddress: '',
                    streetAddress: '',
                    city: '',
                    province: '',
                    postalCode: '',
                    country: 'Canada',
                    coordinates: { latitude: null, longitude: null }
                };
                
                setUserProfile({
                    name: res.data.name || '',
                    email: res.data.email || '',
                    location: res.data.location || '',
                    bio: res.data.bio || '',
                    profileImage: profileImage,
                    totalItemsCollected: res.data.totalItemsCollected || 0,
                    totalChallenges: res.data.totalChallenges || 0,
                    impactScore: res.data.impactScore || 0,
                    badges: res.data.badges || [],
                    joinedChallenges: res.data.joinedChallenges || [],
                    createdAt: res.data.createdAt || null,
                    address: address,
                });
                
                // Set address input value for autocomplete
                if (address.fullAddress) {
                    setAddressInputValue(address.fullAddress);
                }
            }
        } catch (error) {
            console.error('Failed to load profile:', error);
        }
    }

    async function fetchRecentAchievements() {
        try {
            setAchievementsLoading(true);
            const res = await apiCall('get', `${process.env.NEXT_PUBLIC_API_URL}/api/achievements/recent`);
            if (res?.data) {
                setHasAchievements(res.data.hasAchievements);
                if (res.data.achievements && res.data.achievements.length > 0) {
                    // Format achievements for display
                    const formattedAchievements = res.data.achievements.map(achievement => {
                        // Validate and format date
                        let formattedDate = 'Recently';
                        if (achievement.date) {
                            try {
                                const date = new Date(achievement.date);
                                if (!isNaN(date.getTime())) {
                                    formattedDate = date.toLocaleDateString('en-US', { 
                                        month: 'short', 
                                        day: 'numeric', 
                                        year: 'numeric' 
                                    });
                                }
                            } catch (error) {
                                console.error('Error formatting achievement date:', error);
                            }
                        }
                        
                        return {
                            name: achievement.name,
                            date: formattedDate,
                            rarity: achievement.rarity,
                            color: achievement.color,
                            icon: achievement.icon,
                        };
                    });
                    setAchievements(formattedAchievements);
                } else {
                    setAchievements([]);
                }
            }
        } catch (error) {
            console.error('Failed to load recent achievements:', error);
            setAchievements([]);
            setHasAchievements(false);
        } finally {
            setAchievementsLoading(false);
        }
    }

    // Fetch user profile from backend on mount and when auth changes
    useEffect(() => {
        // Clear profile when no auth user
        if (!authUser?.uid) {
            setUserProfile({
                name: '',
                email: '',
                location: '',
                bio: '',
                profileImage: '',
                totalItemsCollected: 0,
                totalChallenges: 0,
                impactScore: 0,
                badges: [],
                joinedChallenges: [],
                createdAt: null,
                address: {
                    fullAddress: '',
                    streetAddress: '',
                    city: '',
                    province: '',
                    postalCode: '',
                    country: 'Canada',
                    coordinates: { latitude: null, longitude: null }
                }
            });
            setAddressInputValue('');
            return;
        }
        
        fetchProfile();
        fetchRecentAchievements();
    }, [authUser?.uid, authVersion]); // Re-fetch when auth user changes

    // Update editProfile if userProfile changes
    useEffect(() => {
        setEditProfile({ ...userProfile });
        if (userProfile.address?.fullAddress) {
            setAddressInputValue(userProfile.address.fullAddress);
        }
    }, [userProfile]);

    // Format join date
    const formatJoinDate = (date) => {
        if (!date) return 'Recently';
        return new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const handleSignOut = async () => {
        try {
            // Clear the API request cache to prevent stale profile data
            requestCache.clear();
            
            // Clear session cookie on backend
            try {
                await apiCall('post', `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`);
            } catch (logoutError) {
                console.error('Error clearing session cookie:', logoutError);
                // Continue with logout even if backend call fails
            }
            
            // Clear user-specific storage keys before signing out
            const keysToRemove = ['user', 'token', 'authToken', 'userProfile', 'userData'];
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });
            
            await signOut(auth);
            router.push('/landing');
        } catch (error) {
            console.error('Error signing out:', error);
            // Clear cache even on error
            requestCache.clear();
            // Even if signout fails, clear storage and redirect
            const keysToRemove = ['user', 'token', 'authToken', 'userProfile', 'userData'];
            keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                sessionStorage.removeItem(key);
            });
            router.push('/landing');
        }
    };

    const handleEditProfile = () => {
        if (isEditing) {
            setEditProfile({ ...userProfile });
            if (userProfile.address?.fullAddress) {
                setAddressInputValue(userProfile.address.fullAddress);
            }
        }
        setIsEditing(!isEditing);
    };

    const handleSaveProfile = async () => {
        try {
            setSavingProfile(true);
            setProfileUpdateError('');
            setProfileUpdateSuccess('');
            
            const updateData = {
                name: editProfile.name,
                location: editProfile.location,
                bio: editProfile.bio,
                address: editProfile.address,
            };
            await apiCall('patch', `${process.env.NEXT_PUBLIC_API_URL}/api/profile`, updateData);
            await fetchProfile(); // Refetch profile to sync latest data
            setIsEditing(false);
            setProfileUpdateSuccess('Profile updated successfully!');
            // Clear success message after 5 seconds
            setTimeout(() => setProfileUpdateSuccess(''), 5000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            setProfileUpdateError('Failed to update profile. Please try again.');
        } finally {
            setSavingProfile(false);
        }
    };

    const handleProfileInputChange = (field, value) => {
        setEditProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle individual address field changes
    const handleAddressFieldChange = (field, value) => {
        setEditProfile(prev => ({
            ...prev,
            address: {
                ...prev.address,
                [field]: value
            }
        }));
    };

    const handleSettingToggle = (settingName) => {
        setSettings(prev => ({
            ...prev,
            [settingName]: !prev[settingName]
        }));
    };

    const handleSaveSettings = () => {
        // TODO: Implement settings save to backend
        setOriginalSettings(settings);
    };

    const handleCancelSettings = () => {
        setSettings(originalSettings);
    };

    const handleProfileImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleProfileImageChange = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Clear previous messages
        setUploadError('');
        setUploadSuccess('');

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size must be less than 5MB');
            return;
        }

        try {
            setUploadingImage(true);

            // Create FormData and append the image
            const formData = new FormData();
            formData.append('image', file);

            // Upload to backend
            const res = await apiCall('post', `${process.env.NEXT_PUBLIC_API_URL}/api/profile/upload-image`, formData);

            if (res?.data?.profileImage) {
                // Update user profile with new image URL
                // The backend returns the path, prepend the API URL
                const imageUrl = res.data.profileImage.startsWith('http') 
                    ? res.data.profileImage 
                    : `${process.env.NEXT_PUBLIC_API_URL}${res.data.profileImage}`;
                setUserProfile(prev => ({
                    ...prev,
                    profileImage: imageUrl
                }));
                setUploadSuccess('Profile picture updated successfully!');
                // Clear success message after 3 seconds
                setTimeout(() => setUploadSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Failed to upload profile image:', error);
            setUploadError('Failed to upload profile picture. Please try again.');
        } finally {
            setUploadingImage(false);
        }
    };

    const getAchievementIcon = (iconString) => {
        // If it's an emoji string, display it directly
        // Use a simple check for common emoji ranges instead of Unicode property escape
        if (iconString && (
            /[\u{1F300}-\u{1F9FF}]/u.test(iconString) || // Emoticons and symbols
            /[\u{2600}-\u{26FF}]/u.test(iconString) ||   // Miscellaneous symbols
            /[\u{2700}-\u{27BF}]/u.test(iconString)      // Dingbats
        )) {
            return <Typography sx={{ fontSize: '32px' }}>{iconString}</Typography>;
        }
        
        // Legacy icon type support
        switch (iconString) {
            case 'plastic':
                return <Delete sx={styles.achievementIconSvg} />;
            case 'volunteer':
                return <VolunteerActivism sx={styles.achievementIconSvg} />;
            case 'century':
                return <Filter3 sx={styles.achievementIconSvg} />;
            default:
                return <EmojiEventsOutlined sx={styles.achievementIconSvg} />;
        }
    };

    return (
        <Box sx={styles.container}>
            {/* Header */}
            <Box sx={styles.header}>
                <Typography sx={styles.title}>Profile Settings</Typography>
                <Typography sx={styles.subtitle}>
                    Manage your account and track your environmental impact
                </Typography>
            </Box>

            {/* Main Content */}
            <Box sx={styles.mainContent}>
                {/* Left Sidebar */}
                <Box sx={styles.sidebar}>
                    {/* Avatar */}
                    <Box sx={styles.avatarSection}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleProfileImageChange}
                        />
                        <Box sx={styles.avatarWrapper}>
                            <Avatar sx={styles.avatar} src={userProfile.profileImage}>
                                <PersonOutline sx={styles.avatarIcon} />
                            </Avatar>
                            <Tooltip title="Upload profile picture" placement="right">
                                <IconButton 
                                    sx={styles.avatarUploadButton}
                                    onClick={handleProfileImageClick}
                                    disabled={uploadingImage}
                                >
                                    {uploadingImage ? (
                                        <CircularProgress size={16} sx={{ color: '#ffffff' }} />
                                    ) : (
                                        <CameraAlt sx={styles.uploadIcon} />
                                    )}
                                </IconButton>
                            </Tooltip>
                        </Box>
                        <Typography sx={styles.userName}>{userProfile.name}</Typography>
                        <Typography sx={styles.userLocation}>{userProfile.location || 'Location not set'}</Typography>
                        <Typography sx={styles.userBio}>{userProfile.bio || 'No bio yet'}</Typography>
                        
                        {/* Upload status messages */}
                        {uploadError && (
                            <Alert severity="error" sx={{ mt: 2, fontSize: '13px' }} onClose={() => setUploadError('')}>
                                {uploadError}
                            </Alert>
                        )}
                        {uploadSuccess && (
                            <Alert severity="success" sx={{ mt: 2, fontSize: '13px' }} onClose={() => setUploadSuccess('')}>
                                {uploadSuccess}
                            </Alert>
                        )}
                    </Box>

                    {/* User Info */}
                    <Box sx={styles.userInfo}>
                        <Box sx={styles.infoItem}>
                            <EmailOutlined sx={styles.infoIcon} />
                            <Typography sx={styles.infoText}>{userProfile.email}</Typography>
                        </Box>
                        <Box sx={styles.infoItem}>
                            <CalendarTodayOutlined sx={styles.infoIcon} />
                            <Typography sx={styles.infoText}>Joined {formatJoinDate(userProfile.createdAt)}</Typography>
                        </Box>
                    </Box>

                    {/* Sign Out Button - Desktop only */}
                    <Button sx={{ ...styles.signOutButton, display: { xs: 'none', md: 'flex' } }} onClick={handleSignOut}>
                        <ExitToAppOutlined sx={styles.signOutIcon} />
                        Sign Out
                    </Button>

                    {/* Quick Stats */}
                    <Box sx={styles.quickStats}>
                        <Typography sx={styles.quickStatsTitle}>Quick Stats</Typography>
                        <Box sx={styles.statItem}>
                            <RecyclingOutlined sx={{ ...styles.statIcon, color: '#0ea5e9' }} />
                            <Typography sx={styles.statLabel}>Total Items</Typography>
                            <Typography sx={styles.statValue}>{userProfile.totalItemsCollected.toLocaleString()}</Typography>
                        </Box>
                        <Box sx={styles.statItem}>
                            <WorkspacesOutlined sx={{ ...styles.statIcon, color: '#10b981' }} />
                            <Typography sx={styles.statLabel}>Challenges</Typography>
                            <Typography sx={styles.statValue}>{userProfile.totalChallenges}</Typography>
                        </Box>
                        <Box sx={styles.statItem}>
                            <EmojiEventsOutlined sx={{ ...styles.statIcon, color: '#f59e0b' }} />
                            <Typography sx={styles.statLabel}>Rank</Typography>
                            <Typography sx={styles.statValue}>#{userProfile.impactScore || 'N/A'}</Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Right Content */}
                <Box sx={styles.rightContent}>
                    {/* Tabs */}
                    <Box sx={styles.tabs}>
                        <Box
                            sx={{
                                ...styles.tab,
                                ...(activeTab === 'profile' ? styles.activeTab : {}),
                            }}
                            onClick={() => setActiveTab('profile')}
                        >
                            Profile
                        </Box>
                        <Box
                            sx={{
                                ...styles.tab,
                                ...(activeTab === 'settings' ? styles.activeTab : {}),
                            }}
                            onClick={() => setActiveTab('settings')}
                        >
                            Settings
                        </Box>
                    </Box>

                    {/* Tab Content */}
                    {activeTab === 'profile' && (
                        <Box sx={styles.tabContent}>
                            {/* Profile Update Success/Error Messages */}
                            {profileUpdateSuccess && (
                                <Alert severity="success" sx={{ mb: 3, fontSize: '14px' }} onClose={() => setProfileUpdateSuccess('')}>
                                    {profileUpdateSuccess}
                                </Alert>
                            )}
                            {profileUpdateError && (
                                <Alert severity="error" sx={{ mb: 3, fontSize: '14px' }} onClose={() => setProfileUpdateError('')}>
                                    {profileUpdateError}
                                </Alert>
                            )}
                            
                            {/* Personal Information */}
                            <Box sx={styles.section}>
                                <Box sx={styles.sectionHeader}>
                                    <Typography sx={styles.sectionTitle}>Personal Information</Typography>
                                    <Button sx={styles.editButton} onClick={handleEditProfile}>
                                        <EditOutlined sx={styles.editIcon} />
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </Button>
                                </Box>

                                <Box sx={styles.formGrid}>
                                    <Box sx={styles.formGroup}>
                                        <Typography sx={styles.label}>Full Name</Typography>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                value={editProfile.name}
                                                onChange={(e) => handleProfileInputChange('name', e.target.value)}
                                                sx={styles.input}
                                            />
                                        ) : (
                                            <Typography sx={styles.value}>{userProfile.name}</Typography>
                                        )}
                                    </Box>

                                    <Box sx={styles.formGroup}>
                                        <Typography sx={styles.label}>Email Address</Typography>
                                        <Typography sx={styles.value}>{userProfile.email}</Typography>
                                    </Box>

                                    {/* Address Section with Autocomplete */}
                                    <Box sx={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                                        <Typography sx={styles.label}>Address (Search & Select)</Typography>
                                        {isEditing ? (
                                            <Autocomplete
                                                freeSolo
                                                options={addressOptions}
                                                getOptionLabel={(option) => 
                                                    typeof option === 'string' ? option : option.name || ''
                                                }
                                                value={null}
                                                inputValue={addressInputValue}
                                                onInputChange={handleAddressInputChange}
                                                onChange={handleAddressSelect}
                                                loading={addressSearching}
                                                filterOptions={(x) => x} // Don't filter, we use backend search
                                                renderOption={(props, option) => (
                                                    <li {...props} key={option.placeId || option.name}>
                                                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                            <LocationOnOutlined sx={{ color: '#64748b', mt: 0.5 }} />
                                                            <Box>
                                                                <Typography sx={{ fontWeight: 500, fontSize: '14px' }}>
                                                                    {option.address?.city || option.address?.town || option.address?.village || option.name?.split(',')[0]}
                                                                </Typography>
                                                                <Typography sx={{ color: '#64748b', fontSize: '12px' }}>
                                                                    {option.name}
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </li>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        fullWidth
                                                        placeholder="Start typing your address (e.g., 123 Main Street, Toronto)"
                                                        sx={styles.input}
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            startAdornment: (
                                                                <LocationOnOutlined sx={{ color: '#64748b', mr: 1, fontSize: 20 }} />
                                                            ),
                                                            endAdornment: (
                                                                <>
                                                                    {addressSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                                noOptionsText={addressInputValue.length < 3 ? "Type at least 3 characters" : "No addresses found"}
                                                sx={{
                                                    '& .MuiAutocomplete-inputRoot': {
                                                        paddingLeft: '8px',
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <Typography sx={styles.value}>
                                                {userProfile.address?.fullAddress || userProfile.location || 'Not set'}
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Auto-filled address fields (read-only when editing, show after selection) */}
                                    {isEditing && editProfile.address?.city && (
                                        <>
                                            <Box sx={styles.formGroup}>
                                                <Typography sx={styles.label}>City</Typography>
                                                <TextField
                                                    fullWidth
                                                    value={editProfile.address?.city || ''}
                                                    onChange={(e) => handleAddressFieldChange('city', e.target.value)}
                                                    sx={styles.input}
                                                    placeholder="City"
                                                />
                                            </Box>

                                            <Box sx={styles.formGroup}>
                                                <Typography sx={styles.label}>Province</Typography>
                                                <TextField
                                                    fullWidth
                                                    value={editProfile.address?.province || ''}
                                                    onChange={(e) => handleAddressFieldChange('province', e.target.value)}
                                                    sx={styles.input}
                                                    placeholder="Province"
                                                />
                                            </Box>

                                            <Box sx={styles.formGroup}>
                                                <Typography sx={styles.label}>Postal Code</Typography>
                                                <TextField
                                                    fullWidth
                                                    value={editProfile.address?.postalCode || ''}
                                                    onChange={(e) => handleAddressFieldChange('postalCode', e.target.value)}
                                                    sx={styles.input}
                                                    placeholder="Postal Code"
                                                />
                                            </Box>

                                            <Box sx={styles.formGroup}>
                                                <Typography sx={styles.label}>Country</Typography>
                                                <TextField
                                                    fullWidth
                                                    value={editProfile.address?.country || 'Canada'}
                                                    disabled
                                                    sx={styles.input}
                                                />
                                            </Box>
                                        </>
                                    )}

                                    {/* Display address when not editing */}
                                    {!isEditing && userProfile.address?.city && (
                                        <>
                                            <Box sx={styles.formGroup}>
                                                <Typography sx={styles.label}>City</Typography>
                                                <Typography sx={styles.value}>{userProfile.address?.city || 'Not set'}</Typography>
                                            </Box>

                                            <Box sx={styles.formGroup}>
                                                <Typography sx={styles.label}>Province</Typography>
                                                <Typography sx={styles.value}>{userProfile.address?.province || 'Not set'}</Typography>
                                            </Box>

                                            <Box sx={styles.formGroup}>
                                                <Typography sx={styles.label}>Postal Code</Typography>
                                                <Typography sx={styles.value}>{userProfile.address?.postalCode || 'Not set'}</Typography>
                                            </Box>
                                        </>
                                    )}

                                    <Box sx={styles.formGroup}>
                                        <Typography sx={styles.label}>Joined</Typography>
                                        <Typography sx={styles.value}>{formatJoinDate(userProfile.createdAt)}</Typography>
                                    </Box>

                                    <Box sx={{ ...styles.formGroup, gridColumn: '1 / -1' }}>
                                        <Typography sx={styles.label}>Bio</Typography>
                                        {isEditing ? (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={3}
                                                value={editProfile.bio}
                                                onChange={(e) => handleProfileInputChange('bio', e.target.value)}
                                                sx={styles.input}
                                                placeholder="Tell us about yourself and your passion for ocean conservation"
                                            />
                                        ) : (
                                            <Typography sx={styles.bioValue}>{userProfile.bio || 'No bio yet'}</Typography>
                                        )}
                                    </Box>
                                </Box>

                                {isEditing && (
                                    <Box sx={styles.buttonGroup}>
                                        <Button sx={styles.cancelButton} onClick={handleEditProfile} disabled={savingProfile}>
                                            Cancel
                                        </Button>
                                        <Button sx={styles.saveButton} onClick={handleSaveProfile} disabled={savingProfile}>
                                            {savingProfile ? (
                                                <>
                                                    <CircularProgress size={16} sx={{ color: '#ffffff', mr: 1 }} />
                                                    Saving...
                                                </>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </Button>
                                    </Box>
                                )}
                            </Box>

                            {/* Recent Achievements */}
                            <Box sx={styles.section}>
                                <Typography sx={styles.sectionTitle}>Recent Achievements</Typography>
                                {achievementsLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress size={40} />
                                    </Box>
                                ) : !hasAchievements || achievements.length === 0 ? (
                                    <Box sx={{
                                        textAlign: 'center',
                                        py: 6,
                                        px: 3,
                                        backgroundColor: '#f0f9ff',
                                        borderRadius: '16px',
                                        border: '2px dashed #0ea5e9',
                                    }}>
                                        <Typography sx={{ fontSize: '4rem', mb: 2 }}>🏆</Typography>
                                        <Typography variant="h6" sx={{ color: '#0284c7', fontWeight: 700, mb: 1 }}>
                                            Start Your Achievement Journey!
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
                                            Upload your first cleanup, join challenges, and unlock amazing achievements!
                                        </Typography>
                                        <Button 
                                            variant="contained"
                                            onClick={() => router.push('/challenges')}
                                            sx={{
                                                background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                                color: 'white',
                                                px: 4,
                                                py: 1.5,
                                                borderRadius: '12px',
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                                },
                                            }}
                                        >
                                            Browse Challenges
                                        </Button>
                                    </Box>
                                ) : (
                                    <>
                                        <Box sx={styles.achievementsList}>
                                            {achievements.map((achievement, index) => (
                                                <Box key={index} sx={styles.achievementItem}>
                                                    <Box sx={styles.achievementLeft}>
                                                        <Box
                                                            sx={{
                                                                ...styles.achievementIcon,
                                                                backgroundColor: `${achievement.color}20`,
                                                            }}
                                                        >
                                                            {getAchievementIcon(achievement.icon)}
                                                        </Box>
                                                        <Box>
                                                            <Typography sx={styles.achievementName}>
                                                                {achievement.name}
                                                            </Typography>
                                                            <Typography sx={styles.achievementDate}>
                                                                {achievement.date}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box
                                                        sx={{
                                                            ...styles.rarityBadge,
                                                            backgroundColor:
                                                                achievement.rarity === 'Legendary' ? '#f3e8ff' :
                                                                achievement.rarity === 'Epic' ? '#fef3c7' :
                                                                achievement.rarity === 'Rare' ? '#dbeafe' : '#f1f5f9',
                                                            color:
                                                                achievement.rarity === 'Legendary' ? '#6b21a8' :
                                                                achievement.rarity === 'Epic' ? '#92400e' :
                                                                achievement.rarity === 'Rare' ? '#1e40af' : '#475569',
                                                        }}
                                                    >
                                                        {achievement.rarity}
                                                    </Box>
                                                </Box>
                                            ))}
                                        </Box>
                                        <Button 
                                            sx={styles.viewAllButton}
                                            onClick={() => router.push('/achievements')}
                                        >
                                            View All Achievements
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    )}

                    {activeTab === 'settings' && (
                        <Box sx={styles.tabContent}>
                            {/* Account Settings */}
                            <Box sx={styles.section}>
                                <Typography sx={styles.sectionTitle}>Account Settings</Typography>

                                {/* Notification Preferences */}
                                <Box sx={styles.settingsGroup}>
                                    <Typography sx={styles.settingsGroupTitle}>Notification Preferences</Typography>
                                    <Box sx={styles.settingItem}>
                                        <Box>
                                            <Typography sx={styles.settingLabel}>Email Notifications</Typography>
                                            <Typography sx={styles.settingDescription}>
                                                Receive updates about your cleanups and achievements
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={settings.emailNotifications}
                                            onChange={() => handleSettingToggle('emailNotifications')}
                                            sx={styles.switch}
                                        />
                                    </Box>
                                    <Box sx={styles.settingItem}>
                                        <Box>
                                            <Typography sx={styles.settingLabel}>Weekly Summary</Typography>
                                            <Typography sx={styles.settingDescription}>
                                                Get a weekly summary of your environmental impact
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={settings.weeklySummary}
                                            onChange={() => handleSettingToggle('weeklySummary')}
                                            sx={styles.switch}
                                        />
                                    </Box>
                                    <Box sx={styles.settingItem}>
                                        <Box>
                                            <Typography sx={styles.settingLabel}>Achievement Alerts</Typography>
                                            <Typography sx={styles.settingDescription}>
                                                Be notified when you unlock new achievements
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={settings.achievementAlerts}
                                            onChange={() => handleSettingToggle('achievementAlerts')}
                                            sx={styles.switch}
                                        />
                                    </Box>
                                </Box>

                                {/* Privacy Settings */}
                                <Box sx={styles.settingsGroup}>
                                    <Typography sx={styles.settingsGroupTitle}>Privacy Settings</Typography>
                                    <Box sx={styles.settingItem}>
                                        <Box>
                                            <Typography sx={styles.settingLabel}>Profile Visibility</Typography>
                                            <Typography sx={styles.settingDescription}>
                                                Make your profile visible to other volunteers
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={settings.profileVisibility}
                                            onChange={() => handleSettingToggle('profileVisibility')}
                                            sx={styles.switch}
                                        />
                                    </Box>
                                    <Box sx={styles.settingItem}>
                                        <Box>
                                            <Typography sx={styles.settingLabel}>Show Stats on Leaderboard</Typography>
                                            <Typography sx={styles.settingDescription}>
                                                Display your cleanup stats on the community leaderboard
                                            </Typography>
                                        </Box>
                                        <Switch
                                            checked={settings.showStatsOnLeaderboard}
                                            onChange={() => handleSettingToggle('showStatsOnLeaderboard')}
                                            sx={styles.switch}
                                        />
                                    </Box>
                                </Box>

                                {/* Account Actions */}
                                <Box sx={styles.settingsGroup}>
                                    <Typography sx={styles.settingsGroupTitle}>Account Actions</Typography>
                                    <Button sx={styles.changePasswordButton}>
                                        Change Password
                                    </Button>
                                    <Button sx={styles.deleteAccountButton}>
                                        Delete Account
                                    </Button>
                                </Box>

                                {/* Save Changes Button - Appears when settings are modified */}
                                {hasSettingsChanged && (
                                    <Box sx={styles.buttonGroup}>
                                        <Button sx={styles.cancelButton} onClick={handleCancelSettings}>
                                            Cancel
                                        </Button>
                                        <Button sx={styles.saveButton} onClick={handleSaveSettings}>
                                            Save Changes
                                        </Button>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default withAuth(ProfilePage);