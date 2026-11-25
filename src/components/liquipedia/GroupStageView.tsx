"use client";

import React, { useState, useEffect } from "react";
import { getBidangList, BidangRecord } from "@/app/actions/bidang";
import {
  Trophy,
  Users2,
  User,
  ShieldCheck,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
} from "lucide-react";

interface CategoryStageConfig {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: typeof Trophy;
}

export const GroupStageView: React.FC = () => {
  const [bidangList, setBidangList] = useState<BidangRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getBidangList()
      .then((res) => {
        if (isMounted) {
          if (res.bidang && res.bidang.length > 0) {
            setBidangList(res.bidang);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Using default group stage data:", err);
        if (isMounted) setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const categories: CategoryStageConfig[] = [
    {
      id: "ganda-putra",
      title: "Kategori Ganda Putra",
      subtitle: "Maksimal 2 Tim / Bidang • Perebutan Piala Bergilir Direktur Perencanaan",
      badge: "Piala Bergilir Utama",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      icon: Users2,
    },
    {
      id: "single-putra",
      title: "Kategori Single Putra",
      subtitle: "1 Atlet / Bidang • 20 Atlet Antar Bidang Ganesha Operation",
      badge: "Trophy Juara 1, 2, 3",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      icon: User,
    },
    {
      id: "single-putri",
      title: "Kategori Single Putri",
      subtitle: "1 Atlet / Bidang • 20 Atlet Antar Bidang Ganesha Operation",
      badge: "Trophy Juara 1, 2, 3",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      icon: User,
    },
  ];

  const groupLetters = [
    { letter: "A", title: "Grup A", accent: "border-red-200 bg-red-50/30 text-red-700" },
    { letter: "B", title: "Grup B", accent: "border-blue-200 bg-blue-50/30 text-blue-700" },
    { letter: "C", title: "Grup C", accent: "border-amber-200 bg-amber-50/30 text-amber-700" },
    { letter: "D", title: "Grup D", accent: "border-emerald-200 bg-emerald-50/30 text-emerald-700" },
  ];

  const filteredCategories =
    selectedCategory === "all"
      ? categories
      : categories.filter((c) => c.id === selectedCategory);

  return (
    <div className="space-y-8 w-full min-w-0 max-w-full">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Group Stage (Fase Grup)
            </h2>
            <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-3 py-0.5 rounded-full border border-amber-200">
              Drawing TM: Rabu, 02 Des 2026
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bagan pembagian 4 grup (A, B, C, D) babak penyisihan 20 bidang di lingkungan kerja Ganesha Operation
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === "all"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semua Kategori
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === c.id
                  ? "bg-white text-red-600 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {c.title.replace("Kategori ", "")}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Format & Rules Summary Bar (Light Championship Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Format Kompetisi
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">
              Round Robin (Setengah Kompetisi)
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Tiap grup berisi 5 bidang, bertanding saling bertemu (4 laga per tim).
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Syarat Kelolosan
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">
              Juara &amp; Runner-up (Posisi 1 &amp; 2)
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Peringkat 1 &amp; 2 tiap grup otomatis melaju ke Babak 8 Besar (Quarterfinal).
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Jadwal Tanding
            </span>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 mt-0.5">
              Kamis, 03 Des 2026 (18.00 - 20.00 WIB)
            </h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Bertempat di Greenlight Cafe &amp; Billiard (Samping Mall BEC Bandung).
            </p>
          </div>
        </div>
      </div>

      {/* 3. Shimmer Skeleton Loading State */}
      {isLoading ? (
        <div className="space-y-8">
          {Array.from({ length: 2 }).map((_, cIdx) => (
            <div key={cIdx} className="space-y-4">
              <div className="h-14 bg-white rounded-2xl border border-slate-200 p-4 animate-pulse flex items-center justify-between">
                <div className="h-5 bg-slate-200 rounded w-1/4" />
                <div className="h-5 bg-slate-200 rounded-full w-24" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, gIdx) => (
                  <div
                    key={gIdx}
                    className="p-5 bg-white rounded-2xl border border-slate-200 animate-pulse space-y-3"
                  >
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      {Array.from({ length: 5 }).map((_, rIdx) => (
                        <div key={rIdx} className="h-6 bg-slate-100 rounded w-full" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 4. Category Sections (Clean, Light Theme) */
        <div className="space-y-10">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;

            return (
              <section key={cat.id} className="space-y-4">
                {/* Clean Category Header Banner */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center font-black shadow-xs shrink-0">
                      <Icon className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                        {cat.title}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full border self-start sm:self-auto ${cat.badgeColor}`}
                  >
                    {cat.badge}
                  </span>
                </div>

                {/* 4 Groups Grid (Grup A, B, C, D) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {groupLetters.map((grp) => (
                    <div
                      key={grp.letter}
                      className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors"
                    >
                      {/* Group Header */}
                      <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center border shadow-2xs ${grp.accent}`}
                          >
                            {grp.letter}
                          </span>
                          <span className="font-black text-slate-900 text-sm">
                            {grp.title}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                          5 Bidang
                        </span>
                      </div>

                      {/* 5 Slot Rows */}
                      <div className="p-3 divide-y divide-slate-100 text-xs">
                        {/* Slot 1: Juara Grup (Lolos) */}
                        <div className="py-2.5 px-2 flex items-center justify-between gap-2 bg-emerald-50/40 rounded-xl mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
                              1
                            </span>
                            <span className="font-bold text-slate-800 text-xs truncate">
                              Slot 1 (TBD)
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                            Lolos 8 Besar
                          </span>
                        </div>

                        {/* Slot 2: Runner-up (Lolos) */}
                        <div className="py-2.5 px-2 flex items-center justify-between gap-2 bg-emerald-50/40 rounded-xl mb-1">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-black text-[10px] flex items-center justify-center shrink-0 shadow-2xs">
                              2
                            </span>
                            <span className="font-bold text-slate-800 text-xs truncate">
                              Slot 2 (TBD)
                            </span>
                          </div>
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200 shrink-0">
                            Lolos 8 Besar
                          </span>
                        </div>

                        {/* Slot 3 */}
                        <div className="py-2.5 px-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200">
                              3
                            </span>
                            <span className="font-medium text-slate-500 text-xs truncate">
                              Slot 3 (TBD)
                            </span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">
                            Fase Grup
                          </span>
                        </div>

                        {/* Slot 4 */}
                        <div className="py-2.5 px-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200">
                              4
                            </span>
                            <span className="font-medium text-slate-500 text-xs truncate">
                              Slot 4 (TBD)
                            </span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">
                            Fase Grup
                          </span>
                        </div>

                        {/* Slot 5 */}
                        <div className="py-2.5 px-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200">
                              5
                            </span>
                            <span className="font-medium text-slate-500 text-xs truncate">
                              Slot 5 (TBD)
                            </span>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400">
                            Fase Grup
                          </span>
                        </div>
                      </div>

                      {/* Group Card Footer */}
                      <div className="p-3 bg-slate-50/60 border-t border-slate-100 text-[10px] text-slate-400 font-medium text-center">
                        Pengundian tim di TM (02 Des 2026)
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* 5. Minimal Bottom Legend */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300 inline-block shrink-0" />
            <span>Peringkat 1 &amp; 2: <strong>Lolos ke 8 Besar (Quarterfinal)</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300 inline-block shrink-0" />
            <span>Peringkat 3, 4, 5: <strong>Terhenti di Fase Grup</strong></span>
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          TI BILLIARD CUP 2026 • Ganesha Operation
        </span>
      </div>
    </div>
  );
};
