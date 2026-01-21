import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { requireAuth } from '@/lib/api/auth-guard'
import { createSubscriptionSchema } from '@/schemas'
import { error, success, unauthorized, validationError } from '@/lib/api/response'

// GET /api/subscriptions - List all subscriptions for authenticated user
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth()

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const status = searchParams.get('status')
        const categoryId = searchParams.get('categoryId')

        const subscriptions = await prisma.subscription.findMany({
            where: {
                userId: user.id,
                ...(search && {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                }),
                ...(status && { status }),
                ...(categoryId && { categoryId }),
            },
            include: {
                category: true,
            },
            orderBy: {
                nextBillingDate: 'asc',
            },
        })

        return success(subscriptions)
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

        // Create subscription
        const subscription = await prisma.subscription.create({
            data: {
                ...data,
                userId: user.id,
            },
            include: {
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
