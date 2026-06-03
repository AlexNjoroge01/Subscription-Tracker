import { NextRequest } from 'next/server'
import { eq, and, ilike, ne, count } from 'drizzle-orm'
import { db } from '@/lib/db'
import { categories, subscriptions } from '@/lib/db/schema'
import { requireAuth } from '@/lib/api/auth-guard'
import { updateCategorySchema } from '@/schemas'
import { error, success, unauthorized, notFound, validationError } from '@/lib/api/response'

// GET /api/categories/[id] - Get single category
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth()
        const { id } = await params

        const category = await db.query.categories.findFirst({
            where: and(
                eq(categories.id, id),
                eq(categories.userId, user.id)
            ),
        })

        if (!category) {
            return notFound('Category not found')
        }

        const [{ subscriptionCount }] = await db
            .select({ subscriptionCount: count() })
            .from(subscriptions)
            .where(eq(subscriptions.categoryId, id))

        return success({ ...category, _count: { subscriptions: subscriptionCount } })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Get category error:', err)
        return error('Failed to fetch category', 500)
    }
}

// PATCH /api/categories/[id] - Update category
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth()
        const { id } = await params
        const body = await request.json()

        // Check if category exists and belongs to user
        const existing = await db.query.categories.findFirst({
            where: and(
                eq(categories.id, id),
                eq(categories.userId, user.id)
            ),
        })

        if (!existing) {
            return notFound('Category not found')
        }

        // Validate input
        const validation = updateCategorySchema.safeParse(body)
        if (!validation.success) {
            return validationError(validation.error.flatten().fieldErrors as Record<string, string[]>)
        }

        const data = validation.data

        // If name is changing, check for duplicates (case-insensitive)
        if (data.name && data.name.toLowerCase() !== existing.name.toLowerCase()) {
            const duplicate = await db.query.categories.findFirst({
                where: and(
                    eq(categories.userId, user.id),
                    ilike(categories.name, data.name),
                    ne(categories.id, id)
                ),
            })

            if (duplicate) {
                return error('Category with this name already exists', 400)
            }
        }

        // Update category
        await db
            .update(categories)
            .set(data)
            .where(eq(categories.id, id))

        // Refetch updated category
        const category = await db.query.categories.findFirst({
            where: eq(categories.id, id),
        })

        return success(category)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Update category error:', err)
        return error('Failed to update category', 500)
    }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth()
        const { id } = await params

        // Check if category exists and belongs to user
        const existing = await db.query.categories.findFirst({
            where: and(
                eq(categories.id, id),
                eq(categories.userId, user.id)
            ),
        })

        if (!existing) {
            return notFound('Category not found')
        }

        // Check if it has subscriptions
        const [{ subscriptionCount }] = await db
            .select({ subscriptionCount: count() })
            .from(subscriptions)
            .where(eq(subscriptions.categoryId, id))

        if (subscriptionCount > 0) {
            return error(
                'Cannot delete category with associated subscriptions. Reassign them first.',
                400
            )
        }

        // Delete category
        await db
            .delete(categories)
            .where(eq(categories.id, id))

        return success({ message: 'Category deleted successfully' })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Delete category error:', err)
        return error('Failed to delete category', 500)
    }
}
