"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Menu,
  X,
  Phone,
  Home,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer whenever route changes or Escape is pressed
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleMobileMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMobileMenuOpen((prev) => !prev);
  };

  const navMenuItems = [
    { href: "/playoffs", label: "Playoffs (Bagan Gugur)", icon: GitFork, badge: "8 Besar" },
    { href: "/group-stage", label: "Group Stage (Penyisihan)", icon: TableProperties, badge: "4 Grup" },
    { href: "/participants", label: "Daftar Peserta (Bidang)", icon: Users, badge: "20 Bidang" },
    { href: "/prize-pool", label: "Prize Pool & Hadiah", icon: Trophy, badge: "3 Piala" },
    { href: "/merchandise", label: "Merchandise & Doorprize", icon: Gift, badge: "Voucher" },
    { href: "/regulation", label: "Regulasi Resmi Bola 8", icon: BookOpen, badge: "WPA Rules" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.03)]">
      {/* Top red-gold accent gradient strip */}
      <div className="h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4 flex-nowrap">
          {/* Logo & Brand Identity (Links to Home /) */}
          <Link
            href="/"
            className="flex items-center gap-1.5 sm:gap-3 cursor-pointer group shrink-0 select-none"
          >
            {/* Dual Logos (IT DEPT & Ganesha Operation) */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <div className="relative w-7 h-7 sm:w-11 sm:h-11 rounded-xl bg-white border border-slate-200/90 p-0.5 sm:p-1 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/images/logo-it-dept.png"
                  alt="IT DEPT Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              <span className="text-slate-300 font-bold text-[9px] sm:text-xs shrink-0">×</span>

              <div className="relative w-6.5 h-6.5 sm:w-10 sm:h-10 rounded-xl bg-white border border-slate-200/90 p-0.5 sm:p-1 shadow-2xs flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/images/logo-ganesha-operation.png"
                  alt="Ganesha Operation Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>
            </div>

            {/* Brand Title */}
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
                <span className="font-black text-xs sm:text-base md:text-lg text-slate-900 group-hover:text-red-600 transition-colors tracking-tight whitespace-nowrap">
                  TI BILLIARD <span className="text-red-600">CUP</span>
                </span>
                <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-wider px-1 sm:px-1.5 py-0.5 rounded bg-slate-900 text-white whitespace-nowrap">
                  2026
                </span>
              </div>
              <p className="text-[8px] sm:text-[10px] md:text-[11px] font-extrabold text-amber-700 tracking-wider uppercase mt-0.5 sm:mt-1 whitespace-nowrap">
                <span className="sm:hidden">IT DEPT × GO</span>
                <span className="hidden sm:inline">IT DEPT × GANESHA OPERATION</span>
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Tabs (Dedicated routes) */}
          <nav className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 whitespace-nowrap flex-nowrap shrink-0">
            <Link
              href="/playoffs"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                pathname === "/playoffs"
                  ? "bg-white text-red-600 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GitFork className="w-3.5 h-3.5" />
              <span>Playoffs</span>
            </Link>

            <Link
              href="/group-stage"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                pathname === "/group-stage"
                  ? "bg-white text-red-600 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <TableProperties className="w-3.5 h-3.5" />
              <span>Group Stage</span>
            </Link>

            <Link
              href="/participants"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                pathname === "/participants"
                  ? "bg-white text-red-600 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Participants</span>
            </Link>

            <Link
              href="/prize-pool"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                pathname === "/prize-pool"
                  ? "bg-white text-red-600 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Prize Pool</span>
            </Link>

            <Link
              href="/merchandise"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                pathname === "/merchandise"
                  ? "bg-white text-red-600 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Merchandise</span>
            </Link>

            <Link
              href="/regulation"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                pathname === "/regulation"
                  ? "bg-white text-red-600 shadow-xs font-black"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Regulasi</span>
            </Link>
          </nav>

          {/* Right Action: Desktop & Tablet CTA + Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 whitespace-nowrap">
            {/* Primary Register Button (Responsive sizing across Mobile, Tablet, Desktop) */}
            <Link
              href="/register"
              className="h-9 sm:h-10 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black btn-championship-red flex items-center gap-1.5 shadow-sm shadow-red-600/20"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Daftar Tim</span>
              <span className="xs:hidden">Daftar</span>
              <ChevronRight className="w-3.5 h-3.5 opacity-80 hidden sm:inline" />
            </Link>

            {/* Mobile & Tablet Hamburger Menu Toggle (Visible below lg / 1024px) */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className={`lg:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-150 cursor-pointer touch-manipulation select-none active:scale-95 shadow-xs ${
                isMobileMenuOpen
                  ? "bg-red-600 text-white ring-2 ring-red-400/40 shadow-red-600/30"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
              aria-label={isMobileMenuOpen ? "Tutup Menu Turnamen" : "Buka Menu Turnamen"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6 pointer-events-none" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Dimmed Background Overlay on mobile/tablet when drawer is open */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 top-14 sm:top-20 bg-slate-950/40 backdrop-blur-[2px] z-40 transition-opacity duration-200"
          aria-hidden="true"
        />
      )}

      {/* Modern Responsive Navigation Drawer for Tablet & Mobile (Visible below lg) */}
      {isMobileMenuOpen && (
        <div className="relative lg:hidden z-50 border-t border-slate-200 bg-white/98 backdrop-blur-xl shadow-2xl px-4 sm:px-6 py-4 space-y-3.5 max-h-[calc(100dvh-3.5rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain transition-all duration-200">
          {/* Quick Action Banner on Top of Menu */}
          <Link
            href="/register"
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-600 via-red-600 to-amber-600 text-white text-left shadow-md flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-red-100 tracking-wider block">
                  Pendaftaran Kontingen Resmi (GRATIS)
                </span>
                <span className="text-sm sm:text-base font-black">
                  Formulir Pendaftaran Tim Delegasi
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform shrink-0" />
          </Link>

          {/* Module Navigation Grid (1 col on Mobile, 2 cols on Tablet) */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 block mb-1">
              Modul Utama Kejuaraan:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  pathname === "/"
                    ? "bg-red-50 text-red-700 font-black border border-red-200/80 shadow-2xs"
                    : "text-slate-700 hover:bg-slate-50 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Home className={`w-4 h-4 ${pathname === "/" ? "text-red-600" : "text-slate-500"}`} />
                  <span>Beranda Turnamen</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-slate-100 text-slate-500">
                  Home
                </span>
              </Link>

              {navMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                      isActive
                        ? "bg-red-50 text-red-700 font-black border border-red-200/80 shadow-2xs"
                        : "text-slate-700 hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-red-600" : "text-slate-500"}`} />
                      <span>{item.label}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${
                        isActive
                          ? "bg-red-600 text-white font-bold"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Footer WhatsApp Contact */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1 font-bold text-slate-700">
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span>Panitia:</span>
            </span>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/6285189970998?text=Halo%20Sean%20(Panitia%20TI%20Billiard%20Cup%202026)"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-bold hover:underline"
              >
                Sean
              </a>
              <span>•</span>
              <a
                href="https://wa.me/6285624055869?text=Halo%20Novi%20(Panitia%20TI%20Billiard%20Cup%202026)"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-bold hover:underline"
              >
                Novi
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
