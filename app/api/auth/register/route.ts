import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { hashPassword } from '@/lib/auth/password'
import { createUserSchema } from '@/schemas'
import { error, success, validationError } from '@/lib/api/response'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate input
        const validation = createUserSchema.safeParse(body)
        if (!validation.success) {
            return validationError(validation.error.flatten().fieldErrors as Record<string, string[]>)
        }

        const { name, email, password } = validation.data

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return error('User with this email already exists', 400)
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            },
        })

        return success(user, 201)
    } catch (err) {
        console.error('Registration error:', err)
        return error('Failed to create account', 500)
    }
}
