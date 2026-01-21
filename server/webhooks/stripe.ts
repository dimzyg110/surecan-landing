import type { Request, Response } from "express";
import Stripe from "stripe";
import { env } from "../_core/env";
import { getDb } from "../db";
import { appointments } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(env.stripeSecretKey, {
  apiVersion: "2025-12-15.clover",
});

/**
 * Stripe Webhook Handler
 * 
 * Handles payment events from Stripe and updates appointment payment status
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const sig = req.headers["stripe-signature"];

  if (!sig) {
    console.error("[Stripe Webhook] Missing stripe-signature header");
    return res.status(400).send("Missing signature");
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      env.stripeWebhookSecret
    );
  } catch (err: any) {
    console.error(`[Stripe Webhook] Signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle test events
  if (event.id.startsWith("evt_test_")) {
    console.log("[Stripe Webhook] Test event detected, returning verification response");
    return res.json({
      verified: true,
    });
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  // Get database instance
  const db = await getDb();
  if (!db) {
    console.error("[Stripe Webhook] Database not available");
    return res.status(500).json({ error: "Database unavailable" });
  }

  try {
    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Extract appointment ID from metadata
        const appointmentId = session.metadata?.appointment_id;
        
        if (!appointmentId) {
          console.error("[Stripe Webhook] Missing appointment_id in session metadata");
          break;
        }

        // Update appointment payment status
        await db
          .update(appointments)
          .set({
            paymentStatus: "paid",
            stripePaymentIntentId: session.payment_intent as string,
            amountPaid: session.amount_total || 0,
          })
          .where(eq(appointments.id, parseInt(appointmentId)));

        console.log(`[Stripe Webhook] Payment completed for appointment ${appointmentId}`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
        // Find appointment by payment intent ID
        const [appointment] = await db
          .select()
          .from(appointments)
          .where(eq(appointments.stripePaymentIntentId, paymentIntent.id))
          .limit(1);

        if (appointment) {
          await db
            .update(appointments)
            .set({ paymentStatus: "failed" })
            .where(eq(appointments.id, appointment.id));

          console.log(`[Stripe Webhook] Payment failed for appointment ${appointment.id}`);
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        
        // Find appointment by payment intent ID
        const [appointment] = await db
          .select()
          .from(appointments)
          .where(eq(appointments.stripePaymentIntentId, charge.payment_intent as string))
          .limit(1);

        if (appointment) {
          await db
            .update(appointments)
            .set({ paymentStatus: "refunded" })
            .where(eq(appointments.id, appointment.id));

          console.log(`[Stripe Webhook] Payment refunded for appointment ${appointment.id}`);
        }
        break;
      }

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    // Return success response
    res.json({ received: true });
  } catch (error: any) {
    console.error(`[Stripe Webhook] Error processing event: ${error.message}`);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
