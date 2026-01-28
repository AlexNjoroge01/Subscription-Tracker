import { NextRequest, NextResponse } from 'next/server';
import {
    generateRenewalNotifications,
    generateOverdueNotifications,
    generateBudgetWarnings,
} from '@/lib/notifications/notification-generator';

export async function POST(request: NextRequest) {
    try {
        // Verify the cron secret for security
        const authHeader = request.headers.get('authorization');
        const token = authHeader?.replace('Bearer ', '');

        if (!process.env.CRON_SECRET) {
            return NextResponse.json(
                { error: 'CRON_SECRET not configured' },
                { status: 500 }
            );
        }

        if (token !== process.env.CRON_SECRET) {
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
        console.error('Error in cron job:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        );
    }
}
