"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getParticipantsWithRosters } from "@/app/actions/bidang";
import { saveGroupStageDraw, getGroupStageDraws } from "@/app/actions/groupStage";
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
  ExternalLink,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  ChevronRight,
  RotateCcw,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface CategoryOption {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Trophy;
  badge: string;
  color: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "ganda-putra",
    title: "Ganda (Campuran / Bebas)",
    subtitle: "Campuran Pa-Pi, Pa-Pa, Pi-Pi • Piala Bergilir DirRen",
    icon: Users2,
    badge: "Piala Utama",
    color: "text-red-600 bg-red-50 border-red-200",
  },
  {
    id: "single-putra",
    title: "Single Putra",
    subtitle: "Perorangan Putra • Trophy Juara 1, 2, 3",
    icon: User,
    badge: "Trophy Tetap",
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
  {
    id: "single-putri",
    title: "Single Putri",
    subtitle: "Perorangan Putri • Trophy Juara 1, 2, 3",
    icon: User,
    badge: "Trophy Tetap",
    color: "text-rose-600 bg-rose-50 border-rose-200",
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
  "#2563eb", // blue-600
  "#059669", // emerald-600
  "#d97706", // amber-600
  "#7c3aed", // violet-600
  "#db2777", // pink-600
  "#0891b2", // cyan-600
  "#ea580c", // orange-600
  "#0d9488", // teal-600
  "#4f46e5", // indigo-600
  "#e11d48", // rose-600
  "#65a30d", // lime-600
  "#c026d3", // fuchsia-600
];

export const RouletteView: React.FC = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "ganda-putra";

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [participants, setParticipants] = useState<ParticipantTeam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Wheel entries (only registered participants)
  const [entries, setEntries] = useState<WheelEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Target group for current spin
  const [targetGroup, setTargetGroup] = useState<"A" | "B" | "C" | "D">("A");
  const [autoRotateGroup, setAutoRotateGroup] = useState(true);

  // Group assignments
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
  const [activeTab, setActiveTab] = useState<"entries" | "groups">("groups");
  const [viewMode, setViewMode] = useState<"split" | "jumbo">("split");

  // Save state & feedback
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [saveError, setSaveError] = useState("");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentRotationRef = useRef<number>(0);
  const angularVelocityRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTickIndexRef = useRef<number>(-1);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const needleDeflectionRef = useRef<number>(0);

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
      osc.frequency.setValueAtTime(450, audioCtxRef.current.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70, audioCtxRef.current.currentTime + 0.035);

      gain.gain.setValueAtTime(0.15, audioCtxRef.current.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.035);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);
      osc.start();
      osc.stop(audioCtxRef.current.currentTime + 0.035);
    } catch (e) {}
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

      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = audioCtxRef.current!.createOscillator();
        const gain = audioCtxRef.current!.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, audioCtxRef.current!.currentTime + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtxRef.current!.currentTime + idx * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtxRef.current!.destination);
        osc.start(audioCtxRef.current!.currentTime + idx * 0.09);
        osc.stop(audioCtxRef.current!.currentTime + idx * 0.09 + 0.35);
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

        // STRICT FILTER: ONLY INCLUDE BIDANG YANG SUDAH DAFTAR
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

  // Restore existing group assignments from Supabase or localStorage
  useEffect(() => {
    if (participants.length === 0) return;
    let isMounted = true;

    getGroupStageDraws().then((res) => {
      if (!isMounted) return;
      const candidates = extractRegisteredEntries(selectedCategory, participants);
      const serverDraw = res.draws?.[selectedCategory];

      let targetData = serverDraw;
      if (!targetData && typeof window !== "undefined") {
        try {
          const saved = localStorage.getItem(`${STORAGE_KEY_ROULETTE}${selectedCategory}`);
          if (saved) targetData = JSON.parse(saved) as GroupStageData[];
        } catch (e) {}
      }

      if (targetData && Array.isArray(targetData) && targetData.length === 4) {
        const newAssign: Record<"A" | "B" | "C" | "D", WheelEntry[]> = { A: [], B: [], C: [], D: [] };
        const assignedNames = new Set<string>();
        const letters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

        targetData.forEach((grp, idx) => {
          const letter = letters[idx];
          grp.standings.forEach((st) => {
            if (st.teamName && !st.teamName.includes("TBD")) {
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
        const remaining = candidates.filter((c) => !assignedNames.has(c.teamName));
        setEntries(remaining);
      } else {
        setEntries(candidates);
        setGroupAssignments({ A: [], B: [], C: [], D: [] });
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, participants, extractRegisteredEntries]);

  // DRAW RETINA-SHARP CANVAS WHEEL (Much Larger & High-Resolution)
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Retina scaling for ultra-crisp display (720px base resolution)
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
    const size = 720;
    if (canvas.width !== size * dpr || canvas.height !== size * dpr) {
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 32;

    ctx.clearRect(0, 0, size, size);

    if (entries.length === 0) {
      // Empty wheel state: Clean circular placeholder
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#f8fafc";
      ctx.fill();
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = "#64748b";
      ctx.font = "bold 18px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Semua Peserta Sudah Terbagi ke Grup!", centerX, centerY - 14);
      ctx.font = "14px -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Klik 'Reset Roda' untuk mengulang dari awal", centerX, centerY + 14);
      ctx.restore();
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

      // Crisp white radial separator
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Slice Text (Radial layout)
      ctx.save();
      const midAngle = startAngle + arcAngle / 2;
      ctx.rotate(midAngle);

      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#ffffff";

      // Font size adapts to slice count (balanced for long Indonesian department names)
      const fontSize = Math.max(10, Math.min(14, Math.floor(480 / numSlices)));
      ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

      // Text shadow for crisp legibility
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const entry = entries[i];
      let displayLabel = entry.teamName;
      if (displayLabel.length > 35) {
        displayLabel = displayLabel.substring(0, 33) + "...";
      }

      ctx.fillText(displayLabel, radius - 22, 0);
      ctx.restore();
    }

    ctx.restore();

    // Outer wheel decorative rings (light & clean)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 7;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 11, 0, 2 * Math.PI);
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center Hub (Clean, Modern Button)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, 58, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "rgba(0, 0, 0, 0.16)";
    ctx.shadowBlur = 14;
    ctx.fill();

    // Hub border ring
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#dc2626"; // red-600
    ctx.stroke();

    // Hub Text
    ctx.shadowColor = "transparent";
    ctx.fillStyle = "#dc2626";
    ctx.font = "900 16px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(isSpinning ? "SPINNING" : "PUTAR", centerX, centerY - 6);
    ctx.font = "bold 10px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillStyle = "#64748b";
    ctx.fillText(isSpinning ? "MENUNGGU..." : "KLIK DISINI", centerX, centerY + 13);
    ctx.restore();

    // Right Pointer Needle (Clean emerald pointer with realistic deflection/bounce)
    ctx.save();
    const ptrX = centerX + radius + 12;
    const ptrY = centerY;

    // Apply needle wobble deflection around base hinge (ptrX + 28, ptrY)
    const deflection = needleDeflectionRef.current || 0;
    ctx.translate(ptrX + 28, ptrY);
    ctx.rotate(deflection);
    ctx.translate(-(ptrX + 28), -ptrY);

    ctx.beginPath();
    ctx.moveTo(ptrX, ptrY);
    ctx.lineTo(ptrX + 28, ptrY - 17);
    ctx.lineTo(ptrX + 28, ptrY + 17);
    ctx.closePath();

    ctx.fillStyle = "#10b981"; // emerald-500
    ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }, [entries, isSpinning]);

  // Initial and reactive redraw
  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  // START SPIN ANIMATION
  const spinWheel = () => {
    if (isSpinning || entries.length === 0) return;

    setIsSpinning(true);
    setWinner(null);
    setIsWinnerModalOpen(false);

    const numSlices = entries.length;
    const arc = (2 * Math.PI) / numSlices;

    // Minimum 7 to 10 full 360-degree rotations for high excitement
    const fullSpins = (7 + Math.random() * 3) * 2 * Math.PI;
    // Uniform random landing offset
    const randomOffset = Math.random() * 2 * Math.PI;
    const totalDistance = fullSpins + randomOffset;

    const startAngle = currentRotationRef.current;
    const targetAngle = startAngle + totalDistance;

    // Smooth duration: 7.8 seconds
    const duration = 7800;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);

      // Smooth custom ease-out curve (power 3.6):
      // Rapid initial spin -> steady natural deceleration -> dramatic, nail-biting slow crawl in the final 2.5s
      const progress = 1 - Math.pow(1 - t, 3.6);
      const currentAngle = startAngle + totalDistance * progress;
      currentRotationRef.current = currentAngle;

      // Audio tick trigger & physical needle deflection
      if (numSlices > 0) {
        const normRot = ((-currentAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const currSlice = Math.floor(normRot / arc);
        if (currSlice !== lastTickIndexRef.current) {
          lastTickIndexRef.current = currSlice;
          playTick();
          // Deflect needle upwards (counter-clockwise) to simulate peg friction
          needleDeflectionRef.current = -0.22;
        }
      }

      // Smooth elastic return for pointer needle
      needleDeflectionRef.current *= 0.82;

      drawWheel();

      if (t < 1) {
        animFrameIdRef.current = requestAnimationFrame(animate);
      } else {
        // Complete rest: snap to exact targetAngle
        currentRotationRef.current = targetAngle;
        needleDeflectionRef.current = 0;
        drawWheel();

        // Determine exact winner at the 3 o'clock pointer
        const normRot = ((-targetAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const winningIndex = Math.floor(normRot / arc) % numSlices;
        const winningEntry = entries[winningIndex];

        // DRAMATIC SUSPENSE PAUSE (700ms):
        // Biarkan roda berhenti total terlebih dahulu agar penonton melihat jelas panah menunjuk ke siapa,
        // baru kemudian muncul efek selebrasi dan popup pemenang.
        setTimeout(() => {
          setIsSpinning(false);
          setWinner(winningEntry);
          setIsWinnerModalOpen(true);
          playFanfare();
        }, 700);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);
  };

  // Keyboard shortcut: Space / Enter to spin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === "Space" || e.code === "Enter") && !isWinnerModalOpen && !isSpinning) {
        // Prevent default only if not focused in input
        if ((e.target as HTMLElement)?.tagName !== "INPUT") {
          e.preventDefault();
          spinWheel();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSpinning, isWinnerModalOpen, entries]);

  // Handle assigning winner to target group
  const handleAssignWinner = (removeWinner: boolean = true) => {
    if (!winner) return;

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

  // Remove a team from a group and return it back to the wheel
  const handleRemoveFromGroup = (groupLetter: "A" | "B" | "C" | "D", entryId: string) => {
    const itemToRemove = groupAssignments[groupLetter].find((e) => e.id === entryId);
    if (!itemToRemove) return;

    setGroupAssignments((prev) => ({
      ...prev,
      [groupLetter]: prev[groupLetter].filter((e) => e.id !== entryId),
    }));

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

  // Reset wheel and groups to initial registered participants
  const handleResetAll = () => {
    const original = extractRegisteredEntries(selectedCategory, participants);
    setEntries(original);
    setGroupAssignments({ A: [], B: [], C: [], D: [] });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`${STORAGE_KEY_ROULETTE}${selectedCategory}`);
      } catch (e) {}
    }
    setSaveSuccessMsg("Roda dan grup berhasil di-reset ke kondisi awal.");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  // Quick Auto-Draw: Distribute all remaining entries evenly into Grup A, B, C, D
  const handleQuickAutoDraw = async () => {
    if (isSpinning) return;

    const pool = entries.length > 0 ? [...entries] : extractRegisteredEntries(selectedCategory, participants);
    if (pool.length === 0) return;

    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const letters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
    const newAssignments: Record<"A" | "B" | "C" | "D", WheelEntry[]> = {
      A: [...groupAssignments.A],
      B: [...groupAssignments.B],
      C: [...groupAssignments.C],
      D: [...groupAssignments.D],
    };

    // If wheel is full or reset, start clean
    if (entries.length === extractRegisteredEntries(selectedCategory, participants).length) {
      newAssignments.A = [];
      newAssignments.B = [];
      newAssignments.C = [];
      newAssignments.D = [];
    }

    let cycleIdx = letters.indexOf(targetGroup);
    if (cycleIdx < 0) cycleIdx = 0;

    pool.forEach((item) => {
      const currentTarget = letters[cycleIdx % letters.length];
      newAssignments[currentTarget].push(item);
      cycleIdx++;
    });

    setGroupAssignments(newAssignments);
    setEntries([]); // all placed
    playFanfare();

    // Auto save to server and localStorage
    await executeSave(newAssignments);
  };

  // Core save routine: Persists to Supabase server & localStorage
  const executeSave = async (assignments = groupAssignments) => {
    setIsSaving(true);
    setSaveError("");
    const groupLetters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];

    const newGroupsData: GroupStageData[] = groupLetters.map((letter) => {
      const teams = assignments[letter];
      const maxSlots = Math.max(5, teams.length);
      const standings: GroupTeamStanding[] = Array.from({ length: maxSlots }, (_, idx) => {
        const t = teams[idx];
        if (t) {
          return {
            pos: idx + 1,
            teamId: t.id,
            teamName: t.teamName,
            shortName: t.shortName || t.teamName,
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
        }
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
      });

      const roundRobinPairs: [number, number][] = [
        [0, 1],
        [2, 3],
        [0, 2],
        [1, 4],
        [0, 3],
        [2, 4],
        [0, 4],
        [1, 3],
        [1, 2],
        [3, 4],
      ];

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

    // 1. Save to Supabase Server
    try {
      const serverRes = await saveGroupStageDraw(selectedCategory, newGroupsData);
      if (!serverRes.success) {
        setSaveError(serverRes.message);
      }
    } catch (e: any) {
      console.warn("Failed saving to Supabase server:", e);
    }

    // 2. Save to localStorage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`${STORAGE_KEY_ROULETTE}${selectedCategory}`, JSON.stringify(newGroupsData));
      } catch (e) {
        console.warn("Failed saving to localStorage:", e);
      }
    }

    setIsSaving(false);
    setSaveSuccessMsg(`✓ Hasil undian ${selectedCategory} berhasil disimpan ke server & Group Stage!`);
    setTimeout(() => setSaveSuccessMsg(""), 6000);
  };

  const totalAssigned = Object.values(groupAssignments).reduce((acc, curr) => acc + curr.length, 0);

  const filteredEntries = entries.filter((e) =>
    e.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.playerName && e.playerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full">
      {/* 1. TOP HEADER BANNER (Light, Clean, Refined) */}
      <div className="p-5 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 flex items-center gap-1.5">
              <Dices className="w-3.5 h-3.5 text-red-600 animate-spin" />
              <span>Undian Resmi Babak Grup</span>
            </span>
            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
              Hanya Peserta Terdaftar
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Roda Undian (Wheel of Names)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Putar roda untuk menentukan pembagian tim ke <strong>Grup A, B, C, dan D</strong>. Simpan hasil undian agar langsung tayang di klasemen Group Stage publik.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setViewMode((prev) => (prev === "split" ? "jumbo" : "split"))}
            className="p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-colors bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs"
            title={viewMode === "split" ? "Ganti ke Mode Roda Jumbo (Penuh)" : "Ganti ke Mode Tampilan Samping"}
          >
            {viewMode === "split" ? <Maximize2 className="w-4 h-4 text-slate-600" /> : <Minimize2 className="w-4 h-4 text-slate-600" />}
            <span className="text-[11px] font-bold">{viewMode === "split" ? "Roda Jumbo" : "Mode Split"}</span>
          </button>

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
            <span className="text-[11px] font-bold">{soundEnabled ? "Suara ON" : "Mute"}</span>
          </button>

          <Link
            href="/group-stage"
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all hover:scale-[1.02]"
          >
            <span>Buka Halaman Group Stage</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
          </Link>
        </div>
      </div>

      {/* 2. CATEGORY SELECTOR PILLS */}
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
                  : "bg-white hover:bg-slate-50/70 border-slate-200 shadow-xs"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 ${
                    isSelected ? "bg-red-600 text-white shadow-xs" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm text-slate-900 truncate">{cat.title}</h4>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded border ${cat.color}`}>
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{cat.subtitle}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. PROMINENT ACTION CONTROLS BAR (Always Visible) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Target Group Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-500 mr-1">
              Target Grup:
            </span>
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
                      ? "bg-red-600 text-white shadow-xs scale-105"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>Grup {letter}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                      isCurrent ? "bg-red-800 text-white" : "bg-white text-slate-600 border border-slate-200"
                    }`}
                  >
                    {countInGroup}
                  </span>
                </button>
              );
            })}
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 cursor-pointer pl-2 sm:border-l border-slate-200">
            <input
              type="checkbox"
              checked={autoRotateGroup}
              onChange={(e) => setAutoRotateGroup(e.target.checked)}
              className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500"
            />
            <span className="text-[11px]">Auto Ganti Grup Tiap Putaran</span>
          </label>
        </div>

        {/* Right: Quick Draw & Save Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleQuickAutoDraw}
            disabled={isSpinning || (entries.length === 0 && totalAssigned > 0)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:bg-slate-100 disabled:text-slate-400 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Undi seluruh peserta tersisa secara otomatis dan distribusikan merata ke Grup A, B, C, D"
          >
            <Zap className="w-3.5 h-3.5 text-amber-200" />
            <span>⚡ Undi Otomatis Semua</span>
          </button>

          <button
            type="button"
            onClick={() => executeSave()}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Simpan susunan grup ke database Supabase agar langsung tampil di halaman publik Group Stage"
          >
            <Save className="w-3.5 h-3.5 text-emerald-200" />
            <span>{isSaving ? "Menyimpan ke Server..." : "💾 Simpan ke Group Stage"}</span>
          </button>

          <button
            type="button"
            onClick={handleResetAll}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors"
            title="Reset Roda & Grup ke Kondisi Awal"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Save Notification / Feedback Alert */}
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
            Buka Group Stage →
          </Link>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{saveError} (Data tetap tersimpan di browser Anda)</span>
        </div>
      )}

      {/* 4. MAIN ARENA: WHEEL + CONTROLS & GROUP PREVIEW */}
      <div className={viewMode === "jumbo" ? "space-y-6" : "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"}>
        {/* LEFT / CENTER: INTERACTIVE CANVAS WHEEL */}
        <div
          className={`${
            viewMode === "jumbo" ? "w-full max-w-4xl mx-auto" : "lg:col-span-7 xl:col-span-7"
          } bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs flex flex-col items-center justify-center relative space-y-4`}
        >
          <div className="w-full flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{entries.length} Nama di Roda</span>
            </span>
            <span className="text-[11px] text-slate-400">Tekan [Spasi] atau Klik Roda untuk Putar</span>
          </div>

          {/* Wheel Canvas Container (Much Larger) */}
          <div
            className={`relative flex items-center justify-center w-full ${
              viewMode === "jumbo" ? "max-w-[680px] sm:max-w-[720px]" : "max-w-[580px] sm:max-w-[640px]"
            } aspect-square py-2`}
          >
            <canvas
              ref={canvasRef}
              onClick={spinWheel}
              className={`w-full h-full cursor-pointer select-none transition-transform ${
                isSpinning ? "cursor-wait" : "hover:scale-[1.01]"
              }`}
            />
          </div>

          {/* Big Action Button below Wheel */}
          <div className="w-full flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              disabled={isSpinning || entries.length === 0}
              onClick={spinWheel}
              className={`w-full max-w-md py-4 px-6 rounded-2xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all ${
                isSpinning
                  ? "bg-amber-500 text-white cursor-wait"
                  : entries.length === 0
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-red-600 via-amber-600 to-red-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-sm"
              }`}
            >
              <Dices className={`w-5 h-5 ${isSpinning ? "animate-spin text-white" : "text-amber-200"}`} />
              <span>
                {isSpinning
                  ? "Sedang Memutar Roda..."
                  : entries.length === 0
                  ? "Semua Sudah Masuk Grup"
                  : `Putar Roda untuk Masuk Grup ${targetGroup}!`}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT / BOTTOM PANEL: LIVE GROUPS (A, B, C, D) & ENTRIES LIST */}
        <div
          className={`${
            viewMode === "jumbo" ? "w-full max-w-5xl mx-auto" : "lg:col-span-5 xl:col-span-5"
          } bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col`}
        >
          {/* Panel Navigation Tabs */}
          <div className="flex items-center border-b border-slate-200 bg-slate-50/80 p-2 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("groups")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "groups"
                  ? "bg-white text-red-600 shadow-2xs font-black"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Hasil 4 Grup ({totalAssigned})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("entries")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === "entries"
                  ? "bg-white text-slate-900 shadow-2xs font-black"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>Sisa Roda ({entries.length})</span>
            </button>
          </div>

          {/* TAB 1: 4 GROUPS PREVIEW & MANAGEMENT */}
          {activeTab === "groups" && (
            <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Distribusi Grup A, B, C, D
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {totalAssigned} Tim Ditempatkan
                  </span>
                </div>

                {/* 4 Groups Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[460px] overflow-y-auto pr-1">
                  {(["A", "B", "C", "D"] as const).map((letter) => {
                    const list = groupAssignments[letter];
                    const isTarget = targetGroup === letter;

                    return (
                      <div
                        key={letter}
                        className={`p-3 rounded-2xl border transition-all ${
                          isTarget
                            ? "bg-amber-50/50 border-amber-300 ring-2 ring-amber-200 shadow-2xs"
                            : "bg-slate-50/70 border-slate-200/80"
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/70 mb-2">
                          <span className="font-black text-slate-900 text-xs">
                            Grup {letter} ({list.length} Tim)
                          </span>
                          {isTarget && (
                            <span className="text-[9px] font-black uppercase text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                              Target Putaran
                            </span>
                          )}
                        </div>

                        <div className="space-y-1.5 min-h-[90px]">
                          {list.length > 0 ? (
                            list.map((t, idx) => (
                              <div
                                key={t.id}
                                className="flex items-center justify-between text-[11px] p-1.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs group"
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
                                  className="text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 p-0.5 rounded transition-opacity"
                                  title="Kembalikan ke roda"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))
                          ) : (
                            <p className="text-[11px] text-slate-400 italic text-center py-6">
                              Belum ada tim
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Save */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  Pastikan klik tombol simpan setelah selesai.
                </span>
                <button
                  type="button"
                  onClick={() => executeSave()}
                  disabled={isSaving}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-200" />
                  <span>{isSaving ? "Menyimpan..." : "Simpan"}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ENTRIES ON THE WHEEL */}
          {activeTab === "entries" && (
            <div className="p-4 sm:p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Search & Actions */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleShuffleEntries}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
                      title="Acak Urutan Slices"
                    >
                      <Shuffle className="w-3 h-3" />
                      <span>Shuffle</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleSortEntries}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1"
                      title="Urutkan A-Z"
                    >
                      <ArrowUpDown className="w-3 h-3" />
                      <span>Sort</span>
                    </button>
                  </div>

                  <input
                    type="text"
                    placeholder="Cari tim / atlet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-red-500 w-36"
                  />
                </div>

                {/* Entries List */}
                <div className="max-h-[400px] overflow-y-auto space-y-1 pr-1 divide-y divide-slate-100">
                  {filteredEntries.length > 0 ? (
                    filteredEntries.map((entry, idx) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between py-2 px-2.5 rounded-xl hover:bg-slate-50 text-xs group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0 shadow-2xs"
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
                          title="Hapus dari roda sementara"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                      <p className="font-bold">Tidak ada peserta di roda saat ini.</p>
                      <p className="text-[11px]">Buka tab &quot;Hasil 4 Grup&quot; untuk melihat penempatan tim.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status info */}
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>Total {entries.length} peserta di roda</span>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="text-red-600 font-bold hover:underline"
                >
                  Reset Roda
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. WINNER ANNOUNCEMENT POPUP MODAL (Celebratory, Light & Clean) */}
      {isWinnerModalOpen && winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative max-w-md w-full bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 text-center space-y-5 animate-scale-up">
            <button
              type="button"
              onClick={() => setIsWinnerModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <Sparkles className="w-8 h-8 text-amber-500 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                🎉 Hasil Undian Terpilih!
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 pt-2 leading-tight">
                {winner.teamName}
              </h3>
              {winner.playerName && (
                <p className="text-sm font-semibold text-slate-600 mt-1">
                  Atlet: <span className="text-slate-900 font-bold">{winner.playerName}</span>
                </p>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-center gap-2">
              <span>Akan dimasukkan ke:</span>
              <span className="font-black text-sm text-red-600 bg-red-50 px-2.5 py-0.5 rounded-lg border border-red-200">
                Grup {targetGroup}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleAssignWinner(true)}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all hover:scale-[1.02]"
              >
                ✓ Masukkan ke Grup {targetGroup}
              </button>
              <button
                type="button"
                onClick={() => setIsWinnerModalOpen(false)}
                className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Undi Ulang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
