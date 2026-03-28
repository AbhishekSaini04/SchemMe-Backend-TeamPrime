import { transporter } from "./mailConnect.service.js";
import { otpEmailTemplate } from "../utils/otpMailTamplate.util.js";

export const sendOTP = async (email: string, otp: string) => {
  try {
    if (!email || !otp) {
      throw new Error("Email and OTP are required");
    }

    const info = await transporter.sendMail({
      from: `"SchemMe" <abhisainiji46@gmail.com>`,
      to: email,
      subject: "SchemMe: OTP for Registration",
      html: otpEmailTemplate(otp),
    });

    console.log("====================================");
    console.log("✅ OTP SENT SUCCESSFULLY");
    console.log("Message ID:", info.messageId);
    console.log("====================================");

    return true; // ✅ useful for controller
  } catch (error: any) {
    console.error("❌ Error sending email:", error.message);
    return false; // ✅ handle failure
  }
};
