# Create Challenge Workflow - Testing Guide

## Overview

Complete update of the challenge creation workflow with automatic location detection and improved UX.

## What Changed

### 1. Challenge Details Page UI ✅
- **Updated**: Replaced with modern UI from main_siri branch
- **Changes**: Cleaner card design, better spacing, improved accessibility
- **Lines**: 885 lines of updated code

### 2. Create Challenge Button ✅
- **Fixed**: Button on challenges page now properly navigates
- **Location**: Bottom of challenges list (in CTASection)
- **Action**: Clicks navigate to `/challenges/create`

### 3. Location Detection ✅
- **Removed**: Manual latitude/longitude input fields
- **Added**: Automatic location detection
- **Technology**: Browser Geolocation API (free, built-in, no external API needed)
- **Accuracy**: High accuracy mode enabled
- **Timeout**: 10 seconds

### 4. Instant Start Option ✅
- **Added**: "Start Now" checkbox
- **Behavior**: 
  - Checked = starts immediately, runs for 30 days
  - Unchecked = shows datetime pickers
- **Date Fields**: Changed from `date` to `datetime-local` for time selection

### 5. Location Verification ✅
- **Backend**: Validates user within 5km of challenge location
- **Environment**: Uses existing `LOCATION_VERIFICATION_ENABLED` setting
- **Bypass**: Respects `TESTING_BYPASS_EMAILS` for developers

## Testing Checklist

### Step 1: Navigate to Create Challenge ✅

**Test:**
1. Go to `/challenges` page
2. Scroll to bottom of page
3. Look for blue card with "Can't Find a Local Challenge?"
4. Click "Create Challenge" button

**Expected:**
- Button should be visible
- Clicking should navigate to `/challenges/create`
- No errors in console

**Status:**
- [  ] Passed
- [  ] Failed
- [  ] Notes: _______________

---

### Step 2: Location Auto-Detection ✅

**Test:**
1. Land on create challenge page
2. Browser should prompt for location permission
3. Allow location access

**Expected:**
- Location prompt appears immediately
- After allowing: Green box appears with "✓ Location Verified"
- Shows latitude and longitude coordinates
- Submit button becomes enabled

**If permission denied:**
- Red box appears with "⚠️ Location Required"
- Error message explains location is needed
- "Try Again" button appears
- Submit button stays disabled

**Status:**
- [  ] Passed
- [  ] Failed
- [  ] Notes: _______________

---

### Step 3: Form Fields ✅

**Test:**
Check all form fields are present and working:

**Required Fields:**
- [  ] Title
- [  ] Description (textarea)
- [  ] Banner image upload
- [  ] Location name
- [  ] Province (dropdown)
- [  ] Goal (number)
- [  ] Start Now checkbox
- [  ] Date/time pickers (if Start Now unchecked)

**NOT Present:**
- [  ] ❌ Latitude field (should be removed)
- [  ] ❌ Longitude field (should be removed)

**Status:**
- [  ] Passed
- [  ] Failed
- [  ] Notes: _______________

---

### Step 4: Instant Start Checkbox ✅

**Test:**
1. Look for "Start challenge now (30-day duration)" checkbox
2. Check the checkbox
3. Uncheck the checkbox

**Expected:**
- **When checked**:
  - Date/time pickers disappear
  - Challenge will start immediately when created
  - Runs for 30 days from creation

- **When unchecked**:
  - Two datetime-local pickers appear
  - "Start Date *" field
  - "End Date *" field
  - Can select custom dates and times

**Status:**
- [  ] Passed
- [  ] Failed
- [  ] Notes: _______________

---

### Step 5: Form Validation ✅

**Test:**
1. Leave all fields empty
2. Click "Create Challenge" button

**Expected:**
- Error messages appear for all required fields:
  - Title required
  - Description required
  - Banner image required
  - Location name required
  - Province required
  - Goal required
  - Start/End dates required (if not using instant start)
  - Location detection required

**Status:**
- [  ] Passed
- [  ] Failed
- [  ] Notes: _______________

---

### Step 6: Date Validation ✅

**Test (only if not using instant start):**
1. Uncheck "Start Now"
2. Set end date before start date
3. Try to submit

**Expected:**
- Error message: "End date must be after start date"
- Form doesn't submit

**Status:**
- [  ] Passed
- [  ] Failed
- [  ] Notes: _______________

---

### Step 7: Banner Upload ✅

**Test:**
1. Click on banner upload area
2. Select an image file
3. Verify preview appears

**Expected:**
- File picker opens
- Selected image shows preview
- Preview fills the upload box
- Can change image by clicking again

**Status:**
- [  ] Passed
- [  ] Failed
- [  ] Notes: _______________

---

### Step 8: Create Challenge (Success) ✅

**Test:**
1. Fill all required fields with valid data:
   - Title: "Test Cleanup Challenge"
   - Description: "Testing the new workflow"
   - Province: Any (e.g., "Ontario")
   - Location: "Toronto Waterfront"
   - Goal: 100
   - Banner: Any image
   - Start Now: Checked
2. Ensure location is verified (green box)
3. Click "Create Challenge"

**Expected:**
- Success message appears
- Redirects to `/challenges` after ~800ms
- New challenge appears in the list
- Challenge has correct data

**Status:**
- [  ] Passed
- [  ] Failed
- [  ] Notes: _______________

---

### Step 9: Location Verification (Backend) ✅

**Test:**
This tests the 5km verification on the backend.

**If `LOCATION_VERIFICATION_ENABLED=true`:**

**Test A: User near shoreline (within 5km)**
1. Fill form completely
2. Submit

**Expected:**
- Challenge creates successfully
- No location error

**Test B: User far from shoreline (>5km)**
1. Fill form completely
2. Submit

