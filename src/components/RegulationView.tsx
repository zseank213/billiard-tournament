"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TOURNAMENT_CONFIG, INVITED_BIDANG_LIST } from "@/lib/mock-data";
import { getBidangList, BidangRecord } from "@/app/actions/bidang";
import { getTableOfficials } from "@/app/actions/officials";
import {
  TableOfficialRecord,
  DEFAULT_TABLE_OFFICIALS,
} from "@/lib/officials";
import {
  Trophy,
  ShieldCheck,
  Award,
  Gift,
  CheckCircle2,
  Sparkles,
  Phone,
  Building,
  Calendar,
  Clock,
  MapPin,
  Users2,
  FileText,
  Flame,
  Check,
  HelpCircle,
  Eye,
  Maximize2,
  X,
  Megaphone,
  VolumeX,
  AlertTriangle,
  UserCheck,
  Users,
  ShieldAlert,
  CircleDot,
  Gamepad2,
} from "lucide-react";

interface RegulationViewProps {
  initialOfficials?: TableOfficialRecord[];
  initialBidang?: BidangRecord[];
}

export const RegulationView: React.FC<RegulationViewProps> = ({
  initialOfficials = DEFAULT_TABLE_OFFICIALS,
  initialBidang,
}) => {
  const [isMerchModalOpen, setIsMerchModalOpen] = useState(false);
  const [bidangList] = useState<BidangRecord[]>(() =>
    initialBidang && initialBidang.length > 0
      ? initialBidang
      : INVITED_BIDANG_LIST.map((name, idx) => ({
          id: idx + 1,
          code: idx === 0 ? "IT" : name.slice(0, 4).toUpperCase(),
          name,
          short_name: idx === 0 ? "IT" : name.slice(0, 4).toUpperCase(),
          is_host: idx === 0,
          order_no: idx + 1,
          status: idx === 0 ? "host" : "invited",
          quota_ganda_putra: 2,
          quota_single_putra: 1,
          quota_single_putri: 1,
        }))
  );
  const [tableOfficials, setTableOfficials] = useState<TableOfficialRecord[]>(initialOfficials);

  useEffect(() => {
    let isMounted = true;
    getTableOfficials()
      .then((res) => {
        if (isMounted && res && res.length > 0) {
          setTableOfficials(res);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const officialRules = [
    {
      number: "01",
      title: "Sistem Permainan Resmi Bola 8 (8-Ball)",
      desc: "Pertandingan menggunakan aturan resmi Bola 8 (WPA). Terdiri dari 7 bola solid (1-7), 7 bola stripes (9-15), dan 1 bola 8 hitam sebagai bola sasaran penentu kemenangan.",
    },
    {
      number: "02",
      title: "Penentuan Kelompok Bola (Solid / Stripes)",
      desc: "Kelompok bola ditentukan setelah break SAH dan seorang pemain berhasil memasukkan bola sasaran secara sah (call-pocket). Jika bola masuk pada saat break, meja masih berstatus terbuka (open table).",
    },
    {
      number: "03",
      title: "Memasukkan Bola 8 & Ketentuan Sah",
      desc: "Bola 8 hanya boleh dimasukkan setelah seorang pemain berhasil menghabiskan seluruh bola kelompoknya. Bola 8 harus ditunjuk ke kantong tertentu (call shot). Jika bola 8 masuk ke kantong salah atau cue ball masuk (scratch) saat menembak bola 8, dinyatakan kalah rack.",
    },
    {
      number: "04",
      title: "Foul & Ball in Hand",
      desc: "Pelanggaran (cue ball masuk kantong, tidak menyentuh bola kelompok sendiri pertama kali, atau bola melompat keluar meja) memberikan hak Ball in Hand bagi lawan di seluruh permukaan meja.",
    },
    {
      number: "05",
      title: "Ketepatan Waktu & Walkover (WO)",
      desc: "Pertandingan dimulai tepat waktu sesuai jadwal (pukul 18.00 - 20.00 WIB). Keterlambatan lebih dari 15 menit dari jadwal panggilan meja dinyatakan Walkover (WO) demi kelancaran rotasi meja.",
    },
    {
      number: "06",
      title: "Sportivitas & Keputusan Panitia",
      desc: "Seluruh peserta wajib menjunjung tinggi etika sportivitas dan rasa kekeluargaan antar bidang Ganesha Operation. Keputusan wasit dan panitia pelaksana bersifat final dan mengikat.",
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full min-w-0 max-w-full">
      {/* 1. Header Surat Resmi */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 p-2 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0">
              <Image
                src="/images/logo-ganesha-operation.png"
                alt="Logo Ganesha Operation"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Ganesha Operation Pusat — Bidang Teknologi Informasi
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Penyelenggara Resmi TI BILLIARD CUP 2026 • Sportivitas Antar Bidang
              </p>
            </div>
          </div>

          <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <span>Dokumen Regulasi Resmi</span>
          </span>
        </div>

        {/* 4 Kartu Info Utama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" /> Tempat Pelaksanaan
            </span>
            <p className="font-black text-slate-900 text-xs leading-snug">
              Greenlight Cafe &amp; Billiard
            </p>
            <p className="text-[11px] text-slate-500">Samping Mall BEC, Bandung</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-red-600" /> Waktu Pertandingan
            </span>
            <p className="font-black text-slate-900 text-xs leading-snug">
              Mulai Kamis, 3 Des 2026
            </p>
            <p className="text-[11px] text-red-700 font-bold">Pukul 18.00 – 20.00 WIB</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Technical Meeting
            </span>
            <p className="font-black text-slate-900 text-xs leading-snug">
              Rabu, 2 Desember 2026
            </p>
            <p className="text-[11px] text-slate-500">Pendaftaran s/d 1 Des 2026</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" /> Gelar Kehormatan
            </span>
            <p className="font-black text-amber-950 text-xs leading-snug">
              3 Piala Bergilir DirRen
            </p>
            <p className="text-[11px] text-amber-800 font-bold">Ganda, Single Putra &amp; Putri</p>
          </div>
        </div>

        {/* Ketentuan Kuota Delegasi Bidang */}
        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-red-50/60 to-amber-50/40 border border-red-200/80 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-red-900 flex items-center gap-1.5">
              <Users2 className="w-4 h-4 text-red-600" />
              Ketentuan Kuota Pendaftaran Resmi Antar Bidang (GRATIS):
            </span>
            <span className="text-[10px] font-bold text-red-700 bg-white px-2.5 py-0.5 rounded-full border border-red-200">
              Biaya Registrasi Rp 0 (FREE)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-white border border-red-100 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Kategori 1</span>
              <p className="text-sm font-black text-slate-900">Ganda Putra</p>
              <p className="text-xs text-red-700 font-bold mt-0.5">Maksimal 2 TIM / Bidang</p>
              <p className="text-[11px] text-slate-500 mt-0.5">2 orang per tim</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-red-100 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Kategori 2</span>
              <p className="text-sm font-black text-slate-900">Single Putra</p>
              <p className="text-xs text-red-700 font-bold mt-0.5">1 TIM / Bidang</p>
              <p className="text-[11px] text-slate-500 mt-0.5">1 orang per tim</p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-red-100 shadow-2xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 block">Kategori 3</span>
              <p className="text-sm font-black text-slate-900">Single Putri</p>
              <p className="text-xs text-red-700 font-bold mt-0.5">1 TIM / Bidang</p>
              <p className="text-[11px] text-slate-500 mt-0.5">1 orang per tim</p>
            </div>
          </div>
        </div>

        {/* 20 Bidang Diundang — Terkoneksi Langsung dari Database Supabase */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-800 block">
              Daftar {bidangList.length > 0 ? bidangList.length : 20} Bidang Diundang Resmi di Lingkungan Kerja Ganesha Operation:
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {bidangList.map((bidang, idx) => (
              <span
                key={bidang.id || idx}
                className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                  bidang.is_host
                    ? "bg-red-600 text-white border-red-600 font-bold shadow-2xs"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                <span className={bidang.is_host ? "text-amber-300 mr-1" : "text-slate-400 mr-1"}>
                  {bidang.order_no || idx + 1}.
                </span>
                {bidang.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. PIC / PENANGGUNG JAWAB & SYARAT & KETENTUAN (S&K) RESMI */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-4 sm:p-8 space-y-6">
        <div className="pb-4 border-b border-slate-200">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 inline-block mb-1">
            Petunjuk Pelaksanaan Resmi 2026
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-red-600 inline-block" />
            PIC Penanggung Jawab &amp; Syarat Ketentuan (S&amp;K)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Panduan ketat untuk menjamin kelancaran, sportivitas, dan ketertiban seluruh rangkaian kegiatan turnamen
          </p>
        </div>

        {/* Notifikasi Penting Evaluasi Turnamen */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-50/80 via-amber-50/60 to-white border border-red-200/80 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <p className="font-black text-slate-900">
              Pemberitahuan Khusus Panitia Penyelenggara:
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              Seluruh ketentuan di bawah ini disusun demi menjaga asas keadilan, sportivitas, dan kenyamanan bersama. Mohon seluruh atlet, official bidang, suporter, dan penonton membaca dan mematuhi panduan ini secara seksama guna mencegah kesalahpahaman atau komplain di arena pertandingan.
            </p>
          </div>
        </div>

        {/* Grid 4 Kartu PIC & S&K */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* KARTU 1: PERTANDINGAN */}
          <div className="p-5 rounded-2xl bg-white border-2 border-red-200 shadow-sm space-y-4 hover:border-red-400 transition-colors">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-red-600 text-white text-xs font-black flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-black text-slate-900 text-base">
                    S&amp;K &amp; Regulasi Pertandingan Resmi
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 font-medium pl-8">
                  Turnamen BOLA 8 WPA Standar Internasional
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200 shrink-0">
                Wajib Atlet
              </span>
            </div>

            {/* PIC Card */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-red-600" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">PIC Pertandingan:</span>
                  <span className="font-black text-slate-900">Michael Sean &amp; Dewan Wasit TI</span>
                </div>
              </div>
              <a
                href="https://wa.me/6285189970998"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-red-700 bg-red-100/70 hover:bg-red-200 px-2.5 py-1 rounded-lg transition-colors font-mono"
              >
                0851-8997-0998
              </a>
            </div>

            {/* Ketentuan S&K */}
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Integritas &amp; Identitas Atlet:</strong> Seluruh atlet wajib merupakan karyawan aktif Ganesha Operation di bidang yang didaftarkan. Dilarang keras menggunakan pemain sewaan/joki dari luar bidang. Pelanggaran mengakibatkan diskualifikasi seketika.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Disiplin Waktu &amp; Batas Walkover (WO):</strong> Atlet wajib hadir di meja pertandingan 15 menit sebelum waktu tanding. Toleransi keterlambatan maksimal <strong>15 menit</strong> dari panggilan resmi wasit; apabila tidak hadir, kemenangan WO diberikan kepada lawan.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Aturan Teknis Pertandingan:</strong> Menggunakan bola 8 standar WPA, Race to 4 frame, break bergantian atau diputuskan lewat lag.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Pakaian &amp; Etika:</strong> Atlet wajib memakai baju polo / berkerah / seragam bidang dan bersepatu. Dilarang bertanding menggunakan sandal jepit.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Keputusan Wasit Mutlak:</strong> Wasit meja memegang kendali penuh atas fouls dan keputusan sah bola. Keputusan wasit bersifat final dan mengikat.
                </span>
              </div>
            </div>
          </div>

          {/* KARTU 2: MINI GAMES MEJA 6 */}
          <div className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-sm space-y-4 hover:border-amber-400 transition-colors">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-amber-600 text-white text-xs font-black flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-black text-slate-900 text-base">
                    S&amp;K Mini Games &amp; Doorprize Meja 6
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 font-medium pl-8">
                  Tantangan Trickshot &amp; Doorprize Merchandise Eksklusif
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                Untuk Semua
              </span>
            </div>

            {/* PIC Card */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">PIC Meja 6 &amp; Games:</span>
                  <span className="font-black text-slate-900">Dzakiy Harissalam &amp; Ahmad Yoga Witdodo</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2.5 py-1 rounded-lg">
                Stand Meja 6
              </span>
            </div>

            {/* Ketentuan S&K */}
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Peserta yang Berhak Ikut:</strong> Terbuka untuk seluruh karyawan Ganesha Operation yang hadir di lokasi (baik atlet, official, maupun penonton/suporter).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Antrean &amp; Kuota Percobaan:</strong> Demi keadilan bersama, setiap peserta mendapatkan kesempatan <strong>1 kali percobaan per sesi</strong> tantangan. Dilarang memonopoli atau menyerobot antrean.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Pilihan Tingkat Tantangan:</strong> Peserta dapat memilih <strong>Kategori Sulit</strong> (Kaos official, Topi, Tumbler, Mug/Gelas label, Voucher Rp 100k &amp; Rp 50k, Kipas tangan, Paket Snack/Indomie) atau <strong>Kategori Gampang</strong> (Gantungan Kunci Akrilik Resmi).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Klaim Hadiah Langsung:</strong> Keberhasilan tantangan dinilai langsung oleh PIC Meja 6 dan hadiah langsung diserahkan di tempat selama persediaan masih ada.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Pemeliharaan Meja:</strong> Dilarang meletakkan gelas minuman, rokok, atau makanan di atas pinggiran Meja 6.
                </span>
              </div>
            </div>
          </div>

          {/* KARTU 3: PENDUKUNG TERHEBOH */}
          <div className="p-5 rounded-2xl bg-white border-2 border-rose-200 shadow-sm space-y-4 hover:border-rose-400 transition-colors">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-rose-600 text-white text-xs font-black flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-black text-slate-900 text-base">
                    S&amp;K Pendukung Terheboh (Best Supporter)
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 font-medium pl-8">
                  Penghargaan Khusus Solidaritas &amp; Semangat Kontingen Bidang
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 shrink-0">
                Award Spesial
              </span>
            </div>

            {/* PIC Card */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-rose-600" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">PIC Pendukung Terheboh:</span>
                  <span className="font-black text-slate-900">Tim Supporter &amp; Dokumentasi Kreatif TI</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-rose-800 bg-rose-100/70 px-2.5 py-1 rounded-lg">
                Plakat + Hadiah
              </span>
            </div>

            {/* Ketentuan S&K */}
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Kriteria Penilaian Juri Resmi:</strong>
                  <span className="block mt-1 space-y-0.5 text-slate-500 pl-2">
                    • Kekompakan &amp; Jumlah Kehadiran Anggota Bidang: <strong>35%</strong><br />
                    • Kreativitas Atribut, Yel-Yel, Kostum, &amp; Banner: <strong>30%</strong><br />
                    • Sportivitas &amp; Rasa Hormat kepada Lawan: <strong>25%</strong><br />
                    • Kerapian &amp; Kebersihan Area Tribun: <strong>10%</strong>
                  </span>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Momen Bersorak yang Diizinkan:</strong> Pendukung sangat diperbolehkan bernyanyi, menyuarakan yel-yel, dan mengibarkan atribut <strong>sebelum</strong> dan <strong>setelah</strong> atlet melakukan tembakan (shot).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Larangan Alat Bising Tajam:</strong> Dilarang keras membawa atau membunyikan klakson gas/airhorn darurat, peluit wasit tajam, atau instrumen yang dapat mengacaukan aba-aba wasit meja tanding.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Bebas Provokasi &amp; SARA:</strong> Yel-yel wajib berisi semangat positif bagi bidang sendiri, bukan hinaan, ejekan pribadi, atau muatan SARA terhadap bidang lawan.
                </span>
              </div>
            </div>
          </div>

          {/* KARTU 4: PENONTON SELAMA PERTANDINGAN */}
          <div className="p-5 rounded-2xl bg-white border-2 border-indigo-200 shadow-sm space-y-4 hover:border-indigo-400 transition-colors">
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                    4
                  </span>
                  <h4 className="font-black text-slate-900 text-base">
                    Tata Tertib Penonton Selama Pertandingan
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 font-medium pl-8">
                  Protokol Ketertiban &amp; Kenyamanan di Area Arena Pertandingan
                </p>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200 shrink-0">
                Etika Venue
              </span>
            </div>

            {/* PIC Card */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">PIC Penonton &amp; Venue:</span>
                  <span className="font-black text-slate-900">Tim Ketertiban, Keamanan, &amp; Venue TI</span>
                </div>
              </div>
              <span className="text-[11px] font-bold text-indigo-800 bg-indigo-100/70 px-2.5 py-1 rounded-lg">
                Area Meja 1 - 5 &amp; Meja 6
              </span>
            </div>

            {/* Ketentuan S&K */}
            <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed font-medium">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Batas Steril Area Pertandingan:</strong> Penonton wajib berada di luar garis pembatas / berjarak minimal <strong>1,5 meter</strong> dari meja agar tidak menyenggol atlet saat mengayunkan stik biliar (*cue swing zone*).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Dilarang Memberikan Coaching / Instruksi:</strong> Penonton dan rekan satu bidang dilarang keras berteriak memberikan saran arah tembakan, strategi bola, atau mengintervensi saat atlet sedang giliran menembak.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">DILARANG Flash Kamera:</strong> Pengambilan foto dan video sangat disarankan untuk dokumentasi medsos, namun <strong>lampu kilat (flash) WAJIB dimatikan</strong> karena membahayakan fokus penglihatan atlet.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Ketenangan Saat Aiming:</strong> Saat atlet memasuki posisi siap tembak (*stance*), mohon penonton menahan suara agar atlet dapat berkonsentrasi penuh.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Kebersihan &amp; Ketertiban Ruangan:</strong> Dilarang merokok/vape di dalam ruangan pertandingan. Dilarang meletakkan minuman basah di atas meja biliar manapun. Buang sampah pada tempat yang disediakan.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* SUBSECTION: PENUGASAN RESMI PIC & PJ PER MEJA (MEJA 1 s/d MEJA 6) */}
        <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  Struktur Operasional Lapangan
                </span>
                <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Total 10 Personil PJ
                </span>
              </div>
              <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-600" />
                Daftar Penanggung Jawab (PJ) &amp; Wasit Per Meja (Meja 1 – 6)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Setiap meja diawasi langsung oleh PJ resmi dari Departemen TI untuk menjamin akurasi skor, ketertiban, dan kenyamanan pemain
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {[1, 2, 3, 4, 5, 6].map((tableNum) => {
              const officials = tableOfficials.filter((o) => o.table_number === tableNum);
              const isMiniGame = tableNum === 6;

              return (
                <div
                  key={tableNum}
                  className={`p-4 rounded-2xl border transition-all ${
                    isMiniGame
                      ? "bg-gradient-to-br from-amber-50/80 to-amber-100/40 border-amber-300/80 shadow-xs ring-1 ring-amber-300/50"
                      : "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-200/60 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-black flex items-center justify-center font-mono ${
                          isMiniGame
                            ? "bg-amber-600 text-white shadow-2xs"
                            : "bg-slate-900 text-white"
                        }`}
                      >
                        {tableNum}
                      </span>
                      <h5 className="font-black text-slate-900 text-sm">Meja {tableNum}</h5>
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        isMiniGame
                          ? "bg-white text-amber-900 border-amber-300"
                          : "bg-white text-slate-600 border-slate-200"
                      }`}
                    >
                      {isMiniGame ? "Arena Mini Games" : "Meja Tanding Bola 8"}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {officials.length > 0 ? (
                      officials.map((pj) => (
                        <div
                          key={pj.id}
                          className="flex items-start gap-2 p-2 rounded-xl bg-white/90 border border-slate-200/70 shadow-2xs text-xs"
                        >
                          <CircleDot
                            className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                              isMiniGame ? "text-amber-600" : "text-red-600"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="font-black text-slate-900 leading-snug truncate">
                              {pj.pj_name}
                            </p>
                            <p className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">
                              {pj.role}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">Petugas sedang dikonfirmasi</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Banner Hadiah Games Mini & Merchandise Resmi */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-4 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
              Doorprize &amp; Mini Game Arena
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Hadiah Games Mini &amp; Merchandise Eksklusif
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tersedia di Meja 6 khusus Mini Game untuk suporter dan atlet perwakilan bidang
            </p>
          </div>

          <button
            onClick={() => setIsMerchModalOpen(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl text-xs font-bold btn-luxury-pearl flex items-center gap-1.5 shadow-2xs"
          >
            <Maximize2 className="w-3.5 h-3.5 text-red-600" />
            <span>Perbesar Gambar Merchandise</span>
          </button>
        </div>

        {/* Gambar Banner Merchandise Mini Game */}
        <div
          onClick={() => setIsMerchModalOpen(true)}
          className="relative rounded-2xl overflow-hidden border border-slate-200 cursor-pointer group bg-slate-50 shadow-sm"
        >
          <Image
            src="/images/mini-game-prizes.jpg"
            alt="Hadiah Games Mini & Merchandise TI BILLIARD CUP 2026"
            width={1000}
            height={1000}
            className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-300"
            priority
          />
          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-black text-slate-900 shadow-lg border border-slate-200 flex items-center gap-1.5">
              <Maximize2 className="w-4 h-4 text-red-600" />
              Klik untuk Melihat Resolusi Penuh
            </span>
          </div>
        </div>

        {/* Rincian Kategori Sulit & Gampang */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-red-900">
              <Flame className="w-4 h-4 text-red-600" />
              <span>Hadiah Tantangan Kategori Sulit:</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Kaos Official TI Billiard Cup 2026</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Topi Eksklusif TI Billiard Cup 2026</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Tumbler Stainless Eksklusif</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Mug / Gelas Label TI Billiard Cup 2026</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Voucher Belanja Indomaret Rp 100.000</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Voucher Belanja Indomaret Rp 50.000</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Kipas Tangan Eksklusif TI Billiard Cup</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>Paket Snack &amp; Indomie Cup Spesial</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Hadiah Tantangan Kategori Gampang:</span>
            </div>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
              <li className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Gantungan Kunci Akrilik Resmi TI Billiard Cup 2026</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Peraturan Pertandingan Resmi Bola 8 */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs p-4 sm:p-8 space-y-5">
        <div className="pb-3 border-b border-slate-200">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200 inline-block mb-1">
            Rules of Play
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Regulasi Pertandingan BOLA 8 Resmi
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ketentuan resmi wajib dipatuhi oleh seluruh atlet dan official perwakilan bidang
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {officialRules.map((rule) => (
            <div
              key={rule.number}
              className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-100 font-mono">
                  {rule.number}
                </span>
                <h4 className="font-black text-slate-900 text-sm">{rule.title}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium pl-8">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Tanda Tangan & Pengesahan Dokumen */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Ketua Pelaksana Turnamen:
            </span>
            <p className="font-black text-slate-900 text-sm">Michael Sean Pasquale Thomas</p>
            <p className="text-slate-500 text-xs">Staf Pusat Mobile Platform</p>
          </div>

          <div className="space-y-1 text-center sm:text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Mengetahui:
            </span>
            <p className="font-black text-slate-900 text-sm">Andy Yusuf Martua, S.T., M.M.</p>
            <p className="text-slate-500 text-xs">Manajer Teknologi Informasi</p>
          </div>
        </div>
      </div>

      {/* Modal Zoom Banner Merchandise */}
      {isMerchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h4 className="font-black text-slate-900 text-base">
                  Banner Hadiah Games Mini &amp; Merchandise
                </h4>
              </div>
              <button
                onClick={() => setIsMerchModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 max-h-[80vh] overflow-y-auto rounded-2xl flex items-center justify-center bg-slate-50 p-2">
              <Image
                src="/images/mini-game-prizes.jpg"
                alt="Full Merchandise"
                width={1000}
                height={1000}
                className="w-full h-auto object-contain rounded-xl shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
