import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { subscriptions, categories } from '@/lib/db/schema'
import { eq, sum, count, sql } from 'drizzle-orm'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized } from '@/lib/api/response'
import { hasFeatureAccess } from '@/lib/plan-limits'

// GET /api/analytics/category-breakdown
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    if (!(await hasFeatureAccess(user.id, 'advanced_analytics'))) {
      return error('Category breakdown charts require the Pro plan or higher. Upgrade to unlock.', 403)
    }

    const rows = await db
      .select({
        name: sql<string>`coalesce(${categories.name}, 'Uncategorised')`,
        total: sum(subscriptions.amount).mapWith(Number),
        count: count(subscriptions.id),
      })
      .from(subscriptions)
      .leftJoin(categories, eq(subscriptions.categoryId, categories.id))
      .where(eq(subscriptions.userId, user.id))
      .groupBy(sql`coalesce(${categories.name}, 'Uncategorised')`)

    const breakdown = rows.map(({ name, total, count }) => ({
      name,
      total: total ?? 0,
      count,
    }))

    return success(breakdown)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Analytics category breakdown error:', err)
    return error('Failed to load category breakdown', 500)
  }
}
