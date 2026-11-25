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
  const [participants, setParticipants] = useState<ParticipantTeam[]>(LIQUIPEDIA_PARTICIPANTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let isMounted = true;
    getParticipantsWithRosters()
      .then((res) => {
        if (isMounted && res.participants && res.participants.length > 0) {
          setParticipants(res.participants);
          setIsLiveSupabase(res.isLiveSupabase);
        }
      })
      .catch((err) => {
        console.warn("Using default participants list:", err);
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
              Participants
            </h2>
            {isLoading ? (
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200 animate-pulse flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
                MEMUAT DATA BIDANG...
              </span>
            ) : (
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                {participants.length} BIDANG TERDAFTAR DI DATABASE
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
              className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-2.5 animate-pulse"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="h-4 bg-slate-200 rounded-md flex-1" />
                <div className="h-4 bg-slate-200 rounded-md w-14 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {filteredTeams.map((team) => {
          const isExpanded = !!expandedTeams[team.id];
          const isHost = team.status === "host";

          return (
            <div
              key={team.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white shadow-2xs ${
                isExpanded
                  ? "border-red-400 ring-1 ring-red-400/20 shadow-xs"
                  : "border-slate-200/90 hover:border-slate-300"
              }`}
            >
              {/* Card Header (Sesuai Gambar ke-5: Tanpa badge shortname, nama bidang lengkap tanpa terpotong) */}
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
                    {isHost ? "Host" : team.status === "registered" ? "Terdaftar" : "Invited"}
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

              {/* Expanded Roster Slots (Bersih & Rapi, Tanpa Badge 'Siap Tanding') */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/80 p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200/60">
                    <span>Roster Atlet Delegasi:</span>
                    <span className="font-mono text-slate-500 font-bold">
                      {team.slots.filter((s) => s.playerName && !s.playerName.includes("TBD") && !s.playerName.includes("Belum Didaftarkan")).length} / {team.slots.length} Atlet
                    </span>
                  </div>

                  {team.slots.map((slot) => {
                    const isFilled =
                      slot.playerName &&
                      !slot.playerName.includes("TBD") &&
                      !slot.playerName.includes("Belum Didaftarkan");

                    // Clean formatted role label
                    const formatRole = () => {
                      if (slot.category === "Ganda Putra") {
                        if (slot.role.includes("Tim 2")) {
                          return slot.role.includes("Pemain 2") ? "Ganda 2 • Pemain 2" : "Ganda 2 • Pemain 1";
                        }
                        return slot.role.includes("Pemain 2") ? "Ganda 1 • Pemain 2" : "Ganda 1 • Pemain 1";
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
              )}
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
