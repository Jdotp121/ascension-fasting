-- ============================================================================
-- Fix Supabase Security Advisor Warnings
-- ============================================================================
-- This migration addresses two classes of warnings raised by the Supabase
-- Security Advisor:
--
--   1. "Function Search Path Mutable" - functions without a fixed
--      search_path can be tricked into resolving objects from an
--      unexpected schema if a malicious schema is prepended to the
--      caller's search_path. Fix: pin search_path on every function.
--
--   2. "Public/Signed-in users can execute SECURITY DEFINER functions" -
--      SECURITY DEFINER functions run with the privileges of the function
--      owner (bypassing RLS), so anyone who can EXECUTE them can do more
--      than their own RLS policies would normally allow. Fix: revoke
--      EXECUTE from anon/authenticated for functions that are only ever
--      invoked by triggers, and add an explicit auth.uid() ownership
--      check for the one function that IS called directly by the
--      frontend (check_and_award_achievements).
--
-- Inspection summary (see supabase/migrations/001-004 and
-- hooks/useAchievements.ts):
--
--   - handle_new_user()                  -> trigger-only (on_auth_user_created
--                                            AFTER INSERT ON auth.users).
--                                            Never called via supabase.rpc().
--   - update_current_weight()            -> trigger-only (trigger_update_current_weight
--                                            AFTER INSERT ON weight_entries).
--                                            Never called via supabase.rpc().
--   - calculate_fast_duration()           -> trigger-only (trigger_calculate_fast_duration
--                                            BEFORE UPDATE ON fasts). Not
--                                            SECURITY DEFINER, no permission
--                                            warning - search_path fix only.
--   - update_updated_at_column()         -> trigger-only (used on profiles
--                                            and fasts updated_at columns).
--                                            Not SECURITY DEFINER - search_path
--                                            fix only.
--   - check_and_award_achievements(uuid) -> called directly from the
--                                            frontend via
--                                            supabase.rpc('check_and_award_achievements',
--                                            { p_user_id }) in
--                                            hooks/useAchievements.ts. Needs
--                                            to remain callable by
--                                            authenticated users, but must
--                                            enforce that p_user_id matches
--                                            the caller's own auth.uid().
--
-- All functions below are recreated with CREATE OR REPLACE FUNCTION using
-- the exact same name, arguments, return type, language and (where
-- applicable) SECURITY DEFINER mode as before, so existing triggers keep
-- working unchanged. Only `SET search_path` is added, and (for the two
-- previously-unrestricted SECURITY DEFINER functions) an explicit REVOKE
-- of EXECUTE from anon/authenticated.
-- ============================================================================


-- ============================================================================
-- 1. handle_new_user() - trigger-only, auto-creates a profile row on signup
-- ============================================================================
-- SECURITY DEFINER is required here: this trigger fires on INSERT INTO
-- auth.users (executed by Supabase's auth service, not by the end-user's
-- authenticated/anon role), and it must be able to insert into
-- public.profiles regardless of RLS, since auth.uid() is not necessarily
-- established yet in that execution context. Behaviour is unchanged from
-- supabase/migrations/002_fix_auth_trigger.sql; only search_path is fixed.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$;

-- This function is only ever fired by the on_auth_user_created trigger
-- (which runs as part of the auth.users INSERT performed by Supabase Auth,
-- not via a direct call from anon/authenticated PostgREST roles). It is
-- never called from the frontend via supabase.rpc(), so we can safely
-- revoke direct EXECUTE access without breaking signup.
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;


-- ============================================================================
-- 2. update_current_weight() - trigger-only, syncs profiles.current_weight_kg
-- ============================================================================
-- SECURITY DEFINER preserved as-is from supabase/migrations/001_initial_schema.sql
-- to avoid changing existing behaviour. Only fires on INSERT into
-- weight_entries, which is already RLS-protected (users can only insert
-- their own weight entries), so the update it performs is always scoped to
-- the inserting user's own profile row.
CREATE OR REPLACE FUNCTION public.update_current_weight()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET current_weight_kg = NEW.weight_kg,
      updated_at = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$;

-- Only invoked by trigger_update_current_weight (AFTER INSERT ON
-- weight_entries). Not called via supabase.rpc() anywhere in the app, so
-- direct execute access can be safely revoked.
REVOKE EXECUTE ON FUNCTION public.update_current_weight() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_current_weight() FROM anon;
REVOKE EXECUTE ON FUNCTION public.update_current_weight() FROM authenticated;


