import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface RenewalReminderEmailProps {
    userName: string;
    subscriptionName: string;
    amount: number;
    currency: string;
    daysUntil: number;
    nextBillingDate: string;
}

export const RenewalReminderEmail = ({
    userName,
    subscriptionName,
    amount,
    currency,
    daysUntil,
    nextBillingDate,
}: RenewalReminderEmailProps) => {
    const previewText = `Your ${subscriptionName} subscription renews in ${daysUntil} day${daysUntil > 1 ? 's' : ''}`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Subscription Renewal Reminder</Heading>
                    <Text style={text}>Hi {userName},</Text>
                    <Text style={text}>
                        This is a friendly reminder that your <strong>{subscriptionName}</strong> subscription
                        will renew in <strong>{daysUntil} day{daysUntil > 1 ? 's' : ''}</strong>.
                    </Text>
                    <Section style={infoBox}>
                        <Text style={infoText}>
                            <strong>Amount:</strong> {currency} {amount.toFixed(2)}
                        </Text>
                        <Text style={infoText}>
                            <strong>Next Billing Date:</strong> {nextBillingDate}
                        </Text>
                    </Section>
                    <Text style={text}>
                        If you need to make any changes to your subscription, please log in to your account.
                    </Text>
                    <Button style={button} href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}>
                        View Dashboard
                    </Button>
                    <Text style={footer}>
                        You're receiving this email because you have email notifications enabled for subscription renewals.
                        You can manage your notification preferences in your account settings.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

interface OverdueNotificationEmailProps {
    userName: string;
    subscriptionName: string;
    amount: number;
    currency: string;
    daysOverdue: number;
}

