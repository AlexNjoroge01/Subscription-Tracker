import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { paymentPlans } from '@/lib/db/schema'
import { success, error } from '@/lib/api/response'

// POST /api/payments/seed — seed the three default payment plans
export async function POST(_request: NextRequest) {
  try {
    // Delete existing plans and re-insert fresh
    await db.delete(paymentPlans)

    const createdPlans = await db
      .insert(paymentPlans)
      .values([
        {
          id: 'starter-plan',
          name: 'Starter',
          price: 9,
          currency: 'USD',
          interval: 'monthly',
          features: [
            'Up to 5 subscriptions',
            'Up to 3 categories',
            'Core subscription tracking',
            'Budget tracking',
            'Basic analytics overview',
            'Email renewal reminders (7, 3, 1 day)',
            'CSV export',
            'Calendar view',
          ],
          isActive: true,
        },
        {
          id: 'pro-plan',
          name: 'Pro',
          price: 20,
          currency: 'USD',
          interval: 'monthly',
          features: [
            'Unlimited subscriptions',
            'Unlimited categories',
            'Everything in Starter',
            'Spending trend charts',
            'Category breakdown chart',
            'Optimize insights (duplicate & cost detection)',
            'In-app notifications',
            'Custom billing cycles (weekly, quarterly, custom)',
            'Daily digest email',
            'Priority support',
          ],
          isActive: true,
        },
        {
          id: 'premium-plan',
          name: 'Premium',
          price: 35,
          currency: 'USD',
          interval: 'monthly',
          features: [
            'Unlimited subscriptions',
            'Unlimited categories',
            'Everything in Pro',
            'Family member tracking (up to 5)',
            'Advanced reports & data backup',
            'API access',
            'Custom integrations',
            '24/7 priority support',
            'Early access to new features',
          ],
          isActive: true,
        },
      ])
      .returning()

    return success({
      message: 'Payment plans seeded successfully',
      plans: createdPlans,
    })
  } catch (err) {
    console.error('Seed payment plans error:', err)
    return error(
      `Failed to seed payment plans: ${err instanceof Error ? err.message : String(err)}`,
      500
    )
  }
}
