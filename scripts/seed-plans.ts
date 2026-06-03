import { db } from '../lib/db/index.js'
import { paymentPlans } from '../lib/db/schema.js'

const plans = [
  {
    id: 'starter-plan',
    name: 'starter',
    price: 0,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Up to 20 subscriptions',
      'Up to 5 categories',
      'Basic analytics',
      'Email reminders',
      'Budget tracking',
      'Export data',
    ],
    isActive: true,
  },
  {
    id: 'pro-plan',
    name: 'pro',
    price: 4.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Unlimited subscriptions',
      'Unlimited categories',
      'Advanced analytics',
      'Email & in-app notifications',
      'Budget tracking',
      'Export data',
      'Priority support',
      'Custom billing cycles',
    ],
    isActive: true,
  },
  {
    id: 'premium-plan',
    name: 'premium',
    price: 9.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Everything in Pro',
      'Family sharing (up to 5 members)',
      'API access',
      'Advanced reports',
      'Data backup',
      'Custom integrations',
      '24/7 priority support',
      'Early access to new features',
    ],
    isActive: true,
  },
]

async function main() {
  console.log('Seeding payment plans...')

  for (const plan of plans) {
    await db
      .insert(paymentPlans)
      .values(plan)
      .onConflictDoNothing()
    console.log('Upserted plan:', plan.id)
  }

  console.log('Seeding completed!')
}

main().catch((e) => {
  console.error('Error seeding:', e)
  process.exit(1)
})
