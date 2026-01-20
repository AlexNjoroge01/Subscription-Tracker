# Subscription Tracker App - Build Plan

## Tech Stack
- **Frontend**: Next.js 16.1.4 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js v5
- **Validation**: Zod
- **Icons**: Lucide React
- **Charts**: Recharts
-**toasts notifications**: Sonner
-**components**: shadcn


---

## Phase 1: Project Setup & Foundation
**Goal**: Get the development environment ready

### Step 1.1: Initialize Project
- [ ] Create Next.js project with TypeScript
- [ ] Install dependencies (Prisma, NextAuth, Zod, Tailwind, Lucide, Recharts, Sonner, shadcn)
- [ ] Configure `tsconfig.json` and `next.config.js`
- [ ] Setup `.env` file structure

### Step 1.2: Database Setup
- [ ] Initialize Prisma
- [ ] Create PostgreSQL database
- [ ] Design database schema (see Schema section below)
- [ ] Run initial migration
- [ ] Setup Prisma Client

### Step 1.3: Authentication Setup
- [ ] Configure NextAuth.js v5
- [ ] Setup providers (email/password, google)
- [ ] Create auth pages (login, register)
- [ ] Implement middleware for protected routes
- [ ] Create user session handling

### Step 1.4: Project Structure
- [ ] Setup folder structure:
  ```
  /app
    /(auth)
    /(dashboard)
    /api
  /components
    /ui (shadcn/ui components)
    /dashboard
    /subscriptions
  /lib
    /prisma
    /auth
    /utils
  /types
  /schemas (Zod)
  ```

---

## Phase 2: Core Data Models & API
**Goal**: Build the backend foundation

### Step 2.1: Database Schema
- [ ] User model (id, name, email, password, createdAt)
- [ ] Subscription model (id, userId, name, amount, currency, nextBillingDate, billingCycle, status, categoryId, familyMember, logo, notes)
- [ ] Category model (id, userId, name, color, budgetLimit, icon)
- [ ] Notification model (id, userId, subscriptionId, type, read, createdAt)
- [ ] Run migrations

### Step 2.2: Zod Validation Schemas
- [ ] Create subscription validation schema
- [ ] Create category validation schema
- [ ] Create user preferences schema
- [ ] Create notification schema

### Step 2.3: API Routes - Subscriptions
- [ ] `POST /api/subscriptions` - Create subscription
- [ ] `GET /api/subscriptions` - List with filters/search
- [ ] `GET /api/subscriptions/[id]` - Get single subscription
- [ ] `PATCH /api/subscriptions/[id]` - Update subscription
- [ ] `DELETE /api/subscriptions/[id]` - Delete subscription
- [ ] Add proper error handling and validation

### Step 2.4: API Routes - Categories
- [ ] `POST /api/categories` - Create category
- [ ] `GET /api/categories` - List all user categories
- [ ] `PATCH /api/categories/[id]` - Update category
- [ ] `DELETE /api/categories/[id]` - Delete category

### Step 2.5: API Routes - Analytics
- [ ] `GET /api/analytics/overview` - Dashboard metrics
- [ ] `GET /api/analytics/spending-trend` - Monthly spending data
- [ ] `GET /api/analytics/category-breakdown` - Category distribution
- [ ] `GET /api/analytics/insights` - Optimization suggestions

### Step 2.6: API Routes - Notifications
- [ ] `GET /api/notifications` - List notifications
- [ ] `PATCH /api/notifications/[id]/read` - Mark as read
- [ ] `PATCH /api/notifications/mark-all-read` - Mark all as read

---

## Phase 3: UI Components (Reusable)
**Goal**: Build the component library

### Step 3.1: Base UI Components
- [ ] Button (variants: primary, secondary, ghost, danger)
- [ ] Input (text, number, date, select)
- [ ] Card
- [ ] Badge (status colors)
- [ ] Table (with sorting, density options)
- [ ] Modal/Dialog
- [ ] Dropdown Menu
- [ ] Progress Bar
- [ ] Tabs
- [ ] Toast notifications
- [ ] Loading states/skeletons

### Step 3.2: Form Components
-     React hook forms
- [ ] Form wrapper with validation
- [ ] Currency input
- [ ] Date picker
- [ ] Category selector (with color picker)
- [ ] Billing cycle selector (Monthly/Annual/Custom)
- [ ] Status selector

### Step 3.3: Chart Components
- [ ] Line chart wrapper (spending trend)
- [ ] Pie/Donut chart (category breakdown)
- [ ] Bar chart (top services)
- [ ] Configure Recharts with theme

---

## Phase 4: MVP Features (Priority 1-3)
**Goal**: Build core user-facing features

