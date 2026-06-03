import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, passwordResetTokens } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { randomBytes } from 'crypto'
import { sendPasswordResetEmail } from '@/lib/email/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1)

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json(
        { message: 'If an account with that email exists, we have sent reset instructions.' },
        { status: 200 }
      )
    }

    // Generate reset token
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete any existing reset tokens for this user
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, user.id))

    // Create new reset token
    await db.insert(passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt,
    })

    // Build reset URL
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
    const resetUrl = `${baseUrl}/reset-password?token=${token}`

    try {
      await sendPasswordResetEmail(email, resetUrl, user.name || undefined)
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError)
      // Still return success to prevent email enumeration
    }

    return NextResponse.json(
      { message: 'If an account with that email exists, we have sent reset instructions.' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
