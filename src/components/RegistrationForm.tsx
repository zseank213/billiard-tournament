"use client";

import React, { useState } from "react";
import { submitRegistration } from "@/app/actions/registration";
import { Registration } from "@/types/tournament";
import { TOURNAMENT_CONFIG } from "@/lib/mock-data";
import {
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  Trophy,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface RegistrationFormProps {
  onSuccess: (data: Registration) => void;
  onGoToSchedule: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  onSuccess,
  onGoToSchedule,
}) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [clubName, setClubName] = useState("");
  const [category, setCategory] = useState<"9-ball-open" | "10-ball-handicap" | "junior-under21">("10-ball-handicap");
  const [handicap, setHandicap] = useState("HC 4");
  const [paymentMethod, setPaymentMethod] = useState("BCA");
  const [paymentProofNote, setPaymentProofNote] = useState("");
  const [agreedToRules, setAgreedToRules] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registeredData, setRegisteredData] = useState<Registration | null>(null);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim()) {
      setErrorMessage("Nama Lengkap wajib diisi.");
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage("Nomor WhatsApp wajib diisi untuk konfirmasi jadwal & meja.");
      return;
    }
    if (!agreedToRules) {
      setErrorMessage("Anda harus menyetujui regulasi dan tata tertib turnamen.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitRegistration({
        fullName,
        phoneNumber,
        email,
        city,
        clubName,
        category,
        handicap,
        paymentMethod,
        paymentProofNote,
      });

      if (!res.success || !res.data) {
        setErrorMessage(res.message || "Gagal mengirim formulir pendaftaran.");
      } else {
        setRegisteredData(res.data);
        onSuccess(res.data);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error?.message || "Terjadi kendala saat mengirim data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setHasCopiedCode(true);
    setTimeout(() => setHasCopiedCode(false), 2000);
  };

  // If registered successfully, show Tournament Pass Badge
  if (registeredData) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-zinc-900 via-zinc-900 to-emerald-950/40 border border-emerald-500/40 shadow-2xl emerald-glow text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30">
            Pendaftaran Berhasil Diterima
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-3">
            Digital Tournament Pass
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-md mx-auto">
            Simpan atau screenshot kartu pass ini sebagai bukti registrasi resmi turnamen billiard.
          </p>

          {/* Pass Card */}
          <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-zinc-950 border border-emerald-500/30 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  OFFICIAL ATHLETE PASS
                </span>
                <div className="text-sm font-extrabold text-white">
                  {TOURNAMENT_CONFIG.name}
                </div>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[10px] font-bold">
                STATUS: {registeredData.payment_status.toUpperCase()}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase">Nama Peserta</span>
                <p className="font-bold text-white text-sm sm:text-base">{registeredData.full_name}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase">Handicap / Level</span>
                <p className="font-bold text-emerald-400 text-sm sm:text-base">{registeredData.handicap}</p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase">Klub / Kota</span>
                <p className="font-medium text-zinc-300">
                  {registeredData.club_name || "Independent"} • {registeredData.city || "Indonesia"}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 uppercase">Kategori Turnamen</span>
                <p className="font-medium text-zinc-300">{registeredData.category.toUpperCase()}</p>
              </div>
            </div>

            {/* Registration Code Badge */}
            <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase">Kode Pendaftaran</span>
                <div className="text-lg sm:text-xl font-mono font-black text-amber-400 tracking-wider">
                  {registeredData.registration_code}
                </div>
              </div>
              <button
                onClick={() => copyCode(registeredData.registration_code)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-all"
              >
                {hasCopiedCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/${TOURNAMENT_CONFIG.contact_wa}?text=Halo%20Panitia%20Billiard,%20saya%20sudah%20mendaftar%20dengan%20Kode:%20${registeredData.registration_code}%20atas%20nama%20${encodeURIComponent(registeredData.full_name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Send className="w-4 h-4" />
              <span>Konfirmasi Bukti ke WA Panitia</span>
            </a>

            <button
              onClick={onGoToSchedule}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs sm:text-sm"
            >
              Kembali ke Jadwal Pertandingan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-4">
      {/* Google Form Style Container */}
      <div className="space-y-4">
        {/* Header Form Card */}
        <div className="rounded-2xl bg-zinc-900/80 border-t-8 border-t-emerald-500 border border-emerald-950/80 p-6 sm:p-8 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText className="w-4 h-4" />
            <span>Formulir Pendaftaran Resmi</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Form Pendaftaran Atlet / Peserta Turnamen Billiard
          </h2>
          <p className="text-xs sm:text-sm text-zinc-300 mt-2 leading-relaxed">
            Silakan lengkapi formulir di bawah ini dengan data yang valid. Data nomor WhatsApp akan digunakan oleh panitia meja untuk memanggil peserta dan mengabarkan jadwal match secara real-time.
          </p>

          <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
              <Trophy className="w-3.5 h-3.5" /> Biaya: {TOURNAMENT_CONFIG.registration_fee}
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Kuota Terbatas (64 Slot)
            </span>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Card 1: Data Diri */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 sm:p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-800">
              <User className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                1. Identitas Peserta
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Nama Lengkap Atlet / Pemain <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ricky Permana"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Nomor WhatsApp Aktif <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Wajib aktif untuk pemanggilan meja & link jadwal.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Email (Opsional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Kota Asal / Domisili
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Contoh: Jakarta / Surabaya / Bandung"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Klub / Rumah Billiard (Home Base)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Master Cue Club / Independent"
                    value={clubName}
                    onChange={(e) => setClubName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Kategori & Handicap */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 sm:p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-800">
              <Trophy className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                2. Kategori Pertandingan & Handicap
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-2">
                  Pilih Kategori Turnamen <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      id: "10-ball-handicap",
                      label: "10-Ball Handicap",
                      desc: "HC 3 s/d HC 6 (Race to 7)",
                    },
                    {
                      id: "9-ball-open",
                      label: "9-Ball Open Pro",
                      desc: "Semua Handicap (Race to 9)",
                    },
                    {
                      id: "junior-under21",
                      label: "Junior U-21",
                      desc: "Atlet Muda di bawah 21 Thn",
                    },
                  ].map((cat) => (
                    <label
                      key={cat.id}
                      onClick={() => setCategory(cat.id as any)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        category === cat.id
                          ? "bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-950"
                          : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tournamentCategory"
                        checked={category === cat.id}
                        onChange={() => {}}
                        className="sr-only"
                      />
                      <div className="font-bold text-xs sm:text-sm text-white">
                        {cat.label}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">{cat.desc}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Tingkat Handicap (HC) Saat Ini <span className="text-red-400">*</span>
                </label>
                <select
                  value={handicap}
                  onChange={(e) => setHandicap(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="HC 3">Handicap 3 (Pemula / Beginner)</option>
                  <option value="HC 4">Handicap 4 (Pratama)</option>
                  <option value="HC 4+">Handicap 4+ (Madya Bawah)</option>
                  <option value="HC 5">Handicap 5 (Madya)</option>
                  <option value="HC 5+">Handicap 5+ (Madya Atas)</option>
                  <option value="HC 6">Handicap 6 (Utama)</option>
                  <option value="HC 6+ / Pro">Handicap 6+ / Master / Pro</option>
                </select>
                <p className="text-[10px] text-zinc-500 mt-1">
                  *Panitia berhak melakukan verifikasi ulang handicap saat technical meeting.
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Pembayaran & Konfirmasi */}
          <div className="rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-5 sm:p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-800">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                3. Pembayaran Uang Pendaftaran
              </h3>
            </div>

            {/* Rekening Card */}
            <div className="p-4 rounded-xl bg-zinc-950 border border-emerald-950 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                  Transfer Bank Resmi Panitia
                </span>
                <div className="text-sm font-bold text-white mt-0.5">
                  BCA: <span className="font-mono text-emerald-400">882-019-2811</span>
                </div>
                <div className="text-xs text-zinc-400">A/N PANITIA TOURNAMENT BILLIARD NUSANTARA</div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-zinc-500 uppercase font-bold">Nominal</span>
                <div className="text-base font-black text-amber-400">
                  {TOURNAMENT_CONFIG.registration_fee}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Metode Pembayaran
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="BCA Transfer">BCA Transfer</option>
                  <option value="Mandiri Transfer">Mandiri Transfer</option>
                  <option value="QRIS / E-Wallet">QRIS / E-Wallet (GoPay/OVO/Dana)</option>
                  <option value="Cash di Kasir Meja">Bayar Tunai di Kasir Arena (Sebelum Match)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Catatan Transfer / Nomor Ref (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Transfer atas nama Budi / No Ref BCA 192837"
                  value={paymentProofNote}
                  onChange={(e) => setPaymentProofNote(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                />
              </div>

              {/* Rules Agreement */}
              <label className="flex items-start gap-3 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-xs text-zinc-300 leading-relaxed">
                  Saya bersedia mematuhi seluruh regulasi turnamen, dress code rapi (polo shirt & sepatu), datang tepat waktu sesuai jadwal meja, serta menjunjung tinggi sportivitas dan fair play.
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-extrabold text-sm sm:text-base shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  <span>Sedang Mendaftarkan ke Database...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Kirim Formulir Pendaftaran</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-zinc-500 mt-2">
              Data pendaftaran akan langsung terhubung ke database Supabase Anda secara aman.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
