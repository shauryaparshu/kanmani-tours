import { NextRequest, NextResponse } from 'next/server';
import { escapeHtml } from '@/lib/server/escapeHtml';
import { getClientIp, isRateLimited } from '@/lib/server/rateLimit';

const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  subject: 150,
  message: 5000,
};

// 5 submissions per IP per 10 minutes.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function field(body: Record<string, unknown>, key: string): string {
  const value = body[key];
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  if (isRateLimited(`contact:${getClientIp(request)}`, RATE_LIMIT, RATE_WINDOW_MS)) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait a few minutes and try again.' },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field. Pretend success so bots don't retry.
  if (field(body, 'website')) {
    return NextResponse.json({ success: true });
  }

  const name = field(body, 'name');
  const email = field(body, 'email');
  const phone = field(body, 'phone');
  const subject = field(body, 'subject').replace(/[\r\n]+/g, ' ');
  const message = field(body, 'message');

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Name, email and message are required' },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
  }
  if (
    name.length > LIMITS.name ||
    email.length > LIMITS.email ||
    phone.length > LIMITS.phone ||
    subject.length > LIMITS.subject ||
    message.length > LIMITS.message
  ) {
    return NextResponse.json({ error: 'One or more fields are too long' }, { status: 400 });
  }

  const { GOOGLE_SHEET_WEBHOOK, RESEND_API_KEY, CONTACT_EMAIL } = process.env;
  if (!GOOGLE_SHEET_WEBHOOK || !RESEND_API_KEY || !CONTACT_EMAIL) {
    console.error('Contact form: GOOGLE_SHEET_WEBHOOK, RESEND_API_KEY or CONTACT_EMAIL is not set');
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone || 'Not provided'),
    subject: escapeHtml(subject || 'General'),
    message: escapeHtml(message).replace(/\n/g, '<br>'),
  };

  const [sheetResult, emailResult] = await Promise.allSettled([

    // Send to Google Sheets
    fetch(GOOGLE_SHEET_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, subject, message }),
    }),

    // Send email via Resend
    fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Kanmani Tours <onboarding@resend.dev>',
        to: [CONTACT_EMAIL],
        reply_to: email,
        subject: `New Enquiry: ${subject || 'Contact Form'} — ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1C1917; padding: 24px; border-bottom: 3px solid #C9933A;">
              <h1 style="color: #F5F1EB; font-size: 20px; margin: 0;">
                New Enquiry — Kanmani Tours
              </h1>
            </div>
            <div style="padding: 32px; background: #FAFAF7;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #E8E4DC;">
                  <td style="padding: 12px 0; color: #6B6560; font-size: 13px; width: 120px;">Name</td>
                  <td style="padding: 12px 0; color: #1C1917; font-weight: 600;">${safe.name}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E8E4DC;">
                  <td style="padding: 12px 0; color: #6B6560; font-size: 13px;">Email</td>
                  <td style="padding: 12px 0; color: #1C1917;">${safe.email}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E8E4DC;">
                  <td style="padding: 12px 0; color: #6B6560; font-size: 13px;">Phone</td>
                  <td style="padding: 12px 0; color: #1C1917;">${safe.phone}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E8E4DC;">
                  <td style="padding: 12px 0; color: #6B6560; font-size: 13px;">Subject</td>
                  <td style="padding: 12px 0; color: #C9933A; font-weight: 600;">${safe.subject}</td>
                </tr>
              </table>
              <div style="margin-top: 24px; padding: 20px; background: white; border-left: 3px solid #C9933A;">
                <p style="color: #6B6560; font-size: 13px; margin: 0 0 8px;">Message</p>
                <p style="color: #1C1917; line-height: 1.7; margin: 0;">${safe.message}</p>
              </div>
              <div style="margin-top: 24px; text-align: center;">
                <a href="mailto:${safe.email}"
                   style="background: #C9933A; color: #1C1917; padding: 12px 28px;
                          text-decoration: none; font-weight: 600; font-size: 13px;
                          letter-spacing: 0.1em; display: inline-block;">
                  REPLY TO ${escapeHtml(name.toUpperCase())}
                </a>
              </div>
            </div>
          </div>
        `,
      }),
    }),
  ]);

  // fetch() resolves even on 4xx/5xx, so check the HTTP status too.
  const sheetOk = sheetResult.status === 'fulfilled' && sheetResult.value.ok;
  const emailOk = emailResult.status === 'fulfilled' && emailResult.value.ok;

  if (!sheetOk) {
    console.error('Contact form: Google Sheet delivery failed',
      sheetResult.status === 'fulfilled' ? sheetResult.value.status : sheetResult.reason);
  }
  if (!emailOk) {
    console.error('Contact form: Resend email delivery failed',
      emailResult.status === 'fulfilled' ? emailResult.value.status : emailResult.reason);
  }

  // The enquiry is safe as long as one channel recorded it.
  if (!sheetOk && !emailOk) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
