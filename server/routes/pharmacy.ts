import { Router } from "express";
import { getDb } from "../db";
import { z } from "zod";

const router = Router();

// Validation schema for pharmacy partnership
const pharmacySchema = z.object({
  pharmacyName: z.string().min(1, "Pharmacy name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
});

/**
 * POST /api/pharmacy-partnership
 * Submit a pharmacy partnership request
 */
router.post("/", async (req, res) => {
  try {
    const validatedData = pharmacySchema.parse(req.body);
    
    // For now, we'll just log the data and send a success response
    // In production, you would save this to a database table
    console.log("[Pharmacy Partnership Request]", validatedData);
    
    // TODO: Send email notification to clinic staff
    // TODO: Add to CRM/database
    
    res.status(201).json({
      success: true,
      message: "Partnership request submitted successfully",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    } else {
      console.error("Error submitting pharmacy partnership:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit partnership request",
      });
    }
  }
});

export default router;
