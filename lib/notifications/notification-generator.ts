import { prisma } from '../prisma/client';
import {
    sendRenewalReminder,
    sendOverdueNotification,
    sendBudgetWarning,
} from '../email/email-service';
import { addDays, differenceInDays, startOfDay, format } from 'date-fns';

interface NotificationResult {
    notificationsCreated: number;
    emailsSent: number;
    errors: string[];
}

interface NotificationsSent {
    [key: string]: string | undefined;
    '7'?: string; // Date when 7-day reminder was sent (YYYY-MM-DD)
    '3'?: string; // Date when 3-day reminder was sent (YYYY-MM-DD)
    '1'?: string; // Date when 1-day reminder was sent (YYYY-MM-DD)
}

/**
 * Generate renewal reminder notifications for subscriptions due in 7, 3, or 1 day(s)
 * Uses the notificationsSent field to track which reminders have been sent
 */
export async function generateRenewalNotifications(): Promise<NotificationResult> {
    const result: NotificationResult = {
        notificationsCreated: 0,
        emailsSent: 0,
        errors: [],
    };

    try {
        const today = startOfDay(new Date());
        const todayStr = format(today, 'yyyy-MM-dd');

        // Get all active subscriptions with billing dates in the next 8 days
        const subscriptions = await prisma.subscription.findMany({
            where: {
                status: 'active',
                nextBillingDate: {
                    lte: addDays(today, 8),
                    gte: today,
                },
            },
            include: {
                user: true,
            },
        });

        for (const subscription of subscriptions) {
            const billingDate = startOfDay(subscription.nextBillingDate);
            const daysUntil = differenceInDays(billingDate, today);

            // Only process 7, 3, or 1 day reminders
            if (daysUntil !== 7 && daysUntil !== 3 && daysUntil !== 1) {
                continue;
            }

            const daysKey = String(daysUntil);
            const notificationsSent = (subscription.notificationsSent as NotificationsSent) || {};

            // Check if we've already sent this specific reminder
            if (notificationsSent[daysKey]) {
                continue; // Skip if this reminder was already sent
            }

            // Create in-app notification
            try {
                await prisma.notification.create({
                    data: {
                        userId: subscription.userId,
                        subscriptionId: subscription.id,
                        type: 'renewal_reminder',
                        message: `Your ${subscription.name} subscription renews in ${daysUntil} day${daysUntil > 1 ? 's' : ''} (${subscription.currency} ${subscription.amount.toFixed(2)})`,
                    },
                });
                result.notificationsCreated++;
            } catch (error) {
                result.errors.push(`Failed to create notification for subscription ${subscription.id}: ${error}`);
                continue; // Don't update tracking if in-app notification failed
            }

            // Send email if user preferences allow
            let emailSent = false;
            try {
                const emailResult = await sendRenewalReminder(
                    subscription.user,
                    subscription,
                    daysUntil
                );
                if (emailResult.success) {
                    result.emailsSent++;
                    emailSent = true;
                }
            } catch (error) {
                result.errors.push(`Failed to send email for subscription ${subscription.id}: ${error}`);
            }

            // Update tracking - mark this reminder as sent (even if email failed, in-app was sent)
            try {
                const updatedNotificationsSent: NotificationsSent = {
                    ...notificationsSent,
                    [daysKey]: todayStr,
                };

                await prisma.subscription.update({
                    where: { id: subscription.id },
                    data: {
                        notificationsSent: updatedNotificationsSent as Record<string, string>,
                    },
                });
            } catch (error) {
                result.errors.push(`Failed to update tracking for subscription ${subscription.id}: ${error}`);
            }
        }
    } catch (error) {
        result.errors.push(`Error in generateRenewalNotifications: ${error}`);
    }

    return result;
}

/**
 * Generate notifications for overdue subscriptions
 */
