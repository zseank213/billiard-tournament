"use server";

import { Registration } from "@/types/tournament";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface RegistrationResult {
  success: boolean;
  message: string;
  data?: Registration;
}

export async function submitRegistration(payload: {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  clubName: string;
  category: "9-ball-open" | "10-ball-handicap" | "junior-under21";
  handicap: string;
  paymentMethod: string;
  paymentProofNote?: string;
}): Promise<RegistrationResult> {
  try {
    // Generate unique registration code e.g. "POOL-8924"
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const registrationCode = `CUE-${randomHex}`;

    const newRecord: Registration = {
      registration_code: registrationCode,
      full_name: payload.fullName.trim(),
      phone_number: payload.phoneNumber.trim(),
      email: payload.email?.trim() || "",
      city: payload.city?.trim() || "Unknown",
      club_name: payload.clubName?.trim() || "Independent",
      category: payload.category,
      handicap: payload.handicap,
      payment_method: payload.paymentMethod,
      payment_proof_note: payload.paymentProofNote || "",
      payment_status: "pending",
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      const { data, error } = await supabase
        .from("registrations")
        .insert([
          {
            registration_code: newRecord.registration_code,
            full_name: newRecord.full_name,
            phone_number: newRecord.phone_number,
            email: newRecord.email,
            city: newRecord.city,
            club_name: newRecord.club_name,
            category: newRecord.category,
            handicap: newRecord.handicap,
            payment_method: newRecord.payment_method,
            payment_proof_note: newRecord.payment_proof_note,
            payment_status: "pending",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return {
          success: false,
          message: `Gagal menyimpan ke Supabase: ${error.message}`,
        };
      }

      return {
        success: true,
        message: "Pendaftaran berhasil tersimpan ke database Supabase!",
        data: data as Registration,
      };
    }

    // Demo / fallback mode when Supabase is not yet configured
    return {
      success: true,
      message:
        "Pendaftaran berhasil disimulasikan! (Sambungkan Supabase untuk menyimpan permanen ke database)",
      data: newRecord,
    };
  } catch (err: unknown) {
    const error = err as Error;
    return {
      success: false,
      message: error?.message || "Terjadi kesalahan pada sistem pendaftaran.",
    };
  }
}

export async function checkRegistration(
  searchQuery: string
): Promise<{ success: boolean; data?: Registration[]; message: string }> {
  const query = searchQuery.trim();
  if (!query) {
    return { success: false, message: "Masukkan nomor WhatsApp atau Kode Pendaftaran." };
  }

  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .or(`registration_code.ilike.%${query}%,phone_number.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      return { success: false, message: `Error database: ${error.message}` };
    }

    if (!data || data.length === 0) {
      return {
        success: false,
        message: "Data pendaftaran tidak ditemukan. Pastikan kode atau nomor WA sesuai.",
      };
    }

    return { success: true, data: data as Registration[], message: "Data ditemukan." };
  }

  // Demo fallback
  if (query.toUpperCase().includes("CUE-") || query.length >= 4) {
    return {
      success: true,
      message: "Data demo ditemukan.",
      data: [
        {
          registration_code: query.toUpperCase().startsWith("CUE-") ? query.toUpperCase() : "CUE-8924",
          full_name: "Bambang Pamungkas",
          phone_number: query.match(/^\d+$/) ? query : "081298765432",
          email: "bambang@poolmasters.id",
          city: "Jakarta Selatan",
          club_name: "Red Ball Club",
          category: "9-ball-open",
          handicap: "HC 5",
          payment_method: "BCA Transfer",
          payment_status: "verified",
          created_at: new Date().toISOString(),
        },
      ],
    };
  }

  return {
    success: false,
    message: "Data pendaftaran tidak ditemukan. (Mode Demo: coba cari 'CUE-1234' atau '08123456789')",
  };
}
