'use client'

import { useState, useEffect } from 'react'
import { Check, Loader2, Crown, Sparkles, Zap, RefreshCw, BadgeCheck } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PaymentPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  features: string[]
  isActive: boolean
}

interface PlanStatus {
  planId: string
  isOnTrial: boolean
  trialDaysRemaining: number
  isPlanActive: boolean
  hasPaidPlan: boolean
}

const planIcons: Record<string, typeof Crown> = {
  starter: Zap,
  pro: Sparkles,
  premium: Crown,
}

const planColors: Record<string, { bg: string; border: string; text: string; button: string }> = {
  starter: {
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    text: 'text-slate-600',
    button: 'bg-slate-900 hover:bg-slate-800 text-white',
  },
  pro: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  },
  premium: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    button: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
}

const USD_TO_KES = 155

export function PricingPlans() {
  const [plans, setPlans] = useState<PaymentPlan[]>([])
  const [planStatus, setPlanStatus] = useState<PlanStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null)
  const [currency, setCurrency] = useState<'USD' | 'KES'>('USD')

  useEffect(() => {
    Promise.all([loadPlans(), loadPlanStatus()]).finally(() => setIsLoading(false))
  }, [])

  const loadPlans = async () => {
    const res = await fetch('/api/payments/plans')
    const json = await res.json()
    if (res.ok) setPlans(json.data ?? json)
  }

  const loadPlanStatus = async () => {
    const res = await fetch('/api/user/plan-status')
    const json = await res.json()
    if (res.ok && json.data) setPlanStatus(json.data)
  }

  const formatPrice = (priceUSD: number, toCurrency: 'USD' | 'KES') => {
    return toCurrency === 'KES' ? Math.round(priceUSD * USD_TO_KES) : priceUSD
  }

  const getButtonLabel = (plan: PaymentPlan): string => {
    if (!planStatus) return 'Get Started'

    // Already on this paid plan
    if (planStatus.hasPaidPlan && planStatus.planId === plan.id) return 'Current Plan'

    // Trial expired — prompt payment
    if (!planStatus.isPlanActive) return `Subscribe to ${plan.name}`

    // On trial, prompt upgrade
    if (planStatus.isOnTrial) {
      if (planStatus.trialDaysRemaining <= 3) return `Upgrade Now — ${planStatus.trialDaysRemaining}d left`
      return `Upgrade to ${plan.name}`
    }

    // Has a different paid plan
    return `Switch to ${plan.name}`
  }

  const isCurrentPlan = (plan: PaymentPlan) =>
    planStatus?.hasPaidPlan && planStatus.planId === plan.id

  const handleSelectPlan = async (plan: PaymentPlan) => {
    if (isCurrentPlan(plan)) return

    try {
      setProcessingPlanId(plan.id)
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id, currency }),
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Failed to initialize payment')
      }

      if (json.data?.authorizationUrl) {
        window.location.href = json.data.authorizationUrl
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to initialize payment')
    } finally {
      setProcessingPlanId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No plans available at the moment.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Trial status notice */}
      {planStatus?.isOnTrial && (
        <div className="text-center px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
          You have <span className="font-bold">{planStatus.trialDaysRemaining} day{planStatus.trialDaysRemaining !== 1 ? 's' : ''}</span> remaining in your free trial.
          Upgrade now to keep uninterrupted access after your trial ends.
        </div>
      )}
      {!planStatus?.isPlanActive && (
        <div className="text-center px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          Your free trial has ended. Choose a plan below to continue using SubTrack.
        </div>
      )}

      {/* Currency Toggle */}
      <div className="flex items-center justify-center gap-3">
        <span className={cn('text-sm font-medium', currency === 'USD' ? 'text-slate-900' : 'text-slate-400')}>USD</span>
        <button
          onClick={() => setCurrency(prev => prev === 'USD' ? 'KES' : 'USD')}
          className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <span className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
            currency === 'KES' ? 'translate-x-6' : 'translate-x-1'
          )} />
        </button>
        <span className={cn('text-sm font-medium', currency === 'KES' ? 'text-slate-900' : 'text-slate-400')}>KES</span>
        <button
          onClick={() => setCurrency(prev => prev === 'USD' ? 'KES' : 'USD')}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
          title="Switch currency"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = planIcons[plan.name.toLowerCase()] || Crown
          const colors = planColors[plan.name.toLowerCase()] || planColors.pro
          const isProcessing = processingPlanId === plan.id
          const isPopular = plan.name.toLowerCase() === 'pro'
          const isCurrent = isCurrentPlan(plan)
          const displayPrice = formatPrice(plan.price, currency)
          const buttonLabel = getButtonLabel(plan)

          return (
            <Card
              key={plan.id}
              className={cn(
                'relative p-6 rounded-2xl border-2 transition-all duration-200',
                colors.bg,
                colors.border,
                isPopular && 'ring-2 ring-emerald-500 ring-offset-2',
                isCurrent && 'ring-2 ring-blue-400 ring-offset-2'
              )}
            >
              {isPopular && !isCurrent && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white">
                  Most Popular
                </Badge>
              )}
              {isCurrent && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> Current Plan
                </Badge>
              )}

              <div className="text-center mb-6">
                <div className={cn('w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center', colors.bg)}>
                  <Icon className={cn('w-6 h-6', colors.text)} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 capitalize">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-black text-slate-900">
                    {currency} {displayPrice.toLocaleString()}
                  </span>
                  <span className="text-slate-500 text-sm">/{plan.interval}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">14-day free trial included</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan)}
                disabled={isProcessing || !plan.isActive || !!isCurrent}
                className={cn('w-full', isCurrent ? 'bg-blue-500 hover:bg-blue-500 text-white opacity-80 cursor-default' : colors.button)}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  buttonLabel
                )}
              </Button>
            </Card>
          )
        })}
      </div>

      <p className="text-center text-xs text-slate-400">
        All plans include a 14-day free trial. Payments are securely processed via Paystack.
        <br />
        Cancel anytime. No hidden fees.
      </p>
    </div>
  )
}