export async function generateOverdueNotifications(): Promise<NotificationResult> {
    const result: NotificationResult = {
        notificationsCreated: 0,
        emailsSent: 0,
        errors: [],
    };

    try {
        const today = startOfDay(new Date());

        // Get all subscriptions that are past their billing date and still active
        const overdueSubscriptions = await prisma.subscription.findMany({
            where: {
                status: 'active',
                nextBillingDate: {
                    lt: today,
                },
            },
            include: {
                user: true,
            },
        });

        for (const subscription of overdueSubscriptions) {
            const daysOverdue = differenceInDays(today, startOfDay(subscription.nextBillingDate));

            // Update subscription status to overdue
            try {
                await prisma.subscription.update({
                    where: { id: subscription.id },
                    data: { status: 'overdue' },
                });
            } catch (error) {
                result.errors.push(`Failed to update subscription ${subscription.id} status: ${error}`);
            }

            // Check if we've already sent an overdue notification today
            const existingNotification = await prisma.notification.findFirst({
                where: {
                    userId: subscription.userId,
                    subscriptionId: subscription.id,
                    type: 'overdue',
                    createdAt: {
                        gte: today,
                    },
                },
            });

            if (existingNotification) {
                continue; // Skip if already notified today
            }

            // Create in-app notification
            try {
                await prisma.notification.create({
                    data: {
                        userId: subscription.userId,
                        subscriptionId: subscription.id,
                        type: 'overdue',
                        message: `Your ${subscription.name} subscription is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue (${subscription.currency} ${subscription.amount.toFixed(2)})`,
                    },
                });
                result.notificationsCreated++;
            } catch (error) {
                result.errors.push(`Failed to create overdue notification for subscription ${subscription.id}: ${error}`);
            }

            // Send email if user preferences allow
            try {
                const emailResult = await sendOverdueNotification(
                    subscription.user,
                    subscription,
                    daysOverdue
                );
                if (emailResult.success) {
                    result.emailsSent++;
                }
            } catch (error) {
                result.errors.push(`Failed to send overdue email for subscription ${subscription.id}: ${error}`);
            }
        }
    } catch (error) {
        result.errors.push(`Error in generateOverdueNotifications: ${error}`);
    }

    return result;
}

/**
 * Generate budget warning notifications for categories exceeding 80% of their limit
 */
export async function generateBudgetWarnings(): Promise<NotificationResult> {
    const result: NotificationResult = {
        notificationsCreated: 0,
        emailsSent: 0,
        errors: [],
    };

    try {
        const today = startOfDay(new Date());

        // Get all categories with budget limits
        const categories = await prisma.category.findMany({
            where: {
                budgetLimit: {
                    not: null,
                },
            },
            include: {
                user: true,
                subscriptions: {
                    where: {
                        status: {
                            in: ['active', 'overdue'],
                        },
                    },
                },
            },
        });

        for (const category of categories) {
            if (!category.budgetLimit) continue;
            const budgetLimit = category.budgetLimit;

            // Calculate total monthly spending for this category
            const monthlySpending = category.subscriptions.reduce((total, sub) => {
                let monthlyAmount = sub.amount;

                // Convert to monthly amount based on billing cycle
                if (sub.billingCycle === 'annual') {
                    monthlyAmount = sub.amount / 12;
                } else if (sub.billingCycle === 'custom' && sub.customDays) {
                    monthlyAmount = (sub.amount / sub.customDays) * 30;
                }

                return total + monthlyAmount;
            }, 0);

            const percentageUsed = (monthlySpending / budgetLimit) * 100;

            // Only send warning if spending is at or above 80%
            if (percentageUsed < 80) {
                continue;
            }

            // Check if we've already sent a budget warning today
            const existingNotification = await prisma.notification.findFirst({
                where: {
                    userId: category.userId,
                    type: 'budget_warning',
                    message: {
                        contains: category.name,
                    },
                    createdAt: {
                        gte: today,
                    },
                },
            });

            if (existingNotification) {
                continue; // Skip if already notified today
            }

            // Create in-app notification
            try {
                await prisma.notification.create({
                    data: {
                        userId: category.userId,
                        type: 'budget_warning',
                        message: `Budget warning: ${category.name} category is at ${percentageUsed.toFixed(0)}% of your ${category.user.currency} ${budgetLimit.toFixed(2)} limit`,
                    },
                });
                result.notificationsCreated++;
            } catch (error) {
                result.errors.push(`Failed to create budget warning for category ${category.id}: ${error}`);
            }

            // Send email if user preferences allow
            try {
                const emailResult = await sendBudgetWarning(
                    category.user,
                    { ...category, budgetLimit },
                    monthlySpending
                );
                if (emailResult.success) {
                    result.emailsSent++;
                }
            } catch (error) {
                result.errors.push(`Failed to send budget warning email for category ${category.id}: ${error}`);
            }
        }
    } catch (error) {
        result.errors.push(`Error in generateBudgetWarnings: ${error}`);
    }

    return result;
}

/**
 * Reset notification tracking when a subscription is renewed
 * This should be called when updating nextBillingDate after a payment
 */
export async function resetNotificationTracking(subscriptionId: string): Promise<void> {
    try {
        await prisma.subscription.update({
            where: { id: subscriptionId },
            data: {
                notificationsSent: {},
            },
        });
    } catch (error) {
        console.error(`Failed to reset notification tracking for subscription ${subscriptionId}:`, error);
    }
}
