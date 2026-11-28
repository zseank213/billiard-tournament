"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { BracketMatchNode, SingleEliminationBracket } from "@/types/tournament";
import { LIQUIPEDIA_PLAYOFFS_DATA } from "@/lib/mock-data";
import { getGroupStageDraws } from "./groupStage";

/**
 * Fetch Playoffs (Bracket) Data from Supabase for all categories
 */
export async function getPlayoffsData(): Promise<{
  playoffs: Record<string, SingleEliminationBracket>;
  isLiveSupabase: boolean;
}> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const playoffsMap: Record<string, SingleEliminationBracket> = {};

      // 1. Try dedicated tournament_playoffs table
      try {
        const { data, error } = await supabase.from("tournament_playoffs").select("*");
        if (!error && data && data.length > 0) {
          for (const row of data) {
            if (row.category && row.bracket_data) {
              playoffsMap[row.category.toLowerCase().trim()] = row.bracket_data as SingleEliminationBracket;
            }
          }
        }
      } catch {
        // Table might not exist yet
      }

      // 2. Fallback to tournament_draws with prefix 'playoff-'
      if (Object.keys(playoffsMap).length === 0) {
        try {
          const { data, error } = await supabase
            .from("tournament_draws")
            .select("*")
            .ilike("category", "playoff-%");
          if (!error && data && data.length > 0) {
            for (const row of data) {
              const catKey = row.category.replace(/^playoff-/, "").toLowerCase().trim();
              if (row.groups_data) {
                playoffsMap[catKey] = row.groups_data as SingleEliminationBracket;
              }
            }
          }
        } catch {}
      }

      if (Object.keys(playoffsMap).length > 0) {
        return {
          playoffs: {
            ...LIQUIPEDIA_PLAYOFFS_DATA,
            ...playoffsMap,
          },
          isLiveSupabase: true,
        };
      }
    } catch (e) {
      console.warn("Could not load playoffs from Supabase, using defaults:", e);
    }
  }

  return {
    playoffs: LIQUIPEDIA_PLAYOFFS_DATA,
    isLiveSupabase: false,
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

  if (!groups || groups.length < 4) {
    return {
      success: false,
      message: "Data babak grup belum lengkap (butuh 4 grup A, B, C, D yang sudah diundi).",
    };
  }

  // Find 1st & 2nd place of each group
  const getRankTeam = (groupLetter: string, rank: number) => {
    const grp = groups.find((g) => g.groupName.toUpperCase().includes(`GRUP ${groupLetter}`) || g.groupId.toUpperCase().includes(`GROUP-${groupLetter.toLowerCase()}`));
    if (!grp || !grp.standings || grp.standings.length < rank) return null;
    const sorted = [...grp.standings].sort((a, b) => (b.points || 0) - (a.points || 0) || (b.rackDiff || 0) - (a.rackDiff || 0));
    return sorted[rank - 1];
  };

  const t1A = getRankTeam("A", 1);
  const t2A = getRankTeam("A", 2);
  const t1B = getRankTeam("B", 1);
  const t2B = getRankTeam("B", 2);
  const t1C = getRankTeam("C", 1);
  const t2C = getRankTeam("C", 2);
  const t1D = getRankTeam("D", 1);
  const t2D = getRankTeam("D", 2);

  const { playoffs } = await getPlayoffsData();
  const current = playoffs[cleanKey] || LIQUIPEDIA_PLAYOFFS_DATA[cleanKey] || LIQUIPEDIA_PLAYOFFS_DATA["ganda-putra"];
  const updatedBracket: SingleEliminationBracket = JSON.parse(JSON.stringify(current));

  // QF 1: 1A vs 2B
  if (t1A && updatedBracket.quarterfinals[0]) {
    updatedBracket.quarterfinals[0].team1 = {
      name: t1A.teamName,
      shortName: t1A.shortName || "1A",
      score: updatedBracket.quarterfinals[0].team1?.score || 0,
      isWinner: updatedBracket.quarterfinals[0].team1?.isWinner || false,
      seed: 1,
    };
  }
  if (t2B && updatedBracket.quarterfinals[0]) {
    updatedBracket.quarterfinals[0].team2 = {
      name: t2B.teamName,
      shortName: t2B.shortName || "2B",
      score: updatedBracket.quarterfinals[0].team2?.score || 0,
      isWinner: updatedBracket.quarterfinals[0].team2?.isWinner || false,
    };
  }

  // QF 2: 1C vs 2D
  if (t1C && updatedBracket.quarterfinals[1]) {
    updatedBracket.quarterfinals[1].team1 = {
      name: t1C.teamName,
      shortName: t1C.shortName || "1C",
      score: updatedBracket.quarterfinals[1].team1?.score || 0,
      isWinner: updatedBracket.quarterfinals[1].team1?.isWinner || false,
      seed: 1,
    };
  }
  if (t2D && updatedBracket.quarterfinals[1]) {
    updatedBracket.quarterfinals[1].team2 = {
      name: t2D.teamName,
      shortName: t2D.shortName || "2D",
      score: updatedBracket.quarterfinals[1].team2?.score || 0,
      isWinner: updatedBracket.quarterfinals[1].team2?.isWinner || false,
    };
  }

  // QF 3: 1B vs 2A
  if (t1B && updatedBracket.quarterfinals[2]) {
    updatedBracket.quarterfinals[2].team1 = {
      name: t1B.teamName,
      shortName: t1B.shortName || "1B",
      score: updatedBracket.quarterfinals[2].team1?.score || 0,
      isWinner: updatedBracket.quarterfinals[2].team1?.isWinner || false,
      seed: 1,
    };
  }
  if (t2A && updatedBracket.quarterfinals[2]) {
    updatedBracket.quarterfinals[2].team2 = {
      name: t2A.teamName,
      shortName: t2A.shortName || "2A",
      score: updatedBracket.quarterfinals[2].team2?.score || 0,
      isWinner: updatedBracket.quarterfinals[2].team2?.isWinner || false,
    };
  }

  // QF 4: 1D vs 2C
  if (t1D && updatedBracket.quarterfinals[3]) {
    updatedBracket.quarterfinals[3].team1 = {
      name: t1D.teamName,
      shortName: t1D.shortName || "1D",
      score: updatedBracket.quarterfinals[3].team1?.score || 0,
      isWinner: updatedBracket.quarterfinals[3].team1?.isWinner || false,
      seed: 1,
    };
  }
  if (t2C && updatedBracket.quarterfinals[3]) {
    updatedBracket.quarterfinals[3].team2 = {
      name: t2C.teamName,
      shortName: t2C.shortName || "2C",
      score: updatedBracket.quarterfinals[3].team2?.score || 0,
      isWinner: updatedBracket.quarterfinals[3].team2?.isWinner || false,
    };
  }

  // Save to database
  const saveRes = await savePlayoffsData(cleanKey, updatedBracket);
  if (!saveRes.success) {
    return { success: false, message: saveRes.message };
  }

  return {
    success: true,
    message: "Bagan Perempat Final berhasil otomatis diisi dari Juara dan Runner-up Grup!",
    bracket: updatedBracket,
  };
}

