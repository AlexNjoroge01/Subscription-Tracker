import { db } from '../lib/db/index.js'
import { users } from '../lib/db/schema.js'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

async function main() {
  const email = 'alexnjoroge102@gmail.com'
  const password = 'subtrack217'
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  const now = new Date()

  const existingUser = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  })

  if (existingUser) {
    await db.update(users).set({
      role: 'SUPERUSER',
      password: hashedPassword,
      emailVerified: now,
    }).where(eq(users.email, email))
    console.log('Updated existing user to SUPERUSER:', email)
  } else {
    await db.insert(users).values({
      email,
      password: hashedPassword,
      name: 'Admin',
      role: 'SUPERUSER',
      emailVerified: now,
    })
    console.log('Created new SUPERUSER:', email)
  }
}

main().catch((e) => {
  console.error('Error seeding superuser:', e)
  process.exit(1)
})