### Step 4.1: Manual Subscription Entry
- [ ] Create "Add Subscription" modal/form
- [ ] Fields: Name, Amount, Currency, Next Billing Date, Billing Cycle, Category, Family Member (optional), Logo URL (optional), Notes
- [ ] Form validation with Zod
- [ ] Submit handler with API integration
- [ ] Success/error feedback
- [ ] Edit subscription modal (reuse form)

### Step 4.2: Subscriptions List Screen
- [ ] Table layout with columns (checkbox, service, family member, category, amount, next billing, status, actions)
- [ ] Search bar implementation
- [ ] Filter chips (Overdue, Today, Upcoming, This Week, This Month)
- [ ] Status badges (Active, Overdue, Cancelled, Scheduled)
- [ ] "Days until" badge for next billing
- [ ] Actions menu (Edit, Cancel, Delete, View Details)
- [ ] Empty state
- [ ] Loading state

### Step 4.3: Table Functionality
- [ ] Sorting by columns
- [ ] Bulk selection with checkboxes
- [ ] Bulk actions (Export, Delete)
- [ ] Column visibility toggle
- [ ] Density toggle (Compact, Comfortable, Spacious)
- [ ] Pagination or infinite scroll
- [ ] Export to CSV
- [ ] Export to PDF

### Step 4.4: Dashboard Overview Screen
- [ ] Welcome message with user name
- [ ] Monthly spending total card
- [ ] % change vs last month (with trend indicator)
- [ ] Active subscriptions count
- [ ] Top category card (name + spend)
- [ ] Next renewal countdown
- [ ] Monthly budget progress bar (amount/budget, % used)
- [ ] Budget status message ("Well within budget" / "Approaching limit" / "Over budget")
- [ ] Yearly projection card
- [ ] "Subscriptions Need Review" alert card
- [ ] Upcoming renewals list (next 5-7 days)

### Step 4.5: Categories Management
- [ ] Categories list view
- [ ] Category card showing: name, icon, color, # of subs, spent this month, budget limit
- [ ] Progress bar (utilization %)
- [ ] Status indicator (On track / Over budget)
- [ ] Add category button + modal
- [ ] Edit category functionality
- [ ] Delete category (with warning if subscriptions exist)
- [ ] Summary: Total categories, total monthly budget, overall utilization

### Step 4.6: Basic Notifications
- [ ] Notification list page
- [ ] Tabs: Upcoming, Recent, All
- [ ] Notification items (subscription name, type, date, read status)
- [ ] Mark as read functionality
- [ ] Mark all as read
- [ ] Filter by type

---

## Phase 5: Analytics & Insights
**Goal**: Add value through data visualization

### Step 5.1: Analytics Page Layout
- [ ] Time period filters (3m, 6m, 12m)
- [ ] Export report button
- [ ] Key metrics cards row (Monthly total, Yearly projection, Active subs, Avg cost per sub)

### Step 5.2: Analytics Charts
- [ ] Spending trend chart (line/area over time)
- [ ] Trend indicator (up/down vs last period)
- [ ] Category breakdown pie chart
- [ ] Top expensive services bar chart
- [ ] Billing cycle distribution (Monthly vs Annual %)

### Step 5.3: Insights & Recommendations
- [ ] Calculate insights (high-cost services, category spending concentration)
- [ ] Cost alerts card ("X is Y% of total")
- [ ] Category warnings ("Entertainment is 37% - consider consolidating")
- [ ] Savings suggestions ("Switch to annual for X% discount")
- [ ] Display insights dynamically based on user data

---

## Phase 6: Optimization Features
**Goal**: Help users save money

### Step 6.1: Potential Savings Detection
- [ ] Algorithm to detect duplicate categories (multiple streaming, cloud storage, etc.)
- [ ] Calculate potential savings
- [ ] "Potential Savings Detected" banner with total yearly savings

### Step 6.2: Optimization Cards
- [ ] Multiple Streaming Services card (severity: high)
- [ ] Multiple Cloud Storage card
- [ ] Multiple Productivity Tools card
- [ ] High spending in category card
- [ ] Each card shows: issue, severity, total cost, affected subscriptions count
- [ ] "View subscriptions" action
- [ ] Dismiss functionality (individual + all)

---

## Phase 7: Notifications & Alerts System
**Goal**: Keep users informed

### Step 7.1: Notification Generation
- [ ] Background job/cron to check upcoming renewals
- [ ] Create notifications for: 7 days before, 3 days before, 1 day before
- [ ] Create overdue notifications
- [ ] Create budget limit warnings

### Step 7.2: Email Notifications (Optional for MVP)
- [ ] Setup email service (Resend, SendGrid, etc.)
- [ ] Daily digest email template
- [ ] Renewal reminder email template
- [ ] Send emails based on user preferences

### Step 7.3: Notification Preferences
- [ ] Settings page for notification preferences
- [ ] Toggle email notifications
- [ ] Toggle push notifications (if implementing)
- [ ] Choose alert timing (7/3/1 days before)

