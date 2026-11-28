import React, { Suspense } from "react";
import { Metadata } from "next";
import { RouletteView } from "@/components/roulette/RouletteView";

export const metadata: Metadata = {
  title: "Wheel of Names (Roda Undian Grup) — TI BILLIARD CUP 2026",
  description: "Pengundian pembagian grup resmi menggunakan Roda Keberuntungan (Wheel of Names) untuk kategori Ganda Campuran/Bebas, Single Putra, dan Single Putri.",
};

export default function RoulettePage() {
  return (
    <div className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <Suspense
        fallback={
          <div className="p-12 text-center text-slate-400 font-bold animate-pulse">
            Memuat Roda Undian Turnamen...
          </div>
        }
      >
        <RouletteView />
      </Suspense>
    </div>
  );
}
