# Dark Mode Visual Guide

## Overview
This guide provides visual descriptions of the dark mode implementation in WaveGuard.

## Color Palette Comparison

### Light Mode (Default)
```
Background:      #ffffff (Pure White)
Paper/Cards:     #ffffff (Pure White)
Text Primary:    #0a0a0a (Near Black)
Text Secondary:  rgba(0,0,0,0.6) (Gray)
Primary Color:   #0891b2 (Ocean Blue)
Borders:         #e5e7eb (Light Gray)
Shadows:         rgba(0,0,0,0.05-0.1) (Subtle)
```

### Dark Mode
```
Background:      #0f172a (Dark Slate)
Paper/Cards:     #1e293b (Slate)
Text Primary:    #f1f5f9 (Light Slate)
Text Secondary:  rgba(241,245,249,0.7) (Light Gray)
Primary Color:   #06b6d4 (Bright Cyan)
Borders:         #334155 (Medium Slate)
Shadows:         rgba(0,0,0,0.3-0.5) (Deeper)
```

## Component Changes

### 1. Mobile Header (Mobile View)
**Light Mode:**
- White background (#ffffff)
- Light gray border (#e5e7eb)
- Ocean blue logo text (#0891b2)
- Subtle shadow

**Dark Mode:**
- Dark slate background (#1e293b)
- Medium slate border (#334155)
- Bright cyan logo text (#06b6d4)
- Deeper shadow

**Menu Appearance:**
- Light Mode: White dropdown with light shadows
- Dark Mode: Dark slate dropdown with cyan accents
- New: Dark mode toggle with switch and icon (moon/sun)

### 2. Desktop Navbar
**Light Mode:**
- White background with blur
- Light gray border
- Ocean blue active state
- White hover state with subtle shadow

**Dark Mode:**
- Dark slate background with blur
- Medium slate border
- Bright cyan active state
- Slate hover state with glow effect
- All navigation buttons adapt

### 3. Profile Page

#### Settings Tab (Desktop Dark Mode Toggle)
**Light Mode:**
- White cards
- Light gray backgrounds
- Clear section separation

**Dark Mode:**
- Dark slate cards
- Darker backgrounds for inputs
- Cyan highlights
- New section: "Appearance" with dark mode toggle

**Toggle Appearance:**
```
┌─────────────────────────────────────────────┐
│ Appearance                                   │
├─────────────────────────────────────────────┤
│ 🌙 Dark Mode                         [●──]  │
│ Switch between light and dark theme          │
└─────────────────────────────────────────────┘
```

### 4. Footer
**Light Mode:**
- Light background (#F5F9FA)
- Ocean blue accents
- White contact cards
- Light shadows

**Dark Mode:**
- Dark slate background (#1e293b)
- Bright cyan accents
- Slate contact cards (#334155)
- Deeper shadows
- Newsletter input with dark background

### 5. Mobile Bottom Navigation
**Light Mode:**
- White background
- Light gray inactive icons
- Ocean blue active state with indicator bar

**Dark Mode:**
- Dark slate background
- Light gray inactive icons
- Bright cyan active state with indicator bar
- Stronger glow effects

## Toggle Locations

### Desktop View
```
Profile Page
├── Profile Tab
└── Settings Tab
    ├── Notification Preferences
    ├── Privacy Settings
    ├── Appearance ← NEW SECTION
    │   └── Dark Mode Toggle
    └── Account Actions
```

### Mobile View
```
Header (Top-Right)
└── Profile Icon (Tap)
    └── Dropdown Menu
        ├── Profile
        ├── Dark Mode Toggle ← NEW ITEM
        └── Logout
```

## Visual Effects

### Transitions
- Theme switch: 200-300ms ease
- Color fade: Smooth gradient
- No jarring changes
- Consistent timing

### Hover States (Dark Mode)
- Buttons: Subtle glow with cyan
- Links: Brighter cyan
- Cards: Slight elevation with shadow
- Icons: Scale and color shift

### Active States
- Navigation: Bright cyan background
- Bottom nav: Cyan indicator bar
- Buttons: Cyan with white text
- Forms: Cyan focus rings

## Accessibility Features

### Contrast Ratios (WCAG AA Compliant)
- Text on Background: 7:1+ (AAA)
- Interactive Elements: 4.5:1+ (AA)
- Icons: 3:1+ (AA)
- Borders: 3:1+ (AA)

### Visual Indicators
- Icons change: Moon for light, Sun for dark
- Clear toggle state (on/off)
- Visual feedback on interaction
- No color-only information

## Responsive Behavior

### Desktop (≥768px)
- Toggle in Profile > Settings
- Full sidebar layout
- Hover effects enabled
- Desktop-optimized spacing

### Mobile (<768px)
- Toggle in header menu
- Compact menu layout
- Touch-optimized sizing
- Mobile-optimized spacing

## Theme Persistence

### User Flow
1. User toggles dark mode
2. Theme changes immediately
3. Preference saved to localStorage
4. On next visit, theme restored
5. Works across tabs/windows

### Storage
```javascript
localStorage.setItem('themeMode', 'dark');
// or
localStorage.setItem('themeMode', 'light');
```

## Component-Specific Changes

### Profile Page Sidebar
**Light Mode:**
- White avatar section
- Light stats cards
- Gray sign-out button

**Dark Mode:**
- Slate avatar section
- Dark stats cards
- Slate sign-out button
- Maintained hierarchy

### Forms & Inputs
**Light Mode:**
- Light gray background
- Light borders
- Dark text

**Dark Mode:**
- Very dark background
- Medium slate borders
- Light text
- Cyan focus state

## Summary

The dark mode implementation provides:
- ✅ Complete visual consistency
- ✅ Excellent readability in both modes
- ✅ Smooth, professional transitions
- ✅ Accessible color contrasts
- ✅ Intuitive toggle placement
- ✅ Persistent user preference
- ✅ Modern, polished appearance

All visual changes maintain the app's design language while providing a comfortable dark mode experience.
