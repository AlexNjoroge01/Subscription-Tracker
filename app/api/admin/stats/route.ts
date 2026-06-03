import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { db } from '@/lib/db'
import {
  users,
  subscriptions,
  payments,
  categories,
  notifications,
} from '@/lib/db/schema'
import { count, sum, eq, gte, and, sql } from 'drizzle-orm'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'SUPERUSER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Users ──────────────────────────────────────────────────────────────

    const [{ totalUsers }] = await db
      .select({ totalUsers: count() })
      .from(users)

    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const [{ newUsersThisMonth }] = await db
      .select({ newUsersThisMonth: count() })
      .from(users)
      .where(gte(users.createdAt, startOfMonth))

    // ── Subscriptions ──────────────────────────────────────────────────────

    const [{ totalSubscriptions }] = await db
      .select({ totalSubscriptions: count() })
      .from(subscriptions)

    const [{ activeSubscriptions }] = await db
      .select({ activeSubscriptions: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'))

    const [{ overdueSubscriptions }] = await db
      .select({ overdueSubscriptions: count() })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'overdue'))

    // Monthly-equivalent amount calculation for active subscriptions
    const activeSubRows = await db
      .select({
        amount: subscriptions.amount,
        currency: subscriptions.currency,
        billingCycle: subscriptions.billingCycle,
        customDays: subscriptions.customDays,
      })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'))

    let totalMonthlyAmount = 0
    const currencyBreakdown: Record<string, number> = {}

    for (const sub of activeSubRows) {
      let monthlyAmount = sub.amount
      if (sub.billingCycle === 'annual') {
        monthlyAmount = sub.amount / 12
      } else if (sub.billingCycle === 'custom' && sub.customDays) {
        monthlyAmount = (sub.amount / sub.customDays) * 30
      }
      totalMonthlyAmount += monthlyAmount
      currencyBreakdown[sub.currency] = (currencyBreakdown[sub.currency] ?? 0) + monthlyAmount
    }

    // ── Payments ───────────────────────────────────────────────────────────

    const completedPaymentRows = await db
      .select({
        amount: payments.amount,
        currency: payments.currency,
        paidAt: payments.paidAt,
      })
      .from(payments)
      .where(eq(payments.status, 'completed'))

    let totalPaymentsReceived = 0
    const paymentsByCurrency: Record<string, number> = {}
    const paymentsByMonth: Record<string, number> = {}

    for (const payment of completedPaymentRows) {
      totalPaymentsReceived += payment.amount
      paymentsByCurrency[payment.currency] = (paymentsByCurrency[payment.currency] ?? 0) + payment.amount
      if (payment.paidAt) {
        const monthKey = payment.paidAt.toISOString().slice(0, 7)
        paymentsByMonth[monthKey] = (paymentsByMonth[monthKey] ?? 0) + payment.amount
      }
    }

    const [paymentsThisMonthRow] = await db
      .select({ total: sum(payments.amount) })
      .from(payments)
      .where(
        and(
          eq(payments.status, 'completed'),
          gte(payments.paidAt, startOfMonth),
        ),
      )

    const [{ pendingPayments }] = await db
      .select({ pendingPayments: count() })
      .from(payments)
      .where(eq(payments.status, 'pending'))

    // ── Plan distribution ──────────────────────────────────────────────────

    const planDistribution = await db
      .select({
        planId: users.planId,
        userCount: count(),
      })
      .from(users)
      .groupBy(users.planId)

    // ── Categories ─────────────────────────────────────────────────────────

    const [{ totalCategories }] = await db
      .select({ totalCategories: count() })
      .from(categories)

    // ── Notifications ──────────────────────────────────────────────────────

    const [{ totalNotifications }] = await db
      .select({ totalNotifications: count() })
      .from(notifications)

    const [{ unreadNotifications }] = await db
      .select({ unreadNotifications: count() })
      .from(notifications)
      .where(eq(notifications.read, false))

    // ── Recent users ───────────────────────────────────────────────────────

    const recentUsers = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        role: users.role,
        planId: users.planId,
      })
      .from(users)
      .orderBy(sql`${users.createdAt} desc`)
      .limit(5)

    // ── Recent payments (with user + plan via query API) ───────────────────

    const recentPayments = await db.query.payments.findMany({
      orderBy: (p, { desc }) => [desc(p.createdAt)],
      limit: 5,
      columns: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
      },
      with: {
        user: {
          columns: { name: true, email: true },
        },
        plan: {
          columns: { name: true },
        },
      },
    })

    return NextResponse.json({
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        recent: recentUsers,
      },
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        overdue: overdueSubscriptions,
        monthlyAmount: totalMonthlyAmount,
        currencyBreakdown,
      },
      payments: {
        totalReceived: totalPaymentsReceived,
        thisMonth: Number(paymentsThisMonthRow?.total ?? 0),
        pending: pendingPayments,
        byCurrency: paymentsByCurrency,
        byMonth: paymentsByMonth,
        recent: recentPayments,
      },
      plans: {
        distribution: planDistribution,
      },
      categories: {
        total: totalCategories,
      },
      notifications: {
        total: totalNotifications,
        unread: unreadNotifications,
      },
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 })
  }
}
