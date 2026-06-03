import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { payments, paymentPlans, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { requireAuth } from '@/lib/api/auth-guard'
import { success, error, unauthorized } from '@/lib/api/response'
import {
  initializePayment,
  generatePaymentReference,
} from '@/lib/paystack/paystack'

// Exchange rate (approximate - in production, fetch from API)
const USD_TO_KES = 155

// POST /api/payments/initialize - Initialize a payment
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    const body = await request.json()
    const { planId, currency = 'USD' } = body

    if (!planId) {
      return error('Plan ID is required', 400)
    }

    // Get the plan
    const [plan] = await db
      .select()
      .from(paymentPlans)
      .where(eq(paymentPlans.id, planId))
      .limit(1)

    if (!plan || !plan.isActive) {
      return error('Invalid or inactive plan', 400)
    }

    // Get user with email
    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1)

    if (!dbUser) {
      return unauthorized()
    }

    // Calculate price based on selected currency
    let amount = plan.price
    let paymentCurrency = plan.currency

    if (currency === 'KES' && plan.currency === 'USD') {
      amount = Math.round(plan.price * USD_TO_KES)
      paymentCurrency = 'KES'
    }

    // Generate a unique reference
    const reference = generatePaymentReference(user.id)

    // Create a pending payment record
    const [payment] = await db
      .insert(payments)
      .values({
        userId: user.id,
        planId: plan.id,
        amount,
        currency: paymentCurrency,
        status: 'pending',
        provider: 'paystack',
        providerRef: reference,
      })
      .returning()

    // Initialize payment with Paystack
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const paymentResult = await initializePayment({
      email: dbUser.email,
      amount,
      reference,
      callbackUrl: `${appUrl}/payments/callback?paymentId=${payment.id}`,
      metadata: {
        paymentId: payment.id,
        planId: plan.id,
        userId: user.id,
        planName: plan.name,
        originalCurrency: plan.currency,
        selectedCurrency: paymentCurrency,
      },
    })

    if (!paymentResult.status) {
      // Update payment status to failed
      await db
        .update(payments)
        .set({ status: 'failed' })
        .where(eq(payments.id, payment.id))

      return error(paymentResult.message || 'Failed to initialize payment', 400)
    }

    return success({
      paymentId: payment.id,
      reference,
      authorizationUrl: paymentResult.data.authorization_url,
      accessCode: paymentResult.data.access_code,
      currency: paymentCurrency,
      amount,
    })
  } catch (err) {
    if (err instanceof Error && err.message === 'Unauthorized') {
      return unauthorized()
    }
    console.error('Initialize payment error:', err)
    return error(
      err instanceof Error ? err.message : 'Failed to initialize payment',
      500
    )
  }
}
