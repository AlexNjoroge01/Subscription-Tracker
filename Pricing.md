Implementation Complete ✅
Plan Limits Implementation
1. Database Updates (prisma/schema.prisma):

Added planId, trialEndsAt, and planEndsAt fields to User model
Added relation between User and PaymentPlan
2. Plan Limits Service (lib/plan-limits.ts):

PLAN_LIMITS configuration for each plan:
Starter: 20 subscriptions, 5 categories
Pro: Unlimited subscriptions, unlimited categories
Premium: Unlimited everything + family sharing, API access
canAddSubscription() - Check if user can add more subscriptions
canAddCategory() - Check if user can add more categories
startTrial() - Start 14-day trial for new users
upgradeUserPlan() - Upgrade user to a new plan
3. API Updates:

app/api/subscriptions/route.ts - Checks subscription limits before creating
app/api/categories/route.ts - Checks category limits before creating
app/api/auth/register/route.ts - Starts 14-day trial for new users
app/api/payments/verify/route.ts - Upgrades user plan on successful payment
4. How It Works:

New users get a 14-day free trial on the Starter plan
Starter users can add up to 20 subscriptions and 5 categories
When limits are reached, API returns 403 error with upgrade message
On successful payment, user's plan is upgraded and limits are lifted
To Apply Changes:
The dev server needs to be restarted to pick up the new Prisma client. Run:

# Stop the current dev server, then:
pnpm dev
Then re-seed the payment plans:

curl -X POST http://localhost:3000/api/payments/seed