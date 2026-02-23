import { prisma } from '../lib/prisma/client.js'
import { UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

async function main() {
  const email = 'alexnjoroge102@gmail.com'
  const password = 'subtrack217'
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    // Update existing user to superuser and reset password
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { 
        role: UserRole.SUPERUSER,
        password: hashedPassword,
        emailVerified: new Date()
      }
    })
    console.log('Updated existing user to SUPERUSER with new password:', updatedUser.email)
  } else {
    // Create new superuser
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Admin',
        role: UserRole.SUPERUSER,
        emailVerified: new Date(),
      }
    })
    console.log('Created new SUPERUSER:', newUser.email)
  }
}

main()
  .catch((e) => {
    console.error('Error seeding superuser:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
