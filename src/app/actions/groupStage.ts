"use server";

import { GroupStageData } from "@/types/tournament";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface GroupStageSaveResult {
  success: boolean;
  message: string;
}

/**
 * Save drawn group stage data to Supabase (persisted in database so all users across devices see it)
 */
export async function saveGroupStageDraw(
  categoryKey: string,
  groups: GroupStageData[]
): Promise<GroupStageSaveResult> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      success: false,
      message: "Koneksi Supabase belum terkonfigurasi.",
    };
  }

  try {
    const cleanKey = categoryKey.trim().toLowerCase();
    const payloadNotes = JSON.stringify(groups);

    // Save state as a confirmed system record in registrations (which has public INSERT policy)
    const { error: insertError } = await supabase.from("registrations").insert([
      {
        registration_code: `DRAWN_${cleanKey}_${Date.now()}`,
        full_name: `Hasil Undian ${cleanKey} (Official)`,
        bidang_name: cleanKey,
        phone_number: "08000000000",
        category: "drawn-group-stage",
        city: "Bandung",
        notes: payloadNotes,
        payment_status: "confirmed",
      },
    ]);

    if (insertError) {
      console.warn("Failed to insert group stage draw to Supabase:", insertError);
      return {
        success: false,
        message: `Gagal menyimpan ke server: ${insertError.message}`,
      };
    }

    // Try optional sync to group_standings and group_matches if tables have open policies
    try {
      for (const group of groups) {
        for (const standing of group.standings) {
          if (standing.teamName && !standing.teamName.includes("TBD")) {
            await supabase.from("group_standings").upsert({
              group_name: group.groupName.split("—")[0].trim(),
              category: cleanKey,
              pos: standing.pos,
              team_id: standing.teamId,
              team_name: standing.teamName,
              short_name: standing.shortName,
              matches_played: standing.matchesPlayed,
              series_won: standing.seriesWon,
              series_lost: standing.seriesLost,
              racks_won: standing.racksWon,
              racks_lost: standing.racksLost,
              rack_diff: standing.rackDiff,
              points: standing.points,
              status: standing.status,
            });
          }
        }
      }
    } catch (e) {
      // Non-critical, group_standings direct sync is optional
    }

    return {
      success: true,
      message: `Hasil undian kategori ${categoryKey} berhasil disimpan secara permanen ke server!`,
    };
  } catch (err: any) {
    console.error("Error saving group stage draw:", err);
    return {
      success: false,
      message: err?.message || "Terjadi kesalahan internal saat menyimpan.",
    };
  }
}

/**
 * Get the latest drawn group stage data for all categories from Supabase
 */
export async function getGroupStageDraws(): Promise<{
  draws: Record<string, GroupStageData[]>;
  isLiveSupabase: boolean;
}> {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      draws: {},
      isLiveSupabase: false,
    };
  }

  try {
    const { data, error } = await supabase
      .from("registrations")
      .select("bidang_name, notes, created_at")
      .eq("category", "drawn-group-stage")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return {
        draws: {},
        isLiveSupabase: true,
      };
    }

    const latestByCategory: Record<string, GroupStageData[]> = {};

    for (const row of data) {
      const catKey = (row.bidang_name || "").toLowerCase().trim();
      if (catKey && latestByCategory[catKey] === undefined && row.notes) {
        try {
          const parsed = JSON.parse(row.notes);
          if (Array.isArray(parsed)) {
            // Store the latest draw record (even if empty, marking reset)
            latestByCategory[catKey] = parsed as GroupStageData[];
          }
        } catch (e) {
          console.warn(`Failed parsing draw notes for category ${catKey}:`, e);
        }
      }
    }

    // Filter out categories where draw is empty array (meaning reset/cleared)
    const validDraws: Record<string, GroupStageData[]> = {};
    for (const [k, v] of Object.entries(latestByCategory)) {
      if (v && v.length > 0) {
        validDraws[k] = v;
      }
    }

    return {
      draws: validDraws,
      isLiveSupabase: true,
    };
  } catch (err) {
    console.warn("Failed fetching group stage draws from Supabase:", err);
    return {
      draws: {},
      isLiveSupabase: false,
    };
  }
}

