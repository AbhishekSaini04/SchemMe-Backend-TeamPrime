// ==========================
// IMPORTS
// ==========================
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// ==========================
// CATEGORY CONSTANTS
// ==========================
const categories = {
  agriculture: "Agriculture,Rural & Environment",
  banking: "Banking,Financial Services and Insurance",
  business: "Business & Entrepreneurship",
  education: "Education & Learning",
  health: "Health & Wellness",
  housing: "Housing & Shelter",
  law: "Public Safety,Law & Justice",
  science: "Science, IT & Communications",
  skills: "Skills & Employment",
  social: "Social welfare & Empowerment",
  sports: "Sports & Culture",
  transport: "Transport & Infrastructure",
  tourism: "Travel & Tourism",
  utility: "Utility & Sanitation",
  women: "Women and Child",
};

// ==========================
// GENERIC FUNCTION
// ==========================
const getSchemesByCategory = async (category: string, res: Response) => {
  try {
    const schemes = await prisma.scheme.findMany({
      where: {
        schemeCategory: category,
      },
      take: 100, // limit for performance
    });

    const count = await prisma.scheme.count({
      where: {
        schemeCategory: category,
      },
    });

    res.json({
      category,
      totalSchemes: count,
      data: schemes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch schemes" });
  }
};

// ==========================
// ROUTES (ALL CATEGORIES)
// ==========================

// Agriculture
router.get("/agriculture", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.agriculture, res);
});

// Banking
router.get("/banking", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.banking, res);
});

// Business
router.get("/business", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.business, res);
});

// Education
router.get("/education", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.education, res);
});

// Health
router.get("/health", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.health, res);
});

// Housing
router.get("/housing", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.housing, res);
});

// Law
router.get("/law", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.law, res);
});

// Science
router.get("/science", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.science, res);
});

// Skills
router.get("/skills", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.skills, res);
});

// Social Welfare
router.get("/social", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.social, res);
});

// Sports
router.get("/sports", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.sports, res);
});

// Transport
router.get("/transport", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.transport, res);
});

// Tourism
router.get("/tourism", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.tourism, res);
});

// Utility
router.get("/utility", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.utility, res);
});

// Women & Child
router.get("/women", async (req: Request, res: Response) => {
  await getSchemesByCategory(categories.women, res);
});

// ==========================
// EXPORT
// ==========================
export default router;