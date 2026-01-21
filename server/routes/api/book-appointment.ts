import { Router } from "express";
import { getDb } from "../../db";
import { generatePatientId } from "../../utils/identifiers";
import { appointments, referrals } from "../../../drizzle/schema";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * POST /api/appointments/book
 * Book a new appointment (internal booking flow)
 */
router.post("/book", async (req, res) => {
  try {
    const {
      patientName,
      patientEmail,
      patientPhone,
      patientDob,
      appointmentType,
      preferredDate,
      preferredTime,
      medicalHistory,
      currentMedications,
      reasonForConsultation,
      referralId,
    } = req.body;

    // Validate required fields
    if (!patientName || !patientEmail || !patientPhone || !patientDob || !preferredDate || !preferredTime || !reasonForConsultation) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Database not available",
      });
    }

    const patientId = generatePatientId();

    // Create appointment record
    const [result] = await db.insert(appointments).values({
      patientId,
      patientName,
      patientEmail,
      patientPhone,
      patientDob,
      appointmentType: appointmentType || "initial",
      preferredDate,
      preferredTime,
      medicalHistory: medicalHistory || "",
      currentMedications: currentMedications || "",
      reasonForConsultation,
      referralId: referralId || null,
      status: "pending",
      createdAt: new Date(),
    });

    // If this is a referral-based booking, update the referral status
    if (referralId) {
      await db
        .update(referrals)
        .set({ status: "booked", patientId })
        .where(eq(referrals.referralId, referralId));
    }

    // TODO: Send confirmation email to patient
    // TODO: Send notification to clinic staff
    // TODO: Create Google Calendar event

    res.json({
      success: true,
      message: "Appointment booking submitted successfully",
      appointmentId: (result as any).insertId,
      patientId,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book appointment",
    });
  }
});

/**
 * GET /api/referrals/by-id/:referralId
 * Get referral information for pre-filling booking form
 */
router.get("/by-id/:referralId", async (req, res) => {
  try {
    const { referralId } = req.params;
    const { token } = req.query;

    if (!referralId || !token) {
      return res.status(400).json({
        success: false,
        message: "Missing referral ID or token",
      });
    }

    const db = await getDb();
    if (!db) {
      return res.status(500).json({
        success: false,
        message: "Database not available",
      });
    }

    const results = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referralId, referralId));

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Referral not found",
      });
    }

    const referral = results[0];

    // Verify token matches
    if (!referral.uniqueBookingLink || !referral.uniqueBookingLink.includes(`token=${token}`)) {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }

    res.json({
      success: true,
      referral,
    });
  } catch (error) {
    console.error("Error fetching referral:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch referral information",
    });
  }
});

export default router;
