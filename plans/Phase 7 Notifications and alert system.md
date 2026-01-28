Phase 7: Notifications & Alerts System
Implementation plan for adding email notifications via Resend and notification alerts for 7/3/1 days before subscription renewals.

User Review Required
IMPORTANT

Resend API Key Required: You'll need to sign up for Resend (https://resend.com) and obtain an API key. The free tier allows 100 emails/day which should be sufficient for testing.

IMPORTANT

Cron Job Execution: This implementation uses a Next.js API route that should be called daily by an external cron service (like Vercel Cron, GitHub Actions, or cron-job.org). You'll need to configure this after deployment.

WARNING

Database Migration: This will add new fields to the User model for notification preferences. Existing users will have default preferences (all notifications enabled).

Proposed Changes
Database Schema
[MODIFY] 
schema.prisma
Add notification preference fields to the User model:

emailNotificationsEnabled (Boolean, default: true)
notifySevenDays (Boolean, default: true)
notifyThreeDays (Boolean, default: true)
notifyOneDay (Boolean, default: true)
notifyOverdue (Boolean, default: true)
notifyBudgetWarning (Boolean, default: true)
dailyDigestEnabled (Boolean, default: false)
Email Service Integration
[NEW] 
resend.ts
Email service wrapper for Resend API:

Initialize Resend client with API key
Export sendEmail function for sending emails
Handle errors and logging
[NEW] 
templates.tsx
React email templates:

RenewalReminderEmail component - for 7/3/1 day reminders
OverdueNotificationEmail component - for overdue subscriptions
DailyDigestEmail component - for daily summary
BudgetWarningEmail component - for budget limit warnings
All templates styled with inline CSS for email compatibility
[NEW] 
email-service.ts
High-level email sending functions:

sendRenewalReminder(user, subscription, daysUntil)
sendOverdueNotification(user, subscription)
sendDailyDigest(user, subscriptions)
sendBudgetWarning(user, category, spending)
Each function checks user preferences before sending
Notification Generation
[NEW] 
notification-generator.ts
Core notification generation logic:

generateRenewalNotifications() - checks subscriptions and creates notifications for 7/3/1 days before
generateOverdueNotifications() - creates notifications for overdue subscriptions
generateBudgetWarnings() - checks category budgets and creates warnings
Each function creates both in-app notifications and sends emails based on user preferences
[NEW] 
route.ts
Cron job endpoint:

Protected by secret token for security
Calls notification generator functions
Returns summary of notifications created and emails sent
Should be called daily by external cron service
User Settings
[NEW] 
page.tsx
Settings page UI:

Section for email notification preferences
Toggle for enabling/disabling email notifications
Checkboxes for each alert timing (7/3/1 days, overdue, budget warnings)
Toggle for daily digest email
Save button with loading state
Success/error toast notifications
[NEW] 
route.ts
API endpoint for updating notification preferences:

GET - fetch current user preferences
PATCH - update user preferences
Validates input with Zod schema
Returns updated preferences
[NEW] 
preferences-schema.ts
Zod validation schema for notification preferences:

Validates all boolean preference fields
Used by API endpoint and settings form
Supporting Files
[MODIFY] 
layout.tsx
Add "Settings" link to dashboard navigation sidebar.

Verification Plan
Automated Tests
Database Migration:

npx prisma migrate dev --name add_notification_preferences
npx prisma generate
Test Cron Job Manually:

# Set CRON_SECRET in .env
# Call the endpoint with curl or Postman
curl -X POST http://localhost:3000/api/cron/notifications \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
Verify Email Sending:

Create test subscriptions with billing dates 7, 3, and 1 days in the future
Run cron job
Check Resend dashboard for sent emails
Manual Verification
Settings Page:

Navigate to /settings
Toggle preferences on/off
Save and verify changes persist
Verify UI updates correctly
Notification Generation:

Create subscriptions with various billing dates
Run cron job
Verify in-app notifications are created
Verify emails are sent based on preferences
Preference Filtering:

Disable specific notification types in settings
Run cron job
Verify those notification types are not created/sent