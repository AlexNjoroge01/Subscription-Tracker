import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { db } from '@/lib/db'
import { payments, users, paymentPlans } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { addDays } from 'date-fns'

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // Verify Paystack signature
    const secret = process.env.PAYSTACK_SECRET_KEY
    if (!secret) {
      console.error('PAYSTACK_SECRET_KEY not configured')
      return NextResponse.json({ status: 'error' }, { status: 500 })
    }

    const signature = request.headers.get('x-paystack-signature')
    const expectedHash = createHmac('sha512', secret).update(body).digest('hex')

    if (!signature || signature !== expectedHash) {
      console.warn('Invalid Paystack webhook signature')
      return NextResponse.json({ status: 'unauthorized' }, { status: 401 })
    }

    const event = JSON.parse(body)

    switch (event.event) {
      case 'charge.success': {
        const data = event.data
        const reference = data.reference

        const [payment] = await db
          .select()
          .from(payments)
          .where(eq(payments.providerRef, reference))
          .limit(1)

        if (!payment) {
          console.error(`Payment not found for reference: ${reference}`)
          return NextResponse.json({ status: 'ignored' }, { status: 200 })
        }

        if (payment.status !== 'completed') {
          const [plan] = await db
            .select()
            .from(paymentPlans)
            .where(eq(paymentPlans.id, payment.planId))
            .limit(1)

          const planDurationDays = plan?.interval === 'annually' ? 365 : 30

          await db
            .update(payments)
            .set({
              status: 'completed',
              providerId: data.id.toString(),
              paidAt: new Date(data.paid_at),
            })
            .where(eq(payments.id, payment.id))

          // Upgrade the user's plan
          await db
            .update(users)
            .set({
              planId: payment.planId,
              planEndsAt: addDays(new Date(), planDurationDays),
              trialEndsAt: null,
            })
            .where(eq(users.id, payment.userId))

          console.log(`Payment ${payment.id} completed — user ${payment.userId} upgraded to ${payment.planId}`)
        }

        break
      }

      case 'charge.failed': {
        const data = event.data
        const reference = data.reference

        const [payment] = await db
          .select()
          .from(payments)
          .where(eq(payments.providerRef, reference))
          .limit(1)

        if (payment && payment.status !== 'completed') {
          await db
            .update(payments)
            .set({ status: 'failed' })
            .where(eq(payments.id, payment.id))

          console.log(`Payment ${payment.id} marked as failed`)
        }

        break
      }

      default:
        console.log(`Unhandled Paystack event: ${event.event}`)
    }

    return NextResponse.json({ status: 'success' }, { status: 200 })
  } catch (err) {
    console.error('Paystack webhook error:', err)
    return NextResponse.json(
      { status: 'error', message: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
