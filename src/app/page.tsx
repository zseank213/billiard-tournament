"use client";

import React, { useState, useEffect, useTransition } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroBanner } from "@/components/HeroBanner";
import { ScheduleView } from "@/components/ScheduleView";
import { RegistrationForm } from "@/components/RegistrationForm";
import { CheckRegistrationModal } from "@/components/CheckRegistrationModal";
import { SupabaseSetupGuide } from "@/components/SupabaseSetupGuide";
import { getMatches } from "@/app/actions/matches";
import { Match, Registration } from "@/types/tournament";
import { INITIAL_MATCHES, TOURNAMENT_CONFIG } from "@/lib/mock-data";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Trophy, Calendar, FileText, CheckCircle2, MessageCircle } from "lucide-react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"schedule" | "register" | "check">("schedule");
  const [matches, setMatches] = useState<Match[]>(INITIAL_MATCHES);
  const [isLiveSupabase, setIsLiveSupabase] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [, startTransition] = useTransition();

  // Load matches from database or seed
  const loadMatches = async () => {
    setIsRefreshing(true);
    try {
      const res = await getMatches();
      setMatches(res.matches);
      setIsLiveSupabase(res.isLiveSupabase);
    } catch (e) {
      console.error("Error loading matches:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const liveMatchesCount = matches.filter((m) => m.status === "live").length;

  const handleRegistrationSuccess = (reg: Registration) => {
    console.log("Registered athlete:", reg);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isSupabaseLive={isLiveSupabase}
          onOpenSupabaseGuide={() => setIsGuideOpen(true)}
        />

        {/* Hero Section */}
        <HeroBanner
          onRegisterClick={() => setActiveTab("register")}
          onViewScheduleClick={() => setActiveTab("schedule")}
          totalMatches={matches.length}
          liveMatchesCount={liveMatchesCount}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick tab switcher pill on mobile */}
          <div className="flex md:hidden items-center justify-center mb-6">
            <div className="inline-flex p-1 rounded-xl bg-zinc-900 border border-zinc-800">
              <button
                onClick={() => setActiveTab("schedule")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeTab === "schedule"
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-400"
                }`}
              >
                Jadwal Pertandingan
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeTab === "register"
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-400"
                }`}
              >
                Pendaftaran (G-Form)
              </button>
              <button
                onClick={() => setActiveTab("check")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  activeTab === "check"
                    ? "bg-emerald-600 text-white"
                    : "text-zinc-400"
                }`}
              >
                Cek Status
              </button>
            </div>
          </div>

          {/* Active Tab View */}
          {activeTab === "schedule" && (
            <ScheduleView
              matches={matches}
              isLiveSupabase={isLiveSupabase}
              onRefresh={loadMatches}
              isRefreshing={isRefreshing}
            />
          )}

          {activeTab === "register" && (
            <RegistrationForm
              onSuccess={handleRegistrationSuccess}
              onGoToSchedule={() => setActiveTab("schedule")}
            />
          )}

          {activeTab === "check" && <CheckRegistrationModal />}
        </main>
      </div>

      {/* Supabase Integration Modal */}
      <SupabaseSetupGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        isConfigured={isLiveSupabase}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-emerald-950/80 bg-zinc-950/80 backdrop-blur-md py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-black font-black text-xs">
                8
              </div>
              <div>
                <span className="font-bold text-white">{TOURNAMENT_CONFIG.name}</span>
                <p className="text-[11px] text-zinc-500">
                  {TOURNAMENT_CONFIG.venue} • {TOURNAMENT_CONFIG.address}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsGuideOpen(true)}
                className="hover:text-emerald-400 transition-colors"
              >
                Koneksi Supabase
              </button>
              <a
                href={`https://wa.me/${TOURNAMENT_CONFIG.contact_wa}?text=Halo%20Panitia%20Billiard%20Championship`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Panitia</span>
              </a>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-900 text-center text-[11px] text-zinc-600">
            © 2026 Billiard Tournament Dashboard. Built with Next.js & Supabase. Ultra-fast performance.
          </div>
        </div>
      </footer>
    </div>
  );
}
