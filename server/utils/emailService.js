const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendWelcomeEmail = async (email, name, password) => {
  const loginUrl = `${process.env.APP_URL}/login`;

  const mailOptions = {
    from: `"SHNOOR LMS" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Welcome to SHNOOR LMS - Your Login Credentials",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #3b82f6;">Welcome to SHNOOR LMS, ${name}!</h2>
        <p>Your account has been created by the administrator. You can now log in using the credentials below:</p>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
        </div>

        <p>Please click the button below to log in and start your learning journey:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}" style="background-color: #3b82f6; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Login to SHNOOR LMS</a>
        </div>

        <p>Once logged in, you can change your password from your profile settings.</p>
        <p style="color: #6b7280; font-size: 0.9rem;">If you have any issues, please contact your administrator.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.8rem; color: #9ca3af;">&copy; 2026 SHNOOR INTERNATIONAL LLC. All rights reserved.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendWelcomeEmail };
