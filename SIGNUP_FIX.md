# 🔧 Signup Issue Fix Guide

## Problem
The signup process is failing because the database trigger that automatically creates profiles on user signup is not working correctly.

## Solution

### Step 1: Run the Fix SQL Script in Supabase

1. **Go to your Supabase Dashboard**: https://vempeqlnhsudqpdmtnym.supabase.co
2. **Navigate to**: SQL Editor (left sidebar)
3. **Click**: "New Query"
4. **Copy and paste** the contents of `supabase/migrations/002_fix_auth_trigger.sql`
5. **Click**: "Run" or press `Cmd+Enter`

This will:
- Drop the existing (broken) trigger
- Recreate the `handle_new_user()` function
- Recreate the trigger on `auth.users` table

### Step 2: Clean Up Failed Signup Attempts

Since the trigger wasn't working, you may have orphaned auth users (users without profiles).

**Option A: Delete Failed Users (Recommended for Testing)**

Go to: Authentication > Users in Supabase Dashboard
Delete any test users that don't have corresponding profiles.

**Option B: Create Missing Profiles via SQL**

Run this in SQL Editor to create profiles for any existing auth users:

```sql
INSERT INTO public.profiles (id, email, name)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', 'User')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
```

### Step 3: Test the Signup Flow

1. **Open**: http://localhost:3000/signup
2. **Fill in** the signup form with:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
3. **Click**: Sign Up
4. **Expected behavior**: 
   - Should redirect to `/onboarding`
   - Check Supabase: Authentication > Users (should see new user)
   - Check Supabase: Table Editor > profiles (should see new profile)

### Step 4: Verify the Fix

Run this query in SQL Editor to verify the trigger exists:

```sql
SELECT 
  tgname as trigger_name,
  tgenabled as enabled,
  proname as function_name
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';
```

You should see:
- trigger_name: `on_auth_user_created`
- enabled: `O` (means enabled)
- function_name: `handle_new_user`

## Common Issues

### Issue: "User already exists"
**Solution**: Delete the user from Authentication > Users in Supabase Dashboard

### Issue: "Invalid email or password"
**Solution**: Password must be at least 6 characters

### Issue: Still no profile created
**Solution**: 
1. Check the Supabase logs: Logs > Postgres Logs
2. Look for any errors related to the trigger
3. Ensure RLS policies allow INSERT on profiles table

## Need More Help?

Check the Supabase logs:
- Dashboard > Logs > Postgres Logs (for database errors)
- Dashboard > Logs > Auth Logs (for authentication errors)
