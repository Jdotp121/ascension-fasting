# Store Release Checklist

This document contains important information for submitting Ascension Fasting to the iOS App Store and Google Play Store.

## App Information

### App Identity
- **App Name:** Ascension Fasting
- **Subtitle/Short Description:** Track your fasting journey, monitor weight, and achieve your wellness goals
- **Bundle ID (iOS):** `com.ascension.fasting` *(placeholder - update with your actual bundle ID)*
- **Package Name (Android):** `com.ascension.fasting` *(placeholder - update with your actual package name)*
- **Version:** 1.0.0
- **Build Number:** 1

### App Category
- **Primary Category:** Health & Fitness
- **Secondary Category:** Lifestyle

### Age Rating
- **Minimum Age:** 18+ (fasting is not recommended for users under 18)
- **Content Rating:** Everyone (no objectionable content)

## Required URLs

### Legal & Support
✅ **Privacy Policy:** `https://yourdomain.com/privacy`
✅ **Terms of Service:** `https://yourdomain.com/terms`
✅ **Support URL:** `https://yourdomain.com/support`
✅ **Marketing URL:** `https://yourdomain.com`

### Account Management
✅ **Delete Account:** `https://yourdomain.com/delete-account`
- Users can delete their account in-app: Profile > Account Actions > Delete Account
- Alternative: Users can request deletion via support@ascensionfasting.com

## Contact Information

- **Support Email:** support@ascensionfasting.com
- **Privacy Email:** privacy@ascensionfasting.com
- **Legal Email:** legal@ascensionfasting.com
- **Feedback Email:** feedback@ascensionfasting.com

## Demo/Test Account

For App Store/Play Store reviewers:

- **Email:** demo@ascensionfasting.com *(create this test account before submission)*
- **Password:** DemoPass2026! *(or your secure demo password)*
- **Notes:** Account has sample fasting data, weight entries, and achievements unlocked

## Data Collection & Privacy

### Data We Collect
1. **Account Data:**
   - Email address (required for authentication)
   
2. **Profile Information (optional):**
   - Age
   - Sex
   - Height
   - Current weight
   - Goal weight
   - Main goal (weight loss, health, discipline, etc.)

3. **Tracking Data:**
   - Fasting history (type, duration, timestamps)
   - Weight entries (weight, date)
   - Achievement progress

4. **Usage Data:**
   - Device information
   - App usage patterns
   - Error logs (for debugging)

### Data We DO NOT Collect
- ❌ No location data
- ❌ No contacts access
- ❌ No camera/photo access (unless user explicitly selects photos)
- ❌ No health data integration (HealthKit/Google Fit) in v1.0
- ❌ No advertising identifiers
- ❌ No third-party analytics tracking

### Data Storage & Security
- **Provider:** Supabase (PostgreSQL database with row-level security)
- **Encryption:** All data encrypted in transit (HTTPS/TLS) and at rest
- **Authentication:** Email-based authentication via Supabase Auth
- **Data Retention:** Active for account lifetime; deleted within 30 days of account deletion

### Third-Party Services
1. **Supabase** - Database, authentication, and backend services
   - Purpose: Data storage and user authentication
   - Data shared: All user data listed above
   - Link: https://supabase.com

## Health Disclaimer

**IMPORTANT:** This is a wellness tracking app, not a medical device.

The following health disclaimer is prominently displayed:
- ✅ On the onboarding page
- ✅ When starting a fast
- ✅ In the footer of public pages
- ✅ In Terms of Service

**Disclaimer Text:**
> "Ascension Fasting is for general wellness tracking only and does not provide medical advice, diagnosis, or treatment. Speak to a qualified health professional before fasting, especially if you have a medical condition, are pregnant, under 18, or taking medication."

## Features Checklist

### Core Features
- ✅ Fasting tracking (water, juice, intermittent fasting)
- ✅ Real-time fast timer with progress indicators
- ✅ Weight tracking with chart visualization
- ✅ Achievement system with milestone tracking
- ✅ Fasting history and statistics
- ✅ User profile management
- ✅ Account deletion flow

### Store Requirements
- ✅ Privacy Policy page (public access)
- ✅ Terms of Service page (public access)
- ✅ Support page with FAQs (public access)
- ✅ Account deletion page (accessible when logged in)
- ✅ Health disclaimers in appropriate locations
- ✅ No crashes or critical bugs
- ✅ Responsive design for all screen sizes
- ✅ Loading states for all async operations
- ✅ Error handling with user-friendly messages
- ✅ Safe area support for notched devices

## Screenshots Needed

### iOS App Store
**iPhone (6.7" required, 6.5" required)**
- Screenshot 1: Dashboard with active fast timer
- Screenshot 2: Fast selection screen
- Screenshot 3: Weight tracking with chart
- Screenshot 4: Achievements page
- Screenshot 5: Profile/settings

**iPad (12.9" required, 11" recommended)**
- 2-3 screenshots showing iPad layout

### Google Play Store
**Phone (minimum 2 screenshots)**
- Screenshot 1: Dashboard with active fast timer
- Screenshot 2: Fast selection screen
- Screenshot 3: Weight tracking with chart
- Screenshot 4: Achievements page

**Tablet (optional but recommended)**
- 1-2 screenshots showing tablet layout

### Screenshot Guidelines
- Use real data (not Lorem Ipsum)
- Show the app in actual use cases
- Ensure text is readable
- Follow platform guidelines for safe areas
- Consider adding text overlays highlighting features (optional)

## App Description

### Short Description (80 characters)
"Track fasting, monitor weight, and achieve wellness goals"