**Expected:**
- Error message: "You must be within 5km of a shoreline to create a challenge"
- Challenge NOT created

**Test C: Developer bypass email**
1. Use email in `TESTING_BYPASS_EMAILS`
2. Fill form completely
3. Submit

**Expected:**
- Challenge creates successfully
- Location check bypassed

**If `LOCATION_VERIFICATION_ENABLED=false`:**
- Location check skipped
- Challenge creates regardless of location

**Status:**
- [  ] Passed
- [  ] Failed
- [  ] Notes: _______________

---

### Step 10: Challenge Appears in List ✅

**Test:**
1. After creating challenge
2. Go to `/challenges`
3. Look for your challenge

**Expected:**
- Challenge appears in appropriate section:
  - "Active Challenges" if started
  - "Upcoming Challenges" if future date
- Shows correct title, location, goal
- Banner image loads correctly
- Can click to view details

**Status:**
- [  ] Passed
- [  ] Failed
- [  ] Notes: _______________

---

## Environment Setup

### Development (.env)

**Backend:**
```env
NODE_ENV=development
LOCATION_VERIFICATION_ENABLED=false  # Disable for easy testing
TESTING_BYPASS_EMAILS=dev@waveguard.com,test@waveguard.com
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Production (.env)

**Backend:**
```env
NODE_ENV=production
LOCATION_VERIFICATION_ENABLED=true  # Enable for production
TESTING_BYPASS_EMAILS=  # Empty for production
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.ondigitalocean.app
```

---

## Common Issues & Solutions

### Issue 1: Location Permission Denied

**Problem:** User clicks "Block" on location permission

**Solution:**
1. Browser shows "Location Required" error
2. User can click "Try Again" button
3. Browser prompts again
4. User must click "Allow"

**Developer Fix:** 
- Chrome: Settings → Privacy → Site Settings → Location → Allow
- Firefox: Address bar → Permissions → Location → Allow

---

### Issue 2: Create Button Not Working

**Problem:** Clicking "Create Challenge" button does nothing

**Check:**
1. Console for errors
2. Is router imported? (`import { useRouter } from "next/navigation"`)
3. Is onClick handler set? (`onCreateClick={() => router.push('/challenges/create')}`)

**Solution:** Code should be updated in commit 94e52e5

---

### Issue 3: Lat/Long Fields Still Showing

**Problem:** Manual latitude/longitude fields still appear

**Check:**
1. Pull latest code
2. Verify commit 94e52e5 is applied
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

---

### Issue 4: Location Takes Too Long

**Problem:** "Detecting location..." never completes

**Causes:**
- GPS signal weak (indoors)
- Browser blocking location
- Timeout (10 seconds)

**Solutions:**
1. Go near window for better GPS signal
2. Check browser location permissions
3. Try "Try Again" button
4. Use different browser

---

### Issue 5: Challenge Not Appearing After Creation

**Problem:** Challenge created but not in list

**Check:**
1. Refresh challenges page
2. Check browser console for errors
3. Verify backend API is running
4. Check MongoDB has the challenge
5. Check challenge status (active/upcoming/completed)

---

### Issue 6: Location Verification Fails

**Problem:** "Must be within 5km of shoreline" error

**Solutions:**

**For Development:**
1. Set `LOCATION_VERIFICATION_ENABLED=false` in backend .env
2. Restart backend
3. Try again

**For Testing:**
1. Add email to `TESTING_BYPASS_EMAILS`
2. Login with that email
3. Create challenge

**For Production:**
- User must actually be within 5km of a shoreline
- Or contact admin to add to bypass list

---

## Browser Compatibility

### Geolocation API Support

✅ **Supported:**
- Chrome 5+
- Firefox 3.5+
- Safari 5+
- Edge (all versions)
- Opera 10.6+
- Mobile browsers (iOS Safari, Chrome Mobile)

❌ **Not Supported:**
- Internet Explorer 8 and older
- Very old mobile browsers

**Fallback:** Error message appears, user can't create challenges without location

---

## Security Notes

✅ **Geolocation API Security:**
- Only works over HTTPS (or localhost for development)
- Requires user permission
- User can revoke permission anytime
- No API keys or external services needed

✅ **Backend Validation:**
- Server validates location even if frontend bypassed
- 5km radius check on server
- Bypass only works for configured emails
- All checks respect LOCATION_VERIFICATION_ENABLED flag

---

## Developer Bypass

### How to Bypass Location Verification

**Step 1:** Add email to backend .env
```env
TESTING_BYPASS_EMAILS=your-dev-email@example.com,another@example.com
```

**Step 2:** Restart backend
```bash
cd backend
npm run dev
```

**Step 3:** Login with bypass email

**Step 4:** Create challenge
- Location still detected (for coordinates)
- 5km verification skipped
- Challenge creates successfully

**Important:** Remove bypass emails in production!

---

## Success Criteria

All tests passed when:

- [  ] Create button navigates properly
- [  ] Location auto-detects on page load
- [  ] Lat/long manual fields removed
- [  ] Instant start checkbox works
- [  ] Form validation works
- [  ] Banner upload works
- [  ] Challenge creates successfully
- [  ] Challenge appears in list
- [  ] Location verification works (when enabled)
- [  ] Bypass works for dev emails

---

## Next Steps After Testing

1. **If all tests pass:**
   - Merge to main branch
   - Deploy to production
   - Test once more in production
   - Monitor for issues

2. **If tests fail:**
   - Document failing tests
   - Report issues
   - Fix and re-test
   - Don't deploy until all pass

3. **Production Deployment:**
   - Set `LOCATION_VERIFICATION_ENABLED=true`
   - Clear `TESTING_BYPASS_EMAILS`
   - Verify HTTPS is working
   - Test with real user account
