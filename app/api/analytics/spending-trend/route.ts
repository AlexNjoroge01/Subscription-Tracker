import { NextRequest } from 'next/server'
import { and, eq, gte, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized } from '@/lib/api/response'

// GET /api/analytics/spending-trend?months=6
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const months = Number(searchParams.get('months') ?? '6')

    const since = new Date()
    since.setMonth(since.getMonth() - months)

    const rows = await db
      .select({
        month: sql<string>`to_char(${subscriptions.nextBillingDate}, 'YYYY-MM')`,
        total: sql<number>`sum(${subscriptions.amount})`,
      })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.userId, user.id),
          gte(subscriptions.nextBillingDate, since),
        ),
      )
      .groupBy(sql`to_char(${subscriptions.nextBillingDate}, 'YYYY-MM')`)
      .orderBy(sql`to_char(${subscriptions.nextBillingDate}, 'YYYY-MM')`)

    const points = rows.map((r) => ({
      month: r.month,
      total: Number(r.total),
    }))

    return success(points)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Analytics spending trend error:', err)
    return error('Failed to load spending trend', 500)
  }
}
