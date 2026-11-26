"use client";

import React, { useState, useEffect } from "react";
import { getParticipantsWithRosters } from "@/app/actions/bidang";
import { ParticipantTeam } from "@/types/tournament";
import { LIQUIPEDIA_PARTICIPANTS } from "@/lib/mock-data";
import {
  Users,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Sparkles,
  CheckCircle2,
  FolderOpen,
  FolderClosed,
  Database,
} from "lucide-react";

export const ParticipantsView: React.FC = () => {
  const [participants, setParticipants] = useState<ParticipantTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getParticipantsWithRosters()
      .then((res) => {
        if (isMounted) {
          if (res.participants && res.participants.length > 0) {
            setParticipants(res.participants);
            setIsLiveSupabase(res.isLiveSupabase);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Using default participants list:", err);
        if (isMounted) {
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleTeam = (teamId: string) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    participants.forEach((t) => {
      allExpanded[t.id] = true;
    });
    setExpandedTeams(allExpanded);
  };

  const collapseAll = () => {
    setExpandedTeams({});
  };

  const filteredTeams = participants.filter((team) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return team.name.toLowerCase().includes(q) || team.shortName.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Daftar Peserta
            </h2>
            {isLoading ? (
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200 animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
                Memuat data bidang...
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                {participants.length} Bidang Terdaftar
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Daftar tim perwakilan antar bidang di lingkungan kerja Ganesha Operation Pusat
          </p>
        </div>

        {/* Search Input & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama bidang..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-slate-200 shadow-2xs focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors whitespace-nowrap text-center"
            >
              Buka Semua
            </button>
            <button
              onClick={collapseAll}
              className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors whitespace-nowrap text-center"
            >
              Tutup Semua
            </button>
          </div>
        </div>
      </div>

      {/* Shimmer Skeleton Loading State / Liquipedia Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {Array.from({ length: 20 }).map((_, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-200/90 bg-white shadow-2xs space-y-3 animate-pulse"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="h-4 bg-slate-200 rounded-md w-3/5" />
                <div className="h-5 bg-slate-200 rounded-full w-14 shrink-0" />
              </div>
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="h-3 bg-slate-100 rounded w-4/5" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
                <div className="h-3 bg-slate-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredTeams.map((team) => {
          const isExpanded = !!expandedTeams[team.id];
          const isHost = team.status === "host";

          // Calculate exact number of registered athletes (Ganda counts as 2 if both present, 1 if single present)
          let filledAthletesCount = 0;
          team.slots.forEach((s) => {
            if (!s.playerName || s.playerName.includes("Belum Didaftarkan")) return;
            if (s.category === "Ganda Putra") {
              const parts = s.playerName.split("&").map((p) => p.trim());
              parts.forEach((p) => {
                if (p && !p.includes("TBD") && !p.includes("Belum Didaftarkan")) {
                  filledAthletesCount++;
                }
              });
            } else {
              if (!s.playerName.includes("TBD")) {
                filledAthletesCount++;
              }
            }
          });

          return (
            <div
              key={team.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white shadow-2xs ${
                isExpanded
                  ? "border-red-400 ring-1 ring-red-400/20 shadow-xs"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {/* Card Header */}
              <div
                onClick={() => toggleTeam(team.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer select-none hover:bg-slate-50/80 transition-colors"
              >
                <div className="min-w-0 pr-2 flex-1">
                  <span className="font-bold text-slate-900 text-xs sm:text-sm leading-snug block">
                    {team.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                      isHost
                        ? "bg-red-50 text-red-700 border-red-200"
                        : team.status === "registered"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    {isHost
                      ? (filledAthletesCount > 0 ? `Tuan Rumah • ${filledAthletesCount} Atlet` : "Tuan Rumah")
                      : team.status === "registered"
                      ? (filledAthletesCount > 0 ? `Terdaftar • ${filledAthletesCount} Atlet` : "Terdaftar")
                      : "Belum Daftar"}
                  </span>
                  <div className="text-slate-400 hover:text-slate-700 transition-colors">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Player Slots (Bersih, Rapi & Scrollable jika banyak) */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/80 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200/60">
                    <span>Daftar Pemain:</span>
                    <span className="font-mono text-slate-500 font-bold">
                      {filledAthletesCount} Atlet Terdaftar
                    </span>
                  </div>

                  <div className={team.slots.length > 6 ? "max-h-[360px] sm:max-h-[400px] overflow-y-auto pr-1 space-y-2" : "space-y-2"}>
                    {team.slots.map((slot) => {
                      const isFilled =
                        slot.playerName &&
                        !slot.playerName.includes("TBD") &&
                        !slot.playerName.includes("Belum Didaftarkan");

                      // Clean formatted role label
                      const formatRole = () => {
                        if (slot.category === "Ganda Putra") {
                          const matchTim = slot.role.match(/(\d+)/);
                          const timNum = matchTim ? matchTim[1] : "1";
                          return `Ganda ${timNum}`;
                        }
                        if (slot.category === "Single Putra") {
                          const matchPa = slot.role.match(/Atlet (\d+)/);
                          return matchPa ? `Single Putra • Atlet ${matchPa[1]}` : "Single Putra";
                        }
                        if (slot.category === "Single Putri") {
                          const matchPi = slot.role.match(/Atlet (\d+)/);
                          return matchPi ? `Single Putri • Atlet ${matchPi[1]}` : "Single Putri";
                        }
                        return slot.category;
                      };

                      return (
                        <div
                          key={slot.slotNumber}
                          className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                            isFilled
                              ? "bg-white border-slate-200 shadow-2xs"
                              : "bg-slate-50/50 border-dashed border-slate-200"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0 pr-2 flex-1">
                            <span
                              className={`w-6 h-6 rounded-lg text-[10px] font-mono font-bold flex items-center justify-center shrink-0 border ${
                                isFilled
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-slate-100 text-slate-400 border-slate-200"
                              }`}
                            >
                              {slot.slotNumber}
                            </span>
                            <div className="min-w-0 flex-1">
                              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide leading-none mb-1">
                                {formatRole()}
                              </span>
                              <span
                                className={`text-xs sm:text-sm truncate block leading-snug ${
                                  isFilled
                                    ? "font-bold text-slate-900"
                                    : "text-slate-400 italic font-medium"
                                }`}
                              >
                                {slot.playerName}
                              </span>
                            </div>
                          </div>

                          {/* Status Icon Saja (Tanpa Tulisan 'Siap Tanding') */}
                          {isFilled ? (
                            <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded font-mono font-bold shrink-0 border border-slate-200">
                              TBD
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
