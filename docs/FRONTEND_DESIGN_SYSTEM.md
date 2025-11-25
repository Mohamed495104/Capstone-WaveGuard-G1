# Marine Care - Frontend Design System

> Design system documentation for the Marine Care application

**Last Updated:** November 2024  
**Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Design Principles](#design-principles)
4. [Color Palette](#color-palette)
5. [Typography](#typography)
6. [Component Library](#component-library)
7. [Page Structure](#page-structure)
8. [Responsive Design](#responsive-design)
9. [State Management](#state-management)
10. [PWA Features](#pwa-features)

---

## Overview

The Marine Care frontend is built with Next.js 15 and React 19, utilizing Material UI (MUI) as the primary component library. The design system follows a mobile-first approach with an ocean/environmental theme reflecting the application's marine conservation mission.

### Design Goals

- **Accessibility**: WCAG 2.1 AA compliant
- **Performance**: Fast load times, optimized images
- **Mobile-First**: Designed for mobile users doing fieldwork
- **Engaging**: Gamification elements to encourage participation

---

## Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.x | React framework with App Router |
| React | 19.x | UI library |
| Material UI | 7.x | Component library |
| Emotion | 11.x | CSS-in-JS styling |
| Recharts | 3.x | Data visualization |
| Framer Motion | 12.x | Animations and transitions |
| Firebase | 12.x | Authentication |
| Axios | 1.x | HTTP client |
| next-pwa | 5.x | PWA support |

---

## Design Principles

### 1. Ocean-Inspired Theme
The design uses ocean blues and aqua greens to connect users with the marine environment they're helping protect.

### 2. Mobile-First Approach
All components are designed for mobile use first, then enhanced for larger screens. Users often use the app while at cleanup sites.

### 3. Clear Visual Hierarchy
Important actions and statistics are prominently displayed with clear visual weight.

### 4. Gamification
Badges, progress bars, and leaderboards encourage continued participation.

### 5. Accessibility
High contrast ratios, proper semantic markup, and screen reader support.

---

## Color Palette

### Primary Colors

```javascript
const palette = {
    primary: {
        main: '#0288d1',   // Ocean Blue - Primary actions, headers
        light: '#03a9f4',  // Light Blue - Hover states, accents
    },
    secondary: {
        main: '#00bfa5',   // Aqua Green - Success, achievements
    },
    background: {
        default: '#f8fafc', // Light Gray - Page background
        paper: '#ffffff',   // White - Cards, modals
    },
    text: {
        primary: '#1a1a1a',   // Near Black - Primary text
        secondary: '#64748b', // Slate Gray - Secondary text
    },
};
```

### Color Usage Guidelines

| Color | Hex | Usage |
|-------|-----|-------|
| Ocean Blue | `#0288d1` | Primary buttons, links, headers |
| Light Blue | `#03a9f4` | Hover states, secondary actions |
| Aqua Green | `#00bfa5` | Success states, achievements, highlights |
| Light Gray | `#f8fafc` | Page backgrounds |
| White | `#ffffff` | Cards, modals, inputs |
| Near Black | `#1a1a1a` | Primary text, headings |
| Slate Gray | `#64748b` | Secondary text, captions |

### Semantic Colors

```javascript
const semanticColors = {
    success: '#00bfa5',  // Achievements, completed challenges
    warning: '#f59e0b',  // Warnings, pending states
    error: '#ef4444',    // Errors, required fields
    info: '#0288d1',     // Information, tooltips
};
```

---

## Typography

### Font Family

```javascript
const typography = {
    fontFamily: '"Inter", "Poppins", sans-serif',
};
```

**Primary Font**: Inter - Clean, modern, highly readable at all sizes  
**Fallback**: Poppins - Similar geometric sans-serif

### Type Scale

```javascript
const typography = {
    h1: { fontSize: '2rem', fontWeight: 600 },      // 32px - Page titles
    h2: { fontSize: '1.5rem', fontWeight: 500 },    // 24px - Section headers
    h3: { fontSize: '1.2rem', fontWeight: 500 },    // 19px - Card titles
    body1: { fontSize: '1rem', lineHeight: 1.6 },   // 16px - Body text
    body2: { fontSize: '0.875rem', lineHeight: 1.5 }, // 14px - Secondary text
    caption: { fontSize: '0.75rem' },               // 12px - Labels, hints
    button: { textTransform: 'none', fontWeight: 500 },
};
```

### Typography Guidelines

- **Headings**: Use semantic heading levels (h1 → h6)
- **Body Text**: 16px minimum for readability
- **Line Height**: 1.5-1.6 for body text
- **Contrast**: Minimum 4.5:1 ratio for normal text

---

## Component Library

### Core Components

#### 1. Navbar
- Fixed position on desktop
- Hides on scroll down, shows on scroll up (mobile)
- Contains logo, navigation links, user menu

#### 2. Footer
- Contains quick links, social media, contact info
- Simplified on mobile

#### 3. MobileBottomNav
- Fixed bottom navigation for mobile
- Icons: Home, Challenges, Upload (center), Profile, Achievements

### Card Components

#### ChallengeCard
```jsx
<ChallengeCard
  title="Toronto Waterfront Cleanup"
  location="Toronto, ON"
  status="active"
  goal={5000}
  progress={3421}
  volunteers={234}
  image="/images/challenge.jpg"
  onJoin={() => {}}
  isJoined={false}
/>
```

**Features:**
- Challenge banner image
- Progress bar with percentage
- Volunteer count
- Join/Leave button
- Status badge (active, upcoming, completed)

#### AchievementCard
```jsx
<AchievementCard
  name="First Cleanup"
  description="Completed your first cleanup"
  icon="🎉"
  rarity="Common"
  isUnlocked={true}
  earnedAt="2024-09-05"
/>
```

**Features:**
- Badge icon/emoji
- Rarity indicator (Common, Uncommon, Rare)
- Locked/unlocked visual state
- Earned date display

#### StatCard
```jsx
<StatCard
  title="Items Collected"
  value={427}
  icon={<RecycleIcon />}
  trend="+12%"
  color="primary"
/>
```

**Features:**
- Large prominent value
- Supporting icon
- Optional trend indicator
- Customizable color accent

### Form Components

#### PasswordField
- Toggle visibility button
- Strength indicator bar
- Real-time validation feedback

#### LocationAutocomplete
- Google Places integration (optional)
- Manual address entry fallback

### Layout Components

#### PageTransition
- Smooth fade transitions between pages
- Uses Framer Motion

#### ErrorBoundary
- Catches and displays friendly error messages
- Provides retry option

---

## Page Structure

### Public Pages

| Page | Path | Purpose |
|------|------|---------|
| Landing | `/` | Marketing page, app overview |
| Login | `/login` | User authentication |
| Signup | `/signup` | User registration |

### Protected Pages

| Page | Path | Purpose |
|------|------|---------|
| Dashboard | `/dashboard` | Personal stats and analytics |
| Challenges | `/challenges` | Browse and filter challenges |
| Challenge Details | `/challenges/[id]` | Single challenge view |
| Upload | `/upload` | Photo upload and manual logging |
| Profile | `/profile` | User profile and settings |
| Achievements | `/achievements` | Badges and progress |

### Page Layout Pattern

```jsx
// Standard protected page structure
export default function DashboardPage() {
    return (
        <Box sx={{ pb: 8 }}> {/* Padding for mobile nav */}
            <Container maxWidth="lg">
                <Typography variant="h1">Dashboard</Typography>
                
                {/* Page content */}
                
            </Container>
        </Box>
    );
}

export default withAuth(DashboardPage); // HOC for auth protection
```

---

## Responsive Design

### Breakpoints

```javascript
const breakpoints = {
    xs: 0,      // Mobile (0-599px)
    sm: 600,    // Tablet (600-899px)
    md: 900,    // Small desktop (900-1199px)
    lg: 1200,   // Desktop (1200-1535px)
    xl: 1536,   // Large desktop (1536px+)
};
```

### Mobile Optimizations

1. **Bottom Navigation**: Fixed navigation bar for thumb-friendly access
2. **Collapsible Header**: Header hides on scroll to maximize content space
3. **Touch Targets**: Minimum 44x44px for all interactive elements
4. **Swipe Gestures**: Horizontal scroll for challenge cards
5. **Pull to Refresh**: Native-feel refresh on dashboard

### Desktop Enhancements

1. **Sidebar Navigation**: Expanded navigation with labels
2. **Multi-Column Layouts**: Grid layouts for cards
3. **Hover States**: Visual feedback on interactive elements
4. **Keyboard Navigation**: Full keyboard accessibility

### Responsive Grid Example

```jsx
<Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={4} lg={3}>
        <ChallengeCard {...challenge} />
    </Grid>
</Grid>
```

---

## State Management

### Context Providers

#### AuthContext
```jsx
const AuthContext = createContext({
    user: null,           // Firebase user object
    isAuthenticated: false,
    loading: true,
});
```

**Provides:**
- Current user state
- Authentication status
- Loading state during auth check

#### JoinedChallengesContext
```jsx
const JoinedChallengesContext = createContext({
    joinedChallenges: [],
    isJoined: (challengeId) => boolean,
    joinChallenge: async (challengeId) => {},
    leaveChallenge: async (challengeId) => {},
});
```

**Provides:**
- List of joined challenge IDs
- Helper functions for checking/modifying membership

### Custom Hooks

#### useAuth
```jsx
const { login, signup, logout, googleLogin } = useAuth();
```

**Provides:**
- Email/password login
- User registration
- Logout functionality
- Google OAuth login

#### useAuthContext
```jsx
const { user, isAuthenticated, loading } = useAuthContext();
```

**Provides:**
- Access to auth context values

---

## PWA Features

### Service Worker

The application uses `next-pwa` to generate a service worker that enables:

- **Offline Access**: Core pages cached for offline viewing
- **Background Sync**: Uploads queued when offline
- **Push Notifications**: (Future) Challenge reminders

### App Manifest

```json
{
    "name": "Marine Care",
    "short_name": "Marine Care",
    "description": "AI-powered shoreline cleanup management",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#0288d1",
    "background_color": "#f8fafc"
}
```

### Install Prompts

- iOS: Custom "Add to Home Screen" banner
- Android: Native install prompt after engagement criteria met

---

## Animation Guidelines

### Transition Durations

```javascript
const durations = {
    shortest: 150,  // Tooltips, hover states
    shorter: 200,   // Button clicks
    short: 250,     // Standard transitions
    standard: 300,  // Default duration
    complex: 375,   // Complex animations
    entering: 225,  // Elements entering
    leaving: 195,   // Elements leaving
};
```

### Motion Principles

1. **Purposeful**: Every animation should have meaning
2. **Fast**: Prefer quick, snappy animations
3. **Natural**: Use easing curves that feel natural
4. **Subtle**: Animations enhance, not distract

### Page Transitions

```jsx
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
>
    {children}
</motion.div>
```

---

## Accessibility

### ARIA Labels

All interactive elements include appropriate ARIA labels:

```jsx
<IconButton aria-label="Upload photo">
    <CameraIcon />
</IconButton>
```

### Keyboard Navigation

- All interactive elements are focusable
- Tab order follows visual layout
- Focus indicators are visible

### Screen Reader Support

- Semantic HTML structure
- Skip navigation links
- Live regions for dynamic content

### Color Accessibility

- All color combinations meet WCAG AA contrast requirements
- Information is not conveyed by color alone
- Focus states are visible without color

---

## Related Documentation

- [System Architecture](./SYSTEM_ARCHITECTURE.md) - Overall system design
- [Backend Architecture](./BACKEND_ARCHITECTURE.md) - API integration details
- [API Reference](./API_REFERENCE.md) - Endpoint documentation

---

*Document maintained by the Marine Care development team*
