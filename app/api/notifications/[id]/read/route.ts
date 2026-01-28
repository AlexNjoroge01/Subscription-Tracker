import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized, notFound } from '@/lib/api/response'

// PATCH /api/notifications/[id]/read - mark single notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireAuth()
    const { id } = await params

    const existing = await prisma.notification.findFirst({
      where: { id, userId: user.id },
    })

    if (!existing) {
      return notFound('Notification not found')
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { read: true },
    })

    return success(updated)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Mark notification read error:', err)
    return error('Failed to update notification', 500)
  }
}

