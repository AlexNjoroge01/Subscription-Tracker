import { withAuth } from 'next-auth/middleware'

export const proxy = withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/subscriptions/:path*',
  ],
}