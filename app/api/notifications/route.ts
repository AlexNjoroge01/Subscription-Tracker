import { NextRequest } from 'next/server'
import { eq, and, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized } from '@/lib/api/response'

// GET /api/notifications - List notifications for current user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const scope = searchParams.get('scope')

    const conditions = [eq(notifications.userId, user.id)]

    if (type) {
      conditions.push(eq(notifications.type, type))
    }

    if (scope === 'unread') {
      conditions.push(eq(notifications.read, false))
    }

    const results = await db.query.notifications.findMany({
      where: and(...conditions),
      orderBy: [desc(notifications.createdAt)],
      limit: 50,
      with: {
        subscription: {
          columns: {
            id: true,
            name: true,
            amount: true,
            currency: true,
            nextBillingDate: true,
          },
        },
      },
    })

    return success(results)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Get notifications error:', err)
    return error('Failed to fetch notifications', 500)
  }
}
