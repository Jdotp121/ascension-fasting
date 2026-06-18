# Ascension Fasting - Implementation Plan

## Overview

This document outlines the step-by-step implementation plan for building the Ascension Fasting application.

## Phase 1: Foundation Setup ✅

**Status**: Complete

- [x] Create Next.js project with TypeScript and Tailwind
- [x] Define project architecture
- [x] Design database schema
- [x] Create planning documentation

---

## Phase 2: Supabase Setup (Next Step)

### 2.1 Supabase Project Creation
- [ ] Create new Supabase project
- [ ] Save project URL and anon key
- [ ] Configure environment variables

### 2.2 Database Migration
- [ ] Create `supabase/migrations/001_initial_schema.sql`
- [ ] Apply migration to create tables
- [ ] Verify tables, indexes, and RLS policies
- [ ] Test triggers (profile creation, weight update, duration calculation)

### 2.3 Supabase Client Setup
- [ ] Install Supabase packages: `@supabase/supabase-js` and `@supabase/ssr`
- [ ] Create `.env.local` with Supabase credentials
- [ ] Create `lib/supabase.ts` - Browser client
- [ ] Create `lib/supabase-server.ts` - Server client for Server Components
- [ ] Generate TypeScript types from database

---

## Phase 3: Core Infrastructure

### 3.1 Type Definitions
- [ ] `types/database.ts` - Supabase generated types
- [ ] `types/user.ts` - User and profile types
- [ ] `types/fast.ts` - Fast-related types
- [ ] `types/weight.ts` - Weight-related types

### 3.2 Authentication
- [ ] `lib/auth.ts` - Auth helper functions
- [ ] `hooks/useAuth.ts` - Auth state hook
- [ ] Server-side auth utilities
- [ ] Protected route middleware

### 3.3 UI Components Library
Create reusable UI primitives:
- [ ] `components/ui/Button.tsx`
- [ ] `components/ui/Input.tsx`
- [ ] `components/ui/Card.tsx`
- [ ] `components/ui/Modal.tsx`
- [ ] `components/ui/Loading.tsx`
- [ ] `components/ui/Toast.tsx`

---

## Phase 4: Authentication Pages

### 4.1 Sign Up Page
- [ ] `app/signup/page.tsx`
- [ ] Sign up form component
- [ ] Email/password validation
- [ ] Error handling
- [ ] Redirect to dashboard on success

### 4.2 Login Page
- [ ] `app/login/page.tsx`
- [ ] Login form component
- [ ] Remember me functionality
- [ ] Password reset link
- [ ] Redirect to dashboard on success

### 4.3 Auth Flow
- [ ] Session management
- [ ] Auto-redirect if authenticated
- [ ] Logout functionality

---

## Phase 5: User Profile

### 5.1 Profile Setup
- [ ] `hooks/useProfile.ts` - Profile data hook
- [ ] `components/profile/ProfileForm.tsx`
- [ ] `components/profile/ProfileStats.tsx`

### 5.2 Profile Page
- [ ] `app/profile/page.tsx`
- [ ] Edit personal information
- [ ] Update health metrics
- [ ] Goal weight management
- [ ] Account settings (logout)

---

## Phase 6: Dashboard

### 6.1 Dashboard Logic
- [ ] `hooks/useDashboard.ts` - Aggregate dashboard data
- [ ] Fetch active fast
- [ ] Fetch recent weight entries
- [ ] Calculate quick stats

### 6.2 Dashboard Components
- [ ] `components/dashboard/ActiveFastCard.tsx`
- [ ] `components/dashboard/QuickStats.tsx`
- [ ] `components/dashboard/RecentWeightChart.tsx`
- [ ] `components/dashboard/QuickActions.tsx`

### 6.3 Dashboard Page
- [ ] `app/dashboard/page.tsx`
- [ ] Compose dashboard from components
- [ ] Loading states
- [ ] Empty states

---

## Phase 7: Fast Tracking

### 7.1 Fast Logic
- [ ] `lib/fast-calculations.ts` - Time calculations, progress
- [ ] `hooks/useFast.ts` - Fast CRUD operations
- [ ] Real-time timer logic

### 7.2 Fast Components
- [ ] `components/fast/FastTypeSelector.tsx`
- [ ] `components/fast/FastTimer.tsx`
- [ ] `components/fast/FastProgress.tsx`
- [ ] `components/fast/FastCard.tsx` (for history)

### 7.3 Active Fast Page
- [ ] `app/fast/page.tsx`
- [ ] Start fast flow
- [ ] Active fast display with timer
- [ ] End fast functionality
- [ ] Notes/journal

### 7.4 Fast History Page
- [ ] `app/fast/history/page.tsx`
- [ ] List completed fasts
- [ ] Filter by type
- [ ] Fast statistics
- [ ] Pagination

---

## Phase 8: Weight Tracking

### 8.1 Weight Logic
- [ ] `lib/weight-calculations.ts` - BMI, trend calculations
- [ ] `hooks/useWeight.ts` - Weight entry CRUD

### 8.2 Weight Components
- [ ] `components/weight/WeightEntryForm.tsx`
- [ ] `components/weight/WeightChart.tsx` (using Chart.js or Recharts)
- [ ] `components/weight/WeightStats.tsx`
- [ ] `components/weight/BMICalculator.tsx`

### 8.3 Weight Tracker Page
- [ ] `app/weight/page.tsx`
- [ ] Weight entry form
- [ ] Weight history chart
- [ ] Progress visualization
- [ ] Statistics display

---

