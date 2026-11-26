"use server";

import { Registration, BidangFullRegistrationPayload } from "@/types/tournament";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { cleanPhoneNumber, validateIndonesianPhone } from "@/lib/phone";

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
  isHost?: boolean;
  gandaTim1: CategoryLockStatus;
  gandaTim2: CategoryLockStatus;
  extraGandaTeams?: (CategoryLockStatus & { teamNumber: number })[];
  singlePutra: {
    isRegistered: boolean;
    player?: string;
    phone?: string;
  };
  extraSinglePutra?: {
    isRegistered: boolean;
    player?: string;
    phone?: string;
    playerNumber: number;
  }[];
  singlePutri: {
    isRegistered: boolean;
    player?: string;
    phone?: string;
  };
  extraSinglePutri?: {
    isRegistered: boolean;
    player?: string;
    phone?: string;
    playerNumber: number;
  }[];
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

        const isHost = cleanName === "Teknologi Informasi";
        let extraGandaTeams: (CategoryLockStatus & { teamNumber: number })[] = [];
        let extraSinglePutra: { isRegistered: boolean; player?: string; phone?: string; playerNumber: number }[] = [];
        let extraSinglePutri: { isRegistered: boolean; player?: string; phone?: string; playerNumber: number }[] = [];

        for (const row of data) {
          // Check notes for extra teams/players (Host privilege)
          if (row.notes) {
            try {
              if (row.notes.includes("extraGandaTeams") || row.notes.startsWith("{")) {
                const parsed = JSON.parse(row.notes);
                if (Array.isArray(parsed.extraGandaTeams)) {
                  parsed.extraGandaTeams.forEach((eg: any) => {
                    if (eg.player1 && eg.player2 && !extraGandaTeams.some((x) => x.teamNumber === eg.teamNumber)) {
                      extraGandaTeams.push({
                        isRegistered: true,
                        player1: eg.player1,
                        phone1: eg.phone1,
                        player2: eg.player2,
                        phone2: eg.phone2,
                        teamNumber: eg.teamNumber || extraGandaTeams.length + 3,
                      });
                    }
                  });
                }
                if (Array.isArray(parsed.extraSinglePutra)) {
                  parsed.extraSinglePutra.forEach((esp: any) => {
                    if (esp.player && !extraSinglePutra.some((x) => x.playerNumber === esp.playerNumber)) {
                      extraSinglePutra.push({
                        isRegistered: true,
                        player: esp.player,
                        phone: esp.phone,
                        playerNumber: esp.playerNumber || extraSinglePutra.length + 2,
                      });
                    }
                  });
                }
                if (Array.isArray(parsed.extraSinglePutri)) {
                  parsed.extraSinglePutri.forEach((espi: any) => {
                    if (espi.player && !extraSinglePutri.some((x) => x.playerNumber === espi.playerNumber)) {
                      extraSinglePutri.push({
                        isRegistered: true,
                        player: espi.player,
                        phone: espi.phone,
                        playerNumber: espi.playerNumber || extraSinglePutri.length + 2,
                      });
                    }
                  });
                }
              }
            } catch {
              // Not JSON notes
            }
          }

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
          gandaTim1.isRegistered || singlePutra.isRegistered || singlePutri.isRegistered || extraGandaTeams.length > 0;
        // Host (Teknologi Informasi) NEVER completely locks, can always add more
        const isFullyRegistered = isHost
          ? false
          : gandaTim1.isRegistered && singlePutra.isRegistered && singlePutri.isRegistered;

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
          isHost,
          gandaTim1,
          gandaTim2,
          extraGandaTeams,
          singlePutra,
          extraSinglePutra,
          singlePutri,
          extraSinglePutri,
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

    // Validate phone number format (must start with 08, 10-13 digits)
    if (payload.gandaTim1Player1 && g1p1Phone) {
      const v = validateIndonesianPhone(g1p1Phone);
      if (!v.isValid) return { success: false, message: `Pemain 1 Ganda Tim 1: ${v.message}` };
    }
    if (payload.gandaTim1Player2 && g1p2Phone) {
      const v = validateIndonesianPhone(g1p2Phone);
      if (!v.isValid) return { success: false, message: `Pemain 2 Ganda Tim 1: ${v.message}` };
    }
    if (payload.hasGandaTim2 && payload.gandaTim2Player1 && g2p1Phone) {
      const v = validateIndonesianPhone(g2p1Phone);
      if (!v.isValid) return { success: false, message: `Pemain 1 Ganda Tim 2: ${v.message}` };
    }
    if (payload.hasGandaTim2 && payload.gandaTim2Player2 && g2p2Phone) {
      const v = validateIndonesianPhone(g2p2Phone);
      if (!v.isValid) return { success: false, message: `Pemain 2 Ganda Tim 2: ${v.message}` };
    }
    if (payload.singlePutraPlayer && spPhone) {
      const v = validateIndonesianPhone(spPhone);
      if (!v.isValid) return { success: false, message: `Single Putra: ${v.message}` };
    }
    if (payload.singlePutriPlayer && spiPhone) {
      const v = validateIndonesianPhone(spiPhone);
      if (!v.isValid) return { success: false, message: `Single Putri: ${v.message}` };
    }

    // Validate extra teams/players (Host Privilege)
    if (payload.extraGandaTeams && payload.extraGandaTeams.length > 0) {
      for (const t of payload.extraGandaTeams) {
        if (t.player1 && t.phone1) {
          const v = validateIndonesianPhone(cleanPhoneNumber(t.phone1));
          if (!v.isValid) return { success: false, message: `Pemain 1 Ganda Tim ${t.teamNumber}: ${v.message}` };
        }
        if (t.player2 && t.phone2) {
          const v = validateIndonesianPhone(cleanPhoneNumber(t.phone2));
          if (!v.isValid) return { success: false, message: `Pemain 2 Ganda Tim ${t.teamNumber}: ${v.message}` };
        }
      }
    }
    if (payload.extraSinglePutra && payload.extraSinglePutra.length > 0) {
      for (const sp of payload.extraSinglePutra) {
        if (sp.player && sp.phone) {
          const v = validateIndonesianPhone(cleanPhoneNumber(sp.phone));
          if (!v.isValid) return { success: false, message: `Single Putra ${sp.playerNumber}: ${v.message}` };
        }
      }
    }
    if (payload.extraSinglePutri && payload.extraSinglePutri.length > 0) {
      for (const spi of payload.extraSinglePutri) {
        if (spi.player && spi.phone) {
          const v = validateIndonesianPhone(cleanPhoneNumber(spi.phone));
          if (!v.isValid) return { success: false, message: `Single Putri ${spi.playerNumber}: ${v.message}` };
        }
      }
    }

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

        let mergedExtraGanda: any[] = [];
        let mergedExtraSinglePa: any[] = [];
        let mergedExtraSinglePi: any[] = [];

        if (existing.notes) {
          try {
            if (existing.notes.includes("extraGandaTeams") || existing.notes.startsWith("{")) {
              const oldParsed = JSON.parse(existing.notes);
              if (Array.isArray(oldParsed.extraGandaTeams)) {
                mergedExtraGanda = [...oldParsed.extraGandaTeams];
              }
              if (Array.isArray(oldParsed.extraSinglePutra)) {
                mergedExtraSinglePa = [...oldParsed.extraSinglePutra];
              }
              if (Array.isArray(oldParsed.extraSinglePutri)) {
                mergedExtraSinglePi = [...oldParsed.extraSinglePutri];
              }
            }
          } catch {
            // ignore non-json notes
          }
        }

        if (payload.extraGandaTeams && payload.extraGandaTeams.length > 0) {
          payload.extraGandaTeams.forEach((newTeam) => {
            const idx = mergedExtraGanda.findIndex((x) => x.teamNumber === newTeam.teamNumber);
            if (idx >= 0) {
              mergedExtraGanda[idx] = newTeam;
            } else {
              mergedExtraGanda.push(newTeam);
            }
          });
        }

        if (payload.extraSinglePutra && payload.extraSinglePutra.length > 0) {
          payload.extraSinglePutra.forEach((newSp) => {
            const idx = mergedExtraSinglePa.findIndex((x) => x.playerNumber === newSp.playerNumber);
            if (idx >= 0) {
              mergedExtraSinglePa[idx] = newSp;
            } else {
              mergedExtraSinglePa.push(newSp);
            }
          });
        }

        if (payload.extraSinglePutri && payload.extraSinglePutri.length > 0) {
          payload.extraSinglePutri.forEach((newSpi) => {
            const idx = mergedExtraSinglePi.findIndex((x) => x.playerNumber === newSpi.playerNumber);
            if (idx >= 0) {
              mergedExtraSinglePi[idx] = newSpi;
            } else {
              mergedExtraSinglePi.push(newSpi);
            }
          });
        }

        const notesPayload = JSON.stringify({
          extraGandaTeams: mergedExtraGanda,
          extraSinglePutra: mergedExtraSinglePa,
          extraSinglePutri: mergedExtraSinglePi,
          userNote: payload.notes || "",
        });

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
          notes: notesPayload,
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
            notes: JSON.stringify({
              extraGandaTeams: payload.extraGandaTeams || [],
              extraSinglePutra: payload.extraSinglePutra || [],
              extraSinglePutri: payload.extraSinglePutri || [],
              userNote: payload.notes || "",
            }),
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

