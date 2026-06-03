import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/options';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const PROFILE_COLUMNS = {
    name: users.name,
    email: users.email,
    currency: users.currency,
    monthlyBudget: users.monthlyBudget,
} as const;

export async function GET(_request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [user] = await db
            .select(PROFILE_COLUMNS)
            .from(users)
            .where(eq(users.email, session.user.email))
            .limit(1);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
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

        const { name, currency, monthlyBudget } = body as {
            name?: string;
            currency?: string;
            monthlyBudget?: number | null;
        };

        const updateData: Partial<{
            name: string | null;
            currency: string;
            monthlyBudget: number | null;
        }> = {};

        if (name !== undefined) {
            if (typeof name !== 'string' || name.trim().length === 0) {
                return NextResponse.json(
                    { error: 'Invalid value for name' },
                    { status: 400 }
                );
            }
            updateData.name = name.trim();
        }

        if (currency !== undefined) {
            if (typeof currency !== 'string' || currency.trim().length === 0) {
                return NextResponse.json(
                    { error: 'Invalid value for currency' },
                    { status: 400 }
                );
            }
            updateData.currency = currency.trim().toUpperCase();
        }

        if (monthlyBudget !== undefined) {
            if (monthlyBudget !== null && (typeof monthlyBudget !== 'number' || monthlyBudget < 0)) {
                return NextResponse.json(
                    { error: 'Invalid value for monthlyBudget' },
                    { status: 400 }
                );
            }
            updateData.monthlyBudget = monthlyBudget;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: 'No valid fields provided for update' },
                { status: 400 }
            );
        }

        const [updatedUser] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.email, session.user.email))
            .returning(PROFILE_COLUMNS);

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
