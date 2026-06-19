-- Ascension Fasting Initial Schema
-- This creates all tables, indexes, RLS policies, and triggers

-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles table: stores user profile and health metrics
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER CHECK (age > 0 AND age < 150),
  sex TEXT CHECK (sex IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm DECIMAL(5,2) CHECK (height_cm > 0),
  current_weight_kg DECIMAL(5,2) CHECK (current_weight_kg > 0),
  goal_weight_kg DECIMAL(5,2) CHECK (goal_weight_kg > 0),
  main_goal TEXT CHECK (main_goal IN ('weight_loss', 'health', 'discipline', 'religious', 'longevity')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fasts table: tracks fasting sessions
CREATE TABLE fasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fast_type TEXT NOT NULL CHECK (fast_type IN ('water', 'juice', 'intermittent')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  planned_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  duration_hours DECIMAL(10,2),
  completed BOOLEAN DEFAULT FALSE,
  break_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_times CHECK (planned_end_time > start_time),
  CONSTRAINT valid_actual_end CHECK (actual_end_time IS NULL OR actual_end_time >= start_time)
);

-- Weight entries table: tracks weight measurements
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL CHECK (weight_kg > 0),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, entry_date)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Profiles
CREATE INDEX idx_profiles_email ON profiles(email);

-- Fasts
CREATE INDEX idx_fasts_user_id ON fasts(user_id);
CREATE INDEX idx_fasts_start_time ON fasts(start_time);
CREATE INDEX idx_fasts_completed ON fasts(completed);
CREATE INDEX idx_fasts_fast_type ON fasts(fast_type);

-- Weight Entries
CREATE INDEX idx_weight_entries_user_id ON weight_entries(user_id);
CREATE INDEX idx_weight_entries_entry_date ON weight_entries(entry_date);
CREATE INDEX idx_weight_entries_user_date ON weight_entries(user_id, entry_date DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE fasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Fasts policies
CREATE POLICY "Users can view own fasts"
  ON fasts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fasts"
  ON fasts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fasts"
  ON fasts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own fasts"
  ON fasts FOR DELETE
  USING (auth.uid() = user_id);

-- Weight entries policies
CREATE POLICY "Users can view own weight entries"
  ON weight_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight entries"
  ON weight_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own weight entries"
  ON weight_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight entries"
  ON weight_entries FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function: Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function: Update current_weight when new weight entry is added
CREATE OR REPLACE FUNCTION update_current_weight()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET current_weight_kg = NEW.weight_kg,
      updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trigger_update_current_weight
  AFTER INSERT ON weight_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_current_weight();

-- Function: Calculate fast duration on completion
CREATE OR REPLACE FUNCTION calculate_fast_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.completed = TRUE AND NEW.actual_end_time IS NOT NULL THEN
    NEW.duration_hours := EXTRACT(EPOCH FROM (NEW.actual_end_time - NEW.start_time)) / 3600;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_fast_duration
  BEFORE UPDATE ON fasts
  FOR EACH ROW
  EXECUTE FUNCTION calculate_fast_duration();

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fasts_updated_at
  BEFORE UPDATE ON fasts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
