"use client";

import React, { useState } from "react";
import { checkRegistration } from "@/app/actions/registration";
import { Registration } from "@/types/tournament";
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Phone,
  User,
  Trophy,
  Building,
  Shirt,
  Calendar,
  ChevronRight,
} from "lucide-react";

export const CheckRegistrationModal: React.FC = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Registration[] | null>(null);
  const [message, setMessage] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setMessage("");
    setResults(null);

    try {
      const res = await checkRegistration(query);
      if (res.success && res.data && res.data.length > 0) {
        setResults(res.data);
      } else {
        setMessage(res.message);
      }
    } catch {
      setMessage("Terjadi kesalahan saat mencari data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-4 w-full min-w-0 max-w-full">
      <div className="p-4 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-red-600 text-xs font-black uppercase tracking-wider mb-1">
          <Search className="w-4 h-4" />
          <span>Status Pendaftaran Atlet Antar Bidang</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          Cek Status Pendaftaran Atlet Anda
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Masukkan Nomor WhatsApp atau Kode Pendaftaran (contoh: <span className="font-mono text-red-600 font-bold">CUE-XXXX</span>) untuk memeriksa status registrasi dan verifikasi panitia.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            required
            placeholder="Ketik Nomor WA atau Kode Pendaftaran..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full sm:flex-1 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-base sm:text-sm focus:outline-none focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-500/10 transition-all font-medium"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl btn-championship-red text-xs sm:text-sm font-bold disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {isLoading ? "Mencari..." : "Cek Status"}
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

        {/* Message / Alert */}
        {message && (
          <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-800 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Results List */}
        {results && results.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hasil Ditemukan ({results.length} Atlet):
            </h3>

            {results.map((reg) => (
              <div
                key={reg.id || reg.registration_code}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 luxury-card"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-lg bg-red-100 text-red-700">
                      {reg.registration_code}
                    </span>
                    <span className="font-black text-slate-900 text-base">
                      {reg.full_name}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {reg.club_name || "Perwakilan Bidang"}
                    </span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {reg.phone_number}
                    </span>
                    <span className="text-red-600 font-bold">
                      {reg.handicap}
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>TERDAFTAR</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 font-semibold">
                    {reg.category.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
