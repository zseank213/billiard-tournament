"use client";

import React from "react";
import { TOURNAMENT_CONFIG } from "@/lib/mock-data";
import { Trophy, MapPin, Calendar, Users, Award, Radio } from "lucide-react";

interface HeroBannerProps {
  onRegisterClick: () => void;
  onViewScheduleClick: () => void;
  totalMatches: number;
  liveMatchesCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onRegisterClick,
  onViewScheduleClick,
  totalMatches,
  liveMatchesCount,
}) => {
  return (
    <div className="relative overflow-hidden border-b border-emerald-950/80 bg-gradient-to-b from-[#0a1510] via-[#09110d] to-[#080c0a] py-8 sm:py-12">
      {/* Decorative Glow Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-emerald-600/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -top-24 right-10 w-64 h-64 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Main Tournament Details */}
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Tournament Schedule & Live Standings
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase leading-tight">
              {TOURNAMENT_CONFIG.name}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-zinc-300">
              {TOURNAMENT_CONFIG.tagline}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-zinc-400">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{TOURNAMENT_CONFIG.date_range}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-300">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{TOURNAMENT_CONFIG.venue}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Total Hadiah: {TOURNAMENT_CONFIG.total_prize}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onRegisterClick}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <span>Daftar Sekarang (G-Form)</span>
              </button>
              <button
                onClick={onViewScheduleClick}
                className="px-5 py-2.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700 border border-zinc-700/80 text-white font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Lihat Jadwal Pertandingan
              </button>
            </div>
          </div>

          {/* Tournament Quick Stats Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-3 lg:w-80">
            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-emerald-950/80 backdrop-blur-sm">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Meja Pertandingan</span>
                <Users className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-white">{TOURNAMENT_CONFIG.total_tables} Meja</div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Rasson Ox Tournament Cloth</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-emerald-950/80 backdrop-blur-sm">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Live On Table</span>
                <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
              </div>
              <div className="text-xl font-black text-emerald-400">{liveMatchesCount} Match</div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Sedang bertanding sekarang</p>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-emerald-950/80 backdrop-blur-sm">
              <div className="flex items-center justify-between text-zinc-400 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Total Match</span>
                <Award className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-xl font-black text-white">{totalMatches} Match</div>
              <p className="text-[10px] text-zinc-500 mt-0.5">Single Elimination System</p>
            </div>

            <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/60 to-zinc-900/90 border border-emerald-500/30 backdrop-blur-sm">
              <div className="flex items-center justify-between text-zinc-300 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider">Biaya Registrasi</span>
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-lg font-black text-emerald-300">{TOURNAMENT_CONFIG.registration_fee}</div>
              <p className="text-[10px] text-emerald-400/80 mt-0.5">Sudah termasuk bola & meja</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
