import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { payments } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { requireAuth } from '@/lib/api/auth-guard'
import { success, error, unauthorized } from '@/lib/api/response'

// GET /api/payments/history - List payment history for authenticated user
export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth()

    const result = await db.query.payments.findMany({
      where: eq(payments.userId, user.id as string),
      with: {
        plan: true,
      },
      orderBy: desc(payments.createdAt),
    })

    return success(result)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Get payment history error:', err)
    return error('Failed to fetch payment history', 500)
  }
}
