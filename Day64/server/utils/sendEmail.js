const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"SecureAuth" <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 Email sent: ${info.messageId}`);
  return info;
};

const getResetEmailHTML = (name, resetUrl) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #0a0a0f; color: #e0e0e0; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #111827; border: 1px solid #1e40af; border-radius: 12px; overflow: hidden; }
    .header { background: linear-gradient(135deg, #1e3a8a, #1e40af); padding: 32px; text-align: center; }
    .header h1 { color: #60a5fa; margin: 0; font-size: 22px; letter-spacing: 2px; text-transform: uppercase; }
    .body { padding: 32px; }
    .body p { color: #9ca3af; line-height: 1.7; }
    .body strong { color: #e0e0e0; }
    .btn { display: block; width: fit-content; margin: 28px auto; background: #1d4ed8; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: bold; letter-spacing: 1px; }
    .warning { background: #1c1a2e; border-left: 3px solid #f59e0b; padding: 12px 16px; border-radius: 4px; margin-top: 20px; font-size: 13px; color: #9ca3af; }
    .footer { text-align: center; padding: 16px; font-size: 12px; color: #4b5563; border-top: 1px solid #1f2937; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Password Reset</h1>
    </div>
    <div class="body">
      <p>Hello, <strong>${name}</strong>!</p>
      <p>We received a request to reset your password. Click the button below to create a new password. This link expires in <strong>10 minutes</strong>.</p>
      <a class="btn" href="${resetUrl}">Reset Password</a>
      <div class="warning">
        ⚠️ If you did not request a password reset, please ignore this email. Your account is safe.
      </div>
    </div>
    <div class="footer">© ${new Date().getFullYear()} SecureAuth · Day 63 MERN Project</div>
  </div>
</body>
</html>
`;

module.exports = { sendEmail, getResetEmailHTML };