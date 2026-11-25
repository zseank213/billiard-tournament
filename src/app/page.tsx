import React from "react";
import Link from "next/link";
import { HeroBanner } from "@/components/HeroBanner";
import {
  Trophy,
  Users,
  TableProperties,
  GitFork,
  FileText,
  Search,
  ChevronRight,
  Gift,
  BookOpen,
  Calendar,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Award,
} from "lucide-react";
import { TOURNAMENT_CONFIG } from "@/lib/mock-data";

export default function HomePage() {
  const tournamentModules = [
    {
      title: "Playoffs (Bagan Gugur)",
      description: "Bagan gugur Single Elimination babak 8 Besar hingga Grand Final memperebutkan Piala Bergilir Direktur Perencanaan.",
      href: "/playoffs",
      icon: GitFork,
      badge: "8 Besar",
      badgeColor: "bg-red-50 text-red-700 border-red-200",
      cta: "Buka Bagan Playoffs",
    },
    {
      title: "Group Stage (Penyisihan)",
      description: "Klasemen Babak Penyisihan 4 Grup (A, B, C, D) 20 bidang untuk kategori Ganda Putra, Single Putra, dan Single Putri.",
      href: "/group-stage",
      icon: TableProperties,
      badge: "4 Grup (20 Tim)",
      badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
      cta: "Lihat Klasemen Grup",
    },
    {
      title: "Daftar Peserta (Bidang)",
      description: "Daftar 20 tim perwakilan bidang di lingkungan Ganesha Operation Pusat beserta data atlet delegasi siap tanding.",
      href: "/participants",
      icon: Users,
      badge: "19 Bidang + IT Host",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      cta: "Cek Roster Bidang",
    },
    {
      title: "Prize Pool & Rincian Hadiah",
      description: "Alokasi 3 Piala Bergilir DirRen, uang tunai pembinaan, piala tetap juara 1-3, suporter terbaik, dan mini games.",
      href: "/prize-pool",
      icon: Trophy,
      badge: "3 Piala Bergilir",
      badgeColor: "bg-amber-50 text-amber-900 border-amber-200",
      cta: "Rincian Hadiah Juara",
    },
    {
      title: "Merchandise & Doorprize",
      description: "Koleksi kaos dry-fit, topi drill, tumbler stainless, mug, dan voucher belanja Indomaret Rp 100K & 50K.",
      href: "/merchandise",
      icon: Gift,
      badge: "Voucher Belanja",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      cta: "Lihat Merchandise",
    },
    {
      title: "Regulasi & SK Resmi Bola 8",
      description: "Surat keputusan resmi panitia, sistem pertandingan Bola 8 WPA, toleransi waktu, dan ketentuan WO.",
      href: "/regulation",
      icon: BookOpen,
      badge: "Official WPA",
      badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
      cta: "Baca Aturan Resmi",
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* 1. Hero Section with Official Tournament Poster */}
      <HeroBanner />

      {/* 2. Main Module Hub Section */}
      <section className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center sm:text-left border-b border-slate-200 pb-4">
          <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tight">
              Pusat Modul Kejuaraan
            </h2>
            <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-3 py-0.5 rounded-full border border-red-200">
              6 SCREEN UTAMA
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pilih modul turnamen di bawah ini untuk melihat detail bagan gugur, klasemen, roster bidang, dan rincian hadiah
          </p>
        </div>

        {/* 6 Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {tournamentModules.map((mod) => {
            const Icon = mod.icon;

            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 hover:border-red-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shadow-2xs group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border font-mono ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-red-600 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-red-600 group-hover:text-red-700">
                  <span>{mod.cta}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Fast Action Banner: Pendaftaran & Cek Status */}
      <section className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="space-y-2 text-center lg:text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/20 px-3 py-1 rounded-full border border-amber-400/30 inline-block">
                Pendaftaran Delegasi Bidang Masih Dibuka
              </span>
              <h3 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Daftarkan Kontingen Bidang Anda Sekarang
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Batas pendaftaran resmi hingga <strong>Selasa, 01 Desember 2026</strong>. Technical Meeting diadakan pada <strong>Rabu, 02 Desember 2026</strong>. Biaya keikutsertaan <strong>GRATIS</strong> untuk seluruh bidang di lingkungan Ganesha Operation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <Link
                href="/register"
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black btn-championship-red flex items-center justify-center gap-2 shadow-lg shadow-red-600/30"
              >
                <FileText className="w-4 h-4" />
                <span>Formulir Pendaftaran Tim</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <Link
                href="/playoffs"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center gap-2 transition-colors"
              >
                <GitFork className="w-4 h-4 text-slate-300" />
                <span>Lihat Bagan (Playoffs)</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
