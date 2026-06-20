# Achievements System Implementation

## Overview
Complete achievements and milestones system for Ascension Fasting with automatic unlocking, progress tracking, and celebration modals.

## Database Changes Required

### New Table: user_achievements
```sql
CREATE TABLE user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);
```

### New Function: check_and_award_achievements
Database function that automatically checks user stats and awards achievements based on:
- Completed fasts (total, 24h+, 48h+, 72h+)
- Weight entries and weight loss progress
- Days logged consistency
- Goal weight achievement

### Migration File
**File:** `supabase/migrations/003_achievements.sql`
- Creates user_achievements table
- Adds indexes for performance
- Implements RLS policies
- Creates check_and_award_achievements() function

**To apply migration:**
```bash
# Using Supabase CLI
supabase db push

# Or manually run the migration in Supabase dashboard SQL editor
```

## Files Created

### 1. Achievement Definitions
**File:** `lib/achievements/definitions.ts`
- Defines all 17 achievements across 3 categories
- Achievement metadata (titles, descriptions, icons, colors)
- Progress checking logic for each achievement
- Helper functions for category formatting

### 2. Achievement Hook
**File:** `hooks/useAchievements.ts`
- Fetches user achievements and stats
- Calls database function to check/unlock achievements
- Tracks newly unlocked achievements for celebration
- Provides achievement progress data

### 3. Achievement Components

**File:** `components/achievements/AchievementCard.tsx`
- Displays individual achievement with locked/unlocked state
- Shows progress bars for incomplete achievements
- Displays unlock date for completed achievements

**File:** `components/achievements/AchievementCelebration.tsx`
- Modal component for celebrating newly unlocked achievements
- Animated trophy display
- Supports multiple achievements with pagination
- Smooth transitions and backdrop

**File:** `components/achievements/AchievementsCard.tsx`
- Dashboard widget showing achievement progress
- Circular progress indicator
- Quick link to achievements page

### 4. Achievements Page
**File:** `app/achievements/page.tsx`
- Full achievements overview page
- Category filtering (All, Fasting, Weight Loss, Consistency)
- Progress stats with circular chart
- Manual "Check for New Achievements" button
- Responsive grid layout

## Files Modified

### 1. Database Types
**File:** `types/database.ts`
- Added user_achievements table types (Row, Insert, Update)

### 2. Bottom Navigation
**File:** `components/navigation/BottomNav.tsx`
- **Changed:** Replaced "History" with "Achievements" in mobile nav
- New navigation items: Dashboard, Fast, Achievements, Weight, Profile

### 3. Dashboard Page
**File:** `app/dashboard/page.tsx`
- Added achievements hook integration
- Added AchievementsCard to stats grid
- Added AchievementCelebration modal
- Auto-check achievements on dashboard load

## Achievement Categories

### FASTING (7 achievements)
1. **First Fast Completed** - Complete your first fast
2. **First 24 Hour Fast** - Complete a 24+ hour fast
3. **First 48 Hour Fast** - Complete a 48+ hour fast
4. **First 72 Hour Fast** - Complete a 72+ hour fast
5. **5 Fasts Completed** - Complete 5 fasting sessions
6. **10 Fasts Completed** - Complete 10 fasting sessions
7. **25 Fasts Completed** - Complete 25 fasting sessions

### WEIGHT LOSS (5 achievements)
1. **First Weight Entry** - Log your first weight measurement
2. **Lost First 1kg** - Lose your first kilogram
3. **Lost First 5kg** - Lose 5 kilograms
4. **Lost First 10kg** - Lose 10 kilograms
5. **Reached Goal Weight** - Achieve your target weight

### CONSISTENCY (3 achievements)
1. **3 Days Logged** - Log data for 3 different days
2. **7 Days Logged** - Log data for 7 different days
3. **30 Days Logged** - Log data for 30 different days

**Total: 17 achievements**

## Features

### ✅ Achievement Cards
- Icon with custom colors per achievement
- Title and description
- Locked/Unlocked visual states
- Unlock date display
- Progress tracking for incomplete achievements

### ✅ Progress Tracking
Locked achievements show progress:
- "3 / 10 fasts completed"
- "2.7kg / 5kg lost"
- Progress bars with animated fill

### ✅ Dashboard Integration
Achievements card displays:
- X / 20 achievements unlocked
- Circular progress chart
- Quick link to achievements page

### ✅ Automatic Unlocking
Achievements unlock based on:
- Fast completion and duration
- Weight entries and weight loss
- Logging consistency
- Goal achievement

Auto-check triggers:
- When dashboard loads
- Manual check button on achievements page
- Can be integrated into other workflows

### ✅ Celebration Modals
When achievements unlock:
- 🏆 Success modal with animated trophy
- Achievement icon and details
- Support for multiple achievements
- Pagination dots for multiple unlocks
- Smooth animations and transitions

