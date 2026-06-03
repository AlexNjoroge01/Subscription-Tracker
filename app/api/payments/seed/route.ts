import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { paymentPlans } from '@/lib/db/schema'
import { success, error } from '@/lib/api/response'

// POST /api/payments/seed - Seed default payment plans (admin only in production)
export async function POST(request: NextRequest) {
  try {
    console.log('Seeding payment plans...')

    // Delete existing plans
    await db.delete(paymentPlans)

    // Insert all plans in one round-trip and return inserted rows
    const createdPlans = await db
      .insert(paymentPlans)
      .values([
        {
          id: 'starter-plan',
          name: 'Starter',
          price: 9, // $9/month USD
          currency: 'USD',
          interval: 'monthly',
          features: [
            '14-day free trial',
            'Up to 20 subscriptions',
            'Basic analytics',
            'Email reminders',
            '5 categories',
            'Budget tracking',
            'Export data',
          ],
          isActive: true,
        },
        {
          id: 'pro-plan',
          name: 'Pro',
          price: 19, // $19/month USD
          currency: 'USD',
          interval: 'monthly',
          features: [
            '14-day free trial',
            'Unlimited subscriptions',
            'Advanced analytics',
            'Email & in-app notifications',
            'Unlimited categories',
            'Budget tracking',
            'Export data',
            'Priority support',
            'Custom billing cycles',
          ],
          isActive: true,
        },
        {
          id: 'premium-plan',
          name: 'Premium',
          price: 39, // $39/month USD
          currency: 'USD',
          interval: 'monthly',
          features: [
            '14-day free trial',
            'Everything in Pro',
            'Family sharing (up to 5 members)',
            'API access',
            'Advanced reports',
            'Data backup',
            '24/7 priority support',
            'Early access to new features',
            'Custom integrations',
            'Dedicated account manager',
          ],
          isActive: true,
        },
      ])
      .returning()

    const [starterPlan, proPlan, premiumPlan] = createdPlans
    console.log('Created plans:', { starterPlan, proPlan, premiumPlan })

    return success({
      message: 'Payment plans seeded successfully',
      plans: { starterPlan, proPlan, premiumPlan },
    })
  } catch (err) {
    console.error('Seed payment plans error:', err)
    return error(
      `Failed to seed payment plans: ${err instanceof Error ? err.message : String(err)}`,
      500
    )
  }
}
