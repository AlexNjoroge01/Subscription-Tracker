import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized } from '@/lib/api/response'

// PATCH /api/notifications/mark-all-read - mark all notifications as read for current user
export async function PATCH(request: NextRequest) {
  try {
    const user = await requireAuth()

    const result = await prisma.notification.updateMany({
      where: {
        userId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    })

    return success({ updated: result.count })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Mark all notifications read error:', err)
    return error('Failed to update notifications', 500)
  }
}

