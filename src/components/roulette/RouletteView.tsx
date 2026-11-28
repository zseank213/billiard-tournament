"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getParticipantsWithRosters } from "@/app/actions/bidang";
import { ParticipantTeam, GroupStageData, GroupTeamStanding } from "@/types/tournament";
import { STORAGE_KEY_ROULETTE } from "@/components/liquipedia/GroupStageView";
import {
  Dices,
  Trophy,
  Users2,
  User,
  Sparkles,
  RefreshCw,
  Shuffle,
  ArrowUpDown,
  Volume2,
  VolumeX,
  CheckCircle2,
  X,
  Play,
  ArrowRight,
  Save,
  Trash2,
  ListPlus,
  ExternalLink,
  ShieldCheck,
  Award,
} from "lucide-react";

interface CategoryOption {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Trophy;
  color: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "ganda-putra",
    title: "Ganda (Campuran / Bebas)",
    subtitle: "Pasangan Campuran, Pa-Pa, Pi-Pi • Piala Bergilir DirRen",
    icon: Users2,
    color: "from-red-600 to-amber-600",
  },
  {
    id: "single-putra",
    title: "Single Putra",
    subtitle: "Kategori Perorangan Putra • Trophy Juara 1, 2, 3",
    icon: User,
    color: "from-amber-600 to-orange-600",
  },
  {
    id: "single-putri",
    title: "Single Putri",
    subtitle: "Kategori Perorangan Putri • Trophy Juara 1, 2, 3",
    icon: User,
    color: "from-rose-600 to-pink-600",
  },
];

interface WheelEntry {
  id: string;
  teamName: string;
  shortName: string;
  playerName?: string;
  bidangName: string;
}

const SLICE_COLORS = [
  "#ef4444", // red-500
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#f97316", // orange-500
  "#14b8a6", // teal-500
  "#6366f1", // indigo-500
  "#84cc16", // lime-500
  "#d946ef", // fuchsia-500
];

