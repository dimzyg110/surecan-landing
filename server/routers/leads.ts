import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { leads } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import * as schema from "../../drizzle/schema";

export const leadsRouter = router({
  /**
   * Create a new lead from engagement popup
   * Public endpoint - no authentication required
   */
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        practice: z.string().optional(),
        role: z.enum(["Pharmacist", "Allied Health", "GP"]),
        source: z.string().default("engagement_popup"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");

      try {
        // Check if lead already exists
        const existingLeads = await db
          .select()
          .from(leads)
          .where(eq(leads.email, input.email))
          .limit(1);

        const existingLead = existingLeads[0];

        if (existingLead) {
          // Update existing lead with new information
          await db
            .update(leads)
            .set({
              name: input.name,
              phone: input.phone || existingLead.phone,
              practiceName: input.practice || existingLead.practiceName,
              profession: input.role.toLowerCase().replace(" ", "_"),
              source: input.source,
              lastActivityAt: new Date(),
              engagementScore: (existingLead.engagementScore || 0) + 5,
              updatedAt: new Date(),
            })
            .where(eq(leads.id, existingLead.id));

          return {
            success: true,
            leadId: existingLead.id,
            message: "Lead updated successfully",
          };
        }

        // Create new lead
        const [newLead] = await db.insert(leads).values({
          email: input.email,
          name: input.name,
          phone: input.phone,
          practiceName: input.practice,
          profession: input.role.toLowerCase().replace(" ", "_"),
          source: input.source,
          engagementScore: 5,
          lastActivityAt: new Date(),
        });

        return {
          success: true,
          leadId: newLead.insertId,
          message: "Lead created successfully",
        };
      } catch (error) {
        console.error("[Leads Router] Error creating lead:", error);
        throw new Error("Failed to submit lead information");
      }
    }),
});
