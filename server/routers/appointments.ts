import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { appointments, users } from "../../drizzle/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { createVideoRoom } from "../_core/daily";
import { createCalendarEvent } from "../_core/googleCalendar";
import { hasAppointmentConflict } from "../_core/conflictDetection";
import { logAudit, AuditActions } from "../_core/auditLog";
import { sendEmail, createEmailTemplate } from "../_core/email";
import { generateAppointmentICS } from "../_core/calendar";

export const appointmentsRouter = router({
  // Get all appointments for the current user (patient or clinician)
  list: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    
    if (user.role === "patient") {
      return await db
        .select()
        .from(appointments)
        .where(eq(appointments.patientId, user.id))
        .orderBy(desc(appointments.scheduledAt));
    } else if (user.role === "clinician") {
      return await db
        .select()
        .from(appointments)
        .where(eq(appointments.clinicianId, user.id))
        .orderBy(desc(appointments.scheduledAt));
    }
    
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Invalid user role for appointments",
    });
  }),

  // Get upcoming appointments
  upcoming: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const now = new Date();
    
    if (user.role === "patient") {
      return await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.patientId, user.id),
            gte(appointments.scheduledAt, now),
            eq(appointments.status, "scheduled")
          )
        )
        .orderBy(appointments.scheduledAt);
    } else if (user.role === "clinician") {
      return await db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.clinicianId, user.id),
            gte(appointments.scheduledAt, now),
            eq(appointments.status, "scheduled")
          )
        )
        .orderBy(appointments.scheduledAt);
    }
    
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Invalid user role for appointments",
    });
  }),

  // Get a single appointment by ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const appointment = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, input.id))
        .limit(1);

      if (!appointment.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Appointment not found",
        });
      }

      const appt = appointment[0];
      
      // Check if user has access to this appointment
      if (user.role === "patient" && appt.patientId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this appointment",
        });
      }
      
      if (user.role === "clinician" && appt.clinicianId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this appointment",
        });
      }

      return appt;
    }),

  // Create a new appointment (patients only)
  create: protectedProcedure
    .input(
      z.object({
        clinicianId: z.number(),
        scheduledAt: z.string(), // ISO date string
        duration: z.number().default(30),
        appointmentType: z.enum(["initial", "follow_up", "emergency"]).default("initial"),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      if (user.role !== "patient") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only patients can book appointments",
        });
      }

      // Verify clinician exists
      const clinician = await db
        .select()
        .from(users)
        .where(eq(users.id, input.clinicianId))
        .limit(1);

      if (!clinician.length || clinician[0].role !== "clinician") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid clinician ID",
        });
      }

      // CRITICAL: Check for appointment conflicts
      const scheduledDate = new Date(input.scheduledAt);
      const hasConflict = await hasAppointmentConflict({
        clinicianId: input.clinicianId,
        scheduledAt: scheduledDate,
        duration: input.duration,
      });

      if (hasConflict) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "This time slot is no longer available. Please choose another time.",
        });
      }

      // Create Daily.co video room for this appointment
      const roomName = `appointment-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      let videoRoomUrl: string | null = null;
      
      try {
        const videoRoom = await createVideoRoom({
          name: roomName,
          privacy: "private",
          properties: {
            exp: Math.floor(new Date(input.scheduledAt).getTime() / 1000) + (input.duration * 60) + 3600, // Expires 1 hour after appointment ends
            enable_screenshare: true,
            enable_chat: true,
            enable_prejoin_ui: true,
          },
        });
        videoRoomUrl = videoRoom.url;
      } catch (error) {
        console.error("Failed to create video room:", error);
        // Continue without video room - can be added later
      }
      
      // Create Google Calendar event
      let googleCalendarEventId: string | null = null;
      try {
        const scheduledDate = new Date(input.scheduledAt);
        const endDate = new Date(scheduledDate.getTime() + input.duration * 60000);
        
        googleCalendarEventId = await createCalendarEvent({
          summary: `${input.appointmentType === "initial" ? "Initial" : "Follow-up"} Consultation - Surecan`,
          description: `Video consultation with ${clinician[0].name}${input.notes ? `\n\nNotes: ${input.notes}` : ""}${videoRoomUrl ? `\n\nVideo Call: ${videoRoomUrl}` : ""}`,
          start: {
            dateTime: scheduledDate.toISOString(),
            timeZone: "Australia/Sydney",
          },
          end: {
            dateTime: endDate.toISOString(),
            timeZone: "Australia/Sydney",
          },
          attendees: [
            { email: user.email || "", displayName: user.name || "" },
            { email: clinician[0].email || "", displayName: clinician[0].name || "" },
          ],
          reminders: {
            useDefault: false,
            overrides: [
              { method: "email", minutes: 24 * 60 }, // 1 day before
              { method: "popup", minutes: 60 }, // 1 hour before
            ],
          },
        });
      } catch (error) {
        console.error("Failed to create calendar event:", error);
        // Continue without calendar event - can be added later
      }
      
      const result = await db.insert(appointments).values({
        patientId: user.id,
        clinicianId: input.clinicianId,
        scheduledAt: new Date(input.scheduledAt),
        duration: input.duration,
        appointmentType: input.appointmentType,
        status: "scheduled",
        notes: input.notes,
        videoRoomUrl,
        googleCalendarEventId,
      });

      const appointmentId = Number((result as any).insertId);

      // Send confirmation email with calendar attachment
      if (user.email) {
        try {
          const scheduledDate = new Date(input.scheduledAt);
          const endDate = new Date(scheduledDate.getTime() + input.duration * 60000);
          
          // Generate .ics calendar file
          const icsContent = generateAppointmentICS({
            title: `${input.appointmentType === "initial" ? "Initial" : "Follow-up"} Consultation - Surecan`,
            description: `Video consultation with ${clinician[0].name || "your clinician"}${input.notes ? `\n\nNotes: ${input.notes}` : ""}${videoRoomUrl ? `\n\nVideo Call: ${videoRoomUrl}` : ""}`,
            location: videoRoomUrl || "Video Call (link will be sent)",
            startTime: scheduledDate,
            endTime: endDate,
            organizerEmail: "appointments@surecan.com.au",
            attendeeEmail: user.email,
          });

          const emailContent = createEmailTemplate(`
            <h2>Appointment Confirmed! 🎉</h2>
            <p>Hi ${user.name || "there"},</p>
            <p>Your appointment has been successfully booked with Surecan Clinic.</p>
            
            <div class="info-box">
              <strong>Appointment Details:</strong><br>
              <strong>Type:</strong> ${input.appointmentType === "initial" ? "Initial Consultation" : "Follow-up Consultation"}<br>
              <strong>Date & Time:</strong> ${scheduledDate.toLocaleString("en-AU", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric", 
                hour: "2-digit", 
                minute: "2-digit",
                timeZone: "Australia/Sydney"
              })} AEDT<br>
              <strong>Duration:</strong> ${input.duration} minutes<br>
              <strong>Clinician:</strong> ${clinician[0].name || "TBA"}
            </div>

            ${videoRoomUrl ? `
              <p><strong>Video Call Link:</strong></p>
              <a href="${videoRoomUrl}" class="button">Join Video Call</a>
              <p style="font-size: 14px; color: #64748b;">You can join the call up to 15 minutes before your appointment time.</p>
            ` : ""}

            <h3>What to Prepare:</h3>
            <ul>
              <li>Your medical history and current medications</li>
              <li>List of symptoms or concerns you want to discuss</li>
              <li>Photo ID for verification</li>
              <li>Medicare card (if applicable)</li>
            </ul>

            <h3>Need to Reschedule?</h3>
            <p>Please contact us at least 24 hours before your appointment:</p>
            <p>📞 <strong>1300 SURECAN</strong> | 📧 <strong>appointments@surecan.com.au</strong></p>

            <p style="margin-top: 32px;">We look forward to seeing you!</p>
            <p><strong>The Surecan Team</strong></p>
          `);

          const attachments = icsContent ? [
            {
              filename: "appointment.ics",
              content: icsContent,
              contentType: "text/calendar",
            },
          ] : [];

          await sendEmail({
            to: user.email,
            subject: `Appointment Confirmed - ${scheduledDate.toLocaleDateString("en-AU")}`,
            html: emailContent,
            attachments,
          });

          console.log("[Appointments] Confirmation email sent to:", user.email);
        } catch (emailError) {
          console.error("[Appointments] Failed to send confirmation email:", emailError);
          // Don't fail the appointment creation if email fails
        }
      }

      return {
        success: true,
        appointmentId,
        videoRoomUrl,
      };
    }),

  // Update appointment status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["scheduled", "in_progress", "completed", "cancelled", "no_show"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Get the appointment first
      const appointment = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, input.id))
        .limit(1);

      if (!appointment.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Appointment not found",
        });
      }

      const appt = appointment[0];

      // Check permissions
      if (user.role === "patient" && appt.patientId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this appointment",
        });
      }

      if (user.role === "clinician" && appt.clinicianId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this appointment",
        });
      }

      await db
        .update(appointments)
        .set({ status: input.status })
        .where(eq(appointments.id, input.id));

      return { success: true };
    }),

  // Cancel appointment
  cancel: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const appointment = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, input.id))
        .limit(1);

      if (!appointment.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Appointment not found",
        });
      }

      const appt = appointment[0];

      // Check permissions
      if (user.role === "patient" && appt.patientId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this appointment",
        });
      }

      if (user.role === "clinician" && appt.clinicianId !== user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this appointment",
        });
      }

      await db
        .update(appointments)
        .set({ status: "cancelled" })
        .where(eq(appointments.id, input.id));

      return { success: true };
    }),

  // Get available clinicians for booking
  getAvailableClinicians: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        specialization: users.specialization,
        ahpraNumber: users.ahpraNumber,
      })
      .from(users)
      .where(eq(users.role, "clinician"));
  }),
});
