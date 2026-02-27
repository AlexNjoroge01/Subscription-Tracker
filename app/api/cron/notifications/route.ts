import { NextRequest, NextResponse } from 'next/server';
import {
    generateRenewalNotifications,
    generateOverdueNotifications,
    generateBudgetWarnings,
} from '@/lib/notifications/notification-generator';

/**
 * POST /api/cron/notifications
 * 
 * This endpoint triggers a manual notification check.
 * It can be called by external cron services or manually.
 * 
 * Note: The notification polling service now runs automatically in the background
 * when NOTIFICATION_POLLING_ENABLED is set to 'true' (default).
 * This endpoint is provided for:
 * 1. Manual triggering via external schedulers (e.g., cron-job.org, AWS EventBridge)
 * 2. Immediate checks when you don't want to wait for the next poll interval
 * 3. Serverless environments where background polling doesn't persist
 */
export async function POST(request: NextRequest) {
    try {
        // Optional: Verify authorization if CRON_SECRET is configured
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (process.env.CRON_SECRET && token !== process.env.CRON_SECRET) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Run all notification generators
        const [renewalResults, overdueResults, budgetResults] = await Promise.all([
            generateRenewalNotifications(),
            generateOverdueNotifications(),
            generateBudgetWarnings(),
        ]);

        // Combine results
        const totalNotifications =
            renewalResults.notificationsCreated +
            overdueResults.notificationsCreated +
            budgetResults.notificationsCreated;

        const totalEmails =
            renewalResults.emailsSent +
            overdueResults.emailsSent +
            budgetResults.emailsSent;

        const allErrors = [
            ...renewalResults.errors,
            ...overdueResults.errors,
            ...budgetResults.errors,
        ];

        return NextResponse.json({
            success: true,
            summary: {
                totalNotifications,
                totalEmails,
                errorCount: allErrors.length,
            },
            details: {
                renewals: {
                    notificationsCreated: renewalResults.notificationsCreated,
                    emailsSent: renewalResults.emailsSent,
                    errors: renewalResults.errors,
                },
                overdue: {
                    notificationsCreated: overdueResults.notificationsCreated,
                    emailsSent: overdueResults.emailsSent,
                    errors: overdueResults.errors,
                },
                budgetWarnings: {
                    notificationsCreated: budgetResults.notificationsCreated,
                    emailsSent: budgetResults.emailsSent,
                    errors: budgetResults.errors,
                },
            },
        });
    } catch (error) {
        console.error('Error in notification endpoint:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * GET /api/cron/notifications
 * 
 * Returns the current status of the notification system
 */
export async function GET() {
    return NextResponse.json({
        status: 'active',
        polling: {
            enabled: process.env.NOTIFICATION_POLLING_ENABLED !== 'false',
            intervalMs: parseInt(process.env.NOTIFICATION_POLLING_INTERVAL_MS || '3600000', 10),
            note: 'Background polling runs automatically when enabled. Use POST to trigger manually.',
        },
        tracking: {
            method: 'notificationsSent JSON field on Subscription model',
            description: 'Tracks which 7/3/1 day reminders have been sent per subscription',
        },
    });
}
