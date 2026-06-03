import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, passwordResetTokens } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { hashPassword } from '@/lib/auth/password'

// GET - Validate reset token
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find the reset token
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1)

    if (!resetToken) {
      return NextResponse.json(
        { valid: false, error: 'Invalid token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, resetToken.id))
      return NextResponse.json(
        { valid: false, error: 'Token has expired' },
        { status: 400 }
      )
    }

    // Check if token has been used
    if (resetToken.used) {
      return NextResponse.json(
        { valid: false, error: 'Token has already been used' },
        { status: 400 }
      )
    }

    return NextResponse.json({ valid: true })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json(
      { valid: false, error: 'An error occurred' },
      { status: 500 }
    )
  }
}

// POST - Reset password
export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      )
    }

    // Find the reset token
    const [resetToken] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1)

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 400 }
      )
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, resetToken.id))
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      )
    }

    // Check if token has been used
    if (resetToken.used) {
      return NextResponse.json(
        { error: 'Token has already been used' },
        { status: 400 }
      )
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password)

    // Update user password and mark token as used in a transaction
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, resetToken.userId))

      await tx
        .update(passwordResetTokens)
        .set({ used: true })
        .where(eq(passwordResetTokens.id, resetToken.id))
    })

    // Delete all reset tokens for this user
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, resetToken.userId))

    return NextResponse.json(
      { message: 'Password reset successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
