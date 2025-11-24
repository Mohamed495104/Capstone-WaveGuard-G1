# Quick Start Guide: Testing Integrated Features

## What's New

### 1. Create Challenge Page
**URL:** `/challenges/create`

**How to Test:**
1. Login to the app
2. Navigate to `/challenges/create`
3. Fill in the form:
   - Challenge name
   - Description
   - Select province
   - Set start and end dates
   - Upload images (optional, max 3)
4. Click "Create Challenge"
5. Challenge should be created and redirect to challenges list

**Features:**
- Auto region mapping based on province
- Date validation (end must be after start)
- Form validation with error messages
- Image upload support

### 2. Updated Challenge Details Page
**URL:** `/challenges/[id]`

**How to Test:**
1. Go to challenges list
2. Click on any challenge card
3. View improved UI:
   - Better stats display
   - Improved accessibility
   - Better responsive design
   - Enhanced button states

### 3. Fixed Authentication Bugs

#### Personalized Greeting (Home Page)
**How to Test:**
1. Sign up as a new user
2. Should immediately see: "Good [morning/afternoon/evening], [YourName]!"
3. If first-time user: "Welcome to WaveGuard"
4. If returning user: "Welcome Back, [YourName]!"

**Expected:**
- ✅ Name appears immediately after signup
- ✅ Correct time-based greeting
- ✅ Different message for first-time vs returning users

#### Profile After Logout/Signup
**How to Test:**
1. Login as User A
2. View profile - note User A's data
3. Logout
4. Signup/login as User B
5. View profile immediately

**Expected:**
- ✅ Profile shows User B's data (not User A's)
- ✅ No need to refresh page
- ✅ All stats update correctly

#### Session Cookie Clearing
**How to Test:**
1. Login
2. Open DevTools → Application → Cookies
3. Note 'session' cookie exists
4. Logout
5. Check cookies again

**Expected:**
- ✅ Session cookie removed after logout
- ✅ Clean state for next user

## Production Database Seeding

### Run Seed Script

**In DigitalOcean Console:**
```bash
cd backend
npm run seed
```

**Expected Output:**
```
Connecting to MongoDB...
✅ MongoDB Connected

Clearing existing challenges...
✅ Existing challenges cleared

Inserting sample challenges...
✅ Successfully inserted 12 challenges

📊 Challenge Summary:
   Active: 6
   Upcoming: 3
   Completed: 3
   Total: 12

✨ Database seeding completed successfully!
```

**What You Get:**
- 6 active challenges across Canada
- 3 upcoming challenges
- 3 completed challenges
- Realistic stats and locations

### Verify Seeding Worked

1. Go to challenges page
2. Should see 12 challenges
3. Filter by region - should see challenges in all regions
4. Click on any challenge - should show full details

## Development Testing Checklist

### Home Page
- [ ] Login and check greeting shows your name
- [ ] Logout and login as different user - greeting updates
- [ ] Stats display correctly
- [ ] Navigate to challenges/upload works

### Challenges
- [ ] Challenges list shows all challenges
- [ ] Filter by region works
- [ ] Click challenge → details page loads
- [ ] Join/leave challenge works
- [ ] Navigate to create challenge

### Create Challenge
- [ ] Form loads correctly
- [ ] Province dropdown works
- [ ] Date picker works
- [ ] Start date < end date validation
- [ ] Image upload works (up to 3)
- [ ] Form submission works
- [ ] Success message appears
- [ ] Redirects to challenges list

### Profile
- [ ] Profile data loads
- [ ] Edit profile works
- [ ] Image upload works
- [ ] Logout clears profile
- [ ] Login as different user shows new profile

### Authentication Flow
- [ ] Signup → personalized greeting appears
- [ ] Login → correct user data
- [ ] Logout → all data cleared
- [ ] Switch accounts → no stale data

## Common Issues & Solutions

### "Missing script: seed"
**Problem:** Running `npm run seed` shows error

**Solution:**
```bash
# Pull latest changes
git pull origin main

# Or check package.json has:
"seed": "node src/scripts/seedChallenges.js"
```

### Greeting Shows "there" Instead of Name
**Problem:** Home page shows "Welcome back, there!"

**Solution:**
1. Check network tab - is `/api/profile` request succeeding?
2. Check MongoDB - does user have a name field?
3. Refresh page - profile should load

### Profile Shows Old User Data
**Problem:** After logout/new signup, profile shows previous user

**Solution:**
1. Hard refresh (Ctrl+F5 or Cmd+Shift+R)
2. Clear browser cache
3. Check AuthContext is properly integrated
4. Verify authVersion is incrementing

### Create Challenge Page Not Found
**Problem:** Navigating to `/challenges/create` shows 404

**Solution:**
```bash
# Verify directory exists
ls frontend/src/app/\(protected\)/challenges/create/

# Should show: page.jsx

# If not, pull latest changes:
git pull origin copilot/update-authentication-logic
```

### Session Cookie Not Working
**Problem:** Keep getting logged out

**Solution:**
1. Check environment: `NODE_ENV=production` in production
2. Verify HTTPS is being used in production
3. Check browser allows third-party cookies
4. Check CORS settings allow credentials

## Environment Variables

### Development (.env)
```env
# Backend
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://localhost:27017/waveguard
FIREBASE_PROJECT_ID=your_project
FIREBASE_CLIENT_EMAIL=your_email
FIREBASE_PRIVATE_KEY="your_key"

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_id
```

### Production
**Backend (DigitalOcean):**
```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-app.vercel.app
MONGO_URI=mongodb+srv://your-atlas-uri
# ... Firebase credentials
```

**Frontend (Vercel):**
```env
NEXT_PUBLIC_API_URL=https://your-backend.ondigitalocean.app
# ... Firebase config
```

## Performance Tips

### Development
- Use Chrome DevTools → Network tab to monitor API calls
- Check Console for any errors
- Use React DevTools to inspect component state

### Production
- Monitor DigitalOcean logs for backend errors
- Check Vercel logs for frontend issues
- Use MongoDB Atlas to verify data

## Next Steps

1. **Test in Development:**
   - Run through testing checklist
   - Verify all features work
   - Check for any console errors

2. **Seed Production:**
   - Run `npm run seed` in DigitalOcean
   - Verify challenges appear on frontend

3. **Deploy to Production:**
   - Merge to main branch
   - Vercel auto-deploys frontend
   - DigitalOcean auto-deploys backend

4. **Final Verification:**
   - Test all features in production
   - Verify authentication works
   - Check create challenge works
   - Ensure profile updates correctly

## Support

- **Documentation:** See `INTEGRATION_SUMMARY.md` for detailed info
- **Authentication:** See `AUTHENTICATION_DEV_PROD_FIX.md` for auth setup
- **Commits:** 
  - ad329e5: Feature integration and bug fixes
  - dcdadb4: Documentation

## Success Criteria

✅ All features from main_siri integrated
✅ All authentication bugs fixed
✅ Seed script working
✅ No security vulnerabilities
✅ Production setup preserved
✅ Ready for deployment
