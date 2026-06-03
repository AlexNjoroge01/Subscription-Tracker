import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { payments, paymentPlans, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
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

    // Fetch the payment row
    let paymentRow: typeof payments.$inferSelect | undefined

    if (paymentId) {
      ;[paymentRow] = await db
        .select()
        .from(payments)
        .where(eq(payments.id, paymentId))
        .limit(1)
    } else if (reference) {
      ;[paymentRow] = await db
        .select()
        .from(payments)
        .where(eq(payments.providerRef, reference))
        .limit(1)
    }

    if (!paymentRow) {
      return error('Payment not found', 404)
    }

    // Fetch the associated plan
    const [plan] = await db
      .select()
      .from(paymentPlans)
      .where(eq(paymentPlans.id, paymentRow.planId))
      .limit(1)

    // If already completed, return the payment
    if (paymentRow.status === 'completed') {
      return success({
        status: 'success',
        payment: {
          id: paymentRow.id,
          amount: paymentRow.amount,
          currency: paymentRow.currency,
          status: paymentRow.status,
          plan: plan ?? null,
          paidAt: paymentRow.paidAt,
        },
      })
    }

    // Verify with Paystack
    if (!paymentRow.providerRef) {
      return error('Payment has no provider reference', 400)
    }

    const verificationResult = await verifyPayment(paymentRow.providerRef)

    if (
      verificationResult.status &&
      verificationResult.data.status === 'success'
    ) {
      // Update payment to completed
      const [updatedPayment] = await db
        .update(payments)
        .set({
          status: 'completed',
          providerId: verificationResult.data.id.toString(),
          paidAt: new Date(verificationResult.data.paid_at),
        })
        .where(eq(payments.id, paymentRow.id))
        .returning()

      // Upgrade user's plan
      await db
        .update(users)
        .set({
          planId: paymentRow.planId,
          planEndsAt: addDays(new Date(), 30), // 30 days from now
          trialEndsAt: null, // Clear trial since they've paid
        })
        .where(eq(users.id, paymentRow.userId))

      return success({
        status: 'success',
        payment: {
          id: updatedPayment.id,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          status: updatedPayment.status,
          plan: plan ?? null,
          paidAt: updatedPayment.paidAt,
        },
        message: `Congratulations! You've been upgraded to the ${plan?.name ?? 'new'} plan.`,
      })
    } else if (verificationResult.data.status === 'failed') {
      // Update payment status to failed
      await db
        .update(payments)
        .set({ status: 'failed' })
        .where(eq(payments.id, paymentRow.id))

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
