import { Resend } from 'resend';
import { createHmac, timingSafeEqual } from 'crypto';
import { escapeHtml } from './sanitize';

// Strip newlines from email subjects to prevent header injection
function sanitizeSubject(str: string): string {
  return str.replace(/[\r\n]+/g, ' ').trim();
}

// Single Resend client — the HTTP SDK is stateless so a shared instance is fine.
let resendClient: Resend | null = null;
function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClient) resendClient = new Resend(key);
  return resendClient;
}

// Thin wrapper so the sender call sites read almost identically to the old
// nodemailer ones, and so we can normalize Resend's { data, error } shape into
// the { success, messageId?, error } contract callers already handle.
async function send(opts: {
  from: string;
  to: string | undefined;
  subject: string;
  html: string;
  bcc?: string;
  replyTo?: string;
}): Promise<{ success: true; messageId?: string } | { success: false; error: string }> {
  if (!opts.to) {
    console.warn('send(): missing "to" address, skipping.');
    return { success: false, error: 'Recipient not configured' };
  }
  const resend = getResend();
  if (!resend) {
    console.warn('RESEND_API_KEY not configured. Skipping email send.');
    return { success: false, error: 'Email not configured' };
  }
  const { data, error } = await resend.emails.send({
    from: opts.from,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    ...(opts.bcc ? { bcc: opts.bcc } : {}),
    ...(opts.replyTo ? { replyTo: opts.replyTo } : {}),
  });
  if (error) {
    console.error('Resend send error:', error.message || String(error));
    return { success: false, error: 'Failed to send email' };
  }
  return { success: true, messageId: data?.id };
}

interface InquiryData {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  created_at: string;
}

interface PetitionData {
  name: string;
  email: string;
  city?: string;
  state?: string;
  subscribed?: boolean;
}

interface ArticleData {
  title: string;
  slug: string;
  excerpt: string;
  image?: string;
}

interface SubscriberData {
  name: string;
  email: string;
}

// Get email configuration from environment variables.
// RESEND_FROM must be a verified-domain address in the Resend dashboard
// (e.g. "Garden State Abolitionists <noreply@gardenstateabolitionists.com>").
// Falls back to a sensible default constructed from ADMIN_EMAIL.
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || ADMIN_EMAIL;
const FROM_EMAIL =
  process.env.RESEND_FROM ||
  (ADMIN_EMAIL ? `Garden State Abolitionists <${ADMIN_EMAIL}>` : 'noreply@gardenstateabolitionists.com');
const FROM_NOTIFICATIONS =
  process.env.RESEND_FROM_NOTIFICATIONS ||
  (ADMIN_EMAIL ? `Garden State Abolitionists <${ADMIN_EMAIL}>` : FROM_EMAIL);

// Send inquiry confirmation email to the user
export const sendInquiryConfirmationEmail = async (inquiry: InquiryData) => {
  try {
    const _info = await send({
      from: FROM_EMAIL,
      to: inquiry.email,
      bcc: NOTIFICATION_EMAIL,
      subject: `Thank You for Contacting Garden State Abolitionists`,
      html: inquiryConfirmationEmailHtml(inquiry),
    });

    // Email sent successfully
    return _info;
  } catch (error) {
    console.error('Error sending confirmation email:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send email' };
  }
};

