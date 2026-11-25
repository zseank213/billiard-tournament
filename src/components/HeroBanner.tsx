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
  Award,
  Radio,
  Maximize2,
  X,
  ChevronRight,
  ShieldCheck,
  Gift,
  Flame,
  Sparkles,
  Phone,
  Clock,
  FileCheck2,
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
    <div className="relative overflow-hidden bg-gradient-to-b from-white via-red-50/15 to-slate-50 border-b border-slate-200/80 py-8 sm:py-14">
      {/* Subtle circuit traces in golden tone inspired by Image 2 */}
      <div className="absolute inset-0 circuit-gold-pattern opacity-60 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-red-500/10 via-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Tournament Details & Actions */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">

            {/* Main Headline (STRICTLY 1 SINGLE LINE ON ANY SCREEN SIZE) */}
            <div className="whitespace-nowrap overflow-hidden">
              <h1 className="text-[clamp(1.35rem,4vw,3.25rem)] font-black text-slate-900 tracking-tight uppercase leading-none whitespace-nowrap">
                TI BILLIARD <span className="text-red-600">CUP</span> 2026
              </h1>
              <p className="text-[clamp(0.85rem,2.2vw,1.35rem)] font-black text-amber-700 tracking-wide uppercase mt-2 sm:mt-3 flex items-center gap-2 whitespace-nowrap">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 fill-red-600 shrink-0" />
                <span className="whitespace-nowrap">// TURNAMEN BOLA 8 ANTAR BIDANG //</span>
              </p>
            </div>

            {/* Description matching the invitation letter */}
            <p className="text-xs sm:text-base text-slate-600 max-w-2xl leading-relaxed font-normal">
              Mempererat tali silaturahmi serta meningkatkan solidaritas antar bidang di lingkungan kerja{" "}
              <strong className="text-red-700 font-bold">Ganesha Operation</strong>, diselenggarakan oleh{" "}
              <strong className="text-slate-900 font-bold">Bidang Teknologi Informasi</strong>. Memperebutkan{" "}
              <strong className="text-amber-700 font-bold">Piala Bergilir Direktur Perencanaan</strong>!
            </p>

            {/* Key Info Pills (Wrapped smoothly, no horizontal scroll) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs font-semibold">
                <Calendar className="w-4 h-4 text-red-600 shrink-0" />
                <span>{TOURNAMENT_CONFIG.date_range} ({TOURNAMENT_CONFIG.match_time})</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs font-semibold">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <span>{TOURNAMENT_CONFIG.venue} ({TOURNAMENT_CONFIG.venue_detail})</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200 text-amber-900 shadow-2xs font-bold">
                <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{TOURNAMENT_CONFIG.trophy_title}</span>
              </div>
            </div>

            {/* Liquipedia Style Action Buttons (Strict Single Line per Button) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 pt-1">
              <Link
                href="/playoffs"
                className="w-full xs:w-auto px-5 py-3 sm:px-6 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-black btn-championship-red flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
              >
                <Trophy className="w-4 h-4 opacity-90" />
                <span>Lihat Bagan (Playoffs)</span>
                <ChevronRight className="w-4 h-4 opacity-90" />
              </Link>

              <Link
                href="/prize-pool"
                className="flex-1 xs:flex-initial px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-bold btn-luxury-gold flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Prize Pool</span>
              </Link>

              <Link
                href="/group-stage"
                className="flex-1 xs:flex-initial px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-bold btn-luxury-pearl flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0"
              >
                <Calendar className="w-4 h-4 text-slate-600" />
                <span>Group Stage</span>
              </Link>

              <Link
                href="/participants"
                className="w-full xs:w-auto px-3.5 py-2.5 sm:px-4 sm:py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 shadow-2xs"
              >
                <Users className="w-4 h-4 text-slate-600" />
                <span>Participants (20 Bidang)</span>
              </Link>
            </div>

            {/* 4 Micro Stat Cards (Clean, Roomy, No Text Cutoff) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pt-2">
              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Biaya Registrasi
                </span>
                <div className="text-base sm:text-xl font-black text-red-600 my-0.5">
                  GRATIS
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                  Semua Bidang GO
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Kategori Tanding
                </span>
                <div className="text-base sm:text-xl font-black text-slate-900 my-0.5">
                  3 Kategori
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium leading-tight">
                  Ganda Pa, Single Pa &amp; Pi
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Game Turnamen
                </span>
                <div className="text-base sm:text-xl font-black text-slate-900 my-0.5">
                  BOLA 8
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                  Official 8-Ball Rules
                </p>
              </div>

              <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-red-50/40 border border-amber-200/90 shadow-2xs flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                  Batas Pendaftaran
                </span>
                <div className="text-base sm:text-xl font-black text-slate-900 my-0.5">
                  01 Des 2026
                </div>
                <p className="text-[10px] sm:text-[11px] text-amber-700 font-bold">
                  TM: 02 Des 2026
                </p>
              </div>
            </div>

            {/* Contact Person Pill matching letter (Spacious & Clean) */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <span>Contact Person Panitia:</span>
              </span>
              <div className="flex items-center gap-2 flex-col xs:flex-row w-full sm:w-auto">
                <a
                  href={`https://wa.me/${TOURNAMENT_CONFIG.contact_sean}?text=Halo%20Sean%20(Panitia%20TI%20Billiard%20Cup%202026)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold transition-colors whitespace-nowrap text-center"
                >
                  Sean - TI (085189970998)
                </a>
                <a
                  href={`https://wa.me/${TOURNAMENT_CONFIG.contact_novi}?text=Halo%20Novi%20(Panitia%20TI%20Billiard%20Cup%202026)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-3 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold transition-colors whitespace-nowrap text-center"
                >
                  Novi - TI (085624055869)
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Official Tournament Poster Frame (No 'Banner Resmi' Tag) */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="relative group cursor-pointer max-w-sm sm:max-w-md w-full"
              onClick={() => setIsBannerModalOpen(true)}
            >
              <div className="relative rounded-3xl overflow-hidden poster-frame shadow-xl">
                {/* Official Tournament Banner (Gambar ke-2 Baru dengan Logo G & IT Dept) */}
                <Image
                  src="/images/ti-billiard-cup-banner-2026.jpg"
                  alt="TI BILLIARD CUP 2026 Official Banner"
                  width={500}
                  height={750}
                  className="w-full h-auto object-cover group-hover:scale-[1.015] transition-transform duration-300"
                  priority
                  unoptimized
                />

                {/* Subtle Hover Action Pill */}
                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-md text-slate-900 font-black text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-200 whitespace-nowrap">
                    <Maximize2 className="w-4 h-4 text-red-600" />
                    <span>Perbesar Gambar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Resolution Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-red-600" />
                <h4 className="font-black text-slate-900 text-base whitespace-nowrap">
                  Banner Resmi TI BILLIARD CUP 2026
                </h4>
              </div>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 max-h-[80vh] overflow-y-auto rounded-2xl flex items-center justify-center bg-slate-50 p-2">
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
