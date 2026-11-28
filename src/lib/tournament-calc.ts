import { GroupStageData } from "@/types/tournament";

/**
 * Recalculate standings for a group based on its 10 head-to-head matches
 */
export function recalculateGroupStandings(group: GroupStageData): GroupStageData {
  const standingsMap: Record<
    string,
    {
      matchesPlayed: number;
      seriesWon: number;
      seriesLost: number;
      racksWon: number;
      racksLost: number;
      points: number;
    }
  > = {};

  // Initialize all non-TBD teams
  for (const st of group.standings) {
    if (st.teamName && !st.teamName.includes("TBD")) {
      standingsMap[st.teamName] = {
        matchesPlayed: 0,
        seriesWon: 0,
        seriesLost: 0,
        racksWon: 0,
        racksLost: 0,
        points: 0,
      };
    }
  }

  // Calculate from completed matches or matches with scores entered
  for (const m of group.matches) {
    const s1 = Number(m.score1) || 0;
    const s2 = Number(m.score2) || 0;
    const t1 = m.team1;
    const t2 = m.team2;

    // Count if match is marked completed or has scores
    if (m.status === "completed" || s1 > 0 || s2 > 0) {
      if (standingsMap[t1] && standingsMap[t2]) {
        standingsMap[t1].matchesPlayed += 1;
        standingsMap[t2].matchesPlayed += 1;
        standingsMap[t1].racksWon += s1;
        standingsMap[t1].racksLost += s2;
        standingsMap[t2].racksWon += s2;
        standingsMap[t2].racksLost += s1;

        if (s1 > s2) {
          standingsMap[t1].seriesWon += 1;
          standingsMap[t1].points += 1;
          standingsMap[t2].seriesLost += 1;
        } else if (s2 > s1) {
          standingsMap[t2].seriesWon += 1;
          standingsMap[t2].points += 1;
          standingsMap[t1].seriesLost += 1;
        }
      }
    }
  }

  // Map stats back to standings array
  const updatedStandings = group.standings.map((st) => {
    const stats = standingsMap[st.teamName];
    if (!stats) return st;
    const rackDiff = stats.racksWon - stats.racksLost;
    return {
      ...st,
      matchesPlayed: stats.matchesPlayed,
      seriesWon: stats.seriesWon,
      seriesLost: stats.seriesLost,
      racksWon: stats.racksWon,
      racksLost: stats.racksLost,
      rackDiff,
      points: stats.points,
    };
  });

  // Sort standings: Points DESC, RackDiff DESC, RacksWon DESC
  updatedStandings.sort((a, b) => {
    if (a.teamName.includes("TBD")) return 1;
    if (b.teamName.includes("TBD")) return -1;
    if (b.points !== a.points) return b.points - a.points;
    if (b.rackDiff !== a.rackDiff) return b.rackDiff - a.rackDiff;
    return b.racksWon - a.racksWon;
  });

  // Re-assign pos 1..5 and status
  const finalizedStandings = updatedStandings.map((st, idx) => {
    const pos = idx + 1;
    let status: "qualified" | "eliminated" | null = null;
    if (!st.teamName.includes("TBD") && st.matchesPlayed > 0) {
      status = pos <= 2 ? "qualified" : "eliminated";
    }
    return {
      ...st,
      pos,
      status,
    };
  });

  return {
    ...group,
    standings: finalizedStandings,
  };
}
