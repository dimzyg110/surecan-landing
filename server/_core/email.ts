import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * Email service for sending transactional emails
 * Uses SMTP configuration from environment variables
 */

let transporter: Transporter | null = null;

/**
 * Get or create email transporter
 * For development, uses Ethereal email (fake SMTP service)
 * For production, uses real SMTP credentials
 */
async function getTransporter(): Promise<Transporter> {
  if (transporter) return transporter;

  // Check if SMTP credentials are provided
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpPort && smtpUser && smtpPass) {
    // Production: Use real SMTP
    transporter = nodemailer.createTransporter({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
    console.log("[Email] Using production SMTP:", smtpHost);
  } else {
    // Development: Use Ethereal (test email service)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransporter({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("[Email] Using Ethereal test account:", testAccount.user);
    console.log("[Email] Preview emails at: https://ethereal.email");
  }

  return transporter;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

/**
 * Send an email
 * Returns preview URL for development (Ethereal)
 */
export async function sendEmail(options: SendEmailOptions): Promise<{
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: string;
}> {
  try {
    const transporter = await getTransporter();
    
    const fromEmail = process.env.SMTP_FROM_EMAIL || "noreply@surecan.com.au";
    const fromName = process.env.SMTP_FROM_NAME || "Surecan Clinic";

    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
    });

    console.log("[Email] Sent to:", options.to);
    console.log("[Email] Message ID:", info.messageId);

    // Get preview URL for Ethereal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("[Email] Preview URL:", previewUrl);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl: previewUrl || undefined,
    };
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Email template wrapper with consistent styling
 */
export function createEmailTemplate(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Surecan Clinic</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f8fafc;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background-color: #0D9488;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 32px 24px;
      color: #0A2540;
      line-height: 1.6;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #0D9488;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      margin: 16px 0;
    }
    .footer {
      padding: 24px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
    }
    .info-box {
      background-color: #f1f5f9;
      border-left: 4px solid #0D9488;
      padding: 16px;
      margin: 16px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 24px 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Surecan Clinic</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Surecan Clinic - Shared Care Medical Cannabis</p>
      <p>📞 1300 SURECAN | 📧 info@surecan.com.au</p>
      <p style="font-size: 12px; color: #94a3b8;">
        This email was sent to you because you booked an appointment or submitted an inquiry at Surecan Clinic.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
