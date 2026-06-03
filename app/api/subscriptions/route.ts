import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { subscriptions } from '@/lib/db/schema'
import { eq, and, ilike, asc, or } from 'drizzle-orm'
import { requireAuth } from '@/lib/api/auth-guard'
import { createSubscriptionSchema } from '@/schemas'
import { error, success, unauthorized, validationError } from '@/lib/api/response'
import { canAddSubscription } from '@/lib/plan-limits'

// GET /api/subscriptions - List all subscriptions for authenticated user
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth()

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const status = searchParams.get('status')
        const categoryId = searchParams.get('categoryId')

        const filters = [eq(subscriptions.userId, user.id)]

        if (search) {
            filters.push(ilike(subscriptions.name, `%${search}%`))
        }

        if (status) {
            filters.push(eq(subscriptions.status, status))
        }

        if (categoryId) {
            filters.push(eq(subscriptions.categoryId, categoryId))
        }

        const result = await db.query.subscriptions.findMany({
            where: and(...filters),
            with: {
                category: true,
            },
            orderBy: asc(subscriptions.nextBillingDate),
        })

        return success(result)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Get subscriptions error:', err)
        return error('Failed to fetch subscriptions', 500)
    }
}

// POST /api/subscriptions - Create new subscription
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth()
        const body = await request.json()

        // Validate input
        const validation = createSubscriptionSchema.safeParse(body)
        if (!validation.success) {
            return validationError(validation.error.flatten().fieldErrors as Record<string, string[]>)
        }

        const data = validation.data

        // Check plan limits
        const subscriptionCheck = await canAddSubscription(user.id)
        if (!subscriptionCheck.allowed) {
            return error(
                `You've reached your subscription limit (${subscriptionCheck.max}). Upgrade your plan to add more.`,
                403
            )
        }

        // Create subscription
        const [inserted] = await db
            .insert(subscriptions)
            .values({
                ...data,
                userId: user.id,
            })
            .returning()

        // Fetch with category relation
        const subscription = await db.query.subscriptions.findFirst({
            where: eq(subscriptions.id, inserted.id),
            with: {
                category: true,
            },
        })

        return success(subscription, 201)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Create subscription error:', err)
        return error('Failed to create subscription', 500)
    }
}
