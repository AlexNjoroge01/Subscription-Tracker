import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized } from '@/lib/api/response'

// GET /api/analytics/category-breakdown
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

    const byCategory = new Map<string, { total: number; count: number }>()
    subs.forEach((s) => {
      const category = categories.find((c) => c.id === s.categoryId)
      const key = category?.name ?? 'Uncategorised'
      const entry = byCategory.get(key) ?? { total: 0, count: 0 }
      entry.total += s.amount
      entry.count += 1
      byCategory.set(key, entry)
    })

    const breakdown = Array.from(byCategory.entries()).map(
      ([name, { total, count }]) => ({
        name,
        total,
        count,
      }),
    )

    return success(breakdown)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Analytics category breakdown error:', err)
    return error('Failed to load category breakdown', 500)
  }
}

