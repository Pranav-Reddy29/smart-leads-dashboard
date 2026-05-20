// Keep require-style import here because the current server tsconfig
// resolves this package more reliably in CommonJS mode.
const nodemailer = require("nodemailer");

import { env } from "../config/env";

type DeliveryStatus =
  | "sent"
  | "smtp_not_configured"
  | "failed";

const isSmtpConfigured = () =>
  Boolean(
    env.SMTP_HOST &&
      env.SMTP_PORT &&
      env.SMTP_USER &&
      env.SMTP_PASS &&
      env.SMTP_FROM_EMAIL
  );

const createTransporter = () =>
  nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

export const sendInvitationEmail = async ({
  recipientEmail,
  recipientRole,
  inviterName,
  organizationName,
  inviteUrl,
}: {
  recipientEmail: string;
  recipientRole: "admin" | "sales";
  inviterName: string;
  organizationName: string;
  inviteUrl: string;
}): Promise<DeliveryStatus> => {
  if (!isSmtpConfigured()) {
    return "smtp_not_configured";
  }

  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `${env.SMTP_FROM_NAME} <${env.SMTP_FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `You're invited to join ${organizationName} on Smart Leads`,
      text: [
        `Hi,`,
        ``,
        `${inviterName} invited you to join ${organizationName} as a ${recipientRole}.`,
        `Open this link to accept the invitation:`,
        inviteUrl,
        ``,
        `This invite expires in 7 days.`,
      ].join("\n"),
      html: `
        <div style="font-family:Segoe UI,Arial,sans-serif;max-width:640px;margin:0 auto;padding:32px;background:#f8fbff;color:#0f172a">
          <div style="background:#ffffff;border:1px solid #dbe7f3;border-radius:24px;padding:32px">
            <p style="margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:#0284c7">Smart Leads</p>
            <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2">You're invited to join ${organizationName}</h1>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#475569">
              ${inviterName} invited you to join this workspace as a <strong>${recipientRole}</strong>.
            </p>
            <a href="${inviteUrl}" style="display:inline-block;margin:8px 0 20px;padding:14px 22px;border-radius:16px;background:#0284c7;color:#ffffff;text-decoration:none;font-weight:700">
              Accept invitation
            </a>
            <p style="margin:0;font-size:14px;line-height:1.7;color:#64748b">
              If the button doesn't work, copy and paste this link into your browser:
            </p>
            <p style="margin:12px 0 0;word-break:break-all;font-size:14px;color:#0284c7">${inviteUrl}</p>
          </div>
        </div>
      `,
    });

    return "sent";
  } catch (error) {
    console.error(
      "Failed to send invitation email",
      error
    );
    return "failed";
  }
};
