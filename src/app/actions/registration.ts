"use server";

import { Registration, BidangFullRegistrationPayload } from "@/types/tournament";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cleanPhoneNumber } from "@/lib/phone";

export interface RegistrationResult {
  success: boolean;
  message: string;
  data?: Registration;
}

export interface CategoryLockStatus {
  isRegistered: boolean;
  player1?: string;
  phone1?: string;
  player2?: string;
  phone2?: string;
}

export interface BidangCategoryStatus {
  isRegistered: boolean;
  isFullyRegistered: boolean;
  gandaTim1: CategoryLockStatus;
  gandaTim2: CategoryLockStatus;
  singlePutra: {
    isRegistered: boolean;
    player?: string;
    phone?: string;
  };
  singlePutri: {
    isRegistered: boolean;
    player?: string;
    phone?: string;
  };
  registration?: Registration | null;
}

export async function checkBidangRegistration(bidangName: string): Promise<BidangCategoryStatus> {
  const emptyResult: BidangCategoryStatus = {
    isRegistered: false,
    isFullyRegistered: false,
    gandaTim1: { isRegistered: false },
    gandaTim2: { isRegistered: false },
    singlePutra: { isRegistered: false },
    singlePutri: { isRegistered: false },
    registration: null,
  };

  if (!bidangName || !bidangName.trim()) {
    return emptyResult;
  }

  const cleanName = bidangName.trim();

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .or(`bidang_name.eq."${cleanName}",club_name.eq."${cleanName}"`)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        let gandaTim1: CategoryLockStatus = { isRegistered: false };
        let gandaTim2: CategoryLockStatus = { isRegistered: false };
        let singlePutra = { isRegistered: false, player: "", phone: "" };
        let singlePutri = { isRegistered: false, player: "", phone: "" };

        for (const row of data) {
          // Ganda Tim 1
          if (
            !gandaTim1.isRegistered &&
            (row.ganda_tim1_player1 ||
              (row.category === "ganda-putra" && row.player1_name && (row.team_number === 1 || !row.team_number)))
          ) {
            gandaTim1 = {
              isRegistered: true,
              player1: row.ganda_tim1_player1 || row.player1_name || "",
              phone1: row.ganda_tim1_player1_phone || row.phone_number || "",
              player2: row.ganda_tim1_player2 || row.player2_name || "",
              phone2: row.ganda_tim1_player2_phone || "",
            };
          }

          // Ganda Tim 2
          if (
            !gandaTim2.isRegistered &&
            (row.ganda_tim2_player1 ||
              (row.category === "ganda-putra" && row.player1_name && row.team_number === 2))
          ) {
            gandaTim2 = {
              isRegistered: true,
              player1: row.ganda_tim2_player1 || row.player1_name || "",
              phone1: row.ganda_tim2_player1_phone || row.phone_number || "",
              player2: row.ganda_tim2_player2 || row.player2_name || "",
              phone2: row.ganda_tim2_player2_phone || "",
            };
          }

          // Single Putra
          if (
            !singlePutra.isRegistered &&
            (row.single_putra_player ||
              (row.category === "single-putra" && (row.player1_name || row.full_name)))
          ) {
            singlePutra = {
              isRegistered: true,
              player: row.single_putra_player || row.player1_name || row.full_name || "",
              phone: row.single_putra_phone || row.phone_number || "",
            };
          }

          // Single Putri
          if (
            !singlePutri.isRegistered &&
            (row.single_putri_player ||
              (row.category === "single-putri" && (row.player1_name || row.full_name)))
          ) {
            singlePutri = {
              isRegistered: true,
              player: row.single_putri_player || row.player1_name || row.full_name || "",
              phone: row.single_putri_phone || row.phone_number || "",
            };
          }
        }

        const isAnyRegistered =
          gandaTim1.isRegistered || singlePutra.isRegistered || singlePutri.isRegistered;
        const isFullyRegistered =
          gandaTim1.isRegistered && singlePutra.isRegistered && singlePutri.isRegistered;

        const mergedReg: Registration = {
          ...data[0],
          ganda_tim1_player1: gandaTim1.player1,
          ganda_tim1_player1_phone: gandaTim1.phone1,
          ganda_tim1_player2: gandaTim1.player2,
          ganda_tim1_player2_phone: gandaTim1.phone2,
          ganda_tim2_player1: gandaTim2.player1,
          ganda_tim2_player1_phone: gandaTim2.phone1,
          ganda_tim2_player2: gandaTim2.player2,
          ganda_tim2_player2_phone: gandaTim2.phone2,
          single_putra_player: singlePutra.player,
          single_putra_phone: singlePutra.phone,
          single_putri_player: singlePutri.player,
          single_putri_phone: singlePutri.phone,
        };

        return {
          isRegistered: isAnyRegistered,
          isFullyRegistered,
          gandaTim1,
          gandaTim2,
          singlePutra,
          singlePutri,
          registration: mergedReg,
        };
      }
    } catch (e) {
      console.warn("Failed checking registration in Supabase:", e);
    }
  }

  return emptyResult;
}