export const OverdueNotificationEmail = ({
    userName,
    subscriptionName,
    amount,
    currency,
    daysOverdue,
}: OverdueNotificationEmailProps) => {
    const previewText = `Your ${subscriptionName} subscription is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Overdue Subscription Notice</Heading>
                    <Text style={text}>Hi {userName},</Text>
                    <Text style={text}>
                        Your <strong>{subscriptionName}</strong> subscription is now{' '}
                        <strong style={{ color: '#ef4444' }}>
                            {daysOverdue} day{daysOverdue > 1 ? 's' : ''} overdue
                        </strong>.
                    </Text>
                    <Section style={infoBox}>
                        <Text style={infoText}>
                            <strong>Amount:</strong> {currency} {amount.toFixed(2)}
                        </Text>
                    </Section>
                    <Text style={text}>
                        Please review your subscription and take appropriate action to avoid service interruption.
                    </Text>
                    <Button style={button} href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}>
                        View Subscription
                    </Button>
                    <Text style={footer}>
                        You're receiving this email because you have email notifications enabled for overdue subscriptions.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

interface DailyDigestEmailProps {
    userName: string;
    upcomingRenewals: Array<{
        name: string;
        amount: number;
        currency: string;
        daysUntil: number;
    }>;
    overdueSubscriptions: Array<{
        name: string;
        amount: number;
        currency: string;
        daysOverdue: number;
    }>;
    totalMonthlySpend: number;
    currency: string;
}

export const DailyDigestEmail = ({
    userName,
    upcomingRenewals,
    overdueSubscriptions,
    totalMonthlySpend,
    currency,
}: DailyDigestEmailProps) => {
    const previewText = 'Your daily subscription digest';

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Daily Subscription Digest</Heading>
                    <Text style={text}>Hi {userName},</Text>
                    <Text style={text}>Here's your daily subscription summary:</Text>

                    <Section style={section}>
                        <Heading style={h2}>Total Monthly Spend</Heading>
                        <Text style={largeText}>
                            {currency} {totalMonthlySpend.toFixed(2)}
                        </Text>
                    </Section>

                    {upcomingRenewals.length > 0 && (
                        <Section style={section}>
                            <Heading style={h2}>Upcoming Renewals</Heading>
                            {upcomingRenewals.map((sub, index) => (
                                <Text key={index} style={listItem}>
                                    • <strong>{sub.name}</strong> - {sub.currency} {sub.amount.toFixed(2)} in {sub.daysUntil} day
                                    {sub.daysUntil > 1 ? 's' : ''}
                                </Text>
                            ))}
                        </Section>
                    )}

                    {overdueSubscriptions.length > 0 && (
                        <Section style={section}>
                            <Heading style={h2}>Overdue Subscriptions</Heading>
                            {overdueSubscriptions.map((sub, index) => (
                                <Text key={index} style={{ ...listItem, color: '#ef4444' }}>
                                    • <strong>{sub.name}</strong> - {sub.currency} {sub.amount.toFixed(2)} ({sub.daysOverdue} day
                                    {sub.daysOverdue > 1 ? 's' : ''} overdue)
                                </Text>
                            ))}
                        </Section>
                    )}

                    <Button style={button} href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}>
                        View Dashboard
                    </Button>
                    <Text style={footer}>
                        You're receiving this daily digest because you have it enabled in your notification preferences.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

interface BudgetWarningEmailProps {
    userName: string;
    categoryName: string;
    budgetLimit: number;
    currentSpending: number;
    currency: string;
    percentageUsed: number;
}

export const BudgetWarningEmail = ({
    userName,
    categoryName,
    budgetLimit,
    currentSpending,
    currency,
    percentageUsed,
}: BudgetWarningEmailProps) => {
    const previewText = `Budget warning for ${categoryName} category`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Budget Warning</Heading>
                    <Text style={text}>Hi {userName},</Text>
                    <Text style={text}>
                        Your spending in the <strong>{categoryName}</strong> category has reached{' '}
                        <strong style={{ color: '#f59e0b' }}>{percentageUsed.toFixed(0)}%</strong> of your budget limit.
                    </Text>
                    <Section style={infoBox}>
                        <Text style={infoText}>
                            <strong>Budget Limit:</strong> {currency} {budgetLimit.toFixed(2)}
                        </Text>
                        <Text style={infoText}>
                            <strong>Current Spending:</strong> {currency} {currentSpending.toFixed(2)}
                        </Text>
                        <Text style={infoText}>
                            <strong>Remaining:</strong> {currency} {(budgetLimit - currentSpending).toFixed(2)}
                        </Text>
                    </Section>
                    <Text style={text}>
                        Consider reviewing your subscriptions in this category to stay within your budget.
                    </Text>
                    <Button style={button} href={process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}>
                        View Categories
                    </Button>
                    <Text style={footer}>
                        You're receiving this email because you have budget warning notifications enabled.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
    maxWidth: '600px',
};

const h1 = {
    color: '#1f2937',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0 20px',
    padding: '0 40px',
};

const h2 = {
    color: '#374151',
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '20px 0 10px',
};

const text = {
    color: '#4b5563',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '16px 0',
    padding: '0 40px',
};

const largeText = {
    color: '#1f2937',
    fontSize: '32px',
    fontWeight: 'bold',
    lineHeight: '40px',
    margin: '16px 0',
};

const infoBox = {
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    margin: '24px 40px',
    padding: '20px',
};

const infoText = {
    color: '#374151',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '8px 0',
};

const section = {
    margin: '24px 40px',
};

const listItem = {
    color: '#4b5563',
    fontSize: '14px',
    lineHeight: '20px',
    margin: '8px 0',
};

const button = {
    backgroundColor: '#3b82f6',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    textDecoration: 'none',
    textAlign: 'center' as const,
    display: 'block',
    padding: '12px 20px',
    margin: '24px 40px',
};

const footer = {
    color: '#6b7280',
    fontSize: '12px',
    lineHeight: '16px',
    margin: '32px 0 0',
    padding: '0 40px',
};

interface PasswordResetEmailProps {
    userName: string;
    resetUrl: string;
}

export const PasswordResetEmail = ({
    userName,
    resetUrl,
}: PasswordResetEmailProps) => {
    const previewText = 'Reset your SubTrack password';

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Reset Your Password</Heading>
                    <Text style={text}>Hi {userName},</Text>
                    <Text style={text}>
                        We received a request to reset your password. Click the button below to create a new password:
                    </Text>
                    <Button style={button} href={resetUrl}>
                        Reset Password
                    </Button>
                    <Text style={text}>
                        Or copy and paste this link into your browser:
                    </Text>
                    <Text style={{ ...text, fontSize: '14px', wordBreak: 'break-all' }}>
                        {resetUrl}
                    </Text>
                    <Text style={text}>
                        This link will expire in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email.
                    </Text>
                    <Text style={footer}>
                        You're receiving this email because a password reset was requested for your SubTrack account.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
};
