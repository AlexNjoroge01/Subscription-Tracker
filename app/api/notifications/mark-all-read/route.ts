import { NextRequest } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { notifications } from '@/lib/db/schema'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized } from '@/lib/api/response'

// PATCH /api/notifications/mark-all-read - mark all notifications as read for current user
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()

    const updated = await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.userId, user.id), eq(notifications.read, false)))
      .returning()

    return success({ updated: updated.length })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Mark all notifications read error:', err)
    return error('Failed to update notifications', 500)
  }
}
