import { prisma } from '../lib/prisma/client.js'

async function main() {
  console.log('Seeding payment plans...')

  // Create Free plan
  const freePlan = await prisma.paymentPlan.upsert({
    where: { id: 'free-plan' },
    update: {},
    create: {
      id: 'free-plan',
      name: 'Free',
      price: 0,
      currency: 'KES',
      interval: 'monthly',
      features: [
        'Up to 5 subscriptions',
        'Basic analytics',
        'Email reminders',
        '1 category',
      ],
      isActive: true,
    },
  })

  // Create Pro plan
  const proPlan = await prisma.paymentPlan.upsert({
    where: { id: 'pro-plan' },
    update: {},
    create: {
      id: 'pro-plan',
      name: 'Pro',
      price: 499, // KES 499/month
      currency: 'KES',
      interval: 'monthly',
      features: [
        'Unlimited subscriptions',
        'Advanced analytics',
        'Email & in-app notifications',
        'Unlimited categories',
        'Budget tracking',
        'Export data',
        'Priority support',
      ],
      isActive: true,
    },
  })

  // Create Premium plan
  const premiumPlan = await prisma.paymentPlan.upsert({
    where: { id: 'premium-plan' },
    update: {},
    create: {
      id: 'premium-plan',
      name: 'Premium',
      price: 999, // KES 999/month
      currency: 'KES',
      interval: 'monthly',
      features: [
        'Everything in Pro',
        'Family sharing (up to 5 members)',
        'Custom billing cycles',
        'API access',
        'Advanced reports',
        'Data backup',
        '24/7 priority support',
        'Early access to new features',
      ],
      isActive: true,
    },
  })

  console.log('Created plans:', { freePlan, proPlan, premiumPlan })
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
