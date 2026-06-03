import { NextRequest } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { users, subscriptions, categories } from '@/lib/db/schema'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized } from '@/lib/api/response'

// GET /api/analytics/overview - high level dashboard metrics
export async function GET(request: NextRequest) {
  try {
    const session = await requireAuth()

    // Resolve full user row by session email to get id + currency
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
    const activeSubs = await db
      .select({
        amount: subscriptions.amount,
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

    const activeCount = activeSubs.length
    const monthlyTotal = activeSubs.reduce((sum, s) => sum + (s.amount ?? 0), 0)
    const avgPerSub = activeCount > 0 ? monthlyTotal / activeCount : 0
    const yearlyProjection = monthlyTotal * 12

    // Tally spend by category name
    const byCategory = new Map<string, number>()
    for (const sub of activeSubs) {
      const name = sub.categoryName ?? 'Uncategorised'
      byCategory.set(name, (byCategory.get(name) ?? 0) + (sub.amount ?? 0))
    }

    const categoryTotals = Array.from(byCategory.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)

    const topCategory = categoryTotals[0] ?? null

    return success({
      monthlyTotal,
      activeCount,
      avgPerSub,
      yearlyProjection,
      topCategory,
      currency: user.currency,
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Analytics overview error:', err)
    return error('Failed to load analytics overview', 500)
  }
}
