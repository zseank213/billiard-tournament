"use client";

import React, { useState, useEffect } from "react";
import { LIQUIPEDIA_PLAYOFFS_DATA } from "@/lib/mock-data";
import { BracketMatchNode, SingleEliminationBracket } from "@/types/tournament";
import { getPlayoffsData } from "@/app/actions/playoffs";
import {
  Trophy,
  Info,
  Calendar,
  Clock,
  MapPin,
  ChevronRight,
  Flame,
  CheckCircle2,
  Table,
  Eye,
  X,
  Sparkles,
  Award,
} from "lucide-react";

export const BracketView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<"ganda-putra" | "single-putra" | "single-putri">("ganda-putra");
  const [activeMatchModal, setActiveMatchModal] = useState<BracketMatchNode | null>(null);
  const [playoffsMap, setPlayoffsMap] = useState<Record<string, SingleEliminationBracket>>(LIQUIPEDIA_PLAYOFFS_DATA);

  useEffect(() => {
    let isMounted = true;
    getPlayoffsData().then((res) => {
      if (isMounted && res.playoffs) {
        setPlayoffsMap((prev) => ({ ...prev, ...res.playoffs }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedCategory]);

  const data = playoffsMap[selectedCategory] || LIQUIPEDIA_PLAYOFFS_DATA[selectedCategory] || LIQUIPEDIA_PLAYOFFS_DATA["ganda-putra"];

  // Render Clean Light Match Card
  const renderCleanMatchCard = (match: BracketMatchNode, isGrandFinal = false) => {
    return (
      <div
        key={match.id}
        onClick={() => setActiveMatchModal(match)}
        className={`w-full max-w-[340px] mx-auto bg-white rounded-2xl border transition-all cursor-pointer shadow-xs hover:shadow-md ${
          isGrandFinal
            ? "border-amber-400 ring-2 ring-amber-400/20 shadow-amber-500/10"
            : "border-slate-200/90 hover:border-red-400"
        }`}
      >
        {/* Match Header */}
        <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-500 gap-2">
          <span className="uppercase tracking-wider font-extrabold leading-tight">
            {match.roundName}
          </span>
          <span className="text-red-700 font-mono font-black shrink-0 px-2 py-0.5 rounded bg-red-50 border border-red-100">
            Race to {match.raceTo || 4}
          </span>
        </div>

        {/* Team 1 Row */}
        <div
          className={`flex items-center justify-between px-3.5 py-2 border-b border-slate-100 transition-colors ${
            match.team1.isWinner
              ? "bg-amber-50/40 text-slate-900 font-black"
              : "text-slate-700 font-medium"
          }`}
        >
          <div className="flex flex-col min-w-0 pr-1 flex-1 justify-center py-0.5">
            <span className="truncate text-xs font-bold text-slate-900 leading-snug">
              {match.team1.name}
            </span>
            {match.team1.playerName && (
              <span className="truncate text-[10px] text-red-600 font-semibold leading-tight mt-0.5">
                {match.team1.playerName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <span
              className={`w-6 text-center font-mono text-sm ${
                match.team1.isWinner
                  ? "text-red-600 font-black"
                  : "text-slate-400 font-semibold"
              }`}
            >
              {match.team1.score !== undefined ? match.team1.score : "-"}
            </span>
            {match.team1.isWinner && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            )}
          </div>
        </div>

        {/* Team 2 Row */}
        <div
          className={`flex items-center justify-between px-3.5 py-2 transition-colors ${
            match.team2.isWinner
              ? "bg-amber-50/40 text-slate-900 font-black"
              : "text-slate-700 font-medium"
          }`}
        >
          <div className="flex flex-col min-w-0 pr-1 flex-1 justify-center py-0.5">
            <span className="truncate text-xs font-bold text-slate-900 leading-snug">
              {match.team2.name}
            </span>
            {match.team2.playerName && (
              <span className="truncate text-[10px] text-red-600 font-semibold leading-tight mt-0.5">
                {match.team2.playerName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <span
              className={`w-6 text-center font-mono text-sm ${
                match.team2.isWinner
                  ? "text-red-600 font-black"
                  : "text-slate-400 font-semibold"
              }`}
            >
              {match.team2.score !== undefined ? match.team2.score : "-"}
            </span>
            {match.team2.isWinner && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full">
      {/* Section Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Playoffs (Bagan Gugur)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Alur langsung dari babak Group Stage ke Perempat Final (8 Besar) hingga Grand Final
            </p>
          </div>
          <span className="self-start sm:self-auto text-[10px] sm:text-xs font-mono font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-200 whitespace-nowrap">
            SINGLE ELIMINATION • KALAH GUGUR
          </span>
        </div>
      </div>

      {/* Prominent Center Category Switcher */}
      <div className="flex justify-center w-full">
        <div className="grid grid-cols-3 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm font-bold shadow-inner w-full max-w-md gap-1">
          <button
            onClick={() => setSelectedCategory("ganda-putra")}
            className={`py-2 sm:py-2.5 rounded-xl transition-all text-center text-xs sm:text-sm ${
              selectedCategory === "ganda-putra"
                ? "bg-red-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Ganda (Campuran)
          </button>
          <button
            onClick={() => setSelectedCategory("single-putra")}
            className={`py-2 sm:py-2.5 rounded-xl transition-all text-center text-xs sm:text-sm ${
              selectedCategory === "single-putra"
                ? "bg-red-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Single Putra
          </button>
          <button
            onClick={() => setSelectedCategory("single-putri")}
            className={`py-2 sm:py-2.5 rounded-xl transition-all text-center text-xs sm:text-sm ${
              selectedCategory === "single-putri"
                ? "bg-red-600 text-white shadow-xs font-black"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Single Putri
          </button>
        </div>
      </div>

      {/* Clean Light Bracket Tree Container */}
      <div className="w-full max-w-full min-w-0 space-y-2">
        {/* Mobile & Tablet Swipe Hint Banner */}
        <div className="lg:hidden flex items-center justify-between px-3.5 py-2.5 bg-amber-50/90 rounded-2xl text-[11px] sm:text-xs font-bold text-amber-900 border border-amber-200 shadow-2xs">
          <span className="flex items-center gap-1.5">
            <span>👉</span>
            <span>Geser bagan ke kanan untuk melihat <strong>Semifinal</strong> &amp; <strong>Grand Final</strong></span>
          </span>
          <span className="font-mono text-[10px] text-red-700 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shrink-0 font-extrabold shadow-2xs">
            SWIPE ➔
          </span>
        </div>

        <div className="w-full max-w-full min-w-0 bg-white p-3 sm:p-8 lg:p-10 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
          <div className="min-w-[1020px] pb-4 space-y-8">
          {/* Column Stage Headers */}
          <div className="grid grid-cols-3 gap-8 text-xs font-black uppercase tracking-wider text-slate-600">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-2xs text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>Perempat Final (8 Besar)</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-2xs text-center flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600" />
              <span>Semifinal (4 Besar)</span>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-red-50 p-3 rounded-2xl border border-amber-300 shadow-2xs text-center flex items-center justify-center gap-2 text-amber-900">
              <Trophy className="w-4 h-4 text-amber-600 fill-amber-500" />
              <span>Grand Final Kejuaraan</span>
            </div>
          </div>

          {/* Tournament Tree Columns */}
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Column 1: Quarterfinals (4 matches) */}
            <div className="space-y-6">
              {data.quarterfinals.map((m) => renderCleanMatchCard(m))}
            </div>

            {/* Column 2: Semifinals (2 matches) */}
            <div className="space-y-28">
              {data.semifinals.map((m) => renderCleanMatchCard(m))}
            </div>

            {/* Column 3: Grand Final & Bronze Match */}
            <div className="flex flex-col items-center justify-center space-y-8">
              {/* Grand Final Card */}
              <div className="w-full max-w-[340px] space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-900 bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-300 shadow-2xs text-center">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Piala Bergilir DirRen {selectedCategory === "ganda-putra" ? "Ganda (Campuran)" : selectedCategory === "single-putra" ? "Single Putra" : "Single Putri"}</span>
                </div>
                {renderCleanMatchCard(data.grandFinal, true)}
              </div>

              {/* Bronze Match (Perebutan Juara 3) */}
              <div className="w-full max-w-[340px] space-y-2 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 text-center">
                  <Award className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Perebutan Juara 3 (Bronze Match)</span>
                </div>
                {renderCleanMatchCard(data.bronzeMatch)}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Match Details Modal (Clean Light Theme) */}
      {activeMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-6 text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-red-600" />
                <h4 className="font-black text-slate-900 text-base">
                  {activeMatchModal.matchTitle}
                </h4>
              </div>
              <button
                onClick={() => setActiveMatchModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-bold text-slate-600">Kategori Tanding:</span>
                <span className="font-black text-red-600 uppercase">{activeMatchModal.category}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <div className="min-w-0 pr-2">
                    <span className="text-sm block">{activeMatchModal.team1.name}</span>
                    {activeMatchModal.team1.playerName && (
                      <span className="text-xs text-red-600 block font-semibold mt-0.5">
                        {activeMatchModal.team1.playerName}
                      </span>
                    )}
                  </div>
                  <span className="font-black text-lg font-mono text-red-600 shrink-0">
                    {activeMatchModal.team1.score}
                  </span>
                </div>
                <div className="h-px bg-slate-200" />
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <div className="min-w-0 pr-2">
                    <span className="text-sm block">{activeMatchModal.team2.name}</span>
                    {activeMatchModal.team2.playerName && (
                      <span className="text-xs text-red-600 block font-semibold mt-0.5">
                        {activeMatchModal.team2.playerName}
                      </span>
                    )}
                  </div>
                  <span className="font-black text-lg font-mono text-red-600 shrink-0">
                    {activeMatchModal.team2.score}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-slate-700 space-y-1">
                <div className="font-black text-amber-900 text-xs">Format: Single Elimination (Kalah Langsung Gugur)</div>
                <p className="text-[11px] text-slate-600">
                  Pemenang pertandingan langsung melaju ke babak berikutnya hingga Grand Final.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveMatchModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
