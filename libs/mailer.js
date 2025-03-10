import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendResetPasswordEmail = async (email, token) => {
  const mailOptions = {
    to: email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset Request",
    text: `
      You requested a password reset.
      Click the link below to reset your password:

      ${process.env.FRONTEND_URL}/reset-password?token=${token}

      If you did not request this, please ignore this email.
    `,
  };

  await transporter.sendMail(mailOptions);
};
