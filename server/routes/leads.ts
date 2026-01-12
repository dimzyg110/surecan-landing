import { Router } from "express";
import { getDb } from "../db";
import { leads, leadActivities, type InsertLead, type InsertLeadActivity } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const router = Router();

// Validation schema for lead creation/update
const leadSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().optional(),
  phone: z.string().optional(),
  profession: z.enum(["gp", "pharmacist", "allied_health", "other"]).optional(),
  role: z.string().optional(), // Accept role from engagement popup
  practice: z.string().optional(), // Accept practice from engagement popup
  practiceName: z.string().optional(),
  location: z.string().optional(),
  source: z.string().optional(),
  sourceId: z.string().optional(),
}).transform((data) => {
  // Map role to profession if profession not provided
  if (data.role && !data.profession) {
    const roleMap: Record<string, string> = {
      'GP': 'gp',
      'Pharmacist': 'pharmacist',
      'Physiotherapist': 'allied_health',
      'Psychologist': 'allied_health',
      'Allied Health': 'allied_health',
      'Other': 'other'
    };
    data.profession = roleMap[data.role] as any || 'other';
  }
  // Map practice to practiceName if practiceName not provided
  if (data.practice && !data.practiceName) {
    data.practiceName = data.practice;
  }
  return data;
});

// Activity points mapping
const ACTIVITY_POINTS = {
  page_view: 1,
  form_submit: 10,
  download: 5,
  referral_submit: 20,
  email_open: 2,
  email_click: 5,
};

/**
 * POST /api/leads
 * Create or update a lead
 */
router.post("/", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }

    const validatedData = leadSchema.parse(req.body);
    
    // Check if lead already exists
    const [existingLead] = await db.select().from(leads).where(eq(leads.email, validatedData.email));
    
    if (existingLead) {
      // Update existing lead
      await db.update(leads)
        .set({
          ...validatedData,
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(leads.id, existingLead.id));
      
      res.json({
        success: true,
        message: "Lead updated",
        leadId: existingLead.id,
      });
    } else {
      // Create new lead
      const insertData: InsertLead = {
        ...validatedData,
        engagementScore: 0,
        lastActivityAt: new Date(),
      };
      
      const [result] = await db.insert(leads).values(insertData);
      
      res.status(201).json({
        success: true,
        message: "Lead created",
        leadId: result.insertId,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.issues,
      });
    } else {
      console.error("Error creating/updating lead:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process lead",
      });
    }
  }
});

/**
 * POST /api/leads/:id/activity
 * Track lead activity and update engagement score
 */
router.post("/:id/activity", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }

    const leadId = parseInt(req.params.id);
    const { activityType, activityData } = req.body;
    
    if (!activityType) {
      res.status(400).json({ success: false, message: "Activity type is required" });
      return;
    }
    
    const points = ACTIVITY_POINTS[activityType as keyof typeof ACTIVITY_POINTS] || 0;
    
    // Record activity
    const activityInsert: InsertLeadActivity = {
      leadId,
      activityType,
      activityData: activityData ? JSON.stringify(activityData) : null,
      points,
    };
    
    await db.insert(leadActivities).values(activityInsert);
    
    // Update lead engagement score
    const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
    
    if (lead) {
      await db.update(leads)
        .set({
          engagementScore: (lead.engagementScore || 0) + points,
          lastActivityAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(leads.id, leadId));
    }
    
    res.json({
      success: true,
      message: "Activity tracked",
      points,
    });
  } catch (error) {
    console.error("Error tracking activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to track activity",
    });
  }
});

/**
 * GET /api/leads
 * Get all leads with optional filtering
 */
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }

    const { profession, minScore } = req.query;
    
    let allLeads = await db.select().from(leads);
    
    // Apply filters
    if (profession) {
      allLeads = allLeads.filter((l: any) => l.profession === profession);
    }
    if (minScore) {
      const minScoreNum = parseInt(minScore as string);
      allLeads = allLeads.filter((l: any) => (l.engagementScore || 0) >= minScoreNum);
    }
    
    // Sort by engagement score descending
    allLeads.sort((a: any, b: any) => (b.engagementScore || 0) - (a.engagementScore || 0));
    
    res.json({
      success: true,
      leads: allLeads,
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }
});

/**
 * GET /api/leads/:id
 * Get a specific lead with activity history
 */
router.get("/:id", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }

    const leadId = parseInt(req.params.id);
    
    const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
    
    if (!lead) {
      res.status(404).json({ success: false, message: "Lead not found" });
      return;
    }
    
    // Get activity history
    const activities = await db.select().from(leadActivities).where(eq(leadActivities.leadId, leadId));
    
    res.json({
      success: true,
      lead,
      activities,
    });
  } catch (error) {
    console.error("Error fetching lead:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch lead",
    });
  }
});

/**
 * POST /api/leads/webhook/klaviyo
 * Export leads to Klaviyo
 */
router.post("/webhook/klaviyo", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) {
      res.status(500).json({ success: false, message: "Database unavailable" });
      return;
    }

    const { leadIds } = req.body;
    
    if (!leadIds || !Array.isArray(leadIds)) {
      res.status(400).json({ success: false, message: "leadIds array is required" });
      return;
    }
    
    // Fetch leads
    const selectedLeads = await db.select().from(leads);
    const exportLeads = selectedLeads.filter((l: any) => leadIds.includes(l.id));
    
    // Format for Klaviyo
    const klaviyoData = exportLeads.map((lead: any) => ({
      email: lead.email,
      properties: {
        $first_name: lead.name?.split(' ')[0] || '',
        $last_name: lead.name?.split(' ').slice(1).join(' ') || '',
        $phone_number: lead.phone || '',
        profession: lead.profession || '',
        practice_name: lead.practiceName || '',
        location: lead.location || '',
        engagement_score: lead.engagementScore || 0,
        source: lead.source || '',
      },
    }));
    
    res.json({
      success: true,
      message: `${klaviyoData.length} leads formatted for Klaviyo`,
      data: klaviyoData,
    });
  } catch (error) {
    console.error("Error exporting to Klaviyo:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export leads",
    });
  }
});

export default router;
