import { NextRequest } from 'next/server'
import { eq, and } from 'drizzle-orm'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { requireAuth } from '@/lib/api/auth-guard'
import { updateSubscriptionSchema } from '@/schemas'
import { error, success, unauthorized, notFound, validationError } from '@/lib/api/response'

// GET /api/subscriptions/[id] - Get single subscription
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth()
        const { id } = await params

        const subscription = await db.query.subscriptions.findFirst({
            where: and(
                eq(subscriptions.id, id),
                eq(subscriptions.userId, user.id)
            ),
            with: {
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth()
        const { id } = await params
        const body = await request.json()

        // Check if subscription exists and belongs to user
        const existing = await db.query.subscriptions.findFirst({
            where: and(
                eq(subscriptions.id, id),
                eq(subscriptions.userId, user.id)
            ),
        })

        if (!existing) {
            return notFound('Subscription not found')
        }

        // Validate input
        const validation = updateSubscriptionSchema.safeParse(body)
        if (!validation.success) {
            return validationError(validation.error.flatten().fieldErrors as Record<string, string[]>)
        }

        // Update subscription
        await db
            .update(subscriptions)
            .set(validation.data)
            .where(eq(subscriptions.id, id))

        // Refetch with category relation
        const subscription = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.id, id),
            with: {
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
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth()
        const { id } = await params

        // Check if subscription exists and belongs to user
        const existing = await db.query.subscriptions.findFirst({
            where: and(
                eq(subscriptions.id, id),
                eq(subscriptions.userId, user.id)
            ),
        })

        if (!existing) {
            return notFound('Subscription not found')
        }

        // Delete subscription (notifications will cascade delete)
        await db
            .delete(subscriptions)
            .where(eq(subscriptions.id, id))

        return success({ message: 'Subscription deleted successfully' })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Delete subscription error:', err)
        return error('Failed to delete subscription', 500)
    }
}
