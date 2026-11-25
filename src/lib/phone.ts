/**
 * Normalizes phone numbers according to tournament requirements:
 * - Replaces leading '+62' or '62' with '0'
 * - Removes all hyphens/dashes ('-')
 * - Removes all spaces (' ')
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[\s\-\u2013\u2014]/g, "").trim();
  if (cleaned.startsWith("+62")) {
    cleaned = "0" + cleaned.slice(3);
  } else if (cleaned.startsWith("62") && cleaned.length >= 2) {
    cleaned = "0" + cleaned.slice(2);
  }
  return cleaned;
}

