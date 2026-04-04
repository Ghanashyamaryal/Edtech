'use server';

import {
  sendEmail,
  welcomeEmailTemplate,
  contactMessageAdminTemplate,
  newSignupAdminTemplate,
} from '@/lib/email';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'itproentrance@gmail.com';

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const { subject, html } = welcomeEmailTemplate(name);
    await sendEmail({ to: email, subject, html });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
}

export async function sendSignupNotificationToAdmin(data: {
  name: string;
  email: string;
  role: string;
}) {
  try {
    const { subject, html } = newSignupAdminTemplate(data);
    await sendEmail({ to: ADMIN_EMAIL, subject, html });
  } catch (error) {
    console.error('Failed to send signup notification to admin:', error);
  }
}

export async function sendContactMessageToAdmin(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const { subject, html } = contactMessageAdminTemplate(data);
    await sendEmail({ to: ADMIN_EMAIL, subject, html });
  } catch (error) {
    console.error('Failed to send contact message to admin:', error);
  }
}
