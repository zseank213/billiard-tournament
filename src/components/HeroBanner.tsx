"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TOURNAMENT_CONFIG } from "@/lib/mock-data";
import {
  Trophy,
  MapPin,
  Calendar,
  Users,
  Maximize2,
  X,
  ChevronRight,
  Gift,
  Flame,
  Sparkles,
  Phone,
  TableProperties,
  FileText,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

interface HeroBannerProps {
  onRegisterClick?: () => void;
  onViewBracketClick?: () => void;
  onViewPrizePoolClick?: () => void;
  onViewGroupStageClick?: () => void;
  onViewParticipantsClick?: () => void;
  totalMatches?: number;
  liveMatchesCount?: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  totalMatches = 64,
  liveMatchesCount = 0,
}) => {
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-red-50/20 to-slate-50 border-b border-slate-200/80 py-6 sm:py-12">
      {/* Circuit pattern overlay & subtle glows */}
      <div className="absolute inset-0 circuit-gold-pattern opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-red-500/10 via-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          
          {/* Main Content Column */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">

            {/* Official Tournament Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 border border-red-200 text-red-700 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-2xs">
              <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600 animate-pulse" />
              <span>Turnamen Bola 8 Antar Bidang Ganesha Operation</span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight uppercase leading-tight">
                TI BILLIARD <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">CUP</span> 2026
              </h1>
              <p className="text-xs sm:text-sm font-bold text-amber-700 tracking-wide uppercase mt-1 flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Perebutan Piala Bergilir Direktur Perencanaan</span>
              </p>
            </div>

            {/* Mobile-Only Interactive Poster Spotlight Card */}
            <div
              className="lg:hidden relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white cursor-pointer group active:scale-[0.99] transition-transform"
              onClick={() => setIsBannerModalOpen(true)}
            >
              <div className="relative flex items-center gap-3.5 p-3 sm:p-4">
                <div className="relative w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shrink-0 shadow-md border border-white/20">
                  <Image
                    src="/images/ti-billiard-cup-banner-2026.jpg"
                    alt="Banner TI Billiard Cup 2026"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-amber-400">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Poster Resmi Turnamen</span>
                  </div>
                  <h4 className="text-sm font-black text-white truncate">
                    TI BILLIARD CUP 2026
                  </h4>
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    Mulai 03 Des 2026 • Greenlight Cafe &amp; Billiard Bandung
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 group-hover:text-red-300 pt-0.5">
                    <Maximize2 className="w-3 h-3" />
                    <span>Ketuk untuk perbesar poster</span>
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-white transition-all shrink-0" />
              </div>
            </div>

            {/* Invitation Description */}
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
              Mempererat silaturahmi dan solidaritas antar bidang di lingkungan kerja{" "}
              <strong className="text-red-700 font-bold">Ganesha Operation</strong>, diselenggarakan oleh{" "}
              <strong className="text-slate-900 font-bold">Bidang Teknologi Informasi</strong>.
            </p>

            {/* Unified Schedule & Venue Capsule */}
            <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                    Jadwal Pertandingan
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                    {TOURNAMENT_CONFIG.date_range} ({TOURNAMENT_CONFIG.match_time})
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-2.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                    Lokasi Turnamen
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                    {TOURNAMENT_CONFIG.venue}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    {TOURNAMENT_CONFIG.venue_detail}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Grid (Mobile & Desktop Friendly) */}
            <div className="space-y-2 pt-1">
              {/* Primary Dual Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <Link
                  href="/register"
                  className="p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-black btn-championship-red flex items-center justify-between shadow-md shadow-red-600/20 active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    <span>Daftar Tim Delegasi</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-90" />
                </Link>

                <Link
                  href="/playoffs"
                  className="p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm font-black bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-between shadow-md active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-2.5">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Bagan Gugur (Playoffs)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              </div>

              {/* 3 Secondary Quick Nav Cards */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <Link
                  href="/group-stage"
                  className="p-2.5 sm:p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs flex flex-col items-center text-center gap-1 active:scale-95 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                    <TableProperties className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800">Group Stage</span>
                </Link>

                <Link
                  href="/participants"
                  className="p-2.5 sm:p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs flex flex-col items-center text-center gap-1 active:scale-95 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800">20 Bidang</span>
                </Link>

                <Link
                  href="/prize-pool"
                  className="p-2.5 sm:p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs flex flex-col items-center text-center gap-1 active:scale-95 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Gift className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-slate-800">Prize Pool</span>
                </Link>
              </div>
            </div>

            {/* 4 Micro Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 pt-1">
              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Biaya Registrasi
                </span>
                <div className="text-base sm:text-lg font-black text-red-600 my-0.5">
                  GRATIS
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Semua Bidang GO
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Kategori Tanding
                </span>
                <div className="text-base sm:text-lg font-black text-slate-900 my-0.5">
                  3 Kategori
                </div>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  Ganda Pa, Single Pa &amp; Pi
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Game Turnamen
                </span>
                <div className="text-base sm:text-lg font-black text-slate-900 my-0.5">
                  BOLA 8
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  Official WPA Rules
                </p>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50 to-red-50/40 border border-amber-200/90 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                  Batas Pendaftaran
                </span>
                <div className="text-base sm:text-lg font-black text-slate-900 my-0.5">
                  01 Des 2026
                </div>
                <p className="text-[10px] text-amber-700 font-bold">
                  TM: 02 Des 2026
                </p>
              </div>
            </div>

            {/* Contact Person Panitia (Clean WhatsApp Actions) */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kontak Panitia (WhatsApp):</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://wa.me/${TOURNAMENT_CONFIG.contact_sean}?text=Halo%20Sean%20(Panitia%20TI%20Billiard%20Cup%202026)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <span>Sean - TI</span>
                </a>
                <a
                  href={`https://wa.me/${TOURNAMENT_CONFIG.contact_novi}?text=Halo%20Novi%20(Panitia%20TI%20Billiard%20Cup%202026)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <span>Novi - TI</span>
                </a>
              </div>
            </div>

          </div>

          {/* Right Column: Desktop Official Tournament Poster Frame */}
          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <div
              className="relative group cursor-pointer max-w-sm sm:max-w-md w-full"
              onClick={() => setIsBannerModalOpen(true)}
            >
              <div className="relative rounded-3xl overflow-hidden poster-frame shadow-xl">
                <Image
                  src="/images/ti-billiard-cup-banner-2026.jpg"
                  alt="TI BILLIARD CUP 2026 Official Banner"
                  width={500}
                  height={750}
                  className="w-full h-auto object-cover group-hover:scale-[1.015] transition-transform duration-300"
                  priority
                  unoptimized
                />

                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-md text-slate-900 font-black text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-200 whitespace-nowrap">
                    <Maximize2 className="w-4 h-4 text-red-600" />
                    <span>Perbesar Poster Resmi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Full Resolution Banner Modal */}
      {isBannerModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          onClick={() => setIsBannerModalOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-red-600" />
                <h4 className="font-black text-slate-900 text-sm sm:text-base whitespace-nowrap">
                  Poster Resmi TI BILLIARD CUP 2026
                </h4>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 max-h-[75vh] overflow-y-auto rounded-2xl flex items-center justify-center bg-slate-50 p-2">
              <Image
                src="/images/ti-billiard-cup-banner-2026.jpg"
                alt="Banner TI BILLIARD CUP 2026 Full"
                width={800}
                height={1200}
                className="w-full h-auto object-contain rounded-xl shadow-md"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};