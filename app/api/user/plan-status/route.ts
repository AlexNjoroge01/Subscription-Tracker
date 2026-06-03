import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/api/auth-guard'
import { getUserPlanStatus } from '@/lib/plan-limits'
import { success, error, unauthorized } from '@/lib/api/response'

// GET /api/user/plan-status — returns the authenticated user's billing/trial status
export async function GET(_request: NextRequest) {
  try {
    const user = await requireAuth()
    const planStatus = await getUserPlanStatus(user.id)
    return success(planStatus)
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Plan status error:', err)
    return error('Failed to fetch plan status', 500)
  }
}