export const RouletteView: React.FC = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ganda-putra";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [participants, setParticipants] = useState<ParticipantTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Wheel entries
  const [entries, setEntries] = useState<WheelEntry[]>([]);
  const [newEntryText, setNewEntryText] = useState("");

  // Target group
  const [targetGroup, setTargetGroup] = useState<"A" | "B" | "C" | "D">("A");
  const [autoRotateGroup, setAutoRotateGroup] = useState(true);

  // Group assignments for current category
  const [groupAssignments, setGroupAssignments] = useState<Record<"A" | "B" | "C" | "D", WheelEntry[]>>({
    A: [],
    B: [],
    C: [],
    D: [],
  });

  // Wheel animation state
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelEntry | null>(null);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<"entries" | "groups">("entries");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRotationRef = useRef<number>(0);
  const angularVelocityRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTickIndexRef = useRef<number>(-1);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Web Audio Synthesized Tick and Fanfare
  const playTick = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current && typeof window !== "undefined") {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (!audioCtxRef.current) return;
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(500, audioCtxRef.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, audioCtxRef.current.currentTime + 0.035);

      gain.gain.setValueAtTime(0.18, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.035);
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  }, [soundEnabled]);

  const playFanfare = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current && typeof window !== "undefined") {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      if (!audioCtxRef.current) return;
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtxRef.current!.createOscillator();
        const gain = audioCtxRef.current!.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, audioCtxRef.current!.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current!.currentTime + idx * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtxRef.current!.destination);
        osc.start(audioCtxRef.current!.currentTime + idx * 0.1);
        osc.stop(audioCtxRef.current!.currentTime + idx * 0.1 + 0.35);
      });
    } catch (e) {}
  }, [soundEnabled]);

  // Load participants from Supabase
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getParticipantsWithRosters()
      .then((res) => {
        if (isMounted) {
          if (res.participants && res.participants.length > 0) {
            setParticipants(res.participants);
          }
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Failed loading participants for roulette:", err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Helper: Extract ONLY registered participants for the selected category
  const extractRegisteredEntries = useCallback(
    (categoryKey: string, list: ParticipantTeam[]): WheelEntry[] => {
      if (!list || list.length === 0) return [];

      const result: WheelEntry[] = [];

      list.forEach((p) => {
        let matchedSlots: typeof p.slots = [];

        if (categoryKey === "ganda-putra") {
          matchedSlots = p.slots.filter(
            (s) => s.category.includes("Ganda") && s.playerName && !s.playerName.includes("TBD")
          );
        } else if (categoryKey === "single-putra") {
          matchedSlots = p.slots.filter(
            (s) => s.category === "Single Putra" && s.playerName && !s.playerName.includes("TBD")
          );
        } else if (categoryKey === "single-putri") {
          matchedSlots = p.slots.filter(
            (s) => s.category === "Single Putri" && s.playerName && !s.playerName.includes("TBD")
          );
        }

        // ONLY INCLUDE BIDANG YANG SUDAH DAFTAR
        if (matchedSlots.length > 0) {
          matchedSlots.forEach((slot, sIdx) => {
            let label = p.name;
            if (matchedSlots.length > 1) {
              label = `${p.name} (${slot.role})`;
            } else if (slot.role && (slot.role.includes("Ganda") || slot.role.includes("Atlet"))) {
              label = `${p.name} (${slot.role})`;
            }

            result.push({
              id: `${p.id}-${slot.slotNumber}-${sIdx}`,
              teamName: label,
              shortName: p.shortName,
              playerName: slot.playerName,
              bidangName: p.name,
            });
          });
        }
      });

      return result;
    },
    []
  );

  // Restore existing group assignments or populate default entries
  useEffect(() => {
    if (participants.length === 0) return;

    // 1. Try restore from localStorage
    let restoredFromStorage = false;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`${STORAGE_KEY_ROULETTE}${selectedCategory}`);
        if (saved) {
          const parsed: GroupStageData[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length === 4) {
            const newAssign: Record<"A" | "B" | "C" | "D", WheelEntry[]> = {
              A: [],
              B: [],
              C: [],
              D: [],
            };
            const assignedNames = new Set<string>();

            const letters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
            parsed.forEach((grp, idx) => {
              const letter = letters[idx];
              grp.standings.forEach((st) => {
                if (st.teamName && st.teamName !== "TBD") {
                  assignedNames.add(st.teamName);
                  newAssign[letter].push({
                    id: st.teamId,
                    teamName: st.teamName,
                    shortName: st.shortName,
                    playerName: st.playerName,
                    bidangName: st.teamName,
                  });
                }
              });
            });

            setGroupAssignments(newAssign);

            // Filter entries on the wheel: remove those already assigned
            const allCandidates = extractRegisteredEntries(selectedCategory, participants);
            const remaining = allCandidates.filter((c) => !assignedNames.has(c.teamName));
            setEntries(remaining.length > 0 ? remaining : allCandidates);
            restoredFromStorage = true;
          }
        }
      } catch (e) {
        console.warn("Error restoring roulette state:", e);
      }
    }

    if (!restoredFromStorage) {
      const registered = extractRegisteredEntries(selectedCategory, participants);
      setEntries(registered);
      setGroupAssignments({ A: [], B: [], C: [], D: [] });
    }
  }, [selectedCategory, participants, extractRegisteredEntries]);

  // DRAW CANVAS WHEEL
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 28;

    ctx.clearRect(0, 0, width, height);

    if (entries.length === 0) {
      // Empty wheel message
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#f1f5f9";
      ctx.fill();
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = "#64748b";
      ctx.font = "bold 16px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Semua Peserta Sudah Terundi!", centerX, centerY - 10);
      ctx.font = "12px Arial, sans-serif";
      ctx.fillText("Klik 'Reset Roda' untuk mengulang", centerX, centerY + 14);
      return;
    }

    const numSlices = entries.length;
    const arcAngle = (2 * Math.PI) / numSlices;
    const rotation = currentRotationRef.current;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    // Draw slices
    for (let i = 0; i < numSlices; i++) {
      const startAngle = i * arcAngle;
      const endAngle = startAngle + arcAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Slice background
      ctx.fillStyle = SLICE_COLORS[i % SLICE_COLORS.length];
      ctx.fill();

      // Slice border line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Slice Text (Radial layout)
      ctx.save();
      const midAngle = startAngle + arcAngle / 2;
      ctx.rotate(midAngle);

      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";

      // Font size scales with number of slices
      const fontSize = Math.max(9, Math.min(14, Math.floor(400 / numSlices)));
      ctx.font = `bold ${fontSize}px Arial, sans-serif`;

      // Text shadow for readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      // Truncate label if too long to fit radius
      const entry = entries[i];
      let displayLabel = entry.teamName;
      if (displayLabel.length > 24) {
        displayLabel = displayLabel.substring(0, 22) + "...";
      }

      ctx.fillText(displayLabel, radius - 16, 0);

      ctx.restore();
    }

    ctx.restore();

    // Outer wheel decorative ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 8;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 10, 0, 2 * Math.PI);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center Hub (Clickable Button)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 46, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#dc2626"; // red-600
    ctx.stroke();

    // Hub Text
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#dc2626";
    ctx.font = "900 13px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isSpinning ? "SPINNING" : "PUTAR", centerX, centerY - 4);
    ctx.font = "bold 9px Arial, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText("KLIK DISINI", centerX, centerY + 10);
    ctx.restore();

    // Right Pointer Arrow (pointing directly at the right edge, angle = 0 / 3 o'clock)
    ctx.save();
    const ptrX = centerX + radius + 12;
    const ptrY = centerY;

    ctx.beginPath();
    ctx.moveTo(ptrX, ptrY);
    ctx.lineTo(ptrX + 22, ptrY - 14);
    ctx.lineTo(ptrX + 22, ptrY + 14);
    ctx.closePath();

    ctx.fillStyle = "#10b981"; // emerald-500
    ctx.shadowColor = "rgba(0,0,0,0.3)";
    ctx.shadowBlur = 6;
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.restore();
  }, [entries, isSpinning]);

  // Initial and reactive redraw
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // START SPIN
  const spinWheel = () => {
    if (isSpinning || entries.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    setIsWinnerModalOpen(false);

    // Initial random angular velocity: 22 - 32 rad/s
    const initialVel = 24 + Math.random() * 10;
    angularVelocityRef.current = initialVel;

    // Deceleration rate (friction)
    const friction = 0.985 + Math.random() * 0.005;

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const dt = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      // Update rotation
      currentRotationRef.current += angularVelocityRef.current * dt * 10;
      angularVelocityRef.current *= friction;

      // Tick detection
      if (entries.length > 0) {
        const arc = (2 * Math.PI) / entries.length;
        const normalized = (2 * Math.PI - (currentRotationRef.current % (2 * Math.PI))) % (2 * Math.PI);
        const currentIndex = Math.floor(normalized / arc);

        if (currentIndex !== lastTickIndexRef.current) {
          lastTickIndexRef.current = currentIndex;
          playTick();
        }
      }

      drawWheel();

      // Check if wheel stopped
      if (angularVelocityRef.current < 0.05) {
        // Stopped!
        angularVelocityRef.current = 0;
        setIsSpinning(false);
        animFrameIdRef.current = null;

        // Calculate winner index at pointer (angle 0 on right)
        if (entries.length > 0) {
          const arc = (2 * Math.PI) / entries.length;
          const normalized = (2 * Math.PI - (currentRotationRef.current % (2 * Math.PI))) % (2 * Math.PI);
          const winIdx = Math.floor(normalized / arc) % entries.length;
          const winningEntry = entries[winIdx];

          setWinner(winningEntry);
          setIsWinnerModalOpen(true);
          playFanfare();
        }
        return;
      }

      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  };

  // Assign winner to target group and remove from wheel
  const handleConfirmAssignment = (removeWinner: boolean) => {
    if (!winner) return;

    // Add to target group
    setGroupAssignments((prev) => ({
      ...prev,
      [targetGroup]: [...prev[targetGroup], winner],
    }));

    if (removeWinner) {
      setEntries((prev) => prev.filter((e) => e.id !== winner.id));
    }

    // Auto rotate target group: A -> B -> C -> D -> A
    if (autoRotateGroup) {
      const nextGroupMap: Record<"A" | "B" | "C" | "D", "A" | "B" | "C" | "D"> = {
        A: "B",
        B: "C",
        C: "D",
        D: "A",
      };
      setTargetGroup(nextGroupMap[targetGroup]);
    }

    setIsWinnerModalOpen(false);
  };

  // Remove a team from a group and return it to the wheel
  const handleRemoveFromGroup = (groupLetter: "A" | "B" | "C" | "D", entryId: string) => {
    const itemToRemove = groupAssignments[groupLetter].find((e) => e.id === entryId);
    if (!itemToRemove) return;

    // Remove from group
    setGroupAssignments((prev) => ({
      ...prev,
      [groupLetter]: prev[groupLetter].filter((e) => e.id !== entryId),
    }));

    // Add back to wheel entries if not already there
    setEntries((prev) => (prev.some((e) => e.id === entryId) ? prev : [...prev, itemToRemove]));
  };

  // Shuffle current wheel entries
  const handleShuffleEntries = () => {
    setEntries((prev) => {
      const copy = [...prev];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    });
  };

  // Sort entries alphabetically
  const handleSortEntries = () => {
    setEntries((prev) => [...prev].sort((a, b) => a.teamName.localeCompare(b.teamName)));
  };

  // Reset wheel and groups to original registered list
  const handleResetAll = () => {
    const original = extractRegisteredEntries(selectedCategory, participants);
    setEntries(original);
    setGroupAssignments({ A: [], B: [], C: [], D: [] });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`${STORAGE_KEY_ROULETTE}${selectedCategory}`);
      } catch (e) {}
    }
  };

  // Add custom entry
  const handleAddCustomEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryText.trim()) return;

    const newEntry: WheelEntry = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      teamName: newEntryText.trim(),
      shortName: "CUSTOM",
      bidangName: newEntryText.trim(),
    };

    setEntries((prev) => [...prev, newEntry]);
    setNewEntryText("");
  };

  // Save current group assignments to GroupStageView localStorage
  const handleSaveToGroupStage = () => {
    const groupLetters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

    const newGroupsData: GroupStageData[] = groupLetters.map((letter) => {
      const teams = groupAssignments[letter];

      // Form 5 standings rows (or actual count if more/less)
      const maxSlots = Math.max(5, teams.length);
      const standings: GroupTeamStanding[] = Array.from({ length: maxSlots }, (_, idx) => {
        const t = teams[idx];
        if (t) {
          return {
            pos: idx + 1,
            teamId: `${selectedCategory}-${letter.toLowerCase()}-${t.id}`,
            teamName: t.teamName,
            shortName: t.shortName,
            playerName: t.playerName,
            matchesPlayed: 0,
            seriesWon: 0,
            seriesLost: 0,
            racksWon: 0,
            racksLost: 0,
            rackDiff: 0,
            points: 0,
            status: null,
          };
        } else {
          return {
            pos: idx + 1,
            teamId: `${selectedCategory}-${letter.toLowerCase()}-slot-${idx + 1}`,
            teamName: "TBD",
            shortName: "TBD",
            matchesPlayed: 0,
            seriesWon: 0,
            seriesLost: 0,
            racksWon: 0,
            racksLost: 0,
            rackDiff: 0,
            points: 0,
            status: null,
          };
        }
      });

      // Round robin matches
      const roundRobinPairs: [number, number][] = [];
      for (let i = 0; i < standings.length; i++) {
        for (let j = i + 1; j < standings.length; j++) {
          roundRobinPairs.push([i, j]);
        }
      }

      const matches = roundRobinPairs.map(([t1, t2], mIdx) => ({
        id: `${selectedCategory}-${letter}-m${mIdx + 1}`,
        team1: standings[t1].teamName,
        team2: standings[t2].teamName,
        score1: 0,
        score2: 0,
        status: "upcoming" as const,
      }));

      return {
        groupId: `${selectedCategory}-group-${letter.toLowerCase()}`,
        groupName: `Grup ${letter} — Babak Penyisihan`,
        standings,
        matches,
      };
    });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${STORAGE_KEY_ROULETTE}${selectedCategory}`, JSON.stringify(newGroupsData));
        setSaveSuccessMsg(`✓ Hasil undian ${selectedCategory} berhasil disimpan ke halaman Group Stage!`);
        setTimeout(() => setSaveSuccessMsg(""), 4000);
      } catch (e) {
        console.warn("Failed saving to localStorage:", e);
      }
    }
  };

  const totalAssigned = Object.values(groupAssignments).reduce((acc, curr) => acc + curr.length, 0);

  return (
    <div className="space-y-8 w-full min-w-0 max-w-full">
      {/* 1. Header Navigation Banner */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 flex items-center gap-1.5">
              <Dices className="w-3.5 h-3.5 text-red-600 animate-spin" />
              <span>Official Wheel of Names</span>
            </span>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Hanya Peserta Terdaftar
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Roda Undian Grup (Roulette)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Putar roda keberuntungan untuk mengundi penempatan tim ke <strong>Grup A, B, C, dan D</strong>. Hanya kontingen yang telah resmi mendaftar yang diikutsertakan dalam roda.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-slate-100 text-slate-400 border-slate-200"
            }`}
            title={soundEnabled ? "Suara Tik & Fanfare Aktif" : "Suara Dinonaktifkan"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="text-[11px] font-bold">{soundEnabled ? "Suara ON" : "Suara Mute"}</span>
          </button>

          <Link
            href="/group-stage"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <span>Buka Klasemen Group Stage</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
          </Link>
        </div>
      </div>

      {/* 2. Category Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? "bg-white border-red-500 shadow-md ring-2 ring-red-500/20"
                  : "bg-white/80 hover:bg-white border-slate-200 hover:border-slate-300 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shadow-2xs shrink-0 ${
                    isSelected ? "bg-red-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-black text-sm text-slate-900 truncate">{cat.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{cat.subtitle}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Save Notification Toast */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-3 animate-fade-in shadow-xs">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <Link
            href="/group-stage"
            className="text-xs font-black text-emerald-700 underline hover:text-emerald-900 shrink-0"
          >
            Lihat Halaman Group Stage →
          </Link>
        </div>
      )}

      {/* 3. Main Roulette Arena & Right Controls Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: THE BIG WHEEL OF NAMES */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs flex flex-col items-center justify-center relative space-y-4">
          {/* Target Group Selector Ribbon */}
          <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                Target Penempatan Hasil Putaran:
              </span>
              <div className="flex items-center gap-1.5">
                {(["A", "B", "C", "D"] as const).map((letter) => {
                  const isCurrent = targetGroup === letter;
                  const countInGroup = groupAssignments[letter].length;

                  return (
                    <button
                      key={letter}
                      type="button"
                      onClick={() => setTargetGroup(letter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                        isCurrent
                          ? "bg-red-600 text-white shadow-2xs scale-105"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span>Grup {letter}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                          isCurrent ? "bg-red-800 text-white" : "bg-white text-slate-500"
                        }`}
                      >
                        {countInGroup}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer self-start sm:self-auto">
              <input
                type="checkbox"
                checked={autoRotateGroup}
                onChange={(e) => setAutoRotateGroup(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
              />
              <span>Rotasi Otomatis (A → B → C → D)</span>
            </label>
          </div>

          {/* Canvas Wheel Wrapper */}
          <div className="relative flex items-center justify-center w-full max-w-[500px] aspect-square">
            <canvas
              ref={canvasRef}
              width={520}
              height={520}
              onClick={spinWheel}
              className={`w-full h-full cursor-pointer select-none transition-transform ${
                isSpinning ? "cursor-wait" : "hover:scale-[1.01]"
              }`}
            />
          </div>

          {/* Big Spin Action Button */}
          <div className="w-full flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              disabled={isSpinning || entries.length === 0}
              onClick={spinWheel}
              className={`w-full max-w-sm py-3.5 px-6 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all ${
                isSpinning
                  ? "bg-amber-500 text-white cursor-wait"
                  : entries.length === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              <Dices className={`w-5 h-5 ${isSpinning ? "animate-spin text-white" : "text-amber-200"}`} />
              <span>
                {isSpinning
                  ? "Sedang Memutar Roda..."
                  : entries.length === 0
                  ? "Roda Kosong"
                  : `Putar Roda untuk Masuk Grup ${targetGroup}!`}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: ENTRIES & GROUP ASSIGNMENTS */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Panel Tabs */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50/80 p-2 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("entries")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "entries"
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Entries ({entries.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("groups")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "groups"
                  ? "bg-white text-red-600 shadow-2xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span>Hasil Grup ({totalAssigned})</span>
            </button>
          </div>

          {/* TAB 1: WHEEL ENTRIES */}
          {activeTab === "entries" && (
            <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Entry Action Bar */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {entries.length} Nama di Roda Saat Ini
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleShuffleEntries}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1"
                      title="Acak Urutan Slices"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>Shuffle</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSortEntries}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1"
                      title="Urutkan A-Z"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                      <span>Sort</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAll}
                      className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold flex items-center gap-1"
                      title="Kembalikan semua peserta resmi terdaftar ke roda"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Roda</span>
                    </button>
                  </div>
                </div>

                {/* Entries Scrollable List */}
                <div className="max-h-[360px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100">
                  {entries.length > 0 ? (
                    entries.map((entry, idx) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between py-1.5 px-2.5 rounded-xl hover:bg-slate-50 text-xs group"
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: SLICE_COLORS[idx % SLICE_COLORS.length] }}
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate leading-snug">
                              {entry.teamName}
                            </p>
                            {entry.playerName && (
                              <p className="text-[10px] text-slate-500 truncate leading-none mt-0.5">
                                {entry.playerName}
                              </p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setEntries((prev) => prev.filter((e) => e.id !== entry.id))}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 p-1 rounded transition-opacity"
                          title="Hapus dari roda"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                      <p className="font-bold">Seluruh peserta telah terundi!</p>
                      <p className="text-[11px]">Buka tab &quot;Hasil Grup&quot; untuk melihat pembagian dan menyimpan ke Group Stage.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Custom Entry Input */}
              <form onSubmit={handleAddCustomEntry} className="pt-3 border-t border-slate-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tambah nama peserta custom..."
                    value={newEntryText}
                    onChange={(e) => setNewEntryText(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
                  >
                    + Tambah
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: LIVE GROUP ASSIGNMENTS */}
          {activeTab === "groups" && (
            <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Hasil Pengundian 4 Grup
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Total {totalAssigned} Tim Terbagi
                  </span>
                </div>

                {/* 4 Groups Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {(["A", "B", "C", "D"] as const).map((letter) => {
                    const list = groupAssignments[letter];

                    return (
                      <div
                        key={letter}
                        className={`p-3 rounded-2xl border transition-all ${
                          targetGroup === letter
                            ? "bg-amber-50/40 border-amber-300 ring-2 ring-amber-200"
                            : "bg-slate-50/70 border-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60 mb-2">
                          <span className="font-black text-slate-900 text-xs">
                            Grup {letter} ({list.length} Tim)
                          </span>
                          {targetGroup === letter && (
                            <span className="text-[9px] font-bold uppercase text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                              Target Putaran
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 min-h-[90px]">
                          {list.length > 0 ? (
                            list.map((t, idx) => (
                              <div
                                key={t.id}
                                className="flex items-center justify-between text-[11px] p-1.5 rounded-lg bg-white border border-slate-200/80 shadow-2xs group"
                              >
                                <div className="min-w-0 pr-1">
                                  <p className="font-bold text-slate-900 truncate">
                                    <span className="text-slate-400 font-mono mr-1">{idx + 1}.</span>
                                    {t.teamName}
                                  </p>
                                  {t.playerName && (
                                    <p className="text-[9px] text-slate-500 truncate leading-none mt-0.5">
                                      {t.playerName}
                                    </p>
                                  )}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFromGroup(letter, t.id)}
                                  className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 p-0.5 transition-opacity"
                                  title="Keluarkan dari grup & kembalikan ke roda"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] text-slate-400 italic text-center py-6">
                              Belum ada tim terundi
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save & Reset Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1.5"
                  title="Hapus hasil pembagian grup dan kembalikan peserta ke roda"
                >
                  <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Grup</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToGroupStage}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02]"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Simpan ke Group Stage</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Winner Announcement Popup Modal */}
      {isWinnerModalOpen && winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 text-center space-y-5 animate-scale-up">
            <button
              type="button"
              onClick={() => setIsWinnerModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-8 h-8 text-amber-500 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                🎉 Hasil Undian Terpilih!
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 pt-2 leading-tight">
                {winner.teamName}
              </h3>
              {winner.playerName && (
                <p className="text-xs text-red-700 font-bold mt-1">
                  Atlet: {winner.playerName}
                </p>
              )}
              <div className="pt-3">
                <p className="text-xs text-slate-500 font-medium">
                  Siap dimasukkan ke dalam:
                </p>
                <span className="inline-block mt-1 text-sm font-black text-amber-900 bg-amber-100 px-4 py-1.5 rounded-xl border border-amber-300">
                  Grup {targetGroup} ({selectedCategory === "ganda-putra" ? "Ganda" : selectedCategory === "single-putra" ? "Single Pa" : "Single Pi"})
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleConfirmAssignment(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all"
              >
                ✓ Masukkan ke Grup {targetGroup} &amp; Hapus dari Roda
              </button>

              <button
                type="button"
                onClick={() => handleConfirmAssignment(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Simpan Tanpa Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

