export interface User {
    id: string
    name: string | null
    email: string
    emailVerified: Date | null
    password: string
    image: string | null
    currency: string
    monthlyBudget: number | null
    createdAt: Date
    updatedAt: Date
}

export interface Category {
    id: string
    userId: string
    name: string
    color: string
    icon: string | null
    budgetLimit: number | null
    createdAt: Date
    updatedAt: Date
}

export interface Subscription {
    id: string
    userId: string
    name: string
    amount: number
    currency: string
    billingCycle: 'monthly' | 'annual' | 'custom'
    customDays: number | null
    nextBillingDate: Date
    status: 'active' | 'cancelled' | 'overdue' | 'scheduled'
    categoryId: string | null
    familyMember: string | null
    logo: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
}

export interface Notification {
    id: string
    userId: string
    subscriptionId: string | null
    type: 'renewal_reminder' | 'overdue' | 'budget_warning' | 'digest'
    message: string
    read: boolean
    createdAt: Date
}

// Extended types with relations
export interface SubscriptionWithCategory extends Subscription {
    category: Category | null
}

export interface CategoryWithSubscriptions extends Category {
    subscriptions: Subscription[]
}

export interface NotificationWithSubscription extends Notification {
    subscription: Subscription | null
}
