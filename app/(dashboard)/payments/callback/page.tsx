'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function PaymentCallbackContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
  const [message, setMessage] = useState('Verifying your payment...')

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference')
      const paymentId = searchParams.get('paymentId')

      if (!reference && !paymentId) {
        setStatus('failed')
        setMessage('Missing payment reference')
        return
      }

      try {
        const params = new URLSearchParams()
        if (reference) params.append('reference', reference)
        if (paymentId) params.append('paymentId', paymentId)

        const res = await fetch(`/api/payments/verify?${params.toString()}`)
        const json = await res.json()

        if (json.data?.status === 'success' || json.data?.payment?.status === 'completed') {
          setStatus('success')
          setMessage('Payment successful! Thank you for your subscription.')
        } else if (json.data?.status === 'failed') {
          setStatus('failed')
          setMessage(json.data?.message || 'Payment failed. Please try again.')
        } else {
          // Still pending, poll again after 2 seconds
          setTimeout(verifyPayment, 2000)
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        setStatus('failed')
        setMessage('Failed to verify payment. Please contact support.')
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="flex-1 bg-[#070e08] text-white selection:bg-[#a3e635]/20">
      <main className="px-6 py-10 max-w-lg mx-auto">
        <Card className="bg-[#0d1b0f] border-white/[0.07] p-8 flex flex-col items-center gap-6 shadow-sm rounded-2xl text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white/35 animate-spin" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-white">Verifying Payment</h1>
                <p className="text-sm text-white/45">{message}</p>
              </div>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#a3e635]/15 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-[#a3e635]" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-white">Payment Successful!</h1>
                <p className="text-sm text-white/45">{message}</p>
              </div>
              <Button
                onClick={() => router.push('/dashboard')}
                className="bg-[#a3e635]/100 hover:bg-emerald-600 text-white"
              >
                Go to Dashboard
              </Button>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold text-white">Payment Failed</h1>
                <p className="text-sm text-white/45">{message}</p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => router.push('/settings')}
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Go to Dashboard
                </Button>
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  )
}

function PaymentCallbackFallback() {
  return (
    <div className="flex-1 bg-[#070e08] text-white selection:bg-[#a3e635]/20">
      <main className="px-6 py-10 max-w-lg mx-auto">
        <Card className="bg-[#0d1b0f] border-white/[0.07] p-8 flex flex-col items-center gap-6 shadow-sm rounded-2xl text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white/35 animate-spin" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">Verifying Payment</h1>
            <p className="text-sm text-white/45">Loading...</p>
          </div>
        </Card>
      </main>
    </div>
  )
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<PaymentCallbackFallback />}>
      <PaymentCallbackContent />
    </Suspense>
  )
}
