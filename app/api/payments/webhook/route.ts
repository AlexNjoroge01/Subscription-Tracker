import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { verifyPayment } from '@/lib/paystack/paystack'

// Paystack webhook handler
// This endpoint receives webhook events from Paystack
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')

    // In production, you should verify the signature
    // For now, we'll process the webhook without signature verification
    // TODO: Implement signature verification for security

    const event = JSON.parse(body)

    // Handle different event types
    switch (event.event) {
      case 'charge.success': {
        const data = event.data
        const reference = data.reference

        // Find the payment by reference
        const payment = await prisma.payment.findUnique({
          where: { providerRef: reference },
        })

        if (!payment) {
          console.error(`Payment not found for reference: ${reference}`)
          return NextResponse.json({ status: 'ignored' }, { status: 200 })
        }

        // Update payment status if not already completed
        if (payment.status !== 'completed') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: 'completed',
              providerId: data.id.toString(),
              paidAt: new Date(data.paid_at),
            },
          })

          console.log(`Payment ${payment.id} marked as completed`)
        }

        break
      }

      case 'charge.failed': {
        const data = event.data
        const reference = data.reference

        const payment = await prisma.payment.findUnique({
          where: { providerRef: reference },
        })

        if (payment && payment.status !== 'completed') {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { status: 'failed' },
          })

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
