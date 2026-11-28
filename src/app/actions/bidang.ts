"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { INVITED_BIDANG_LIST, LIQUIPEDIA_PARTICIPANTS } from "@/lib/mock-data";
import { ParticipantTeam, ParticipantMemberSlot } from "@/types/tournament";

export interface BidangRecord {
  id: number;
  code: string;
  name: string;
  short_name: string;
  is_host: boolean;
  order_no: number;
  status: string;
  quota_ganda_putra: number;
  quota_single_putra: number;
  quota_single_putri: number;
}

export async function getBidangList(): Promise<{
  bidang: BidangRecord[];
  isLiveSupabase: boolean;
}> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("bidang")
        .select("*")
        .order("order_no", { ascending: true });

      if (!error && data && data.length > 0) {
        return {
          bidang: data as BidangRecord[],
          isLiveSupabase: true,
        };
      }
    } catch (e) {
      console.warn("Failed fetching bidang from Supabase, falling back to local data:", e);
    }
  }

  // Fallback to local 20 Bidang list
  const fallbackList: BidangRecord[] = INVITED_BIDANG_LIST.map((name, idx) => {
    const isHost = idx === 0;
    const words = name.split(" ");
    const short = isHost
      ? "IT"
      : words.length > 1
      ? words.map((w) => w[0]).join("").slice(0, 4).toUpperCase()
      : name.slice(0, 4).toUpperCase();

    return {
      id: idx + 1,
      code: short,
      name,
      short_name: short,
      is_host: isHost,
      order_no: idx + 1,
      status: isHost ? "host" : "invited",
      quota_ganda_putra: 2,
      quota_single_putra: 1,
      quota_single_putri: 1,
    };
  });

  return {
    bidang: fallbackList,
    isLiveSupabase: false,
  };
}

