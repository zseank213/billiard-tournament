"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  TableProperties,
  ShieldCheck,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Sparkles,
  Users2,
  User,
  Flame,
  ArrowRight,
  Clock,
  Layers,
} from "lucide-react";
import { GroupStageData, GroupMatchItem, SingleEliminationBracket, BracketMatchNode } from "@/types/tournament";
import { getGroupStageDraws, saveGroupStageDraw } from "@/app/actions/groupStage";
import { recalculateGroupStandings } from "@/lib/tournament-calc";
import { getPlayoffsData, savePlayoffsData, populatePlayoffsFromGroupStage } from "@/app/actions/playoffs";
import { LIQUIPEDIA_PLAYOFFS_DATA } from "@/lib/mock-data";

const ADMIN_PASSWORD = "@TIBilliardCup2026";
const AUTH_STORAGE_KEY = "ti_billiard_admin_session_auth_v1";

export const LiveReportDashboard: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // Navigation State
  const [activeTab, setActiveTab] = useState<"group-stage" | "playoffs">("group-stage");
  const [selectedCategory, setSelectedCategory] = useState<"ganda-putra" | "single-putra" | "single-putri">("ganda-putra");
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number>(0);

  // Group Stage Data State
  const [allGroupsData, setAllGroupsData] = useState<Record<string, GroupStageData[]>>({});
  const [isGroupLoading, setIsGroupLoading] = useState<boolean>(true);
  const [isSavingGroup, setIsSavingGroup] = useState<boolean>(false);
  const [groupSuccessMsg, setGroupSuccessMsg] = useState<string>("");
  const [groupErrorMsg, setGroupErrorMsg] = useState<string>("");

  // Playoffs Data State
  const [allPlayoffsData, setAllPlayoffsData] = useState<Record<string, SingleEliminationBracket>>(LIQUIPEDIA_PLAYOFFS_DATA);
  const [isPlayoffLoading, setIsPlayoffLoading] = useState<boolean>(true);
  const [isSavingPlayoff, setIsSavingPlayoff] = useState<boolean>(false);
  const [playoffSuccessMsg, setPlayoffSuccessMsg] = useState<string>("");
  const [playoffErrorMsg, setPlayoffErrorMsg] = useState<string>("");

  // Check persistent session on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  // Fetch initial group stage & playoff data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    let isMounted = true;
    setIsGroupLoading(true);
    setIsPlayoffLoading(true);

    getGroupStageDraws()
      .then((res) => {
        if (isMounted && res.draws) {
          setAllGroupsData(res.draws);
        }
        setIsGroupLoading(false);
      })
      .catch(() => {
        if (isMounted) setIsGroupLoading(false);
      });

    getPlayoffsData()
      .then((res) => {
        if (isMounted && res.playoffs) {
          setAllPlayoffsData((prev) => ({ ...prev, ...res.playoffs }));
        }
        setIsPlayoffLoading(false);
      })
      .catch(() => {
        if (isMounted) setIsPlayoffLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem(AUTH_STORAGE_KEY, "true");
        localStorage.setItem(AUTH_STORAGE_KEY, "true");
      }
    } else {
      setAuthError("Password akses salah. Pastikan password sesuai format (@TIBilliardCup2026).");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput("");
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  // ==========================================
  // GROUP STAGE LOGIC
  // ==========================================
  const currentCategoryGroups = allGroupsData[selectedCategory] || [];
  const currentGroup = currentCategoryGroups[selectedGroupIndex] || currentCategoryGroups[0] || null;

  const handleUpdateMatch = (
    matchId: string,
    field: "score1" | "score2" | "status" | "table" | "ballDiff",
    value: any
  ) => {
    if (!currentGroup) return;

    const updatedMatches = currentGroup.matches.map((m) => {
      if (m.id === matchId) {
        const val =
          field === "score1" || field === "score2" || field === "ballDiff"
            ? Math.max(0, parseInt(value, 10) || 0)
            : value;
        const updated = {
          ...m,
          [field]: val,
        };
        // Auto-switch status to completed if score is entered and status was upcoming
        if (
          (field === "score1" || field === "score2") &&
          m.status === "upcoming" &&
          (updated.score1 > 0 || updated.score2 > 0)
        ) {
          updated.status = "completed" as const;
        }
        return updated;
      }
      return m;
    });

    const updatedGroupData: GroupStageData = {
      ...currentGroup,
      matches: updatedMatches,
    };

    // Auto-recalculate standings
    const recalculatedGroup = recalculateGroupStandings(updatedGroupData);

    // Update in local state
    const newCategoryGroups = [...currentCategoryGroups];
    newCategoryGroups[selectedGroupIndex] = recalculatedGroup;

    setAllGroupsData((prev) => ({
      ...prev,
      [selectedCategory]: newCategoryGroups,
    }));
  };

  const handleUpdateStandingRackDiff = (teamId: string, diff: number) => {
    if (!currentGroup) return;
    const updatedStandings = currentGroup.standings.map((st) => {
      if (st.teamId === teamId) {
        return { ...st, rackDiff: diff };
      }
      return st;
    });

    updatedStandings.sort((a, b) => {
      if (a.teamName.includes("TBD")) return 1;
      if (b.teamName.includes("TBD")) return -1;
      if (b.points !== a.points) return b.points - a.points;
      if (b.rackDiff !== a.rackDiff) return b.rackDiff - a.rackDiff;
      return b.racksWon - a.racksWon;
    });

    const finalized = updatedStandings.map((st, idx) => ({
      ...st,
      pos: idx + 1,
      status:
        !st.teamName.includes("TBD") && st.matchesPlayed > 0
          ? idx + 1 <= 2
            ? ("qualified" as const)
            : ("eliminated" as const)
          : null,
    }));

    const newCategoryGroups = [...currentCategoryGroups];
    newCategoryGroups[selectedGroupIndex] = {
      ...currentGroup,
      standings: finalized,
    };

    setAllGroupsData((prev) => ({
      ...prev,
      [selectedCategory]: newCategoryGroups,
    }));
  };

  const handleSaveCurrentGroup = async () => {
    if (currentCategoryGroups.length === 0) return;
    setIsSavingGroup(true);
    setGroupSuccessMsg("");
    setGroupErrorMsg("");

    try {
      const res = await saveGroupStageDraw(selectedCategory, currentCategoryGroups);
      if (res.success) {
        // Automatically sync & update playoffs with any newly qualified teams
        try {
          const playRes = await populatePlayoffsFromGroupStage(selectedCategory);
          if (playRes.success && playRes.bracket) {
            setAllPlayoffsData((prev) => ({
              ...prev,
              [selectedCategory]: playRes.bracket!,
            }));
          }
        } catch {}

        setGroupSuccessMsg(
          res.message || "Data babak grup & klasemen berhasil disimpan! Bagan Playoff juga telah otomatis diperbarui."
        );
        setTimeout(() => setGroupSuccessMsg(""), 4500);
      } else {
        setGroupErrorMsg(res.message || "Gagal menyimpan ke server.");
      }
    } catch (err: any) {
      setGroupErrorMsg(err?.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSavingGroup(false);
    }
  };

  // ==========================================
  // PLAYOFFS LOGIC
  // ==========================================
  const currentPlayoffBracket =
    allPlayoffsData[selectedCategory] ||
    LIQUIPEDIA_PLAYOFFS_DATA[selectedCategory] ||
    LIQUIPEDIA_PLAYOFFS_DATA["ganda-putra"];

  const handleUpdatePlayoffMatch = (
    roundKey: "quarterfinals" | "semifinals" | "grandFinal" | "bronzeMatch",
    matchIndex: number,
    field: string,
    value: any
  ) => {
    const updatedBracket: SingleEliminationBracket = JSON.parse(JSON.stringify(currentPlayoffBracket));

    if (roundKey === "grandFinal" || roundKey === "bronzeMatch") {
      const match = updatedBracket[roundKey];
      if (!match) return;
      if (field === "team1_score") match.team1.score = Math.max(0, parseInt(value, 10) || 0);
      if (field === "team2_score") match.team2.score = Math.max(0, parseInt(value, 10) || 0);
      if (field === "status") match.status = value;
      if (field === "team1_name") match.team1.name = value;
      if (field === "team2_name") match.team2.name = value;
      if (field === "winner") {
        match.team1.isWinner = value === match.team1.name;
        match.team2.isWinner = value === match.team2.name;
      }
    } else {
      const match = updatedBracket[roundKey][matchIndex];
      if (!match) return;
      if (field === "team1_score") match.team1.score = Math.max(0, parseInt(value, 10) || 0);
      if (field === "team2_score") match.team2.score = Math.max(0, parseInt(value, 10) || 0);
      if (field === "status") match.status = value;
      if (field === "team1_name") match.team1.name = value;
      if (field === "team2_name") match.team2.name = value;
      if (field === "winner") {
        match.team1.isWinner = value === match.team1.name;
        match.team2.isWinner = value === match.team2.name;

        // Auto-advance winners if QF
        if (roundKey === "quarterfinals") {
          const winnerTeam = value === match.team1.name ? match.team1 : match.team2;
          // QF0 & QF1 -> SF0
          if (matchIndex === 0 && updatedBracket.semifinals[0]) {
            updatedBracket.semifinals[0].team1 = { ...winnerTeam, score: 0, isWinner: false };
          }
          if (matchIndex === 1 && updatedBracket.semifinals[0]) {
            updatedBracket.semifinals[0].team2 = { ...winnerTeam, score: 0, isWinner: false };
          }
          // QF2 & QF3 -> SF1
          if (matchIndex === 2 && updatedBracket.semifinals[1]) {
            updatedBracket.semifinals[1].team1 = { ...winnerTeam, score: 0, isWinner: false };
          }
          if (matchIndex === 3 && updatedBracket.semifinals[1]) {
            updatedBracket.semifinals[1].team2 = { ...winnerTeam, score: 0, isWinner: false };
          }
        }

        // Auto-advance SF winners to Grand Final & losers to Bronze
        if (roundKey === "semifinals") {
          const winnerTeam = value === match.team1.name ? match.team1 : match.team2;
          const loserTeam = value === match.team1.name ? match.team2 : match.team1;

          if (matchIndex === 0) {
            if (updatedBracket.grandFinal) updatedBracket.grandFinal.team1 = { ...winnerTeam, score: 0, isWinner: false };
            if (updatedBracket.bronzeMatch) updatedBracket.bronzeMatch.team1 = { ...loserTeam, score: 0, isWinner: false };
          }
          if (matchIndex === 1) {
            if (updatedBracket.grandFinal) updatedBracket.grandFinal.team2 = { ...winnerTeam, score: 0, isWinner: false };
            if (updatedBracket.bronzeMatch) updatedBracket.bronzeMatch.team2 = { ...loserTeam, score: 0, isWinner: false };
          }
        }
      }
    }

    setAllPlayoffsData((prev) => ({
      ...prev,
      [selectedCategory]: updatedBracket,
    }));
  };

  const handleSavePlayoffs = async () => {
    setIsSavingPlayoff(true);
    setPlayoffSuccessMsg("");
    setPlayoffErrorMsg("");

    try {
      const res = await savePlayoffsData(selectedCategory, currentPlayoffBracket);
      if (res.success) {
        setPlayoffSuccessMsg(res.message);
        setTimeout(() => setPlayoffSuccessMsg(""), 4500);
      } else {
        setPlayoffErrorMsg(res.message);
      }
    } catch (err: any) {
      setPlayoffErrorMsg(err?.message || "Gagal menyimpan bagan playoff.");
    } finally {
      setIsSavingPlayoff(false);
    }
  };

  const handlePullFromGroupStage = async () => {
    setIsSavingPlayoff(true);
    setPlayoffSuccessMsg("");
    setPlayoffErrorMsg("");

    try {
      const res = await populatePlayoffsFromGroupStage(selectedCategory);
      if (res.success && res.bracket) {
        setAllPlayoffsData((prev) => ({
          ...prev,
          [selectedCategory]: res.bracket!,
        }));
        setPlayoffSuccessMsg(res.message);
        setTimeout(() => setPlayoffSuccessMsg(""), 4500);
      } else {
        setPlayoffErrorMsg(res.message);
      }
    } catch (err: any) {
      setPlayoffErrorMsg(err?.message || "Gagal menarik data dari babak grup.");
    } finally {
      setIsSavingPlayoff(false);
    }
  };

  // ==========================================
  // RENDER: PASSWORD ACCESS GATE (IF NOT AUTH)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-center text-white relative">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-inner">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-black/20 text-red-100 px-3 py-1 rounded-full border border-white/10">
              Official Committee Access Only
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight mt-3">
              Dashboard Live Report
            </h1>
            <p className="text-xs text-red-100/90 mt-1">
              TI BILLIARD CUP 2026 — Ganesha Operation
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Password Akses Panitia
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Masukkan password admin..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm font-mono tracking-wide"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Akses terenkripsi khusus Wasit Meja &amp; Tim Penyelenggara Turnamen.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-[0.99] text-white text-sm font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Buka Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER: MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="space-y-6 w-full min-w-0 max-w-full pb-16">
      {/* Top Bar Header */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">
              Dashboard Live Report &amp; Skor
            </h1>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Supabase Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pengisian live score babak penyisihan fase grup &amp; bagan gugur perempat final hingga grand final.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleLogout}
            className="px-3.5 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 text-xs font-bold rounded-xl transition-colors border border-slate-200 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Kunci / Logout</span>
          </button>
        </div>
      </div>

      {/* Primary Stage Navigation Tabs */}
      <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 shadow-inner gap-1.5">
        <button
          onClick={() => setActiveTab("group-stage")}
          className={`py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === "group-stage"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <TableProperties className="w-4 h-4 text-red-600" />
          <span>Babak Grup (Group Stage)</span>
        </button>

        <button
          onClick={() => setActiveTab("playoffs")}
          className={`py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            activeTab === "playoffs"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Babak Gugur (Playoffs)</span>
        </button>
      </div>

      {/* Category Selector Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            Kategori:
          </span>
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedCategory("ganda-putra")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "ganda-putra"
                  ? "bg-red-600 text-white font-black shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Ganda (Campuran)
            </button>
            <button
              onClick={() => setSelectedCategory("single-putra")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "single-putra"
                  ? "bg-red-600 text-white font-black shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Single Putra
            </button>
            <button
              onClick={() => setSelectedCategory("single-putri")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "single-putri"
                  ? "bg-red-600 text-white font-black shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Single Putri
            </button>
          </div>
        </div>

        {activeTab === "group-stage" && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Grup:
            </span>
            {["Grup A", "Grup B", "Grup C", "Grup D"].map((grp, gIdx) => (
              <button
                key={grp}
                onClick={() => setSelectedGroupIndex(gIdx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedGroupIndex === gIdx
                    ? "bg-slate-900 text-white font-black shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {grp}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TAB 1: GROUP STAGE LIVE REPORT */}
      {/* ======================================================== */}
      {activeTab === "group-stage" && (
        <div className="space-y-6">
          {isGroupLoading ? (
            <div className="p-12 text-center text-slate-400 font-bold bg-white rounded-3xl border border-slate-200 animate-pulse">
              Memuat data babak penyisihan grup...
            </div>
          ) : !currentGroup ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-sm font-bold text-slate-600">
                Data undian untuk kategori ini belum dibuat.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Silakan lakukan pengundian di halaman /roulette terlebih dahulu.
              </p>
            </div>
          ) : (
            <>
              {/* Standings Live Preview Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TableProperties className="w-4 h-4 text-slate-600" />
                    <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900">
                      {currentGroup.groupName} — Klasemen Terhitung Otomatis
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    5 Tim Peserta
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100/70 text-slate-600 text-[10px] uppercase font-black tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-10">#</th>
                        <th className="py-2.5 px-3">Bidang / Tim</th>
                        <th className="py-2.5 px-3 text-center">Main</th>
                        <th className="py-2.5 px-3 text-center">M - K</th>
                        <th className="py-2.5 px-3 text-center">Game</th>
                        <th className="py-2.5 px-3 text-center">Selisih Bola</th>
                        <th className="py-2.5 px-3 text-center font-extrabold text-slate-900">Poin</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {currentGroup.standings.map((st) => (
                        <tr
                          key={st.teamId}
                          className={
                            st.pos <= 2
                              ? "bg-emerald-50/40 hover:bg-emerald-50/70"
                              : "hover:bg-slate-50/80"
                          }
                        >
                          <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">
                            {st.pos}
                          </td>
                          <td className="py-2 px-3">
                            <span className="font-bold text-slate-900 block">
                              {st.teamName}
                            </span>
                            {st.playerName && (
                              <span className="text-[10px] text-slate-400 block">
                                {st.playerName}
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-center font-mono">{st.matchesPlayed}</td>
                          <td className="py-2 px-3 text-center font-mono">
                            {st.seriesWon} - {st.seriesLost}
                          </td>
                          <td className="py-2 px-3 text-center font-mono">
                            {st.racksWon} - {st.racksLost}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <input
                              type="number"
                              value={st.rackDiff}
                              onChange={(e) =>
                                handleUpdateStandingRackDiff(st.teamId, parseInt(e.target.value, 10) || 0)
                              }
                              title="Selisih sisa bola total (dapat diedit manual)"
                              className={`w-14 px-1 py-0.5 text-center font-mono font-bold text-xs rounded-md border ${
                                st.rackDiff > 0
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                  : st.rackDiff < 0
                                  ? "bg-rose-50 text-rose-800 border-rose-300"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                              }`}
                            />
                          </td>
                          <td className="py-2 px-3 text-center font-mono font-black text-slate-900 text-sm">
                            {st.points}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                st.pos <= 2
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-slate-100 text-slate-500 border-slate-200"
                              }`}
                            >
                              {st.pos <= 2 ? "Lolos 8 Besar" : "Gugur"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Head-to-Head 10 Matches Input List */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                      Input Live Skor Pertandingan (10 Match)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Ubah skor dan status pertandingan. Klasemen di atas akan terhitung secara otomatis.
                    </p>
                  </div>

                  <button
                    onClick={handleSaveCurrentGroup}
                    disabled={isSavingGroup}
                    className="px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5 shrink-0"
                  >
                    {isSavingGroup ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Simpan Klasemen &amp; Skor</span>
                  </button>
                </div>

                <div className="flex items-start sm:items-center gap-2.5 p-3.5 bg-blue-50/90 border border-blue-200 rounded-2xl text-xs text-blue-900">
                  <span className="font-black px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] uppercase tracking-wider shrink-0 mt-0.5 sm:mt-0">
                    Input Selisih Bola
                  </span>
                  <span>
                    Catat <strong>Selisih Sisa Bola</strong> (berapa bola lawan yang masih tersisa di meja saat laga usai) pada kotak di tiap kartu match. Sistem otomatis menghitung (+) untuk pemenang dan (-) untuk yang kalah. Anda juga bisa mengoreksi langsung total Selisih Bola pada kolom tabel klasemen di atas!
                  </span>
                </div>

                {groupSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{groupSuccessMsg}</span>
                  </div>
                )}
                {groupErrorMsg && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{groupErrorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {currentGroup.matches.map((m, mIdx) => {
                    const isLive = m.status === "live";
                    const isCompleted = m.status === "completed";

                    return (
                      <div
                        key={m.id}
                        className={`p-3.5 rounded-2xl border transition-all ${
                          isLive
                            ? "bg-amber-50/50 border-amber-300 ring-1 ring-amber-300/40"
                            : isCompleted
                            ? "bg-white border-slate-200 shadow-2xs"
                            : "bg-slate-50/60 border-slate-200/80"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                          <span>Match #{mIdx + 1}</span>
                          <div className="flex items-center gap-2">
                            {/* Table Selector */}
                            <select
                              value={m.table || 1}
                              onChange={(e) =>
                                handleUpdateMatch(m.id, "table", parseInt(e.target.value, 10))
                              }
                              className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-bold focus:outline-none"
                            >
                              <option value={1}>Meja 1</option>
                              <option value={2}>Meja 2</option>
                              <option value={3}>Meja 3</option>
                              <option value={4}>Meja 4</option>
                              <option value={5}>Meja 5</option>
                              <option value={6}>Meja 6</option>
                            </select>

                            {/* Status Selector */}
                            <select
                              value={m.status || "upcoming"}
                              onChange={(e) => handleUpdateMatch(m.id, "status", e.target.value)}
                              className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border focus:outline-none ${
                                isLive
                                  ? "bg-amber-100 text-amber-900 border-amber-300"
                                  : isCompleted
                                  ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                                  : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              <option value="upcoming">Upcoming</option>
                              <option value="live">Sedang Main (LIVE)</option>
                              <option value="completed">Selesai (Final)</option>
                            </select>
                          </div>
                        </div>

                        {/* Team 1 vs Team 2 Score Inputs */}
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pt-1">
                          {/* Team 1 */}
                          <div className="min-w-0 pr-1">
                            <span className="font-bold text-xs text-slate-900 block truncate leading-snug">
                              {m.team1}
                            </span>
                          </div>

                          {/* Score Inputs */}
                          <div className="flex items-center gap-1.5 shrink-0 px-2 py-1 bg-slate-100 rounded-xl border border-slate-200">
                            <input
                              type="number"
                              min={0}
                              max={9}
                              value={m.score1}
                              onChange={(e) => handleUpdateMatch(m.id, "score1", e.target.value)}
                              className="w-8 h-8 text-center font-mono font-black text-sm bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-red-500"
                            />
                            <span className="font-bold text-slate-400 text-xs">-</span>
                            <input
                              type="number"
                              min={0}
                              max={9}
                              value={m.score2}
                              onChange={(e) => handleUpdateMatch(m.id, "score2", e.target.value)}
                              className="w-8 h-8 text-center font-mono font-black text-sm bg-white rounded-lg border border-slate-200 focus:outline-none focus:border-red-500"
                            />
                          </div>

                          {/* Team 2 */}
                          <div className="min-w-0 pl-1 text-right">
                            <span className="font-bold text-xs text-slate-900 block truncate leading-snug">
                              {m.team2}
                            </span>
                          </div>
                        </div>

                        {/* Selisih Sisa Bola Lawan Input */}
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                              Selisih Sisa Bola:
                            </span>
                            <span className="text-[10px] text-slate-400">
                              (sisa bola lawan di meja)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400">±</span>
                            <input
                              type="number"
                              min={0}
                              max={15}
                              value={m.ballDiff ?? 0}
                              onChange={(e) =>
                                handleUpdateMatch(m.id, "ballDiff", e.target.value)
                              }
                              placeholder="0"
                              title="Jumlah bola lawan yang masih tersisa di meja"
                              className="w-12 h-6 text-center font-mono font-bold text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:border-red-500 focus:bg-white"
                            />
                            <span className="text-[10px] font-bold text-slate-500">bola</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: PLAYOFFS LIVE REPORT */}
      {/* ======================================================== */}
      {activeTab === "playoffs" && (
        <div className="space-y-6">
          {/* Action Header Card */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
                Bagan Babak Gugur (Playoffs 8 Besar)
              </h3>
              <p className="text-xs text-slate-500">
                Isi skor babak perempat final, semifinal, dan grand final. Pemenang otomatis maju ke babak selanjutnya.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handlePullFromGroupStage}
                disabled={isSavingPlayoff}
                className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200 flex items-center gap-1.5"
                title="Mengisi 1A vs 2B, 1C vs 2D, 1B vs 2A, 1D vs 2C dari hasil klasemen"
              >
                <Layers className="w-3.5 h-3.5 text-red-600" />
                <span>Tarik Tim dari Klasemen Grup</span>
              </button>

              <button
                onClick={handleSavePlayoffs}
                disabled={isSavingPlayoff}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
              >
                {isSavingPlayoff ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                <span>Simpan Bagan Playoffs</span>
              </button>
            </div>
          </div>

          {playoffSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{playoffSuccessMsg}</span>
            </div>
          )}
          {playoffErrorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{playoffErrorMsg}</span>
            </div>
          )}

          {/* Section 1: Quarterfinals (8 Besar) */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900">
                1. Perempat Final (8 Besar — Race to 4)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPlayoffBracket.quarterfinals.map((m, idx) => (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span>{m.roundName}</span>
                    <select
                      value={m.status || "upcoming"}
                      onChange={(e) => handleUpdatePlayoffMatch("quarterfinals", idx, "status", e.target.value)}
                      className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border bg-white border-slate-200 focus:outline-none"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">LIVE</option>
                      <option value="completed">Selesai</option>
                    </select>
                  </div>

                  {/* Team 1 Row */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={m.team1.name}
                        onChange={(e) => handleUpdatePlayoffMatch("quarterfinals", idx, "team1_name", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                        placeholder="Nama Tim 1"
                      />
                      {m.team1.playerName && (
                        <span className="text-[10px] text-red-600 font-semibold block px-1 truncate mt-0.5">
                          Atlet: {m.team1.playerName}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={9}
                      value={m.team1.score}
                      onChange={(e) => handleUpdatePlayoffMatch("quarterfinals", idx, "team1_score", e.target.value)}
                      className="w-10 h-8 text-center font-mono font-black text-sm rounded-lg border border-slate-200 bg-white shrink-0"
                    />
                  </div>

                  {/* Team 2 Row */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={m.team2.name}
                        onChange={(e) => handleUpdatePlayoffMatch("quarterfinals", idx, "team2_name", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                        placeholder="Nama Tim 2"
                      />
                      {m.team2.playerName && (
                        <span className="text-[10px] text-red-600 font-semibold block px-1 truncate mt-0.5">
                          Atlet: {m.team2.playerName}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={9}
                      value={m.team2.score}
                      onChange={(e) => handleUpdatePlayoffMatch("quarterfinals", idx, "team2_score", e.target.value)}
                      className="w-10 h-8 text-center font-mono font-black text-sm rounded-lg border border-slate-200 bg-white shrink-0"
                    />
                  </div>

                  {/* Winner Selector */}
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">Pemenang (Maju ke SF):</span>
                    <select
                      value={m.team1.isWinner ? m.team1.name : m.team2.isWinner ? m.team2.name : ""}
                      onChange={(e) => handleUpdatePlayoffMatch("quarterfinals", idx, "winner", e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800"
                    >
                      <option value="">Belum Ada Pemenang</option>
                      <option value={m.team1.name}>{m.team1.name}</option>
                      <option value={m.team2.name}>{m.team2.name}</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Semifinals (4 Besar) */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-900">
                2. Semifinal (4 Besar — Race to 4)
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentPlayoffBracket.semifinals.map((m, idx) => (
                <div key={m.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                    <span>{m.roundName}</span>
                    <select
                      value={m.status || "upcoming"}
                      onChange={(e) => handleUpdatePlayoffMatch("semifinals", idx, "status", e.target.value)}
                      className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border bg-white border-slate-200 focus:outline-none"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="live">LIVE</option>
                      <option value="completed">Selesai</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={m.team1.name}
                        onChange={(e) => handleUpdatePlayoffMatch("semifinals", idx, "team1_name", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                        placeholder="Nama Tim 1"
                      />
                      {m.team1.playerName && (
                        <span className="text-[10px] text-red-600 font-semibold block px-1 truncate mt-0.5">
                          Atlet: {m.team1.playerName}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={9}
                      value={m.team1.score}
                      onChange={(e) => handleUpdatePlayoffMatch("semifinals", idx, "team1_score", e.target.value)}
                      className="w-10 h-8 text-center font-mono font-black text-sm rounded-lg border border-slate-200 bg-white shrink-0"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={m.team2.name}
                        onChange={(e) => handleUpdatePlayoffMatch("semifinals", idx, "team2_name", e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                        placeholder="Nama Tim 2"
                      />
                      {m.team2.playerName && (
                        <span className="text-[10px] text-red-600 font-semibold block px-1 truncate mt-0.5">
                          Atlet: {m.team2.playerName}
                        </span>
                      )}
                    </div>
                    <input
                      type="number"
                      min={0}
                      max={9}
                      value={m.team2.score}
                      onChange={(e) => handleUpdatePlayoffMatch("semifinals", idx, "team2_score", e.target.value)}
                      className="w-10 h-8 text-center font-mono font-black text-sm rounded-lg border border-slate-200 bg-white shrink-0"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-500 text-[10px] uppercase">Pemenang (Maju ke Final):</span>
                    <select
                      value={m.team1.isWinner ? m.team1.name : m.team2.isWinner ? m.team2.name : ""}
                      onChange={(e) => handleUpdatePlayoffMatch("semifinals", idx, "winner", e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800"
                    >
                      <option value="">Belum Ada Pemenang</option>
                      <option value={m.team1.name}>{m.team1.name}</option>
                      <option value={m.team2.name}>{m.team2.name}</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Grand Final & Bronze Match */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Grand Final */}
            <div className="bg-gradient-to-b from-amber-50/70 to-white p-4 sm:p-6 rounded-3xl border border-amber-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-600 fill-amber-500" />
                  <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider text-amber-950">
                    Grand Final Kejuaraan (Race to 5)
                  </h4>
                </div>
                <select
                  value={currentPlayoffBracket.grandFinal.status || "upcoming"}
                  onChange={(e) => handleUpdatePlayoffMatch("grandFinal", 0, "status", e.target.value)}
                  className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border bg-white border-amber-300"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">LIVE</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={currentPlayoffBracket.grandFinal.team1.name}
                      onChange={(e) => handleUpdatePlayoffMatch("grandFinal", 0, "team1_name", e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-amber-200 bg-white"
                      placeholder="Finalis 1"
                    />
                    {currentPlayoffBracket.grandFinal.team1.playerName && (
                      <span className="text-[10px] text-amber-900 font-semibold block px-1 truncate mt-0.5">
                        Atlet: {currentPlayoffBracket.grandFinal.team1.playerName}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={9}
                    value={currentPlayoffBracket.grandFinal.team1.score}
                    onChange={(e) => handleUpdatePlayoffMatch("grandFinal", 0, "team1_score", e.target.value)}
                    className="w-12 h-9 text-center font-mono font-black text-sm rounded-xl border border-amber-200 bg-white shrink-0"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={currentPlayoffBracket.grandFinal.team2.name}
                      onChange={(e) => handleUpdatePlayoffMatch("grandFinal", 0, "team2_name", e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-amber-200 bg-white"
                      placeholder="Finalis 2"
                    />
                    {currentPlayoffBracket.grandFinal.team2.playerName && (
                      <span className="text-[10px] text-amber-900 font-semibold block px-1 truncate mt-0.5">
                        Atlet: {currentPlayoffBracket.grandFinal.team2.playerName}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={9}
                    value={currentPlayoffBracket.grandFinal.team2.score}
                    onChange={(e) => handleUpdatePlayoffMatch("grandFinal", 0, "team2_score", e.target.value)}
                    className="w-12 h-9 text-center font-mono font-black text-sm rounded-xl border border-amber-200 bg-white shrink-0"
                  />
                </div>

                <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-xs">
                  <span className="font-black text-amber-900 text-xs">JUARA 1 (CHAMPION):</span>
                  <select
                    value={
                      currentPlayoffBracket.grandFinal.team1.isWinner
                        ? currentPlayoffBracket.grandFinal.team1.name
                        : currentPlayoffBracket.grandFinal.team2.isWinner
                        ? currentPlayoffBracket.grandFinal.team2.name
                        : ""
                    }
                    onChange={(e) => handleUpdatePlayoffMatch("grandFinal", 0, "winner", e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-amber-300 bg-white text-xs font-black text-amber-900"
                  >
                    <option value="">Belum Ada Pemenang</option>
                    <option value={currentPlayoffBracket.grandFinal.team1.name}>
                      {currentPlayoffBracket.grandFinal.team1.name}
                    </option>
                    <option value={currentPlayoffBracket.grandFinal.team2.name}>
                      {currentPlayoffBracket.grandFinal.team2.name}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bronze Match */}
            <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                  <h4 className="font-black text-xs sm:text-sm uppercase tracking-wider text-slate-800">
                    Perebutan Juara 3 (Bronze Match)
                  </h4>
                </div>
                <select
                  value={currentPlayoffBracket.bronzeMatch.status || "upcoming"}
                  onChange={(e) => handleUpdatePlayoffMatch("bronzeMatch", 0, "status", e.target.value)}
                  className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase border bg-white border-slate-200"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">LIVE</option>
                  <option value="completed">Selesai</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={currentPlayoffBracket.bronzeMatch.team1.name}
                      onChange={(e) => handleUpdatePlayoffMatch("bronzeMatch", 0, "team1_name", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                      placeholder="Tim 1"
                    />
                    {currentPlayoffBracket.bronzeMatch.team1.playerName && (
                      <span className="text-[10px] text-red-600 font-semibold block px-1 truncate mt-0.5">
                        Atlet: {currentPlayoffBracket.bronzeMatch.team1.playerName}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={9}
                    value={currentPlayoffBracket.bronzeMatch.team1.score}
                    onChange={(e) => handleUpdatePlayoffMatch("bronzeMatch", 0, "team1_score", e.target.value)}
                    className="w-10 h-8 text-center font-mono font-black text-sm rounded-lg border border-slate-200 bg-white shrink-0"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={currentPlayoffBracket.bronzeMatch.team2.name}
                      onChange={(e) => handleUpdatePlayoffMatch("bronzeMatch", 0, "team2_name", e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 bg-white"
                      placeholder="Tim 2"
                    />
                    {currentPlayoffBracket.bronzeMatch.team2.playerName && (
                      <span className="text-[10px] text-red-600 font-semibold block px-1 truncate mt-0.5">
                        Atlet: {currentPlayoffBracket.bronzeMatch.team2.playerName}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={9}
                    value={currentPlayoffBracket.bronzeMatch.team2.score}
                    onChange={(e) => handleUpdatePlayoffMatch("bronzeMatch", 0, "team2_score", e.target.value)}
                    className="w-10 h-8 text-center font-mono font-black text-sm rounded-lg border border-slate-200 bg-white shrink-0"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500 text-[10px] uppercase">JUARA 3 (BRONZE):</span>
                  <select
                    value={
                      currentPlayoffBracket.bronzeMatch.team1.isWinner
                        ? currentPlayoffBracket.bronzeMatch.team1.name
                        : currentPlayoffBracket.bronzeMatch.team2.isWinner
                        ? currentPlayoffBracket.bronzeMatch.team2.name
                        : ""
                    }
                    onChange={(e) => handleUpdatePlayoffMatch("bronzeMatch", 0, "winner", e.target.value)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-800"
                  >
                    <option value="">Belum Ada Pemenang</option>
                    <option value={currentPlayoffBracket.bronzeMatch.team1.name}>
                      {currentPlayoffBracket.bronzeMatch.team1.name}
                    </option>
                    <option value={currentPlayoffBracket.bronzeMatch.team2.name}>
                      {currentPlayoffBracket.bronzeMatch.team2.name}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
