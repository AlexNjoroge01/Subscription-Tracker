import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notificationPreferencesSchema } from '@/schemas/preferences-schema';

const PREF_COLUMNS = {
    emailNotificationsEnabled: users.emailNotificationsEnabled,
    notifySevenDays: users.notifySevenDays,
    notifyThreeDays: users.notifyThreeDays,
    notifyOneDay: users.notifyOneDay,
    notifyOverdue: users.notifyOverdue,
    notifyBudgetWarning: users.notifyBudgetWarning,
    dailyDigestEnabled: users.dailyDigestEnabled,
} as const;

export async function GET(_request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [user] = await db
            .select(PREF_COLUMNS)
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching preferences:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const validationResult = notificationPreferencesSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const preferences = validationResult.data;

        const [updatedUser] = await db
            .update(users)
            .set({
                emailNotificationsEnabled: preferences.emailNotificationsEnabled,
                notifySevenDays: preferences.notifySevenDays,
                notifyThreeDays: preferences.notifyThreeDays,
                notifyOneDay: preferences.notifyOneDay,
                notifyOverdue: preferences.notifyOverdue,
                notifyBudgetWarning: preferences.notifyBudgetWarning,
                dailyDigestEnabled: preferences.dailyDigestEnabled,
            })
            .where(eq(users.email, session.user.email))
            .returning(PREF_COLUMNS);

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating preferences:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