### ✅ Mobile Responsive
- Responsive grid layouts
- Touch-friendly navigation
- Optimized for mobile screens
- Bottom navigation integration

## Testing Steps

### 1. Apply Database Migration
```bash
# Navigate to project directory
cd /Users/SuperMan1/ascension-fasting

# Apply migration (if using Supabase CLI)
supabase db push

# Or manually run supabase/migrations/003_achievements.sql in Supabase dashboard
```

### 2. Test Achievement Unlocking

#### Test First Weight Entry
1. Navigate to `/weight` page
2. Add a weight entry
3. Return to dashboard
4. Should see celebration modal for "First Weight Entry"

#### Test First Fast Completed
1. Navigate to `/fast` page
2. Start a new fast
3. Wait a few seconds
4. End the fast and mark as completed
5. Return to dashboard
6. Should see celebration modal for "First Fast Completed"

#### Test 24 Hour Fast
1. Create a completed fast with 24+ hours duration
2. Check achievements page
3. "First 24 Hour Fast" should unlock

#### Test Weight Loss
1. Add multiple weight entries with decreasing values
2. Ensure total loss > 1kg
3. Check achievements
4. "Lost First 1kg" should unlock

#### Test Consistency
1. Add weight entries on 3+ different days
2. Check achievements
3. "3 Days Logged" should unlock

### 3. Test Achievements Page
1. Navigate to `/achievements`
2. Verify all 17 achievements display
3. Test category filters (All, Fasting, Weight Loss, Consistency)
4. Check progress bars on locked achievements
5. Verify unlock dates on completed achievements
6. Test "Check for New Achievements" button

### 4. Test Dashboard Integration
1. Navigate to `/dashboard`
2. Verify achievements card appears in stats grid
3. Check circular progress indicator
4. Click "View All" button - should navigate to achievements page
5. Verify celebration modal appears for new unlocks

### 5. Test Mobile Navigation
1. Resize browser to mobile view
2. Verify bottom navigation shows Achievements icon
3. Tap Achievements in bottom nav
4. Should navigate to achievements page

### 6. Test Progress Tracking
1. View locked achievements
2. Verify progress shows correctly (e.g., "2 / 5 fasts completed")
3. Complete more activities
4. Refresh and check progress updates

### 7. Test Celebration Modal
1. Trigger a new achievement unlock
2. Verify modal appears with:
   - Animated trophy icon
   - Achievement title and description
   - "Awesome!" button
3. Test closing modal
4. Verify modal doesn't reappear on refresh

### 8. Test Multiple Achievements
1. Complete multiple achievements at once (e.g., first fast + first weight entry)
2. Verify celebration modal shows pagination
3. Test "Next" button to cycle through achievements
4. Verify progress dots indicate current achievement

## API Usage

### Check and Award Achievements
```typescript
import { useAchievements } from '@/hooks/useAchievements'

const { checkAndUnlockAchievements } = useAchievements()

// Call after user completes an action
const newUnlocks = await checkAndUnlockAchievements()
// Returns array of newly unlocked achievement IDs
```

### Get Achievement Progress
```typescript
const { achievements, unlockedCount, totalCount } = useAchievements()

// achievements = array with progress data
// unlockedCount = number of unlocked achievements  
// totalCount = total available achievements
```

### Display Celebration Modal
```typescript
const { newlyUnlocked, clearNewlyUnlocked } = useAchievements()

{newlyUnlocked.length > 0 && (
  <AchievementCelebration
    achievementIds={newlyUnlocked}
    onClose={clearNewlyUnlocked}
  />
)}
```

## Performance Considerations

- Achievements are cached after initial load
- Database function efficiently calculates progress
- RLS policies ensure data security
- Indexes optimize query performance
- Progress calculations happen server-side

## Future Enhancements

Potential additions:
- Social sharing of achievements
- Leaderboards
- Streak tracking
- Custom achievements
- Achievement notifications
- Reward system (badges, points)
- Advanced analytics

## Troubleshooting

### Achievements not unlocking
1. Verify migration was applied successfully
2. Check browser console for errors
3. Verify RLS policies allow access
4. Test database function manually in SQL editor

### Celebration modal not appearing
1. Check newlyUnlocked state in React DevTools
2. Verify clearNewlyUnlocked is called on close
3. Check z-index conflicts with other modals

### Progress not updating
1. Refresh the achievements hook
2. Verify stats are being calculated correctly
3. Check database queries return expected data

## Summary

The achievements system is fully integrated into Ascension Fasting:
- ✅ 17 achievements across 3 categories
- ✅ Automatic unlocking based on user actions
- ✅ Progress tracking with visual indicators
- ✅ Celebration modals for new unlocks
- ✅ Dashboard integration
- ✅ Dedicated achievements page
- ✅ Mobile responsive design
- ✅ Bottom navigation integration

The system enhances user engagement by gamifying the fasting journey and celebrating milestones.
