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
      const isHost = cleanName === "Teknologi Informasi";

      // 1. Fetch fresh existing registration rows for this bidang to avoid race conditions
      const { data: existingRows } = await supabase
        .from("registrations")
        .select("*")
        .or(`bidang_name.eq."${cleanName}",club_name.eq."${cleanName}"`)
        .order("created_at", { ascending: true });

      interface RegisteredGandaTeam {
        teamNumber: number;
        player1: string;
        phone1?: string;
        player2: string;
        phone2?: string;
      }
      interface RegisteredSinglePlayer {
        playerNumber: number;
        player: string;
        phone?: string;
      }

      const existingGandaTeams: RegisteredGandaTeam[] = [];
      let existingSinglePa: RegisteredSinglePlayer | null = null;
      const existingExtraSinglePa: RegisteredSinglePlayer[] = [];
      let existingSinglePi: RegisteredSinglePlayer | null = null;
      const existingExtraSinglePi: RegisteredSinglePlayer[] = [];
      let existingNotesText = "";

      const primaryRow = existingRows && existingRows.length > 0 ? existingRows[0] : null;

      if (existingRows && existingRows.length > 0) {
        for (const row of existingRows) {
          // Ganda Tim 1
          if (row.ganda_tim1_player1 && row.ganda_tim1_player2) {
            if (!existingGandaTeams.some((t) => t.teamNumber === 1)) {
              existingGandaTeams.push({
                teamNumber: 1,
                player1: row.ganda_tim1_player1,
                phone1: cleanPhoneNumber(row.ganda_tim1_player1_phone),
                player2: row.ganda_tim1_player2,
                phone2: cleanPhoneNumber(row.ganda_tim1_player2_phone),
              });
            }
          }
          // Ganda Tim 2
          if (row.ganda_tim2_player1 && row.ganda_tim2_player2) {
            if (!existingGandaTeams.some((t) => t.teamNumber === 2)) {
              existingGandaTeams.push({
                teamNumber: 2,
                player1: row.ganda_tim2_player1,
                phone1: cleanPhoneNumber(row.ganda_tim2_player1_phone),
                player2: row.ganda_tim2_player2,
                phone2: cleanPhoneNumber(row.ganda_tim2_player2_phone),
              });
            }
          }
          // Single Putra 1
          if (row.single_putra_player && !existingSinglePa) {
            existingSinglePa = {
              playerNumber: 1,
              player: row.single_putra_player,
              phone: cleanPhoneNumber(row.single_putra_phone),
            };
          }
          // Single Putri 1
          if (row.single_putri_player && !existingSinglePi) {
            existingSinglePi = {
              playerNumber: 1,
              player: row.single_putri_player,
              phone: cleanPhoneNumber(row.single_putri_phone),
            };
          }

          // Notes extra teams
          if (row.notes) {
            try {
              if (row.notes.includes("extraGandaTeams") || row.notes.startsWith("{")) {
                const parsed = JSON.parse(row.notes);
                if (Array.isArray(parsed.extraGandaTeams)) {
                  parsed.extraGandaTeams.forEach((eg: any) => {
                    if (
                      eg.player1 &&
                      eg.player2 &&
                      !existingGandaTeams.some((t) => t.teamNumber === eg.teamNumber)
                    ) {
                      existingGandaTeams.push({
                        teamNumber: eg.teamNumber || existingGandaTeams.length + 3,
                        player1: eg.player1,
                        phone1: cleanPhoneNumber(eg.phone1),
                        player2: eg.player2,
                        phone2: cleanPhoneNumber(eg.phone2),
                      });
                    }
                  });
                }
                if (Array.isArray(parsed.extraSinglePutra)) {
                  parsed.extraSinglePutra.forEach((esp: any) => {
                    if (
                      esp.player &&
                      !existingExtraSinglePa.some((x) => x.playerNumber === esp.playerNumber)
                    ) {
                      existingExtraSinglePa.push({
                        playerNumber: esp.playerNumber,
                        player: esp.player,
                        phone: cleanPhoneNumber(esp.phone),
                      });
                    }
                  });
                }
                if (Array.isArray(parsed.extraSinglePutri)) {
                  parsed.extraSinglePutri.forEach((espi: any) => {
                    if (
                      espi.player &&
                      !existingExtraSinglePi.some((x) => x.playerNumber === espi.playerNumber)
                    ) {
                      existingExtraSinglePi.push({
                        playerNumber: espi.playerNumber,
                        player: espi.player,
                        phone: cleanPhoneNumber(espi.phone),
                      });
                    }
                  });
                }
                if (parsed.userNote) {
                  existingNotesText = parsed.userNote;
                }
              }
            } catch {
              // ignore non-json notes
            }
          }
        }
      }

      // 2. Incoming Ganda Teams from user submission
      interface IncomingGanda {
        preferredTeamNumber: number;
        player1: string;
        phone1: string;
        player2: string;
        phone2: string;
      }
      const incomingGandaTeams: IncomingGanda[] = [];

      if (payload.gandaTim1Player1?.trim() && payload.gandaTim1Player2?.trim()) {
        incomingGandaTeams.push({
          preferredTeamNumber: 1,
          player1: payload.gandaTim1Player1.trim(),
          phone1: g1p1Phone,
          player2: payload.gandaTim1Player2.trim(),
          phone2: g1p2Phone,
        });
      }
      if (payload.hasGandaTim2 && payload.gandaTim2Player1?.trim() && payload.gandaTim2Player2?.trim()) {
        incomingGandaTeams.push({
          preferredTeamNumber: 2,
          player1: payload.gandaTim2Player1.trim(),
          phone1: g2p1Phone,
          player2: payload.gandaTim2Player2.trim(),
          phone2: g2p2Phone,
        });
      }
      if (payload.extraGandaTeams && payload.extraGandaTeams.length > 0) {
        payload.extraGandaTeams.forEach((eg) => {
          if (eg.player1?.trim() && eg.player2?.trim()) {
            incomingGandaTeams.push({
              preferredTeamNumber: eg.teamNumber || 3,
              player1: eg.player1.trim(),
              phone1: cleanPhoneNumber(eg.phone1),
              player2: eg.player2.trim(),
              phone2: cleanPhoneNumber(eg.phone2),
            });
          }
        });
      }

      const isSamePair = (p1a: string, p2a: string, p1b: string, p2b: string) => {
        const a1 = p1a.trim().toLowerCase();
        const a2 = p2a.trim().toLowerCase();
        const b1 = p1b.trim().toLowerCase();
        const b2 = p2b.trim().toLowerCase();
        return (a1 === b1 && a2 === b2) || (a1 === b2 && a2 === b1);
      };

      const finalGandaTeams: RegisteredGandaTeam[] = [...existingGandaTeams];
      const shiftNotices: string[] = [];

      // 3. Process each incoming Ganda team with concurrency / auto-shift protection
      for (const inTeam of incomingGandaTeams) {
        // Check if exact same players are already registered
        const alreadyRegistered = finalGandaTeams.find((t) =>
          isSamePair(t.player1, t.player2, inTeam.player1, inTeam.player2)
        );

        if (alreadyRegistered) {
          // Keep existing team slot, just refresh phone numbers if provided
          if (inTeam.phone1) alreadyRegistered.phone1 = inTeam.phone1;
          if (inTeam.phone2) alreadyRegistered.phone2 = inTeam.phone2;
          continue;
        }

        // Check if preferred slot is free
        const slotOccupant = finalGandaTeams.find((t) => t.teamNumber === inTeam.preferredTeamNumber);

        if (!slotOccupant) {
          // Slot is available
          finalGandaTeams.push({
            teamNumber: inTeam.preferredTeamNumber,
            player1: inTeam.player1,
            phone1: inTeam.phone1,
            player2: inTeam.player2,
            phone2: inTeam.phone2,
          });
        } else {
          // Slot is ALREADY OCCUPIED by another pair (registered concurrently or previously)!
          // Find next available team number:
          const occupiedNumbers = new Set(finalGandaTeams.map((t) => t.teamNumber));
          let nextTeamNumber = 1;
          while (occupiedNumbers.has(nextTeamNumber)) {
            nextTeamNumber++;
          }

          if (!isHost && nextTeamNumber > 2) {
            // Non-TI fields have a strict max of 2 Ganda teams
            return {
              success: false,
              message: `Pendaftaran Ganda Putra untuk bidang ${cleanName} sudah terisi penuh (Tim 1: ${slotOccupant.player1} & ${slotOccupant.player2}). Tidak dapat mendaftarkan tim tambahan.`,
            };
          }

          // Auto-allocate to next available team number
          finalGandaTeams.push({
            teamNumber: nextTeamNumber,
            player1: inTeam.player1,
            phone1: inTeam.phone1,
            player2: inTeam.player2,
            phone2: inTeam.phone2,
          });

          shiftNotices.push(
            `Tim ${inTeam.player1} & ${inTeam.player2} otomatis dialokasikan ke Ganda Putra Tim ${nextTeamNumber} (karena Tim ${inTeam.preferredTeamNumber} sudah didaftarkan sebelumnya oleh ${slotOccupant.player1} & ${slotOccupant.player2}).`
          );
        }
      }

      // 4. Process Single Putra
      let finalSinglePa: RegisteredSinglePlayer | null = existingSinglePa ? { ...existingSinglePa } : null;
      const finalExtraSinglePa: RegisteredSinglePlayer[] = [...existingExtraSinglePa];

      if (payload.singlePutraPlayer?.trim()) {
        const inPa = payload.singlePutraPlayer.trim();
        const inPaPhone = spPhone;

        if (!finalSinglePa) {
          finalSinglePa = {
            playerNumber: 1,
            player: inPa,
            phone: inPaPhone,
          };
        } else if (finalSinglePa.player.trim().toLowerCase() === inPa.toLowerCase()) {
          if (inPaPhone) finalSinglePa.phone = inPaPhone;
        } else {
          // Slot 1 occupied by someone else
          if (isHost) {
            const occupiedNumbers = new Set<number>([1, ...finalExtraSinglePa.map((x) => x.playerNumber)]);
            let nextNum = 2;
            while (occupiedNumbers.has(nextNum)) nextNum++;
            finalExtraSinglePa.push({
              playerNumber: nextNum,
              player: inPa,
              phone: inPaPhone,
            });
            shiftNotices.push(
              `Single Putra ${inPa} otomatis dialokasikan sebagai Atlet ${nextNum} (karena Atlet 1 sudah didaftarkan sebelumnya oleh ${finalSinglePa.player}).`
            );
          } else {
            return {
              success: false,
              message: `Atlet Single Putra untuk bidang ${cleanName} sudah terdaftar atas nama ${finalSinglePa.player}. Silakan hubungi panitia jika membutuhkan perubahan.`,
            };
          }
        }
      }

      if (payload.extraSinglePutra && payload.extraSinglePutra.length > 0) {
        for (const esp of payload.extraSinglePutra) {
          if (esp.player?.trim()) {
            const pName = esp.player.trim();
            const pPhone = cleanPhoneNumber(esp.phone);
            if (!finalExtraSinglePa.some((x) => x.player.trim().toLowerCase() === pName.toLowerCase())) {
              const occupied = new Set<number>([1, ...finalExtraSinglePa.map((x) => x.playerNumber)]);
              let nextNum = esp.playerNumber || 2;
              while (occupied.has(nextNum)) nextNum++;
              finalExtraSinglePa.push({
                playerNumber: nextNum,
                player: pName,
                phone: pPhone,
              });
            }
          }
        }
      }

      // 5. Process Single Putri
      let finalSinglePi: RegisteredSinglePlayer | null = existingSinglePi ? { ...existingSinglePi } : null;
      const finalExtraSinglePi: RegisteredSinglePlayer[] = [...existingExtraSinglePi];

      if (payload.singlePutriPlayer?.trim()) {
        const inPi = payload.singlePutriPlayer.trim();
        const inPiPhone = spiPhone;

        if (!finalSinglePi) {
          finalSinglePi = {
            playerNumber: 1,
            player: inPi,
            phone: inPiPhone,
          };
        } else if (finalSinglePi.player.trim().toLowerCase() === inPi.toLowerCase()) {
          if (inPiPhone) finalSinglePi.phone = inPiPhone;
        } else {
          // Slot 1 occupied by someone else
          if (isHost) {
            const occupiedNumbers = new Set<number>([1, ...finalExtraSinglePi.map((x) => x.playerNumber)]);
            let nextNum = 2;
            while (occupiedNumbers.has(nextNum)) nextNum++;
            finalExtraSinglePi.push({
              playerNumber: nextNum,
              player: inPi,
              phone: inPiPhone,
            });
            shiftNotices.push(
              `Single Putri ${inPi} otomatis dialokasikan sebagai Atlet ${nextNum} (karena Atlet 1 sudah didaftarkan sebelumnya oleh ${finalSinglePi.player}).`
            );
          } else {
            return {
              success: false,
              message: `Atlet Single Putri untuk bidang ${cleanName} sudah terdaftar atas nama ${finalSinglePi.player}. Silakan hubungi panitia jika membutuhkan perubahan.`,
            };
          }
        }
      }

      if (payload.extraSinglePutri && payload.extraSinglePutri.length > 0) {
        for (const espi of payload.extraSinglePutri) {
          if (espi.player?.trim()) {
            const pName = espi.player.trim();
            const pPhone = cleanPhoneNumber(espi.phone);
            if (!finalExtraSinglePi.some((x) => x.player.trim().toLowerCase() === pName.toLowerCase())) {
              const occupied = new Set<number>([1, ...finalExtraSinglePi.map((x) => x.playerNumber)]);
              let nextNum = espi.playerNumber || 2;
              while (occupied.has(nextNum)) nextNum++;
              finalExtraSinglePi.push({
                playerNumber: nextNum,
                player: pName,
                phone: pPhone,
              });
            }
          }
        }
      }

      // 6. Build final DB record fields
      const tim1 = finalGandaTeams.find((t) => t.teamNumber === 1);
      const tim2 = finalGandaTeams.find((t) => t.teamNumber === 2);
      const extraGandaToSave = finalGandaTeams
        .filter((t) => t.teamNumber >= 3)
        .sort((a, b) => a.teamNumber - b.teamNumber);
      const extraSinglePaToSave = finalExtraSinglePa.sort((a, b) => a.playerNumber - b.playerNumber);
      const extraSinglePiToSave = finalExtraSinglePi.sort((a, b) => a.playerNumber - b.playerNumber);

      const notesPayload = JSON.stringify({
        extraGandaTeams: extraGandaToSave,
        extraSinglePutra: extraSinglePaToSave,
        extraSinglePutri: extraSinglePiToSave,
        userNote: payload.notes || existingNotesText || "",
      });

      const displayParts: string[] = [];
      if (tim1) displayParts.push(`Ganda 1: ${tim1.player1} & ${tim1.player2}`);
      if (tim2) displayParts.push(`Ganda 2: ${tim2.player1} & ${tim2.player2}`);
      extraGandaToSave.forEach((eg) => {
        displayParts.push(`Ganda ${eg.teamNumber}: ${eg.player1} & ${eg.player2}`);
      });
      if (finalSinglePa) displayParts.push(`Single Putra: ${finalSinglePa.player}`);
      extraSinglePaToSave.forEach((esp) => {
        displayParts.push(`Single Putra ${esp.playerNumber}: ${esp.player}`);
      });
      if (finalSinglePi) displayParts.push(`Single Putri: ${finalSinglePi.player}`);
      extraSinglePiToSave.forEach((espi) => {
        displayParts.push(`Single Putri ${espi.playerNumber}: ${espi.player}`);
      });

      const mergedAthleteDisplay = displayParts.join(" | ") || `Delegasi ${cleanName}`;
      const mergedPhone =
        finalSinglePa?.phone ||
        finalSinglePi?.phone ||
        tim1?.phone1 ||
        tim2?.phone1 ||
        primaryPhone;

      const recordToSave = {
        full_name: mergedAthleteDisplay,
        phone_number: mergedPhone,
        ganda_tim1_player1: tim1?.player1 || null,
        ganda_tim1_player1_phone: tim1?.phone1 || null,
        ganda_tim1_player2: tim1?.player2 || null,
        ganda_tim1_player2_phone: tim1?.phone2 || null,
        ganda_tim2_player1: tim2?.player1 || null,
        ganda_tim2_player1_phone: tim2?.phone1 || null,
        ganda_tim2_player2: tim2?.player2 || null,
        ganda_tim2_player2_phone: tim2?.phone2 || null,
        single_putra_player: finalSinglePa?.player || null,
        single_putra_phone: finalSinglePa?.phone || null,
        single_putri_player: finalSinglePi?.player || null,
        single_putri_phone: finalSinglePi?.phone || null,
        notes: notesPayload,
      };

      let savedRecord: Registration | null = null;

      if (primaryRow) {
        // Try updating existing row first (use maybeSingle so RLS with 0 updated rows does not throw PGRST116)
        const { data: updatedData, error: updateError } = await supabase
          .from("registrations")
          .update(recordToSave)
          .eq("id", primaryRow.id)
          .select()
          .maybeSingle();

        if (!updateError && updatedData) {
          savedRecord = updatedData as Registration;
        }
      }

      // If row was not updated (or update was restricted by RLS), insert fresh registration row
      if (!savedRecord) {
        const { data: insertedData, error: insertError } = await supabase
          .from("registrations")
          .insert([
            {
              registration_code: registrationCode,
              ...recordToSave,
              email: "",
              city: "Bandung",
              club_name: cleanName,
              bidang_name: cleanName,
              category: "delegasi-lengkap",
              handicap: "HC 4",
              payment_method: "GRATIS",
              payment_status: "confirmed",
            },
          ])
          .select()
          .maybeSingle();

        if (insertError || !insertedData) {
          throw new Error(insertError?.message || "Gagal menyimpan data pendaftaran.");
        }
        savedRecord = insertedData as Registration;
      }

      const successMsg =
        shiftNotices.length > 0
          ? `Pendaftaran berhasil! ${shiftNotices.join(" ")}`
          : "Pendaftaran kategori delegasi bidang berhasil disimpan!";

      return {
        success: true,
        message: successMsg,
        data: savedRecord,
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

