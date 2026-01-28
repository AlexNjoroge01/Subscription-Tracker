import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
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

    const subs = await prisma.subscription.findMany({
      where: {
        userId: user.id,
        createdAt: {
          gte: since,
        },
      },
    })

    const buckets = new Map<string, number>()
    subs.forEach((s) => {
      const d = new Date(s.nextBillingDate)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      buckets.set(key, (buckets.get(key) ?? 0) + s.amount)
    })

    const points = Array.from(buckets.entries())
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => (a.month > b.month ? 1 : -1))

    return success(points)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Analytics spending trend error:', err)
    return error('Failed to load spending trend', 500)
  }
}

