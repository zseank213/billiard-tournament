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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              Koneksi Database Supabase
            </h3>
            <p className="text-xs text-slate-500">
              Integrasi live database untuk Jadwal Pertandingan & Pendaftaran TI Billiard Cup 2026
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="my-4 p-3.5 rounded-2xl border flex items-center justify-between text-xs font-semibold bg-slate-50 border-slate-200">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isConfigured ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
              }`}
            />
            <span className="text-slate-700">
              Status Database:{" "}
              {isConfigured ? (
                <span className="text-emerald-700 font-bold">Terhubung ke Database Live</span>
              ) : (
                <span className="text-amber-700 font-bold">Mode Mock / Demo Siap Terhubung</span>
              )}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">PostgreSQL Ready</span>
        </div>

        {/* Content Steps */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-600">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-red-600" />
              <span>Langkah 1: Konfigurasi Environment Variables</span>
            </div>
            <p className="text-xs text-slate-600">
              Buka file <code className="px-1.5 py-0.5 rounded bg-white border font-mono text-red-600">.env.local</code> di folder proyek dan isi URL & Anon Key dari project dashboard Supabase:
            </p>

            <div className="relative mt-2">
              <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                {envSample}
              </pre>
              <button
                onClick={copyEnvSample}
                className="absolute top-2.5 right-2.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1.5"
              >
                {copiedEnv ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Langkah 2: Skema Tabel Supabase</span>
            </div>
            <p className="text-xs text-slate-600">
              File skema SQL telah tersedia di <code className="px-1.5 py-0.5 rounded bg-white border font-mono text-slate-800">supabase/schema.sql</code>. Anda dapat langsung menjalankannya di SQL Editor Supabase untuk membuat tabel <span className="font-bold text-slate-800">matches</span> dan <span className="font-bold text-slate-800">registrations</span>.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
