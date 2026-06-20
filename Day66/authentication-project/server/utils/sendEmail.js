import nodemailer from "nodemailer";

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

/**
 * Send an email.
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 */
export const sendEmail = async ({ to, subject, html }) => {
  const mailTransporter = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"SecureAuth" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  await mailTransporter.sendMail(mailOptions);
};

export const buildVerificationEmail = (name, verifyUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #0f172a;">Welcome to SecureAuth, ${name}!</h2>
    <p style="color: #334155; line-height: 1.6;">
      Thanks for signing up. Please confirm your email address by clicking the button below.
      This link will expire in 24 hours.
    </p>
    <a href="${verifyUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #0d9488; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
      Verify Email
    </a>
    <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
      If you didn't create this account, you can safely ignore this email.
    </p>
  </div>
`;

export const buildResetPasswordEmail = (name, resetUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
    <h2 style="color: #0f172a;">Reset your password</h2>
    <p style="color: #334155; line-height: 1.6;">
      Hi ${name}, we received a request to reset your password. This link expires in 1 hour.
    </p>
    <a href="${resetUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #0d9488; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">
      Reset Password
    </a>
    <p style="color: #94a3b8; font-size: 13px; margin-top: 24px;">
      If you didn't request this, you can safely ignore this email — your password will remain unchanged.
    </p>
  </div>
`;
