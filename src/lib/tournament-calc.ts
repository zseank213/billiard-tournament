import { GroupStageData, SingleEliminationBracket } from "@/types/tournament";

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
      ballDiff: number;
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
        ballDiff: 0,
        points: 0,
      };
    }
  }

  // Calculate from completed matches or matches with scores entered
  for (const m of group.matches) {
    const s1 = Number(m.score1) || 0;
    const s2 = Number(m.score2) || 0;
    const bDiff = Number(m.ballDiff) || 0;
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
          standingsMap[t1].ballDiff += bDiff;
          standingsMap[t2].seriesLost += 1;
          standingsMap[t2].ballDiff -= bDiff;
        } else if (s2 > s1) {
          standingsMap[t2].seriesWon += 1;
          standingsMap[t2].points += 1;
          standingsMap[t2].ballDiff += bDiff;
          standingsMap[t1].seriesLost += 1;
          standingsMap[t1].ballDiff -= bDiff;
        }
      }
    }
  }

  // Map stats back to standings array
  const updatedStandings = group.standings.map((st) => {
    const stats = standingsMap[st.teamName];
    if (!stats) return st;
    // Gunakan selisih bola sisa jika ada match yang diisi ballDiff; jika belum, gunakan selisih game
    const rackDiff = stats.ballDiff !== 0 ? stats.ballDiff : (stats.racksWon - stats.racksLost);
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

/**
 * Sync qualified teams from Group Stage standings into the Playoff bracket
 * QF 1: 1A vs 2B
 * QF 2: 1C vs 2D
 * QF 3: 1B vs 2A
 * QF 4: 1D vs 2C
 */
export function syncPlayoffBracketWithGroups(
  currentBracket: SingleEliminationBracket,
  groups: GroupStageData[]
): SingleEliminationBracket {
  if (!groups || groups.length === 0) return currentBracket;

  const bracket: SingleEliminationBracket = JSON.parse(JSON.stringify(currentBracket));

  const getRankTeam = (groupLetter: string, rank: number) => {
    const grp = groups.find(
      (g) =>
        g.groupName.toUpperCase().includes(`GRUP ${groupLetter}`) ||
        g.groupId.toUpperCase().includes(`GROUP-${groupLetter.toLowerCase()}`)
    );
    if (!grp || !grp.standings || grp.standings.length < rank) return null;
    const nonTbd = grp.standings.filter((s) => s.teamName && !s.teamName.includes("TBD"));
    if (nonTbd.length === 0) return null;

    const sorted = [...nonTbd].sort((a, b) => {
      if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
      if ((b.rackDiff || 0) !== (a.rackDiff || 0)) return (b.rackDiff || 0) - (a.rackDiff || 0);
      return (b.racksWon || 0) - (a.racksWon || 0);
    });

    const candidate = sorted[rank - 1];
    // Pastikan tim ini sudah bertanding (matchesPlayed > 0)
    if (!candidate || !candidate.matchesPlayed || candidate.matchesPlayed === 0) return null;
    return candidate;
  };

  const t1A = getRankTeam("A", 1);
  const t2A = getRankTeam("A", 2);
  const t1B = getRankTeam("B", 1);
  const t2B = getRankTeam("B", 2);
  const t1C = getRankTeam("C", 1);
  const t2C = getRankTeam("C", 2);
  const t1D = getRankTeam("D", 1);
  const t2D = getRankTeam("D", 2);

  // QF 1: 1A vs 2B
  if (bracket.quarterfinals && bracket.quarterfinals[0]) {
    if (t1A) {
      bracket.quarterfinals[0].team1 = {
        ...bracket.quarterfinals[0].team1,
        name: t1A.teamName,
        shortName: t1A.shortName || "1A",
        playerName: t1A.playerName,
        seed: 1,
      };
    }
    if (t2B) {
      bracket.quarterfinals[0].team2 = {
        ...bracket.quarterfinals[0].team2,
        name: t2B.teamName,
        shortName: t2B.shortName || "2B",
        playerName: t2B.playerName,
      };
    }
  }

  // QF 2: 1C vs 2D
  if (bracket.quarterfinals && bracket.quarterfinals[1]) {
    if (t1C) {
      bracket.quarterfinals[1].team1 = {
        ...bracket.quarterfinals[1].team1,
        name: t1C.teamName,
        shortName: t1C.shortName || "1C",
        playerName: t1C.playerName,
        seed: 1,
      };
    }
    if (t2D) {
      bracket.quarterfinals[1].team2 = {
        ...bracket.quarterfinals[1].team2,
        name: t2D.teamName,
        shortName: t2D.shortName || "2D",
        playerName: t2D.playerName,
      };
    }
  }

  // QF 3: 1B vs 2A
  if (bracket.quarterfinals && bracket.quarterfinals[2]) {
    if (t1B) {
      bracket.quarterfinals[2].team1 = {
        ...bracket.quarterfinals[2].team1,
        name: t1B.teamName,
        shortName: t1B.shortName || "1B",
        playerName: t1B.playerName,
        seed: 1,
      };
    }
    if (t2A) {
      bracket.quarterfinals[2].team2 = {
        ...bracket.quarterfinals[2].team2,
        name: t2A.teamName,
        shortName: t2A.shortName || "2A",
        playerName: t2A.playerName,
      };
    }
  }

  // QF 4: 1D vs 2C
  if (bracket.quarterfinals && bracket.quarterfinals[3]) {
    if (t1D) {
      bracket.quarterfinals[3].team1 = {
        ...bracket.quarterfinals[3].team1,
        name: t1D.teamName,
        shortName: t1D.shortName || "1D",
        playerName: t1D.playerName,
        seed: 1,
      };
    }
    if (t2C) {
      bracket.quarterfinals[3].team2 = {
        ...bracket.quarterfinals[3].team2,
        name: t2C.teamName,
        shortName: t2C.shortName || "2C",
        playerName: t2C.playerName,
      };
    }
  }

  // Build a lookup map of player names from all groups to enrich all rounds
  const playerNameMap: Record<string, string> = {};
  for (const g of groups) {
    if (g.standings) {
      for (const s of g.standings) {
        if (s.teamName && s.playerName) {
          playerNameMap[s.teamName.trim()] = s.playerName.trim();
        }
      }
    }
  }

  const enrichNode = (node?: any) => {
    if (!node) return;
    if (node.team1 && node.team1.name && playerNameMap[node.team1.name.trim()]) {
      node.team1.playerName = playerNameMap[node.team1.name.trim()];
    }
    if (node.team2 && node.team2.name && playerNameMap[node.team2.name.trim()]) {
      node.team2.playerName = playerNameMap[node.team2.name.trim()];
    }
  };

  bracket.quarterfinals?.forEach(enrichNode);
  bracket.semifinals?.forEach(enrichNode);
  enrichNode(bracket.bronzeMatch);
  enrichNode(bracket.grandFinal);

  return bracket;
}
