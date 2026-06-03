import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    if (secret !== process.env.SUPERUSER_SEED_SECRET && secret !== 'subtrack-seed-2024') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = 'alexnjoroge102@gmail.com'
    const password = 'subtrack217'
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    console.log('Attempting to seed superuser:', email)

    // Check if user already exists
    const [existingUser] = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser) {
      console.log('User exists, updating to SUPERUSER and resetting password')

      await db
        .update(users)
        .set({
          role: 'SUPERUSER',
          password: hashedPassword,
          emailVerified: new Date(),
        })
        .where(eq(users.email, email))

      return NextResponse.json({
        message: 'Updated existing user to SUPERUSER with new password',
        email: existingUser.email,
      })
    }

    console.log('Creating new SUPERUSER')

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        name: 'Admin',
        role: 'SUPERUSER',
        emailVerified: new Date(),
      })
      .returning({ email: users.email })

    return NextResponse.json({
      message: 'Created new SUPERUSER',
      email: newUser.email,
    })
  } catch (error) {
    console.error('Error seeding superuser:', error)
    return NextResponse.json(
      {
        error: 'Failed to seed superuser',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
