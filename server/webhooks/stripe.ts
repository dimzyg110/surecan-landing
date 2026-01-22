import type { Request, Response } from "express";
import Stripe from "stripe";
import { env } from "../_core/env";
import { getDb } from "../db";
import { appointments, processedWebhooks, auditLogs } from "../../drizzle/schema";
import { logAudit, AuditActions } from "../_core/auditLog";
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

  // CRITICAL: Implement idempotency to prevent duplicate processing
  try {
    // Check if we've already processed this webhook
    const existing = await db
      .select()
      .from(processedWebhooks)
      .where(eq(processedWebhooks.eventId, event.id))
      .limit(1);

    if (existing.length > 0) {
      const status = existing[0].status;
      console.log(`[Stripe Webhook] Event ${event.id} already processed with status: ${status}`);
      
      if (status === "completed") {
        // Already successfully processed, return success
        return res.json({ received: true, skipped: true, reason: "already_processed" });
      } else if (status === "processing") {
        // Currently being processed by another request, return success to prevent retry
        return res.json({ received: true, skipped: true, reason: "currently_processing" });
      }
      // If status is "failed", allow retry by continuing
    }

    // Insert webhook record with "processing" status
    await db.insert(processedWebhooks).values({
      eventId: event.id,
      provider: "stripe",
      eventType: event.type,
      status: "processing",
      payload: event as any,
      receivedAt: new Date(),
    });
  } catch (error: any) {
    // Check if it's a duplicate key error (race condition)
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      console.log(`[Stripe Webhook] Duplicate webhook detected (race condition): ${event.id}`);
      return res.json({ received: true, skipped: true, reason: "duplicate_detected" });
    }
    throw error;
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

        // Update appointment payment
        const [appointment] = await db
          .select()
          .from(appointments)
          .where(eq(appointments.id, parseInt(appointmentId)))
          .limit(1);

        if (!appointment) {
          console.error(`[Stripe Webhook] Appointment not found: ${appointmentId}`);
          break;
        }

        await db
          .update(appointments)
          .set({ 
            paymentStatus: "paid",
            status: "scheduled", // Move from pending_payment to scheduled
            stripePaymentIntentId: session.payment_intent as string,
            amountPaid: session.amount_total,
          })
          .where(eq(appointments.id, appointment.id));

        // Log audit event
        await logAudit({
          userId: appointment.patientId,
          action: AuditActions.PAYMENT_SUCCEEDED,
          resourceType: "appointment",
          resourceId: appointment.id.toString(),
          metadata: {
            stripeSessionId: session.id,
            amount: session.amount_total,
            currency: session.currency,
          },
        });

        console.log(`[Stripe Webhook] Payment successful for appointment ${appointment.id}`);
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

    // Mark webhook as successfully processed
    await db
      .update(processedWebhooks)
      .set({ 
        status: "completed",
        processedAt: new Date(),
      })
      .where(eq(processedWebhooks.eventId, event.id));

    console.log(`[Stripe Webhook] Successfully processed event: ${event.id}`);
    
    // Return success response
    res.json({ received: true });
  } catch (error: any) {
    console.error(`[Stripe Webhook] Error processing event: ${error.message}`);
    
    // Mark webhook as failed
    try {
      await db
        .update(processedWebhooks)
        .set({ 
          status: "failed",
          errorMessage: error.message,
          processedAt: new Date(),
        })
        .where(eq(processedWebhooks.eventId, event.id));
    } catch (updateError) {
      console.error(`[Stripe Webhook] Failed to update webhook status: ${updateError}`);
    }
    
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
