import { describe, it, expect, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";
import Stripe from "stripe";

// Mock Stripe
vi.mock("stripe", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      checkout: {
        sessions: {
          create: vi.fn().mockResolvedValue({
            id: "cs_test_123",
            url: "https://checkout.stripe.com/test",
          }),
        },
      },
    })),
  };
});

describe("Stripe Payment Integration", () => {
  let mockContext: Context;

  beforeEach(() => {
    // Mock authenticated patient user context
    mockContext = {
      user: {
        id: 1,
        openId: "test-open-id",
        name: "Test Patient",
        email: "patient@test.com",
        role: "patient",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
        phone: null,
        dateOfBirth: null,
        medicalHistory: null,
        ahpraNumber: null,
        specialization: null,
        loginMethod: null,
      },
      req: {
        headers: {
          origin: "http://localhost:3000",
        },
      } as any,
      res: {} as any,
    };
  });

  it("should create a checkout session for initial consultation", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.stripe.createCheckoutSession({
      appointmentId: 1,
      productType: "INITIAL_CONSULTATION",
    });

    expect(result).toHaveProperty("checkoutUrl");
    expect(result).toHaveProperty("sessionId");
    expect(result.checkoutUrl).toBe("https://checkout.stripe.com/test");
    expect(result.sessionId).toBe("cs_test_123");
  });

  it("should create a checkout session for follow-up consultation", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.stripe.createCheckoutSession({
      appointmentId: 2,
      productType: "FOLLOW_UP_CONSULTATION",
    });

    expect(result).toHaveProperty("checkoutUrl");
    expect(result).toHaveProperty("sessionId");
  });

  it("should handle bulk billed consultation (free)", async () => {
    const caller = appRouter.createCaller(mockContext);

    const result = await caller.stripe.createCheckoutSession({
      appointmentId: 3,
      productType: "BULK_BILLED_CONSULTATION",
    });

    expect(result).toHaveProperty("checkoutUrl");
    expect(result).toHaveProperty("sessionId");
  });

  it("should require authentication to create checkout session", async () => {
    const unauthenticatedContext = {
      ...mockContext,
      user: null,
    };

    const caller = appRouter.createCaller(unauthenticatedContext);

    await expect(
      caller.stripe.createCheckoutSession({
        appointmentId: 1,
        productType: "INITIAL_CONSULTATION",
      })
    ).rejects.toThrow();
  });
});
