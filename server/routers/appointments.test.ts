import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "../routers";
import { getDb } from "../db";
import { users, appointments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Appointments Router", () => {
  let patientUser: any;
  let clinicianUser: any;
  let testAppointmentId: number;

  beforeAll(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available for testing");

    // Create test patient user
    await db.insert(users).values({
      openId: `test-patient-${Date.now()}`,
      name: "Test Patient",
      email: "patient@test.com",
      role: "patient",
    });
    const patientRows = await db.select().from(users).where(eq(users.email, "patient@test.com"));
    patientUser = patientRows[0];

    // Create test clinician user
    await db.insert(users).values({
      openId: `test-clinician-${Date.now()}`,
      name: "Dr. Test Clinician",
      email: "clinician@test.com",
      role: "clinician",
      specialization: "General Practice",
      ahpraNumber: "MED1234567",
    });
    const clinicianRows = await db.select().from(users).where(eq(users.email, "clinician@test.com"));
    clinicianUser = clinicianRows[0];

    // Create a test appointment for testing
    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + 7);
    await db.insert(appointments).values({
      patientId: patientUser.id,
      clinicianId: clinicianUser.id,
      scheduledAt,
      duration: 30,
      status: "scheduled",
      appointmentType: "initial",
    });
    // Fetch the created appointment
    const createdAppointments = await db.select().from(appointments).where(eq(appointments.patientId, patientUser.id));
    testAppointmentId = createdAppointments[0].id;
  });

  afterAll(async () => {
    const db = await getDb();
    if (!db) return;

    // Clean up test data
    if (testAppointmentId) {
      await db.delete(appointments).where(eq(appointments.id, testAppointmentId));
    }
    if (patientUser) {
      await db.delete(users).where(eq(users.id, patientUser.id));
    }
    if (clinicianUser) {
      await db.delete(users).where(eq(users.id, clinicianUser.id));
    }
  });

  describe("getAvailableClinicians", () => {
    it("should return list of clinicians", async () => {
      const caller = appRouter.createCaller({
        user: patientUser,
        req: {} as any,
        res: {} as any,
      });

      const clinicians = await caller.appointments.getAvailableClinicians();
      
      expect(Array.isArray(clinicians)).toBe(true);
      expect(clinicians.length).toBeGreaterThan(0);
      
      const testClinician = clinicians.find((c) => c.id === clinicianUser.id);
      expect(testClinician).toBeDefined();
      expect(testClinician?.name).toBe("Dr. Test Clinician");
      expect(testClinician?.specialization).toBe("General Practice");
    });
  });

  describe("create appointment", () => {
    it("should allow patient to create appointment", async () => {
      const caller = appRouter.createCaller({
        user: patientUser,
        req: {} as any,
        res: {} as any,
      });

      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() + 7); // 7 days from now

      const result = await caller.appointments.create({
        clinicianId: clinicianUser.id,
        scheduledAt: scheduledAt.toISOString(),
        duration: 30,
        appointmentType: "initial",
        notes: "Test appointment",
      });

      expect(result.success).toBe(true);
      expect(result.appointmentId).toBeGreaterThan(0);
      
      testAppointmentId = result.appointmentId;
    });

    it("should prevent non-patient from creating appointment", async () => {
      const caller = appRouter.createCaller({
        user: clinicianUser,
        req: {} as any,
        res: {} as any,
      });

      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() + 7);

      await expect(
        caller.appointments.create({
          clinicianId: clinicianUser.id,
          scheduledAt: scheduledAt.toISOString(),
          duration: 30,
          appointmentType: "initial",
        })
      ).rejects.toThrow("Only patients can book appointments");
    });
  });

  describe("list appointments", () => {
    it("should return patient's appointments", async () => {
      const caller = appRouter.createCaller({
        user: patientUser,
        req: {} as any,
        res: {} as any,
      });

      const appointmentsList = await caller.appointments.list();
      
      expect(Array.isArray(appointmentsList)).toBe(true);
      expect(appointmentsList.length).toBeGreaterThan(0);
      
      const testAppointment = appointmentsList.find((a) => a.id === testAppointmentId);
      expect(testAppointment).toBeDefined();
      expect(testAppointment?.patientId).toBe(patientUser.id);
      expect(testAppointment?.clinicianId).toBe(clinicianUser.id);
    });

    it("should return clinician's appointments", async () => {
      const caller = appRouter.createCaller({
        user: clinicianUser,
        req: {} as any,
        res: {} as any,
      });

      const appointmentsList = await caller.appointments.list();
      
      expect(Array.isArray(appointmentsList)).toBe(true);
      
      const testAppointment = appointmentsList.find((a) => a.id === testAppointmentId);
      expect(testAppointment).toBeDefined();
      expect(testAppointment?.clinicianId).toBe(clinicianUser.id);
    });
  });

  describe("getById", () => {
    it("should return appointment details for authorized user", async () => {
      const caller = appRouter.createCaller({
        user: patientUser,
        req: {} as any,
        res: {} as any,
      });

      const appointment = await caller.appointments.getById({ id: testAppointmentId });
      
      expect(appointment).toBeDefined();
      expect(appointment.id).toBe(testAppointmentId);
      expect(appointment.patientId).toBe(patientUser.id);
      expect(appointment.status).toBe("scheduled");
    });

    it("should prevent unauthorized access to appointment", async () => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Create another patient
      await db.insert(users).values({
        openId: `test-other-patient-${Date.now()}`,
        name: "Other Patient",
        email: "other@test.com",
        role: "patient",
      });
      const otherPatientRows = await db.select().from(users).where(eq(users.email, "other@test.com"));
      const otherPatient = otherPatientRows[0];

      const caller = appRouter.createCaller({
        user: otherPatient,
        req: {} as any,
        res: {} as any,
      });

      await expect(
        caller.appointments.getById({ id: testAppointmentId })
      ).rejects.toThrow("You don't have access to this appointment");

      // Clean up
      await db.delete(users).where(eq(users.id, otherPatient.id));
    });
  });

  describe("cancel appointment", () => {
    it("should allow patient to cancel their appointment", async () => {
      const caller = appRouter.createCaller({
        user: patientUser,
        req: {} as any,
        res: {} as any,
      });

      const result = await caller.appointments.cancel({ id: testAppointmentId });
      
      expect(result.success).toBe(true);

      // Verify cancellation
      const appointment = await caller.appointments.getById({ id: testAppointmentId });
      expect(appointment.status).toBe("cancelled");
    });
  });
});
