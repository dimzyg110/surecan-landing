import { Router } from "express";
import { getDb } from "../db";
import { qrCodes, type InsertQRCode } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";

const router = Router();

// Validation schema for QR code creation
const qrCodeSchema = z.object({
  pharmacyName: z.string().min(1, "Pharmacy name is required"),
  pharmacyEmail: z.string().email("Invalid email format").optional(),
  pharmacyPhone: z.string().optional(),
  pharmacyAddress: z.string().optional(),
});

/**
 * POST /api/qrcodes
 * Generate a new QR code for a pharmacy
 */
router.post("/", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }

    const validatedData = qrCodeSchema.parse(req.body);
    
    // Generate unique code
    const code = nanoid(12);
    
    const insertData: InsertQRCode = {
      code,
      ...validatedData,
      scans: 0,
    };
    
    const [result] = await db.insert(qrCodes).values(insertData);
    
    // Generate QR code URL
    const baseUrl = process.env.VITE_APP_URL || "https://surecan.clinic";
    const qrUrl = `${baseUrl}/referral?qr=${code}`;
    
    res.status(201).json({
      success: true,
      message: "QR code generated",
      qrCodeId: result.insertId,
      code,
      url: qrUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    } else {
      console.error("Error generating QR code:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate QR code",
      });
    }
  }
});

/**
 * GET /api/qrcodes/:code/scan
 * Track a QR code scan
 */
router.get("/:code/scan", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }

    const { code } = req.params;
    
    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.code, code));
    
    if (!qrCode) {
      res.status(404).json({ success: false, message: "QR code not found" });
      return;
    }
    
    // Update scan count
    await db.update(qrCodes)
      .set({
        scans: (qrCode.scans || 0) + 1,
        lastScannedAt: new Date(),
      })
      .where(eq(qrCodes.id, qrCode.id));
    
    res.json({
      success: true,
      pharmacy: {
        name: qrCode.pharmacyName,
        email: qrCode.pharmacyEmail,
        phone: qrCode.pharmacyPhone,
        address: qrCode.pharmacyAddress,
      },
    });
  } catch (error) {
    console.error("Error tracking QR scan:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track scan",
    });
  }
});

/**
 * GET /api/qrcodes
 * Get all QR codes with stats
 */
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }

    const allQRCodes = await db.select().from(qrCodes);
    
    // Sort by scans descending
    allQRCodes.sort((a: any, b: any) => (b.scans || 0) - (a.scans || 0));
    
    res.json({
      success: true,
      qrCodes: allQRCodes,
    });
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch QR codes",
    });
  }
});

/**
 * GET /api/qrcodes/:id
 * Get a specific QR code with details
 */
router.get("/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }

    const qrCodeId = parseInt(req.params.id);
    
    const [qrCode] = await db.select().from(qrCodes).where(eq(qrCodes.id, qrCodeId));
    
    if (!qrCode) {
      res.status(404).json({ success: false, message: "QR code not found" });
      return;
    }
    
    // Generate QR code URL
    const baseUrl = process.env.VITE_APP_URL || "https://surecan.clinic";
    const qrUrl = `${baseUrl}/referral?qr=${qrCode.code}`;
    
    res.json({
      success: true,
      qrCode: {
        ...qrCode,
        url: qrUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching QR code:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch QR code",
    });
  }
});

/**
 * DELETE /api/qrcodes/:id
 * Delete a QR code
 */
router.delete("/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }

    const qrCodeId = parseInt(req.params.id);
    
    await db.delete(qrCodes).where(eq(qrCodes.id, qrCodeId));
    
    res.json({
      success: true,
      message: "QR code deleted",
    });
  } catch (error) {
    console.error("Error deleting QR code:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete QR code",
    });
  }
});

export default router;
