'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { Bell, Clock3, Filter, CheckCheck } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { getCurrencySymbol } from '@/lib/currencies'
import type { Notification } from '@prisma/client'
import type { Subscription } from '@prisma/client'

type NotificationWithSub = Notification & {
  subscription: Pick<Subscription, 'id' | 'name' | 'amount' | 'currency' | 'nextBillingDate'> | null
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<NotificationWithSub[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [tab, setTab] = useState<'upcoming' | 'recent' | 'all'>('upcoming')
  const [isMutating, setIsMutating] = useState(false)

  useEffect(() => {
    void load()
  }, [])

  const load = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/notifications')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Failed to load notifications')
      setNotifications(json.data ?? json)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load notifications')
    } finally {
      setIsLoading(false)
    }
  }

  const markRead = async (id: string) => {
    try {
      setIsMutating(true)
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to update notification')
        return
      }
      await load()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsMutating(false)
    }
  }

  const markAllRead = async () => {
    try {
      setIsMutating(true)
      const res = await fetch('/api/notifications/mark-all-read', {
        method: 'PATCH',
      })
      const json = await res.json()
      if (!res.ok) {
        toast.error(json.error ?? 'Failed to update notifications')
        return
      }
      await load()
    } catch (error) {
      console.error(error)
      toast.error('Something went wrong')
    } finally {
      setIsMutating(false)
    }
  }

  const upcomingCutoff = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d
  }, [])

  const filtered = useMemo(() => {
    const now = new Date()
    return notifications.filter((n) => {
      const created = new Date(n.createdAt as unknown as Date)
      if (tab === 'recent') {
        const diffDays =
          (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        return diffDays <= 7
      }
      if (tab === 'upcoming') {
        const next =
          n.subscription?.nextBillingDate &&
          new Date(n.subscription.nextBillingDate as unknown as Date)
        return next && next <= upcomingCutoff
      }
      return true
    })
  }, [notifications, tab, upcomingCutoff])

  const displayName = session?.user?.name || 'User'

  return (
    <div className="flex-1 bg-[#FAFAFA] text-slate-900 selection:bg-emerald-100">
      <main className="px-6 py-10 max-w-5xl mx-auto space-y-8">
        <section className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-md bg-slate-900 text-amber-300 text-[10px] font-bold uppercase tracking-widest">
            <Bell className="w-3 h-3" />
            Signal Feed
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
            Notifications for {displayName.split(' ')[0]}
          </h1>
          <p className="text-slate-500 font-light text-sm">
            Upcoming renewals, budget warnings, and optimization prompts in one focused stream.
          </p>
        </section>

        <Card className="bg-white border-slate-100 p-5 flex flex-col gap-4 shadow-sm rounded-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <Tabs
              value={tab}
              onValueChange={(v) => setTab(v as typeof tab)}
            >
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="gap-2 text-xs"
                onClick={markAllRead}
                disabled={isMutating}
              >
                <CheckCheck className="w-3 h-3" />
                Mark all as read
              </Button>
              <Button
                variant="outline"
                size="icon-sm"
                className="text-slate-400"
                disabled
                title="Type filters coming soon"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <p className="text-xs text-slate-500 italic">Loading notification feed…</p>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Clock3 className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-900">
                No notifications to review.
              </p>
              <p className="text-xs text-slate-500 max-w-xs">
                As your renewals and budgets approach key thresholds, alerts will surface here.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((n) => {
                const created = new Date(n.createdAt as unknown as Date)
                const sub = n.subscription
                const isUnread = !n.read
                const typeLabel =
                  n.type === 'renewal_reminder'
                    ? 'Renewal'
                    : n.type === 'overdue'
                    ? 'Overdue'
                    : n.type === 'budget_warning'
                    ? 'Budget'
                    : 'Digest'

                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markRead(n.id)}
                    className={cn(
                      'w-full text-left rounded-2xl border px-4 py-3 flex items-start justify-between gap-3 transition-colors',
                      isUnread
                        ? 'bg-emerald-50/70 border-emerald-100 hover:bg-emerald-50'
                        : 'bg-slate-50 border-slate-100 hover:bg-white',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'mt-1 w-2 h-2 rounded-full',
                          isUnread ? 'bg-emerald-500' : 'bg-slate-300',
                        )}
                      />
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {sub?.name ?? 'Subscription'}
                          </span>
                          <Badge
                            variant={isUnread ? 'default' : 'outline'}
                            className="text-[10px] uppercase tracking-widest"
                          >
                            {typeLabel}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-600">
                          {n.message}
                        </p>
                        {sub && (
                          <p className="text-[11px] text-slate-400">
                            Next billing{' '}
                            {new Date(
                              sub.nextBillingDate as unknown as Date,
                            ).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                            })}{' '}
                            · {getCurrencySymbol(sub.currency)} {sub.amount.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {created.toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}

