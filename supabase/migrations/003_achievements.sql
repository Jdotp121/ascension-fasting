-- Achievements System Migration
-- Creates achievements table and related functions

-- ============================================================================
-- TABLES
-- ============================================================================

-- User achievements table: tracks which achievements users have unlocked
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_unlocked_at ON user_achievements(unlocked_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Users can view own achievements
CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert own achievements
CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users cannot update or delete achievements (permanent record)
CREATE POLICY "Users cannot update achievements"
  ON user_achievements FOR UPDATE
  USING (false);

CREATE POLICY "Users cannot delete achievements"
  ON user_achievements FOR DELETE
  USING (false);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to check and award achievements based on user stats
-- This can be called manually or triggered after certain actions
CREATE OR REPLACE FUNCTION check_and_award_achievements(p_user_id UUID)
RETURNS TABLE(newly_unlocked TEXT[]) AS $$
DECLARE
  v_completed_fasts INTEGER;
  v_fast_24h INTEGER;
  v_fast_48h INTEGER;
  v_fast_72h INTEGER;
  v_weight_entries INTEGER;
  v_first_weight DECIMAL;
  v_current_weight DECIMAL;
  v_goal_weight DECIMAL;
  v_weight_lost DECIMAL;
  v_days_logged INTEGER;
  v_newly_unlocked TEXT[] := ARRAY[]::TEXT[];
  v_achievement_exists BOOLEAN;
BEGIN
  -- Get fasting stats
  SELECT 
    COUNT(*) FILTER (WHERE completed = true),
    COUNT(*) FILTER (WHERE completed = true AND duration_hours >= 24),
    COUNT(*) FILTER (WHERE completed = true AND duration_hours >= 48),
    COUNT(*) FILTER (WHERE completed = true AND duration_hours >= 72)
  INTO v_completed_fasts, v_fast_24h, v_fast_48h, v_fast_72h
  FROM fasts
  WHERE user_id = p_user_id;

  -- Get weight stats
  SELECT COUNT(*) INTO v_weight_entries
  FROM weight_entries
  WHERE user_id = p_user_id;

  -- Get weight loss stats
  SELECT 
    (SELECT weight_kg FROM weight_entries WHERE user_id = p_user_id ORDER BY entry_date ASC LIMIT 1),
    (SELECT weight_kg FROM weight_entries WHERE user_id = p_user_id ORDER BY entry_date DESC LIMIT 1)
  INTO v_first_weight, v_current_weight;

  -- Get goal weight
  SELECT goal_weight_kg INTO v_goal_weight
  FROM profiles
  WHERE id = p_user_id;

  -- Calculate weight lost
  IF v_first_weight IS NOT NULL AND v_current_weight IS NOT NULL THEN
    v_weight_lost := v_first_weight - v_current_weight;
  ELSE
    v_weight_lost := 0;
  END IF;

  -- Get days logged (unique days with either weight entry or fast)
  SELECT COUNT(DISTINCT DATE(entry_date))
  INTO v_days_logged
  FROM weight_entries
  WHERE user_id = p_user_id;

  -- Helper function to check and insert achievement
  CREATE TEMP TABLE IF NOT EXISTS temp_achievements (achievement_id TEXT);

  -- FASTING ACHIEVEMENTS
  -- First Fast Completed
  IF v_completed_fasts >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_fast_completed') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_fast_completed');
      v_newly_unlocked := array_append(v_newly_unlocked, 'first_fast_completed');
    END IF;
  END IF;

  -- First 24 Hour Fast
  IF v_fast_24h >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_24h_fast') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_24h_fast');
      v_newly_unlocked := array_append(v_newly_unlocked, 'first_24h_fast');
    END IF;
  END IF;

  -- First 48 Hour Fast
  IF v_fast_48h >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_48h_fast') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_48h_fast');
      v_newly_unlocked := array_append(v_newly_unlocked, 'first_48h_fast');
    END IF;
  END IF;

  -- First 72 Hour Fast
  IF v_fast_72h >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_72h_fast') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_72h_fast');
      v_newly_unlocked := array_append(v_newly_unlocked, 'first_72h_fast');
    END IF;
  END IF;

  -- 5 Fasts Completed
  IF v_completed_fasts >= 5 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'five_fasts_completed') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'five_fasts_completed');
      v_newly_unlocked := array_append(v_newly_unlocked, 'five_fasts_completed');
    END IF;
  END IF;

  -- 10 Fasts Completed
  IF v_completed_fasts >= 10 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'ten_fasts_completed') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'ten_fasts_completed');
      v_newly_unlocked := array_append(v_newly_unlocked, 'ten_fasts_completed');
    END IF;
  END IF;

  -- 25 Fasts Completed
  IF v_completed_fasts >= 25 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'twentyfive_fasts_completed') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'twentyfive_fasts_completed');
      v_newly_unlocked := array_append(v_newly_unlocked, 'twentyfive_fasts_completed');
    END IF;
  END IF;

  -- WEIGHT LOSS ACHIEVEMENTS
  -- First Weight Entry
  IF v_weight_entries >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_weight_entry') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_weight_entry');
      v_newly_unlocked := array_append(v_newly_unlocked, 'first_weight_entry');
    END IF;
  END IF;

  -- Lost First 1kg
  IF v_weight_lost >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'lost_1kg') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'lost_1kg');
      v_newly_unlocked := array_append(v_newly_unlocked, 'lost_1kg');
    END IF;
  END IF;

  -- Lost First 5kg
  IF v_weight_lost >= 5 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'lost_5kg') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'lost_5kg');
      v_newly_unlocked := array_append(v_newly_unlocked, 'lost_5kg');
    END IF;
  END IF;

  -- Lost First 10kg
  IF v_weight_lost >= 10 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'lost_10kg') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'lost_10kg');
      v_newly_unlocked := array_append(v_newly_unlocked, 'lost_10kg');
    END IF;
  END IF;

  -- Reached Goal Weight
  IF v_goal_weight IS NOT NULL AND v_current_weight IS NOT NULL AND v_current_weight <= v_goal_weight THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'reached_goal_weight') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'reached_goal_weight');
      v_newly_unlocked := array_append(v_newly_unlocked, 'reached_goal_weight');
    END IF;
  END IF;

  -- CONSISTENCY ACHIEVEMENTS
  -- 3 Days Logged
  IF v_days_logged >= 3 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'three_days_logged') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'three_days_logged');
      v_newly_unlocked := array_append(v_newly_unlocked, 'three_days_logged');
    END IF;
  END IF;

  -- 7 Days Logged
  IF v_days_logged >= 7 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'seven_days_logged') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'seven_days_logged');
      v_newly_unlocked := array_append(v_newly_unlocked, 'seven_days_logged');
    END IF;
  END IF;

  -- 30 Days Logged
  IF v_days_logged >= 30 THEN
    SELECT EXISTS(SELECT 1 FROM user_achievements WHERE user_id = p_user_id AND achievement_id = 'thirty_days_logged') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO user_achievements (user_id, achievement_id) VALUES (p_user_id, 'thirty_days_logged');
      v_newly_unlocked := array_append(v_newly_unlocked, 'thirty_days_logged');
    END IF;
  END IF;

  RETURN QUERY SELECT v_newly_unlocked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
