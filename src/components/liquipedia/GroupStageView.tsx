"use client";

import React, { useState, useEffect } from "react";
import { getBidangList, BidangRecord } from "@/app/actions/bidang";
import { GroupStageData, GroupTeamStanding } from "@/types/tournament";
import {
  Trophy,
  TableProperties,
  Users2,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";

interface CategoryStageConfig {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: typeof Trophy;
}

export const GroupStageView: React.FC = () => {
  const [bidangList, setBidangList] = useState<BidangRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getBidangList()
      .then((res) => {
        if (isMounted) {
          if (res.bidang && res.bidang.length > 0) {
            setBidangList(res.bidang);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Using default group stage data:", err);
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to generate 4 groups (A, B, C, D) of 5 teams each (TBD awaiting drawing)
  const generateGroupsForCategory = (categoryKey: string, categoryName: string): GroupStageData[] => {
    const groupLetters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

    return groupLetters.map((letter) => {
      const standings: GroupTeamStanding[] = Array.from({ length: 5 }, (_, idx) => ({
        pos: idx + 1,
        teamId: `${categoryKey}-${letter.toLowerCase()}-slot-${idx + 1}`,
        teamName: "TBD",
        shortName: "TBD",
        matchesPlayed: 0,
        seriesWon: 0,
        seriesLost: 0,
        racksWon: 0,
        racksLost: 0,
        rackDiff: 0,
        points: 0,
        status: null,
      }));

      // Generate 10 round-robin match pairs for 5 teams (0-1, 2-3, 0-2, 1-4, etc.)
      const roundRobinPairs: [number, number][] = [
        [0, 1],
        [2, 3],
        [0, 2],
        [1, 4],
        [0, 3],
        [2, 4],
        [0, 4],
        [1, 3],
        [1, 2],
        [3, 4],
      ];

      const matches = roundRobinPairs.map(([t1, t2], mIdx) => ({
        id: `${categoryKey}-${letter}-m${mIdx + 1}`,
        team1: "TBD",
        team2: "TBD",
        score1: 0,
        score2: 0,
        status: "upcoming" as const,
      }));

      return {
        groupId: `${categoryKey}-group-${letter.toLowerCase()}`,
        groupName: `Grup ${letter} — Babak Penyisihan`,
        standings,
        matches,
      };
    });
  };

  const categories: CategoryStageConfig[] = [
    {
      id: "ganda-putra",
      title: "Kategori Ganda Putra",
      subtitle: "Maksimal 2 Tim / Bidang • Perebutan Piala Bergilir Direktur Perencanaan",
      badge: "Piala Bergilir Utama",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      icon: Users2,
    },
    {
      id: "single-putra",
      title: "Kategori Single Putra",
      subtitle: "1 Tim (1 Atlet) / Bidang • 20 Atlet Antar Bidang Ganesha Operation",
      badge: "Trophy Tetap Juara 1, 2, 3",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      icon: User,
    },
    {
      id: "single-putri",
      title: "Kategori Single Putri",
      subtitle: "1 Tim (1 Atlet) / Bidang • 20 Atlet Antar Bidang Ganesha Operation",
      badge: "Trophy Tetap Juara 1, 2, 3",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      icon: User,
    },
  ];

  const renderGroupTable = (group: GroupStageData) => {
    return (
      <div
        key={group.groupId}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
      >
        {/* Table Header Banner */}
        <div className="p-3.5 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-full border border-amber-400/30">
              Babak Penyisihan
            </span>
            <h3 className="text-sm sm:text-lg font-black mt-1 text-white tracking-tight">
              {group.groupName}
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-300 bg-slate-800/80 px-2.5 sm:px-3 py-1 rounded-xl border border-slate-700">
            5 Bidang
          </span>
        </div>

        {/* Standings Table */}
        <div className="overflow-x-auto touch-pan-x">
          <table className="w-full text-left text-xs border-collapse min-w-[340px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 sm:py-3 px-2 sm:px-4 w-7 sm:w-10 text-center">#</th>
                <th className="py-2.5 sm:py-3 px-2 sm:px-4 min-w-[110px]">Bidang / Tim</th>
                <th className="py-2.5 sm:py-3 px-1.5 sm:px-3 text-center whitespace-nowrap">
                  <span className="hidden xs:inline">Match (W-L)</span>
                  <span className="xs:hidden">W-L</span>
                </th>
                <th className="py-2.5 sm:py-3 px-1.5 sm:px-3 text-center whitespace-nowrap">
                  <span className="hidden xs:inline">Racks</span>
                  <span className="xs:hidden">R</span>
                </th>
                <th className="py-2.5 sm:py-3 px-1.5 sm:px-3 text-center whitespace-nowrap">
                  <span className="hidden xs:inline">Diff</span>
                  <span className="xs:hidden">+/-</span>
                </th>
                <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-center font-black text-slate-900">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800 text-[11px] sm:text-xs">
              {group.standings.map((st) => {
                const isPlayed = st.matchesPlayed > 0;
                const isQualified = isPlayed && (st.pos === 1 || st.pos === 2);
                const isEliminated = isPlayed && st.pos > 2;

                const rowBgClass = isQualified
                  ? "bg-emerald-50/80 hover:bg-emerald-100/70"
                  : isEliminated
                  ? "bg-rose-50/70 hover:bg-rose-100/60"
                  : "bg-white hover:bg-slate-50/90";

                return (
                  <tr key={st.teamId} className={`${rowBgClass} transition-colors`}>
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md text-[10px] sm:text-[11px] font-black ${
                          isQualified
                            ? "bg-emerald-600 text-white shadow-2xs"
                            : isEliminated
                            ? "bg-rose-500 text-white shadow-2xs"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {st.pos}
                      </span>
                    </td>
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 font-bold">
                      <span className="text-[11px] sm:text-sm text-slate-400 font-mono font-bold block truncate max-w-[130px] sm:max-w-none">
                        {st.teamName}
                      </span>
                    </td>
                    <td className="py-2.5 sm:py-3.5 px-1.5 sm:px-3 text-center whitespace-nowrap font-mono text-slate-700 text-[11px] sm:text-xs">
                      {st.seriesWon} - {st.seriesLost}
                    </td>
                    <td className="py-2.5 sm:py-3.5 px-1.5 sm:px-3 text-center whitespace-nowrap font-mono text-slate-600 text-[11px] sm:text-xs">
                      {st.racksWon} - {st.racksLost}
                    </td>
                    <td className="py-2.5 sm:py-3.5 px-1.5 sm:px-3 text-center whitespace-nowrap font-mono text-[11px] sm:text-xs">
                      <span
                        className={
                          st.rackDiff > 0
                            ? "text-emerald-600 font-black"
                            : st.rackDiff < 0
                            ? "text-red-600 font-bold"
                            : "text-slate-400"
                        }
                      >
                        {st.rackDiff > 0 ? `+${st.rackDiff}` : st.rackDiff}
                      </span>
                    </td>
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 text-center whitespace-nowrap font-black text-slate-900 text-xs sm:text-sm">
                      {st.points}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-3.5 bg-slate-50/90 border-t border-slate-200/90 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600 font-medium">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300 inline-block shrink-0" />
              <span>
                Hijau muda: <strong>Lolos ke Playoffs (Peringkat 1 &amp; 2)</strong>
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-rose-100 border border-rose-300 inline-block shrink-0" />
              <span>
                Merah muda: <strong>Gugur di Fase Grup (Peringkat 3, 4, 5)</strong>
              </span>
            </span>
          </div>
        </div>

        {/* Head-to-Head Matches List */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-2.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
            Jadwal Pertandingan Head-to-Head (10 Match):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {group.matches.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-xs font-mono font-bold text-slate-400">
                      {m.team1}
                    </span>
                    <span className="font-mono text-xs ml-2 px-2 py-0.5 rounded-md text-slate-400 bg-slate-100 font-bold">
                      {m.score1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="truncate text-xs font-mono font-bold text-slate-400">
                      {m.team2}
                    </span>
                    <span className="font-mono text-xs ml-2 px-2 py-0.5 rounded-md text-slate-400 bg-slate-100 font-bold">
                      {m.score2}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10 w-full min-w-0 max-w-full">
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-200 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
            Group Stage (Babak Penyisihan)
          </h2>
          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200">
            SLOT TBD • MENUNGGU DRAWING TECHNICAL MEETING
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Penyisihan seluruh kategori antar 20 bidang di lingkungan Ganesha Operation. Juara dan Runner-up masing-masing grup (Peringkat 1 &amp; 2) melaju ke Babak 8 Besar (Quarterfinal / Bagan Gugur).
        </p>
      </div>

      {/* Shimmer Skeleton if loading */}
      {isLoading ? (
        <div className="space-y-10">
          {Array.from({ length: 3 }).map((_, cIdx) => (
            <div key={cIdx} className="space-y-4">
              <div className="h-8 w-64 bg-slate-200 rounded-xl animate-pulse" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, gIdx) => (
                  <div
                    key={gIdx}
                    className="h-80 bg-slate-100 rounded-3xl border border-slate-200 animate-pulse p-6"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Sequential Continuous Display for all 3 Categories (Without Tab Bar) */
        <div className="space-y-14">
          {categories.map((cat, catIdx) => {
            const Icon = cat.icon;
            const groups = generateGroupsForCategory(cat.id, cat.title);

            return (
              <section key={cat.id} className="space-y-6">
                {/* Prominent Category Section Title Banner */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                          STAGE {catIdx + 1}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                          {cat.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className={`text-xs font-black uppercase px-3.5 py-1.5 rounded-xl border ${cat.badgeColor} shrink-0 self-start sm:self-auto`}>
                    {cat.badge}
                  </span>
                </div>

                {/* 4 Groups for this Category (Grup A, B, C, D) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {groups.map((group) => renderGroupTable(group))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
};