-- ============================================================================
-- 3. calculate_fast_duration() - trigger-only, computes duration_hours
-- ============================================================================
-- Not SECURITY DEFINER (runs with the caller's own privileges), so it is
-- not part of the "SECURITY DEFINER execute" warnings - only search_path
-- needs fixing here. Default EXECUTE grants are left untouched.
CREATE OR REPLACE FUNCTION public.calculate_fast_duration()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.completed = TRUE AND NEW.actual_end_time IS NOT NULL THEN
    NEW.duration_hours := EXTRACT(EPOCH FROM (NEW.actual_end_time - NEW.start_time)) / 3600;
  END IF;
  RETURN NEW;
END;
$$;


-- ============================================================================
-- 4. update_updated_at_column() - trigger-only, maintains updated_at columns
-- ============================================================================
-- Not SECURITY DEFINER, not part of the execute-permission warnings -
-- search_path fix only. Default EXECUTE grants are left untouched.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


-- ============================================================================
-- 5. check_and_award_achievements(uuid) - called directly by the frontend
-- ============================================================================
-- This is the ONLY function in this migration that is invoked directly by
-- the frontend, via:
--   supabase.rpc('check_and_award_achievements', { p_user_id: user.id })
-- (see hooks/useAchievements.ts). It must remain callable by authenticated
-- users, but as a SECURITY DEFINER function it currently bypasses RLS
-- entirely, meaning any authenticated user could pass an arbitrary
-- p_user_id and read/mutate another user's fasts, weight_entries, profile
-- and user_achievements rows.
--
-- Fix: keep SECURITY DEFINER (it needs to read across profiles/fasts/
-- weight_entries and insert into user_achievements, which has RLS
-- policies requiring auth.uid() = user_id - the DEFINER privileges make
-- the internal INSERT ... VALUES (p_user_id, ...) work regardless), but
-- add an explicit guard so p_user_id must match the caller's own
-- auth.uid(). Combined with revoking anon and keeping authenticated
-- access, this closes the privilege-escalation hole while preserving
-- exactly the same behaviour for legitimate calls (the frontend always
-- passes the current user's own id).
CREATE OR REPLACE FUNCTION public.check_and_award_achievements(p_user_id UUID)
RETURNS TABLE(newly_unlocked TEXT[])
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  -- Authorization guard: only allow a caller to check/award achievements
  -- for their own account. anon has no auth.uid(), so this also blocks
  -- any anon caller that slips through (belt-and-braces alongside the
  -- REVOKE below).
  IF auth.uid() IS NULL OR p_user_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Not authorized to check achievements for this user';
  END IF;

  -- Get fasting stats
  SELECT
    COUNT(*) FILTER (WHERE completed = true),
    COUNT(*) FILTER (WHERE completed = true AND duration_hours >= 24),
    COUNT(*) FILTER (WHERE completed = true AND duration_hours >= 48),
    COUNT(*) FILTER (WHERE completed = true AND duration_hours >= 72)
  INTO v_completed_fasts, v_fast_24h, v_fast_48h, v_fast_72h
  FROM public.fasts
  WHERE user_id = p_user_id;

  -- Get weight stats
  SELECT COUNT(*) INTO v_weight_entries
  FROM public.weight_entries
  WHERE user_id = p_user_id;

  -- Get weight loss stats
  SELECT
    (SELECT weight_kg FROM public.weight_entries WHERE user_id = p_user_id ORDER BY entry_date ASC LIMIT 1),
    (SELECT weight_kg FROM public.weight_entries WHERE user_id = p_user_id ORDER BY entry_date DESC LIMIT 1)
  INTO v_first_weight, v_current_weight;

  -- Get goal weight
  SELECT goal_weight_kg INTO v_goal_weight
  FROM public.profiles
  WHERE id = p_user_id;

  -- Calculate weight lost
  IF v_first_weight IS NOT NULL AND v_current_weight IS NOT NULL THEN
    v_weight_lost := v_first_weight - v_current_weight;
  ELSE
    v_weight_lost := 0;
  END IF;

  -- Get days logged (unique days with weight entries)
  SELECT COUNT(DISTINCT DATE(entry_date))
  INTO v_days_logged
  FROM public.weight_entries
  WHERE user_id = p_user_id;

  -- =========================================================================
  -- FASTING ACHIEVEMENTS
  -- =========================================================================

  -- First Fast Completed
  IF v_completed_fasts >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_fast_completed') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_fast_completed');
      v_newly_unlocked := array_append(v_newly_unlocked, 'first_fast_completed');
    END IF;
  END IF;

  -- First 24 Hour Fast
  IF v_fast_24h >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_24h_fast') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_24h_fast');
      v_newly_unlocked := array_append(v_newly_unlocked, 'first_24h_fast');
    END IF;
  END IF;

  -- First 48 Hour Fast
  IF v_fast_48h >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_48h_fast') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_48h_fast');
      v_newly_unlocked := array_append(v_newly_unlocked, 'first_48h_fast');
    END IF;
  END IF;

  -- First 72 Hour Fast
  IF v_fast_72h >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_72h_fast') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_72h_fast');
      v_newly_unlocked := array_append(v_newly_unlocked, 'first_72h_fast');
    END IF;
  END IF;

  -- 5 Fasts Completed
  IF v_completed_fasts >= 5 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'five_fasts_completed') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'five_fasts_completed');
      v_newly_unlocked := array_append(v_newly_unlocked, 'five_fasts_completed');
    END IF;
  END IF;

  -- 10 Fasts Completed
  IF v_completed_fasts >= 10 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'ten_fasts_completed') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'ten_fasts_completed');
      v_newly_unlocked := array_append(v_newly_unlocked, 'ten_fasts_completed');
    END IF;
  END IF;

  -- 25 Fasts Completed
  IF v_completed_fasts >= 25 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'twentyfive_fasts_completed') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'twentyfive_fasts_completed');
      v_newly_unlocked := array_append(v_newly_unlocked, 'twentyfive_fasts_completed');
    END IF;
  END IF;

  -- =========================================================================
  -- WEIGHT LOSS ACHIEVEMENTS
  -- =========================================================================

  -- First Weight Entry
  IF v_weight_entries >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'first_weight_entry') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'first_weight_entry');
      v_newly_unlocked := array_append(v_newly_unlocked, 'first_weight_entry');
    END IF;
  END IF;

  -- Lost First 1kg
  IF v_weight_lost >= 1 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'lost_1kg') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'lost_1kg');
      v_newly_unlocked := array_append(v_newly_unlocked, 'lost_1kg');
    END IF;
  END IF;

  -- Lost First 5kg
  IF v_weight_lost >= 5 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'lost_5kg') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'lost_5kg');
      v_newly_unlocked := array_append(v_newly_unlocked, 'lost_5kg');
    END IF;
  END IF;

  -- Lost First 10kg
  IF v_weight_lost >= 10 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'lost_10kg') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'lost_10kg');
      v_newly_unlocked := array_append(v_newly_unlocked, 'lost_10kg');
    END IF;
  END IF;

  -- Reached Goal Weight
  IF v_goal_weight IS NOT NULL AND v_current_weight IS NOT NULL AND v_current_weight <= v_goal_weight THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'reached_goal_weight') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'reached_goal_weight');
      v_newly_unlocked := array_append(v_newly_unlocked, 'reached_goal_weight');
    END IF;
  END IF;

  -- =========================================================================
  -- CONSISTENCY ACHIEVEMENTS
  -- =========================================================================

  -- 3 Days Logged
  IF v_days_logged >= 3 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'three_days_logged') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'three_days_logged');
      v_newly_unlocked := array_append(v_newly_unlocked, 'three_days_logged');
    END IF;
  END IF;

  -- 7 Days Logged
  IF v_days_logged >= 7 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'seven_days_logged') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'seven_days_logged');
      v_newly_unlocked := array_append(v_newly_unlocked, 'seven_days_logged');
    END IF;
  END IF;

  -- 30 Days Logged
  IF v_days_logged >= 30 THEN
    SELECT EXISTS(SELECT 1 FROM public.user_achievements WHERE user_id = p_user_id AND achievement_id = 'thirty_days_logged') INTO v_achievement_exists;
    IF NOT v_achievement_exists THEN
      INSERT INTO public.user_achievements (user_id, achievement_id) VALUES (p_user_id, 'thirty_days_logged');
      v_newly_unlocked := array_append(v_newly_unlocked, 'thirty_days_logged');
    END IF;
  END IF;

  RETURN QUERY SELECT v_newly_unlocked;
