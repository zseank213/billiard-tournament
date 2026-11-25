/**
 * Normalizes phone numbers according to Indonesian mobile standards:
 * - Replaces leading '+62' or '62' with '0'
 * - Removes hyphens, spaces, and non-digit characters
 * - Restricts to standard Indonesian mobile length (max 13 digits)
 */
export function cleanPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  let cleaned = phone.replace(/[\s\-\u2013\u2014]/g, "").trim();

  if (cleaned.startsWith("+62")) {
    cleaned = "0" + cleaned.slice(3);
  } else if (cleaned.startsWith("62") && cleaned.length >= 2) {
    cleaned = "0" + cleaned.slice(2);
  }

  // Keep only digits
  cleaned = cleaned.replace(/\D/g, "");

  // Indonesian mobile numbers are at most 13 digits (08XXXXXXXXXX)
  if (cleaned.length > 13) {
    cleaned = cleaned.slice(0, 13);
  }

  return cleaned;
}

/**
 * Validates whether a given phone string is a valid Indonesian WhatsApp mobile number:
 * - Must be formatted/cleaned
 * - Must start with '08'
 * - Must be between 10 and 13 digits long (08 + 8 to 11 digits)
 */
export function validateIndonesianPhone(phone?: string | null): {
  isValid: boolean;
  message?: string;
} {
  if (!phone || !phone.trim()) {
    return { isValid: true }; // empty handling is handled by required/optional checks
  }

  const cleaned = cleanPhoneNumber(phone);

  if (!cleaned.startsWith("08")) {
    return {
      isValid: false,
      message: "Nomor WhatsApp wajib diawali 08 atau +62 (contoh: 08123456789).",
    };
  }

  if (cleaned.length < 10) {
    return {
      isValid: false,
      message: "Nomor WhatsApp terlalu pendek (minimal 10 digit, contoh: 08123456789).",
    };
  }

  if (cleaned.length > 13) {
    return {
      isValid: false,
      message: "Nomor WhatsApp maksimal 13 digit angka.",
    };
  }

  // Indonesian provider prefixes start with 08 followed by 1-9 (e.g. 081, 082, 083, 085, 087, 088, 089)
  if (!/^08[1-9]\d{7,10}$/.test(cleaned)) {
    return {
      isValid: false,
      message: "Format nomor WhatsApp tidak valid. Pastikan nomor diawali 08 dan berjumlah 10-13 digit.",
    };
  }

  return { isValid: true };
}
