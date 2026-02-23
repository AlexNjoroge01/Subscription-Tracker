import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { success, error } from '@/lib/api/response'

// GET /api/payments/plans - List available payment plans
export async function GET(request: NextRequest) {
  try {
    const plans = await prisma.paymentPlan.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        price: 'asc',
      },
    })

    return success(plans)
  } catch (err) {
    console.error('Get payment plans error:', err)
    return error('Failed to fetch payment plans', 500)
  }
}
