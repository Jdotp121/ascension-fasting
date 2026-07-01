-- Copy and paste this entire block into Supabase SQL Editor
-- Then click "Run" to execute

ALTER TABLE profiles
ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE NOT NULL;

CREATE INDEX idx_profiles_onboarding_completed ON profiles(onboarding_completed);

UPDATE profiles
SET onboarding_completed = TRUE;

COMMENT ON COLUMN profiles.onboarding_completed IS 'Tracks whether user has completed the initial onboarding flow';