## Phase 9: Navigation

### 9.1 Navigation Components
- [ ] `components/navigation/Header.tsx` (desktop)
- [ ] `components/navigation/BottomNav.tsx` (mobile)
- [ ] Active route highlighting
- [ ] User menu dropdown

### 9.2 Layout Integration
- [ ] Update `app/layout.tsx` with navigation
- [ ] Responsive breakpoints
- [ ] Auth-aware navigation

---

## Phase 10: Landing Page

### 10.1 Landing Components
- [ ] Hero section
- [ ] Features showcase
- [ ] Call-to-action
- [ ] Responsive design

### 10.2 Landing Page
- [ ] `app/page.tsx`
- [ ] Compose landing sections
- [ ] Link to signup/login

---

## Phase 11: Polish & Optimization

### 11.1 Error Handling
- [ ] Global error boundary
- [ ] Form validation messages
- [ ] API error handling
- [ ] User-friendly error messages

### 11.2 Loading States
- [ ] Skeleton loaders
- [ ] Suspense boundaries
- [ ] Optimistic UI updates

### 11.3 Accessibility
- [ ] ARIA labels
- [ ] Keyboard navigation
- [ ] Color contrast
- [ ] Screen reader testing

### 11.4 Mobile Optimization
- [ ] Touch targets (min 44px)
- [ ] Responsive images
- [ ] Mobile-friendly forms
- [ ] PWA considerations

---

## Phase 12: Testing & Deployment

### 12.1 Testing
- [ ] User authentication flow
- [ ] Fast start/end flow
- [ ] Weight entry flow
- [ ] Profile updates
- [ ] Mobile responsiveness
- [ ] Cross-browser testing

### 12.2 Deployment
- [ ] Environment variables on Vercel
- [ ] Deploy to Vercel
- [ ] Custom domain (if applicable)
- [ ] SSL certificate
- [ ] Performance testing

---

## Dependencies to Install

### Core
```bash
npm install @supabase/supabase-js @supabase/ssr
```

### Charts (for weight tracking)
```bash
npm install recharts
# or
npm install chart.js react-chartjs-2
```

### Form Validation
```bash
npm install zod react-hook-form @hookform/resolvers
```

### Date Utilities
```bash
npm install date-fns
```

### Icons
```bash
npm install lucide-react
# or
npm install @heroicons/react
```

---

## Estimated Timeline

- **Phase 2-3**: Foundation (1-2 days)
- **Phase 4**: Auth Pages (1 day)
- **Phase 5**: Profile (1 day)
- **Phase 6**: Dashboard (1 day)
- **Phase 7**: Fast Tracking (2 days)
- **Phase 8**: Weight Tracking (2 days)
- **Phase 9**: Navigation (0.5 day)
- **Phase 10**: Landing Page (0.5 day)
- **Phase 11**: Polish (1-2 days)
- **Phase 12**: Testing & Deployment (1 day)

**Total**: 10-13 days for MVP

---

## Key Decisions Needed

### 1. Chart Library
**Options**:
- **Recharts**: Declarative, easy to use, good for React
- **Chart.js**: More features, flexible, larger community

**Recommendation**: Recharts for simplicity and React integration

### 2. Icon Library
**Options**:
- **Lucide React**: Modern, clean, tree-shakeable
- **Heroicons**: Tailwind creators, consistent style

**Recommendation**: Lucide React for variety and modern design

### 3. Form Handling
**Options**:
- **React Hook Form + Zod**: Type-safe, performant
- **Formik**: Mature, simpler API

**Recommendation**: React Hook Form + Zod for type safety

### 4. Date Handling
**Options**:
- **date-fns**: Modular, tree-shakeable
- **Day.js**: Lightweight, Moment.js-like API

**Recommendation**: date-fns for better TypeScript support

---

## Potential Improvements to Consider

### Before Implementation
1. **Fast Presets**: Pre-defined fast durations (16:8, 18:6, 24hr, 48hr)
2. **Notifications**: Browser notifications for fast milestones
3. **Export Data**: CSV/JSON export functionality
4. **Dark Mode**: Theme toggle
5. **Onboarding**: Guided setup for new users
6. **Fast Templates**: Save favorite fast configurations

### Post-MVP
1. **Social Features**: Share achievements
2. **Fasting Groups**: Join challenges
3. **Meal Planning**: Plan eating windows
4. **Integrations**: Apple Health, Google Fit
5. **Analytics**: Advanced insights and trends
6. **Achievements**: Gamification elements

---

## Questions to Address

1. **Should we include a "break fast early" option with reason tracking?**
   - This could provide insights into what causes people to break fasts

2. **Weight entry frequency: enforce daily or allow multiple per day?**
   - Current schema allows one per day - is this sufficient?

3. **Should we add a "feeling" or "energy level" tracker?**
   - Could correlate with fast progress

4. **Goal system: just weight goal or also fasting frequency goals?**
   - e.g., "Complete 3 fasts per week"

5. **Data privacy: should users be able to export/delete all their data?**
   - GDPR compliance consideration

---

## Success Criteria

### MVP Launch Checklist
- [ ] Users can sign up and log in
- [ ] Users can complete their profile
- [ ] Users can start and end fasts
- [ ] Users can log weight entries
- [ ] Users can view their dashboard
- [ ] Users can see fast history
- [ ] Users can track weight progress
- [ ] Mobile responsive
- [ ] Accessible (WCAG AA)
- [ ] Deployed and live

---

**Status**: Ready for approval and implementation. Awaiting feedback on architecture, schema, and key decisions.
