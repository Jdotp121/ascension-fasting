# Ascension Fasting - Setup Guide

## Phase 1 Implementation Complete ✅

This guide will help you set up and test the Ascension Fasting application.

---

## What's Been Built

### ✅ Completed Features

1. **Project Structure**
   - Next.js 16 with TypeScript and Tailwind CSS
   - Supabase authentication and database setup
   - Type-safe database schema

2. **Authentication System**
   - Sign up page (`/signup`)
   - Login page (`/login`)
   - Protected route middleware
   - Session management

3. **Onboarding**
   - Profile completion page (`/onboarding`)
   - Health metrics input (age, sex, height, weight, goals)
   - Main goal selection (weight loss, health, discipline, religious, longevity)

4. **Dashboard**
   - Active fast status
   - Current weight and goal weight
   - Weight lost tracking
   - Total fasts and longest fast statistics
   - Quick action buttons

5. **Navigation**
   - Desktop header with navigation
   - Mobile bottom navigation
   - Protected routes

6. **UI Components**
   - Button, Input, Select, Card components
   - Responsive design
   - Loading states

7. **Placeholder Pages**
   - `/fast` - Fast tracking (coming in Phase 2)
   - `/weight` - Weight logging (coming in Phase 2)
   - `/history` - Fast history (coming in Phase 2)
   - `/profile` - Profile management (coming in Phase 2)

---

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (free tier works)
- Git

---

## Step 1: Supabase Setup

### 1.1 Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name**: `ascension-fasting`
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to you
   - **Pricing Plan**: Free tier is fine
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

### 1.2 Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Find these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### 1.3 Apply Database Migration

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file: `supabase/migrations/001_initial_schema.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. You should see: "Success. No rows returned"

### 1.4 Verify Tables Created

1. Go to **Table Editor** in Supabase dashboard
2. You should see 3 tables:
   - `profiles`
   - `fasts`
   - `weight_entries`
3. Click on `profiles` to verify the structure

---

## Step 2: Environment Variables

### 2.1 Configure `.env.local`

1. Open `.env.local` in your project root
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Save the file

⚠️ **Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

---

## Step 3: Install Dependencies

```bash
cd /Users/SuperMan1/ascension-fasting
npm install
```

All dependencies are already installed:
- `@supabase/supabase-js` - Supabase client
- `@supabase/ssr` - Server-side rendering support
- `lucide-react` - Icon library
- `date-fns` - Date utilities
- `zod` - Schema validation
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Form validation
- `recharts` - Charts (for future use)

---

## Step 4: Run the Development Server

```bash
npm run dev
```

The app will be available at: [http://localhost:3000](http://localhost:3000)

---

## Step 5: Test the Application

### Test 1: Sign Up Flow

1. Go to [http://localhost:3000](http://localhost:3000)
2. Click **"Sign Up"** or navigate to `/signup`
3. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123` (min 6 characters)
4. Click **"Sign Up"**
5. You should be redirected to `/onboarding`

### Test 2: Onboarding Flow

1. On the onboarding page, fill in:
   - Age: `30`
   - Sex: `male` (or your preference)
   - Height: `175` cm
   - Current Weight: `80` kg
   - Goal Weight: `75` kg
   - Main Goal: `Weight Loss`
2. Click **"Complete Profile"**
3. You should be redirected to `/dashboard`

### Test 3: Dashboard

1. Verify the dashboard shows:
   - "No Active Fast" card
   - Current Weight: `80 kg`
   - Goal Weight: `75 kg`
   - `5.0 kg to go`
   - Total Fasts: `0`
   - Longest Fast: `0h`
   - Weight Lost: `0 kg`

### Test 4: Navigation

1. Click navigation links (Desktop header or Mobile bottom nav)
2. Visit each page:
   - `/dashboard` - Should show your stats
   - `/fast` - Should show "Coming Soon"
   - `/weight` - Should show "Coming Soon"
   - `/history` - Should show "Coming Soon"
   - `/profile` - Should show "Coming Soon"

### Test 5: Logout & Login

1. Click **"Logout"** in the desktop header
2. You should be redirected to `/login`
3. Try to access `/dashboard` - Should redirect to `/login`
4. Log back in with:
   - Email: `test@example.com`
   - Password: `password123`
