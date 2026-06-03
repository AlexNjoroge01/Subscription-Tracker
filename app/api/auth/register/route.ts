import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/lib/auth/password'
import { createUserSchema } from '@/schemas'
import { error, success, validationError } from '@/lib/api/response'
import { startTrial } from '@/lib/plan-limits'

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
        const [existingUser] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, email))
            .limit(1)

        if (existingUser) {
            return error('User with this email already exists', 400)
        }

        // Hash password
        const hashedPassword = await hashPassword(password)

        // Insert new user
        const [user] = await db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,
                planId: 'starter-plan',
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                createdAt: users.createdAt,
            })

        // Start 14-day trial
        await startTrial(user.id, 14)

        return success({
            ...user,
            message: 'Account created successfully! Your 14-day free trial has started.',
        }, 201)
    } catch (err) {
        console.error('Registration error:', err)
        return error('Failed to create account', 500)
    }
}
