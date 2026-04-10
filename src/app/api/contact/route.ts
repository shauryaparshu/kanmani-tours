import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email and message are required' },
        { status: 400 }
      );
    }

    const results = await Promise.allSettled([

      // Send to Google Sheets
      fetch(process.env.GOOGLE_SHEET_WEBHOOK!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      }),

      // Send email via Resend
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Kanmani Tours <onboarding@resend.dev>',
          to: [process.env.CONTACT_EMAIL!],
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
                    <td style="padding: 12px 0; color: #1C1917; font-weight: 600;">${name}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #E8E4DC;">
                    <td style="padding: 12px 0; color: #6B6560; font-size: 13px;">Email</td>
                    <td style="padding: 12px 0; color: #1C1917;">${email}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #E8E4DC;">
                    <td style="padding: 12px 0; color: #6B6560; font-size: 13px;">Phone</td>
                    <td style="padding: 12px 0; color: #1C1917;">${phone || 'Not provided'}</td>
                  </tr>
                  <tr style="border-bottom: 1px solid #E8E4DC;">
                    <td style="padding: 12px 0; color: #6B6560; font-size: 13px;">Subject</td>
                    <td style="padding: 12px 0; color: #C9933A; font-weight: 600;">${subject || 'General'}</td>
                  </tr>
                </table>
                <div style="margin-top: 24px; padding: 20px; background: white; border-left: 3px solid #C9933A;">
                  <p style="color: #6B6560; font-size: 13px; margin: 0 0 8px;">Message</p>
                  <p style="color: #1C1917; line-height: 1.7; margin: 0;">${message}</p>
                </div>
                <div style="margin-top: 24px; text-align: center;">
                  <a href="mailto:${email}" 
                     style="background: #C9933A; color: #1C1917; padding: 12px 28px; 
                            text-decoration: none; font-weight: 600; font-size: 13px;
                            letter-spacing: 0.1em; display: inline-block;">
                    REPLY TO ${name.toUpperCase()}
                  </a>
                </div>
              </div>
            </div>
          `,
        }),
      }),
    ]);

    const sheetResult = results[0];
    const emailResult = results[1];

    console.log('Sheet:', sheetResult.status);
    console.log('Email:', emailResult.status);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
