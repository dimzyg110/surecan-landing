/**
 * Utility functions for generating unique identifiers
 * Following the audit recommendations for referral and patient tracking
 */

/**
 * Generate a unique referral ID in format: SURE-R-XXXXXX
 * where XXXXXX is a 6-digit random number
 */
export function generateReferralId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SURE-R-${randomNum}`;
}

/**
 * Generate a unique patient ID in format: SURE-P-XXXXXX
 * where XXXXXX is a 6-digit random number
 */
export function generatePatientId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `SURE-P-${randomNum}`;
}

/**
 * Generate a unique booking link for a referral
 * Format: /book?ref=REFERRAL_ID&token=RANDOM_TOKEN
 */
export function generateBookingLink(referralId: string, baseUrl: string = ""): string {
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return `${baseUrl}/book?ref=${referralId}&token=${token}`;
}

/**
 * Validate referral ID format
 */
export function isValidReferralId(id: string): boolean {
  return /^SURE-R-\d{6}$/.test(id);
}

/**
 * Validate patient ID format
 */
export function isValidPatientId(id: string): boolean {
  return /^SURE-P-\d{6}$/.test(id);
}
