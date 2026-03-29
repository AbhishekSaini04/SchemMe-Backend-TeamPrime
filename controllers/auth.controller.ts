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
  console.log("\n================ REGISTER API CALLED ================");
  console.log("📥 Incoming Body:", req.body);

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

    console.log("✅ Extracted Fields:", {
      email,
      gender,
      age,
      maritalStatus,
      areaType,
      state,
      socialCategory,
      isPwD,
      occupation,
      isBPL,
      annualIncome,
    });

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
      console.log("❌ Validation Failed");
      return res.status(400).json({ error: "All fields are required" });
    }

    console.log("✅ Validation Passed");

    // ✅ Check existing user
    console.log("🔍 Checking if user exists...");
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      console.log("❌ User already exists:", existingUser.email);
      return res.status(400).json({ error: "User already exists" });
    }

    console.log("✅ User does not exist");

    // ✅ Check existing OTP
    console.log("🔍 Checking existing OTP...");
    const existingOTP = await prisma.otp.findUnique({ where: { email } });

    if (existingOTP) {
      console.log("❌ OTP already exists for this email");
      return res.status(400).json({
        error:
          "OTP already sent. Please verify using the previous OTP or wait 3 days.",
      });
    }

    console.log("✅ No existing OTP found");

    // ✅ Generate OTP
    const otp = generateOTP();
    console.log("🔢 Generated OTP:", otp);

    // ✅ Hash password + OTP
    console.log("🔐 Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);

    console.log("🔐 Hashing OTP...");
    const otpHash = await bcrypt.hash(otp, 10);

    console.log("✅ Hashing complete");

    // ✅ Save in OTP table
    console.log("💾 Saving OTP record to DB...");
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

    console.log("✅ OTP record saved successfully");

    // ✅ Send OTP Email
    console.log("📧 Sending OTP email...");
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
      console.log("📨 Message ID:", info.messageId);
      console.log("====================================");

      if (!info.messageId) {
        console.log("❌ Message ID missing");
        return res.status(500).json({ error: "Failed to send OTP email" });
      }
    } catch (error: any) {
      console.error("❌ Error sending email:", error.message);
      console.error("❌ Full error:", error);
      return res.status(500).json({ error: "Email sending failed" });
    }

    console.log("🎉 Registration flow completed (OTP stage)");

    return res.status(200).json({
      message:
        "Registration initiated. OTP sent to your email. Please verify within 3 days.",
      email,
    });
  } catch (error: any) {
    console.error("🔥 REGISTER ERROR:", error.message);
    console.error("🔥 FULL ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ================= VERIFY OTP =================
export const verifyOTP = async (req: Request, res: Response) => {
  console.log("\n================ VERIFY OTP API CALLED ================");
  console.log("📥 Incoming Body:", req.body);

  try {
    const { email, otp } = req.body;

    console.log("📧 Email:", email);
    console.log("🔢 OTP Entered:", otp);

    if (!email || !otp) {
      console.log("❌ Missing email or OTP");
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    console.log("🔍 Fetching OTP record...");
    const otpRecord = await prisma.otp.findUnique({ where: { email } });

    if (!otpRecord) {
      console.log("❌ OTP record not found");
      return res
        .status(400)
        .json({ error: "OTP not found or email not registered" });
    }

    console.log("✅ OTP record found");

    // ✅ Expiry check
    console.log("⏳ Checking OTP expiry...");
    if (new Date() > otpRecord.expiresAt) {
      console.log("❌ OTP expired");
      await prisma.otp.delete({ where: { email } });
      return res
        .status(400)
        .json({ error: "OTP has expired. Please register again." });
    }

    console.log("✅ OTP is valid (not expired)");

    // ✅ Verify OTP
    console.log("🔐 Comparing OTP...");
    const isOTPValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isOTPValid) {
      console.log("❌ Invalid OTP");
      return res.status(400).json({ error: "Invalid OTP" });
    }

    console.log("✅ OTP verified successfully");

    // ✅ Create user
    console.log("👤 Creating user...");
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

    console.log("✅ User created:", user.id);

    // ✅ Delete OTP
    console.log("🗑 Deleting OTP record...");
    await prisma.otp.delete({ where: { email } });

    console.log("✅ OTP deleted");

    // ✅ Generate JWT
    console.log("🔑 Generating JWT...");
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        gender: user.gender,
        age: user.age,
        maritalStatus: user.maritalStatus,
        areaType: user.areaType,
        state: user.state,
        socialCategory: user.socialCategory,
        isPwD: user.isPwD,
        disabilityType: user.disabilityType,
        disabilityPercentage: user.disabilityPercentage,
        occupation: user.occupation,
        isBPL: user.isBPL,
        annualIncome: user.annualIncome,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    console.log("✅ JWT Generated");

    console.log("🎉 USER REGISTRATION COMPLETE");

    return res.status(200).json({
      message: "User registered successfully",
      token,
    });
  } catch (error: any) {
    console.error("🔥 VERIFY OTP ERROR:", error.message);
    console.error("🔥 FULL ERROR:", error);
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
      {
        id: user.id,
        email: user.email,
        gender: user.gender,
        age: user.age,
        maritalStatus: user.maritalStatus,
        areaType: user.areaType,
        state: user.state,
        socialCategory: user.socialCategory,
        isPwD: user.isPwD,
        disabilityType: user.disabilityType,
        disabilityPercentage: user.disabilityPercentage,
        occupation: user.occupation,
        isBPL: user.isBPL,
        annualIncome: user.annualIncome,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    console.log("====================================");
    console.log("logedin");
    console.log("====================================");
    res.json({ token });
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
