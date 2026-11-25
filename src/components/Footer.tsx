"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, Gift } from "lucide-react";
import { TOURNAMENT_CONFIG } from "@/lib/mock-data";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 sm:mt-24 border-t border-slate-200 bg-white py-10 sm:py-12 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logos and Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 p-1.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0">
                <Image
                  src="/images/logo-it-dept.png"
                  alt="IT DEPT Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-10 h-10 p-1.5 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0">
                <Image
                  src="/images/logo-ganesha-operation.png"
                  alt="Ganesha Operation Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <Link href="/" className="font-black text-slate-900 text-sm tracking-tight block hover:text-red-600 transition-colors">
                TI BILLIARD CUP 2026
              </Link>
              <p className="text-[10px] sm:text-xs text-amber-800 font-extrabold uppercase tracking-wide">
                SPORTIVITAS ANTAR BIDANG • IT DEPT x GANESHA OPERATION
              </p>
            </div>
          </div>

          {/* Quick Route Links & WhatsApp Panitia */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4 text-xs font-bold">
            <Link
              href="/playoffs"
              className="text-slate-600 hover:text-red-600 transition-colors whitespace-nowrap"
            >
              Playoffs (Bracket)
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/prize-pool"
              className="text-slate-600 hover:text-red-600 transition-colors whitespace-nowrap"
            >
              Prize Pool
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/participants"
              className="text-slate-600 hover:text-red-600 transition-colors whitespace-nowrap"
            >
              Participants
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/group-stage"
              className="text-slate-600 hover:text-red-600 transition-colors whitespace-nowrap"
            >
              Group Stage
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/merchandise"
              className="text-slate-600 hover:text-red-600 transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <Gift className="w-3.5 h-3.5 text-red-600" />
              <span>Merchandise</span>
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/regulation"
              className="text-slate-600 hover:text-red-600 transition-colors whitespace-nowrap"
            >
              Regulasi Resmi
            </Link>
            <span className="text-slate-300">•</span>
            <a
              href={`https://wa.me/${TOURNAMENT_CONFIG.contact_wa}?text=Halo%20Panitia%20TI%20Billiard%20Cup%202026`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-all font-black whitespace-nowrap shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp Panitia</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>
            © 2026 TI BILLIARD CUP. Diselenggarakan oleh <strong>IT DEPT</strong> &amp; didukung oleh <strong>Ganesha Operation</strong>.
          </p>
          <p className="font-semibold text-slate-400">
            Official Tournament Portal • Sportivitas Antar Bidang
          </p>
        </div>
      </div>
    </footer>
  );
};

