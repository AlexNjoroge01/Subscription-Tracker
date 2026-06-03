import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword } from './password'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    console.log('Missing credentials')
                    throw new Error('Invalid credentials')
                }

                console.log('Looking for user:', credentials.email)
                const [user] = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email))
                    .limit(1)

                if (!user) {
                    console.log('User not found')
                    throw new Error('Invalid credentials')
                }

                if (user.password === null) {
                    console.log('User has no password (Google account)')
                    throw new Error('Please sign in with Google')
                }

                console.log('User found:', user.email)
                console.log('Verifying password...')
                const isValid = await verifyPassword(credentials.password, user.password)

                if (!isValid) {
                    console.log('Password verification failed')
                    throw new Error('Invalid credentials')
                }

                console.log('Password verified successfully')
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                }
            },
        }),
        ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
            ? [
                GoogleProvider({
                    clientId: process.env.GOOGLE_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                }),
            ]
            : []),
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                const existingUser = await db.query.users.findFirst({
                    where: eq(users.email, user.email!),
                })

                if (!existingUser) {
                    await db.insert(users).values({
                        email: user.email!,
                        name: user.name ?? null,
                        image: user.image ?? null,
                        emailVerified: new Date(),
                    })
                }
            }
            return true
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            if (account?.provider === 'google') {
                const dbUser = await db.query.users.findFirst({
                    where: eq(users.email, token.email!),
                })
                if (dbUser) {
                    token.id = dbUser.id
                    token.role = dbUser.role
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
}
