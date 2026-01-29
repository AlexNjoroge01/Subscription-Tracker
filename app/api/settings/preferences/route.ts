import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { PrismaClient } from '@/app/generated/prisma/client';
import { notificationPreferencesSchema } from '@/schemas/preferences-schema';
import { prisma } from '@/lib/prisma/client';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            select: {
                emailNotificationsEnabled: true,
                notifySevenDays: true,
                notifyThreeDays: true,
                notifyOneDay: true,
                notifyOverdue: true,
                notifyBudgetWarning: true,
                dailyDigestEnabled: true,
            },
        });

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

        // Validate the request body
        const validationResult = notificationPreferencesSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                { error: 'Invalid request body', details: validationResult.error.issues },
                { status: 400 }
            );
        }

        const preferences = validationResult.data;

        // Update user preferences
        const updatedUser = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                emailNotificationsEnabled: preferences.emailNotificationsEnabled,
                notifySevenDays: preferences.notifySevenDays,
                notifyThreeDays: preferences.notifyThreeDays,
                notifyOneDay: preferences.notifyOneDay,
                notifyOverdue: preferences.notifyOverdue,
                notifyBudgetWarning: preferences.notifyBudgetWarning,
                dailyDigestEnabled: preferences.dailyDigestEnabled,
            },
            select: {
                emailNotificationsEnabled: true,
                notifySevenDays: true,
                notifyThreeDays: true,
                notifyOneDay: true,
                notifyOverdue: true,
                notifyBudgetWarning: true,
                dailyDigestEnabled: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating preferences:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
