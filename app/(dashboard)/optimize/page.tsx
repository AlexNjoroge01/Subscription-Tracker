'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Sparkles,
  TrendingDown,
  AlertTriangle,
  Info,
  X,
  CheckCircle2,
  BadgeDollarSign,
  Copy,
  ArrowRightLeft,
  PieChart,
  Clock,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getCurrencySymbol, DEFAULT_CURRENCY } from '@/lib/currencies'

// ─── Types ────────────────────────────────────────────────────────────────────

type InsightSeverity = 'high' | 'medium' | 'low'
type InsightCategory =
  | 'duplicate'
  | 'unused'
  | 'overbudget'
  | 'annual_switch'
  | 'concentration'
  | 'overdue'

type Insight = {
  id: string
  severity: InsightSeverity
  category: InsightCategory
  title: string
  description: string
  potentialSaving?: number
  currency?: string
  affectedSubscriptions?: string[]
}

type InsightsPayload = {
  insights: Insight[]
  totalPotentialSaving: number
  currency: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function categoryIcon(category: InsightCategory) {
  switch (category) {
    case 'duplicate':
      return Copy
    case 'annual_switch':
      return ArrowRightLeft
    case 'concentration':
      return PieChart
    case 'overbudget':
      return BadgeDollarSign
    case 'overdue':
      return Clock
    default:
      return Info
  }
}

function severityColors(severity: InsightSeverity) {
  switch (severity) {
    case 'high':
      return {
        badge: 'bg-red-50 text-red-700 border-red-200',
        icon: 'text-red-500',
        border: 'border-l-red-500',
        dot: 'bg-red-500',
      }
    case 'medium':
      return {
        badge: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: 'text-amber-500',
        border: 'border-l-amber-400',
        dot: 'bg-amber-400',
      }
    case 'low':
      return {
        badge: 'bg-sky-50 text-sky-700 border-sky-200',
        icon: 'text-sky-500',
        border: 'border-l-sky-400',
        dot: 'bg-sky-400',
      }
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SavingsBanner({
  amount,
  currency,
  count,
}: {
  amount: number
  currency: string
  count: number
}) {
  const sym = getCurrencySymbol(currency || DEFAULT_CURRENCY)
  return (
    <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-emerald-500/20">
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm flex-shrink-0">
          <TrendingDown className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-100">
            Potential Monthly Savings
          </p>
          <p className="text-3xl font-black text-white leading-tight mt-0.5">
            {sym} {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </p>
          <p className="text-sm text-emerald-100 font-light mt-1">
            {count} optimization{count !== 1 ? 's' : ''} detected — act on the high-severity items first.
          </p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest text-center">
          {sym} {(amount * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })} / yr
        </div>
      </div>
    </div>
  )
}

function InsightCard({
  insight,
  onDismiss,
}: {
  insight: Insight
  onDismiss: (id: string) => void
}) {
  const colors = severityColors(insight.severity)
  const Icon = categoryIcon(insight.category)
  const sym = getCurrencySymbol(insight.currency || DEFAULT_CURRENCY)

  return (
    <Card
      className={`bg-white border-slate-100 border-l-4 ${colors.border} p-5 rounded-2xl shadow-sm flex flex-col gap-3 group hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-2 rounded-xl bg-slate-50 flex-shrink-0 ${colors.icon}`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-slate-900 leading-tight">{insight.title}</p>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md border ${colors.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                {insight.severity}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{insight.description}</p>
            {insight.affectedSubscriptions && insight.affectedSubscriptions.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {insight.affectedSubscriptions.slice(0, 4).map((name) => (
                  <span
                    key={name}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600"
                  >
                    {name}
                  </span>
                ))}
                {insight.affectedSubscriptions.length > 4 && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-400">
                    +{insight.affectedSubscriptions.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDismiss(insight.id)}
          className="flex-shrink-0 p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-colors opacity-0 group-hover:opacity-100"
          title="Dismiss insight"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {insight.potentialSaving !== undefined && insight.potentialSaving > 0 && (
        <div className="flex items-center gap-2 pt-1 border-t border-slate-50">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Est. saving
          </span>
          <span className="text-sm font-black text-emerald-600">
            {sym} {insight.potentialSaving.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
          </span>
        </div>
      )}
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-black text-slate-900">You are all clear.</p>
        <p className="text-sm text-slate-500 max-w-xs font-light">
          No optimization opportunities detected right now. Check back after adding more
          subscriptions or adjusting your budget.
        </p>
      </div>
      <div className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-widest">
        Subscription Health: Excellent
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 border-l-4 border-l-slate-200 p-5 rounded-2xl shadow-sm flex flex-col gap-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-slate-100 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-100 rounded-lg w-2/3" />
          <div className="h-3 bg-slate-100 rounded-lg w-full" />
          <div className="h-3 bg-slate-100 rounded-lg w-4/5" />
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OptimizePage() {
  const [payload, setPayload] = useState<InsightsPayload | null>(null)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/analytics/insights')
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Failed to load insights')
        setPayload(json.data ?? json)
      } catch (err) {
        console.error(err)
        toast.error('Failed to load optimization insights')
      } finally {
        setIsLoading(false)
      }
    }
    void load()
  }, [])

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]))
    toast.success('Insight dismissed')
  }

  const visible = payload?.insights.filter((i) => !dismissed.has(i.id)) ?? []
  const highSeverity = visible.filter((i) => i.severity === 'high')
  const restInsights = visible.filter((i) => i.severity !== 'high')

  const totalSaving = visible.reduce((sum, i) => sum + (i.potentialSaving ?? 0), 0)
  const currency = payload?.currency ?? DEFAULT_CURRENCY

  const showBanner = !isLoading && highSeverity.length > 0 && totalSaving > 0

  return (
    <div className="flex-1 bg-[#FAFAFA] text-slate-900 selection:bg-emerald-100">
      <main className="px-6 py-10 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-slate-900 text-emerald-300 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Savings Engine
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
            Optimize your subscription stack.
          </h1>
          <p className="text-slate-500 font-light text-sm">
            AI-powered recommendations to cut waste, eliminate duplicates, and reduce monthly burn.
          </p>
        </section>

        {/* Savings banner — only when high-severity items exist */}
        {showBanner && (
          <SavingsBanner
            amount={totalSaving}
            currency={currency}
            count={visible.length}
          />
        )}

        {/* Insight feed */}
        {isLoading ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-100 rounded-lg w-40 animate-pulse" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          </section>
        ) : visible.length === 0 ? (
          <Card className="bg-white border-slate-100 rounded-2xl shadow-sm">
            <EmptyState />
          </Card>
        ) : (
          <>
            {/* High-severity section */}
            {highSeverity.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    High Priority
                  </p>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-red-50 text-red-700 border-red-200 font-bold"
                  >
                    {highSeverity.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {highSeverity.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onDismiss={handleDismiss}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Medium + low section */}
            {restInsights.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Other Recommendations
                  </p>
                  <Badge
                    variant="outline"
                    className="text-[10px] bg-slate-50 text-slate-500 border-slate-200 font-bold"
                  >
                    {restInsights.length}
                  </Badge>
                </div>
                <div className="space-y-3">
                  {restInsights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onDismiss={handleDismiss}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* Summary footer when insights are present */}
        {!isLoading && visible.length > 0 && (
          <Card className="bg-slate-900 border-slate-800 p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  Summary
                </p>
                <p className="text-sm text-slate-400 font-light">
                  {visible.length} open recommendation{visible.length !== 1 ? 's' : ''}.
                  {dismissed.size > 0 && ` ${dismissed.size} dismissed.`}
                </p>
              </div>
              {totalSaving > 0 && (
                <div className="flex items-baseline gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Total potential saving
                  </span>
                  <span className="text-xl font-black text-emerald-400">
                    {getCurrencySymbol(currency)} {totalSaving.toLocaleString(undefined, { maximumFractionDigits: 0 })}/mo
                  </span>
                </div>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}
