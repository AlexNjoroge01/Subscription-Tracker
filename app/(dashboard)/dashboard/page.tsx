'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import {
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  CreditCard,
  CalendarDays,
  Wallet,
  Zap,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Subscription } from '@/app/generated/prisma/models/Subscription'
import type { Category } from '@/app/generated/prisma/models/Category'

type SubscriptionWithCategory = Subscription & {
  category: Category | null
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const [subsRes, catRes] = await Promise.all([
          fetch('/api/subscriptions'),
          fetch('/api/categories'),
        ])
        const subsJson = await subsRes.json()
        const catJson = await catRes.json()
        if (!subsRes.ok) throw new Error(subsJson.error ?? 'Failed to load subscriptions')
        if (!catRes.ok) throw new Error(catJson.error ?? 'Failed to load categories')
        setSubscriptions(subsJson.data ?? subsJson)
        setCategories(catJson.data ?? catJson)
      } catch (error) {
        console.error(error)
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  const {
    monthlyTotal,
    activeCount,
    topCategory,
    nextRenewalLabel,
    categoryBreakdown,
  } = useMemo(() => {
    if (!subscriptions.length) {
      return {
        monthlyTotal: 0,
        activeCount: 0,
        topCategory: null as Category | null,
        nextRenewalLabel: 'No upcoming renewals',
        categoryBreakdown: [] as { name: string; total: number }[],
      }
    }

    const active = subscriptions.filter((s) => s.status === 'active')
    const monthlyTotal = active.reduce((sum, s) => sum + s.amount, 0)
    const activeCount = active.length

    const upcoming = subscriptions
      .filter((s) => s.nextBillingDate)
      .sort(
        (a, b) =>
          new Date(a.nextBillingDate as unknown as Date).getTime() -
          new Date(b.nextBillingDate as unknown as Date).getTime(),
      )[0]

    const daysUntil = upcoming
      ? Math.round(
          (new Date(upcoming.nextBillingDate as unknown as Date).getTime() -
            new Date().setHours(0, 0, 0, 0)) /
            (1000 * 60 * 60 * 24),
        )
      : null

    const nextRenewalLabel = upcoming
      ? daysUntil === 0
        ? `${upcoming.name} · due today`
        : daysUntil && daysUntil > 0
        ? `${upcoming.name} · in ${daysUntil} days`
        : `${upcoming.name} · overdue`
      : 'No upcoming renewals'

    const byCategory = new Map<string, number>()
    subscriptions.forEach((s) => {
      const name = s.category?.name ?? 'Uncategorised'
      byCategory.set(name, (byCategory.get(name) ?? 0) + s.amount)
    })

    const categoryBreakdown = Array.from(byCategory.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)

    const topCategoryName = categoryBreakdown[0]?.name
    const topCategory =
      categories.find((c) => c.name === topCategoryName) ?? null

    return {
      monthlyTotal,
      activeCount,
      topCategory,
      nextRenewalLabel,
      categoryBreakdown,
    }
  }, [subscriptions, categories])

  const displayName = session?.user?.name || 'Demo User'

  return (
    <div className="flex-1 bg-[#FAFAFA] text-slate-900 selection:bg-emerald-100">
      {/* Top bar */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold uppercase tracking-wider">
            Live Intelligence Mode
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <button className="relative rounded-full bg-slate-100 p-2 hover:bg-emerald-50 hover:text-emerald-600 transition-all">
            <Bell className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-slate-900 text-white px-3 py-1.5 shadow-lg shadow-slate-900/10">
            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-[10px] font-black italic">
              {displayName.charAt(0)}
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-bold">{displayName}</span>
              <span className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">Command</span>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-10 max-w-7xl mx-auto space-y-10">
        {/* Greeting */}
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
            <Zap className="w-3 h-3 fill-emerald-700" />
            Financial Audit Active
          </div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-none">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">{displayName.split(' ')[0]}</span>.
          </h1>
          <p className="text-slate-500 font-light text-lg">Your digital overhead is currently under oversight.</p>
        </section>

        {/* KPIs row */}
        <section className="grid md:grid-cols-4 gap-6">
          <Card className="bg-white border-slate-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Monthly Burn</span>
              <div className="p-1.5 bg-emerald-50 rounded-lg">
                <Wallet className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">
              KES {monthlyTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
              <ArrowUpRight className="w-3 h-3" />
              <span>Optimized Flow</span>
            </div>
          </Card>

          <Card className="bg-white border-slate-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Active Assets</span>
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <CreditCard className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <p className="text-2xl font-black text-slate-900">{activeCount}</p>
            <p className="text-[11px] font-medium text-slate-400">Recurring Services</p>
          </Card>

          <Card className="bg-white border-slate-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow rounded-2xl">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Top Category</span>
              <div className="p-1.5 bg-purple-50 rounded-lg">
                <ArrowUpRight className="w-4 h-4 text-purple-600" />
              </div>
            </div>
            <p className="text-lg font-black text-slate-900 truncate">
              {topCategory?.name ?? 'No Data'}
            </p>
            <p className="text-[11px] font-medium text-slate-400">Primary Concentration</p>
          </Card>

          <Card className="bg-white border-slate-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow rounded-2xl border-l-4 border-l-amber-400">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span>Next Renewal</span>
              <div className="p-1.5 bg-amber-50 rounded-lg">
                <CalendarDays className="w-4 h-4 text-amber-600" />
              </div>
            </div>
            <p className="text-sm font-black text-slate-900 uppercase">
              {nextRenewalLabel}
            </p>
            <p className="text-[11px] font-medium text-slate-400">Strategic Alert</p>
          </Card>
        </section>

        {/* Budget & upcoming renewals */}
        <section className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-white border-slate-100 p-8 flex flex-col gap-6 shadow-sm rounded-[32px]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Monthly Ceiling
                </h3>
                <p className="text-sm text-slate-500 font-light">
                  Capital retention vs. target burn.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Limit</span>
                <span className="font-black text-slate-900">KES 50,000</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-slate-900">
                   {Math.min(100, Math.round((monthlyTotal / 50000) * 100))}%
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase">
                  KES {monthlyTotal.toLocaleString()} utilized
                </span>
              </div>
              <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    monthlyTotal > 50000 ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (monthlyTotal / 50000) * 100)}%`,
                  }}
                />
              </div>
              <Badge
                variant={monthlyTotal > 50000 ? 'destructive' : 'secondary'}
                className={`mt-2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg ${
                    monthlyTotal <= 50000 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''
                }`}
              >
                {monthlyTotal > 50000
                  ? 'Budget Breach — Prune Immediately'
                  : 'Operational Efficiency Confirmed'}
              </Badge>
            </div>
          </Card>

          <Card className="bg-slate-900 text-white p-8 flex flex-col gap-6 shadow-xl rounded-[32px] border-none relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">
                Renewal Pipeline
              </h3>
              <p className="text-sm text-slate-400 font-light">
                Impending charges in the next 7 days.
              </p>
            </div>
            
            <div className="space-y-3 relative z-10">
              {isLoading || !subscriptions.length ? (
                <p className="text-xs text-slate-500 italic">
                  {isLoading ? 'Scanning records...' : 'No upcoming financial leaks detected.'}
                </p>
              ) : (
                subscriptions
                  .slice()
                  .sort((a, b) => new Date(a.nextBillingDate as unknown as Date).getTime() - new Date(b.nextBillingDate as unknown as Date).getTime())
                  .slice(0, 4)
                  .map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-800/40 p-4 hover:bg-slate-800/60 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-sm font-black group-hover:scale-110 transition-transform">
                          {sub.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-white tracking-tight">
                            {sub.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {sub.billingCycle} · KES {sub.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-emerald-500 uppercase block">Due</span>
                        <span className="text-xs font-bold text-slate-300">
                            {new Date(sub.nextBillingDate as unknown as Date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </Card>
        </section>

        {/* Spending by category */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                Capital Distribution
              </h3>
              <p className="text-sm text-slate-500 font-light">
                Structural breakdown of your recurring liquidity.
              </p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                Awaiting data to generate distribution insights.
              </p>
            ) : (
              categoryBreakdown.slice(0, 8).map((cat) => (
                <Card
                  key={cat.name}
                  className="bg-white border-slate-100 p-5 flex flex-col gap-2 shadow-sm hover:border-emerald-200 transition-colors rounded-2xl group"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-emerald-600 transition-colors">{cat.name}</p>
                  <p className="text-xl font-black text-slate-900">
                    KES {cat.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <div className="w-full h-1 bg-slate-50 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-emerald-500/20 w-full" />
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}