"use client";

import React, { useState } from "react";
import { checkRegistration } from "@/app/actions/registration";
import { Registration } from "@/types/tournament";
import { Search, CheckCircle2, Clock, XCircle, AlertCircle, Phone, User, Trophy } from "lucide-react";

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
    <div className="max-w-2xl mx-auto py-4">
      <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/70 border border-emerald-950/80 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Search className="w-4 h-4" />
          <span>Status Pendaftaran Atlet</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white">
          Cek Status Pendaftaran Anda
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Masukkan Nomor WhatsApp atau Kode Pendaftaran (contoh: <span className="font-mono text-emerald-400">CUE-XXXX</span>) untuk mengecek status verifikasi panitia.
        </p>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="mt-5 flex gap-2">
          <input
            type="text"
            required
            placeholder="Nomor WA atau Kode Pendaftaran..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-50"
          >
            {isLoading ? "Mencari..." : "Cek Status"}
          </button>
        </form>

        {/* Message / Error */}
        {message && (
          <div className="mt-4 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* Results */}
        {results && results.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Ditemukan {results.length} Data Pendaftaran
            </div>

            {results.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-zinc-950 border border-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">
                      {item.full_name}
                    </span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-amber-300 font-bold">
                      {item.registration_code}
                    </span>
                  </div>

                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {item.phone_number}
                    </span>
                    <span className="flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-emerald-400" /> {item.category.toUpperCase()} ({item.handicap})
                    </span>
                    <span>Klub: {item.club_name || "Independent"}</span>
                  </div>
                </div>

                <div>
                  {item.payment_status === "verified" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      TERVERIFIKASI
                    </span>
                  ) : item.payment_status === "rejected" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950 border border-red-500/50 text-red-300 text-xs font-bold">
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      DITOLAK / INVALID
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/50 text-amber-300 text-xs font-bold">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      MENUNGGU VERIFIKASI
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
