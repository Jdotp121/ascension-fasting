# Vercel Deployment Guide - Ascension Fasting

## ✅ Pre-Deployment Checklist

### Build Verification
- [x] `npm run build` passes successfully
- [x] All TypeScript types compile without errors
- [x] All pages render correctly (13 routes)
- [x] No secrets committed to git (.env files properly ignored)

### Code Status
- [x] No middleware.ts (removed, auth handled client-side)
- [x] Auth uses ProtectedRoute component wrapper
- [x] All protected routes wrapped with ProtectedRoute
- [x] Public routes use PublicRoute wrapper (login, signup)

---

## 📋 Environment Variables Required

### For Vercel Dashboard
Add these environment variables in Vercel project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Where to Find Values
1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → **anon/public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

⚠️ **IMPORTANT**: These are `NEXT_PUBLIC_` variables and will be exposed to the browser. Never use service role keys.

---

## 🔐 Supabase Configuration

### Authentication Redirect URLs

You need to configure these URLs in Supabase:

#### 1. Local Development URL
- `http://localhost:3000/**`

#### 2. Vercel Production URL (after deployment)
- `https://your-app-name.vercel.app/**`
- `https://your-custom-domain.com/**` (if using custom domain)

### How to Add Redirect URLs in Supabase:
1. Go to Supabase Dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Under **Redirect URLs**, add:
   ```
   http://localhost:3000/**
   https://your-app-name.vercel.app/**
   ```
4. Under **Site URL**, set your production URL:
   ```
   https://your-app-name.vercel.app
   ```
5. Click **Save**

### Database Migrations
Before first deployment, ensure migrations are run:
```bash
# If using Supabase CLI
supabase db push

# Or manually run SQL in Supabase SQL Editor:
# 1. supabase/migrations/001_initial_schema.sql
# 2. supabase/migrations/002_fix_auth_trigger.sql
# 3. supabase/migrations/003_achievements.sql
```

---

## 🚀 Vercel Deployment Steps

### Option 1: Deploy via GitHub Integration (Recommended)

1. **Push your code to GitHub** (already done ✅)
   ```bash
   git status  # Verify clean state
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click **Add New** → **Project**
   - Import your GitHub repository: `Jdotp121/ascension-fasting`

3. **Configure Build Settings**
   - Framework Preset: **Next.js**
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables**
   - Click **Environment Variables**
   - Add both required variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Apply to: **Production**, **Preview**, and **Development**

5. **Deploy**
   - Click **Deploy**
   - Wait 2-3 minutes for build to complete
   - Note your deployment URL (e.g., `https://ascension-fasting.vercel.app`)

6. **Update Supabase Redirect URLs**
   - Copy your Vercel deployment URL
   - Add it to Supabase redirect URLs (see above)
   - Update Supabase Site URL

7. **Test Authentication**
   - Visit your deployed app
   - Try signing up / logging in
   - Verify all protected routes work

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts to set up project
```

---

## 🔍 Post-Deployment Verification

### 1. Build Status
- ✅ Deployment shows "Ready" status
- ✅ No build errors in Vercel logs

### 2. Environment Variables
- ✅ Both variables set in Vercel
- ✅ Variables start with `NEXT_PUBLIC_`

### 3. Supabase Configuration
- ✅ Production URL added to redirect URLs
- ✅ Site URL updated to production domain
- ✅ All migrations applied to database

### 4. Test Core Features
- ✅ Landing page loads
- ✅ Signup works
- ✅ Login works
- ✅ Dashboard displays after login
- ✅ Protected routes redirect to login when not authenticated
- ✅ Start fast functionality works
- ✅ Weight tracking works
- ✅ Achievements display
- ✅ Profile management works
- ✅ Logout works

### 5. Test on Different Devices
- ✅ Desktop browser
- ✅ Mobile browser
- ✅ Tablet browser

---

## 🐛 Troubleshooting

### Issue: "Invalid Redirect URL" Error
**Solution**: Add your Vercel URL to Supabase redirect URLs

### Issue: "Missing Environment Variables"
**Solution**: 
1. Check Vercel dashboard → Settings → Environment Variables
2. Ensure both `NEXT_PUBLIC_` variables are set
3. Redeploy after adding variables

### Issue: Auth Keeps Redirecting to Login
**Solution**:
1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Check Supabase redirect URLs include your domain
4. Clear browser cookies and try again

### Issue: Database Tables Don't Exist
**Solution**: Run all migrations in Supabase SQL Editor in order

### Issue: 404 on Some Routes
**Solution**: 
1. Verify all page.tsx files exist
2. Check Vercel deployment logs
3. Ensure Next.js 16 app router structure is correct

---

## 📊 Package.json Scripts

Current scripts (verified ✅):
```json
{
  "dev": "next dev",           // Local development
  "build": "next build",       // Production build
  "start": "next start",       // Start production server
  "lint": "eslint"            // Code linting
}
```

All scripts are correct for Vercel deployment.

---

## 🔒 Security Checklist

- [x] `.env` files in `.gitignore`
- [x] No secrets committed to repository
- [x] Only `NEXT_PUBLIC_` variables used for browser access
- [x] Supabase anon key used (not service role key)
- [x] RLS (Row Level Security) enabled on Supabase tables
- [x] Auth checks on all protected routes

---

## 📝 Notes

### Auth Implementation
- No middleware.ts used
- Client-side auth protection via `ProtectedRoute` wrapper
- Uses `@supabase/ssr` for Next.js 16 compatibility
- Supabase client created per request

### Build Configuration
- Next.js 16.2.9 with Turbopack
- TypeScript strict mode enabled
- Static page generation where possible
- All 13 routes pre-rendered successfully

### Database
- PostgreSQL via Supabase
- 3 migrations applied
- RLS policies configured
- Triggers for profile creation on signup

---

## 🎯 Next Steps After Deployment

1. **Set up custom domain** (optional)
   - Add domain in Vercel
   - Update DNS records
   - Add custom domain to Supabase redirect URLs

2. **Enable analytics** (optional)
   - Vercel Analytics
   - Vercel Speed Insights

3. **Set up monitoring** (optional)
   - Error tracking (Sentry, etc.)
   - Performance monitoring

4. **Configure CORS** (if needed)
   - Supabase CORS settings
   - Check if any API calls need special headers

---

## 🆘 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Supabase configuration
4. Test locally with production environment variables

**Deployment Status**: Ready ✅
**Last Updated**: 2026-06-20
