import { startNotificationPolling } from './polling-service';

let initialized = false;

/**
 * Initialize the notification polling service
 * This is a singleton - will only run once even if called multiple times
 */
export function initNotificationPolling(): void {
    if (initialized) {
        return;
    }

    // Only run on server side
    if (typeof window !== 'undefined') {
        return;
    }

    initialized = true;

    // Check if polling is enabled via environment variable
    const pollingEnabled = process.env.NOTIFICATION_POLLING_ENABLED !== 'false';
    const pollingInterval = parseInt(process.env.NOTIFICATION_POLLING_INTERVAL_MS || '3600000', 10);

    if (pollingEnabled) {
        console.log('[NotificationInit] Starting notification polling service...');
        startNotificationPolling({
            intervalMs: pollingInterval,
            enabled: true,
        });
    } else {
        console.log('[NotificationInit] Notification polling is disabled. Set NOTIFICATION_POLLING_ENABLED=true to enable.');
    }
}
