# Ascension Fasting - Database Schema

## Overview

This document outlines the PostgreSQL database schema for Ascension Fasting, designed to be implemented in Supabase.

## Schema Design Principles

- **Simplicity**: Start minimal, extend as needed
- **Integrity**: Foreign keys and constraints
- **Security**: Row Level Security (RLS) on all tables
- **Scalability**: Indexed for performance
- **Audit**: Created/updated timestamps

## Tables

### 1. profiles

Stores user profile information and health metrics.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER CHECK (age > 0 AND age < 150),
  sex TEXT CHECK (sex IN ('male', 'female', 'other', 'prefer_not_to_say')),
  height_cm DECIMAL(5,2) CHECK (height_cm > 0),
  current_weight_kg DECIMAL(5,2) CHECK (current_weight_kg > 0),
  goal_weight_kg DECIMAL(5,2) CHECK (goal_weight_kg > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_email ON profiles(email);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
```

**Fields Explanation**:
- `id`: UUID matching Supabase auth.users
- `email`: User's email address
- `name`: Display name
- `age`: User's age (optional, for BMI context)
- `sex`: Biological sex (optional, for BMI calculations)
- `height_cm`: Height in centimeters
- `current_weight_kg`: Most recent weight
- `goal_weight_kg`: Target weight
- `created_at`: Account creation timestamp
- `updated_at`: Last profile update

---

### 2. fasts

Tracks individual fasting sessions.

```sql
CREATE TABLE fasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  fast_type TEXT NOT NULL CHECK (fast_type IN ('water', 'juice', 'intermittent')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  planned_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_end_time TIMESTAMP WITH TIME ZONE,
  duration_hours DECIMAL(10,2),
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_times CHECK (planned_end_time > start_time),
  CONSTRAINT valid_actual_end CHECK (actual_end_time IS NULL OR actual_end_time >= start_time)
);

-- Indexes
CREATE INDEX idx_fasts_user_id ON fasts(user_id);
CREATE INDEX idx_fasts_start_time ON fasts(start_time);
CREATE INDEX idx_fasts_completed ON fasts(completed);
CREATE INDEX idx_fasts_fast_type ON fasts(fast_type);

-- RLS Policies
ALTER TABLE fasts ENABLE ROW LEVEL SECURITY;

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
```

**Fields Explanation**:
- `id`: Unique fast identifier
- `user_id`: Reference to profiles table
- `fast_type`: Type of fast (water, juice, intermittent)
- `start_time`: When the fast began
- `planned_end_time`: When the user plans to end the fast
- `actual_end_time`: When the fast actually ended (NULL if ongoing)
- `duration_hours`: Calculated duration (for completed fasts)
- `completed`: Whether the fast was completed successfully
- `notes`: User notes/journal entry
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

**Fast Types**:
1. **Water Fast**: Only water consumed
2. **Juice Fast**: Juices and water allowed
3. **Intermittent Fast**: Time-restricted eating (e.g., 16:8)

---

### 3. weight_entries

Records weight measurements over time.

```sql
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL CHECK (weight_kg > 0),
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Prevent multiple entries per day
  UNIQUE(user_id, entry_date)
);

-- Indexes
CREATE INDEX idx_weight_entries_user_id ON weight_entries(user_id);
CREATE INDEX idx_weight_entries_entry_date ON weight_entries(entry_date);
CREATE INDEX idx_weight_entries_user_date ON weight_entries(user_id, entry_date DESC);

-- RLS Policies
ALTER TABLE weight_entries ENABLE ROW LEVEL SECURITY;

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
```

**Fields Explanation**:
- `id`: Unique entry identifier
- `user_id`: Reference to profiles table
- `weight_kg`: Weight in kilograms
- `entry_date`: Date of measurement
- `notes`: Optional notes about the measurement
- `created_at`: Record creation timestamp

**Constraint**: One weight entry per user per day (prevents duplicate entries)

---

## Database Functions

### 1. Update current_weight on new weight_entry

Automatically updates the user's current weight when they log a new entry.

```sql
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
```

### 2. Calculate fast duration on completion

Automatically calculates duration when a fast is marked complete.

```sql
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
```

### 3. Auto-create profile on signup

Creates a profile when a user signs up via Supabase Auth.

```sql
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
```

---

## Relationships

```
auth.users (Supabase Auth)
    ↓
profiles (1:1)
    ↓
    ├── fasts (1:many)
    └── weight_entries (1:many)
```

---

## Queries Examples

### Get active fast for user
```sql
SELECT * FROM fasts
WHERE user_id = $1 
  AND completed = FALSE 
  AND actual_end_time IS NULL
ORDER BY start_time DESC
LIMIT 1;
```

### Get weight history for chart
```sql
SELECT entry_date, weight_kg
FROM weight_entries
WHERE user_id = $1
ORDER BY entry_date ASC;
```

### Get fast statistics
```sql
SELECT 
  COUNT(*) as total_fasts,
  COUNT(*) FILTER (WHERE completed = TRUE) as completed_fasts,
  MAX(duration_hours) as longest_fast_hours,
  AVG(duration_hours) FILTER (WHERE completed = TRUE) as avg_fast_hours
FROM fasts
WHERE user_id = $1;
```

### Get weight progress
```sql
SELECT 
  p.current_weight_kg,
  p.goal_weight_kg,
  p.current_weight_kg - p.goal_weight_kg as weight_to_lose,
  (SELECT weight_kg FROM weight_entries 
   WHERE user_id = p.id 
   ORDER BY entry_date ASC 
   LIMIT 1) as starting_weight
FROM profiles p
WHERE p.id = $1;
```

---

## Data Validation

### Client-Side (TypeScript)
- Form validation before submission
- Type safety with TypeScript
- Zod schemas for runtime validation

### Database-Side (PostgreSQL)
- CHECK constraints for data integrity
- Foreign keys for referential integrity
- Unique constraints to prevent duplicates
- NOT NULL for required fields

---

## Security

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Policies enforce user isolation

### Supabase Auth Integration
- `auth.uid()` function identifies current user
- Policies reference `auth.users` table
- Automatic session management

---

## Migration Strategy

### File: `supabase/migrations/001_initial_schema.sql`

This single migration will:
1. Create all tables
2. Add indexes
3. Set up RLS policies
4. Create functions and triggers

### Applying Migration
```bash
# Using Supabase CLI
supabase db push

# Or in Supabase Dashboard
# SQL Editor → Run migration script
```

---

## Future Enhancements (Not in MVP)

- **fasting_goals**: Track fasting goals and streaks
- **body_measurements**: Additional measurements (waist, etc.)
- **meal_logs**: Track meals during eating windows
- **notifications**: Remind users of goals/milestones
- **social**: Share progress with friends

---

**Status**: Schema designed, migration file to be created, awaiting approval.
