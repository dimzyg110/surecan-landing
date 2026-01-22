import { getDb } from "../db";
import { appointments } from "../../drizzle/schema";
import { and, eq, gte, lte, isNull, or, sql } from "drizzle-orm";

/**
 * Check if a clinician has a conflicting appointment at the requested time
 * Prevents double-booking by detecting overlapping time slots
 * 
 * @param clinicianId - ID of the clinician
 * @param scheduledAt - Start time of the proposed appointment
 * @param duration - Duration in minutes
 * @param excludeAppointmentId - Optional appointment ID to exclude (for updates)
 * @returns true if conflict exists, false if time slot is available
 */
export async function hasAppointmentConflict({
  clinicianId,
  scheduledAt,
  duration,
  excludeAppointmentId,
}: {
  clinicianId: number;
  scheduledAt: Date;
  duration: number;
  excludeAppointmentId?: number;
}): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Calculate end time of proposed appointment
  const proposedEnd = new Date(scheduledAt.getTime() + duration * 60 * 1000);

  // Find overlapping appointments for this clinician
  // An appointment overlaps if:
  // 1. It starts before the proposed appointment ends, AND
  // 2. It ends after the proposed appointment starts
  // 
  // We need to calculate the end time of existing appointments:
  // endTime = scheduledAt + (duration * 60 * 1000 milliseconds)
  
  const conflictingAppointments = await db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.clinicianId, clinicianId),
        // Not cancelled or deleted
        or(
          eq(appointments.status, "pending_payment"),
          eq(appointments.status, "scheduled"),
          eq(appointments.status, "in_progress")
        ),
        isNull(appointments.deletedAt),
        // Exclude the appointment being updated (if any)
        excludeAppointmentId ? sql`${appointments.id} != ${excludeAppointmentId}` : sql`1=1`,
        // Check for time overlap
        // Existing appointment starts before proposed ends
        sql`${appointments.scheduledAt} < ${proposedEnd.toISOString()}`,
        // Existing appointment ends after proposed starts
        // End time = scheduledAt + (duration * 60000 milliseconds)
        sql`DATE_ADD(${appointments.scheduledAt}, INTERVAL ${appointments.duration} MINUTE) > ${scheduledAt.toISOString()}`
      )
    )
    .limit(1);

  return conflictingAppointments.length > 0;
}

/**
 * Get available time slots for a clinician on a specific date
 * 
 * @param clinicianId - ID of the clinician
 * @param date - Date to check (time will be ignored, only date matters)
 * @param slotDuration - Duration of each slot in minutes (default: 30)
 * @param workingHours - Working hours range (default: 9 AM to 5 PM)
 * @returns Array of available time slots
 */
export async function getAvailableSlots({
  clinicianId,
  date,
  slotDuration = 30,
  workingHours = { start: 9, end: 17 }, // 9 AM to 5 PM
}: {
  clinicianId: number;
  date: Date;
  slotDuration?: number;
  workingHours?: { start: number; end: number };
}): Promise<Date[]> {
  const availableSlots: Date[] = [];
  
  // Generate all possible slots for the day
  const startOfDay = new Date(date);
  startOfDay.setHours(workingHours.start, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(workingHours.end, 0, 0, 0);
  
  let currentSlot = new Date(startOfDay);
  
  while (currentSlot < endOfDay) {
    // Check if this slot has a conflict
    const hasConflict = await hasAppointmentConflict({
      clinicianId,
      scheduledAt: currentSlot,
      duration: slotDuration,
    });
    
    if (!hasConflict) {
      availableSlots.push(new Date(currentSlot));
    }
    
    // Move to next slot
    currentSlot = new Date(currentSlot.getTime() + slotDuration * 60 * 1000);
  }
  
  return availableSlots;
}