---

## Phase 8: Advanced Features & Polish
**Goal**: Enhance user experience

### Step 8.1: Subscription Calendar View
- [ ] Calendar component
- [ ] Display subscriptions on billing dates
- [ ] Color-code by category
- [ ] Click to view/edit subscription
- [ ] Monthly navigation

### Step 8.2: Views Toggle
- [ ] Calendar view implementation
- [ ] Monthly view (group by month)
- [ ] Annual view (group by year)
- [ ] List/Table view (existing)

### Step 8.3: Budget Settings
- [ ] Global monthly budget setting
- [ ] Per-category budget limits
- [ ] Budget alerts configuration
- [ ] Budget history tracking

### Step 8.4: User Profile & Settings
- [ ] Profile page (name, email, currency preference)
- [ ] Default currency setting
- [ ] Theme toggle (light/dark)
- [ ] Export all data button
- [ ] Delete account option

### Step 8.5: Data Export
- [ ] Export all subscriptions to CSV
- [ ] Export analytics report to PDF
- [ ] Export by date range
- [ ] Export by category

---

## Phase 9: Testing & Optimization
**Goal**: Ensure quality and performance

### Step 9.2: Performance Optimization
- [ ] Optimize database queries (indexes)
- [ ] Implement caching where appropriate
- [ ] Optimize images (logos)
- [ ] Code splitting
- [ ] Lazy loading components

### Step 9.3: Error Handling & Edge Cases
- [ ] Global error boundary
- [ ] API error handling consistency
- [ ] Empty states for all lists
- [ ] Loading states for all async operations
- [ ] Form validation edge cases
- [ ] Handle timezone issues

### Step 9.4: Accessibility
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] ARIA labels
- [ ] Color contrast checks
- [ ] Focus management

---

## Database Schema Reference

```prisma
model User {
  id            String         @id @default(cuid())
  name          String?
  email         String         @unique
  emailVerified DateTime?
  password      String
  image         String?
  currency      String         @default("KES")
  monthlyBudget Float?
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  
  subscriptions Subscription[]
  categories    Category[]
  notifications Notification[]
}

model Category {
  id          String         @id @default(cuid())
  userId      String
  name        String
  color       String         @default("#3b82f6")
  icon        String?
  budgetLimit Float?
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  subscriptions Subscription[]
  
  @@unique([userId, name])
}

model Subscription {
  id              String   @id @default(cuid())
  userId          String
  name            String
  amount          Float
  currency        String   @default("KES")
  billingCycle    String   // "monthly", "annual", "custom"
  customDays      Int?     // for custom billing cycles
  nextBillingDate DateTime
  status          String   @default("active") // "active", "cancelled", "overdue", "scheduled"
  categoryId      String?
  familyMember    String?
  logo            String?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user          User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  category      Category?      @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  notifications Notification[]
}

model Notification {
  id             String       @id @default(cuid())
  userId         String
  subscriptionId String?
  type           String       // "renewal_reminder", "overdue", "budget_warning", "digest"
  message        String
  read           Boolean      @default(false)
  createdAt      DateTime     @default(now())
  
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  subscription Subscription? @relation(fields: [subscriptionId], references: [id], onDelete: Cascade)
}
```

---

## MVP Priority Checklist (Build This First)

### Week 1: Foundation
- [ ] Project setup (Step 1.1-1.4)
- [ ] Database schema & migrations (Step 2.1)
- [ ] Authentication (Step 1.3)
- [ ] Basic API routes for subscriptions (Step 2.3)

### Week 2: Core Features
- [ ] Add/Edit subscription form (Step 4.1)
- [ ] Subscriptions list with filters (Step 4.2-4.3)
- [ ] Basic UI components (Step 3.1-3.2)
- [ ] Categories API & management (Step 2.4, 4.5)

### Week 3: Dashboard & Analytics
- [ ] Dashboard overview (Step 4.4)
- [ ] Analytics API (Step 2.5)
- [ ] Basic charts (Step 3.3, 5.2)
- [ ] Notifications list (Step 4.6)

### Week 4: Polish & Launch
- [ ] Insights & optimization cards (Step 6.1-6.2)
- [ ] Export functionality (Step 4.3)
- [ ] Testing & bug fixes (Step 9.1, 9.3)
- [ ] Deploy to production (Step 10.1-10.2)

---

## Notes
- Start with manual entry only (no bank connections for MVP)
- Kenya-first: Default currency KES, consider M-Pesa subscriptions
- Focus on privacy: All data stays in your database
- Mobile-responsive from day 1
- Use incremental builds: ship features as they're ready

## Success Metrics
- Time to add first subscription: < 30 seconds
- Dashboard load time: < 1 second
- User can identify savings opportunity within first session
- Mobile experience matches desktop