### Full Description

**Ascension Fasting** helps you track your fasting journey, monitor your weight progress, and achieve your health and wellness goals.

**KEY FEATURES:**

🕐 **Fasting Tracker**
- Track water fasts, juice fasts, and intermittent fasting
- Real-time timer with progress indicators
- See your body's fasting stages (fat burning, ketosis, autophagy)
- Complete fasting history

⚖️ **Weight Tracking**
- Log your daily weight
- Visualize progress with interactive charts
- Track towards your goal weight
- See trends over time

🏆 **Achievements**
- Unlock achievements as you progress
- Track milestone fasts (12h, 24h, 48h, 72h+)
- Celebrate your consistency and dedication
- View your longest fasts

📊 **Progress Analytics**
- Dashboard with key statistics
- Fasting streaks and patterns
- Weight loss trends
- Achievement progress

**WELLNESS FOCUSED**
Ascension Fasting is designed for general wellness tracking and does not provide medical advice. Always consult with a healthcare professional before starting any fasting program.

**YOUR PRIVACY MATTERS**
- Secure data storage with encryption
- No data selling to third parties
- Easy account deletion
- Full transparency in our privacy policy

Start your fasting journey today with Ascension Fasting!

### Keywords (iOS - 100 characters max)
fasting,intermittent fasting,weight loss,health,wellness,tracker,diet,autophagy,ketosis,weight tracker

### Keywords (Android - separate by commas)
fasting, intermittent fasting, weight loss, health tracker, wellness, diet, fasting timer, weight tracker, autophagy, ketosis, health app, fitness

## Reviewer Notes

### For iOS App Review
```
Thank you for reviewing Ascension Fasting!

DEMO ACCOUNT:
Email: demo@ascensionfasting.com
Password: DemoPass2026!

TESTING INSTRUCTIONS:
1. Log in with the demo account (or create a new account)
2. On the Fast page, select a fast type (e.g., Intermittent Fasting)
3. Set a duration and start the fast - the timer will begin
4. You can end the fast early or let it run
5. Visit the Weight page to log a weight entry
6. Check the Achievements page to see unlocked achievements
7. Visit Profile > Account Actions > Delete Account to see the account deletion flow

NOTES:
- All user data is stored securely in Supabase (PostgreSQL)
- Account deletion removes all user data within 30 days
- Health disclaimers are shown on onboarding and fast start screens
- The app requires email authentication (via Supabase Auth)
- No third-party analytics or ad tracking

PRIVACY & LEGAL:
- Privacy Policy: /privacy
- Terms of Service: /terms
- Support: /support
- Delete Account: /delete-account

If you have any questions, please contact support@ascensionfasting.com
```

### For Google Play Review
Similar to iOS notes above, adapted for Play Store format.

## Pre-Submission Checklist

### Technical
- [ ] App builds without errors
- [ ] No console errors in production
- [ ] All API keys are set in environment variables
- [ ] Supabase connection is configured correctly
- [ ] Email verification is working
- [ ] All routes are accessible
- [ ] App works on various screen sizes (320px to 1920px+)
- [ ] Safe area padding for notched devices
- [ ] Proper loading states everywhere
- [ ] Error handling for all async operations
- [ ] Forms have proper validation

### Content
- [ ] Privacy Policy is complete and accurate
- [ ] Terms of Service is complete and accurate
- [ ] Support page has helpful FAQs
- [ ] Health disclaimers are prominent
- [ ] All placeholder text is removed
- [ ] App name and branding is consistent
- [ ] Screenshots are high quality and representative

### Testing
- [ ] Test with demo account
- [ ] Test account creation flow
- [ ] Test password reset flow
- [ ] Test starting and ending fasts
- [ ] Test weight entry creation
- [ ] Test achievement unlocking
- [ ] Test profile updates
- [ ] Test account deletion flow
- [ ] Test on small screens (iPhone SE, small Android)
- [ ] Test on large screens (iPad, Android tablets)
- [ ] Test on notched devices (iPhone X+)
- [ ] Test all navigation flows

### Compliance
- [ ] Age gate/restriction (18+) is configured
- [ ] Health disclaimer is shown in all required locations
- [ ] Privacy policy link is accessible from signup/login
- [ ] Terms of service link is accessible from signup/login
- [ ] Account deletion is accessible and functional
- [ ] Data export option (if required by GDPR)
- [ ] Proper attribution for any third-party libraries
- [ ] No copyright violations in content or images

### Store Listings
- [ ] App name is available
- [ ] Bundle/Package ID is registered
- [ ] App icon is created (1024x1024 for iOS, various for Android)
- [ ] Screenshots are prepared (all required sizes)
- [ ] App description is written
- [ ] Keywords are selected
- [ ] Support URL is live and working
- [ ] Privacy policy URL is live and working
- [ ] Marketing URL is live (if applicable)
- [ ] Demo account is created and tested
- [ ] Reviewer notes are prepared

## Post-Submission

### Monitor
- Watch for reviewer questions/rejections
- Check crash reports daily
- Monitor support email
- Track user feedback

### Iterate
- Respond to user feedback
- Fix any reported bugs
- Plan feature updates
- Improve based on analytics (if added)

## Future Enhancements (Post-Launch)

- HealthKit/Google Fit integration
- Social features (friends, challenges)
- Custom fast types
- Notifications and reminders
- Offline mode
- Data export (CSV/PDF)
- Dark mode
- Multi-language support
- Apple Watch / Wear OS companion app

---

**Last Updated:** June 26, 2026
**Version:** 1.0.0
**Prepared by:** Development Team
