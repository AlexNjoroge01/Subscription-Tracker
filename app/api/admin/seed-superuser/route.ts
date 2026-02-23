import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export async function POST(request: Request) {
  try {
    // Check for a secret key to prevent unauthorized access
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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('User exists, updating to SUPERUSER and resetting password')
      // Update existing user to superuser and reset password
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { 
          role: 'SUPERUSER',
          password: hashedPassword,
          emailVerified: new Date()
        }
      })
      return NextResponse.json({ 
        message: 'Updated existing user to SUPERUSER with new password', 
        email: updatedUser.email 
      })
    } else {
      console.log('Creating new SUPERUSER')
      // Create new superuser
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: 'Admin',
          role: 'SUPERUSER',
          emailVerified: new Date(),
        }
      })
      return NextResponse.json({ 
        message: 'Created new SUPERUSER', 
        email: newUser.email 
      })
    }
  } catch (error) {
    console.error('Error seeding superuser:', error)
    return NextResponse.json({ 
      error: 'Failed to seed superuser', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
