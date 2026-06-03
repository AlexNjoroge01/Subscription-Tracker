import { NextRequest } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, subscriptions, categories } from '@/lib/db/schema'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized } from '@/lib/api/response'

// ─── Types ────────────────────────────────────────────────────────────────────

export type InsightSeverity = 'info' | 'warning' | 'critical'

export interface Insight {
  type: string
  title: string
  description: string
  severity: InsightSeverity
  affectedSubscriptions: string[] // subscription IDs
  potentialSaving?: number
}

interface ActiveSub {
  id: string
  name: string
  amount: number
  billingCycle: string
  categoryId: string | null
  categoryName: string | null
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalise any billing cycle amount to a monthly equivalent so all
 * comparisons happen on the same scale.
 */
function toMonthly(amount: number, billingCycle: string): number {
  switch (billingCycle) {
    case 'weekly':
      return amount * 4.33
    case 'yearly':
    case 'annual':
      return amount / 12
    case 'quarterly':
      return amount / 3
    default:
      // monthly, custom, unknown → treat as monthly
      return amount
  }
}

/**
 * Known streaming service name fragments. Kept broad to catch regional
 * variants and bundle names.
 */
const STREAMING_KEYWORDS = [
  'netflix',
  'hulu',
  'disney',
  'hbo',
  ' max',
  'prime video',
  'amazon video',
  'apple tv',
  'paramount',
  'peacock',
  'showtime',
  'starz',
  'crunchyroll',
  'funimation',
  'youtube premium',
  'youtube tv',
  'dazn',
  'discovery+',
  'espn+',
  'sling',
  'fubo',
  'mubi',
  'binge',
  'stan',
  'britbox',
  'acorn tv',
  'shudder',
]

function isStreaming(name: string): boolean {
  const lower = name.toLowerCase()
  return STREAMING_KEYWORDS.some((kw) => lower.includes(kw.trim()))
}

// ─── Insight detectors ────────────────────────────────────────────────────────

/**
 * Flag users who hold more than one streaming subscription simultaneously.
 * Potential saving = total monthly streaming spend minus the cheapest service.
 */
function detectStreamingDuplicates(subs: ActiveSub[]): Insight | null {
  const streaming = subs.filter((s) => isStreaming(s.name))
  if (streaming.length < 2) return null

  const monthlyAmounts = streaming.map((s) => toMonthly(s.amount, s.billingCycle))
  const totalMonthly = monthlyAmounts.reduce((sum, a) => sum + a, 0)
  const cheapest = Math.min(...monthlyAmounts)
  const potentialSaving = Math.round((totalMonthly - cheapest) * 100) / 100

  return {
    type: 'streaming_duplicates',
    title: 'Multiple Streaming Subscriptions',
    description: `You have ${streaming.length} active streaming services. Keeping only the one you use most could save approximately ${potentialSaving.toFixed(2)} per month.`,
    severity: streaming.length >= 4 ? 'critical' : 'warning',
    affectedSubscriptions: streaming.map((s) => s.id),
    potentialSaving,
  }
}

/**
 * Flag when one category accounts for 50 % or more of total monthly spend.
 * Only fired when the user has at least 3 active subscriptions so there is
 * meaningful portfolio context.
 */
function detectCategoryConcentration(subs: ActiveSub[]): Insight | null {
  if (subs.length < 3) return null

  const totalMonthly = subs.reduce((sum, s) => sum + toMonthly(s.amount, s.billingCycle), 0)
  if (totalMonthly === 0) return null

  // Aggregate monthly spend and IDs per category
  const byCategory = new Map<string, { ids: string[]; total: number }>()
  for (const sub of subs) {
    const key = sub.categoryName ?? 'Uncategorised'
    const existing = byCategory.get(key) ?? { ids: [], total: 0 }
    existing.ids.push(sub.id)
    existing.total += toMonthly(sub.amount, sub.billingCycle)
    byCategory.set(key, existing)
  }

  // Find the highest-spend category
  let topCategory = ''
  let topTotal = 0
  for (const [name, { total }] of byCategory) {
    if (total > topTotal) {
      topTotal = total
      topCategory = name
    }
  }

  const share = topTotal / totalMonthly
  if (share < 0.5) return null

  const pct = Math.round(share * 100)
  const { ids } = byCategory.get(topCategory)!

  return {
    type: 'category_concentration',
    title: `High Spend Concentration in "${topCategory}"`,
    description: `${pct}% of your monthly subscription spend is in the "${topCategory}" category. Consider reviewing whether all subscriptions in this category are necessary.`,
    severity: pct >= 75 ? 'critical' : 'warning',
    affectedSubscriptions: ids,
  }
}

/**
 * Flag individual subscriptions whose monthly-equivalent cost exceeds a
 * threshold (default 50 in the user's currency). Each qualifying subscription
 * gets its own insight.
 */
function detectHighCostItems(subs: ActiveSub[], threshold = 50): Insight[] {
  return subs
    .filter((s) => toMonthly(s.amount, s.billingCycle) > threshold)
    .map((s) => {
      const monthly = Math.round(toMonthly(s.amount, s.billingCycle) * 100) / 100
      return {
        type: 'high_cost_item',
        title: `High-Cost Subscription: ${s.name}`,
        description: `"${s.name}" costs approximately ${monthly.toFixed(2)} per month. Verify you are getting full value from this subscription.`,
        severity: (monthly > threshold * 3 ? 'critical' : 'warning') as InsightSeverity,
        affectedSubscriptions: [s.id],
      }
    })
}

/**
 * Detect subscriptions whose normalised names are a prefix/suffix of one
 * another, suggesting accidental duplicates (e.g. "Spotify" and
 * "Spotify Family"). Each pair becomes its own insight.
 */
function detectSimilarNameDuplicates(subs: ActiveSub[]): Insight[] {
  const insights: Insight[] = []
  // Track already-reported pairs so we don't emit the same pair twice
  const reportedPairs = new Set<string>()

  const normalise = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim()

  for (let i = 0; i < subs.length; i++) {
    for (let j = i + 1; j < subs.length; j++) {
      const a = subs[i]
      const b = subs[j]
      const na = normalise(a.name)
      const nb = normalise(b.name)

      if (na === nb) continue // exact duplicates handled separately

      const pairKey = [a.id, b.id].sort().join('|')
      if (reportedPairs.has(pairKey)) continue

      if (
        na.startsWith(nb) ||
        nb.startsWith(na) ||
        na.endsWith(nb) ||
        nb.endsWith(na)
      ) {
        reportedPairs.add(pairKey)
        const cheaper = toMonthly(a.amount, a.billingCycle) <= toMonthly(b.amount, b.billingCycle) ? a : b
        const potentialSaving = Math.round(toMonthly(cheaper.amount, cheaper.billingCycle) * 100) / 100

        insights.push({
          type: 'possible_duplicate',
          title: `Possible Duplicate: "${a.name}" and "${b.name}"`,
          description: `These two subscriptions look very similar. If one replaces the other, cancelling the unused one could save approximately ${potentialSaving.toFixed(2)} per month.`,
          severity: 'warning',
          affectedSubscriptions: [a.id, b.id],
          potentialSaving,
        })
      }
    }
  }

  return insights
}

/**
 * Detect exact-name duplicates (same trimmed, lowercased name) which are
 * almost certainly accidental double-subscriptions.
 */
function detectExactDuplicates(subs: ActiveSub[]): Insight[] {
  const nameMap = new Map<string, ActiveSub[]>()
  for (const sub of subs) {
    const key = sub.name.trim().toLowerCase()
    nameMap.set(key, [...(nameMap.get(key) ?? []), sub])
  }

  const insights: Insight[] = []
  for (const [, group] of nameMap) {
    if (group.length < 2) continue
    const sorted = [...group].sort(
      (a, b) => toMonthly(a.amount, a.billingCycle) - toMonthly(b.amount, b.billingCycle),
    )
    const potentialSaving = Math.round(
      sorted
        .slice(1)
        .reduce((sum, s) => sum + toMonthly(s.amount, s.billingCycle), 0) * 100,
    ) / 100

    insights.push({
      type: 'exact_duplicate',
      title: `Duplicate Subscription: "${group[0].name}"`,
      description: `You have ${group.length} subscriptions with the same name. Keeping only the cheapest one and cancelling the rest could save approximately ${potentialSaving.toFixed(2)} per month.`,
      severity: 'critical',
      affectedSubscriptions: group.map((s) => s.id),
      potentialSaving,
    })
  }

  return insights
}

// ─── Route handler ────────────────────────────────────────────────────────────

// GET /api/analytics/insights
export async function GET(_request: NextRequest) {
  try {
    const session = await requireAuth()

    // Resolve full user row to get id + currency (needed for threshold context)
    const user = await db
      .select({ id: users.id, currency: users.currency })
      .from(users)
      .where(eq(users.email, session.email!))
      .limit(1)
      .then((rows) => rows[0] ?? null)

    if (!user) {
      return unauthorized()
    }

    // Fetch active subscriptions joined with their category in one query
    const rows = await db
      .select({
        id: subscriptions.id,
        name: subscriptions.name,
        amount: subscriptions.amount,
        billingCycle: subscriptions.billingCycle,
        categoryId: subscriptions.categoryId,
        categoryName: categories.name,
      })
      .from(subscriptions)
      .leftJoin(categories, eq(subscriptions.categoryId, categories.id))
      .where(
        and(
          eq(subscriptions.userId, user.id),
          eq(subscriptions.status, 'active'),
        ),
      )

    const activeSubs: ActiveSub[] = rows.map((r) => ({
      id: r.id,
      name: r.name,
      amount: r.amount ?? 0,
      billingCycle: r.billingCycle,
      categoryId: r.categoryId ?? null,
      categoryName: r.categoryName ?? null,
    }))

    // Run all detectors and collect insights
    const insights: Insight[] = []

    insights.push(...detectExactDuplicates(activeSubs))

    const streamingInsight = detectStreamingDuplicates(activeSubs)
    if (streamingInsight) insights.push(streamingInsight)

    const concentrationInsight = detectCategoryConcentration(activeSubs)
    if (concentrationInsight) insights.push(concentrationInsight)

    insights.push(...detectHighCostItems(activeSubs))
    insights.push(...detectSimilarNameDuplicates(activeSubs))

    // Sort: critical first, then warning, then info
    const severityOrder: Record<InsightSeverity, number> = { critical: 0, warning: 1, info: 2 }
    insights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

    return success(insights)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Analytics insights error:', err)
    return error('Failed to load analytics insights', 500)
  }
}
