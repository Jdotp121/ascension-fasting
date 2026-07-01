-- Add onboarding_completed field to profiles table
-- This tracks whether a user has completed the initial onboarding flow

ALTER TABLE profiles
ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for faster queries
CREATE INDEX idx_profiles_onboarding_completed ON profiles(onboarding_completed);

-- Update existing users to have onboarding completed (they've already used the app)
UPDATE profiles
SET onboarding_completed = TRUE;

-- Comment for future reference
COMMENT ON COLUMN profiles.onboarding_completed IS 'Tracks whether user has completed the initial onboarding flow';
