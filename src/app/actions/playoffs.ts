"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { BracketMatchNode, SingleEliminationBracket } from "@/types/tournament";
import { LIQUIPEDIA_PLAYOFFS_DATA } from "@/lib/mock-data";
import { getGroupStageDraws } from "./groupStage";
import { syncPlayoffBracketWithGroups } from "@/lib/tournament-calc";

/**
 * Fetch Playoffs (Bracket) Data from Supabase for all categories,
 * and automatically sync qualified teams from Group Stage standings!
 */
export async function getPlayoffsData(): Promise<{
  playoffs: Record<string, SingleEliminationBracket>;
  isLiveSupabase: boolean;
}> {
  // Always fetch latest group stage draws so we can sync qualified teams in real time
  let groupDraws: Record<string, any[]> = {};
  try {
    const { draws } = await getGroupStageDraws();
    if (draws) groupDraws = draws;
  } catch (e) {
    console.warn("Could not load group stage for playoff sync:", e);
  }

  const basePlayoffs: Record<string, SingleEliminationBracket> = {
    ...LIQUIPEDIA_PLAYOFFS_DATA,
  };

  let isLive = false;

  if (isSupabaseConfigured() && supabase) {
    try {
      // 1. Try dedicated tournament_playoffs table
      try {
        const { data, error } = await supabase.from("tournament_playoffs").select("*");
        if (!error && data && data.length > 0) {
          for (const row of data) {
            if (row.category && row.bracket_data) {
              basePlayoffs[row.category.toLowerCase().trim()] = row.bracket_data as SingleEliminationBracket;
              isLive = true;
            }
          }
        }
      } catch {
        // Table might not exist yet
      }

      // 2. Fallback to tournament_draws with prefix 'playoff-'
      if (!isLive) {
        try {
          const { data, error } = await supabase
            .from("tournament_draws")
            .select("*")
            .ilike("category", "playoff-%");
          if (!error && data && data.length > 0) {
            for (const row of data) {
              const catKey = row.category.replace(/^playoff-/, "").toLowerCase().trim();
              if (row.groups_data) {
                basePlayoffs[catKey] = row.groups_data as SingleEliminationBracket;
                isLive = true;
              }
            }
          }
        } catch {}
      }
    } catch (e) {
      console.warn("Could not load playoffs from Supabase, using defaults:", e);
    }
  }

  // Real-time synchronization:
  // For every category, auto-inject any teams that have qualified from the group stage!
  const syncedPlayoffs: Record<string, SingleEliminationBracket> = {};
  for (const catKey of Object.keys(basePlayoffs)) {
    const bracket = basePlayoffs[catKey];
    const groups = groupDraws[catKey] || [];
    if (groups && groups.length > 0) {
      syncedPlayoffs[catKey] = syncPlayoffBracketWithGroups(bracket, groups);
    } else {
      syncedPlayoffs[catKey] = bracket;
    }
  }

  return {
    playoffs: syncedPlayoffs,
    isLiveSupabase: isLive,
  };
}

/**
 * Save / Update Playoffs Bracket Data to Supabase
 */
export async function savePlayoffsData(
  categoryKey: string,
  bracketData: SingleEliminationBracket
): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, message: "Database Supabase belum terhubung." };
  }

  const cleanKey = categoryKey.toLowerCase().trim();

  try {
    let saved = false;

    // 1. Try dedicated table tournament_playoffs
    try {
      const { error: playErr } = await supabase.from("tournament_playoffs").upsert({
        category: cleanKey,
        bracket_data: bracketData,
        updated_at: new Date().toISOString(),
      });
      if (!playErr) {
        saved = true;
      }
    } catch {}

    // 2. Always mirror to tournament_draws as 'playoff-<cat>' to guarantee zero-downtime persistence
    const { error: drawErr } = await supabase.from("tournament_draws").upsert({
      category: `playoff-${cleanKey}`,
      groups_data: bracketData,
      updated_at: new Date().toISOString(),
    });

    // 3. Mirror individual matches into playoff_matches table for Supabase Table Editor view
    try {
      const catLabel =
        cleanKey === "ganda-putra"
          ? "Ganda Putra"
          : cleanKey === "single-putra"
          ? "Single Putra"
          : "Single Putri";

      const matches = [
        ...(bracketData.quarterfinals || []),
        ...(bracketData.semifinals || []),
        bracketData.bronzeMatch,
        bracketData.grandFinal,
      ].filter(Boolean);

      const rows = matches.map((m) => ({
        id: m.id.includes(cleanKey) ? m.id : `${cleanKey}-${m.id}`,
        category: catLabel,
        round_name: m.roundName,
        team1_name: m.team1?.name || "TBD",
        team1_short: m.team1?.shortName || null,
        team1_score: m.team1?.score ?? 0,
        team2_name: m.team2?.name || "TBD",
        team2_short: m.team2?.shortName || null,
        team2_score: m.team2?.score ?? 0,
        race_to: m.raceTo || 4,
        status:
          m.team1?.isWinner || m.team2?.isWinner || m.status === "completed"
            ? "completed"
            : m.status || "upcoming",
        winner: m.team1?.isWinner ? m.team1.name : m.team2?.isWinner ? m.team2.name : null,
      }));

      await supabase.from("playoff_matches").upsert(rows, { onConflict: "id" });
    } catch (e) {
      console.warn("Could not mirror to playoff_matches table:", e);
    }

    if (drawErr && !saved) {
      return { success: false, message: `Gagal menyimpan ke server: ${drawErr.message}` };
    }

    return {
      success: true,
      message: `Bagan Playoff kategori ${categoryKey} berhasil disimpan dan dipublikasikan live!`,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Terjadi kesalahan internal." };
  }
}

/**
 * Auto-populate Quarterfinal matches from Group Stage standings (1A vs 2B, 1C vs 2D, 1B vs 2A, 1D vs 2C)
 */
export async function populatePlayoffsFromGroupStage(
  categoryKey: string
): Promise<{ success: boolean; message: string; bracket?: SingleEliminationBracket }> {
  const { draws } = await getGroupStageDraws();
  const cleanKey = categoryKey.toLowerCase().trim();
  const groups = draws[cleanKey];

  if (!groups || groups.length === 0) {
    return {
      success: false,
      message: "Data babak grup belum ditemukan.",
    };
  }

  const { playoffs } = await getPlayoffsData();
  const current =
    playoffs[cleanKey] ||
    LIQUIPEDIA_PLAYOFFS_DATA[cleanKey] ||
    LIQUIPEDIA_PLAYOFFS_DATA["ganda-putra"];

  const updatedBracket = syncPlayoffBracketWithGroups(current, groups);

  // Save to database
  const saveRes = await savePlayoffsData(cleanKey, updatedBracket);
  if (!saveRes.success) {
    return { success: false, message: saveRes.message };
  }

  return {
    success: true,
    message: "Bagan Perempat Final berhasil otomatis diisi dari tim-tim grup yang telah lolos!",
    bracket: updatedBracket,
  };
}

