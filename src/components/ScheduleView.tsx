"use client";

import React, { useState, useMemo } from "react";
import { Match } from "@/types/tournament";
import {
  Search,
  Filter,
  RefreshCw,
  Radio,
  CheckCircle2,
  Clock,
  Swords,
  Trophy,
  Users,
  Building,
  Award,
} from "lucide-react";

interface ScheduleViewProps {
  matches: Match[];
  isLiveSupabase: boolean;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  matches,
  isLiveSupabase,
  onRefresh,
  isRefreshing,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "live" | "upcoming" | "completed">("all");
  const [tableFilter, setTableFilter] = useState<number | "all">("all");
  const [roundFilter, setRoundFilter] = useState<string>("all");

  // Extract unique rounds
  const rounds = useMemo(() => {
    const set = new Set<string>();
    matches.forEach((m) => set.add(m.round_name));
    return Array.from(set);
  }, [matches]);

  // Filter matches based on search, status, table, and round
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (tableFilter !== "all" && m.table_number !== tableFilter) return false;
      if (roundFilter !== "all" && m.round_name !== roundFilter) return false;

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const p1 = m.player1_name.toLowerCase();
        const p2 = m.player2_name.toLowerCase();
        const c1 = (m.player1_club || "").toLowerCase();
        const c2 = (m.player2_club || "").toLowerCase();
        const round = m.round_name.toLowerCase();

