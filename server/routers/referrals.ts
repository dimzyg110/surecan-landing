import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { referrals } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const referralsRouter = router({
  /**
   * List all referrals submitted by the current prescriber
   */
  listByPrescriber: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Find referrals where referrerEmail matches user's email
    if (!user.email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User email is required to view referrals",
      });
    }

    const userReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerEmail, user.email))
      .orderBy(desc(referrals.createdAt));

    return userReferrals;
  }),

  /**
   * Get a single referral by ID
   */
  getById: protectedProcedure
    .input(z.object({ referralId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [referral] = await db
        .select()
        .from(referrals)
        .where(eq(referrals.referralId, input.referralId))
        .limit(1);

      if (!referral) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Referral not found",
        });
      }

      // Check if user has access to this referral
      if (referral.referrerEmail !== user.email && user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this referral",
        });
      }

      return referral;
    }),

  /**
   * Get referral statistics for the current prescriber
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx;
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    if (!user.email) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User email is required to view statistics",
      });
    }

    const userReferrals = await db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerEmail, user.email));

    const stats = {
      total: userReferrals.length,
      pending: userReferrals.filter(r => r.status === "pending").length,
      contacted: userReferrals.filter(r => r.status === "contacted").length,
      booked: userReferrals.filter(r => r.status === "booked").length,
      completed: userReferrals.filter(r => r.status === "completed").length,
      cancelled: userReferrals.filter(r => r.status === "cancelled").length,
    };

    return stats;
  }),
});
