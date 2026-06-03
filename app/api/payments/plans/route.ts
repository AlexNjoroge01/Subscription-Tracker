import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { paymentPlans } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { success, error } from '@/lib/api/response'

// GET /api/payments/plans - List available payment plans
export async function GET(request: NextRequest) {
  try {
    const plans = await db
      .select()
      .from(paymentPlans)
      .where(eq(paymentPlans.isActive, true))
      .orderBy(asc(paymentPlans.price))

    return success(plans)
  } catch (err) {
    console.error('Get payment plans error:', err)
    return error('Failed to fetch payment plans', 500)
  }
}
