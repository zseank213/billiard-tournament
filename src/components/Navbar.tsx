"use client";

import React from "react";
import { CircleDot, Calendar, FileText, Search, Database, ExternalLink } from "lucide-react";

interface NavbarProps {
  activeTab: "schedule" | "register" | "check";
  setActiveTab: (tab: "schedule" | "register" | "check") => void;
  isSupabaseLive: boolean;
  onOpenSupabaseGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isSupabaseLive,
  onOpenSupabaseGuide,
}) => {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/60 bg-[#080d0a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab("schedule")}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-900 shadow-lg shadow-emerald-900/40 text-white font-extrabold text-lg group-hover:scale-105 transition-transform">
              <span>8</span>
              <div className="absolute inset-0 rounded-full border border-emerald-400/40 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-wider text-white">
                  CUE<span className="text-emerald-400">MASTER</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/30 text-emerald-300">
                  OPEN 2026
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-medium hidden sm:block">
                Tournament Schedule & Registration Dashboard
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab("schedule")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "schedule"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-700/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal</span>
            </button>

            <button
              onClick={() => setActiveTab("register")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "register"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-700/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Pendaftaran</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("check")}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "check"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-700/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Cek Status</span>
              <span className="sm:hidden">Status</span>
            </button>
          </nav>

          {/* Supabase Status Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSupabaseGuide}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-[11px] font-medium border transition-colors ${
                isSupabaseLive
                  ? "bg-emerald-950/80 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60"
                  : "bg-amber-950/50 border-amber-500/40 text-amber-300 hover:bg-amber-900/50"
              }`}
              title="Klik untuk melihat panduan setup Supabase"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isSupabaseLive ? "Supabase: Connected" : "Supabase: Ready to Connect"}
              </span>
              <span className="md:hidden">
                {isSupabaseLive ? "Supabase" : "Demo Mode"}
              </span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