// Send reply email to inquiry sender
export const sendInquiryReplyEmail = async (data: { to: string; name: string; subject: string; message: string }) => {
  const safeName = escapeHtml(data.name);

  try {
    const _info = await send({
      from: FROM_EMAIL,
      to: data.to,
      bcc: NOTIFICATION_EMAIL,
      subject: sanitizeSubject(`Re: ${data.subject || 'Your Inquiry'}`),
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 25px; text-align: center;">
              <span style="font-size: 20px; font-weight: bold; color: #d4af37; letter-spacing: 1px;">Garden State Abolitionists</span>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <p>Hello <strong style="color: #8b0000;">${safeName}</strong>,</p>
              <p>Thank you for reaching out to us. Here is our response to your inquiry:</p>
              <div style="margin: 20px 0; padding: 20px; background-color: #f8f8f8; border-left: 4px solid #8b0000; border-radius: 4px;">
                ${escapeHtml(data.message)}
              </div>
              <p style="margin-top: 25px;">In Christ,<br><strong>Garden State Abolitionists</strong></p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 25px; text-align: center; font-size: 13px; color: #cccccc;">
              <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Garden State Abolitionists. All rights reserved.</p>
              <p style="margin: 0;"><a href="https://www.gardenstateabolitionists.com" style="color: #d4af37; text-decoration: none;">gardenstateabolitionists.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    return _info;
  } catch (error) {
    console.error('Error sending reply email:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send reply' };
  }
};

// Send notification email to admin when new inquiry is received
export const sendInquiryNotificationEmail = async (inquiry: InquiryData) => {
  try {
    const _info = await send({
      from: FROM_NOTIFICATIONS,
      to: NOTIFICATION_EMAIL,
      subject: sanitizeSubject(`New Inquiry: ${inquiry.subject || 'General Inquiry'}`),
      html: inquiryNotificationEmailHtml(inquiry),
    });

    // Email sent successfully
    return _info;
  } catch (error) {
    console.error('Error sending notification email:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send email' };
  }
};

// HTML template for user confirmation email
const inquiryConfirmationEmailHtml = (inquiry: InquiryData) => {
  const safeName = escapeHtml(inquiry.name);
  const safeEmail = escapeHtml(inquiry.email);
  const safeSubject = inquiry.subject ? escapeHtml(inquiry.subject) : '';
  const safeMessage = escapeHtml(inquiry.message);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Your Inquiry</title>
  <style>
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #1a1a2e;
      padding: 30px 20px;
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #d4af37;
      letter-spacing: 1px;
    }
    .email-content {
      padding: 35px 40px;
      background-color: #ffffff;
    }
    h1 {
      color: #1a1a2e;
      font-size: 24px;
      margin-top: 0;
      margin-bottom: 25px;
    }
    .highlight {
      color: #8b0000;
      font-weight: 600;
    }
    .info-section {
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #d4af37;
      margin: 20px 0;
    }
    .info-label {
      font-weight: 600;
      color: #555;
      display: inline-block;
      margin-right: 5px;
    }
    .footer {
      text-align: center;
      padding: 25px;
      color: #666666;
      font-size: 13px;
      background-color: #1a1a2e;
      color: #cccccc;
    }
    .footer a {
      color: #d4af37;
      text-decoration: none;
    }
    .note {
      border-left: 3px solid #d4af37;
      padding: 10px 15px;
      background-color: #f9f9f9;
      margin-top: 20px;
      font-style: italic;
    }
  </style>
</head>
<body>
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td class="email-header" bgcolor="#1a1a2e" style="padding: 30px 20px; text-align: center;">
              <div class="logo" style="font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 1px;">Garden State Abolitionists</div>
            </td>
          </tr>

          <tr>
            <td class="email-content" style="padding: 35px 40px;">
              <h1 style="color: #1a1a2e; font-size: 24px; margin-top: 0; margin-bottom: 25px;">Thank You for Reaching Out</h1>
              <p>Hello <strong style="color: #8b0000;">${safeName}</strong>,</p>
              <p>Thank you for contacting Garden State Abolitionists. We have received your inquiry and appreciate your interest in our mission to end abortion in New Jersey.</p>

              <div class="info-section" style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #d4af37; margin: 20px 0;">
                <h3 style="color: #1a1a2e; margin-top: 0;">Your Inquiry Details</h3>
                <p><span class="info-label" style="font-weight: 600; color: #555;">Name:</span> ${safeName}</p>
                <p><span class="info-label" style="font-weight: 600; color: #555;">Email:</span> ${safeEmail}</p>
                ${safeSubject ? `<p><span class="info-label" style="font-weight: 600; color: #555;">Subject:</span> ${safeSubject}</p>` : ''}
                <p><span class="info-label" style="font-weight: 600; color: #555;">Message:</span></p>
                <p style="white-space: pre-wrap; background: #fff; padding: 10px; border-radius: 4px;">${safeMessage}</p>
              </div>

              <div class="note" style="border-left: 3px solid #d4af37; padding: 10px 15px; background-color: #f9f9f9; margin-top: 20px; font-style: italic;">
                <p style="margin: 0;">A member of our team will review your message and respond within 1-2 business days. If you have an urgent matter, please reach out to us directly.</p>
              </div>

              <p style="margin-top: 25px;">In Christ,<br><strong>Garden State Abolitionists</strong></p>
            </td>
          </tr>

          <tr>
            <td class="footer" bgcolor="#1a1a2e" style="padding: 25px; text-align: center; font-size: 13px; color: #cccccc;">
              <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Garden State Abolitionists. All rights reserved.</p>
              <p style="margin: 0;"><a href="https://www.gardenstateabolitionists.com" style="color: #d4af37; text-decoration: none;">gardenstateabolitionists.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// HTML template for admin notification email
const inquiryNotificationEmailHtml = (inquiry: InquiryData) => {
  const safeName = escapeHtml(inquiry.name);
  const safeEmail = escapeHtml(inquiry.email);
  const safeSubject = inquiry.subject ? escapeHtml(inquiry.subject) : 'General Inquiry';
  const safeMessage = escapeHtml(inquiry.message);

  const formattedDate = new Date(inquiry.created_at).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry Received</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #8b0000;
      padding: 20px;
      text-align: center;
    }
    .logo {
      font-size: 20px;
      font-weight: bold;
      color: #ffffff;
    }
    .email-content {
      padding: 30px;
    }
    h1 {
      color: #1a1a2e;
      font-size: 22px;
      margin-top: 0;
    }
    .info-row {
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }
    .info-label {
      font-weight: bold;
      color: #666;
      display: inline-block;
      width: 100px;
    }
    .message-box {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 6px;
      margin-top: 15px;
      border-left: 4px solid #8b0000;
    }
    .action-button {
      display: inline-block;
      background-color: #1a1a2e;
      color: #ffffff !important;
      text-decoration: none;
      padding: 12px 25px;
      border-radius: 4px;
      font-weight: bold;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666666;
      font-size: 12px;
      background-color: #f0f0f0;
    }
  </style>
</head>
<body>
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table class="email-container" cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td class="email-header" bgcolor="#8b0000" style="padding: 20px; text-align: center;">
              <div class="logo" style="font-size: 20px; font-weight: bold; color: #ffffff;">New Inquiry Received</div>
            </td>
          </tr>

          <tr>
            <td class="email-content" style="padding: 30px;">
              <h1 style="color: #1a1a2e; font-size: 22px; margin-top: 0;">Inquiry Details</h1>

              <div class="info-row" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span class="info-label" style="font-weight: bold; color: #666; display: inline-block; width: 100px;">From:</span>
                <span>${safeName}</span>
              </div>

              <div class="info-row" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span class="info-label" style="font-weight: bold; color: #666; display: inline-block; width: 100px;">Email:</span>
                <span><a href="mailto:${safeEmail}" style="color: #8b0000;">${safeEmail}</a></span>
              </div>

              <div class="info-row" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span class="info-label" style="font-weight: bold; color: #666; display: inline-block; width: 100px;">Subject:</span>
                <span>${safeSubject}</span>
              </div>

              <div class="info-row" style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span class="info-label" style="font-weight: bold; color: #666; display: inline-block; width: 100px;">Received:</span>
                <span>${formattedDate}</span>
              </div>

              <div class="message-box" style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 15px; border-left: 4px solid #8b0000;">
                <strong style="color: #1a1a2e;">Message:</strong>
                <p style="white-space: pre-wrap; margin-top: 10px;">${safeMessage}</p>
              </div>

              <div style="text-align: center; margin-top: 25px;">
                <a href="https://www.gardenstateabolitionists.com/admin/dashboard/inquiries" class="action-button" style="display: inline-block; background-color: #1a1a2e; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">View in Dashboard</a>
              </div>
            </td>
          </tr>

          <tr>
            <td class="footer" bgcolor="#f0f0f0" style="text-align: center; padding: 20px; color: #666666; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from the Garden State Abolitionists website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// ===== UNSUBSCRIBE HELPERS =====

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gardenstateabolitionists.com';

function getTokenMonth(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function generateUnsubscribeToken(email: string, month?: string): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required for unsubscribe tokens');
  const m = month || getTokenMonth();
  return createHmac('sha256', secret).update(`${email.toLowerCase()}:${m}`).digest('hex');
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  // Accept tokens from the current month and the previous month
  const now = new Date();
  const currentMonth = getTokenMonth(now);
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonth = getTokenMonth(prev);

  for (const month of [currentMonth, previousMonth]) {
    const expected = generateUnsubscribeToken(email, month);
    const expectedBuf = Buffer.from(expected, 'utf-8');
    const tokenBuf = Buffer.from(token, 'utf-8');
    if (expectedBuf.length === tokenBuf.length && timingSafeEqual(expectedBuf, tokenBuf)) {
      return true;
    }
  }
  return false;
}

function getUnsubscribeUrl(email: string): string {
  const token = generateUnsubscribeToken(email);
  return `${BASE_URL}/unsubscribe?email=${encodeURIComponent(email.toLowerCase())}&token=${token}`;
}

function unsubscribeFooterHtml(email: string): string {
  const url = getUnsubscribeUrl(email);
  return `
          <tr>
            <td style="text-align: center; padding: 15px 20px; font-size: 12px; color: #999999;">
              <p style="margin: 0;">You received this email because you subscribed at gardenstateabolitionists.com.</p>
              <p style="margin: 5px 0 0 0;"><a href="${url}" style="color: #999999; text-decoration: underline;">Unsubscribe</a></p>
            </td>
          </tr>`;
}

// ===== PETITION EMAILS =====

export const sendPetitionConfirmationEmail = async (petition: PetitionData) => {
  try {
    const _info = await send({
      from: FROM_EMAIL,
      to: petition.email,
      subject: 'Thank You for Signing the Petition!',
      html: petitionConfirmationEmailHtml(petition),
    });

    return _info;
  } catch (error) {
    console.error('Error sending petition confirmation email:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send email' };
  }
};

export const sendPetitionNotificationEmail = async (petition: PetitionData) => {
  try {
    const _info = await send({
      from: FROM_NOTIFICATIONS,
      to: NOTIFICATION_EMAIL,
      subject: sanitizeSubject(`New Petition Signature: ${petition.name}`),
      html: petitionNotificationEmailHtml(petition),
    });

    return _info;
  } catch (error) {
    console.error('Error sending petition notification email:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send email' };
  }
};

const petitionConfirmationEmailHtml = (petition: PetitionData) => {
  const safeName = escapeHtml(petition.name);
  const safeEmail = escapeHtml(petition.email);
  const safeCity = petition.city ? escapeHtml(petition.city) : '';
  const safeState = petition.state ? escapeHtml(petition.state) : 'NJ';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Signing</title>
</head>
<body style="font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.6; color: #333333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 30px 20px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 1px;">Garden State Abolitionists</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <h1 style="color: #1a1a2e; font-size: 24px; margin-top: 0; margin-bottom: 25px;">Thank You for Signing!</h1>
              <p>Hello <strong style="color: #8b0000;">${safeName}</strong>,</p>
              <p>Thank you for signing the petition to abolish abortion in New Jersey. Your voice matters, and together we are standing for the rights of the preborn.</p>

              <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; border-left: 4px solid #d4af37; margin: 20px 0;">
                <h3 style="color: #1a1a2e; margin-top: 0;">Your Signature Details</h3>
                <p><span style="font-weight: 600; color: #555;">Name:</span> ${safeName}</p>
                <p><span style="font-weight: 600; color: #555;">Email:</span> ${safeEmail}</p>
                ${safeCity ? `<p><span style="font-weight: 600; color: #555;">City:</span> ${safeCity}, ${safeState}</p>` : `<p><span style="font-weight: 600; color: #555;">State:</span> ${safeState}</p>`}
              </div>

              ${petition.subscribed ? '<p style="border-left: 3px solid #d4af37; padding: 10px 15px; background-color: #f9f9f9; margin-top: 20px; font-style: italic;">You have opted in to receive updates from Garden State Abolitionists. You can unsubscribe at any time.</p>' : ''}

              <p style="margin-top: 25px;">In Christ,<br><strong>Garden State Abolitionists</strong></p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 25px; text-align: center; font-size: 13px; color: #cccccc;">
              <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Garden State Abolitionists. All rights reserved.</p>
              <p style="margin: 0;"><a href="https://www.gardenstateabolitionists.com" style="color: #d4af37; text-decoration: none;">gardenstateabolitionists.com</a></p>
            </td>
          </tr>
          ${petition.subscribed ? unsubscribeFooterHtml(petition.email) : ''}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

const petitionNotificationEmailHtml = (petition: PetitionData) => {
  const safeName = escapeHtml(petition.name);
  const safeEmail = escapeHtml(petition.email);
  const safeCity = petition.city ? escapeHtml(petition.city) : '';
  const safeState = petition.state ? escapeHtml(petition.state) : 'NJ';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Petition Signature</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td bgcolor="#8b0000" style="padding: 20px; text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #ffffff;">New Petition Signature</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h1 style="color: #1a1a2e; font-size: 22px; margin-top: 0;">Signature Details</h1>

              <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666; display: inline-block; width: 100px;">Name:</span>
                <span>${safeName}</span>
              </div>
              <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666; display: inline-block; width: 100px;">Email:</span>
                <span><a href="mailto:${safeEmail}" style="color: #8b0000;">${safeEmail}</a></span>
              </div>
              ${safeCity ? `<div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666; display: inline-block; width: 100px;">Location:</span>
                <span>${safeCity}, ${safeState}</span>
              </div>` : `<div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666; display: inline-block; width: 100px;">State:</span>
                <span>${safeState}</span>
              </div>`}
              <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666; display: inline-block; width: 100px;">Subscribed:</span>
                <span>${petition.subscribed ? 'Yes' : 'No'}</span>
              </div>

              <div style="text-align: center; margin-top: 25px;">
                <a href="https://www.gardenstateabolitionists.com/admin/dashboard/petitions" style="display: inline-block; background-color: #1a1a2e; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">View in Dashboard</a>
              </div>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f0f0f0" style="text-align: center; padding: 20px; color: #666666; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from the Garden State Abolitionists website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// ===== SUBSCRIBER WELCOME / NOTIFICATION EMAILS =====

export const sendSubscriberWelcomeEmail = async (email: string) => {
  try {
    const _info = await send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to Garden State Abolitionists Updates',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.6; color: #333333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 30px 20px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 1px;">Garden State Abolitionists</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <h1 style="color: #1a1a2e; font-size: 24px; margin-top: 0; margin-bottom: 25px;">Welcome!</h1>
              <p>Thank you for subscribing to updates from Garden State Abolitionists.</p>
              <p>You will receive emails when we publish new articles and important updates about our efforts to end abortion in New Jersey.</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${BASE_URL}/the-petition" style="display: inline-block; background-color: #8b0000; color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 4px; font-weight: bold; font-size: 16px;">Sign the Petition</a>
              </div>

              <p style="margin-top: 25px;">In Christ,<br><strong>Garden State Abolitionists</strong></p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 25px; text-align: center; font-size: 13px; color: #cccccc;">
              <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Garden State Abolitionists. All rights reserved.</p>
              <p style="margin: 0;"><a href="${BASE_URL}" style="color: #d4af37; text-decoration: none;">gardenstateabolitionists.com</a></p>
            </td>
          </tr>
          ${unsubscribeFooterHtml(email)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    return _info;
  } catch (error) {
    console.error('Error sending subscriber welcome email:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send email' };
  }
};

export const sendNewSubscriberNotification = async (email: string) => {
  const safeEmail = escapeHtml(email);

  try {
    const _info = await send({
      from: FROM_NOTIFICATIONS,
      to: NOTIFICATION_EMAIL,
      subject: sanitizeSubject(`New Newsletter Subscriber: ${email}`),
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 20px; text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #d4af37;">New Subscriber</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <p>A new subscriber signed up via the website footer:</p>
              <div style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #d4af37; border-radius: 4px; margin: 15px 0;">
                <strong>Email:</strong> <a href="mailto:${safeEmail}" style="color: #8b0000;">${safeEmail}</a>
              </div>
              <div style="text-align: center; margin-top: 25px;">
                <a href="${BASE_URL}/admin/dashboard/subscribers" style="display: inline-block; background-color: #1a1a2e; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">View Subscribers</a>
              </div>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f0f0f0" style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from the Garden State Abolitionists website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    return _info;
  } catch (error) {
    console.error('Error sending new subscriber notification:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send email' };
  }
};

// ===== NEWSLETTER EMAILS =====

export const sendNewsletterEmail = async (article: ArticleData, subscriber: SubscriberData) => {
  try {
    const _info = await send({
      from: FROM_EMAIL,
      to: subscriber.email,
      subject: sanitizeSubject(`New Article: ${article.title}`),
      html: newsletterEmailHtml(article, subscriber),
    });

    return _info;
  } catch (error) {
    console.error('Error sending newsletter:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send email' };
  }
};

export const sendNewsletterToAll = async (article: ArticleData, subscribers: SubscriberData[]): Promise<{ sent: number; failed: number }> => {
  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
      const r = await send({
          from: FROM_EMAIL,
          to: subscriber.email,
          subject: sanitizeSubject(`New Article: ${article.title}`),
          html: newsletterEmailHtml(article, subscriber),
        });
      if (r.success) sent++;
      else {
        console.error(`Error sending newsletter to ${subscriber.email}:`, r.error);
        failed++;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return { sent, failed };
};

const newsletterEmailHtml = (article: ArticleData, subscriber: SubscriberData) => {
  const safeName = escapeHtml(subscriber.name);
  const safeTitle = escapeHtml(article.title);
  const safeExcerpt = escapeHtml(article.excerpt);
  const articleUrl = `${BASE_URL}/news/${article.slug}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeTitle}</title>
</head>
<body style="font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.6; color: #333333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 30px 20px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 1px;">Garden State Abolitionists</div>
            </td>
          </tr>
          ${article.image ? `<tr>
            <td style="padding: 0;">
              <img src="${BASE_URL}${article.image}" alt="${safeTitle}" style="width: 100%; max-height: 300px; object-fit: cover; display: block;" />
            </td>
          </tr>` : ''}
          <tr>
            <td style="padding: 35px 40px;">
              <p style="color: #8b0000; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-top: 0;">New Article</p>
              <h1 style="color: #1a1a2e; font-size: 24px; margin-top: 5px; margin-bottom: 15px;">${safeTitle}</h1>
              <p>Hello <strong>${safeName}</strong>,</p>
              <p>${safeExcerpt}</p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${articleUrl}" style="display: inline-block; background-color: #8b0000; color: #ffffff !important; text-decoration: none; padding: 14px 30px; border-radius: 4px; font-weight: bold; font-size: 16px;">Read Full Article</a>
              </div>

              <p style="margin-top: 25px; color: #666; font-size: 14px;">Thank you for staying informed about our mission.</p>
              <p style="margin-top: 15px;">In Christ,<br><strong>Garden State Abolitionists</strong></p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 25px; text-align: center; font-size: 13px; color: #cccccc;">
              <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Garden State Abolitionists. All rights reserved.</p>
              <p style="margin: 0;"><a href="https://www.gardenstateabolitionists.com" style="color: #d4af37; text-decoration: none;">gardenstateabolitionists.com</a></p>
            </td>
          </tr>
          ${unsubscribeFooterHtml(subscriber.email)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// ===== LAWMAKER + PARTNER BROADCASTS =====
//
// Both use plain-text address lists (no per-recipient personalization
// beyond addressing), so the templates are simpler than the newsletter
// broadcast: a single well-formed HTML block, no "Hello {name}"
// splice, no unsubscribe footer (lawmakers are public officials +
// partners are org contacts, not opt-in subscribers).
//
// Rate: 200ms between sends, same as the newsletter path. That keeps
// us well under Resend's 10 rps burst and gives Google Ads / Postmaster
// clean sender-reputation signals.

interface AudienceMember {
  name: string;
  email: string;
  meta?: string; // e.g. "House · District 12 · R" or "Ohio"
}

export const sendLawmakerBroadcast = async (
  subject: string,
  body: string,
  recipients: AudienceMember[],
): Promise<{ sent: number; failed: number }> => {
  let sent = 0;
  let failed = 0;
  for (const r of recipients) {
    const html = officialContactEmailHtml(subject, body, 'lawmaker');
    const result = await send({
      from: FROM_EMAIL,
      to: r.email,
      subject: sanitizeSubject(subject),
      replyTo: NOTIFICATION_EMAIL,
      html,
    });
    if (result.success) sent++;
    else {
      console.error(`Lawmaker broadcast to ${r.email} (${r.meta || r.name}):`, result.error);
      failed++;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return { sent, failed };
};

export const sendPartnerBroadcast = async (
  subject: string,
  body: string,
  recipients: AudienceMember[],
): Promise<{ sent: number; failed: number }> => {
  let sent = 0;
  let failed = 0;
  for (const r of recipients) {
    const html = officialContactEmailHtml(subject, body, 'partner');
    const result = await send({
      from: FROM_EMAIL,
      to: r.email,
      subject: sanitizeSubject(subject),
      replyTo: NOTIFICATION_EMAIL,
      html,
    });
    if (result.success) sent++;
    else {
      console.error(`Partner broadcast to ${r.email} (${r.meta || r.name}):`, result.error);
      failed++;
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return { sent, failed };
};

// Admin summary sent after a lawmaker/partner broadcast finishes.
export const sendOfficialBroadcastNotification = async (
  audience: 'lawmaker' | 'partner',
  subject: string,
  sent: number,
  failed: number,
) => {
  const label = audience === 'lawmaker' ? 'Lawmakers' : 'Partners';
  return send({
    from: FROM_NOTIFICATIONS,
    to: NOTIFICATION_EMAIL,
    subject: sanitizeSubject(`${label} Broadcast Sent: ${subject}`),
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr><td align="center" style="padding: 20px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
        <tr><td bgcolor="#1a1a2e" style="padding: 20px; text-align: center;">
          <div style="font-size: 20px; font-weight: bold; color: #d4af37;">${label} Broadcast Sent</div>
        </td></tr>
        <tr><td style="padding: 30px;">
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <strong style="color: #666;">Subject:</strong> ${escapeHtml(subject)}
          </div>
          <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <strong style="color: #666;">Sent:</strong> ${sent} email${sent !== 1 ? 's' : ''}
          </div>
          ${failed > 0 ? `<div style="padding: 10px 0; border-bottom: 1px solid #eee;">
            <strong style="color: #c00;">Failed:</strong> ${failed}
          </div>` : ''}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  });
};

// Signature block differs by audience — lawmakers hear from the organization as
// constituents/activists; partners hear from us as an allied coalition.
function officialContactEmailHtml(subject: string, body: string, audience: 'lawmaker' | 'partner'): string {
  const safeSubject = escapeHtml(subject);
  const signOff = audience === 'lawmaker'
    ? 'In service to justice,<br><strong>Garden State Abolitionists</strong>'
    : 'For the abolition of abortion,<br><strong>Garden State Abolitionists</strong>';
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject}</title>
</head>
<body style="font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.6; color: #333333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr><td align="center" style="padding: 20px 0;">
      <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
        <tr><td bgcolor="#1a1a2e" style="padding: 30px 20px; text-align: center;">
          <div style="font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 1px;">Garden State Abolitionists</div>
        </td></tr>
        <tr><td style="padding: 35px 40px;">
          <h1 style="color: #1a1a2e; font-size: 22px; margin-top: 0; margin-bottom: 20px;">${safeSubject}</h1>
          <div style="margin: 16px 0;">${body}</div>
          <p style="margin-top: 25px;">${signOff}</p>
        </td></tr>
        <tr><td bgcolor="#1a1a2e" style="padding: 25px; text-align: center; font-size: 13px; color: #cccccc;">
          <p style="margin: 0 0 10px 0;">Garden State Abolitionists · Est. 2024</p>
          <p style="margin: 0;"><a href="https://www.gardenstateabolitionists.com" style="color: #d4af37; text-decoration: none;">gardenstateabolitionists.com</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
  `;
}

// ===== BROADCAST EMAILS =====

export const sendBroadcastEmail = async (subject: string, body: string, subscriber: SubscriberData) => {
  try {
    const _info = await send({
      from: FROM_EMAIL,
      to: subscriber.email,
      subject: sanitizeSubject(subject),
      html: broadcastEmailHtml(subject, body, subscriber),
    });

    return _info;
  } catch (error) {
    console.error('Error sending broadcast:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send email' };
  }
};

export const sendBroadcastToAll = async (subject: string, body: string, subscribers: SubscriberData[]): Promise<{ sent: number; failed: number }> => {
  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribers) {
      const r = await send({
          from: FROM_EMAIL,
          to: subscriber.email,
          subject: sanitizeSubject(subject),
          html: broadcastEmailHtml(subject, body, subscriber),
        });
      if (r.success) sent++;
      else {
        console.error(`Error sending broadcast to ${subscriber.email}:`, r.error);
        failed++;
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
  }

  return { sent, failed };
};

// Send admin notification after newsletter is sent
export const sendNewsletterNotification = async (article: ArticleData, sent: number, failed: number) => {
  try {
    const _info = await send({
      from: FROM_NOTIFICATIONS,
      to: NOTIFICATION_EMAIL,
      subject: sanitizeSubject(`Newsletter Sent: ${article.title}`),
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 20px; text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #d4af37;">Newsletter Sent</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h1 style="color: #1a1a2e; font-size: 22px; margin-top: 0;">Newsletter Summary</h1>
              <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Article:</span> ${escapeHtml(article.title)}
              </div>
              <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Sent:</span> ${sent} email${sent !== 1 ? 's' : ''}
              </div>
              ${failed > 0 ? `<div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #c00;">Failed:</span> ${failed}
              </div>` : ''}
              <div style="text-align: center; margin-top: 25px;">
                <a href="${BASE_URL}/news/${article.slug}" style="display: inline-block; background-color: #1a1a2e; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">View Article</a>
              </div>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f0f0f0" style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from the Garden State Abolitionists website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    return _info;
  } catch (error) {
    console.error('Error sending newsletter notification:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send email' };
  }
};

// Send admin notification after broadcast is sent
export const sendBroadcastNotification = async (subject: string, sent: number, failed: number) => {
  try {
    const _info = await send({
      from: FROM_NOTIFICATIONS,
      to: NOTIFICATION_EMAIL,
      subject: sanitizeSubject(`Broadcast Sent: ${subject}`),
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 20px; text-align: center;">
              <div style="font-size: 20px; font-weight: bold; color: #d4af37;">Broadcast Sent</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px;">
              <h1 style="color: #1a1a2e; font-size: 22px; margin-top: 0;">Broadcast Summary</h1>
              <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Subject:</span> ${escapeHtml(subject)}
              </div>
              <div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Sent:</span> ${sent} email${sent !== 1 ? 's' : ''}
              </div>
              ${failed > 0 ? `<div style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #c00;">Failed:</span> ${failed}
              </div>` : ''}
              <div style="text-align: center; margin-top: 25px;">
                <a href="${BASE_URL}/admin/dashboard/email" style="display: inline-block; background-color: #1a1a2e; color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 4px; font-weight: bold;">Go to Email Dashboard</a>
              </div>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f0f0f0" style="text-align: center; padding: 15px; color: #666; font-size: 12px;">
              <p style="margin: 0;">This is an automated notification from the Garden State Abolitionists website.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    return _info;
  } catch (error) {
    console.error('Error sending broadcast notification:', error instanceof Error ? error.message : 'Unknown error');
    return { success: false, error: 'Failed to send email' };
  }
};

const broadcastEmailHtml = (subject: string, body: string, subscriber: SubscriberData) => {
  const safeName = escapeHtml(subscriber.name);
  const safeSubject = escapeHtml(subject);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject}</title>
</head>
<body style="font-family: 'Georgia', 'Times New Roman', serif; line-height: 1.6; color: #333333; background-color: #f5f5f5; margin: 0; padding: 0;">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f5f5f5">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table cellpadding="0" cellspacing="0" border="0" width="600" style="border-radius: 8px; overflow: hidden; background-color: #fff; max-width: 600px;">
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 30px 20px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #d4af37; letter-spacing: 1px;">Garden State Abolitionists</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 35px 40px;">
              <h1 style="color: #1a1a2e; font-size: 24px; margin-top: 0; margin-bottom: 25px;">${safeSubject}</h1>
              <p>Hello <strong style="color: #8b0000;">${safeName}</strong>,</p>
              <div style="margin: 20px 0;">${body}</div>
              <p style="margin-top: 25px;">In Christ,<br><strong>Garden State Abolitionists</strong></p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#1a1a2e" style="padding: 25px; text-align: center; font-size: 13px; color: #cccccc;">
              <p style="margin: 0 0 10px 0;">&copy; ${new Date().getFullYear()} Garden State Abolitionists. All rights reserved.</p>
              <p style="margin: 0;"><a href="https://www.gardenstateabolitionists.com" style="color: #d4af37; text-decoration: none;">gardenstateabolitionists.com</a></p>
            </td>
          </tr>
          ${unsubscribeFooterHtml(subscriber.email)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};
