import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { appointments, users } from "../../drizzle/schema";
import { eq, and, gte, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

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

      const result = await db.insert(appointments).values({
        patientId: user.id,
        clinicianId: input.clinicianId,
        scheduledAt: new Date(input.scheduledAt),
        duration: input.duration,
        appointmentType: input.appointmentType,
        status: "scheduled",
        notes: input.notes,
      });

      return {
        success: true,
        appointmentId: Number((result as any).insertId),
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
