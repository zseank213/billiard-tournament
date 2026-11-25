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
  if (isLiveSupabase && supabase) {
    try {
      const { data: regData } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: true });

      if (regData && regData.length > 0) {
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

  const participants: ParticipantTeam[] = bidang.map((b) => {
    const regs = registrationsMap[b.name] || registrationsMap[b.short_name] || [];

    let gandaP1 = "";
    let gandaP2 = "";
    let ganda2P1 = "";
    let ganda2P2 = "";
    let singlePa = "";
    let singlePi = "";

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
    }

    const hasGandaTim2 = !!(ganda2P1 || ganda2P2);
    const isRegistered = regs.length > 0 && !!(gandaP1 || singlePa || singlePi);

    // Order: 1. Team Ganda 1 -> 2. Team Ganda 2 (if exists) -> 3. Single Putra -> 4. Single Putri
    const slots: ParticipantMemberSlot[] = [];
    let slotIdx = 1;

    // 1. Team Ganda 1
    slots.push(
      {
        slotNumber: slotIdx++,
        category: "Ganda Putra",
        role: "Ganda Putra (Tim 1 - Pemain 1)",
        playerName: gandaP1.trim() || "Belum Didaftarkan (TBD)",
      },
      {
        slotNumber: slotIdx++,
        category: "Ganda Putra",
        role: "Ganda Putra (Tim 1 - Pemain 2)",
        playerName: gandaP2.trim() || "Belum Didaftarkan (TBD)",
      }
    );

    // 2. Team Ganda 2 (if exists)
    if (hasGandaTim2) {
      slots.push(
        {
          slotNumber: slotIdx++,
          category: "Ganda Putra",
          role: "Ganda Putra (Tim 2 - Pemain 1)",
          playerName: ganda2P1.trim() || "Belum Didaftarkan (TBD)",
        },
        {
          slotNumber: slotIdx++,
          category: "Ganda Putra",
          role: "Ganda Putra (Tim 2 - Pemain 2)",
          playerName: ganda2P2.trim() || "Belum Didaftarkan (TBD)",
        }
      );
    }

    // 3. Single Putra
    slots.push({
      slotNumber: slotIdx++,
      category: "Single Putra",
      role: "Single Putra",
      playerName: singlePa.trim() || "Belum Didaftarkan (TBD)",
    });

    // 4. Single Putri
    slots.push({
      slotNumber: slotIdx++,
      category: "Single Putri",
      role: "Single Putri",
      playerName: singlePi.trim() || "Belum Didaftarkan (TBD)",
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

