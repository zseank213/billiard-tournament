"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  submitBidangFullRegistration,
  checkBidangRegistration,
  BidangCategoryStatus,
} from "@/app/actions/registration";
import { cleanPhoneNumber, validateIndonesianPhone } from "@/lib/phone";
import { getBidangList } from "@/app/actions/bidang";
import { Registration, BidangFullRegistrationPayload } from "@/types/tournament";
import { TOURNAMENT_CONFIG, INVITED_BIDANG_LIST } from "@/lib/mock-data";
import {
  FileText,
  User,
  Phone,
  Trophy,
  CheckCircle2,
  AlertCircle,
  Send,
  Building,
  Calendar,
  Clock,
  Users2,
  PlusCircle,
  XCircle,
  Lock,
  RotateCcw,
  ArrowLeft,
  Users,
  MapPin,
  ShieldCheck,
  MessageCircle,
  ExternalLink,
  Info,
  ChevronDown,
} from "lucide-react";

interface RegistrationFormProps {
  onSuccess?: (data: Registration) => void;
  onGoToSchedule?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
}) => {
  const [bidangOptions, setBidangOptions] = useState<string[]>(INVITED_BIDANG_LIST);
  const [isLoadingBidang, setIsLoadingBidang] = useState(false);
  const [selectedBidang, setSelectedBidang] = useState<string>("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [categoryStatus, setCategoryStatus] = useState<BidangCategoryStatus | null>(null);

  // Kategori Ganda (Campuran / Bebas) - Tim 1 (Opsional jika belum terdaftar)
  const [gandaTim1P1, setGandaTim1P1] = useState("");
  const [gandaTim1P1Phone, setGandaTim1P1Phone] = useState("");
  const [gandaTim1P2, setGandaTim1P2] = useState("");
  const [gandaTim1P2Phone, setGandaTim1P2Phone] = useState("");

  // Kategori Ganda (Campuran / Bebas) - Tim 2 (Opsional jika belum terdaftar)
  const [hasGandaTim2, setHasGandaTim2] = useState(false);
  const [gandaTim2P1, setGandaTim2P1] = useState("");
  const [gandaTim2P1Phone, setGandaTim2P1Phone] = useState("");
  const [gandaTim2P2, setGandaTim2P2] = useState("");
  const [gandaTim2P2Phone, setGandaTim2P2Phone] = useState("");

  // Kategori Single Putra (1 Atlet)
  const [singlePutra, setSinglePutra] = useState("");
  const [singlePutraPhone, setSinglePutraPhone] = useState("");

  // Kategori Single Putri (1 Atlet)
  const [singlePutri, setSinglePutri] = useState("");
  const [singlePutriPhone, setSinglePutriPhone] = useState("");

  // Khusus Tuan Rumah (Bidang Teknologi Informasi): Kuota Tanpa Batas
  const [extraGandaTeams, setExtraGandaTeams] = useState<
    { id: string; teamNumber: number; p1: string; p1Phone: string; p2: string; p2Phone: string }[]
  >([]);
  const [extraSinglePutra, setExtraSinglePutra] = useState<
    { id: string; playerNumber: number; player: string; phone: string }[]
  >([]);
  const [extraSinglePutri, setExtraSinglePutri] = useState<
    { id: string; playerNumber: number; player: string; phone: string }[]
  >([]);

  const [notes, setNotes] = useState("");
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successNotice, setSuccessNotice] = useState("");
  const [registeredData, setRegisteredData] = useState<Registration | null>(null);

  const topErrorRef = React.useRef<HTMLDivElement>(null);
  const bottomErrorRef = React.useRef<HTMLDivElement>(null);

  const showError = (msg: string, focusId?: string) => {
    setErrorMessage(msg);
    if (typeof window !== "undefined") {
      setTimeout(() => {
        if (focusId) {
          const el = document.getElementById(focusId);
          if (el) {
            el.focus();
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            return;
          }
        }
        bottomErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  };

  // Helper to normalize phone numbers as user inputs or pastes:
  // - Replaces +62 or 62 with 0
  // - Removes hyphens '-'
  // - Removes spaces ' '
  const handlePhoneInputChange = (
    rawValue: string,
    setter: (val: string) => void
  ) => {
    setter(cleanPhoneNumber(rawValue));
  };

  // Reset fields helper
  const resetFormFields = () => {
    setGandaTim1P1("");
    setGandaTim1P1Phone("");
    setGandaTim1P2("");
    setGandaTim1P2Phone("");
    setHasGandaTim2(false);
    setGandaTim2P1("");
    setGandaTim2P1Phone("");
    setGandaTim2P2("");
    setGandaTim2P2Phone("");
    setSinglePutra("");
    setSinglePutraPhone("");
    setSinglePutri("");
    setSinglePutriPhone("");
    setExtraGandaTeams([]);
    setExtraSinglePutra([]);
    setExtraSinglePutri([]);
    setNotes("");
    setAgreedToRules(false);
  };

  const isHost = selectedBidang === "Teknologi Informasi";

  const addExtraGandaTeam = () => {
    const lockedCount = categoryStatus?.extraGandaTeams?.length || 0;
    const nextNumber = 3 + lockedCount + extraGandaTeams.length;
    setExtraGandaTeams((prev) => [
      ...prev,
      {
        id: `ganda-team-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        teamNumber: nextNumber,
        p1: "",
        p1Phone: "",
        p2: "",
        p2Phone: "",
      },
    ]);
  };

  const removeExtraGandaTeam = (id: string) => {
    setExtraGandaTeams((prev) => prev.filter((item) => item.id !== id));
  };

  const updateExtraGandaTeam = (
    id: string,
    field: "p1" | "p1Phone" | "p2" | "p2Phone",
    value: string
  ) => {
    setExtraGandaTeams((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field.includes("Phone") ? cleanPhoneNumber(value) : value,
          };
        }
        return item;
      })
    );
  };

  const addExtraSinglePutra = () => {
    const lockedCount = categoryStatus?.extraSinglePutra?.length || 0;
    const nextNumber = 2 + lockedCount + extraSinglePutra.length;
    setExtraSinglePutra((prev) => [
      ...prev,
      {
        id: `sp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        playerNumber: nextNumber,
        player: "",
        phone: "",
      },
    ]);
  };

  const removeExtraSinglePutra = (id: string) => {
    setExtraSinglePutra((prev) => prev.filter((item) => item.id !== id));
  };

  const updateExtraSinglePutra = (id: string, field: "player" | "phone", value: string) => {
    setExtraSinglePutra((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === "phone" ? cleanPhoneNumber(value) : value,
          };
        }
        return item;
      })
    );
  };

  const addExtraSinglePutri = () => {
    const lockedCount = categoryStatus?.extraSinglePutri?.length || 0;
    const nextNumber = 2 + lockedCount + extraSinglePutri.length;
    setExtraSinglePutri((prev) => [
      ...prev,
      {
        id: `spi-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        playerNumber: nextNumber,
        player: "",
        phone: "",
      },
    ]);
  };

  const removeExtraSinglePutri = (id: string) => {
    setExtraSinglePutri((prev) => prev.filter((item) => item.id !== id));
  };

  const updateExtraSinglePutri = (id: string, field: "player" | "phone", value: string) => {
    setExtraSinglePutri((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [field]: field === "phone" ? cleanPhoneNumber(value) : value,
          };
        }
        return item;
      })
    );
  };

  // Completely reset everything to a clean empty state for a new registration
  const handleReturnToEmptyForm = () => {
    setSelectedBidang("");
    resetFormFields();
    setCategoryStatus(null);
    setRegisteredData(null);
    setErrorMessage("");
  };

  // Load official Bidang list with skeleton loading state
  useEffect(() => {
    let isMounted = true;
    setIsLoadingBidang(true);
    getBidangList()
      .then((res) => {
        if (isMounted) {
          if (res.bidang && res.bidang.length > 0) {
            const names = res.bidang.map((b) => b.name);
            setBidangOptions(names);
          }
          setIsLoadingBidang(false);
        }
      })
      .catch((err) => {
        console.warn("Error fetching bidang list:", err);
        if (isMounted) setIsLoadingBidang(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Bidang Change: Check category registration status
  const handleBidangChange = async (newBidang: string) => {
    setSelectedBidang(newBidang);
    setErrorMessage("");
    resetFormFields();

    if (!newBidang.trim()) {
      setCategoryStatus(null);
      return;
    }

    setIsCheckingStatus(true);
    try {
      const res = await checkBidangRegistration(newBidang);
      setCategoryStatus(res);
      if (res.isRegistered) {
        setAgreedToRules(true);
      }
    } catch (err) {
      console.warn("Failed checking registration status:", err);
      setCategoryStatus(null);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const isGanda1Locked = !!categoryStatus?.gandaTim1?.isRegistered;
  const isGanda2Locked = !!categoryStatus?.gandaTim2?.isRegistered;
  const isSinglePaLocked = !!categoryStatus?.singlePutra?.isRegistered;
  const isSinglePiLocked = !!categoryStatus?.singlePutri?.isRegistered;
  const isAllLocked = isHost
    ? false
    : isGanda1Locked && isGanda2Locked && isSinglePaLocked && isSinglePiLocked;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedBidang.trim()) {
      showError("Silakan pilih asal bidang dari daftar terlebih dahulu.", "bidangSelect");
      return;
    }

    if (isAllLocked) {
      showError("Seluruh kategori untuk bidang ini sudah terdaftar resmi. Hubungi panitia jika membutuhkan revisi.");
      return;
    }

    const cleanG1P1Phone = cleanPhoneNumber(gandaTim1P1Phone);
    const cleanG1P2Phone = cleanPhoneNumber(gandaTim1P2Phone);
    const cleanG2P1Phone = cleanPhoneNumber(gandaTim2P1Phone);
    const cleanG2P2Phone = cleanPhoneNumber(gandaTim2P2Phone);
    const cleanSinglePaPhone = cleanPhoneNumber(singlePutraPhone);
    const cleanSinglePiPhone = cleanPhoneNumber(singlePutriPhone);

    // 1. Validasi Ganda Tim 1 (hanya jika belum terkunci)
    if (!isGanda1Locked) {
      const hasGandaTim1P1 = !!gandaTim1P1.trim();
      const hasGandaTim1P2 = !!gandaTim1P2.trim();

      if (hasGandaTim1P1) {
        if (!cleanG1P1Phone) {
          showError("Nomor WhatsApp Pemain 1 (Ganda Tim 1) harus diisi.", "gandaTim1P1Phone");
          return;
        }
        const v = validateIndonesianPhone(cleanG1P1Phone);
        if (!v.isValid) {
          showError(`Pemain 1 Ganda Tim 1: ${v.message}`, "gandaTim1P1Phone");
          return;
        }
      }
      if (hasGandaTim1P2) {
        if (!cleanG1P2Phone) {
          showError("Nomor WhatsApp Pemain 2 (Ganda Tim 1) harus diisi.", "gandaTim1P2Phone");
          return;
        }
        const v = validateIndonesianPhone(cleanG1P2Phone);
        if (!v.isValid) {
          showError(`Pemain 2 Ganda Tim 1: ${v.message}`, "gandaTim1P2Phone");
          return;
        }
      }
      if ((hasGandaTim1P1 && !hasGandaTim1P2) || (!hasGandaTim1P1 && hasGandaTim1P2)) {
        showError("Untuk Kategori Ganda Tim 1, harap lengkapi kedua pemain (Pemain 1 & Pemain 2) atau kosongkan jika tidak mendaftar.", !hasGandaTim1P1 ? "gandaTim1P1" : "gandaTim1P2");
        return;
      }
    }

    // 2. Validasi Ganda Tim 2 (hanya jika belum terkunci dan diaktifkan)
    if (!isGanda2Locked && hasGandaTim2) {
      const hasGandaTim2P1 = !!gandaTim2P1.trim();
      const hasGandaTim2P2 = !!gandaTim2P2.trim();

      if (hasGandaTim2P1) {
        if (!cleanG2P1Phone) {
          showError("Nomor WhatsApp Pemain 1 (Ganda Tim 2) harus diisi.", "gandaTim2P1Phone");
          return;
        }
        const v = validateIndonesianPhone(cleanG2P1Phone);
        if (!v.isValid) {
          showError(`Pemain 1 Ganda Tim 2: ${v.message}`, "gandaTim2P1Phone");
          return;
        }
      }
      if (hasGandaTim2P2) {
        if (!cleanG2P2Phone) {
          showError("Nomor WhatsApp Pemain 2 (Ganda Tim 2) harus diisi.", "gandaTim2P2Phone");
          return;
        }
        const v = validateIndonesianPhone(cleanG2P2Phone);
        if (!v.isValid) {
          showError(`Pemain 2 Ganda Tim 2: ${v.message}`, "gandaTim2P2Phone");
          return;
        }
      }
      if ((hasGandaTim2P1 && !hasGandaTim2P2) || (!hasGandaTim2P1 && hasGandaTim2P2)) {
        showError("Untuk Kategori Ganda Tim 2, harap lengkapi kedua pemain (Pemain 1 & Pemain 2) atau hapus Tim 2 jika tidak mendaftar.", !hasGandaTim2P1 ? "gandaTim2P1" : "gandaTim2P2");
        return;
      }
    }

    // 3. Validasi Single Putra (hanya jika belum terkunci)
    if (!isSinglePaLocked && singlePutra.trim()) {
      if (!cleanSinglePaPhone) {
        showError("Nomor WhatsApp Atlet Single Putra harus diisi.", "singlePutraPhone");
        return;
      }
      const v = validateIndonesianPhone(cleanSinglePaPhone);
      if (!v.isValid) {
        showError(`Single Putra: ${v.message}`, "singlePutraPhone");
        return;
      }
    }

    // 4. Validasi Single Putri (hanya jika belum terkunci)
    if (!isSinglePiLocked && singlePutri.trim()) {
      if (!cleanSinglePiPhone) {
        showError("Nomor WhatsApp Atlet Single Putri harus diisi.", "singlePutriPhone");
        return;
      }
      const v = validateIndonesianPhone(cleanSinglePiPhone);
      if (!v.isValid) {
        showError(`Single Putri: ${v.message}`, "singlePutriPhone");
        return;
      }
    }

    // 4b. Validasi Khusus Tuan Rumah (Extra Ganda, Extra Single Putra, Extra Single Putri)
    if (isHost) {
      if (extraGandaTeams.length > 0) {
        for (const t of extraGandaTeams) {
          const hasP1 = !!t.p1.trim();
          const hasP2 = !!t.p2.trim();
          if (hasP1 || hasP2) {
            if (!hasP1 || !hasP2) {
              showError(`Harap lengkapi kedua pemain untuk Tim ${t.teamNumber} Ganda atau hapus tim jika tidak jadi mendaftar.`);
              return;
            }
            if (!t.p1Phone) {
              showError(`Nomor WhatsApp Pemain 1 (Ganda Tim ${t.teamNumber}) harus diisi.`);
              return;
            }
            const v1 = validateIndonesianPhone(t.p1Phone);
            if (!v1.isValid) {
              showError(`Pemain 1 Ganda Tim ${t.teamNumber}: ${v1.message}`);
              return;
            }
            if (!t.p2Phone) {
              showError(`Nomor WhatsApp Pemain 2 (Ganda Tim ${t.teamNumber}) harus diisi.`);
              return;
            }
            const v2 = validateIndonesianPhone(t.p2Phone);
            if (!v2.isValid) {
              showError(`Pemain 2 Ganda Tim ${t.teamNumber}: ${v2.message}`);
              return;
            }
          }
        }
      }

      if (extraSinglePutra.length > 0) {
        for (const sp of extraSinglePutra) {
          if (sp.player.trim()) {
            if (!sp.phone) {
              showError(`Nomor WhatsApp Atlet Single Putra ${sp.playerNumber} harus diisi.`);
              return;
            }
            const v = validateIndonesianPhone(sp.phone);
            if (!v.isValid) {
              showError(`Single Putra ${sp.playerNumber}: ${v.message}`);
              return;
            }
          }
        }
      }

      if (extraSinglePutri.length > 0) {
        for (const spi of extraSinglePutri) {
          if (spi.player.trim()) {
            if (!spi.phone) {
              showError(`Nomor WhatsApp Atlet Single Putri ${spi.playerNumber} harus diisi.`);
              return;
            }
            const v = validateIndonesianPhone(spi.phone);
            if (!v.isValid) {
              showError(`Single Putri ${spi.playerNumber}: ${v.message}`);
              return;
            }
          }
        }
      }
    }

    // 5. Harus ada minimal 1 kategori baru yang didaftarkan pada pengiriman ini
    const hasNewGanda1 = !isGanda1Locked && !!(gandaTim1P1.trim() && gandaTim1P2.trim());
    const hasNewGanda2 = !isGanda2Locked && hasGandaTim2 && !!(gandaTim2P1.trim() && gandaTim2P2.trim());
    const hasNewSinglePa = !isSinglePaLocked && !!singlePutra.trim();
    const hasNewSinglePi = !isSinglePiLocked && !!singlePutri.trim();
    const hasValidExtraGanda = isHost && extraGandaTeams.some((t) => t.p1.trim() && t.p2.trim());
    const hasValidExtraSinglePa = isHost && extraSinglePutra.some((sp) => sp.player.trim());
    const hasValidExtraSinglePi = isHost && extraSinglePutri.some((spi) => spi.player.trim());

    if (
      !hasNewGanda1 &&
      !hasNewGanda2 &&
      !hasNewSinglePa &&
      !hasNewSinglePi &&
      !hasValidExtraGanda &&
      !hasValidExtraSinglePa &&
      !hasValidExtraSinglePi
    ) {
      showError("Silakan isi data minimal 1 kategori atlet yang belum didaftarkan.");
      return;
    }

    // 6. Checkbox persetujuan HARUS dicentang
    if (!agreedToRules) {
      showError("Harap centang kotak persetujuan ketentuan partisipasi turnamen.", "rules");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: BidangFullRegistrationPayload = {
        bidangName: selectedBidang,
        gandaTim1Player1: hasNewGanda1 ? gandaTim1P1.trim() : undefined,
        gandaTim1Player1Phone: hasNewGanda1 ? cleanG1P1Phone : undefined,
        gandaTim1Player2: hasNewGanda1 ? gandaTim1P2.trim() : undefined,
        gandaTim1Player2Phone: hasNewGanda1 ? cleanG1P2Phone : undefined,
        hasGandaTim2: !!hasNewGanda2,
        gandaTim2Player1: hasNewGanda2 ? gandaTim2P1.trim() : undefined,
        gandaTim2Player1Phone: hasNewGanda2 ? cleanG2P1Phone : undefined,
        gandaTim2Player2: hasNewGanda2 ? gandaTim2P2.trim() : undefined,
        gandaTim2Player2Phone: hasNewGanda2 ? cleanG2P2Phone : undefined,
        singlePutraPlayer: hasNewSinglePa ? singlePutra.trim() : undefined,
        singlePutraPhone: hasNewSinglePa ? cleanSinglePaPhone : undefined,
        singlePutriPlayer: hasNewSinglePi ? singlePutri.trim() : undefined,
        singlePutriPhone: hasNewSinglePi ? cleanSinglePiPhone : undefined,
        extraGandaTeams: isHost && extraGandaTeams.length > 0
          ? extraGandaTeams
              .filter((t) => t.p1.trim() && t.p2.trim())
              .map((t) => ({
                teamNumber: t.teamNumber,
                player1: t.p1.trim(),
                phone1: cleanPhoneNumber(t.p1Phone),
                player2: t.p2.trim(),
                phone2: cleanPhoneNumber(t.p2Phone),
              }))
          : undefined,
        extraSinglePutra: isHost && extraSinglePutra.length > 0
          ? extraSinglePutra
              .filter((sp) => sp.player.trim())
              .map((sp) => ({
                playerNumber: sp.playerNumber,
                player: sp.player.trim(),
                phone: cleanPhoneNumber(sp.phone),
              }))
          : undefined,
        extraSinglePutri: isHost && extraSinglePutri.length > 0
          ? extraSinglePutri
              .filter((spi) => spi.player.trim())
              .map((spi) => ({
                playerNumber: spi.playerNumber,
                player: spi.player.trim(),
                phone: cleanPhoneNumber(spi.phone),
              }))
          : undefined,
        notes,
      };

      const res = await submitBidangFullRegistration(payload);

      if (!res.success || !res.data) {
        showError(res.message || "Gagal mengirim formulir pendaftaran.");
      } else {
        setRegisteredData(res.data);
        if (res.message && res.message.includes("otomatis dialokasikan")) {
          setSuccessNotice(res.message);
        } else {
          setSuccessNotice("");
        }
        onSuccess?.(res.data);
      }
    } catch (err: unknown) {
      const error = err as Error;
      showError(error?.message || "Terjadi kendala saat mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN: Refined Luxury Digital Athlete Tournament Pass (Simple, Elegant, Light Theme, High-Value)
  if (registeredData) {
    const hasGanda1 = !!(registeredData.ganda_tim1_player1 && registeredData.ganda_tim1_player2);
    const hasGanda2 = !!(registeredData.ganda_tim2_player1 && registeredData.ganda_tim2_player2);
    const hasSinglePa = !!registeredData.single_putra_player;
    const hasSinglePi = !!registeredData.single_putri_player;

    let extraGandaPass: { teamNumber: number; player1: string; phone1?: string; player2: string; phone2?: string }[] = [];
    let extraSinglePaPass: { playerNumber: number; player: string; phone?: string }[] = [];
    let extraSinglePiPass: { playerNumber: number; player: string; phone?: string }[] = [];

    if (registeredData.notes) {
      try {
        if (registeredData.notes.includes("extraGandaTeams") || registeredData.notes.startsWith("{")) {
          const parsed = JSON.parse(registeredData.notes);
          if (Array.isArray(parsed.extraGandaTeams)) extraGandaPass = parsed.extraGandaTeams;
          if (Array.isArray(parsed.extraSinglePutra)) extraSinglePaPass = parsed.extraSinglePutra;
          if (Array.isArray(parsed.extraSinglePutri)) extraSinglePiPass = parsed.extraSinglePutri;
        }
      } catch {
        // ignore
      }
    }

    return (
      <div className="max-w-xl mx-auto py-6 px-3 sm:px-0">
        {/* Subtle Status Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center mx-auto mb-3 text-emerald-600 shadow-sm shadow-emerald-500/10">
            <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
            Pendaftaran Diterima
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Tiket Delegasi Turnamen
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Simpan atau screenshot kartu pass ini sebagai bukti sah keikutsertaan turnamen bola 8 antar bidang.
          </p>
        </div>

        {/* Smart Concurrency / Auto-shift Team Allocation Alert */}
        {successNotice && (
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 text-xs sm:text-sm font-medium flex items-start gap-3 shadow-xs">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-amber-950 flex items-center gap-1.5">
                <span>Penyesuaian Nomor Tim Otomatis</span>
              </p>
              <p className="leading-relaxed text-amber-900/90">{successNotice}</p>
            </div>
          </div>
        )}

        {/* UNIFIED LUXURY PASS CARD */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/[0.04] overflow-hidden text-left">
          {/* Top Championship Hairline Accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

          {/* Card Brand Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center font-black text-xs text-red-600 shadow-2xs">
                GO
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 tracking-wide">
                  TI BILLIARD CUP 2026
                </h4>
                <p className="text-[11px] font-semibold text-slate-400">
                  Turnamen Bola 8 Antar Bidang
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Resmi</span>
            </span>
          </div>

          {/* Asal Bidang & Venue Section */}
          <div className="p-5 sm:p-6 bg-slate-50/50 border-b border-slate-100 space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Asal Bidang Kontingen
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
                {registeredData.bidang_name || registeredData.club_name}
              </h3>
            </div>

            <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs font-semibold text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{TOURNAMENT_CONFIG.venue}</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{TOURNAMENT_CONFIG.date_range}</span>
              </span>
            </div>
          </div>

          {/* Roster of Registered Athletes */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
                Daftar Atlet Terdaftar
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Ganesha Operation
              </span>
            </div>

            <div className="space-y-3">
              {/* 1. Ganda (Campuran / Bebas) Tim 1 */}
              {hasGanda1 && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-red-700 bg-red-50 border border-red-200/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1.5">
                      <Users2 className="w-3 h-3 text-red-600" />
                      Ganda (Tim 1)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Siap Tanding
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pemain 1</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5 truncate">
                        {registeredData.ganda_tim1_player1}
                      </p>
                      {registeredData.ganda_tim1_player1_phone && (
                        <a
                          href={`https://wa.me/${registeredData.ganda_tim1_player1_phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 font-mono"
                        >
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="break-all">{registeredData.ganda_tim1_player1_phone}</span>
                        </a>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pemain 2</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5 truncate">
                        {registeredData.ganda_tim1_player2}
                      </p>
                      {registeredData.ganda_tim1_player2_phone && (
                        <a
                          href={`https://wa.me/${registeredData.ganda_tim1_player2_phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 font-mono"
                        >
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="break-all">{registeredData.ganda_tim1_player2_phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Ganda (Campuran / Bebas) Tim 2 (jika ada) */}
              {hasGanda2 && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1.5">
                      <Users2 className="w-3 h-3 text-amber-600" />
                      Ganda (Tim 2)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Siap Tanding
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pemain 1</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5 truncate">
                        {registeredData.ganda_tim2_player1}
                      </p>
                      {registeredData.ganda_tim2_player1_phone && (
                        <a
                          href={`https://wa.me/${registeredData.ganda_tim2_player1_phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 font-mono"
                        >
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="break-all">{registeredData.ganda_tim2_player1_phone}</span>
                        </a>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pemain 2</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5 truncate">
                        {registeredData.ganda_tim2_player2}
                      </p>
                      {registeredData.ganda_tim2_player2_phone && (
                        <a
                          href={`https://wa.me/${registeredData.ganda_tim2_player2_phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 font-mono"
                        >
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="break-all">{registeredData.ganda_tim2_player2_phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Extra Ganda Teams Pass */}
              {extraGandaPass.map((eg) => (
                <div key={eg.teamNumber} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-amber-700 bg-amber-50 border border-amber-200/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1.5">
                      <Users2 className="w-3 h-3 text-amber-600" />
                      Ganda (Tim {eg.teamNumber})
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Siap Tanding
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pemain 1</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5 truncate">{eg.player1}</p>
                      {eg.phone1 && (
                        <a
                          href={`https://wa.me/${eg.phone1.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 font-mono"
                        >
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="break-all">{eg.phone1}</span>
                        </a>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Pemain 2</span>
                      <p className="text-sm font-black text-slate-900 mt-0.5 truncate">{eg.player2}</p>
                      {eg.phone2 && (
                        <a
                          href={`https://wa.me/${eg.phone2.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 font-mono"
                        >
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="break-all">{eg.phone2}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* 3. Single Putra */}
              {hasSinglePa && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5">
                      <User className="w-3 h-3 text-blue-600" />
                      Single Putra
                    </span>
                    <p className="text-sm font-black text-slate-900 mt-1.5">
                      {registeredData.single_putra_player}
                    </p>
                  </div>
                  {registeredData.single_putra_phone && (
                    <a
                      href={`https://wa.me/${registeredData.single_putra_phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors font-mono self-start sm:self-center"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{registeredData.single_putra_phone}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Extra Single Putra Pass */}
              {extraSinglePaPass.map((esp) => (
                <div key={esp.playerNumber} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-200/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5">
                      <User className="w-3 h-3 text-blue-600" />
                      Single Putra (Atlet {esp.playerNumber})
                    </span>
                    <p className="text-sm font-black text-slate-900 mt-1.5">
                      {esp.player}
                    </p>
                  </div>
                  {esp.phone && (
                    <a
                      href={`https://wa.me/${esp.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors font-mono self-start sm:self-center"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{esp.phone}</span>
                    </a>
                  )}
                </div>
              ))}

              {/* 4. Single Putri */}
              {hasSinglePi && (
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black text-pink-700 bg-pink-50 border border-pink-200/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5">
                      <User className="w-3 h-3 text-pink-600" />
                      Single Putri
                    </span>
                    <p className="text-sm font-black text-slate-900 mt-1.5">
                      {registeredData.single_putri_player}
                    </p>
                  </div>
                  {registeredData.single_putri_phone && (
                    <a
                      href={`https://wa.me/${registeredData.single_putri_phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors font-mono self-start sm:self-center"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{registeredData.single_putri_phone}</span>
                    </a>
                  )}
                </div>
              )}

              {/* Extra Single Putri Pass */}
              {extraSinglePiPass.map((espi) => (
                <div key={espi.playerNumber} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-black text-pink-700 bg-pink-50 border border-pink-200/70 px-2.5 py-0.5 rounded-md uppercase tracking-wider inline-flex items-center gap-1.5">
                      <User className="w-3 h-3 text-pink-600" />
                      Single Putri (Atlet {espi.playerNumber})
                    </span>
                    <p className="text-sm font-black text-slate-900 mt-1.5">
                      {espi.player}
                    </p>
                  </div>
                  {espi.phone && (
                    <a
                      href={`https://wa.me/${espi.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-emerald-50 text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors font-mono self-start sm:self-center"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{espi.phone}</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Integrated WhatsApp Group Action Banner (Seamless inside pass) */}
          <div className="p-5 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-emerald-50/90 border-t border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/30">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  Wajib Gabung WhatsApp Group Peserta
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Untuk koordinasi jadwal tanding, drawing bagan, dan TM.
                </p>
              </div>
            </div>

            <a
              href={TOURNAMENT_CONFIG.whatsapp_group_link || "https://chat.whatsapp.com/GTBsTJSt1mw4AaT1DiPUzf?mode=gi_t"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm shadow-emerald-600/20 active:scale-[0.98] transition-all text-center shrink-0"
            >
              <span>Gabung Grup WA</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* TWO CLEAN ACTION BUTTONS */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <Link
            href="/participants"
            className="w-full sm:w-auto min-w-[180px] h-11 px-6 rounded-xl text-xs sm:text-sm font-bold btn-championship-red flex items-center justify-center gap-2 shadow-sm shadow-red-500/20 text-center"
          >
            <Users className="w-4 h-4" />
            <span>Lihat Daftar Peserta</span>
          </Link>

          <button
            onClick={handleReturnToEmptyForm}
            className="w-full sm:w-auto min-w-[140px] h-11 px-5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 flex items-center justify-center gap-2 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Kembali</span>
          </button>
        </div>

        {/* Panitia Contact Footer */}
        <div className="mt-5 text-center text-[11px] text-slate-400 font-medium">
          <span>Perlu revisi atlet? Hubungi Panitia: </span>
          <a
            href={`https://wa.me/${TOURNAMENT_CONFIG.contact_sean}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Sean (0851-8997-0998)
          </a>
          <span> • </span>
          <a
            href={`https://wa.me/${TOURNAMENT_CONFIG.contact_novi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Novi (0856-2405-5869)
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4 w-full min-w-0 max-w-full">
      <div className="space-y-6">
        {/* Header Form Card */}
        <div className="rounded-3xl bg-white border-t-8 border-t-red-600 border border-slate-200/90 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 text-red-600 text-xs font-black uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" />
            <span>Formulir Pendaftaran Resmi Antar Bidang</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Pendaftaran Delegasi TI BILLIARD CUP 2026 (BOLA 8)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
            Sesuai surat undangan resmi Bidang Teknologi Informasi, setiap bidang di lingkungan kerja Ganesha Operation dipersilakan mendaftarkan kontingennya secara <strong>GRATIS</strong> untuk memperebutkan <strong>Piala Bergilir Direktur Perencanaan</strong>.
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-red-700 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200">
              <Trophy className="w-3.5 h-3.5 text-red-600" /> Biaya: GRATIS
            </span>
            <span className="flex items-center gap-1.5 text-amber-800 font-bold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <Calendar className="w-3.5 h-3.5 text-amber-600" /> Batas: Selasa, 1 Desember 2026
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold bg-slate-100 px-3 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-slate-600" /> TM: Rabu, 2 Desember 2026
            </span>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div
            ref={topErrorRef}
            className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: ASAL BIDANG */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building className="w-4 h-4 text-red-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                1. Asal Bidang di Ganesha Operation
              </h3>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Pilih Bidang *
              </label>
              <div className="relative w-full">
                <select
                  id="bidangSelect"
                  value={selectedBidang}
                  onChange={(e) => handleBidangChange(e.target.value)}
                  className="w-full appearance-none px-4 pr-10 py-3 text-base sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-bold text-slate-900 cursor-pointer shadow-2xs"
                >
                  <option value="">
                    -- Pilih Asal Bidang di Ganesha Operation --
                  </option>
                  {bidangOptions.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  {isCheckingStatus ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </div>
              </div>
              <span className="text-[11px] text-slate-400 mt-1.5 block">
                * Pilihan 20 bidang terdaftar resmi di lingkungan kerja Ganesha Operation
              </span>
            </div>

            {/* Checking Status Indicator */}
            {isCheckingStatus && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                <span>Memeriksa status pendaftaran bidang...</span>
              </div>
            )}

            {/* Prompt if no bidang selected yet */}
            {!selectedBidang && !isCheckingStatus && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-medium">
                Pilih salah satu dari 20 asal bidang di atas untuk memeriksa status dan memulai pendaftaran atlet.
              </div>
            )}

            {/* GOLDEN HOST PRIVILEGE BANNER FOR TEKNOLOGI INFORMASI */}
            {isHost && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/40 border-2 border-amber-300/90 text-amber-950 shadow-xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                    ★
                  </span>
                  <h4 className="font-black text-xs sm:text-sm text-amber-900 uppercase tracking-tight">
                    Hak Istimewa Tuan Rumah (Bidang Teknologi Informasi)
                  </h4>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Sebagai panitia &amp; tuan rumah turnamen, <strong>Bidang Teknologi Informasi tidak memiliki batasan kuota pendaftaran</strong>. Anda bebas mendaftarkan tim Ganda (Campuran/Bebas), atlet Single Putra, dan atlet Single Putri sebanyak-banyaknya tanpa batasan maksimal.
                </p>
              </div>
            )}

            {/* ALL CATEGORIES FULLY REGISTERED LOCK BANNER */}
            {isAllLocked && (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 shadow-xs space-y-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0 mt-0.5">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-amber-950 uppercase tracking-tight">
                      SELURUH KATEGORI TELAH TERDAFTAR RESMI &amp; TERKUNCI
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      Bidang <strong>{selectedBidang}</strong> telah mendaftarkan seluruh kategori kontingen (Ganda Campuran/Bebas, Single Putra, dan Single Putri). Demi integritas pengundian bagan, data <strong>tidak dapat diubah secara mandiri</strong>.
                    </p>
                  </div>
                </div>

                <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-800">
                    Perlu revisi susunan atlet atau koreksi nomor kontak?
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Silakan hubungi Panitia TI Billiard Cup 2026 melalui WhatsApp resmi:
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <a
                    href={`https://wa.me/${TOURNAMENT_CONFIG.contact_sean}?text=Halo%20Sean%20(Panitia%20TI%20Billiard%20Cup),%20saya%20dari%20bidang%20${encodeURIComponent(selectedBidang)}%20ingin%20mengajukan%20perubahan/revisi%20data%20atlet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Chat Sean - TI (0851-8997-0998)</span>
                  </a>

                  <a
                    href={`https://wa.me/${TOURNAMENT_CONFIG.contact_novi}?text=Halo%20Novi%20(Panitia%20TI%20Billiard%20Cup),%20saya%20dari%20bidang%20${encodeURIComponent(selectedBidang)}%20ingin%20mengajukan%20perubahan/revisi%20data%20atlet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Chat Novi - Panitia (0856-2405-5869)</span>
                  </a>
                </div>
              </div>
            )}

            {/* PARTIAL REGISTRATION INFO BANNER */}
            {categoryStatus?.isRegistered && !isAllLocked && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-2xs space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <h4 className="font-black text-xs sm:text-sm text-emerald-950 uppercase tracking-tight">
                    Pendaftaran Bertahap Aktif
                  </h4>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Bidang <strong>{selectedBidang}</strong> sudah mendaftarkan sebagian kategori (ditandai badge <strong>Terkunci</strong>). Anda dapat melanjutkan pendaftaran untuk kategori lain yang belum terdaftar di bawah ini.
                </p>
              </div>
            )}
          </div>

          {/* SECTION 2: KATEGORI GANDA (CAMPURAN / BEBAS) */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Users2 className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    2. Kategori Ganda (Campuran / Bebas)
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Bebas mendaftarkan pasangan Ganda Campuran (Putra &amp; Putri), Putra &amp; Putra, maupun Putri &amp; Putri.
                </p>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isHost
                    ? "text-amber-800 bg-amber-50 border-amber-200"
                    : "text-red-700 bg-red-50 border-red-200"
                }`}
              >
                {isHost ? "Tuan Rumah: Kuota Bebas (Tanpa Batas)" : "Maksimal 2 Tim • 2 Orang per Tim"}
              </span>
            </div>

            {/* Tim 1 Ganda */}
            {isGanda1Locked ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    Tim 1 Ganda: Terdaftar Resmi
                  </span>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    Terkunci
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-white border border-amber-200/60 shadow-2xs min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pemain 1</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5 truncate">
                      {categoryStatus?.gandaTim1?.player1}
                    </p>
                    {categoryStatus?.gandaTim1?.phone1 && (
                      <p className="text-slate-600 font-medium text-xs mt-1 flex items-center gap-1 min-w-0 max-w-full overflow-hidden">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="break-all font-mono">{categoryStatus.gandaTim1.phone1}</span>
                      </p>
                    )}
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-amber-200/60 shadow-2xs min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pemain 2</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5 truncate">
                      {categoryStatus?.gandaTim1?.player2}
                    </p>
                    {categoryStatus?.gandaTim1?.phone2 && (
                      <p className="text-slate-600 font-medium text-xs mt-1 flex items-center gap-1 min-w-0 max-w-full overflow-hidden">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="break-all font-mono">{categoryStatus.gandaTim1.phone2}</span>
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-[11px] text-amber-800 font-medium">
                  Kategori Ganda Tim 1 sudah terdaftar. Hubungi panitia jika membutuhkan revisi pemain.
                </p>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    Tim 1 Ganda (Campuran / Bebas)
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">2 Atlet</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Pemain 1
                    </label>
                    <input
                      id="gandaTim1P1"
                      type="text"
                      placeholder="Contoh: Rudolf Sidauruk"
                      value={gandaTim1P1}
                      onChange={(e) => setGandaTim1P1(e.target.value)}
                      disabled={!selectedBidang || isAllLocked}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nomor WhatsApp Pemain 1
                    </label>
                    <input
                      id="gandaTim1P1Phone"
                      type="tel"
                      inputMode="tel"
                      maxLength={14}
                      placeholder="Contoh: 08123456789"
                      value={gandaTim1P1Phone}
                      onChange={(e) => handlePhoneInputChange(e.target.value, setGandaTim1P1Phone)}
                      onBlur={() => setGandaTim1P1Phone(cleanPhoneNumber(gandaTim1P1Phone))}
                      disabled={!selectedBidang || isAllLocked}
                      className={`w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border ${
                        gandaTim1P1Phone && !validateIndonesianPhone(gandaTim1P1Phone).isValid
                          ? "border-red-400 bg-red-50/20 text-red-900 focus:border-red-500"
                          : "border-slate-200 focus:border-red-500 text-slate-900"
                      } focus:outline-none font-medium disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed`}
                    />
                    {gandaTim1P1Phone && !validateIndonesianPhone(gandaTim1P1Phone).isValid && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{validateIndonesianPhone(gandaTim1P1Phone).message}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Pemain 2
                    </label>
                    <input
                      id="gandaTim1P2"
                      type="text"
                      placeholder="Contoh: Eko Prasetyo"
                      value={gandaTim1P2}
                      onChange={(e) => setGandaTim1P2(e.target.value)}
                      disabled={!selectedBidang || isAllLocked}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nomor WhatsApp Pemain 2
                    </label>
                    <input
                      id="gandaTim1P2Phone"
                      type="tel"
                      inputMode="tel"
                      maxLength={14}
                      placeholder="Contoh: 08123456789"
                      value={gandaTim1P2Phone}
                      onChange={(e) => handlePhoneInputChange(e.target.value, setGandaTim1P2Phone)}
                      onBlur={() => setGandaTim1P2Phone(cleanPhoneNumber(gandaTim1P2Phone))}
                      disabled={!selectedBidang || isAllLocked}
                      className={`w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border ${
                        gandaTim1P2Phone && !validateIndonesianPhone(gandaTim1P2Phone).isValid
                          ? "border-red-400 bg-red-50/20 text-red-900 focus:border-red-500"
                          : "border-slate-200 focus:border-red-500 text-slate-900"
                      } focus:outline-none font-medium disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed`}
                    />
                    {gandaTim1P2Phone && !validateIndonesianPhone(gandaTim1P2Phone).isValid && (
                      <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{validateIndonesianPhone(gandaTim1P2Phone).message}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tim 2 Ganda (Campuran / Bebas) */}
            {isGanda2Locked ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    Tim 2 Ganda: Terdaftar Resmi
                  </span>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    Terkunci
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-white border border-amber-200/60 shadow-2xs min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pemain 1</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5 truncate">
                      {categoryStatus?.gandaTim2?.player1}
                    </p>
                    {categoryStatus?.gandaTim2?.phone1 && (
                      <p className="text-slate-600 font-medium text-xs mt-1 flex items-center gap-1 min-w-0 max-w-full overflow-hidden">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="break-all font-mono">{categoryStatus.gandaTim2.phone1}</span>
                      </p>
                    )}
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-amber-200/60 shadow-2xs min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pemain 2</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5 truncate">
                      {categoryStatus?.gandaTim2?.player2}
                    </p>
                    {categoryStatus?.gandaTim2?.phone2 && (
                      <p className="text-slate-600 font-medium text-xs mt-1 flex items-center gap-1 min-w-0 max-w-full overflow-hidden">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="break-all font-mono">{categoryStatus.gandaTim2.phone2}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-1">
                {!hasGandaTim2 ? (
                  <button
                    type="button"
                    onClick={() => setHasGandaTim2(true)}
                    disabled={!selectedBidang || isAllLocked}
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-red-300 bg-red-50/50 hover:bg-red-50 text-red-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusCircle className="w-4 h-4 text-red-600" />
                    <span>+ Tambah Tim 2 Ganda (Campuran / Bebas)</span>
                  </button>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                        Tim 2 Ganda (Campuran / Bebas)
                      </span>
                      <button
                        type="button"
                        onClick={() => setHasGandaTim2(false)}
                        className="text-slate-400 hover:text-red-600 text-xs flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Hapus Tim 2</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nama Pemain 1 (Tim 2)
                        </label>
                        <input
                          id="gandaTim2P1"
                          type="text"
                          placeholder="Nama Pemain 1"
                          value={gandaTim2P1}
                          onChange={(e) => setGandaTim2P1(e.target.value)}
                          disabled={!selectedBidang || isAllLocked}
                          className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nomor WhatsApp Pemain 1 (Tim 2)
                        </label>
                        <input
                          id="gandaTim2P1Phone"
                          type="tel"
                          inputMode="tel"
                          maxLength={14}
                          placeholder="Contoh: 08123456789"
                          value={gandaTim2P1Phone}
                          onChange={(e) => handlePhoneInputChange(e.target.value, setGandaTim2P1Phone)}
                          onBlur={() => setGandaTim2P1Phone(cleanPhoneNumber(gandaTim2P1Phone))}
                          disabled={!selectedBidang || isAllLocked}
                          className={`w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border ${
                            gandaTim2P1Phone && !validateIndonesianPhone(gandaTim2P1Phone).isValid
                              ? "border-red-400 bg-red-50/20 text-red-900 focus:border-red-500"
                              : "border-slate-200 focus:border-red-500 text-slate-900"
                          } focus:outline-none font-medium disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed`}
                        />
                        {gandaTim2P1Phone && !validateIndonesianPhone(gandaTim2P1Phone).isValid && (
                          <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{validateIndonesianPhone(gandaTim2P1Phone).message}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nama Pemain 2 (Tim 2)
                        </label>
                        <input
                          id="gandaTim2P2"
                          type="text"
                          placeholder="Nama Pemain 2"
                          value={gandaTim2P2}
                          onChange={(e) => setGandaTim2P2(e.target.value)}
                          disabled={!selectedBidang || isAllLocked}
                          className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nomor WhatsApp Pemain 2 (Tim 2)
                        </label>
                        <input
                          id="gandaTim2P2Phone"
                          type="tel"
                          inputMode="tel"
                          maxLength={14}
                          placeholder="Contoh: 08123456789"
                          value={gandaTim2P2Phone}
                          onChange={(e) => handlePhoneInputChange(e.target.value, setGandaTim2P2Phone)}
                          onBlur={() => setGandaTim2P2Phone(cleanPhoneNumber(gandaTim2P2Phone))}
                          disabled={!selectedBidang || isAllLocked}
                          className={`w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border ${
                            gandaTim2P2Phone && !validateIndonesianPhone(gandaTim2P2Phone).isValid
                              ? "border-red-400 bg-red-50/20 text-red-900 focus:border-red-500"
                              : "border-slate-200 focus:border-red-500 text-slate-900"
                          } focus:outline-none font-medium disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed`}
                        />
                        {gandaTim2P2Phone && !validateIndonesianPhone(gandaTim2P2Phone).isValid && (
                          <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{validateIndonesianPhone(gandaTim2P2Phone).message}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Locked Extra Ganda Teams (Host) */}
            {categoryStatus?.extraGandaTeams && categoryStatus.extraGandaTeams.map((eg) => (
              <div key={eg.teamNumber} className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    Tim {eg.teamNumber} Ganda (Campuran / Bebas): Terdaftar Resmi
                  </span>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    Terkunci
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-3 rounded-xl bg-white border border-amber-200/60 shadow-2xs min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pemain 1</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5 truncate">{eg.player1}</p>
                    {eg.phone1 && (
                      <p className="text-slate-600 font-medium text-xs mt-1 flex items-center gap-1 min-w-0 max-w-full overflow-hidden">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="break-all font-mono">{eg.phone1}</span>
                      </p>
                    )}
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-amber-200/60 shadow-2xs min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pemain 2</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5 truncate">{eg.player2}</p>
                    {eg.phone2 && (
                      <p className="text-slate-600 font-medium text-xs mt-1 flex items-center gap-1 min-w-0 max-w-full overflow-hidden">
                        <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="break-all font-mono">{eg.phone2}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Active Extra Ganda Teams (Host) */}
            {extraGandaTeams.map((team) => (
              <div key={team.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    Tim {team.teamNumber} Ganda (Campuran / Bebas)
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExtraGandaTeam(team.id)}
                    className="text-slate-400 hover:text-red-600 text-xs flex items-center gap-1 font-bold"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Hapus Tim {team.teamNumber}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Pemain 1 (Tim {team.teamNumber})
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Pemain 1"
                      value={team.p1}
                      onChange={(e) => updateExtraGandaTeam(team.id, "p1", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nomor WhatsApp Pemain 1 (Tim {team.teamNumber})
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      maxLength={14}
                      placeholder="Contoh: 08123456789"
                      value={team.p1Phone}
                      onChange={(e) => updateExtraGandaTeam(team.id, "p1Phone", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Pemain 2 (Tim {team.teamNumber})
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Pemain 2"
                      value={team.p2}
                      onChange={(e) => updateExtraGandaTeam(team.id, "p2", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nomor WhatsApp Pemain 2 (Tim {team.teamNumber})
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      maxLength={14}
                      placeholder="Contoh: 08123456789"
                      value={team.p2Phone}
                      onChange={(e) => updateExtraGandaTeam(team.id, "p2Phone", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Host Button to Add Unlimited Ganda Teams */}
            {isHost && (
              <button
                type="button"
                onClick={addExtraGandaTeam}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 hover:bg-amber-50 text-amber-800 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-amber-600" />
                <span>+ Tambah Tim Ganda Lagi (Tanpa Batas)</span>
              </button>
            )}
          </div>

          {/* SECTION 3: KATEGORI SINGLE PUTRA */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  3. Kategori Single Putra
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isHost
                    ? "text-blue-800 bg-blue-50 border-blue-200"
                    : "text-slate-700 bg-slate-100 border-slate-200"
                }`}
              >
                {isHost ? "Tuan Rumah: Bebas Tambah Atlet" : "1 Tim • 1 Orang"}
              </span>
            </div>

            {isSinglePaLocked ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    Single Putra: Terdaftar Resmi
                  </span>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    Terkunci
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-amber-200/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 min-w-0">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Nama Atlet</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5 truncate">
                      {categoryStatus?.singlePutra?.player}
                    </p>
                  </div>
                  {categoryStatus?.singlePutra?.phone && (
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs min-w-0 max-w-full overflow-hidden">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="break-all font-mono">{categoryStatus.singlePutra.phone}</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-amber-800 font-medium">
                  Kategori Single Putra sudah terdaftar resmi. Hubungi panitia jika membutuhkan revisi pemain.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap Atlet Single Putra
                  </label>
                  <input
                    id="singlePutra"
                    type="text"
                    placeholder="Contoh: Ahmad Fauzi"
                    value={singlePutra}
                    onChange={(e) => setSinglePutra(e.target.value)}
                    disabled={!selectedBidang || isAllLocked}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 font-medium text-slate-900 transition-colors disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nomor WhatsApp Atlet
                  </label>
                  <input
                    id="singlePutraPhone"
                    type="tel"
                    inputMode="tel"
                    maxLength={14}
                    placeholder="Contoh: 08123456789"
                    value={singlePutraPhone}
                    onChange={(e) => handlePhoneInputChange(e.target.value, setSinglePutraPhone)}
                    onBlur={() => setSinglePutraPhone(cleanPhoneNumber(singlePutraPhone))}
                    disabled={!selectedBidang || isAllLocked}
                    className={`w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-slate-50 border ${
                      singlePutraPhone && !validateIndonesianPhone(singlePutraPhone).isValid
                        ? "border-red-400 bg-red-50/20 text-red-900 focus:border-red-500"
                        : "border-slate-200 focus:bg-white focus:border-red-500 text-slate-900"
                    } focus:outline-none font-medium transition-colors disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed`}
                  />
                  {singlePutraPhone && !validateIndonesianPhone(singlePutraPhone).isValid && (
                    <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{validateIndonesianPhone(singlePutraPhone).message}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Locked Extra Single Putra (Host) */}
            {categoryStatus?.extraSinglePutra && categoryStatus.extraSinglePutra.map((esp) => (
              <div key={esp.playerNumber} className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    Single Putra (Atlet {esp.playerNumber}): Terdaftar Resmi
                  </span>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    Terkunci
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-amber-200/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 min-w-0">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Nama Atlet</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5 truncate">{esp.player}</p>
                  </div>
                  {esp.phone && (
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs min-w-0 max-w-full overflow-hidden">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="break-all font-mono">{esp.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Active Extra Single Putra Inputs (Host) */}
            {extraSinglePutra.map((sp) => (
              <div key={sp.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    Atlet Single Putra {sp.playerNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExtraSinglePutra(sp.id)}
                    className="text-slate-400 hover:text-red-600 text-xs flex items-center gap-1 font-bold"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Hapus Atlet {sp.playerNumber}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap Atlet Single Putra {sp.playerNumber}
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Lengkap Atlet"
                      value={sp.player}
                      onChange={(e) => updateExtraSinglePutra(sp.id, "player", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor WhatsApp Atlet
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      maxLength={14}
                      placeholder="Contoh: 08123456789"
                      value={sp.phone}
                      onChange={(e) => updateExtraSinglePutra(sp.id, "phone", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Host Button to Add More Single Putra */}
            {isHost && (
              <button
                type="button"
                onClick={addExtraSinglePutra}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-blue-300 bg-blue-50/50 hover:bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <span>+ Tambah Atlet Single Putra Lainnya</span>
              </button>
            )}
          </div>

          {/* SECTION 4: KATEGORI SINGLE PUTRI */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  4. Kategori Single Putri
                </h3>
              </div>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isHost
                    ? "text-rose-800 bg-rose-50 border-rose-200"
                    : "text-slate-700 bg-slate-100 border-slate-200"
                }`}
              >
                {isHost ? "Tuan Rumah: Bebas Tambah Atlet" : "1 Tim • 1 Orang"}
              </span>
            </div>

            {isSinglePiLocked ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    Single Putri: Terdaftar Resmi
                  </span>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    Terkunci
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-amber-200/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 min-w-0">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Nama Atlet</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5 truncate">
                      {categoryStatus?.singlePutri?.player}
                    </p>
                  </div>
                  {categoryStatus?.singlePutri?.phone && (
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs min-w-0 max-w-full overflow-hidden">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="break-all font-mono">{categoryStatus.singlePutri.phone}</span>
                    </div>
                  )}
                </div>
                <p className="text-[11px] text-amber-800 font-medium">
                  Kategori Single Putri sudah terdaftar resmi. Hubungi panitia jika membutuhkan revisi pemain.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nama Lengkap Atlet Single Putri
                  </label>
                  <input
                    id="singlePutri"
                    type="text"
                    placeholder="Contoh: Dewi Lestari"
                    value={singlePutri}
                    onChange={(e) => setSinglePutri(e.target.value)}
                    disabled={!selectedBidang || isAllLocked}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 font-medium text-slate-900 transition-colors disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nomor WhatsApp Atlet
                  </label>
                  <input
                    id="singlePutriPhone"
                    type="tel"
                    inputMode="tel"
                    maxLength={14}
                    placeholder="Contoh: 08123456789"
                    value={singlePutriPhone}
                    onChange={(e) => handlePhoneInputChange(e.target.value, setSinglePutriPhone)}
                    onBlur={() => setSinglePutriPhone(cleanPhoneNumber(singlePutriPhone))}
                    disabled={!selectedBidang || isAllLocked}
                    className={`w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-slate-50 border ${
                      singlePutriPhone && !validateIndonesianPhone(singlePutriPhone).isValid
                        ? "border-red-400 bg-red-50/20 text-red-900 focus:border-red-500"
                        : "border-slate-200 focus:bg-white focus:border-red-500 text-slate-900"
                    } focus:outline-none font-medium transition-colors disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed`}
                  />
                  {singlePutriPhone && !validateIndonesianPhone(singlePutriPhone).isValid && (
                    <p className="text-[11px] text-red-600 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{validateIndonesianPhone(singlePutriPhone).message}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Locked Extra Single Putri (Host) */}
            {categoryStatus?.extraSinglePutri && categoryStatus.extraSinglePutri.map((espi) => (
              <div key={espi.playerNumber} className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    Single Putri (Atlet {espi.playerNumber}): Terdaftar Resmi
                  </span>
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full">
                    Terkunci
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-amber-200/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 min-w-0">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Nama Atlet</span>
                    <p className="font-black text-slate-900 text-sm mt-0.5 truncate">{espi.player}</p>
                  </div>
                  {espi.phone && (
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs min-w-0 max-w-full overflow-hidden">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="break-all font-mono">{espi.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Active Extra Single Putri Inputs (Host) */}
            {extraSinglePutri.map((spi) => (
              <div key={spi.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    Atlet Single Putri {spi.playerNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExtraSinglePutri(spi.id)}
                    className="text-slate-400 hover:text-red-600 text-xs flex items-center gap-1 font-bold"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Hapus Atlet {spi.playerNumber}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap Atlet Single Putri {spi.playerNumber}
                    </label>
                    <input
                      type="text"
                      placeholder="Nama Lengkap Atlet"
                      value={spi.player}
                      onChange={(e) => updateExtraSinglePutri(spi.id, "player", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor WhatsApp Atlet
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      maxLength={14}
                      placeholder="Contoh: 08123456789"
                      value={spi.phone}
                      onChange={(e) => updateExtraSinglePutri(spi.id, "phone", e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Host Button to Add More Single Putri */}
            {isHost && (
              <button
                type="button"
                onClick={addExtraSinglePutri}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-rose-300 bg-rose-50/50 hover:bg-rose-50 text-rose-700 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-rose-600" />
                <span>+ Tambah Atlet Single Putri Lainnya</span>
              </button>
            )}
          </div>

          {/* SECTION 5: KETENTUAN & SUBMIT */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="rules"
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                disabled={!selectedBidang || isAllLocked}
                required
                className="mt-1 w-4 h-4 text-red-600 rounded-md border-slate-300 focus:ring-red-500 disabled:opacity-50 cursor-pointer"
              />
              <label htmlFor="rules" className="text-xs text-slate-700 font-medium leading-relaxed cursor-pointer select-none">
                Kami menyatakan bahwa data pemain yang didaftarkan adalah perwakilan resmi bidang kami di <strong>Ganesha Operation</strong>, bersedia hadir tepat waktu pada Pertemuan Teknis (02 Desember 2026) dan bertanding dengan menjunjung tinggi <strong>sportivitas</strong>. <span className="text-red-600 font-bold">*</span>
              </label>
            </div>

            {/* Error Alert above submit button if any */}
            {errorMessage && (
              <div
                ref={bottomErrorRef}
                className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 text-red-800 text-xs sm:text-sm flex items-start gap-3 shadow-xs animate-shake"
              >
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-black text-red-900">Perhatian / Formulir Belum Sesuai:</p>
                  <p className="font-semibold text-red-700 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Submit / Lock Button */}
            {isAllLocked ? (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Semua Kategori Sudah Terdaftar</span>
                </div>
                <p className="text-xs text-amber-800">
                  Data telah terekam. Hubungi panitia jika memerlukan perubahan susunan pemain.
                </p>
              </div>
            ) : !selectedBidang ? (
              <div className="flex justify-center pt-1">
                <button
                  type="button"
                  disabled
                  className="w-full sm:w-auto min-w-[220px] max-w-sm h-11 px-6 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed flex items-center justify-center text-center"
                >
                  Pilih Asal Bidang Terlebih Dahulu
                </button>
              </div>
            ) : (
              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto min-w-[220px] max-w-sm h-11 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm shadow-red-500/20 active:scale-[0.98] transition-all ${
                    isSubmitting
                      ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                      : "btn-championship-red"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pendaftaran</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
