import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { categories, subscriptions } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { requireAuth } from '@/lib/api/auth-guard'
import { createCategorySchema } from '@/schemas'
import { error, success, unauthorized, validationError } from '@/lib/api/response'
import { DEFAULT_CATEGORIES } from '@/lib/defaults/default-categories'
import { canAddCategory } from '@/lib/plan-limits'

// GET /api/categories - List all categories for authenticated user, each with subscription count
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth()

        let rows = await db
            .select({
                id: categories.id,
                userId: categories.userId,
                name: categories.name,
                color: categories.color,
                icon: categories.icon,
                budgetLimit: categories.budgetLimit,
                createdAt: categories.createdAt,
                updatedAt: categories.updatedAt,
                subscriptionCount: sql<number>`cast(count(${subscriptions.id}) as int)`,
            })
            .from(categories)
            .leftJoin(subscriptions, eq(subscriptions.categoryId, categories.id))
            .where(eq(categories.userId, user.id))
            .groupBy(
                categories.id,
                categories.userId,
                categories.name,
                categories.color,
                categories.icon,
                categories.budgetLimit,
                categories.createdAt,
                categories.updatedAt,
            )
            .orderBy(categories.name)

        // Auto-seed default categories when the user has none
        if (rows.length === 0) {
            const categoryCheck = await canAddCategory(user.id)
            const limit =
                typeof categoryCheck.max === 'number'
                    ? categoryCheck.max
                    : DEFAULT_CATEGORIES.length
            const toSeed = DEFAULT_CATEGORIES.slice(0, Math.min(DEFAULT_CATEGORIES.length, limit))

            if (toSeed.length > 0) {
                await db.insert(categories).values(
                    toSeed.map((cat) => ({
                        name: cat.name,
                        color: cat.color,
                        icon: cat.icon,
                        budgetLimit: cat.budgetLimit,
                        userId: user.id,
                    })),
                )

                // Re-fetch after seeding
                rows = await db
                    .select({
                        id: categories.id,
                        userId: categories.userId,
                        name: categories.name,
                        color: categories.color,
                        icon: categories.icon,
                        budgetLimit: categories.budgetLimit,
                        createdAt: categories.createdAt,
                        updatedAt: categories.updatedAt,
                        subscriptionCount: sql<number>`cast(count(${subscriptions.id}) as int)`,
                    })
                    .from(categories)
                    .leftJoin(subscriptions, eq(subscriptions.categoryId, categories.id))
                    .where(eq(categories.userId, user.id))
                    .groupBy(
                        categories.id,
                        categories.userId,
                        categories.name,
                        categories.color,
                        categories.icon,
                        categories.budgetLimit,
                        categories.createdAt,
                        categories.updatedAt,
                    )
                    .orderBy(categories.name)
            }
        }

        return success(rows)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Get categories error:', err)
        return error('Failed to fetch categories', 500)
    }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth()
        const body = await request.json()

        // Validate input
        const validation = createCategorySchema.safeParse(body)
        if (!validation.success) {
            return validationError(validation.error.flatten().fieldErrors as Record<string, string[]>)
        }

        const { name, color, icon, budgetLimit } = validation.data

        // Check plan limits
        const categoryCheck = await canAddCategory(user.id)
        if (!categoryCheck.allowed) {
            return error(
                `You've reached your category limit (${categoryCheck.max}). Upgrade your plan to add more.`,
                403,
            )
        }

        // Check for duplicate name (case-insensitive) for this user
        const [duplicate] = await db
            .select({ id: categories.id })
            .from(categories)
            .where(
                sql`${categories.userId} = ${user.id}
                    and lower(${categories.name}) = lower(${name})`,
            )
            .limit(1)

        if (duplicate) {
            return error('Category with this name already exists', 400)
        }

        // Insert and return the new category
        const [category] = await db
            .insert(categories)
            .values({
                name,
                color: color ?? '#3b82f6',
                icon,
                budgetLimit,
                userId: user.id,
            })
            .returning()

        return success(category, 201)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Create category error:', err)
        return error('Failed to create category', 500)
    }
}
