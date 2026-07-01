-- ============================================================================
-- ONBOARDING FEATURE DATABASE MIGRATION
-- Run this SQL in your Supabase Dashboard SQL Editor (Production)
-- ============================================================================
-- This migration adds onboarding tracking to the profiles table
-- File: supabase/migrations/004_add_onboarding_completed.sql

-- Add onboarding_completed field to profiles table
ALTER TABLE profiles
ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for faster queries
CREATE INDEX idx_profiles_onboarding_completed ON profiles(onboarding_completed);

-- Update existing users to have onboarding completed (they've already used the app)
UPDATE profiles
SET onboarding_completed = TRUE;

-- Comment for future reference
COMMENT ON COLUMN profiles.onboarding_completed IS 'Tracks whether user has completed the initial onboarding flow';

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these after the migration to verify success
-- ============================================================================

-- Check that the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'onboarding_completed';

-- Check that existing users have onboarding_completed = true
SELECT COUNT(*) as existing_users_with_onboarding_completed
FROM profiles
WHERE onboarding_completed = TRUE;

-- Check index was created
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'profiles' AND indexname = 'idx_profiles_onboarding_completed';
