import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

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
        const { data, error } = await resend.emails.send({
            from: 'Subscription Tracker <onboarding@resend.dev>',
            to: 'alexnjoroge102@gmail.com',
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