export async function submitBidangFullRegistration(
  payload: BidangFullRegistrationPayload
): Promise<RegistrationResult> {
  try {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    const registrationCode = `BTI-${randomHex}`;

    const athleteDisplay = [
      payload.gandaTim1Player1 && payload.gandaTim1Player2
        ? `Ganda 1: ${payload.gandaTim1Player1} & ${payload.gandaTim1Player2}`
        : "",
      payload.hasGandaTim2 && payload.gandaTim2Player1 && payload.gandaTim2Player2
        ? `Ganda 2: ${payload.gandaTim2Player1} & ${payload.gandaTim2Player2}`
        : "",
      payload.singlePutraPlayer ? `Single Putra: ${payload.singlePutraPlayer}` : "",
      payload.singlePutriPlayer ? `Single Putri: ${payload.singlePutriPlayer}` : "",
    ]
      .filter(Boolean)
      .join(" | ") || `Delegasi ${payload.bidangName}`;

    const g1p1Phone = cleanPhoneNumber(payload.gandaTim1Player1Phone);
    const g1p2Phone = cleanPhoneNumber(payload.gandaTim1Player2Phone);
    const g2p1Phone = cleanPhoneNumber(payload.gandaTim2Player1Phone);
    const g2p2Phone = cleanPhoneNumber(payload.gandaTim2Player2Phone);
    const spPhone = cleanPhoneNumber(payload.singlePutraPhone);
    const spiPhone = cleanPhoneNumber(payload.singlePutriPhone);

    const primaryPhone =
      spPhone ||
      spiPhone ||
      g1p1Phone ||
      g2p1Phone ||
      "-";

    const newRecord: Registration = {
      registration_code: registrationCode,
      full_name: athleteDisplay,
      phone_number: primaryPhone,
      email: "",
      city: "Bandung",
      club_name: payload.bidangName,
      bidang_name: payload.bidangName,
      category: "delegasi-lengkap",
      handicap: "HC 4",
      payment_method: "GRATIS (Sesuai Undangan Resmi)",
      payment_proof_note: payload.notes || "Delegasi Lengkap Bidang",
      payment_status: "confirmed",
      created_at: new Date().toISOString(),
      ganda_tim1_player1: payload.gandaTim1Player1,
      ganda_tim1_player1_phone: g1p1Phone,
      ganda_tim1_player2: payload.gandaTim1Player2,
      ganda_tim1_player2_phone: g1p2Phone,
      ganda_tim2_player1: payload.hasGandaTim2 ? payload.gandaTim2Player1 : undefined,
      ganda_tim2_player1_phone: payload.hasGandaTim2 ? g2p1Phone : undefined,
      ganda_tim2_player2: payload.hasGandaTim2 ? payload.gandaTim2Player2 : undefined,
      ganda_tim2_player2_phone: payload.hasGandaTim2 ? g2p2Phone : undefined,
      single_putra_player: payload.singlePutraPlayer,
      single_putra_phone: spPhone,
      single_putri_player: payload.singlePutriPlayer,
      single_putri_phone: spiPhone,
    };

    if (isSupabaseConfigured() && supabase) {
      const cleanName = payload.bidangName.trim();

      // Check if an existing row exists for this bidang
      const { data: existingRows } = await supabase
        .from("registrations")
        .select("*")
        .or(`bidang_name.eq."${cleanName}",club_name.eq."${cleanName}"`)
        .order("created_at", { ascending: false })
        .limit(1);

      const existing = existingRows && existingRows.length > 0 ? existingRows[0] : null;

      if (existing) {
        // Merge newly submitted fields with existing fields
        const updatedGanda1P1 = payload.gandaTim1Player1 || existing.ganda_tim1_player1;
        const updatedGanda1P1Phone = g1p1Phone || cleanPhoneNumber(existing.ganda_tim1_player1_phone);
        const updatedGanda1P2 = payload.gandaTim1Player2 || existing.ganda_tim1_player2;
        const updatedGanda1P2Phone = g1p2Phone || cleanPhoneNumber(existing.ganda_tim1_player2_phone);

        const updatedGanda2P1 =
          payload.hasGandaTim2 && payload.gandaTim2Player1 ? payload.gandaTim2Player1 : existing.ganda_tim2_player1;
        const updatedGanda2P1Phone =
          payload.hasGandaTim2 && g2p1Phone ? g2p1Phone : cleanPhoneNumber(existing.ganda_tim2_player1_phone);
        const updatedGanda2P2 =
          payload.hasGandaTim2 && payload.gandaTim2Player2 ? payload.gandaTim2Player2 : existing.ganda_tim2_player2;
        const updatedGanda2P2Phone =
          payload.hasGandaTim2 && g2p2Phone ? g2p2Phone : cleanPhoneNumber(existing.ganda_tim2_player2_phone);

        const updatedSinglePutra = payload.singlePutraPlayer || existing.single_putra_player;
        const updatedSinglePutraPhone = spPhone || cleanPhoneNumber(existing.single_putra_phone);

        const updatedSinglePutri = payload.singlePutriPlayer || existing.single_putri_player;
        const updatedSinglePutriPhone = spiPhone || cleanPhoneNumber(existing.single_putri_phone);

        const mergedAthleteDisplay = [
          updatedGanda1P1 && updatedGanda1P2 ? `Ganda 1: ${updatedGanda1P1} & ${updatedGanda1P2}` : "",
          updatedGanda2P1 && updatedGanda2P2 ? `Ganda 2: ${updatedGanda2P1} & ${updatedGanda2P2}` : "",
          updatedSinglePutra ? `Single Putra: ${updatedSinglePutra}` : "",
          updatedSinglePutri ? `Single Putri: ${updatedSinglePutri}` : "",
        ]
          .filter(Boolean)
          .join(" | ") || `Delegasi ${payload.bidangName}`;

        const mergedPhone =
          spPhone ||
          spiPhone ||
          g1p1Phone ||
          cleanPhoneNumber(existing.phone_number) ||
          "-";

        const updateFields: Record<string, any> = {
          full_name: mergedAthleteDisplay,
          phone_number: mergedPhone,
          ganda_tim1_player1: updatedGanda1P1 || null,
          ganda_tim1_player1_phone: updatedGanda1P1Phone || null,
          ganda_tim1_player2: updatedGanda1P2 || null,
          ganda_tim1_player2_phone: updatedGanda1P2Phone || null,
          ganda_tim2_player1: updatedGanda2P1 || null,
          ganda_tim2_player1_phone: updatedGanda2P1Phone || null,
          ganda_tim2_player2: updatedGanda2P2 || null,
          ganda_tim2_player2_phone: updatedGanda2P2Phone || null,
          single_putra_player: updatedSinglePutra || null,
          single_putra_phone: updatedSinglePutraPhone || null,
          single_putri_player: updatedSinglePutri || null,
          single_putri_phone: updatedSinglePutriPhone || null,
          notes: payload.notes
            ? existing.notes
              ? `${existing.notes} | ${payload.notes}`
              : payload.notes
            : existing.notes || "",
        };

        const { data: updatedData, error: updateError } = await supabase
          .from("registrations")
          .update(updateFields)
          .eq("id", existing.id)
          .select()
          .single();

        if (!updateError && updatedData) {
          return {
            success: true,
            message: "Pendaftaran kategori delegasi bidang berhasil disimpan!",
            data: updatedData as Registration,
          };
        }
      }

      // If no existing row found, insert fresh row
      const { data, error } = await supabase
        .from("registrations")
        .insert([
          {
            registration_code: newRecord.registration_code,
            full_name: newRecord.full_name,
            phone_number: primaryPhone,
            email: "",
            city: newRecord.city,
            club_name: newRecord.club_name,
            bidang_name: newRecord.bidang_name,
            category: "delegasi-lengkap",
            handicap: "HC 4",
            payment_method: "GRATIS",
            payment_status: "confirmed",
            ganda_tim1_player1: payload.gandaTim1Player1,
            ganda_tim1_player1_phone: g1p1Phone,
            ganda_tim1_player2: payload.gandaTim1Player2,
            ganda_tim1_player2_phone: g1p2Phone,
            ganda_tim2_player1: payload.hasGandaTim2 ? payload.gandaTim2Player1 : null,
            ganda_tim2_player1_phone: payload.hasGandaTim2 ? g2p1Phone : null,
            ganda_tim2_player2: payload.hasGandaTim2 ? payload.gandaTim2Player2 : null,
            ganda_tim2_player2_phone: payload.hasGandaTim2 ? g2p2Phone : null,
            single_putra_player: payload.singlePutraPlayer,
            single_putra_phone: spPhone,
            single_putri_player: payload.singlePutriPlayer,
            single_putri_phone: spiPhone,
            notes: payload.notes || "",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error (falling back):", error);
        const fallbackInsert = await supabase
          .from("registrations")
          .insert([
            {
              registration_code: newRecord.registration_code,
              full_name: newRecord.full_name,
              phone_number: newRecord.phone_number,
              email: newRecord.email,
              club_name: newRecord.club_name,
              bidang_name: newRecord.bidang_name,
              category: "delegasi-lengkap",
              payment_status: "confirmed",
            },
          ])
          .select()
          .single();

        if (fallbackInsert.error) {
          return {
            success: false,
            message: `Gagal menyimpan formulir pendaftaran: ${error.message}`,
          };
        }
      }

      return {
        success: true,
        message: "Pendaftaran delegasi bidang berhasil disimpan!",
        data: (data || newRecord) as Registration,
      };
    }

    return {
      success: true,
      message: "Pendaftaran delegasi bidang berhasil disimulasikan!",
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

export async function submitRegistration(payload: {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  clubName: string;
  category: "ganda-putra" | "single-putra" | "single-putri" | string;
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
            player1_name: payload.fullName.trim(),
            phone_number: newRecord.phone_number,
            email: newRecord.email,
            city: newRecord.city,
            club_name: newRecord.club_name,
            bidang_name: newRecord.club_name,
            category: newRecord.category,
            handicap: newRecord.handicap,
            payment_method: newRecord.payment_method,
            payment_proof_note: newRecord.payment_proof_note,
            payment_status: "confirmed",
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return {
          success: false,
          message: `Gagal menyimpan pendaftaran: ${error.message}`,
        };
      }

      return {
        success: true,
        message: "Pendaftaran berhasil tersimpan!",
        data: data as Registration,
      };
    }

    // Demo / fallback mode when Supabase is not yet configured
    return {
      success: true,
      message: "Pendaftaran berhasil disimpan!",
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
          category: "ganda-putra",
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

