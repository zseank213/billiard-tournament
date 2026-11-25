"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { OFFICIAL_GRAND_PRIZES } from "@/lib/mock-data";
import {
  Trophy,
  Gift,
  Award,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Flame,
  Users2,
  Gamepad2,
  Coffee,
  Ticket,
} from "lucide-react";

interface PrizePoolViewProps {
  onViewMerchandise?: () => void;
}

export const PrizePoolView: React.FC<PrizePoolViewProps> = ({ onViewMerchandise }) => {
  return (
    <div className="space-y-8 w-full min-w-0 max-w-full">
      {/* Liquipedia Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Prize Pool &amp; Rincian Hadiah
            </h2>
            <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
              LAMPIRAN RESMI TURNAMEN
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Alokasi resmi 3 Piala Bergilir Direktur Perencanaan, hadiah juara, pendukung terbaik, dan games mini
          </p>
        </div>

        {onViewMerchandise ? (
          <button
            onClick={onViewMerchandise}
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200/90 text-amber-900 text-xs font-black flex items-center justify-center gap-2 transition-colors shadow-2xs whitespace-nowrap"
          >
            <Gift className="w-4 h-4 text-amber-600" />
            <span>Showcase Merchandise &amp; Doorprize</span>
            <ChevronRight className="w-4 h-4 text-amber-600" />
          </button>
        ) : (
          <Link
            href="/merchandise"
            className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200/90 text-amber-900 text-xs font-black flex items-center justify-center gap-2 transition-colors shadow-2xs whitespace-nowrap"
          >
            <Gift className="w-4 h-4 text-amber-600" />
            <span>Showcase Merchandise &amp; Doorprize</span>
            <ChevronRight className="w-4 h-4 text-amber-600" />
          </Link>
        )}
      </div>

      {/* 1. Tiga Piala Bergilir Direktur Perencanaan */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-black text-sm uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-amber-600 fill-amber-500" />
          <span>1. Tiga Piala Bergilir Direktur Perencanaan (DirRen)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {OFFICIAL_GRAND_PRIZES.pialaBergilir.map((pb) => (
            <div
              key={pb.id}
              className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border border-amber-300 shadow-xs flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shrink-0 border border-amber-300">
                <Trophy className="w-6 h-6 fill-current" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                  Gelar Bergilir
                </span>
                <h4 className="font-black text-slate-900 text-sm mt-1 leading-snug">
                  {pb.title}
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">Kategori: {pb.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Hadiah Juara Per Kategori (Uang Tunai + Piala Tetap) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-black text-sm uppercase tracking-wider">
          <Award className="w-4 h-4 text-red-600" />
          <span>2. Rincian Hadiah Juara Per Kategori (Uang Tunai + Piala Tetap)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {OFFICIAL_GRAND_PRIZES.categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between"
            >
              <div className="p-4 bg-slate-50 text-slate-900 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-red-700 bg-red-100/80 px-2 py-0.5 rounded border border-red-200">
                    Kategori Lomba
                  </span>
                  <h3 className="text-base font-black mt-1 text-slate-900">
                    Juara {cat.category}
                  </h3>
                </div>
                <span className="text-xs text-slate-500 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200">Bola 8</span>
              </div>

              <div className="p-4 space-y-3 flex-1 text-xs">
                {cat.prizes.map((p, pIdx) => (
                  <div
                    key={pIdx}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                      pIdx === 0
                        ? "bg-amber-50/50 border-amber-200 text-slate-900"
                        : pIdx === 1
                        ? "bg-slate-50 border-slate-200 text-slate-800"
                        : "bg-slate-50/70 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          pIdx === 0
                            ? "bg-amber-400 text-slate-950 font-black shadow-2xs"
                            : pIdx === 1
                            ? "bg-slate-300 text-slate-900"
                            : "bg-amber-700 text-white"
                        }`}
                      >
                        {pIdx + 1}
                      </span>
                      <div>
                        <span className="font-black text-slate-900 block text-xs">
                          {p.rank}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {p.reward}
                        </span>
                      </div>
                    </div>

                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 ${
                        pIdx === 0 ? "text-amber-600" : "text-slate-400"
                      }`}
                    />
                  </div>
                ))}
              </div>

              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 font-semibold flex items-center justify-between">
                <span>Piala Tetap + Uang Tunai</span>
                <span className="text-red-600 font-bold uppercase">{cat.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Hadiah Pendukung Terbaik & Hadiah Games Mini */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hadiah Pendukung Terbaik */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 to-red-50/40 border border-red-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-2xs shrink-0">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded">
                Apresiasi Suporter
              </span>
              <h4 className="font-black text-slate-900 text-base mt-0.5">
                {OFFICIAL_GRAND_PRIZES.pendukungTerbaik.title}
              </h4>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {OFFICIAL_GRAND_PRIZES.pendukungTerbaik.reward}. Berikan dukungan dan yel-yel paling meriah untuk bidang Anda selama turnamen berlangsung!
          </p>
        </div>

        {/* Hadiah Games Mini */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-2xs shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                Lucky Draw &amp; Quiz
              </span>
              <h4 className="font-black text-slate-900 text-base mt-0.5">
                Hadiah Games Mini
              </h4>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-2xs">
            <Image
              src="/images/mini-game-prizes.jpg"
              alt="Hadiah Games Mini Banner"
              width={600}
              height={600}
              className="w-full h-auto object-cover"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            {/* Sulit */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-black text-red-700 text-xs flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-red-600" />
                <span>Kategori Sulit:</span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1 font-medium list-disc list-inside">
                {OFFICIAL_GRAND_PRIZES.gamesMini.sulit.map((item, idx) => (
                  <li key={idx}>{item.name}</li>
                ))}
              </ul>
            </div>

            {/* Gampang */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-black text-amber-700 text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Kategori Gampang:</span>
              </div>
              <ul className="text-[11px] text-slate-600 space-y-1 font-medium list-disc list-inside">
                {OFFICIAL_GRAND_PRIZES.gamesMini.gampang.map((item, idx) => (
                  <li key={idx}>{item.name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
