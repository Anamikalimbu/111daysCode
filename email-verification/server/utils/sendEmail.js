const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendVerificationEmail = async ({ name, email, token }) => {
  const transporter = createTransporter();
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Email Verify App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: '✉️ Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Verify Your Email</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f4ff; margin: 0; padding: 0; }
            .wrapper { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(99,102,241,0.12); }
            .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 40px 32px; text-align: center; }
            .header h1 { color: #fff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px; }
            .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
            .body { padding: 40px 32px; }
            .body p { color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
            .btn-wrap { text-align: center; margin: 32px 0; }
            .btn { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-size: 16px; font-weight: 600; letter-spacing: 0.2px; }
            .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
            .link-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; word-break: break-all; font-size: 12px; color: #6b7280; }
            .footer { background: #f9fafb; padding: 20px 32px; text-align: center; }
            .footer p { color: #9ca3af; font-size: 12px; margin: 0; }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="header">
              <h1>📬 Verify Your Email</h1>
              <p>You're almost there!</p>
            </div>
            <div class="body">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thanks for registering! Click the button below to verify your email address and activate your account. This link expires in <strong>24 hours</strong>.</p>
              <div class="btn-wrap">
                <a href="${verificationUrl}" class="btn">Verify My Email</a>
              </div>
              <hr class="divider" />
              <p style="font-size:13px; color:#6b7280;">If the button doesn't work, copy and paste this link into your browser:</p>
              <div class="link-box">${verificationUrl}</div>
              <p style="font-size:13px; color:#9ca3af; margin-top: 20px;">If you didn't create an account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Email Verify App. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };