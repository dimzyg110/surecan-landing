import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { leads } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import * as schema from "../../drizzle/schema";
import { sendEmail, createEmailTemplate } from "../_core/email";

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

        // Send thank you email (only for new submissions, not updates)
        // Skip email for updates to avoid spam
        
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

        // Send thank you email to new lead
        try {
          const emailContent = createEmailTemplate(`
            <h2>Thank You for Your Interest! 🙏</h2>
            <p>Hi ${input.name},</p>
            <p>Thank you for reaching out to Surecan Clinic. We're excited to connect with you about our Shared Care model for medical cannabis.</p>
            
            <div class="info-box">
              <strong>What Happens Next?</strong><br>
              Our team will review your inquiry and reach out within 1-2 business days to discuss:
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li>How our Shared Care model works</li>
                <li>Revenue protection for your practice</li>
                <li>Patient outcomes and success rates</li>
                <li>Getting started with referrals</li>
              </ul>
            </div>

            <h3>In the Meantime</h3>
            <p>Feel free to explore our website to learn more about:</p>
            <ul>
              <li><strong>The Boomerang Protocol:</strong> How we return patients to your care</li>
              <li><strong>Safety & Compliance:</strong> Our TGA-approved processes</li>
              <li><strong>Prescriber Support:</strong> Resources and training available</li>
            </ul>

            <a href="https://surecan.com.au" class="button">Visit Our Website</a>

            <h3>Questions?</h3>
            <p>Don't hesitate to reach out:</p>
            <p>📞 <strong>1300 SURECAN</strong> | 📧 <strong>info@surecan.com.au</strong></p>

            <p style="margin-top: 32px;">We look forward to partnering with you!</p>
            <p><strong>The Surecan Team</strong></p>
          `);

          await sendEmail({
            to: input.email,
            subject: "Thank You for Your Interest - Surecan Clinic",
            html: emailContent,
          });

          console.log("[Leads] Thank you email sent to:", input.email);
        } catch (emailError) {
          console.error("[Leads] Failed to send thank you email:", emailError);
          // Don't fail the lead creation if email fails
        }

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
