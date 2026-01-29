import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY;

export const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendEmail({
    to,
    subject,
    react,
}: {
    to: string;
    subject: string;
    react: React.ReactElement;
}) {
    try {
        if (!resend) {
            console.error('Resend client not initialized. Check RESEND_API_KEY.');
            return { success: false, error: new Error('Resend client not initialized') };
        }

        const { data, error } = await resend.emails.send({
            from: 'Subscription Tracker <onboarding@resend.dev>',
            to,
            subject,
            react,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error };
        }

        console.log('Email sent successfully:', data);
        return { success: true, data };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
}
