import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized } from '@/lib/api/response'

// GET /api/analytics/overview - high level dashboard metrics
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()

    const [subs, categories] = await Promise.all([
      prisma.subscription.findMany({
        where: { userId: user.id },
      }),
      prisma.category.findMany({
        where: { userId: user.id },
      }),
    ])

    const active = subs.filter((s) => s.status === 'active')
    const monthlyTotal = active.reduce((sum, s) => sum + s.amount, 0)
    const activeCount = active.length
    const avgPerSub = activeCount ? monthlyTotal / activeCount : 0

    // simple yearly projection: current monthly * 12
    const yearlyProjection = monthlyTotal * 12

    // top category by spend
    const byCategory = new Map<string, number>()
    subs.forEach((s) => {
      const name =
        categories.find((c) => c.id === s.categoryId)?.name ?? 'Uncategorised'
      byCategory.set(name, (byCategory.get(name) ?? 0) + s.amount)
    })

    const categoryTotals = Array.from(byCategory.entries()).map(
      ([name, total]) => ({ name, total }),
    )

    const topCategory = categoryTotals.sort((a, b) => b.total - a.total)[0] ?? null

    return success({
      monthlyTotal,
      activeCount,
      avgPerSub,
      yearlyProjection,
      topCategory,
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Analytics overview error:', err)
    return error('Failed to load analytics overview', 500)
  }
}

