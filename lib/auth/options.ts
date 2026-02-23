import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma/client'
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
                    console.log('❌ Missing credentials')
                    throw new Error('Invalid credentials')
                }

                console.log('🔍 Looking for user:', credentials.email)
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user) {
                    console.log('❌ User not found')
                    throw new Error('Invalid credentials')
                }

                console.log('✅ User found:', user.email)
                console.log('🔐 Verifying password...')
                const isValid = await verifyPassword(credentials.password, user.password)

                if (!isValid) {
                    console.log('❌ Password verification failed')
                    throw new Error('Invalid credentials')
                }

                console.log('✅ Password verified successfully')
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                    role: user.role,
                }
            },
        }),
        // Google OAuth (optional - only enabled if env vars are set)
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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
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
