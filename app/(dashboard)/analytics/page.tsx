'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  Tooltip as RechartsTooltip,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
} from 'recharts'
import { BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DEFAULT_CURRENCY, getCurrencySymbol } from '@/lib/currencies'

type Overview = {
  monthlyTotal: number
  activeCount: number
  avgPerSub: number
  yearlyProjection: number
  topCategory: { name: string; total: number } | null
  currency?: string
}

type TrendPoint = {
  month: string
  total: number
}

type CategoryPoint = {
  name: string
  total: number
  count: number
}

const PIE_COLORS = ['#22c55e', '#0ea5e9', '#a855f7', '#f97316', '#e11d48', '#64748b']

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null)
  const [trend, setTrend] = useState<TrendPoint[]>([])
  const [categories, setCategories] = useState<CategoryPoint[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true)
        const [ovRes, trRes, catRes] = await Promise.all([
          fetch('/api/analytics/overview'),
          fetch('/api/analytics/spending-trend?months=6'),
          fetch('/api/analytics/category-breakdown'),
        ])
        const ovJson = await ovRes.json()
        const trJson = await trRes.json()
        const catJson = await catRes.json()
        if (!ovRes.ok) throw new Error(ovJson.error ?? 'Failed to load overview')
        if (!trRes.ok) throw new Error(trJson.error ?? 'Failed to load trend')
        if (!catRes.ok) throw new Error(catJson.error ?? 'Failed to load categories')
        setOverview(ovJson.data ?? ovJson)
        setTrend(trJson.data ?? trJson)
        setCategories(catJson.data ?? catJson)
      } catch (error) {
        console.error(error)
        toast.error('Failed to load analytics')
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  const timeframeLabel = 'Last 6 months'

  return (
    <div className="flex-1 bg-[#FAFAFA] text-slate-900 selection:bg-emerald-100">
      <main className="px-6 py-10 max-w-6xl mx-auto space-y-8">
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-slate-900 text-emerald-300 text-[10px] font-bold uppercase tracking-widest">
            <BarChart3 className="w-3 h-3" />
            Analytics Stack
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
            Deep dive into your subscription economics.
          </h1>
          <p className="text-slate-500 font-light text-sm">
            Trend lines, category allocations, and projections for the next 12 months.
          </p>
        </section>

        {/* Metrics row – alternating */}
        <section className="grid md:grid-cols-4 gap-4">
          <Card className="bg-white border-slate-100 p-4 flex flex-col gap-2 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Monthly Total
            </p>
            <p className="text-xl font-black text-slate-900">
              {overview
                ? `${getCurrencySymbol(overview.currency || DEFAULT_CURRENCY)} ${overview.monthlyTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                : '—'}
            </p>
            <p className="text-[11px] text-slate-400">Active burn this month</p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-4 flex flex-col gap-2 rounded-2xl shadow-sm text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              Active Subs
            </p>
            <p className="text-xl font-black text-white">
              {overview ? overview.activeCount : '—'}
            </p>
            <p className="text-[11px] text-slate-400">Tracked recurring services</p>
          </Card>

          <Card className="bg-white border-slate-100 p-4 flex flex-col gap-2 rounded-2xl shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Avg Cost / Sub
            </p>
            <p className="text-xl font-black text-slate-900">
              {overview
                ? `${getCurrencySymbol(overview.currency || DEFAULT_CURRENCY)} ${overview.avgPerSub.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                : '—'}
            </p>
            <p className="text-[11px] text-slate-400">Normalised monthly run-rate</p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-4 flex flex-col gap-2 rounded-2xl shadow-sm text-white">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
              Yearly Projection
            </p>
            <p className="text-xl font-black text-white">
              {overview
                ? `${getCurrencySymbol(overview.currency || DEFAULT_CURRENCY)} ${overview.yearlyProjection.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                : '—'}
            </p>
            <p className="text-[11px] text-slate-400">If nothing changes</p>
          </Card>
        </section>

        {/* Charts row – left white, right dark */}
        <section className="grid lg:grid-cols-2 gap-6">
          {/* Spending trend */}
          <Card className="bg-white border-slate-100 p-6 rounded-[28px] shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Spending Trend
                </p>
                <p className="text-sm text-slate-500 font-light">{timeframeLabel}</p>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50">
                <LineChartIcon className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
            <div className="h-56">
              {isLoading ? (
                <p className="text-xs text-slate-400 italic">
                  Loading spending trajectory…
                </p>
              ) : trend.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  Not enough data yet to plot a trend.
                </p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trend}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="month"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      tick={{ fontSize: 11, fill: '#64748b' }}
                    />
                    <RechartsTooltip
                      formatter={(value) =>
                        `${getCurrencySymbol(overview?.currency || DEFAULT_CURRENCY)} ${Number(value).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}`
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#22c55e"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSpend)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Category breakdown – dark version */}
          <Card className="bg-slate-900 border-slate-800 p-6 rounded-[28px] shadow-sm flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                  Category Breakdown
                </p>
                <p className="text-sm text-slate-400 font-light">
                  Where your monthly burn is concentrated.
                </p>
              </div>
              <div className="p-2 rounded-xl bg-sky-950/60">
                <PieChartIcon className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="h-56 w-full md:w-1/2">
                {isLoading ? (
                  <p className="text-xs text-slate-400 italic">
                    Loading allocation map…
                  </p>
                ) : categories.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">
                    No category data yet. Assign categories to your subscriptions.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categories}
                        dataKey="total"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={3}
                      >
                        {categories.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value, _name, item) =>
                          [
                            `${getCurrencySymbol(overview?.currency || DEFAULT_CURRENCY)} ${Number(value).toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}`,
                            item?.payload?.name,
                          ]
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className="flex-1 space-y-2">
                {categories.slice(0, 5).map((cat, index) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-xs text-slate-300"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                        }}
                      />
                      <span className="font-medium">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-white">
                      {getCurrencySymbol(overview?.currency || DEFAULT_CURRENCY)} {cat.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* Quick Insights – alternating */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Quick Insights
              </p>
              <p className="text-sm text-slate-500 font-light">
                Lightweight, data-backed prompts you can act on today.
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="bg-white border-slate-100 p-4 rounded-2xl shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Concentration
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {overview?.topCategory
                  ? `${overview.topCategory.name} is your heaviest lane at ${getCurrencySymbol(overview.currency || DEFAULT_CURRENCY)} ${overview.topCategory.total.toLocaleString(undefined, { maximumFractionDigits: 0 })}. Consider pruning within this category first.`
                  : 'Once you add a few subscriptions, we will highlight your highest-cost lane here.'}
              </p>
            </Card>

            <Card className="bg-slate-900 border-slate-800 p-4 rounded-2xl shadow-sm text-white">
              <p className="text-[11px] font-semibold text-slate-300 uppercase tracking-widest">
                Runway
              </p>
              <p className="mt-1 text-sm text-slate-300">
                {overview
                  ? `At the current burn, you will deploy approximately ${getCurrencySymbol(overview.currency || DEFAULT_CURRENCY)} ${overview.yearlyProjection.toLocaleString(undefined, { maximumFractionDigits: 0 })} over the next 12 months.`
                  : 'Yearly projection will appear once we detect a stable monthly pattern.'}
              </p>
            </Card>

            <Card className="bg-white border-slate-100 p-4 rounded-2xl shadow-sm">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
                Unit Cost
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {overview && overview.activeCount > 0
                  ? `Each active subscription costs you an average of ${getCurrencySymbol(overview.currency || DEFAULT_CURRENCY)} ${overview.avgPerSub.toLocaleString(undefined, { maximumFractionDigits: 0 })} per month.`
                  : 'Average cost per subscription will populate once you have active entries.'}
              </p>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}