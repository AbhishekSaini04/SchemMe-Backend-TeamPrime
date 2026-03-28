// ==========================
// IMPORTS
// ==========================
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import schemeSearchRoute from "./routes/schemeSearch.route.js";
import { PrismaClient } from "@prisma/client";

// ==========================
// INIT
// ==========================
dotenv.config();

const app = express();
const prisma = new PrismaClient();

const port = process.env.PORT || 3005;

// Fix for __dirname in ES modules
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV path (fixed)
const CSV_PATH = path.join(__dirname, "public", "schemes.csv");

// ==========================
// MIDDLEWARE
// ==========================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================
// UTILS (🔥 IMPORTANT)
// ==========================
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

// ==========================
// ROUTES
// ==========================
app.get("/", (req, res) => {
  res.send("🚀 Server is running");
});

// ==========================
// IMPORT ROUTE (FIXED)
// ==========================
app.get("/import-schemes", async (req, res) => {
  try {
    const results: any[] = [];

    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on("data", (data: Record<string, string>) => {
        results.push({
          scheme_name: data.scheme_n || data.scheme_name || "",
          slug: data.slug || null,
          details: data.details || null,
          benefits: data.benefits || null,
          eligibility: data.eligibility || null,
          application: data.application || null,
          documents: data.documents || null,
          level: data.level || null,
          schemeCategory: data.schemeCategory || null,
          tags: data.tags || null,
          level_name: data["level name"] || data.level_name || null,
          search_tags: data["search tags"] || data.search_tags || null,
        });
      })
      .on("end", async () => {
        console.log(`📊 Total rows: ${results.length}`);

        // 🔥 FIXED SETTINGS
        const chunkSize = 100; // ↓ reduced from 500
        let successCount = 0;

        for (let i = 0; i < results.length; i += chunkSize) {
          const chunk = results.slice(i, i + chunkSize);

          try {
            await prisma.scheme.createMany({
              data: chunk,
              skipDuplicates: true,
            });

            successCount += chunk.length;
            console.log(`✅ Inserted chunk ${i / chunkSize + 1}`);
          } catch (err) {
            console.error("❌ Chunk failed:", err);
          }

          // 🔥 VERY IMPORTANT (prevents crash)
          await sleep(200);
        }

        res.json({
          message: "✅ Data imported successfully",
          inserted: successCount,
          total: results.length,
        });
      })
      .on("error", (err) => {
        console.error("❌ CSV Read Error:", err);
        res.status(500).json({ error: "CSV read failed" });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Import failed" });
  }
});

app.use("/api/schemes", schemeSearchRoute);

// ==========================
// START SERVER
// ==========================
app.listen(port, () => {
  console.log(`🔥 Server is running on http://localhost:${port}`);
});