export async function getParticipantsWithRosters(): Promise<{
  participants: ParticipantTeam[];
  isLiveSupabase: boolean;
}> {
  const { bidang, isLiveSupabase } = await getBidangList();

  // If Supabase is connected, we can also check registrations to fill roster slots
  let registrationsMap: Record<string, any[]> = {};
  let rawRegData: any[] = [];

  if (isLiveSupabase && supabase) {
    try {
      const { data: regData } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false }); // Latest first

      if (regData && regData.length > 0) {
        rawRegData = regData;
        regData.forEach((reg) => {
          const key1 = reg.bidang_name;
          const key2 = reg.club_name;
          if (key1) {
            if (!registrationsMap[key1]) registrationsMap[key1] = [];
            registrationsMap[key1].push(reg);
          }
          if (key2 && key2 !== key1) {
            if (!registrationsMap[key2]) registrationsMap[key2] = [];
            registrationsMap[key2].push(reg);
          }
        });
      }
    } catch (err) {
      console.warn("Could not load registrations for participants:", err);
    }
  }

  // Check if registrations table is in the new clean schema:
  // (category in 'GANDA', 'SINGLE_PUTRA', 'SINGLE_PUTRI')
  const isNewSchema = rawRegData.some(
    (r) => r.category === "GANDA" || r.category === "SINGLE_PUTRA" || r.category === "SINGLE_PUTRI"
  );

  if (isNewSchema) {
    const participants: ParticipantTeam[] = bidang.map((b) => {
      // Filter rows belonging to this bidang (sorted by created_at ascending)
      const bRegs = rawRegData
        .filter(
          (r) =>
            (r.bidang_name || "").trim().toLowerCase() === (b.name || "").trim().toLowerCase() ||
            (r.bidang_name || "").trim().toLowerCase() === (b.short_name || "").trim().toLowerCase()
        )
        .reverse();

      const isRegistered = bRegs.length > 0;
      const slots: ParticipantMemberSlot[] = [];
      let slotIdx = 1;

      // 1. GANDA
      const gandaRows = bRegs.filter((r) => r.category === "GANDA");
      gandaRows.forEach((gr, idx) => {
        slots.push({
          slotNumber: slotIdx++,
          category: "Ganda Putra",
          role: gr.team_label || `Ganda ${idx + 1}`,
          playerName: `${gr.player1_name}${gr.player2_name ? ` & ${gr.player2_name}` : ""}`,
        });
      });
      const minGanda = Math.max(2, b.quota_ganda_putra || 2);
      for (let i = gandaRows.length; i < minGanda; i++) {
        slots.push({
          slotNumber: slotIdx++,
          category: "Ganda Putra",
          role: `Ganda ${i + 1}`,
          playerName: "Belum Didaftarkan (TBD)",
        });
      }

      // 2. SINGLE PUTRA
      const spRows = bRegs.filter((r) => r.category === "SINGLE_PUTRA");
      spRows.forEach((sr, idx) => {
        slots.push({
          slotNumber: slotIdx++,
          category: "Single Putra",
          role: sr.team_label || (idx === 0 ? "Single Putra" : `Single Putra (Atlet ${idx + 1})`),
          playerName: sr.player1_name,
        });
      });
      if (spRows.length === 0) {
        slots.push({
          slotNumber: slotIdx++,
          category: "Single Putra",
          role: "Single Putra",
          playerName: "Belum Didaftarkan (TBD)",
        });
      }

      // 3. SINGLE PUTRI
      const spiRows = bRegs.filter((r) => r.category === "SINGLE_PUTRI");
      spiRows.forEach((spir, idx) => {
        slots.push({
          slotNumber: slotIdx++,
          category: "Single Putri",
          role: spir.team_label || (idx === 0 ? "Single Putri" : `Single Putri (Atlet ${idx + 1})`),
          playerName: spir.player1_name,
        });
      });
      if (spiRows.length === 0) {
        slots.push({
          slotNumber: slotIdx++,
          category: "Single Putri",
          role: "Single Putri",
          playerName: "Belum Didaftarkan (TBD)",
        });
      }

      return {
        id: `team-${b.id}`,
        name: b.name,
        shortName: b.short_name,
        bidang: b.name,
        seed: b.order_no,
        status: b.is_host ? ("host" as const) : isRegistered ? ("registered" as const) : ("invited" as const),
        accentColor: b.is_host ? "bg-red-600 text-white" : "bg-slate-100 text-slate-800",
        slots,
      };
    });

    return {
      participants: participants.length > 0 ? participants : LIQUIPEDIA_PARTICIPANTS,
      isLiveSupabase: true,
    };
  }

  const participants: ParticipantTeam[] = bidang.map((b) => {
    const regs = registrationsMap[b.name] || registrationsMap[b.short_name] || [];

    let gandaP1 = "";
    let gandaP2 = "";
    let ganda2P1 = "";
    let ganda2P2 = "";
    let singlePa = "";
    let singlePi = "";
    const extraGanda: { teamNumber: number; player1: string; player2: string }[] = [];
    const extraSinglePa: { playerNumber: number; player: string }[] = [];
    const extraSinglePi: { playerNumber: number; player: string }[] = [];

    for (const r of regs) {
      if (!gandaP1 && r.ganda_tim1_player1) gandaP1 = r.ganda_tim1_player1;
      if (!gandaP2 && r.ganda_tim1_player2) gandaP2 = r.ganda_tim1_player2;
      if (!ganda2P1 && r.ganda_tim2_player1) ganda2P1 = r.ganda_tim2_player1;
      if (!ganda2P2 && r.ganda_tim2_player2) ganda2P2 = r.ganda_tim2_player2;
      if (!singlePa && (r.single_putra_player || (r.category === "single-putra" && (r.player1_name || r.full_name)))) {
        singlePa = r.single_putra_player || r.player1_name || r.full_name || "";
      }
      if (!singlePi && (r.single_putri_player || (r.category === "single-putri" && (r.player1_name || r.full_name)))) {
        singlePi = r.single_putri_player || r.player1_name || r.full_name || "";
      }

      if (r.notes) {
        try {
          if (r.notes.includes("extraGandaTeams") || r.notes.startsWith("{")) {
            const parsed = JSON.parse(r.notes);
            if (Array.isArray(parsed.extraGandaTeams)) {
              parsed.extraGandaTeams.forEach((eg: any) => {
                if (eg.player1 && eg.player2 && !extraGanda.some((x) => x.teamNumber === eg.teamNumber)) {
                  extraGanda.push({
                    teamNumber: eg.teamNumber,
                    player1: eg.player1,
                    player2: eg.player2,
                  });
                }
              });
            }
            if (Array.isArray(parsed.extraSinglePutra)) {
              parsed.extraSinglePutra.forEach((esp: any) => {
                if (esp.player && !extraSinglePa.some((x) => x.playerNumber === esp.playerNumber)) {
                  extraSinglePa.push({
                    playerNumber: esp.playerNumber,
                    player: esp.player,
                  });
                }
              });
            }
            if (Array.isArray(parsed.extraSinglePutri)) {
              parsed.extraSinglePutri.forEach((espi: any) => {
                if (espi.player && !extraSinglePi.some((x) => x.playerNumber === espi.playerNumber)) {
                  extraSinglePi.push({
                    playerNumber: espi.playerNumber,
                    player: espi.player,
                  });
                }
              });
            }
          }
        } catch {
          // ignore non-json notes
        }

        // If the latest registration row already defines extra teams/players, treat it as authoritative
        if (r.notes && (r.notes.includes("extraSinglePutra") || r.notes.includes("extraGandaTeams"))) {
          break;
        }
      }
    }

    const hasGandaTim2 = !!(ganda2P1 || ganda2P2);
    const isRegistered = regs.length > 0 && !!(gandaP1 || singlePa || singlePi || extraGanda.length > 0);

    // Order: 1. Team Ganda 1 -> 2. Team Ganda 2 (if exists) -> 3. Extra Ganda Teams -> 4. Single Putra -> 5. Single Putri
    const slots: ParticipantMemberSlot[] = [];
    let slotIdx = 1;

    // 1. Team Ganda 1 (1 baris: Format "Pemain 1 & Pemain 2")
    const g1P1 = gandaP1.trim();
    const g1P2 = gandaP2.trim();
    const ganda1Name =
      g1P1 && g1P2
        ? `${g1P1} & ${g1P2}`
        : g1P1
        ? `${g1P1} & TBD`
        : g1P2
        ? `TBD & ${g1P2}`
        : "Belum Didaftarkan (TBD)";

    slots.push({
      slotNumber: slotIdx++,
      category: "Ganda Putra",
      role: "Ganda 1",
      playerName: ganda1Name,
    });

    // 2. Team Ganda 2 (if exists)
    if (hasGandaTim2) {
      const g2P1 = ganda2P1.trim();
      const g2P2 = ganda2P2.trim();
      const ganda2Name =
        g2P1 && g2P2
          ? `${g2P1} & ${g2P2}`
          : g2P1
          ? `${g2P1} & TBD`
          : g2P2
          ? `TBD & ${g2P2}`
          : "Belum Didaftarkan (TBD)";

      slots.push({
        slotNumber: slotIdx++,
        category: "Ganda Putra",
        role: "Ganda 2",
        playerName: ganda2Name,
      });
    }

    // 3. Extra Ganda Teams (Host privilege)
    extraGanda.forEach((eg) => {
      const p1 = eg.player1.trim();
      const p2 = eg.player2.trim();
      const name =
        p1 && p2
          ? `${p1} & ${p2}`
          : p1
          ? `${p1} & TBD`
          : p2
          ? `TBD & ${p2}`
          : "Belum Didaftarkan (TBD)";

      slots.push({
        slotNumber: slotIdx++,
        category: "Ganda Putra",
        role: `Ganda ${eg.teamNumber}`,
        playerName: name,
      });
    });

    // 4. Single Putra (Primary + Extra)
    slots.push({
      slotNumber: slotIdx++,
      category: "Single Putra",
      role: extraSinglePa.length > 0 ? "Single Putra (Atlet 1)" : "Single Putra",
      playerName: singlePa.trim() || "Belum Didaftarkan (TBD)",
    });

    extraSinglePa.forEach((esp) => {
      slots.push({
        slotNumber: slotIdx++,
        category: "Single Putra",
        role: `Single Putra (Atlet ${esp.playerNumber})`,
        playerName: esp.player.trim() || "Belum Didaftarkan (TBD)",
      });
    });

    // 5. Single Putri (Primary + Extra)
    slots.push({
      slotNumber: slotIdx++,
      category: "Single Putri",
      role: extraSinglePi.length > 0 ? "Single Putri (Atlet 1)" : "Single Putri",
      playerName: singlePi.trim() || "Belum Didaftarkan (TBD)",
    });

    extraSinglePi.forEach((espi) => {
      slots.push({
        slotNumber: slotIdx++,
        category: "Single Putri",
        role: `Single Putri (Atlet ${espi.playerNumber})`,
        playerName: espi.player.trim() || "Belum Didaftarkan (TBD)",
      });
    });

    return {
      id: `team-${b.id}`,
      name: b.name,
      shortName: b.short_name,
      bidang: b.name,
      seed: b.order_no,
      status: b.is_host ? ("host" as const) : isRegistered ? ("registered" as const) : ("invited" as const),
      accentColor: b.is_host ? "bg-red-600 text-white" : "bg-slate-100 text-slate-800",
      slots,
    };
  });

  return {
    participants: participants.length > 0 ? participants : LIQUIPEDIA_PARTICIPANTS,
    isLiveSupabase,
  };
}

