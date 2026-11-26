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
} from "lucide-react";

interface RegistrationFormProps {
  onSuccess?: (data: Registration) => void;
  onGoToSchedule?: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
}) => {
  const [bidangOptions, setBidangOptions] = useState<string[]>([]);
  const [isLoadingBidang, setIsLoadingBidang] = useState(true);
  const [selectedBidang, setSelectedBidang] = useState<string>("");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [categoryStatus, setCategoryStatus] = useState<BidangCategoryStatus | null>(null);

  // Kategori Ganda Putra - Tim 1 (Opsional jika belum terdaftar)
  const [gandaTim1P1, setGandaTim1P1] = useState("");
  const [gandaTim1P1Phone, setGandaTim1P1Phone] = useState("");
  const [gandaTim1P2, setGandaTim1P2] = useState("");
  const [gandaTim1P2Phone, setGandaTim1P2Phone] = useState("");

  // Kategori Ganda Putra - Tim 2 (Opsional jika belum terdaftar)
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

  const [notes, setNotes] = useState("");
  const [agreedToRules, setAgreedToRules] = useState(false);

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registeredData, setRegisteredData] = useState<Registration | null>(null);

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
    setNotes("");
    setAgreedToRules(false);
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
  const isAllLocked = !!categoryStatus?.isFullyRegistered;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!selectedBidang.trim()) {
      setErrorMessage("Silakan pilih asal bidang dari daftar.");
      return;
    }

    if (isAllLocked) {
      setErrorMessage("Seluruh kategori untuk bidang ini sudah terdaftar resmi. Hubungi panitia jika membutuhkan revisi.");
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
          setErrorMessage("Nomor WhatsApp Pemain 1 (Ganda Putra Tim 1) harus diisi.");
          return;
        }
        const v = validateIndonesianPhone(cleanG1P1Phone);
        if (!v.isValid) {
          setErrorMessage(`Pemain 1 Ganda Tim 1: ${v.message}`);
          return;
        }
      }
      if (hasGandaTim1P2) {
        if (!cleanG1P2Phone) {
          setErrorMessage("Nomor WhatsApp Pemain 2 (Ganda Putra Tim 1) harus diisi.");
          return;
        }
        const v = validateIndonesianPhone(cleanG1P2Phone);
        if (!v.isValid) {
          setErrorMessage(`Pemain 2 Ganda Tim 1: ${v.message}`);
          return;
        }
      }
      if ((hasGandaTim1P1 && !hasGandaTim1P2) || (!hasGandaTim1P1 && hasGandaTim1P2)) {
        setErrorMessage("Untuk Kategori Ganda Putra Tim 1, harap lengkapi kedua pemain (Pemain 1 & Pemain 2) atau kosongkan jika tidak mendaftar.");
        return;
      }
    }

    // 2. Validasi Ganda Tim 2 (hanya jika belum terkunci dan diaktifkan)
    if (!isGanda2Locked && hasGandaTim2) {
      const hasGandaTim2P1 = !!gandaTim2P1.trim();
      const hasGandaTim2P2 = !!gandaTim2P2.trim();

      if (hasGandaTim2P1) {
        if (!cleanG2P1Phone) {
          setErrorMessage("Nomor WhatsApp Pemain 1 (Ganda Putra Tim 2) harus diisi.");
          return;
        }
        const v = validateIndonesianPhone(cleanG2P1Phone);
        if (!v.isValid) {
          setErrorMessage(`Pemain 1 Ganda Tim 2: ${v.message}`);
          return;
        }
      }
      if (hasGandaTim2P2) {
        if (!cleanG2P2Phone) {
          setErrorMessage("Nomor WhatsApp Pemain 2 (Ganda Putra Tim 2) harus diisi.");
          return;
        }
        const v = validateIndonesianPhone(cleanG2P2Phone);
        if (!v.isValid) {
          setErrorMessage(`Pemain 2 Ganda Tim 2: ${v.message}`);
          return;
        }
      }
      if ((hasGandaTim2P1 && !hasGandaTim2P2) || (!hasGandaTim2P1 && hasGandaTim2P2)) {
        setErrorMessage("Untuk Kategori Ganda Putra Tim 2, harap lengkapi kedua pemain (Pemain 1 & Pemain 2) atau hapus Tim 2 jika tidak mendaftar.");
        return;
      }
    }

    // 3. Validasi Single Putra (hanya jika belum terkunci)
    if (!isSinglePaLocked && singlePutra.trim()) {
      if (!cleanSinglePaPhone) {
        setErrorMessage("Nomor WhatsApp Atlet Single Putra harus diisi.");
        return;
      }
      const v = validateIndonesianPhone(cleanSinglePaPhone);
      if (!v.isValid) {
        setErrorMessage(`Single Putra: ${v.message}`);
        return;
      }
    }

    // 4. Validasi Single Putri (hanya jika belum terkunci)
    if (!isSinglePiLocked && singlePutri.trim()) {
      if (!cleanSinglePiPhone) {
        setErrorMessage("Nomor WhatsApp Atlet Single Putri harus diisi.");
        return;
      }
      const v = validateIndonesianPhone(cleanSinglePiPhone);
      if (!v.isValid) {
        setErrorMessage(`Single Putri: ${v.message}`);
        return;
      }
    }

    // 5. Harus ada minimal 1 kategori baru yang didaftarkan pada pengiriman ini
    const hasNewGanda1 = !isGanda1Locked && !!(gandaTim1P1.trim() && gandaTim1P2.trim());
    const hasNewGanda2 = !isGanda2Locked && hasGandaTim2 && !!(gandaTim2P1.trim() && gandaTim2P2.trim());
    const hasNewSinglePa = !isSinglePaLocked && !!singlePutra.trim();
    const hasNewSinglePi = !isSinglePiLocked && !!singlePutri.trim();

    if (!hasNewGanda1 && !hasNewGanda2 && !hasNewSinglePa && !hasNewSinglePi) {
      setErrorMessage("Silakan isi data minimal 1 kategori atlet yang belum didaftarkan.");
      return;
    }

    // 6. Checkbox persetujuan HARUS dicentang
    if (!agreedToRules) {
      setErrorMessage("Harap centang kotak persetujuan ketentuan partisipasi turnamen.");
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
        notes,
      };

      const res = await submitBidangFullRegistration(payload);

      if (!res.success || !res.data) {
        setErrorMessage(res.message || "Gagal mengirim formulir pendaftaran.");
      } else {
        setRegisteredData(res.data);
        onSuccess?.(res.data);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error?.message || "Terjadi kendala saat mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN: Redesigned Digital Athlete Tournament Pass (No Registration Code, Clear Athlete WA Details)
  if (registeredData) {
    const hasGanda1 = !!(registeredData.ganda_tim1_player1 && registeredData.ganda_tim1_player2);
    const hasGanda2 = !!(registeredData.ganda_tim2_player1 && registeredData.ganda_tim2_player2);
    const hasSinglePa = !!registeredData.single_putra_player;
    const hasSinglePi = !!registeredData.single_putri_player;

    return (
      <div className="max-w-2xl mx-auto py-4 px-2 sm:px-0">
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 text-center">
          {/* Header Icon & Status */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 inline-block">
            Pendaftaran Berhasil Diterima
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3 tracking-tight">
            Digital Athlete Tournament Pass
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Simpan atau screenshot tiket kartu pass delegasi ini sebagai bukti keikutsertaan resmi turnamen BOLA 8 antar bidang.
          </p>

          {/* BANNER / KARTU WAJIB GABUNG GRUP WHATSAPP PESERTA */}
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/70 border-2 border-emerald-500/40 text-left shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/25">
                  <MessageCircle className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-md">
                      Wajib untuk Peserta
                    </span>
                    <span className="text-xs font-bold text-emerald-900">
                      Grup WhatsApp Resmi Peserta
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1">
                    Silakan Gabung ke WhatsApp Group Peserta
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Semua peserta &amp; perwakilan bidang diharapkan bergabung untuk koordinasi jadwal tanding, pengundian bagan, dan pengumuman Technical Meeting.
                  </p>
                </div>
              </div>

              <a
                href={TOURNAMENT_CONFIG.whatsapp_group_link || "https://chat.whatsapp.com/GTBsTJSt1mw4AaT1DiPUzf?mode=gi_t"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] shrink-0 text-center"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Gabung Grup WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* PASS CARD PREVIEW */}
          <div className="mt-7 rounded-2xl bg-white border border-slate-200/90 text-left overflow-hidden shadow-xs">
            {/* Card Top Brand Ribbon (Light Championship Red Gradient) */}
            <div className="px-5 py-4 bg-gradient-to-r from-red-600 via-red-600 to-amber-600 text-white flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  TI
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black tracking-wide text-white">TI BILLIARD CUP 2026</h4>
                  <span className="text-[10px] text-red-100 font-bold uppercase tracking-wider block">
                    TURNAMEN BOLA 8 ANTAR BIDANG
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-white/20 text-white border border-white/30 text-[10px] font-black uppercase tracking-wide flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-white" />
                Terkonfirmasi Resmi
              </span>
            </div>

            {/* Bidang Info Bar */}
            <div className="px-5 py-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Asal Bidang Ganesha Operation
                </span>
                <p className="font-black text-slate-900 text-base sm:text-lg mt-0.5">
                  {registeredData.bidang_name || registeredData.club_name}
                </p>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center sm:justify-end gap-1">
                  <MapPin className="w-3 h-3 text-red-600" />
                  Venue &amp; Waktu
                </span>
                <p className="text-xs font-bold text-slate-700 mt-0.5">
                  {TOURNAMENT_CONFIG.venue} • {TOURNAMENT_CONFIG.date_range}
                </p>
              </div>
            </div>

            {/* DETAIL ATLET & KONTAK WHATSAPP PER KATEGORI */}
            <div className="p-5 space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider">
                  Rincian Atlet Delegasi &amp; Kontak WhatsApp
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Perwakilan Resmi
                </span>
              </div>

              {/* 1. Ganda Putra Tim 1 Card */}
              {hasGanda1 && (
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-red-700 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded-md border border-red-200 flex items-center gap-1">
                      <Users2 className="w-3 h-3" />
                      Ganda Putra (Tim 1)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">Terdaftar</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Pemain 1</span>
                      <p className="font-black text-slate-900 text-xs mt-0.5">
                        {registeredData.ganda_tim1_player1}
                      </p>
                      {registeredData.ganda_tim1_player1_phone && (
                        <p className="text-slate-600 font-medium text-[11px] flex items-center gap-1 mt-1 min-w-0 max-w-full overflow-hidden">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="break-all font-mono">{registeredData.ganda_tim1_player1_phone}</span>
                        </p>
                      )}
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Pemain 2</span>
                      <p className="font-black text-slate-900 text-xs mt-0.5">
                        {registeredData.ganda_tim1_player2}
                      </p>
                      {registeredData.ganda_tim1_player2_phone && (
                        <p className="text-slate-600 font-medium text-[11px] flex items-center gap-1 mt-1 min-w-0 max-w-full overflow-hidden">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="break-all font-mono">{registeredData.ganda_tim1_player2_phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Ganda Putra Tim 2 Card (jika ada) */}
              {hasGanda2 && (
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                      <Users2 className="w-3 h-3" />
                      Ganda Putra (Tim 2)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">Terdaftar</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Pemain 1</span>
                      <p className="font-black text-slate-900 text-xs mt-0.5">
                        {registeredData.ganda_tim2_player1}
                      </p>
                      {registeredData.ganda_tim2_player1_phone && (
                        <p className="text-slate-600 font-medium text-[11px] flex items-center gap-1 mt-1 min-w-0 max-w-full overflow-hidden">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="break-all font-mono">{registeredData.ganda_tim2_player1_phone}</span>
                        </p>
                      )}
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Pemain 2</span>
                      <p className="font-black text-slate-900 text-xs mt-0.5">
                        {registeredData.ganda_tim2_player2}
                      </p>
                      {registeredData.ganda_tim2_player2_phone && (
                        <p className="text-slate-600 font-medium text-[11px] flex items-center gap-1 mt-1 min-w-0 max-w-full overflow-hidden">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="break-all font-mono">{registeredData.ganda_tim2_player2_phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Single Putra Card */}
              {hasSinglePa && (
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Single Putra
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">Terdaftar</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm truncate">
                      {registeredData.single_putra_player}
                    </p>
                    {registeredData.single_putra_phone && (
                      <a
                        href={`https://wa.me/${registeredData.single_putra_phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1.5 transition-colors min-w-0 max-w-full overflow-hidden"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="break-all font-mono">{registeredData.single_putra_phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* 4. Single Putri Card */}
              {hasSinglePi && (
                <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-pink-700 uppercase tracking-wider bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Single Putri
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700">Terdaftar</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 min-w-0">
                    <p className="font-black text-slate-900 text-sm truncate">
                      {registeredData.single_putri_player}
                    </p>
                    {registeredData.single_putri_phone && (
                      <a
                        href={`https://wa.me/${registeredData.single_putri_phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1.5 transition-colors min-w-0 max-w-full overflow-hidden"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="break-all font-mono">{registeredData.single_putri_phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Card Footer Note */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-600 font-medium text-center space-y-1">
              <p>Data delegasi bidang ini telah resmi tercatat untuk pengundian bagan &amp; jadwal pertandingan.</p>
              <p className="text-emerald-700 font-bold">
                Harap pastikan seluruh atlet bergabung ke WhatsApp Group turnamen untuk pengumuman jadwal resmi.
              </p>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5">
            {/* BUTTON 1: Gabung Grup WhatsApp */}
            <a
              href={TOURNAMENT_CONFIG.whatsapp_group_link || "https://chat.whatsapp.com/GTBsTJSt1mw4AaT1DiPUzf?mode=gi_t"}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 sm:h-11 px-5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/25 text-center transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Grup WhatsApp Peserta</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            {/* BUTTON 2: Partisipasi Langsung */}
            <Link
              href="/participants"
              className="h-10 sm:h-11 px-5 rounded-xl text-xs sm:text-sm font-bold btn-championship-red flex items-center justify-center gap-2 shadow-sm shadow-red-500/20 text-center"
            >
              <Users className="w-4 h-4" />
              <span>Lihat Peserta</span>
            </Link>

            {/* BUTTON 3: Kembali ke pendaftaran dengan data kosong semua */}
            <button
              onClick={handleReturnToEmptyForm}
              className="h-10 sm:h-11 px-5 rounded-xl text-xs sm:text-sm font-bold btn-luxury-pearl flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4 text-slate-500" />
              <span>Kembali</span>
            </button>
          </div>

          {/* Help Contact Link */}
          <div className="mt-5 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex flex-wrap items-center justify-center gap-3">
            <span>Butuh revisi susunan atlet? Hubungi Panitia:</span>
            <a
              href={`https://wa.me/${TOURNAMENT_CONFIG.contact_sean}?text=Halo%20Sean%20(Panitia%20TI%20Billiard%20Cup),%20saya%20dari%20bidang%20${encodeURIComponent(registeredData.bidang_name || registeredData.club_name || "")}%20ingin%20mengajukan%20perubahan/revisi%20data%20atlet`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 underline"
            >
              <Phone className="w-3 h-3" /> Sean - TI (0851-8997-0998)
            </a>
            <span>atau</span>
            <a
              href={`https://wa.me/${TOURNAMENT_CONFIG.contact_novi}?text=Halo%20Novi%20(Panitia%20TI%20Billiard%20Cup),%20saya%20dari%20bidang%20${encodeURIComponent(registeredData.bidang_name || registeredData.club_name || "")}%20ingin%20mengajukan%20perubahan/revisi%20data%20atlet`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1 underline"
            >
              <Phone className="w-3 h-3" /> Novi (0856-2405-5869)
            </a>
          </div>
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
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-3">
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
              {isLoadingBidang ? (
                <div className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 animate-pulse flex items-center px-4 gap-2.5">
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span className="text-xs font-medium text-slate-500">
                    Memuat daftar bidang resmi...
                  </span>
                </div>
              ) : (
                <select
                  value={selectedBidang}
                  onChange={(e) => handleBidangChange(e.target.value)}
                  className="w-full px-4 py-3 text-base sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-bold text-slate-900 transition-colors"
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
              )}
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
                      Bidang <strong>{selectedBidang}</strong> telah mendaftarkan seluruh kategori kontingen (Ganda Putra, Single Putra, dan Single Putri). Demi integritas pengundian bagan, data <strong>tidak dapat diubah secara mandiri</strong>.
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

          {/* SECTION 2: KATEGORI GANDA PUTRA */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Users2 className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  2. Kategori Ganda Putra
                </h3>
              </div>
              <span className="text-[11px] font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                Maksimal 2 Tim • 2 Orang per Tim
              </span>
            </div>

            {/* Tim 1 Ganda Putra */}
            {isGanda1Locked ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    Tim 1 Ganda Putra: Terdaftar Resmi
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
                  Kategori Ganda Putra Tim 1 sudah terdaftar. Hubungi panitia jika membutuhkan revisi pemain.
                </p>
              </div>
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                    Tim 1 Ganda Putra
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">2 Atlet</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Pemain 1
                    </label>
                    <input
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
                      type="tel"
                      inputMode="tel"
                      maxLength={14}
                      placeholder="Contoh: 08123456789"
                      value={gandaTim1P1Phone}
                      onChange={(e) => handlePhoneInputChange(e.target.value, setGandaTim1P1Phone)}
                      onBlur={() => setGandaTim1P1Phone(cleanPhoneNumber(gandaTim1P1Phone))}
                      disabled={!selectedBidang || isAllLocked}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Nama Pemain 2
                    </label>
                    <input
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
                      type="tel"
                      inputMode="tel"
                      maxLength={14}
                      placeholder="Contoh: 08123456789"
                      value={gandaTim1P2Phone}
                      onChange={(e) => handlePhoneInputChange(e.target.value, setGandaTim1P2Phone)}
                      onBlur={() => setGandaTim1P2Phone(cleanPhoneNumber(gandaTim1P2Phone))}
                      disabled={!selectedBidang || isAllLocked}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tim 2 Ganda Putra */}
            {isGanda2Locked ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    Tim 2 Ganda Putra: Terdaftar Resmi
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
                    <span>+ Tambah Tim 2 Ganda Putra</span>
                  </button>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />
                        Tim 2 Ganda Putra
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
                          type="tel"
                          inputMode="tel"
                          maxLength={14}
                          placeholder="Contoh: 08123456789"
                          value={gandaTim2P1Phone}
                          onChange={(e) => handlePhoneInputChange(e.target.value, setGandaTim2P1Phone)}
                          onBlur={() => setGandaTim2P1Phone(cleanPhoneNumber(gandaTim2P1Phone))}
                          disabled={!selectedBidang || isAllLocked}
                          className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nama Pemain 2 (Tim 2)
                        </label>
                        <input
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
                          type="tel"
                          inputMode="tel"
                          maxLength={14}
                          placeholder="Contoh: 08123456789"
                          value={gandaTim2P2Phone}
                          onChange={(e) => handlePhoneInputChange(e.target.value, setGandaTim2P2Phone)}
                          onBlur={() => setGandaTim2P2Phone(cleanPhoneNumber(gandaTim2P2Phone))}
                          disabled={!selectedBidang || isAllLocked}
                          className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-red-500 font-medium text-slate-900 disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                1 Tim • 1 Orang
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
                    type="tel"
                    inputMode="tel"
                    maxLength={14}
                    placeholder="Contoh: 08123456789"
                    value={singlePutraPhone}
                    onChange={(e) => handlePhoneInputChange(e.target.value, setSinglePutraPhone)}
                    onBlur={() => setSinglePutraPhone(cleanPhoneNumber(singlePutraPhone))}
                    disabled={!selectedBidang || isAllLocked}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 font-medium text-slate-900 transition-colors disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
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
              <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                1 Tim • 1 Orang
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
                    type="tel"
                    inputMode="tel"
                    maxLength={14}
                    placeholder="Contoh: 08123456789"
                    value={singlePutriPhone}
                    onChange={(e) => handlePhoneInputChange(e.target.value, setSinglePutriPhone)}
                    onBlur={() => setSinglePutriPhone(cleanPhoneNumber(singlePutriPhone))}
                    disabled={!selectedBidang || isAllLocked}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-red-500 font-medium text-slate-900 transition-colors disabled:bg-slate-100 disabled:text-slate-600 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
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
