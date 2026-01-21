/**
 * Stripe Products Configuration
 * 
 * Define all products and prices for Surecan consultations
 */

export const PRODUCTS = {
  INITIAL_CONSULTATION: {
    name: "Initial Medicinal Cannabis Consultation",
    description: "Comprehensive 30-45 minute assessment with our Authorised Prescriber. Includes treatment plan and prescription if eligible.",
    priceInCents: 15000, // $150 AUD
    currency: "aud",
  },
  FOLLOW_UP_CONSULTATION: {
    name: "Follow-up Consultation",
    description: "15-20 minute follow-up appointment to review treatment progress and adjust dosage if needed.",
    priceInCents: 7500, // $75 AUD
    currency: "aud",
  },
  BULK_BILLED_CONSULTATION: {
    name: "Bulk Billed Consultation (Eligible Patients)",
    description: "Medicare bulk billed consultation for eligible patients under the New Bulk Billing Incentives Program.",
    priceInCents: 0, // Free for eligible patients
    currency: "aud",
  },
} as const;

export type ProductType = keyof typeof PRODUCTS;
