import { Request, Response } from "express";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateOTP } from "../services/generateOTP.service.js";
import { sendOTP } from "../services/sendOTP.service.js";
import nodemailer from "nodemailer";
import { otpEmailTemplate } from "../utils/otpMailTamplate.util.js";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "abhisainiji46@gmail.com",
    pass: "ewri oqss vulu cadr",
  },
});

// ================= REGISTER =================
export const register = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      gender,
      age,
      maritalStatus,
      areaType,
      state,
      socialCategory,
      isPwD,
      disabilityType,
      disabilityPercentage,
      occupation,
      isBPL,
      annualIncome,
    } = req.body;

    // ✅ Validation
    if (
      !email ||
      !password ||
      !gender ||
      age === undefined ||
      !maritalStatus ||
      !areaType ||
      !state ||
      !socialCategory ||
      isPwD === undefined ||
      !occupation ||
      isBPL === undefined ||
      !annualIncome
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Check existing user
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // ✅ Check existing OTP
    const existingOTP = await prisma.otp.findUnique({ where: { email } });
    if (existingOTP) {
      return res.status(400).json({
        error:
          "OTP already sent. Please verify using the previous OTP or wait 3 days.",
      });
    }

    // ✅ Generate OTP
    const otp = generateOTP();

    // ✅ Hash password + OTP
    const passwordHash = await bcrypt.hash(password, 10);
    const otpHash = await bcrypt.hash(otp, 10);

    // ✅ Save in OTP table
    await prisma.otp.create({
      data: {
        email,
        otpHash,
        passwordHash,
        gender,
        age,
        maritalStatus,
        areaType,
        state,
        socialCategory,
        isPwD,
        disabilityType,
        disabilityPercentage,
        occupation,
        isBPL,
        annualIncome,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    });

    // // ✅ Send OTP via email service
    // const emailSent = await sendOTP(email, otp);
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
      if (!info.messageId) {
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
    } catch (error: any) {
      console.error("❌ Error sending email:", error.message);
      return false; // ✅ handle failure
    }

    return res.status(200).json({
      message:
        "Registration initiated. OTP sent to your email. Please verify within 3 days.",
      email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= VERIFY OTP =================
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const otpRecord = await prisma.otp.findUnique({ where: { email } });

    if (!otpRecord) {
      return res
        .status(400)
        .json({ error: "OTP not found or email not registered" });
    }

    // ✅ Expiry check
    if (new Date() > otpRecord.expiresAt) {
      await prisma.otp.delete({ where: { email } });
      return res
        .status(400)
        .json({ error: "OTP has expired. Please register again." });
    }

    // ✅ Verify OTP
    const isOTPValid = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isOTPValid) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // ✅ Create user
    const user = await prisma.user.create({
      data: {
        email: otpRecord.email,
        password: otpRecord.passwordHash,
        gender: otpRecord.gender,
        age: otpRecord.age,
        maritalStatus: otpRecord.maritalStatus,
        areaType: otpRecord.areaType,
        state: otpRecord.state,
        socialCategory: otpRecord.socialCategory,
        isPwD: otpRecord.isPwD,
        disabilityType: otpRecord.disabilityType,
        disabilityPercentage: otpRecord.disabilityPercentage,
        occupation: otpRecord.occupation,
        isBPL: otpRecord.isBPL,
        annualIncome: otpRecord.annualIncome,
      },
    });

    // ✅ Delete OTP
    await prisma.otp.delete({ where: { email } });

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    return res.status(200).json({
      message: "User registered successfully",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= LOGIN =================
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= GET USERS =================
export const signedUpUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
