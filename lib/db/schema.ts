import {
  pgTable,
  pgEnum,
  text,
  boolean,
  timestamp,
  doublePrecision,
  integer,
  jsonb,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Enums ────────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum('user_role', ['USER', 'SUPERUSER'])

// ─── Tables ───────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: timestamp('email_verified'),
  password: text('password'),
  image: text('image'),
  currency: text('currency').notNull().default('KES'),
  monthlyBudget: doublePrecision('monthly_budget'),
  role: userRoleEnum('role').notNull().default('USER'),
  planId: text('plan_id').default('starter-plan'),
  trialEndsAt: timestamp('trial_ends_at'),
  planEndsAt: timestamp('plan_ends_at'),
  emailNotificationsEnabled: boolean('email_notifications_enabled').notNull().default(true),
  notifySevenDays: boolean('notify_seven_days').notNull().default(true),
  notifyThreeDays: boolean('notify_three_days').notNull().default(true),
  notifyOneDay: boolean('notify_one_day').notNull().default(true),
  notifyOverdue: boolean('notify_overdue').notNull().default(true),
  notifyBudgetWarning: boolean('notify_budget_warning').notNull().default(true),
  dailyDigestEnabled: boolean('daily_digest_enabled').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const paymentPlans = pgTable('payment_plans', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  price: doublePrecision('price').notNull(),
  currency: text('currency').notNull().default('USD'),
  interval: text('interval').notNull().default('monthly'),
  features: text('features').array().notNull().default([]),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const categories = pgTable(
  'categories',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull(),
    name: text('name').notNull(),
    color: text('color').notNull().default('#3b82f6'),
    icon: text('icon'),
    budgetLimit: doublePrecision('budget_limit'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [uniqueIndex('categories_user_name_idx').on(table.userId, table.name)],
)

export const subscriptions = pgTable('subscriptions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  name: text('name').notNull(),
  amount: doublePrecision('amount').notNull(),
  currency: text('currency').notNull().default('KES'),
  billingCycle: text('billing_cycle').notNull(),
  customDays: integer('custom_days'),
  nextBillingDate: timestamp('next_billing_date').notNull(),
  status: text('status').notNull().default('active'),
  categoryId: text('category_id'),
  familyMember: text('family_member'),
  logo: text('logo'),
  notes: text('notes'),
  notificationsSent: jsonb('notifications_sent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const notifications = pgTable('notifications', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull(),
  subscriptionId: text('subscription_id'),
  type: text('type').notNull(),
  message: text('message').notNull(),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const payments = pgTable(
  'payments',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull(),
    planId: text('plan_id').notNull(),
    amount: doublePrecision('amount').notNull(),
    currency: text('currency').notNull().default('KES'),
    status: text('status').notNull().default('pending'),
    provider: text('provider').notNull().default('paystack'),
    providerRef: text('provider_ref').unique(),
    providerId: text('provider_id'),
    paidAt: timestamp('paid_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index('payments_user_id_idx').on(table.userId),
    index('payments_provider_ref_idx').on(table.providerRef),
  ],
)

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text('user_id').notNull(),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull(),
    used: boolean('used').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('password_reset_tokens_token_idx').on(table.token),
    index('password_reset_tokens_user_id_idx').on(table.userId),
  ],
)

// ─── Relations ────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  plan: one(paymentPlans, { fields: [users.planId], references: [paymentPlans.id] }),
  subscriptions: many(subscriptions),
  categories: many(categories),
  notifications: many(notifications),
  payments: many(payments),
  passwordResetTokens: many(passwordResetTokens),
}))

export const paymentPlansRelations = relations(paymentPlans, ({ many }) => ({
  users: many(users),
  payments: many(payments),
}))

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  user: one(users, { fields: [categories.userId], references: [users.id] }),
  subscriptions: many(subscriptions),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  category: one(categories, {
    fields: [subscriptions.categoryId],
    references: [categories.id],
  }),
  notifications: many(notifications),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
  subscription: one(subscriptions, {
    fields: [notifications.subscriptionId],
    references: [subscriptions.id],
  }),
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  plan: one(paymentPlans, { fields: [payments.planId], references: [paymentPlans.id] }),
}))

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, {
    fields: [passwordResetTokens.userId],
    references: [users.id],
  }),
}))

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert
export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert
export type Payment = typeof payments.$inferSelect
export type NewPayment = typeof payments.$inferInsert
export type PaymentPlan = typeof paymentPlans.$inferSelect
export type NewPaymentPlan = typeof paymentPlans.$inferInsert
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect
