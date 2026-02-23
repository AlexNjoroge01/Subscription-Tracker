import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/options'
import { prisma } from '@/lib/prisma/client'
import { UserRole } from '@prisma/client'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and is a superuser
    if (!session?.user || session.user.role !== UserRole.SUPERUSER) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total users count
    const totalUsers = await prisma.user.count()
    
    // Get new users this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    // Get total subscriptions tracked
    const totalSubscriptions = await prisma.subscription.count()
    
    // Get active subscriptions
    const activeSubscriptions = await prisma.subscription.count({
      where: {
        status: 'active'
      }
    })

    // Get total amount from all active subscriptions (monthly equivalent)
    const subscriptions = await prisma.subscription.findMany({
      where: {
        status: 'active'
      },
      select: {
        amount: true,
        currency: true,
        billingCycle: true,
        customDays: true
      }
    })

    // Calculate monthly equivalent for each subscription
    let totalMonthlyAmount = 0
    const currencyBreakdown: Record<string, number> = {}
    
    for (const sub of subscriptions) {
      let monthlyAmount = sub.amount
      
      if (sub.billingCycle === 'annual') {
        monthlyAmount = sub.amount / 12
      } else if (sub.billingCycle === 'custom' && sub.customDays) {
        monthlyAmount = (sub.amount / sub.customDays) * 30
      }
      
      totalMonthlyAmount += monthlyAmount
      
      if (!currencyBreakdown[sub.currency]) {
        currencyBreakdown[sub.currency] = 0
      }
      currencyBreakdown[sub.currency] += monthlyAmount
    }

    // Get total payments received
    const completedPayments = await prisma.payment.findMany({
      where: {
        status: 'completed'
      },
      select: {
        amount: true,
        currency: true,
        paidAt: true
      }
    })

    let totalPaymentsReceived = 0
    const paymentsByCurrency: Record<string, number> = {}
    const paymentsByMonth: Record<string, number> = {}
    
    for (const payment of completedPayments) {
      totalPaymentsReceived += payment.amount
      
      if (!paymentsByCurrency[payment.currency]) {
        paymentsByCurrency[payment.currency] = 0
      }
      paymentsByCurrency[payment.currency] += payment.amount
      
      if (payment.paidAt) {
        const monthKey = payment.paidAt.toISOString().slice(0, 7) // YYYY-MM
        if (!paymentsByMonth[monthKey]) {
          paymentsByMonth[monthKey] = 0
        }
        paymentsByMonth[monthKey] += payment.amount
      }
    }

    // Get payments this month
    const paymentsThisMonth = await prisma.payment.aggregate({
      where: {
        status: 'completed',
        paidAt: {
          gte: startOfMonth
        }
      },
      _sum: {
        amount: true
      }
    })

    // Get pending payments
    const pendingPayments = await prisma.payment.count({
      where: {
        status: 'pending'
      }
    })

    // Get plan distribution
    const planDistribution = await prisma.user.groupBy({
      by: ['planId'],
      _count: {
        id: true
      }
    })

    // Get category stats
    const totalCategories = await prisma.category.count()
    
    // Get notification stats
    const totalNotifications = await prisma.notification.count()
    const unreadNotifications = await prisma.notification.count({
      where: {
        read: false
      }
    })

    // Get overdue subscriptions
    const overdueSubscriptions = await prisma.subscription.count({
      where: {
        status: 'overdue'
      }
    })

    // Get recent users (last 5)
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
        planId: true
      }
    })

    // Get recent payments (last 5)
    const recentPayments = await prisma.payment.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        amount: true,
        currency: true,
        status: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
        plan: {
          select: {
            name: true
          }
        }
      }
    })

    return NextResponse.json({
      users: {
        total: totalUsers,
        newThisMonth: newUsersThisMonth,
        recent: recentUsers
      },
      subscriptions: {
        total: totalSubscriptions,
        active: activeSubscriptions,
        overdue: overdueSubscriptions,
        monthlyAmount: totalMonthlyAmount,
        currencyBreakdown
      },
      payments: {
        totalReceived: totalPaymentsReceived,
        thisMonth: paymentsThisMonth._sum.amount || 0,
        pending: pendingPayments,
        byCurrency: paymentsByCurrency,
        byMonth: paymentsByMonth,
        recent: recentPayments
      },
      plans: {
        distribution: planDistribution
      },
      categories: {
        total: totalCategories
      },
      notifications: {
        total: totalNotifications,
        unread: unreadNotifications
      }
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({ error: 'Failed to fetch admin stats' }, { status: 500 })
  }
}
