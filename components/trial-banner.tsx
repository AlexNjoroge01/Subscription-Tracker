'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Clock, X, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PlanStatus {
  planId: string
  planName: string
  isOnTrial: boolean
  trialEndsAt: string | null
  trialDaysRemaining: number
  planEndsAt: string | null
  isPlanActive: boolean
  hasPaidPlan: boolean
}

export function TrialBanner() {
  const [status, setStatus] = useState<PlanStatus | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch('/api/user/plan-status')
      .then(r => r.json())
      .then(json => {
        if (json.data) setStatus(json.data)
      })
      .catch(() => {})
  }, [])

  // Don't show if paid plan is active or still loading
  if (!status || status.hasPaidPlan || dismissed) return null

  const isExpired = !status.isPlanActive
  const isExpiringSoon = status.isOnTrial && status.trialDaysRemaining <= 3

  // Only show banner if trial is expiring soon or already expired
  if (status.isOnTrial && status.trialDaysRemaining > 3) return null

  if (isExpired) {
    return (
      <div className="bg-red-950/60 border-b border-red-500/30 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-red-300">Your free trial has ended</p>
              <p className="text-xs text-red-400/80">
                Upgrade to a plan to continue tracking your subscriptions.
              </p>
            </div>
          </div>
          <Link
            href="/pricing"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-semibold transition-colors"
          >
            <Crown className="w-3.5 h-3.5" />
            Upgrade Now
          </Link>
        </div>
      </div>
    )
  }

  if (isExpiringSoon) {
    return (
      <div className={cn(
        'border-b px-4 py-3',
        status.trialDaysRemaining <= 1
          ? 'bg-amber-950/60 border-amber-500/30'
          : 'bg-yellow-950/50 border-yellow-500/25'
      )}>
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
              status.trialDaysRemaining <= 1 ? 'bg-amber-500/15' : 'bg-yellow-500/15'
            )}>
              <Clock className={cn(
                'w-4 h-4',
                status.trialDaysRemaining <= 1 ? 'text-amber-400' : 'text-yellow-400'
              )} />
            </div>
            <div>
              <p className={cn(
                'text-sm font-semibold',
                status.trialDaysRemaining <= 1 ? 'text-amber-300' : 'text-yellow-300'
              )}>
                {status.trialDaysRemaining === 0
                  ? 'Trial expires today'
                  : `${status.trialDaysRemaining} day${status.trialDaysRemaining === 1 ? '' : 's'} left in your trial`}
              </p>
              <p className={cn(
                'text-xs',
                status.trialDaysRemaining <= 1 ? 'text-amber-400/80' : 'text-yellow-400/80'
              )}>
                Upgrade before your trial ends to keep all your data and features.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/pricing"
              className={cn(
                'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-semibold transition-colors',
                status.trialDaysRemaining <= 1
                  ? 'bg-amber-500 hover:bg-amber-400'
                  : 'bg-yellow-500 hover:bg-yellow-400'
              )}
            >
              <Crown className="w-3.5 h-3.5" />
              Upgrade
            </Link>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-white/40 hover:text-white/70 rounded transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
