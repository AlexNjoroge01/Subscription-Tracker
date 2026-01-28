import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { requireAuth } from '@/lib/api/auth-guard'
import { error, success, unauthorized } from '@/lib/api/response'

// GET /api/notifications - List notifications for current user
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const scope = searchParams.get('scope') // upcoming | recent | all

    const where: any = {
      userId: user.id,
      ...(type && { type }),
    }

    if (scope === 'unread') {
      where.read = false
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        subscription: {
          select: {
            id: true,
            name: true,
            amount: true,
            currency: true,
            nextBillingDate: true,
          },
        },
      },
      take: 50,
    })

    return success(notifications)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Get notifications error:', err)
    return error('Failed to fetch notifications', 500)
  }
}

