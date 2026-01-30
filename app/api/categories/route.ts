import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { requireAuth } from '@/lib/api/auth-guard'
import { createCategorySchema } from '@/schemas'
import { error, success, unauthorized, validationError } from '@/lib/api/response'
import { DEFAULT_CATEGORIES } from '@/lib/defaults/default-categories'

// GET /api/categories - List all categories for authenticated user
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth()

        let categories = await prisma.category.findMany({
            where: {
                userId: user.id,
            },
            include: {
                _count: {
                    select: { subscriptions: true }
                }
            },
            orderBy: {
                name: 'asc',
            },
        })

        // Auto-seed if user has no categories
        if (categories.length === 0) {
            await prisma.category.createMany({
                data: DEFAULT_CATEGORIES.map(cat => ({
                    name: cat.name,
                    color: cat.color,
                    icon: cat.icon,
                    budgetLimit: cat.budgetLimit,
                    userId: user.id
                }))
            })

            // Re-fetch after seeding
            categories = await prisma.category.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    _count: {
                        select: { subscriptions: true }
                    }
                },
                orderBy: {
                    name: 'asc',
                },
            })
        }

        return success(categories)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Get categories error:', err)
        return error('Failed to fetch categories', 500)
    }
}

// POST /api/categories - Create new category
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

        // Check if category with same name already exists for this user
        const existing = await prisma.category.findFirst({
            where: {
                userId: user.id,
                name: {
                    equals: name,
                    mode: 'insensitive'
                }
            }
        })

        if (existing) {
            return error('Category with this name already exists', 400)
        }

        // Create category
        const category = await prisma.category.create({
            data: {
                name,
                color,
                icon,
                budgetLimit,
                userId: user.id,
            },
        })

        return success(category, 201)
    } catch (err) {
        if (err instanceof Error && err.message === 'Unauthorized') {
            return unauthorized()
        }
        console.error('Create category error:', err)
        return error('Failed to create category', 500)
    }
}
