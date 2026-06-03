'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Bell,
  FolderKanban,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Activity,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AdminStats {
  users: {
    total: number
    newThisMonth: number
    recent: Array<{
      id: string
      name: string | null
      email: string
      createdAt: string
      role: string
      planId: string | null
    }>
  }
  subscriptions: {
    total: number
    active: number
    overdue: number
    monthlyAmount: number
    currencyBreakdown: Record<string, number>
  }
  payments: {
    totalReceived: number
    thisMonth: number
    pending: number
    byCurrency: Record<string, number>
    byMonth: Record<string, number>
    recent: Array<{
      id: string
      amount: number
      currency: string
      status: string
      createdAt: string
      user: { name: string | null; email: string }
      plan: { name: string }
    }>
  }
  plans: {
    distribution: Array<{
      planId: string | null
      _count: { id: number }
    }>
  }
  categories: {
    total: number
  }
  notifications: {
    total: number
    unread: number
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.role !== 'SUPERUSER') {
      router.push('/dashboard')
      return
    }

    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        const data = await response.json()
        setStats(data)
      } catch (err) {
        setError('Failed to load admin statistics')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (session?.user?.role === 'SUPERUSER') {
      fetchStats()
    }
  }, [session, router])

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!stats) return null

  const formatCurrency = (amount: number, currency: string = 'KES') => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/45 mt-1">Overview of your subscription tracking platform</p>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 px-3 py-1">
          <Activity className="w-4 h-4 mr-1" />
          Superuser
        </Badge>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Total Users</CardTitle>
            <Users className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.users.total}</div>
            <p className="text-xs text-white/45 mt-1">
              <span className="text-[#a3e635] font-medium">+{stats.users.newThisMonth}</span> this month
            </p>
          </CardContent>
        </Card>

        {/* Total Subscriptions */}
        <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#a3e635]">Subscriptions Tracked</CardTitle>
            <CreditCard className="w-5 h-5 text-[#a3e635]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.subscriptions.total}</div>
            <p className="text-xs text-white/45 mt-1">
              <span className="text-[#a3e635] font-medium">{stats.subscriptions.active}</span> active
            </p>
          </CardContent>
        </Card>

        {/* Monthly Revenue Potential */}
        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Monthly Tracked</CardTitle>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(stats.subscriptions.monthlyAmount, 'KES')}
            </div>
            <p className="text-xs text-white/45 mt-1">
              Across all active subscriptions
            </p>
          </CardContent>
        </Card>

        {/* Total Payments */}
        <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-600">Payments Received</CardTitle>
            <DollarSign className="w-5 h-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {formatCurrency(stats.payments.totalReceived, 'KES')}
            </div>
            <p className="text-xs text-white/45 mt-1">
              <span className="text-[#a3e635] font-medium">{formatCurrency(stats.payments.thisMonth, 'KES')}</span> this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overdue Subscriptions */}
        <Card className="border-red-100 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Overdue Subscriptions</CardTitle>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.subscriptions.overdue}</div>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card className="border-yellow-100 bg-yellow-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Pending Payments</CardTitle>
            <Clock className="w-5 h-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.payments.pending}</div>
          </CardContent>
        </Card>

        {/* Unread Notifications */}
        <Card className="border-blue-100 bg-blue-400/10/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">Unread Notifications</CardTitle>
            <Bell className="w-5 h-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.notifications.unread}</div>
            <p className="text-xs text-white/45 mt-1">of {stats.notifications.total} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-white/45" />
              Recent Users
            </CardTitle>
            <CardDescription>Latest users who joined the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.users.recent.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-white/[0.04] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.name?.[0] || user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name || 'No name'}</p>
                      <p className="text-sm text-white/45">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {user.planId || 'free'}
                    </Badge>
                    <p className="text-xs text-white/35 mt-1">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-white/45" />
              Recent Payments
            </CardTitle>
            <CardDescription>Latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.payments.recent.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-white/[0.04] rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      payment.status === 'completed' 
                        ? 'bg-[#a3e635]/15 text-[#a3e635]' 
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {payment.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Clock className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-white">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <p className="text-sm text-white/45">{payment.user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {payment.plan.name}
                    </Badge>
                    <p className="text-xs text-white/35 mt-1">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plan Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-white/45" />
            Plan Distribution
          </CardTitle>
          <CardDescription>Users by subscription plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.plans.distribution.map((plan) => (
              <div key={plan.planId || 'free'} className="p-4 bg-white/[0.04] rounded-lg text-center">
                <p className="text-2xl font-bold text-white">{plan._count.id}</p>
                <p className="text-sm text-white/45 capitalize">{plan.planId?.replace('-plan', '') || 'free'}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currency Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-white/45" />
            Monthly Amount by Currency
          </CardTitle>
          <CardDescription>Active subscription values by currency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.subscriptions.currencyBreakdown).map(([currency, amount]) => (
              <div key={currency} className="p-4 bg-white/[0.04] rounded-lg text-center">
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(amount, currency)}
                </p>
                <p className="text-sm text-white/45">{currency}</p>
              </div>
            ))}
            {Object.keys(stats.subscriptions.currencyBreakdown).length === 0 && (
              <div className="col-span-full text-center text-white/45 py-4">
                No active subscriptions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
