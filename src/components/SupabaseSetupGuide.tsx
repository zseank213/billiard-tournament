"use client";

import React, { useState } from "react";
import { Database, Check, Copy, ExternalLink, X, Terminal, Shield, Zap } from "lucide-react";

interface SupabaseSetupGuideProps {
  isOpen: boolean;
  onClose: () => void;
  isConfigured: boolean;
}

export const SupabaseSetupGuide: React.FC<SupabaseSetupGuideProps> = ({
  isOpen,
  onClose,
  isConfigured,
}) => {
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const envSample = `NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here`;

  const copyEnvSample = () => {
    navigator.clipboard.writeText(envSample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-950 border border-emerald-500/40 p-6 sm:p-8 shadow-2xl emerald-glow text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">
              Panduan Menghubungkan ke Supabase Anda
            </h3>
            <p className="text-xs text-zinc-400">
              Integrasi database untuk Schedule Pertandingan & Form Pendaftaran
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="my-4 p-3 rounded-xl border flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConfigured ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span className="text-zinc-200">
              Status Koneksi:{" "}
              {isConfigured ? (
                <span className="text-emerald-400">Terhubung ke Database Supabase</span>
              ) : (
                <span className="text-amber-400">Mode Demo (Data lokal / belum ada API Key)</span>
              )}
            </span>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:underline"
          >
            <span>Buka Supabase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Step-by-step */}
        <div className="space-y-4 text-xs sm:text-sm text-zinc-300">
          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
            <div className="font-bold text-white mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-black font-extrabold text-xs flex items-center justify-center">
                1
              </span>
              <span>Buat Tabel di Supabase (1-Klik SQL)</span>
            </div>
            <p className="text-zinc-400 text-xs mb-2">
              Buka menu <strong>SQL Editor</strong> di dashboard Supabase Anda, lalu salin dan jalankan seluruh isi file:
            </p>
            <div className="p-2.5 rounded-lg bg-zinc-950 font-mono text-emerald-300 text-xs flex items-center justify-between border border-zinc-800">
              <span>supabase/schema.sql</span>
              <span className="text-[10px] text-zinc-500">Sudah otomatis dibuat di project</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              Script ini akan membuat tabel <code className="text-emerald-400">registrations</code>, tabel <code className="text-emerald-400">matches</code>, beserta Row Level Security (RLS) dan data awal jadwal pertandingan.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
            <div className="font-bold text-white mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-black font-extrabold text-xs flex items-center justify-center">
                2
              </span>
              <span>Masukkan API Key ke file .env.local</span>
            </div>
            <p className="text-zinc-400 text-xs mb-2">
              Buka <strong>Project Settings → API</strong> di Supabase, lalu masukkan ke file <code className="text-emerald-400">.env.local</code> di folder project ini:
            </p>
            <div className="relative p-3 rounded-lg bg-zinc-950 font-mono text-[11px] text-zinc-300 border border-zinc-800">
              <pre>{envSample}</pre>
              <button
                onClick={copyEnvSample}
                className="absolute top-2 right-2 p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center gap-1"
              >
                {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedEnv ? "Tersalin" : "Copy"}</span>
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800">
            <div className="font-bold text-white mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-600 text-black font-extrabold text-xs flex items-center justify-center">
                3
              </span>
              <span>Restart atau Refresh Website</span>
            </div>
            <p className="text-zinc-400 text-xs">
              Setelah file <code className="text-emerald-400">.env.local</code> diisi, website secara otomatis akan membaca jadwal dari Supabase secara real-time dan setiap pendaftaran yang diisi di form akan langsung masuk ke tabel Supabase Anda!
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
