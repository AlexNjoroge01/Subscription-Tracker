/**
 * Plan Limits Service
 * Manages subscription and category limits based on user's plan
 */

import { db } from './db'
import { users, subscriptions, categories } from './db/schema'
import { eq, and, inArray, count as drizzleCount } from 'drizzle-orm'
import { addDays } from 'date-fns'

// Plan limits configuration
export const PLAN_LIMITS = {
  'starter-plan': {
    name: 'Starter',
    maxSubscriptions: 5,
    maxCategories: 3,
    features: [
      'basic_analytics',
      'email_reminders',
      'budget_tracking',
      'csv_export',
    ],
  },
  'pro-plan': {
    name: 'Pro',
    maxSubscriptions: Infinity,
    maxCategories: Infinity,
    features: [
      'basic_analytics',
      'advanced_analytics',
      'optimize_insights',
      'email_reminders',
      'in_app_notifications',
      'budget_tracking',
      'csv_export',
      'custom_billing_cycles',
      'daily_digest',
      'priority_support',
    ],
  },
  'premium-plan': {
    name: 'Premium',
    maxSubscriptions: Infinity,
    maxCategories: Infinity,
    features: [
      'basic_analytics',
      'advanced_analytics',
      'optimize_insights',
      'email_reminders',
      'in_app_notifications',
      'budget_tracking',
      'csv_export',
      'custom_billing_cycles',
      'daily_digest',
      'priority_support',
      'family_sharing',
      'advanced_reports',
      'data_backup',
      'api_access',
      'custom_integrations',
    ],
  },
} as const

export type PlanId = keyof typeof PLAN_LIMITS

export interface PlanLimits {
  maxSubscriptions: number
  maxCategories: number
  features: readonly string[]
  name: string
}

/**
 * Get the plan limits for a user
 */
export async function getUserPlanLimits(userId: string): Promise<PlanLimits> {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (!user) {
    throw new Error('User not found')
  }

  const planId = (user.planId as PlanId) || 'starter-plan'
  const limits = PLAN_LIMITS[planId]

  // Check if plan has expired
  const isPlanExpired = user.planEndsAt && new Date() > user.planEndsAt

  // If plan expired, return starter limits
  if (isPlanExpired && planId !== 'starter-plan') {
    return PLAN_LIMITS['starter-plan']
  }

  return limits
}

/**
 * Check if user can add more subscriptions
 */
export async function canAddSubscription(userId: string): Promise<{ allowed: boolean; current: number; max: number | string }> {
  const [limits, countResult] = await Promise.all([
    getUserPlanLimits(userId),
    db
      .select({ value: drizzleCount() })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, userId),
          inArray(subscriptions.status, ['active', 'overdue'])
        )
      ),
  ])

  const subscriptionCount = countResult[0]?.value ?? 0
  const allowed = limits.maxSubscriptions === Infinity || subscriptionCount < limits.maxSubscriptions

  return {
    allowed,
    current: subscriptionCount,
    max: limits.maxSubscriptions === Infinity ? 'unlimited' : limits.maxSubscriptions,
  }
}

/**
 * Check if user can add more categories
 */
export async function canAddCategory(userId: string): Promise<{ allowed: boolean; current: number; max: number | string }> {
  const [limits, countResult] = await Promise.all([
    getUserPlanLimits(userId),
    db
      .select({ value: drizzleCount() })
      .from(categories)
      .where(eq(categories.userId, userId)),
  ])

  const categoryCount = countResult[0]?.value ?? 0
  const allowed = limits.maxCategories === Infinity || categoryCount < limits.maxCategories

  return {
    allowed,
    current: categoryCount,
    max: limits.maxCategories === Infinity ? 'unlimited' : limits.maxCategories,
  }
}

/**
 * Check if user has access to a specific feature
 */
export async function hasFeatureAccess(userId: string, feature: string): Promise<boolean> {
  const limits = await getUserPlanLimits(userId)
  return limits.features.includes(feature)
}

/**
 * Start a trial for a new user
 */
export async function startTrial(userId: string, trialDays: number = 14): Promise<void> {
  const trialEndsAt = addDays(new Date(), trialDays)

  await db
    .update(users)
    .set({ trialEndsAt })
    .where(eq(users.id, userId))
}

/**
 * Upgrade user to a new plan
 */
export async function upgradeUserPlan(
  userId: string,
  planId: PlanId,
  planDurationDays?: number
): Promise<void> {
  const data: { planId: string; planEndsAt?: Date } = { planId }

  if (planDurationDays) {
    data.planEndsAt = addDays(new Date(), planDurationDays)
  }

  await db
    .update(users)
    .set(data)
    .where(eq(users.id, userId))
}

/**
 * Get user's current plan status
 */
export async function getUserPlanStatus(userId: string): Promise<{
  planId: string
  planName: string
  isOnTrial: boolean
  trialEndsAt: Date | null
  trialDaysRemaining: number
  planEndsAt: Date | null
  isPlanActive: boolean
  hasPaidPlan: boolean
}> {
  const result = await db.query.users.findFirst({
    where: eq(users.id, userId),
    with: { plan: true },
  })

  if (!result) {
    throw new Error('User not found')
  }

  const now = new Date()
  // Trial is active only if trialEndsAt is in the future
  const isOnTrial = result.trialEndsAt ? now < result.trialEndsAt : false
  // Paid plan is active only if planEndsAt exists and is in the future
  const hasPaidPlan = result.planEndsAt ? now < result.planEndsAt : false
  // Active if either trial is running OR a paid plan is valid
  const isPlanActive = isOnTrial || hasPaidPlan

  const trialDaysRemaining = result.trialEndsAt
    ? Math.max(0, Math.ceil((result.trialEndsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0

  return {
    planId: result.planId || 'starter-plan',
    planName: result.plan?.name || 'Starter',
    isOnTrial,
    trialEndsAt: result.trialEndsAt,
    trialDaysRemaining,
    planEndsAt: result.planEndsAt,
    isPlanActive,
    hasPaidPlan,
  }
}
