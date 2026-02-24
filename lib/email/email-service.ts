import { sendEmail } from './resend';
import {
    RenewalReminderEmail,
    OverdueNotificationEmail,
    DailyDigestEmail,
    BudgetWarningEmail,
    PasswordResetEmail,
} from './templates';
import { format } from 'date-fns';

interface User {
    id: string;
    name: string | null;
    email: string;
    emailNotificationsEnabled: boolean;
    notifySevenDays: boolean;
    notifyThreeDays: boolean;
    notifyOneDay: boolean;
    notifyOverdue: boolean;
    notifyBudgetWarning: boolean;
    dailyDigestEnabled: boolean;
    currency: string;
}

interface Subscription {
    id: string;
    name: string;
    amount: number;
    currency: string;
    nextBillingDate: Date;
}

export async function sendRenewalReminder(
    user: User,
    subscription: Subscription,
    daysUntil: number
) {
    // Check if user has email notifications enabled
    if (!user.emailNotificationsEnabled) {
        return { success: false, reason: 'Email notifications disabled' };
    }

    // Check if user wants this specific reminder
    if (
        (daysUntil === 7 && !user.notifySevenDays) ||
        (daysUntil === 3 && !user.notifyThreeDays) ||
        (daysUntil === 1 && !user.notifyOneDay)
    ) {
        return { success: false, reason: 'User preference disabled for this reminder' };
    }

    const emailContent = RenewalReminderEmail({
        userName: user.name || 'there',
        subscriptionName: subscription.name,
        amount: subscription.amount,
        currency: subscription.currency,
        daysUntil,
        nextBillingDate: format(subscription.nextBillingDate, 'MMMM d, yyyy'),
    });

    return await sendEmail({
        to: user.email,
        subject: `Reminder: ${subscription.name} renews in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`,
        react: emailContent,
    });
}

export async function sendOverdueNotification(
    user: User,
    subscription: Subscription,
    daysOverdue: number
) {
    // Check if user has email notifications enabled
    if (!user.emailNotificationsEnabled || !user.notifyOverdue) {
        return { success: false, reason: 'Overdue notifications disabled' };
    }

    const emailContent = OverdueNotificationEmail({
        userName: user.name || 'there',
        subscriptionName: subscription.name,
        amount: subscription.amount,
        currency: subscription.currency,
        daysOverdue,
    });

    return await sendEmail({
        to: user.email,
        subject: `Overdue: ${subscription.name} subscription`,
        react: emailContent,
    });
}

interface DigestSubscription {
    name: string;
    amount: number;
    currency: string;
    daysUntil?: number;
    daysOverdue?: number;
}

export async function sendDailyDigest(
    user: User,
    upcomingRenewals: DigestSubscription[],
    overdueSubscriptions: DigestSubscription[],
    totalMonthlySpend: number
) {
    // Check if user has daily digest enabled
    if (!user.emailNotificationsEnabled || !user.dailyDigestEnabled) {
        return { success: false, reason: 'Daily digest disabled' };
    }

    const emailContent = DailyDigestEmail({
        userName: user.name || 'there',
        upcomingRenewals: upcomingRenewals.map((sub) => ({
            name: sub.name,
            amount: sub.amount,
            currency: sub.currency,
            daysUntil: sub.daysUntil || 0,
        })),
        overdueSubscriptions: overdueSubscriptions.map((sub) => ({
            name: sub.name,
            amount: sub.amount,
            currency: sub.currency,
            daysOverdue: sub.daysOverdue || 0,
        })),
        totalMonthlySpend,
        currency: user.currency,
    });

    return await sendEmail({
        to: user.email,
        subject: 'Your Daily Subscription Digest',
        react: emailContent,
    });
}

interface Category {
    id: string;
    name: string;
    budgetLimit: number;
}

export async function sendBudgetWarning(
    user: User,
    category: Category,
    currentSpending: number
) {
    // Check if user has budget warnings enabled
    if (!user.emailNotificationsEnabled || !user.notifyBudgetWarning) {
        return { success: false, reason: 'Budget warnings disabled' };
    }

    const percentageUsed = (currentSpending / category.budgetLimit) * 100;

    const emailContent = BudgetWarningEmail({
        userName: user.name || 'there',
        categoryName: category.name,
        budgetLimit: category.budgetLimit,
        currentSpending,
        currency: user.currency,
        percentageUsed,
    });

    return await sendEmail({
        to: user.email,
        subject: `Budget Warning: ${category.name} category`,
        react: emailContent,
    });
}

export async function sendPasswordResetEmail(
    email: string,
    resetUrl: string,
    userName?: string
) {
    const emailContent = PasswordResetEmail({
        userName: userName || 'there',
        resetUrl,
    });

    return await sendEmail({
        to: email,
        subject: 'Reset your SubTrack password',
        react: emailContent,
    });
}
