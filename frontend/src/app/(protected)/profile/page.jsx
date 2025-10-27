'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Box, Typography, Avatar, Button, TextField, Switch } from '@mui/material';
import {
  EmailOutlined,
  LocationOnOutlined,
  CalendarTodayOutlined,
  ExitToAppOutlined,
  RecyclingOutlined,
  EmojiEventsOutlined,
  TrendingUpOutlined,
  EditOutlined,
  PersonOutline,
  Delete,
  VolunteerActivism,
  Filter3,
} from '@mui/icons-material';
import { styles } from './profile.styles';
import withAuth from '@/components/auth/withAuth';

const ProfilePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  // User profile state
  const [userProfile, setUserProfile] = useState({
    name: 'YOU',
    email: 'me@gmail.com',
    location: 'Toronto, ON',
    bio: 'Passionate about ocean conservation and making a difference in my local community. Love spending weekends cleaning up beaches!',
  });

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

  // User data
  const userData = {
    ...userProfile,
    joinDate: 'September 2024',
    badge: 'Eco-Warrior',
    stats: {
      totalItems: 427,
      cleanups: 12,
      rank: '#47',
      points: '8,934',
    },
    achievements: [
      {
        name: 'Plastic Warrior',
        date: 'Oct 4, 2025',
        rarity: 'Rare',
        color: '#0ea5e9',
        icon: 'plastic',
      },
      {
        name: 'Dedicated Volunteer',
        date: 'Oct 3, 2025',
        rarity: 'Rare',
        color: '#0ea5e9',
        icon: 'volunteer',
      },
      {
        name: 'Century Club',
        date: 'Sep 28, 2025',
        rarity: 'Uncommon',
        color: '#0ea5e9',
        icon: 'century',
      },
    ],
  };

  const handleSignOut = async () => {
    try {
      // Sign out from Firebase
      await signOut(auth);
      
      // Clear any local storage items if you're storing additional data
      localStorage.removeItem('user');
      
      // Redirect to login page
      router.push('/login'); // Change to '/auth/login' or '/' as needed
      
    } catch (error) {
      console.error('Error signing out:', error);
      // Still redirect even if there's an error
      router.push('/login');
    }
  };

  const handleEditProfile = () => {
    if (isEditing) {
      // Cancel editing - reset to original profile
      setEditProfile({ ...userProfile });
    } else {
      // Start editing - copy current profile to edit state
      setEditProfile({ ...userProfile });
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    // Save the edited profile
    setUserProfile({ ...editProfile });
    setIsEditing(false);
    console.log('Profile saved:', editProfile);
  };

  const handleProfileInputChange = (field, value) => {
    setEditProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSettingToggle = (settingName) => {
    setSettings(prev => ({
      ...prev,
      [settingName]: !prev[settingName]
    }));
  };

  const handleSaveSettings = () => {
    // Save settings logic here (e.g., API call)
    console.log('Saving settings:', settings);
    setOriginalSettings(settings);
    // You can add a success notification here
  };

  const handleCancelSettings = () => {
    setSettings(originalSettings);
  };

  const getAchievementIcon = (iconType) => {
    switch (iconType) {
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
            <Avatar sx={styles.avatar}>
              <PersonOutline sx={styles.avatarIcon} />
            </Avatar>
            <Typography sx={styles.userName}>{userData.name}</Typography>
            <Typography sx={styles.userLocation}>{userData.location}</Typography>
            <Box sx={styles.badge}>{userData.badge}</Box>
            <Typography sx={styles.userBio}>{userData.bio}</Typography>
          </Box>

          {/* User Info */}
          <Box sx={styles.userInfo}>
            <Box sx={styles.infoItem}>
              <EmailOutlined sx={styles.infoIcon} />
              <Typography sx={styles.infoText}>{userData.email}</Typography>
            </Box>
            <Box sx={styles.infoItem}>
              <LocationOnOutlined sx={styles.infoIcon} />
              <Typography sx={styles.infoText}>{userData.location}</Typography>
            </Box>
            <Box sx={styles.infoItem}>
              <CalendarTodayOutlined sx={styles.infoIcon} />
              <Typography sx={styles.infoText}>Joined {userData.joinDate}</Typography>
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
              <Typography sx={styles.statValue}>{userData.stats.totalItems}</Typography>
            </Box>
            <Box sx={styles.statItem}>
              <CalendarTodayOutlined sx={{ ...styles.statIcon, color: '#10b981' }} />
              <Typography sx={styles.statLabel}>Cleanups</Typography>
              <Typography sx={styles.statValue}>{userData.stats.cleanups}</Typography>
            </Box>
            <Box sx={styles.statItem}>
              <EmojiEventsOutlined sx={{ ...styles.statIcon, color: '#f59e0b' }} />
              <Typography sx={styles.statLabel}>Rank</Typography>
              <Typography sx={styles.statValue}>{userData.stats.rank}</Typography>
            </Box>
            <Box sx={styles.statItem}>
              <TrendingUpOutlined sx={{ ...styles.statIcon, color: '#8b5cf6' }} />
              <Typography sx={styles.statLabel}>Points</Typography>
              <Typography sx={styles.statValue}>{userData.stats.points}</Typography>
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
              {/* Personal Information */}
              <Box sx={styles.section}>
                <Box sx={styles.sectionHeader}>
                  <Typography sx={styles.sectionTitle}>Personal Information</Typography>
                  <Button sx={styles.editButton} onClick={handleEditProfile}>
                    <EditOutlined sx={styles.editIcon} />
                    Edit Profile
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
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={editProfile.email}
                        onChange={(e) => handleProfileInputChange('email', e.target.value)}
                        sx={styles.input}
                      />
                    ) : (
                      <Typography sx={styles.value}>{userProfile.email}</Typography>
                    )}
                  </Box>

                  <Box sx={styles.formGroup}>
                    <Typography sx={styles.label}>Location</Typography>
                    {isEditing ? (
                      <TextField
                        fullWidth
                        value={editProfile.location}
                        onChange={(e) => handleProfileInputChange('location', e.target.value)}
                        sx={styles.input}
                      />
                    ) : (
                      <Typography sx={styles.value}>{userProfile.location}</Typography>
                    )}
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
                      />
                    ) : (
                      <Typography sx={styles.bioValue}>{userProfile.bio}</Typography>
                    )}
                  </Box>
                </Box>

                {isEditing && (
                  <Box sx={styles.buttonGroup}>
                    <Button sx={styles.cancelButton} onClick={handleEditProfile}>
                      Cancel
                    </Button>
                    <Button sx={styles.saveButton} onClick={handleSaveProfile}>
                      Save Changes
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Recent Achievements */}
              <Box sx={styles.section}>
                <Typography sx={styles.sectionTitle}>Recent Achievements</Typography>
                <Box sx={styles.achievementsList}>
                  {userData.achievements.map((achievement, index) => (
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
                            achievement.rarity === 'Rare' ? '#dbeafe' : '#fef3c7',
                          color: achievement.rarity === 'Rare' ? '#1e40af' : '#92400e',
                        }}
                      >
                        {achievement.rarity}
                      </Box>
                    </Box>
                  ))}
                </Box>
                <Button sx={styles.viewAllButton}>View All Achievements</Button>
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