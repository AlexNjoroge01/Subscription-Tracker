import { z } from 'zod';

export const notificationPreferencesSchema = z.object({
    emailNotificationsEnabled: z.boolean(),
    notifySevenDays: z.boolean(),
    notifyThreeDays: z.boolean(),
    notifyOneDay: z.boolean(),
    notifyOverdue: z.boolean(),
    notifyBudgetWarning: z.boolean(),
    dailyDigestEnabled: z.boolean(),
});

export type NotificationPreferences = z.infer<typeof notificationPreferencesSchema>;
