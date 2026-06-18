# Ascension Fasting - Architecture Plan

## Project Overview

**Ascension Fasting** is a standalone fasting and weight tracking platform built with Next.js 16. This application is **completely independent** from Ascension Cultivation and will eventually integrate into the wider Ascension ecosystem.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Design Philosophy**: Mobile-first, responsive

## Project Structure

```
ascension-fasting/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Landing page
│   ├── globals.css              # Global styles
│   ├── login/
│   │   └── page.tsx             # Login page
│   ├── signup/
│   │   └── page.tsx             # Sign up page
│   ├── dashboard/
│   │   └── page.tsx             # User dashboard
│   ├── fast/
│   │   ├── page.tsx             # Active fast view
│   │   └── history/
│   │       └── page.tsx         # Fast history
│   ├── weight/
│   │   └── page.tsx             # Weight tracker
│   └── profile/
│       └── page.tsx             # User profile
├── components/                   # Reusable React components
│   ├── navigation/
│   │   ├── Header.tsx
│   │   └── BottomNav.tsx
│   ├── fast/
│   │   ├── FastCard.tsx
│   │   ├── FastTimer.tsx
│   │   ├── FastTypeSelector.tsx
│   │   └── FastProgress.tsx
│   ├── weight/
│   │   ├── WeightChart.tsx
│   │   ├── WeightEntryForm.tsx
│   │   └── WeightStats.tsx
│   ├── profile/
│   │   ├── ProfileForm.tsx
│   │   └── ProfileStats.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Modal.tsx
├── lib/                          # Utility functions and configurations
│   ├── supabase.ts              # Supabase client
│   ├── auth.ts                  # Auth helpers
│   ├── fast-calculations.ts     # Fast logic
│   └── date-utils.ts            # Date/time utilities
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useFast.ts
│   ├── useWeight.ts
│   └── useProfile.ts
├── types/                        # TypeScript type definitions
│   ├── database.ts              # Supabase generated types
│   ├── fast.ts                  # Fast-related types
│   ├── weight.ts                # Weight-related types
│   └── user.ts                  # User-related types
├── supabase/                     # Database migrations and config
│   └── migrations/
│       └── 001_initial_schema.sql
└── public/                       # Static assets
```

## Page Structure & Navigation

### Public Pages (Unauthenticated)
1. **Landing Page** (`/`)
   - Hero section with app value proposition
   - Feature highlights
   - Call-to-action buttons (Sign Up / Login)
   - Responsive design

2. **Login** (`/login`)
   - Email/password form
   - Link to Sign Up
   - Password reset option

3. **Sign Up** (`/signup`)
   - Registration form (email, password, name)
   - Link to Login
   - Terms acceptance

### Protected Pages (Authenticated)
4. **Dashboard** (`/dashboard`)
   - Current fast status (if active)
   - Quick stats (current weight, active streak)
   - Recent weight entries chart
   - Quick action buttons (Start Fast, Log Weight)

5. **Active Fast** (`/fast`)
   - Timer display (elapsed/remaining time)
   - Fast type indicator
   - Progress visualization
   - End fast button
   - Notes/journal section

6. **Fast History** (`/fast/history`)
   - List of completed fasts
   - Filter by fast type
   - Statistics (total fasts, longest fast, etc.)

7. **Weight Tracker** (`/weight`)
   - Weight entry form
   - Weight history chart
   - Progress toward goal
   - BMI calculator
   - Statistics (avg weight, trend, etc.)

8. **Profile** (`/profile`)
   - Personal information editor
   - Goal weight settings
   - Account settings
   - Logout

## Navigation Structure

### Header (Desktop)
- Logo/Brand
- Dashboard | Fast | Weight | Profile
- User avatar/menu

### Bottom Navigation (Mobile)
- Dashboard icon
- Fast icon
- Weight icon
- Profile icon

## Component Architecture

### Smart Components (Container)
- Fetch data
- Manage state
- Handle business logic
- Located in page files

### Presentational Components
- Receive props
- Render UI
- Emit events
- Located in `/components`

### Shared UI Components
- Reusable primitives
- Consistent styling
- Accessible
- Located in `/components/ui`

## State Management

**Approach**: React Hooks + Supabase Real-time

- **Local State**: `useState` for UI state
- **Server State**: Custom hooks with Supabase queries
- **Auth State**: Supabase Auth context
- **Real-time**: Supabase subscriptions for live updates

## Authentication Flow

1. User signs up → Supabase Auth creates user
2. Trigger creates profile in `profiles` table
3. User logs in → Session stored
4. Protected routes check auth status
5. Redirect to login if unauthenticated

## Key Features

### Fast Tracking
- Start fast with type selection
- Real-time timer
- Notifications for milestones
- End fast and log completion
- View fast history

### Weight Tracking
- Log weight entries
- Visual progress charts
- Goal tracking
- BMI calculation
- Trend analysis

### User Profile
- Personal metrics (age, sex, height)
- Goal setting
- Progress statistics

## Data Flow

```
User Action → Component Event → Hook/API Call → Supabase
                                                    ↓
UI Update ← State Update ← Response Data ← Database
```

## Scalability Considerations

### Future Enhancements (Not in MVP)
- Social features (fasting groups)
- Meal planning
- Notifications/reminders
- Export data
- Integration with Ascension ecosystem
- Apple Health / Google Fit integration

### Architecture Supports
- Modular component structure for easy feature addition
- Separate hook layer for business logic reuse
- Type-safe database schema
- Clean separation of concerns

## Performance Optimizations

- Server Components by default (Next.js 16)
- Client Components only when needed
- Image optimization with `next/image`
- Route prefetching
- Lazy loading for charts

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Color contrast compliance
- Screen reader support

## Development Workflow

1. Design database schema
2. Apply migrations
3. Generate TypeScript types
4. Build UI components
5. Implement hooks/logic
6. Connect pages
7. Test authentication
8. Test data flows
9. Deploy to Vercel

## Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Deployment

- **Platform**: Vercel (recommended)
- **Database**: Supabase (hosted)
- **CI/CD**: GitHub integration with Vercel

---

**Status**: Architecture defined, awaiting approval before implementation.
