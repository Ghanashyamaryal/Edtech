import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured — skipping email send');
    return;
  }

  await resend.emails.send({
    from: `ITpro Entrance <${FROM_EMAIL}>`,
    to,
    subject,
    html,
  });
}

// ============ EMAIL TEMPLATES ============

function baseLayout(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="margin:0;font-size:24px;color:#4F46E5;">ITpro Entrance</h1>
    </div>
    <!-- Content Card -->
    <div style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e4e4e7;">
      ${content}
    </div>
    <!-- Footer -->
    <div style="text-align:center;margin-top:32px;color:#71717a;font-size:12px;">
      <p style="margin:0;">&copy; ${new Date().getFullYear()} ITpro Entrance. All rights reserved.</p>
      <p style="margin:4px 0 0;">Kathmandu, Nepal</p>
    </div>
  </div>
</body>
</html>`;
}

export function welcomeEmailTemplate(name: string) {
  const subject = 'Welcome to ITpro Entrance!';
  const html = baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#18181b;">Welcome, ${name}!</h2>
    <p style="margin:0 0 16px;color:#3f3f46;line-height:1.6;">
      Thank you for joining ITpro Entrance. We're excited to have you on board!
    </p>
    <p style="margin:0 0 24px;color:#3f3f46;line-height:1.6;">
      With your account, you can access courses, study notes, mock tests, and live classes to prepare for your IT entrance exams.
    </p>
    <div style="text-align:center;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard"
         style="display:inline-block;padding:12px 32px;background-color:#4F46E5;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">
        Go to Dashboard
      </a>
    </div>
  `);
  return { subject, html };
}

export function contactMessageAdminTemplate(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const subject = `New Contact Message: ${data.subject}`;
  const html = baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#18181b;">New Contact Form Submission</h2>
    <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
      <tr>
        <td style="padding:8px 0;color:#71717a;width:100px;vertical-align:top;">Name</td>
        <td style="padding:8px 0;color:#18181b;font-weight:500;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#71717a;vertical-align:top;">Email</td>
        <td style="padding:8px 0;color:#18181b;">
          <a href="mailto:${data.email}" style="color:#4F46E5;text-decoration:none;">${data.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#71717a;vertical-align:top;">Subject</td>
        <td style="padding:8px 0;color:#18181b;font-weight:500;">${data.subject}</td>
      </tr>
    </table>
    <div style="padding:16px;background-color:#f4f4f5;border-radius:8px;margin-top:8px;">
      <p style="margin:0 0 4px;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
      <p style="margin:0;color:#18181b;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin"
         style="display:inline-block;padding:12px 32px;background-color:#4F46E5;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">
        View in Admin Panel
      </a>
    </div>
  `);
  return { subject, html };
}

export function newSignupAdminTemplate(data: {
  name: string;
  email: string;
  role: string;
}) {
  const subject = `New Signup: ${data.name}`;
  const html = baseLayout(`
    <h2 style="margin:0 0 16px;font-size:20px;color:#18181b;">New User Registered</h2>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:8px 0;color:#71717a;width:100px;">Name</td>
        <td style="padding:8px 0;color:#18181b;font-weight:500;">${data.name}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#71717a;">Email</td>
        <td style="padding:8px 0;color:#18181b;">
          <a href="mailto:${data.email}" style="color:#4F46E5;text-decoration:none;">${data.email}</a>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#71717a;">Role</td>
        <td style="padding:8px 0;">
          <span style="display:inline-block;padding:2px 10px;background-color:${data.role === 'mentor' ? '#f0fdf4' : '#eef2ff'};color:${data.role === 'mentor' ? '#166534' : '#4338ca'};border-radius:99px;font-size:13px;font-weight:500;">
            ${data.role.charAt(0).toUpperCase() + data.role.slice(1)}
          </span>
        </td>
      </tr>
    </table>
    <div style="text-align:center;margin-top:24px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin"
         style="display:inline-block;padding:12px 32px;background-color:#4F46E5;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;">
        View in Admin Panel
      </a>
    </div>
  `);
  return { subject, html };
}
