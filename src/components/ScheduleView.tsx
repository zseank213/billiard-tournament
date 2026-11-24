"use client";

import React, { useState, useMemo } from "react";
import { Match } from "@/types/tournament";
import { Search, Filter, RefreshCw, Radio, CheckCircle2, Clock, Swords } from "lucide-react";

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

  // Filter matches based on search, status, and table
  const filteredMatches = useMemo(() => {
    return matches.filter((m) => {
      // Status filter
      if (statusFilter !== "all" && m.status !== statusFilter) return false;

      // Table filter
      if (tableFilter !== "all" && m.table_number !== tableFilter) return false;

      // Search query
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
  }, [matches, statusFilter, tableFilter, searchQuery]);

  // Extract unique table numbers
  const tableNumbers = useMemo(() => {
    const set = new Set<number>();
    matches.forEach((m) => set.add(m.table_number));
    return Array.from(set).sort((a, b) => a - b);
  }, [matches]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-emerald-950/80 backdrop-blur-md shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari pemain, klub, atau babak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-950/80 border border-emerald-950 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Refresh & Supabase indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/60 text-xs font-semibold text-zinc-300 hover:text-white transition-all disabled:opacity-50"
              title="Refresh Jadwal"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 pt-4 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-zinc-500 font-medium mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Status:
            </span>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-zinc-200 text-zinc-900 font-bold"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Semua ({matches.length})
            </button>
            <button
              onClick={() => setStatusFilter("live")}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                statusFilter === "live"
                  ? "bg-red-500/20 text-red-400 border border-red-500/50 font-bold"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              Live ({matches.filter((m) => m.status === "live").length})
            </button>
            <button
              onClick={() => setStatusFilter("upcoming")}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                statusFilter === "upcoming"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Clock className="w-3 h-3" />
              Upcoming ({matches.filter((m) => m.status === "upcoming").length})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                statusFilter === "completed"
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-bold"
                  : "bg-zinc-800/50 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Selesai ({matches.filter((m) => m.status === "completed").length})
            </button>
          </div>

          {/* Table Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-500 font-medium">Meja:</span>
            <select
              value={tableFilter}
              onChange={(e) =>
                setTableFilter(e.target.value === "all" ? "all" : Number(e.target.value))
              }
              className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
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
        <div className="text-center py-16 px-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60">
          <Swords className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Tidak ada jadwal pertandingan</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
            Tidak ada pertandingan yang cocok dengan filter atau kata kunci pencarian Anda.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setTableFilter("all");
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-500"
          >
            Reset Semua Filter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className={`relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                match.status === "live"
                  ? "bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-red-950/20 border-red-500/40 shadow-lg shadow-red-950/20"
                  : match.status === "completed"
                  ? "bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700"
                  : "bg-zinc-900/70 border-emerald-950/80 hover:border-emerald-700/50"
              }`}
            >
              {/* Header Match Card */}
              <div className="px-4 py-3 border-b border-zinc-800/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-emerald-400">
                    MEJA {match.table_number}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-300 font-medium">{match.round_name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-zinc-400 font-mono text-[11px]">
                    Race to {match.race_to}
                  </span>

                  {match.status === "live" && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-950 border border-red-500/60 text-red-400 font-bold text-[10px] uppercase tracking-wider animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      LIVE
                    </span>
                  )}
                  {match.status === "upcoming" && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] font-semibold">
                      <Clock className="w-2.5 h-2.5" />
                      {match.scheduled_time.split(" ")[1] || match.scheduled_time}
                    </span>
                  )}
                  {match.status === "completed" && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      SELESAI
                    </span>
                  )}
                </div>
              </div>

              {/* Match Content (Player 1 vs Player 2) */}
              <div className="p-4 sm:p-5">
                {/* Player 1 */}
                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        match.winner === match.player1_name
                          ? "bg-amber-400 text-black shadow-md shadow-amber-400/30"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      1
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm truncate ${
                            match.winner === match.player1_name
                              ? "text-emerald-300"
                              : "text-white"
                          }`}
                        >
                          {match.player1_name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                          {match.player1_handicap}
                        </span>
                      </div>
                      {match.player1_club && (
                        <p className="text-[11px] text-zinc-400 truncate">
                          {match.player1_club}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Score Player 1 */}
                  <div
                    className={`text-2xl font-black font-mono w-10 text-right ${
                      match.status === "live"
                        ? "text-emerald-400"
                        : match.winner === match.player1_name
                        ? "text-amber-400"
                        : "text-zinc-400"
                    }`}
                  >
                    {match.score1}
                  </div>
                </div>

                <div className="my-1 border-t border-zinc-800/40 relative">
                  <div className="absolute left-1/2 -translate-x-1/2 -top-2 bg-zinc-900 px-2 text-[10px] text-zinc-500 font-bold uppercase">
                    VS
                  </div>
                </div>

                {/* Player 2 */}
                <div className="flex items-center justify-between gap-4 py-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        match.winner === match.player2_name
                          ? "bg-amber-400 text-black shadow-md shadow-amber-400/30"
                          : "bg-zinc-800 text-zinc-300"
                      }`}
                    >
                      2
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold text-sm truncate ${
                            match.winner === match.player2_name
                              ? "text-emerald-300"
                              : "text-white"
                          }`}
                        >
                          {match.player2_name}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
                          {match.player2_handicap}
                        </span>
                      </div>
                      {match.player2_club && (
                        <p className="text-[11px] text-zinc-400 truncate">
                          {match.player2_club}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Score Player 2 */}
                  <div
                    className={`text-2xl font-black font-mono w-10 text-right ${
                      match.status === "live"
                        ? "text-emerald-400"
                        : match.winner === match.player2_name
                        ? "text-amber-400"
                        : "text-zinc-400"
                    }`}
                  >
                    {match.score2}
                  </div>
                </div>

                {/* Match Footer Details */}
                <div className="mt-3 pt-2.5 border-t border-zinc-800/40 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>Jadwal: {match.scheduled_time}</span>
                  {match.winner ? (
                    <span className="text-amber-400 font-semibold flex items-center gap-1">
                      🏆 Pemenang: {match.winner}
                    </span>
                  ) : match.status === "live" ? (
                    <span className="text-red-400 font-semibold animate-pulse">
                      🔴 Live Score Update
                    </span>
                  ) : (
                    <span>Match #{match.match_number}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
