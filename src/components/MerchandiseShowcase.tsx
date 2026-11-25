"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MERCHANDISE_ITEMS, TOURNAMENT_CONFIG } from "@/lib/mock-data";
import {
  Gift,
  Award,
  Sparkles,
  Ticket,
  Shirt,
  Coffee,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Eye,
  Maximize2,
  X,
  ChevronRight,
} from "lucide-react";

interface MerchandiseShowcaseProps {
  onRegisterClick?: () => void;
}

export const MerchandiseShowcase: React.FC<MerchandiseShowcaseProps> = ({ onRegisterClick }) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  return (
    <div className="space-y-10 w-full min-w-0 max-w-full">
      {/* Top Banner Showcase Card (Directly highlighting Gambar ke-1) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-red-50/25 to-amber-50/35 border border-red-200/90 p-4 sm:p-10 shadow-sm">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-gradient-to-br from-red-500/10 via-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-800 text-xs font-black tracking-wide uppercase border border-red-200">
              <Gift className="w-3.5 h-3.5 text-red-600" />
              <span>Official Swag & Doorprize Collection 2026</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Merchandise Eksklusif &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-rose-600 to-amber-600">
                Voucher Belanja Turnamen
              </span>
            </h2>

            <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
              Didesain khusus untuk para atlet, official, dan supporter turnamen{" "}
              <strong className="text-slate-900 font-bold">TI BILLIARD CUP 2026</strong>. 
              Koleksi resmi bertema merah-putih elegan dengan logo <strong className="text-slate-900 font-bold">IT DEPT</strong> & bola 8 bermahkota, 
              serta <strong className="text-amber-700 font-bold">Voucher Hadiah Juara & Doorprize</strong> senilai Rp 100.000 dan Rp 50.000!
            </p>

            {/* Quick Highlights Podiums */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Official Apparel</div>
                <div className="text-base font-black text-slate-900 mt-0.5">Kaos & Topi</div>
                <div className="text-[11px] text-red-600 font-bold">Bahan Dry-fit & Drill</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Drinkware & Souvenir</div>
                <div className="text-base font-black text-slate-900 mt-0.5">Tumbler & Mug</div>
                <div className="text-[11px] text-amber-600 font-bold">Stainless SUS 304 & Keramik</div>
              </div>
              <div className="xs:col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-red-50 border border-amber-200 shadow-2xs">
                <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Hadiah & Doorprize</div>
                <div className="text-base font-black text-red-600 mt-0.5">Voucher Belanja</div>
                <div className="text-[11px] text-slate-700 font-bold">Rp 100.000 & Rp 50.000</div>
              </div>
            </div>

            <div className="flex flex-col xs:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-2">
              {onRegisterClick ? (
                <button
                  onClick={onRegisterClick}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black btn-championship-red flex items-center justify-center gap-2"
                >
                  <Shirt className="w-4 h-4" />
                  <span>Daftar Atlet Klaim Merchandise</span>
                  <ChevronRight className="w-4 h-4 opacity-80" />
                </button>
              ) : (
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black btn-championship-red flex items-center justify-center gap-2"
                >
                  <Shirt className="w-4 h-4" />
                  <span>Daftar Atlet Klaim Merchandise</span>
                  <ChevronRight className="w-4 h-4 opacity-80" />
                </Link>
              )}
              <a
                href={`https://wa.me/${TOURNAMENT_CONFIG.contact_wa}?text=Halo%20Panitia%20TI%20Billiard%20Cup%202026,%20saya%20ingin%20tanya%20seputar%20Merchandise`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-bold btn-luxury-pearl flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Tanya Panitia</span>
              </a>
            </div>
          </div>

          {/* Right Image Showcase Card (Gambar ke-1) */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              className="relative group cursor-pointer max-w-sm sm:max-w-md w-full"
              onClick={() => setIsPreviewModalOpen(true)}
            >
              <div className="relative rounded-3xl overflow-hidden poster-frame">
                {/* Official Merchandise Image (Gambar ke-1) */}
                <Image
                  src="/images/merchandise-showcase.png"
                  alt="Merchandise TI BILLIARD CUP 2026 Showcase"
                  width={600}
                  height={600}
                  className="w-full h-auto object-cover group-hover:scale-[1.015] transition-transform duration-300"
                  priority
                />

                <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-md text-slate-900 font-black text-xs px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-200">
                    <Maximize2 className="w-4 h-4 text-red-600" />
                    <span>Klik untuk Perbesar Gambar Mockup</span>
                  </div>
                </div>

                <div className="absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-md">
                  Official 3D Mockup 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 7 Detailed Merchandise Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Daftar Koleksi & Spesifikasi Merchandise Resmi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Detail spesifikasi bahan dan kualitas setiap item yang diperlihatkan pada display
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            7 Item Resmi Turnamen
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MERCHANDISE_ITEMS.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-6 luxury-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-red-50 border border-red-200 text-red-700">
                    {item.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-400">{item.category}</span>
                </div>

                <h4 className="text-base font-black text-slate-900 leading-snug">
                  {item.name}
                </h4>

                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-semibold">{item.specs}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Zoom Preview */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md">
          <div className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-red-600" />
                <h4 className="font-black text-slate-900 text-base sm:text-lg">
                  Koleksi Merchandise & Voucher — TI BILLIARD CUP 2026
                </h4>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 max-h-[75vh] overflow-y-auto rounded-2xl flex items-center justify-center bg-slate-50 p-2">
              <Image
                src="/images/merchandise-showcase.png"
                alt="Merchandise TI BILLIARD CUP 2026 Preview"
                width={1000}
                height={1000}
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
