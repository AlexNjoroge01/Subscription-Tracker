import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
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

        const category = await prisma.category.findFirst({
            where: {
                id,
                userId: user.id,
            },
            include: {
                _count: {
                    select: { subscriptions: true }
                }
            }
        })

        if (!category) {
            return notFound('Category not found')
        }

        return success(category)
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
        const existing = await prisma.category.findFirst({
            where: {
                id,
                userId: user.id,
            },
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

        // If name is changing, check for duplicates
        if (data.name && data.name.toLowerCase() !== existing.name.toLowerCase()) {
            const duplicate = await prisma.category.findFirst({
                where: {
                    userId: user.id,
                    name: {
                        equals: data.name,
                        mode: 'insensitive'
                    },
                    id: { not: id }
                }
            })

            if (duplicate) {
                return error('Category with this name already exists', 400)
            }
        }

        // Update category
        const category = await prisma.category.update({
            where: { id },
            data,
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
        const existing = await prisma.category.findFirst({
            where: {
                id,
                userId: user.id,
            },
            include: {
                _count: {
                    select: { subscriptions: true }
                }
            }
        })

        if (!existing) {
            return notFound('Category not found')
        }

        // Check if it has subscriptions
        if (existing._count.subscriptions > 0) {
            return error('Cannot delete category with associated subscriptions. Reassign them first.', 400)
        }

        // Delete category
        await prisma.category.delete({
            where: { id },
        })

        return success({ message: 'Category deleted successfully' })
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Delete category error:', err)
        return error('Failed to delete category', 500)
    }
}
