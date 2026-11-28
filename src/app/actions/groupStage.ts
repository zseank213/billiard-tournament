"use server";

import { GroupStageData } from "@/types/tournament";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { recalculateGroupStandings } from "@/lib/tournament-calc";

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

    // 1. Save to primary dedicated tournament_draws table
    const { error: drawErr } = await supabase.from("tournament_draws").upsert({
      category: cleanKey,
      groups_data: groups,
      updated_at: new Date().toISOString(),
    });

    if (drawErr) {
      console.warn("Failed to upsert to tournament_draws:", drawErr);
      return {
        success: false,
        message: `Gagal menyimpan ke server: ${drawErr.message}`,
      };
    }

    // Try optional sync to group_standings and group_matches if tables have open policies
    try {
      if (supabase) {
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

  // 1. Try reading from dedicated tournament_draws table first
  try {
    const { data: drawRows, error: drawErr } = await supabase
      .from("tournament_draws")
      .select("category, groups_data");

    if (!drawErr && drawRows && drawRows.length > 0) {
      const parsedDraws: Record<string, GroupStageData[]> = {};
      for (const row of drawRows) {
        if (Array.isArray(row.groups_data) && row.groups_data.length > 0) {
          parsedDraws[row.category.toLowerCase().trim()] = row.groups_data as GroupStageData[];
        }
      }
      if (Object.keys(parsedDraws).length > 0) {
        return {
          draws: parsedDraws,
          isLiveSupabase: true,
        };
      }
    }
  } catch (err) {
    console.warn("Error reading from tournament_draws:", err);
  }

  return {
    draws: {},
    isLiveSupabase: true,
  };
}

/**
 * Update a specific match score and sync auto-recalculated standings to Supabase
 */
export async function updateGroupMatchScore(
  categoryKey: string,
  groupId: string,
  matchId: string,
  score1: number,
  score2: number,
  status: "upcoming" | "live" | "completed",
  tableNumber?: number
): Promise<{ success: boolean; message: string; updatedGroups?: GroupStageData[] }> {
  const { draws } = await getGroupStageDraws();
  const cleanKey = categoryKey.toLowerCase().trim();
  const groups = draws[cleanKey];

  if (!groups || groups.length === 0) {
    return { success: false, message: "Data undian grup belum tersedia." };
  }

  const groupIndex = groups.findIndex(
    (g) => g.groupId === groupId || g.groupName.toLowerCase().includes(groupId.toLowerCase())
  );

  if (groupIndex === -1) {
    return { success: false, message: "Grup tidak ditemukan." };
  }

  const targetGroup = groups[groupIndex];
  const matchIndex = targetGroup.matches.findIndex((m) => m.id === matchId);

  if (matchIndex === -1) {
    return { success: false, message: "Pertandingan tidak ditemukan." };
  }

  // Update match
  targetGroup.matches[matchIndex] = {
    ...targetGroup.matches[matchIndex],
    score1,
    score2,
    status,
    table: tableNumber || targetGroup.matches[matchIndex].table,
  };

  // Recalculate standings
  groups[groupIndex] = recalculateGroupStandings(targetGroup);

  // Save to database
  const saveRes = await saveGroupStageDraw(cleanKey, groups);
  if (!saveRes.success) {
    return { success: false, message: saveRes.message };
  }

  return {
    success: true,
    message: "Skor pertandingan dan klasemen grup berhasil diperbarui & dipublikasikan live!",
    updatedGroups: groups,
  };
}

