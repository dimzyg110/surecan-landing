import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "patient", "clinician"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
  // Additional fields for patient/clinician portals
  phone: varchar("phone", { length: 50 }),
  dateOfBirth: varchar("dateOfBirth", { length: 20 }),
  medicalHistory: text("medicalHistory"),
  ahpraNumber: varchar("ahpraNumber", { length: 50 }), // For clinicians
  specialization: varchar("specialization", { length: 255 }), // For clinicians
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Referrals table for storing patient referral submissions
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  // Unique Identifiers (SURE-R-XXXXXX format)
  referralId: varchar("referralId", { length: 50 }).notNull().unique(),
  patientId: varchar("patientId", { length: 50 }), // SURE-P-XXXXXX format, assigned after booking
  uniqueBookingLink: varchar("uniqueBookingLink", { length: 500 }).notNull().unique(),
  // Foreign Keys for referrer tracking
  prescriberId: int("prescriberId"), // Links to users table if prescriber has account
  pharmacyId: int("pharmacyId"), // Links to users table if pharmacy has account
  // Patient Information
  patientName: varchar("patientName", { length: 255 }).notNull(),
  patientEmail: varchar("patientEmail", { length: 320 }),
  patientPhone: varchar("patientPhone", { length: 50 }),
  patientDob: varchar("patientDob", { length: 20 }),
  // Referrer Information
  referrerType: mysqlEnum("referrerType", ["gp", "pharmacist", "allied_health"]).notNull(),
  referrerName: varchar("referrerName", { length: 255 }).notNull(),
  referrerEmail: varchar("referrerEmail", { length: 320 }).notNull(),
  referrerPhone: varchar("referrerPhone", { length: 50 }),
  referrerPracticeName: varchar("referrerPracticeName", { length: 255 }),
  // Clinical Information
  clinicalIndication: text("clinicalIndication").notNull(),
  currentMedications: text("currentMedications"),
  relevantHistory: text("relevantHistory"),
  urgency: mysqlEnum("urgency", ["routine", "urgent", "emergency"]).default("routine").notNull(),
  // Status
  status: mysqlEnum("status", ["pending", "contacted", "booked", "completed", "cancelled"]).default("pending").notNull(),
  bookingCompletedAt: timestamp("bookingCompletedAt"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;

/**
 * Education progress tracking
 */
export const educationProgress = mysqlTable("educationProgress", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  sectionName: varchar("sectionName", { length: 255 }).notNull(),
  completed: int("completed").default(0).notNull(), // 0 or 1 for boolean
  viewedAt: timestamp("viewedAt").defaultNow().notNull(),
});

export type EducationProgress = typeof educationProgress.$inferSelect;
export type InsertEducationProgress = typeof educationProgress.$inferInsert;

/**
 * Leads table for tracking potential referrers and their engagement
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  profession: varchar("profession", { length: 100 }), // gp, pharmacist, allied_health
  practiceName: varchar("practiceName", { length: 255 }),
  location: varchar("location", { length: 255 }),
  source: varchar("source", { length: 100 }), // website, qr_code, referral
  sourceId: varchar("sourceId", { length: 255 }), // QR code ID, referral ID
  engagementScore: int("engagementScore").default(0).notNull(),
  lastActivityAt: timestamp("lastActivityAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Campaigns table for email/SMS outreach campaigns
 */
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // email, sms
  targetAudience: varchar("targetAudience", { length: 100 }), // allied_health, pharmacist, gp
  subject: varchar("subject", { length: 255 }),
  content: text("content"),
  status: mysqlEnum("status", ["draft", "scheduled", "sent"]).default("draft").notNull(),
  sentAt: timestamp("sentAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

/**
 * QR Codes table for pharmacy tracking
 */
export const qrCodes = mysqlTable("qrCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 255 }).notNull().unique(),
  pharmacyName: varchar("pharmacyName", { length: 255 }).notNull(),
  pharmacyEmail: varchar("pharmacyEmail", { length: 320 }),
  pharmacyPhone: varchar("pharmacyPhone", { length: 50 }),
  pharmacyAddress: varchar("pharmacyAddress", { length: 500 }),
  scans: int("scans").default(0).notNull(),
  lastScannedAt: timestamp("lastScannedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QRCode = typeof qrCodes.$inferSelect;
export type InsertQRCode = typeof qrCodes.$inferInsert;

/**
 * Lead Activities table for tracking engagement actions
 */
export const leadActivities = mysqlTable("leadActivities", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  activityType: varchar("activityType", { length: 100 }).notNull(), // page_view, download, form_submit
  activityData: text("activityData"), // JSON data
  points: int("points").default(0).notNull(), // Engagement points
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = typeof leadActivities.$inferInsert;

/**
 * Appointments table for patient-clinician consultations
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  clinicianId: int("clinicianId").notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  duration: int("duration").default(30).notNull(), // Duration in minutes
  status: mysqlEnum("status", ["scheduled", "in_progress", "completed", "cancelled", "no_show"]).default("scheduled").notNull(),
  appointmentType: mysqlEnum("appointmentType", ["initial", "follow_up", "emergency"]).default("initial").notNull(),
  videoRoomUrl: varchar("videoRoomUrl", { length: 500 }),
  googleCalendarEventId: varchar("googleCalendarEventId", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Prescriptions table for medication management
 */
export const prescriptions = mysqlTable("prescriptions", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  clinicianId: int("clinicianId").notNull(),
  medicationName: varchar("medicationName", { length: 255 }).notNull(),
  genericName: varchar("genericName", { length: 255 }),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  frequency: varchar("frequency", { length: 100 }).notNull(),
  instructions: text("instructions"),
  quantity: int("quantity"),
  refills: int("refills").default(0).notNull(),
  prescribedAt: timestamp("prescribedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  status: mysqlEnum("status", ["active", "expired", "cancelled"]).default("active").notNull(),
  eToken: varchar("eToken", { length: 255 }), // For prescription verification
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Prescription = typeof prescriptions.$inferSelect;
export type InsertPrescription = typeof prescriptions.$inferInsert;

/**
 * Medical records table for clinical notes and documentation
 */
export const medicalRecords = mysqlTable("medicalRecords", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  clinicianId: int("clinicianId").notNull(),
  appointmentId: int("appointmentId"),
  recordType: mysqlEnum("recordType", ["consultation_note", "progress_note", "lab_result", "imaging", "other"]).default("consultation_note").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  attachments: text("attachments"), // JSON array of file URLs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = typeof medicalRecords.$inferInsert;

/**
 * Messages table for patient-clinician communication
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  fromUserId: int("fromUserId").notNull(),
  toUserId: int("toUserId").notNull(),
  subject: varchar("subject", { length: 255 }),
  content: text("content").notNull(),
  isRead: int("isRead").default(0).notNull(), // 0 or 1 for boolean
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;