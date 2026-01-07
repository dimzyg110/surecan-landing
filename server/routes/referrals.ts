import { Router } from "express";
import { getDb } from "../db";
import { referrals, type InsertReferral } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Validation schema for referral submission
const referralSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  patientEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
  patientPhone: z.string().optional(),
  patientDob: z.string().optional(),
  referrerType: z.enum(["gp", "pharmacist", "allied_health"]),
  referrerName: z.string().min(1, "Referrer name is required"),
  referrerEmail: z.string().email("Invalid email format"),
  referrerPhone: z.string().optional(),
  referrerPracticeName: z.string().optional(),
  clinicalIndication: z.string().min(10, "Please provide clinical indication (minimum 10 characters)"),
  currentMedications: z.string().optional(),
  relevantHistory: z.string().optional(),
  urgency: z.enum(["routine", "urgent", "emergency"]).default("routine"),
});

/**
 * POST /api/referrals
 * Submit a new referral
 */
router.post("/", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }
    
    const validatedData = referralSchema.parse(req.body);
    
    const insertData: InsertReferral = {
      ...validatedData,
      patientEmail: validatedData.patientEmail || null,
      status: "pending",
    };

    const [result] = await db.insert(referrals).values(insertData);
    
    res.status(201).json({
      success: true,
      message: "Referral submitted successfully",
      referralId: result.insertId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    } else {
      console.error("Error submitting referral:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit referral",
      });
    }
  }
});

/**
 * GET /api/referrals
 * Get all referrals (for clinic dashboard)
 */
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }
    
    const { status, referrerType } = req.query;
    
    let query = db.select().from(referrals);
    
    // Apply filters if provided
    // Note: This is a simplified version. For production, use proper query builders
    const allReferrals = await query;
    
    let filteredReferrals = allReferrals;
    if (status) {
      filteredReferrals = filteredReferrals.filter((r: any) => r.status === status);
    }
    if (referrerType) {
      filteredReferrals = filteredReferrals.filter((r: any) => r.referrerType === referrerType);
    }
    
    res.json({
      success: true,
      referrals: filteredReferrals,
    });
  } catch (error) {
    console.error("Error fetching referrals:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch referrals",
    });
  }
});

/**
 * GET /api/referrals/:id
 * Get a specific referral by ID
 */
router.get("/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }
    
    const id = parseInt(req.params.id);
    const [referral] = await db.select().from(referrals).where(eq(referrals.id, id));
    
    if (!referral) {
      res.status(404).json({
        success: false,
        message: "Referral not found",
      });
      return;
    }
    
    res.json({
      success: true,
      referral,
    });
  } catch (error) {
    console.error("Error fetching referral:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch referral",
    });
  }
});

/**
 * PATCH /api/referrals/:id/status
 * Update referral status
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }
    
    const id = parseInt(req.params.id);
    const { status, notes } = req.body;
    
    if (!["pending", "in_progress", "completed", "cancelled"].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
      return;
    }
    
    await db.update(referrals)
      .set({ status, notes, updatedAt: new Date() })
      .where(eq(referrals.id, id));
    
    res.json({
      success: true,
      message: "Referral status updated",
    });
  } catch (error) {
    console.error("Error updating referral:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update referral",
    });
  }
});

export default router;