END;
$$;

-- The frontend calls this via supabase.rpc('check_and_award_achievements', ...)
-- as an authenticated user (hooks/useAchievements.ts), so authenticated
-- access must be preserved. anon has no legitimate reason to call this
-- (there is no signed-out achievement checking flow), and since the
-- function is now guarded by the auth.uid() check above, an anon call
-- would simply raise an exception anyway - but we revoke it explicitly
-- for defense-in-depth and to satisfy the "Public can execute" advisor
-- warning.
REVOKE EXECUTE ON FUNCTION public.check_and_award_achievements(UUID) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.check_and_award_achievements(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.check_and_award_achievements(UUID) TO authenticated;


-- ============================================================================
-- Notes on triggers (unaffected by this migration)
-- ============================================================================
-- CREATE OR REPLACE FUNCTION preserves the existing trigger bindings for:
--   on_auth_user_created            -> handle_new_user()
--   trigger_update_current_weight   -> update_current_weight()
--   trigger_calculate_fast_duration -> calculate_fast_duration()
--   update_profiles_updated_at      -> update_updated_at_column()
--   update_fasts_updated_at         -> update_updated_at_column()
-- No trigger definitions need to change, since triggers reference
-- functions by name/oid and PostgreSQL trigger execution does not go
-- through the EXECUTE grant system used for direct/RPC calls - it always
-- runs as part of the triggering statement regardless of the invoking
-- role's function-level EXECUTE privileges. Revoking EXECUTE from
-- anon/authenticated on handle_new_user() and update_current_weight()
-- therefore does not break the signup or weight-tracking triggers.
-- ============================================================================
