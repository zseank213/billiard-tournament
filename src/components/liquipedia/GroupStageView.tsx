"use client";

import React, { useState, useEffect } from "react";
import { ParticipantTeam, GroupStageData, GroupTeamStanding } from "@/types/tournament";
import { getGroupStageDraws } from "@/app/actions/groupStage";
import {
  Trophy,
  TableProperties,
  Users2,
  User,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  AlertCircle,
} from "lucide-react";

interface CategoryStageConfig {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: typeof Trophy;
}

export const STORAGE_KEY_ROULETTE = "ti_billiard_drawn_groups_v3_";

export const GroupStageView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [drawnGroupsMap, setDrawnGroupsMap] = useState<Record<string, GroupStageData[]>>({});

  const categories: CategoryStageConfig[] = [
    {
      id: "ganda-putra",
      title: "Kategori Ganda (Campuran / Bebas)",
      subtitle: "Maksimal 2 Tim / Bidang • Boleh Campuran Putra-Putri, Putra-Putra, Putri-Putri • Piala Bergilir DirRen",
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

  // Fetch saved drawings from Supabase server with localStorage fallback
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getGroupStageDraws()
      .then((res) => {
        if (!isMounted) return;
        const restored: Record<string, GroupStageData[]> = { ...(res.draws || {}) };

        // Fallback to localStorage if any category not yet on server
        if (typeof window !== "undefined") {
          categories.forEach((cat) => {
            if (!restored[cat.id]) {
              try {
                const saved = localStorage.getItem(`${STORAGE_KEY_ROULETTE}${cat.id}`);
                if (saved) {
                  const parsed = JSON.parse(saved);
                  if (Array.isArray(parsed) && parsed.length === 4) {
                    restored[cat.id] = parsed;
                  }
                }
              } catch (e) {
                console.warn("Failed reading saved draw from localStorage:", e);
              }
            }
          });
        }

        setDrawnGroupsMap(restored);
        setIsLoading(false);
      })
      .catch((err) => {
        console.warn("Failed fetching draws from server:", err);
        // Fallback to localStorage on error
        if (typeof window !== "undefined") {
          const restored: Record<string, GroupStageData[]> = {};
          categories.forEach((cat) => {
            try {
              const saved = localStorage.getItem(`${STORAGE_KEY_ROULETTE}${cat.id}`);
              if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length === 4) {
                  restored[cat.id] = parsed;
                }
              }
            } catch (e) {}
          });
          if (isMounted) setDrawnGroupsMap(restored);
        }
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper to generate default 4 groups (A, B, C, D) with TBD slots
  const generateDefaultGroups = (categoryKey: string): GroupStageData[] => {
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

  const renderGroupTable = (group: GroupStageData) => {
    return (
      <div
        key={group.groupId}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col justify-between"
      >
        {/* Table Header Banner */}
        <div className="p-3.5 sm:p-4 bg-slate-50 text-slate-900 flex items-center justify-between border-b border-slate-200">
          <div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full border border-red-200">
              Babak Penyisihan
            </span>
            <h3 className="text-sm sm:text-base font-black mt-1 text-slate-900 tracking-tight">
              {group.groupName}
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs font-bold text-slate-600 bg-white px-2.5 sm:px-3 py-1 rounded-xl border border-slate-200 shadow-2xs">
            {group.standings.length} Tim
          </span>
        </div>

        {/* Standings Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[340px]">
            <thead>
              <tr className="bg-slate-100/70 text-slate-600 text-[10px] font-black uppercase tracking-wider border-b border-slate-200">
                <th className="py-2.5 sm:py-3 px-2 sm:px-4 w-7 sm:w-10 text-center">#</th>
                <th className="py-2.5 sm:py-3 px-2 sm:px-4 min-w-[140px]">Bidang / Tim</th>
                <th className="py-2.5 sm:py-3 px-1.5 sm:px-3 text-center whitespace-nowrap">
                  Menang - Kalah
                </th>
                <th className="py-2.5 sm:py-3 px-1.5 sm:px-3 text-center whitespace-nowrap">
                  Game
                </th>
                <th className="py-2.5 sm:py-3 px-1.5 sm:px-3 text-center whitespace-nowrap">
                  Selisih
                </th>
                <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-center font-black text-slate-900">Poin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-semibold text-slate-800 text-[11px] sm:text-xs">
              {group.standings.map((st) => {
                const isPlayed = st.matchesPlayed > 0;
                const isQualified = isPlayed && (st.pos === 1 || st.pos === 2);
                const isEliminated = isPlayed && st.pos > 2;
                const isTBD = st.teamName === "TBD";

                const rowBgClass = isQualified
                  ? "bg-emerald-50/80 hover:bg-emerald-100/70"
                  : isEliminated
                  ? "bg-rose-50/70 hover:bg-rose-100/60"
                  : "bg-white hover:bg-slate-50/90";

                return (
                  <tr key={st.teamId} className={`${rowBgClass} transition-colors`}>
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] sm:text-[11px] font-black ${
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
                    <td className="py-2.5 sm:py-3.5 px-2 sm:px-4">
                      {isTBD ? (
                        <span className="text-xs text-slate-400 font-mono font-bold block">
                          TBD (Menunggu Hasil Undian)
                        </span>
                      ) : (
                        <div className="min-w-0 pr-1">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 break-words leading-tight">
                            {st.teamName}
                          </p>
                          {st.playerName && (
                            <p className="text-[10px] text-red-700 font-semibold mt-0.5 line-clamp-1 break-words">
                              {st.playerName}
                            </p>
                          )}
                        </div>
                      )}
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
            Jadwal Pertandingan Head-to-Head ({group.matches.length} Match):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {group.matches.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs hover:border-slate-300 transition-colors"
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between">
                    <span className="line-clamp-1 break-words text-xs font-bold text-slate-800">
                      {m.team1}
                    </span>
                    <span className="font-mono text-xs ml-2 px-2 py-0.5 rounded-md text-slate-400 bg-slate-100 font-bold shrink-0">
                      {m.score1}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="line-clamp-1 break-words text-xs font-bold text-slate-800">
                      {m.team2}
                    </span>
                    <span className="font-mono text-xs ml-2 px-2 py-0.5 rounded-md text-slate-400 bg-slate-100 font-bold shrink-0">
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

  const totalDrawn = Object.keys(drawnGroupsMap).length;

  return (
    <div className="space-y-10 w-full min-w-0 max-w-full">
      {/* Top Header Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Babak Grup (Penyisihan)
            </h2>
            {totalDrawn > 0 ? (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{totalDrawn} dari 3 Kategori Terundi</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Menunggu Hasil Undian Roda</span>
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
            Klasemen 4 grup (A, B, C, D) untuk seluruh kategori turnamen. Juara dan runner-up masing-masing grup berhak melaju ke Babak 8 Besar (Playoffs).
          </p>
        </div>
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
        /* Sequential Continuous Display for all 3 Categories */
        <div className="space-y-14">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const hasDrawn = !!drawnGroupsMap[cat.id];
            const groups = drawnGroupsMap[cat.id] || generateDefaultGroups(cat.id);

            return (
              <section key={cat.id} className="space-y-5">
                {/* Prominent Category Section Title Banner */}
                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-red-50/90 via-white to-amber-50/70 text-slate-900 border border-red-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black shadow-sm shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {cat.title}
                        </h3>
                        {hasDrawn ? (
                          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                            ✓ Hasil Undian Roda Tersimpan
                          </span>
                        ) : (
                          <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                            Menunggu Pengundian Resmi
                          </span>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
                    <span className={`text-xs font-black uppercase px-3 py-1.5 rounded-xl border ${cat.badgeColor} shrink-0 shadow-2xs`}>
                      {cat.badge}
                    </span>
                  </div>
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
