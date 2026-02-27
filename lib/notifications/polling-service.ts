import {
    generateRenewalNotifications,
    generateOverdueNotifications,
    generateBudgetWarnings,
} from './notification-generator';

interface PollingConfig {
    intervalMs: number;
    enabled: boolean;
}

const DEFAULT_CONFIG: PollingConfig = {
    intervalMs: 60 * 60 * 1000, // Check every hour
    enabled: true,
};

let pollingInterval: NodeJS.Timeout | null = null;
let isRunning = false;

/**
 * Run all notification generators
 */
async function runNotificationCheck(): Promise<void> {
    if (isRunning) {
        console.log('[NotificationPolling] Previous check still running, skipping...');
        return;
    }

    isRunning = true;
    const startTime = Date.now();

    try {
        console.log('[NotificationPolling] Starting notification check...');

        const [renewalResults, overdueResults, budgetResults] = await Promise.all([
            generateRenewalNotifications(),
            generateOverdueNotifications(),
            generateBudgetWarnings(),
        ]);

        const totalNotifications =
            renewalResults.notificationsCreated +
            overdueResults.notificationsCreated +
            budgetResults.notificationsCreated;

        const totalEmails =
            renewalResults.emailsSent +
            overdueResults.emailsSent +
            budgetResults.emailsSent;

        const totalErrors = [
            ...renewalResults.errors,
            ...overdueResults.errors,
            ...budgetResults.errors,
        ];

        const duration = Date.now() - startTime;

        console.log('[NotificationPolling] Check completed:', {
            duration: `${duration}ms`,
            notificationsCreated: totalNotifications,
            emailsSent: totalEmails,
            errors: totalErrors.length,
            details: {
                renewals: {
                    notifications: renewalResults.notificationsCreated,
                    emails: renewalResults.emailsSent,
                },
                overdue: {
                    notifications: overdueResults.notificationsCreated,
                    emails: overdueResults.emailsSent,
                },
                budgetWarnings: {
                    notifications: budgetResults.notificationsCreated,
                    emails: budgetResults.emailsSent,
                },
            },
        });

        if (totalErrors.length > 0) {
            console.error('[NotificationPolling] Errors encountered:', totalErrors);
        }
    } catch (error) {
        console.error('[NotificationPolling] Fatal error during check:', error);
    } finally {
        isRunning = false;
    }
}

/**
 * Start the notification polling service
 */
export function startNotificationPolling(config: Partial<PollingConfig> = {}): void {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };

    if (!finalConfig.enabled) {
        console.log('[NotificationPolling] Polling is disabled');
        return;
    }

    if (pollingInterval) {
        console.log('[NotificationPolling] Polling already running, stopping first...');
        stopNotificationPolling();
    }

    console.log(`[NotificationPolling] Starting with interval: ${finalConfig.intervalMs}ms`);

    // Run immediately on start
    runNotificationCheck();

    // Schedule recurring checks
    pollingInterval = setInterval(runNotificationCheck, finalConfig.intervalMs);
}

/**
 * Stop the notification polling service
 */
export function stopNotificationPolling(): void {
    if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
        console.log('[NotificationPolling] Stopped');
    }
}

/**
 * Check if polling is currently active
 */
export function isPollingActive(): boolean {
    return pollingInterval !== null;
}

/**
 * Trigger a manual notification check
 */
export async function triggerManualCheck(): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        await runNotificationCheck();
        return {
            success: true,
            message: 'Manual notification check completed',
        };
    } catch (error) {
        return {
            success: false,
            message: `Manual check failed: ${error}`,
        };
    }
}
