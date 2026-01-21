import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { requireAuth } from '@/lib/api/auth-guard'
import { updateSubscriptionSchema } from '@/schemas'
import { error, success, unauthorized, notFound, validationError } from '@/lib/api/response'

// GET /api/subscriptions/[id] - Get single subscription
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth()

        const subscription = await prisma.subscription.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
            include: {
                category: true,
            },
        })

        if (!subscription) {
            return notFound('Subscription not found')
        }

        return success(subscription)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Get subscription error:', err)
        return error('Failed to fetch subscription', 500)
    }
}

// PATCH /api/subscriptions/[id] - Update subscription
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth()
        const body = await request.json()

        // Check if subscription exists and belongs to user
        const existing = await prisma.subscription.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
        })

        if (!existing) {
            return notFound('Subscription not found')
        }

        // Validate input
        const validation = updateSubscriptionSchema.safeParse(body)
        if (!validation.success) {
            return validationError(validation.error.flatten().fieldErrors as Record<string, string[]>)
        }

        const data = validation.data

        // Update subscription
        const subscription = await prisma.subscription.update({
            where: { id: params.id },
            data,
            include: {
                category: true,
            },
        })

        return success(subscription)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Update subscription error:', err)
        return error('Failed to update subscription', 500)
    }
}

// DELETE /api/subscriptions/[id] - Delete subscription
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await requireAuth()

        // Check if subscription exists and belongs to user
        const existing = await prisma.subscription.findFirst({
            where: {
                id: params.id,
                userId: user.id,
            },
        })

        if (!existing) {
            return notFound('Subscription not found')
        }

        // Delete subscription (notifications will cascade delete)
        await prisma.subscription.delete({
            where: { id: params.id },
        })

        return success({ message: 'Subscription deleted successfully' })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Delete subscription error:', err)
        return error('Failed to delete subscription', 500)
    }
}
