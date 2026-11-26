"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ExternalLink, MapPin, Trophy, Gift, FileText, Users, Calendar, ArrowUpRight } from "lucide-react";
import { TOURNAMENT_CONFIG } from "@/lib/mock-data";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 sm:mt-28 border-t border-slate-200/90 bg-white/95 backdrop-blur-xs text-slate-700">
      {/* Top Subtle Accent Strip */}
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-amber-500 to-red-600 opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Brand & Organization Column (5 cols) */}
          <div className="md:col-span-5 lg:col-span-5 space-y-4">
            {/* Dual Logos Badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 p-2 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo-it-dept.png"
                  alt="IT DEPT Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-11 h-11 p-2 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center shrink-0">
                <Image
                  src="/images/logo-ganesha-operation.png"
                  alt="Ganesha Operation Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="ml-1">
                <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80">
                  Turnamen Resmi 2026
                </span>
              </div>
            </div>

            <div>
              <Link
                href="/"
                className="text-lg font-black text-slate-900 tracking-tight block hover:text-red-600 transition-colors"
              >
                TI BILLIARD CUP 2026
              </Link>
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide mt-0.5">
                Sportivitas Antar Bidang • IT DEPT × Ganesha Operation
              </p>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Wadah silaturahmi, kebersamaan, dan kompetisi sehat antar bidang kerja Ganesha Operation 
              dalam perebutan Piala Bergilir Direktur Perencanaan.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-semibold">
              <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>Greenlight Cafe &amp; Billiard, Bandung</span>
            </div>
          </div>

          {/* Tournament Menu Links (3 cols) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Menu Turnamen
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link
                  href="/playoffs"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors group"
                >
                  <Trophy className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors" />
                  <span>Bagan Gugur (Playoffs)</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/group-stage"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors group"
                >
                  <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors" />
                  <span>Babak Klasemen Grup</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/participants"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors group"
                >
                  <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors" />
                  <span>Daftar Delegasi Bidang</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/prize-pool"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors group"
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Piala &amp; Total Hadiah</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Info & Guidelines (2 cols) */}
          <div className="md:col-span-2 lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Informasi &amp; Aturan
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link
                  href="/regulation"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors group"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors" />
                  <span>Regulasi Resmi Bola 8</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/merchandise"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors group"
                >
                  <Gift className="w-3.5 h-3.5 text-red-500" />
                  <span>Merchandise &amp; Jersey</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors group"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors" />
                  <span>Pendaftaran Delegasi</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* WhatsApp & Community Action Card (2 cols on md, 2 cols on lg) */}
          <div className="md:col-span-2 lg:col-span-2 space-y-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
              Komunitas &amp; Kontak
            </h4>
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-700 block">
                Grup Resmi WhatsApp:
              </span>
              <a
                href={TOURNAMENT_CONFIG.whatsapp_group_link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Grup Peserta</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>

              <div className="pt-1 border-t border-slate-200/70">
                <span className="text-[10px] text-slate-500 block mb-1">
                  Butuh bantuan panitia?
                </span>
                <a
                  href={`https://wa.me/${TOURNAMENT_CONFIG.contact_wa}?text=Halo%20Panitia%20TI%20Billiard%20Cup%202026`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>Chat Panitia (Sean / Novi)</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Line & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>
            &copy; 2026 <strong>TI BILLIARD CUP</strong>. Diselenggarakan oleh <strong>Bidang Teknologi Informasi</strong> &amp; didukung oleh <strong>Ganesha Operation</strong>.
          </p>
          <p className="font-semibold text-slate-400">
            Portal Resmi Turnamen • Sportivitas Antar Bidang
          </p>
        </div>
      </div>
    </footer>
  );
};
