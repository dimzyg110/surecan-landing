import { getDb } from "../db";
import { auditLogs } from "../../drizzle/schema";
import type { Request } from "express";

/**
 * Log an audit event for compliance and security tracking
 * Required for HIPAA compliance and security auditing
 */
export async function logAudit({
  userId,
  action,
  resourceType,
  resourceId,
  metadata,
  req,
}: {
  userId?: number;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  req?: Request;
}) {
  try {
    const db = await getDb();
    if (!db) {
      console.error("[Audit Log] Database not available");
      return false;
    }

    // Extract IP and user agent from request
    const ipAddress = req
      ? (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "unknown"
      : "system";

    const userAgent = req ? (req.headers["user-agent"] as string) || "unknown" : "system";

    await db.insert(auditLogs).values({
      userId: userId || null,
      action,
      resourceType,
      resourceId: resourceId || null,
      metadata: metadata as any,
      ipAddress,
      userAgent,
      createdAt: new Date(),
    });

    console.log(`[Audit Log] ${action} on ${resourceType} ${resourceId || ""} by user ${userId || "system"}`);
    return true;
  } catch (error) {
    console.error(`[Audit Log] Failed to log audit event: ${error}`);
    return false;
  }
}

/**
 * Common audit actions for consistency
 */
export const AuditActions = {
  // Appointment actions
  APPOINTMENT_CREATED: "appointment.created",
  APPOINTMENT_UPDATED: "appointment.updated",
  APPOINTMENT_CANCELLED: "appointment.cancelled",
  APPOINTMENT_COMPLETED: "appointment.completed",
  APPOINTMENT_NO_SHOW: "appointment.no_show",

  // Payment actions
  PAYMENT_INITIATED: "payment.initiated",
  PAYMENT_SUCCEEDED: "payment.succeeded",
  PAYMENT_FAILED: "payment.failed",
  PAYMENT_REFUNDED: "payment.refunded",

  // Referral actions
  REFERRAL_CREATED: "referral.created",
  REFERRAL_UPDATED: "referral.updated",
  REFERRAL_CONTACTED: "referral.contacted",
  REFERRAL_BOOKED: "referral.booked",

  // User actions
  USER_LOGIN: "user.login",
  USER_LOGOUT: "user.logout",
  USER_UPDATED: "user.updated",
  USER_DELETED: "user.deleted",

  // Medical record actions
  MEDICAL_RECORD_VIEWED: "medical_record.viewed",
  MEDICAL_RECORD_CREATED: "medical_record.created",
  MEDICAL_RECORD_UPDATED: "medical_record.updated",

  // Prescription actions
  PRESCRIPTION_CREATED: "prescription.created",
  PRESCRIPTION_UPDATED: "prescription.updated",
  PRESCRIPTION_VERIFIED: "prescription.verified",
} as const;
