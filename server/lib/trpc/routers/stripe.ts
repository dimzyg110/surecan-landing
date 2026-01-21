import { z } from "zod";
import { protectedProcedure, router } from "../../../_core/trpc";
import Stripe from "stripe";
import { env } from "../../../_core/env";
import { PRODUCTS, type ProductType } from "../../../products";

const stripe = new Stripe(env.stripeSecretKey, {
  apiVersion: "2025-12-15.clover",
});

export const stripeRouter = router({
  /**
   * Create a Stripe Checkout Session for appointment payment
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        appointmentId: z.number(),
        productType: z.enum(["INITIAL_CONSULTATION", "FOLLOW_UP_CONSULTATION", "BULK_BILLED_CONSULTATION"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = PRODUCTS[input.productType as ProductType];
      
      // Get the origin from request headers for redirect URLs
      const origin = ctx.req.headers.origin || "http://localhost:3000";

      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: product.currency,
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.priceInCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/patient/appointments?payment=success&appointment_id=${input.appointmentId}`,
        cancel_url: `${origin}/patient/appointments?payment=cancelled`,
        customer_email: ctx.user.email || undefined,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          appointment_id: input.appointmentId.toString(),
          customer_email: ctx.user.email || "",
          customer_name: ctx.user.name || "",
          product_type: input.productType,
        },
        allow_promotion_codes: true,
      });

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    }),

  /**
   * Get payment status for an appointment
   */
  getPaymentStatus: protectedProcedure
    .input(z.object({ appointmentId: z.number() }))
    .query(async ({ ctx, input }) => {
      // This would query the database for the appointment's payment status
      // For now, return a placeholder
      return {
        status: "pending",
        amountPaid: 0,
      };
    }),
});
