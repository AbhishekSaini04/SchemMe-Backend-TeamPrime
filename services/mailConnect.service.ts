import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter
transporter
  .verify()
  .then(() => console.log("✅ Email service is ready"))
  .catch((err) => console.error("❌ Email service error:", err));
