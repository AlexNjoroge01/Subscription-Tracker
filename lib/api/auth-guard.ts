import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'

/**
 * Get authenticated user from session
 * Throws error if not authenticated
 */
export async function requireAuth() {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        throw new Error('Unauthorized')
    }

    return session.user
}
