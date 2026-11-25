"use client";

import React, { useState } from "react";
import { TableInfo, Match } from "@/types/tournament";
import { TABLES_DATA } from "@/lib/mock-data";
import { Radio, Clock, CheckCircle2, ChevronRight, Swords, Trophy, Users, Sparkles } from "lucide-react";

interface TableMatrixProps {
  onSelectMatch?: (match: Match) => void;
}

export const TableMatrix: React.FC<TableMatrixProps> = ({ onSelectMatch }) => {
  const [filter, setFilter] = useState<"all" | "live" | "available" | "upcoming">("all");

  const tables = TABLES_DATA.filter((t) => {
    if (filter === "all") return true;
    return t.status === filter;
  });

  const liveCount = TABLES_DATA.filter((t) => t.status === "live").length;
  const availableCount = TABLES_DATA.filter((t) => t.status === "available").length;
  const upcomingCount = TABLES_DATA.filter((t) => t.status === "upcoming").length;

  return (
    <div className="space-y-6">
      {/* Top Section Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>Real-time Table Arena Status</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Status 8 Meja Pertandingan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Pantau langsung aktivitas di setiap meja turnamen secara langsung. Menampilkan skor live, jadwal pertandingan berikutnya, dan ketersediaan meja arena.
          </p>
        </div>

        {/* Quick Filter Buttons (Upgraded Luxury Pills) */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "btn-luxury-pearl"
            }`}
          >
            Semua Meja (8)
          </button>
          <button
            onClick={() => setFilter("live")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === "live"
                ? "btn-championship-red"
                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            Live ({liveCount})
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "upcoming"
                ? "btn-luxury-gold"
                : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            Siap Tanding ({upcomingCount})
          </button>
          <button
            onClick={() => setFilter("available")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === "available"
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            Kosong ({availableCount})
          </button>
        </div>
      </div>

      {/* Grid of 8 Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tables.map((table) => {
          const match = table.currentMatch || table.nextMatch;

          return (
            <div
              key={table.tableNumber}
              className={`rounded-3xl border bg-white p-5 shadow-xs transition-all luxury-card flex flex-col justify-between ${
                table.status === "live"
                  ? "border-red-400 ring-2 ring-red-500/15"
                  : table.status === "available"
                  ? "border-emerald-200 bg-emerald-50/15"
                  : "border-slate-200"
              }`}
            >
              <div>
                {/* Table Header Pill */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center justify-center shadow-xs">
                      {table.tableNumber}
                    </span>
                    <div>
                      <h4 className="text-xs font-black text-slate-900">
                        Meja {table.tableNumber}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                        {table.cloth}
                      </p>
                    </div>
                  </div>

                  {table.status === "live" && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      LIVE
                    </span>
                  )}
                  {table.status === "upcoming" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                      <Clock className="w-3 h-3 text-amber-700" />
                      SIAP
                    </span>
                  )}
                  {table.status === "available" && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      KOSONG
                    </span>
                  )}
                </div>

                {/* Match Box inside Table */}
                {match ? (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="font-bold text-slate-700">{match.round_name}</span>
                      <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded-md font-bold text-slate-600">
                        Race to {match.race_to}
                      </span>
                    </div>

                    {/* Player 1 */}
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-black truncate ${
                              match.winner === match.player1_name
                                ? "text-red-700"
                                : "text-slate-800"
                            }`}
                          >
                            {match.player1_name}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600 shrink-0">
                            {match.player1_handicap}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {match.player1_club}
                        </p>
                      </div>
                      <span
                        className={`text-xl font-black font-mono ${
                          table.status === "live"
                            ? "text-red-600"
                            : match.winner === match.player1_name
                            ? "text-amber-600"
                            : "text-slate-400"
                        }`}
                      >
                        {match.score1}
                      </span>
                    </div>

                    {/* Player 2 */}
                    <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-150">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-black truncate ${
                              match.winner === match.player2_name
                                ? "text-red-700"
                                : "text-slate-800"
                            }`}
                          >
                            {match.player2_name}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-600 shrink-0">
                            {match.player2_handicap}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {match.player2_club}
                        </p>
                      </div>
                      <span
                        className={`text-xl font-black font-mono ${
                          table.status === "live"
                            ? "text-red-600"
                            : match.winner === match.player2_name
                            ? "text-amber-600"
                            : "text-slate-400"
                        }`}
                      >
                        {match.score2}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-xs font-medium">
                    Meja siap untuk pertandingan berikutnya
                  </div>
                )}
              </div>

              {/* Table Footer */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                {table.status === "live" ? (
                  <span className="text-red-600 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                    Sedang Bertanding
                  </span>
                ) : match?.winner ? (
                  <span className="text-emerald-700 font-bold">
                    Pemenang: {match.winner}
                  </span>
                ) : (
                  <span>Jadwal: {match?.scheduled_time || "Standby"}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