        return (
          p1.includes(query) ||
          p2.includes(query) ||
          c1.includes(query) ||
          c2.includes(query) ||
          round.includes(query)
        );
      }

      return true;
    });
  }, [matches, statusFilter, tableFilter, roundFilter, searchQuery]);

  // Extract unique table numbers
  const tableNumbers = useMemo(() => {
    const set = new Set<number>();
    matches.forEach((m) => set.add(m.table_number));
    return Array.from(set).sort((a, b) => a - b);
  }, [matches]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama atlet, divisi/bidang kerja (IT, Akademik, Marketing, dll)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-16 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200 px-2 py-1 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Refresh Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold btn-luxury-pearl disabled:opacity-50"
              title="Perbarui Jadwal Pertandingan"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-red-600" : ""}`} />
              <span>{isRefreshing ? "Memperbarui..." : "Refresh Jadwal"}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-slate-400 font-bold mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                statusFilter === "all"
                  ? "bg-slate-900 text-white shadow-xs font-black"
                  : "btn-luxury-pearl"
              }`}
            >
              Semua ({matches.length})
            </button>
            <button
              onClick={() => setStatusFilter("live")}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                statusFilter === "live"
                  ? "btn-championship-red"
                  : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
              }`}
            >
              <Radio className="w-3 h-3 text-red-600 animate-pulse" />
              Live ({matches.filter((m) => m.status === "live").length})
            </button>
            <button
              onClick={() => setStatusFilter("upcoming")}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                statusFilter === "upcoming"
                  ? "btn-luxury-gold"
                  : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
              }`}
            >
              <Clock className="w-3 h-3" />
              Upcoming ({matches.filter((m) => m.status === "upcoming").length})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                statusFilter === "completed"
                  ? "bg-emerald-600 text-white shadow-xs font-black"
                  : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Selesai ({matches.filter((m) => m.status === "completed").length})
            </button>
          </div>

          {/* Selectors for Table and Round */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roundFilter}
              onChange={(e) => setRoundFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-red-500"
            >
              <option value="all">Semua Babak</option>
              {rounds.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <select
              value={tableFilter}
              onChange={(e) =>
                setTableFilter(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="bg-slate-50 border border-slate-300 text-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-red-500"
            >
              <option value="all">Semua Meja</option>
              {tableNumbers.map((num) => (
                <option key={num} value={num}>
                  Meja {num}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <Swords className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">Tidak ada jadwal pertandingan</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Tidak ada pertandingan yang cocok dengan filter atau kata kunci pencarian Anda.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setTableFilter("all");
              setRoundFilter("all");
            }}
            className="mt-4 px-4 py-2 rounded-xl btn-championship-red text-xs font-bold"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className={`relative overflow-hidden rounded-3xl border bg-white luxury-card flex flex-col justify-between ${
                match.status === "live"
                  ? "border-red-400 ring-2 ring-red-500/15"
                  : match.status === "completed"
                  ? "border-slate-200 bg-slate-50/40"
                  : "border-slate-200"
              }`}
            >
              {/* Header Match Card */}
              <div
                className={`px-5 py-3.5 border-b flex items-center justify-between text-xs ${
                  match.status === "live"
                    ? "bg-red-50/80 border-red-100"
                    : "bg-slate-50 border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-red-600 tracking-wide bg-white px-2.5 py-0.5 rounded-lg border border-red-200 shadow-2xs">
                    MEJA {match.table_number}
                  </span>
                  <span className="text-slate-300 font-bold">•</span>
                  <span className="text-slate-800 font-black">{match.round_name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-mono text-[11px] font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    Race to {match.race_to}
                  </span>

                  {match.status === "live" && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white font-black text-[10px] uppercase tracking-wider animate-pulse shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      LIVE
                    </span>
                  )}
                  {match.status === "upcoming" && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-bold">
                      <Clock className="w-2.5 h-2.5 text-amber-600" />
                      {match.scheduled_time.split(" ")[1] || match.scheduled_time}
                    </span>
                  )}
                  {match.status === "completed" && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      SELESAI
                    </span>
                  )}
                </div>
              </div>

              {/* Match Content (Player 1 vs Player 2) */}
              <div className="p-5 space-y-3">
                {/* Player 1 Card */}
                <div
                  className={`flex items-center justify-between gap-4 p-3 rounded-2xl border transition-all ${
                    match.winner === match.player1_name
                      ? "bg-amber-50/70 border-amber-300"
                      : "bg-slate-50/60 border-slate-150"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        match.winner === match.player1_name
                          ? "bg-amber-400 text-slate-900 shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      {match.winner === match.player1_name ? (
                        <Trophy className="w-4 h-4 text-slate-900" />
                      ) : (
                        "1"
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-sm truncate ${
                            match.winner === match.player1_name
                              ? "text-red-700"
                              : "text-slate-900"
                          }`}
                        >
                          {match.player1_name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                          {match.player1_handicap}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{match.player1_club}</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Player 1 */}
                  <div
                    className={`text-2xl sm:text-3xl font-black font-mono w-12 text-right ${
                      match.status === "live"
                        ? "text-red-600"
                        : match.winner === match.player1_name
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  >
                    {match.score1}
                  </div>
                </div>

                <div className="flex items-center justify-center -my-1">
                  <span className="px-3 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-400 font-black tracking-wider uppercase border border-slate-200">
                    VS
                  </span>
                </div>

                {/* Player 2 Card */}
                <div
                  className={`flex items-center justify-between gap-4 p-3 rounded-2xl border transition-all ${
                    match.winner === match.player2_name
                      ? "bg-amber-50/70 border-amber-300"
                      : "bg-slate-50/60 border-slate-150"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                        match.winner === match.player2_name
                          ? "bg-amber-400 text-slate-900 shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      {match.winner === match.player2_name ? (
                        <Trophy className="w-4 h-4 text-slate-900" />
                      ) : (
                        "2"
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-sm truncate ${
                            match.winner === match.player2_name
                              ? "text-red-700"
                              : "text-slate-900"
                          }`}
                        >
                          {match.player2_name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600">
                          {match.player2_handicap}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate mt-0.5">
                        <Building className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="truncate">{match.player2_club}</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Player 2 */}
                  <div
                    className={`text-2xl sm:text-3xl font-black font-mono w-12 text-right ${
                      match.status === "live"
                        ? "text-red-600"
                        : match.winner === match.player2_name
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  >
                    {match.score2}
                  </div>
                </div>
              </div>

              {/* Match Card Footer */}
              <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Waktu Tanding: {match.scheduled_time}</span>
                {match.winner ? (
                  <span className="text-amber-800 font-black flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                    <Trophy className="w-3 h-3 text-amber-600" />
                    Pemenang: {match.winner}
                  </span>
                ) : match.status === "live" ? (
                  <span className="text-red-600 font-black flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                    Sedang Berlangsung di Meja {match.table_number}
                  </span>
                ) : (
                  <span>Match #{match.match_number}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