5. You should be redirected to `/dashboard`

### Test 6: Protected Routes

1. Log out
2. Try to access these URLs directly:
   - `http://localhost:3000/dashboard`
   - `http://localhost:3000/fast`
   - `http://localhost:3000/profile`
3. All should redirect you to `/login`

---

## Step 6: Verify Database

### Check Profile in Supabase

1. Go to Supabase **Table Editor**
2. Click on `profiles` table
3. You should see your test user with:
   - email, name, age, sex, height, weights, main_goal
   - created_at and updated_at timestamps

### Check RLS (Row Level Security)

1. Go to Supabase **Authentication** → **Users**
2. You should see your test user
3. The RLS policies ensure users can only see their own data

---

## Troubleshooting

### Issue: "Invalid API credentials"

**Solution**: 
- Double-check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the dev server after changing `.env.local`

### Issue: "Table does not exist"

**Solution**:
- Re-run the SQL migration in Supabase SQL Editor
- Check that tables exist in Table Editor

### Issue: "Unable to sign up"

**Solution**:
- Check Supabase **Authentication** settings
- Ensure email auth is enabled
- Check browser console for errors

### Issue: Page not found

**Solution**:
- Verify you're on the correct URL
- Check that all page files exist in `app/` directory
- Restart the dev server

### Issue: Middleware redirect loop

**Solution**:
- Clear browser cookies
- Sign out completely
- Restart dev server

---

## Files Created

### Configuration
- `.env.local` - Environment variables (not committed)
- `.env.local.example` - Example environment file
- `middleware.ts` - Protected route handling

### Database
- `supabase/migrations/001_initial_schema.sql` - Complete database schema

### Supabase Clients
- `lib/supabase/client.ts` - Browser client
- `lib/supabase/server.ts` - Server client

### Types
- `types/database.ts` - Database type definitions
- `types/index.ts` - App-wide types

### UI Components
- `components/ui/Button.tsx`
- `components/ui/Input.tsx`
- `components/ui/Card.tsx`
- `components/ui/Select.tsx`

### Navigation
- `components/navigation/Header.tsx` - Desktop navigation
- `components/navigation/BottomNav.tsx` - Mobile navigation

### Hooks
- `hooks/useAuth.ts` - Authentication hook

### Pages
- `app/page.tsx` - Landing page
- `app/signup/page.tsx` - Sign up
- `app/login/page.tsx` - Login
- `app/onboarding/page.tsx` - Profile setup
- `app/dashboard/page.tsx` - Main dashboard
- `app/fast/page.tsx` - Fast tracking (placeholder)
- `app/weight/page.tsx` - Weight tracking (placeholder)
- `app/history/page.tsx` - History (placeholder)
- `app/profile/page.tsx` - Profile (placeholder)

---

## Next Steps (Phase 2)

The following features will be implemented next:

1. **Fast Tracking**
   - Start/stop fasts
   - Real-time timer
   - Fast type selection
   - Break reason tracking

2. **Weight Tracking**
   - Daily weight logging
   - Weight chart visualization
   - BMI calculator
   - Progress trends

3. **Fast History**
   - View all completed fasts
   - Filter by type
   - Statistics and insights

4. **Profile Management**
   - Edit profile information
   - Update goals
   - Account settings

---

## Database Schema Summary

### Tables

**profiles**
- Stores user information and health metrics
- Fields: id, email, name, age, sex, height_cm, current_weight_kg, goal_weight_kg, main_goal
- Auto-created when user signs up

**fasts**
- Tracks fasting sessions
- Fields: id, user_id, fast_type, start_time, planned_end_time, actual_end_time, duration_hours, completed, break_reason, notes
- Supports: water, juice, intermittent fasts

**weight_entries**
- Records daily weight measurements
- Fields: id, user_id, weight_kg, entry_date, notes
- Unique constraint: one entry per user per day
- Trigger: updates profiles.current_weight_kg automatically

### Security

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Policies enforce strict user isolation

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Supabase dashboard for errors
3. Check browser console for errors
4. Verify environment variables are correct
5. Ensure database migration ran successfully

---

**Status**: Phase 1 Complete ✅  
**Next Phase**: Fast & Weight Tracking Features
