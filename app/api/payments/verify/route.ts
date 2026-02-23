import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma/client'
import { success, error } from '@/lib/api/response'
import { verifyPayment } from '@/lib/paystack/paystack'
import { addDays } from 'date-fns'

// GET /api/payments/verify - Verify a payment
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    const paymentId = searchParams.get('paymentId')

    if (!reference && !paymentId) {
      return error('Reference or payment ID is required', 400)
    }

    let payment

    if (paymentId) {
      payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { plan: true, user: true },
      })
    } else if (reference) {
      payment = await prisma.payment.findUnique({
        where: { providerRef: reference },
        include: { plan: true, user: true },
      })
    }

    if (!payment) {
      return error('Payment not found', 404)
    }

    // If already completed, return the payment
    if (payment.status === 'completed') {
      return success({
        status: 'success',
        payment: {
          id: payment.id,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
          plan: payment.plan,
          paidAt: payment.paidAt,
        },
      })
    }

    // Verify with Paystack
    if (!payment.providerRef) {
      return error('Payment has no provider reference', 400)
    }

    const verificationResult = await verifyPayment(payment.providerRef)

    if (
      verificationResult.status &&
      verificationResult.data.status === 'success'
    ) {
      // Update payment status and upgrade user's plan
      const [updatedPayment] = await prisma.$transaction([
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'completed',
            providerId: verificationResult.data.id.toString(),
            paidAt: new Date(verificationResult.data.paid_at),
          },
          include: { plan: true },
        }),
        // Upgrade user's plan
        prisma.user.update({
          where: { id: payment.userId },
          data: {
            planId: payment.planId,
            planEndsAt: addDays(new Date(), 30), // 30 days from now
            trialEndsAt: null, // Clear trial since they've paid
          },
        }),
      ])

      return success({
        status: 'success',
        payment: {
          id: updatedPayment.id,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          status: updatedPayment.status,
          plan: updatedPayment.plan,
          paidAt: updatedPayment.paidAt,
        },
        message: `Congratulations! You've been upgraded to the ${payment.plan.name} plan.`,
      })
    } else if (verificationResult.data.status === 'failed') {
      // Update payment status to failed
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed' },
      })

      return success({
        status: 'failed',
        message: verificationResult.data.gateway_response || 'Payment failed',
      })
    } else {
      // Payment is still pending or processing
      return success({
        status: 'pending',
        message: 'Payment is still processing',
      })
    }
  } catch (err) {
    console.error('Verify payment error:', err)
    return error(
      err instanceof Error ? err.message : 'Failed to verify payment',
      500
    )
  }
}
