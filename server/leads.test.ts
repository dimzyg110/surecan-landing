import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/types/manusTypes";

describe("Leads Router", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    // Create mock context for public procedures (no auth required)
    const mockContext: Context = {
      user: null,
      req: {} as any,
      res: {} as any,
    };

    caller = appRouter.createCaller(mockContext);
  });

  it("should create a new lead from engagement popup", async () => {
    const testEmail = `test-${Date.now()}@example.com`;
    
    const result = await caller.leads.create({
      name: "Test Pharmacist",
      email: testEmail,
      phone: "0412345678",
      practice: "Test Pharmacy",
      role: "Pharmacist",
      source: "engagement_popup",
    });

    expect(result.success).toBe(true);
    expect(result.leadId).toBeDefined();
    expect(result.message).toContain("created");
  });

  it("should update existing lead when submitting duplicate email", async () => {
    const testEmail = `test-duplicate-${Date.now()}@example.com`;
    
    // First submission
    const firstResult = await caller.leads.create({
      name: "First Name",
      email: testEmail,
      phone: "0411111111",
      practice: "First Practice",
      role: "Pharmacist",
      source: "engagement_popup",
    });

    expect(firstResult.success).toBe(true);
    const firstLeadId = firstResult.leadId;

    // Second submission with same email
    const secondResult = await caller.leads.create({
      name: "Updated Name",
      email: testEmail,
      phone: "0422222222",
      practice: "Updated Practice",
      role: "Allied Health",
      source: "engagement_popup",
    });

    expect(secondResult.success).toBe(true);
    expect(secondResult.leadId).toBe(firstLeadId); // Same lead ID
    expect(secondResult.message).toContain("updated");
  });

  it("should handle all role types", async () => {
    const roles: Array<"Pharmacist" | "Allied Health" | "GP"> = [
      "Pharmacist",
      "Allied Health",
      "GP",
    ];

    for (const role of roles) {
      const testEmail = `test-${role.toLowerCase().replace(" ", "-")}-${Date.now()}@example.com`;
      
      const result = await caller.leads.create({
        name: `Test ${role}`,
        email: testEmail,
        role,
        source: "engagement_popup",
      });

      expect(result.success).toBe(true);
      expect(result.leadId).toBeDefined();
    }
  });

  it("should require name and email", async () => {
    await expect(
      caller.leads.create({
        name: "",
        email: "test@example.com",
        role: "Pharmacist",
        source: "engagement_popup",
      })
    ).rejects.toThrow();

    await expect(
      caller.leads.create({
        name: "Test Name",
        email: "invalid-email",
        role: "Pharmacist",
        source: "engagement_popup",
      })
    ).rejects.toThrow();
  });
});
