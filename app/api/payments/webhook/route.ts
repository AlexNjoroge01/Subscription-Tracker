import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { payments } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Paystack webhook handler
// This endpoint receives webhook events from Paystack
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()

    // In production, you should verify the signature
    // For now, we'll process the webhook without signature verification
    // TODO: Implement signature verification for security

    const event = JSON.parse(body)

    switch (event.event) {
      case 'charge.success': {
        const data = event.data
        const reference = data.reference

        // Find the payment by reference
        const [payment] = await db
          .select()
          .from(payments)
          .where(eq(payments.providerRef, reference))
          .limit(1)

        if (!payment) {
          console.error(`Payment not found for reference: ${reference}`)
          return NextResponse.json({ status: 'ignored' }, { status: 200 })
        }

        // Update payment status if not already completed
        if (payment.status !== 'completed') {
          await db
            .update(payments)
            .set({
              status: 'completed',
              providerId: data.id.toString(),
              paidAt: new Date(data.paid_at),
            })
            .where(eq(payments.id, payment.id))

          console.log(`Payment ${payment.id} marked as completed`)
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
