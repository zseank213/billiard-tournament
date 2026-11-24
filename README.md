# 🎱 Billiard Tournament Dashboard & Registration (Next.js + Supabase)

Website modern dan berkecepatan tinggi (*ultra-fast performance*) untuk turnamen billiard. Dibuat dengan **Next.js 16 (App Router + Turbopack)**, **Tailwind CSS v4**, **TypeScript**, dan terintegrasi langsung dengan **Supabase** untuk live schedule & formulir pendaftaran atlet.

---

## 🚀 Fitur Utama

1. **Jadwal Pertandingan (Live Schedule Dashboard)**
   - Filter berdasarkan status: **🔴 LIVE ON TABLE**, **⏳ UPCOMING**, **✅ SELESAI**.
   - Filter nomor meja pertandingan (Meja 1 - 8) dan nama babak (Babak 32 Besar, 16 Besar, Semifinal, Grand Final).
   - Pencarian instan berdasarkan nama atlet atau klub.
   - Papan skor real-time dan highlight pemenang pertandingan.

2. **Formulir Pendaftaran Atlet (Google Form Style)**
   - Formulir pendaftaran bertingkat yang rapi dan mudah diisi (Identitas, Handicap HC 3 - Pro, Kategori Turnamen, dan Pembayaran).
   - Validasi data otomatis & penyimpanan langsung ke tabel Supabase `registrations`.
   - Menghasilkan **Digital Tournament Pass** otomatis dengan kode registrasi unik (contoh: `CUE-8924`).
   - Tombol instan untuk konfirmasi bukti pendaftaran via WhatsApp panitia.

3. **Cek Status Pendaftaran**
   - Peserta dapat mengecek status verifikasi panitia (*Verified*, *Pending*, *Rejected*) cukup dengan memasukkan Nomor WhatsApp atau Kode Pendaftaran.

4. **Koneksi Supabase Otomatis & Graceful Fallback**
   - Jika Supabase belum dihubungkan, website otomatis berjalan dalam **Mode Demo** tanpa error sedikitpun.
   - Dilengkapi panduan visual di dalam website untuk menyambungkan Supabase.

---

## 🛠️ Cara Menghubungkan ke Supabase Anda

### Langkah 1: Jalankan SQL Script di Supabase
1. Buka dashboard Supabase Anda di [supabase.com](https://supabase.com/dashboard).
2. Masuk ke menu **SQL Editor**.
3. Buka file [`supabase/schema.sql`](supabase/schema.sql) dari project ini, salin seluruh kodenya dan klik **Run**.
4. Script ini otomatis membuat:
   - Tabel `registrations` (data formulir pendaftaran)
   - Tabel `matches` (jadwal & skor turnamen)
   - Kebijakan Row Level Security (RLS) aman
   - Data awal jadwal pertandingan (*seed data*)

### Langkah 2: Konfigurasi Environment Variables
Buka file [`.env.local`](.env.local) di root project, lalu isi dengan kunci dari **Project Settings → API** di Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Langkah 3: Jalankan Project
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 📁 Struktur Folder Project

```
billiard-tournament/
├── src/
│   ├── app/
│   │   ├── actions/
│   │   │   ├── matches.ts         # Server actions untuk jadwal pertandingan Supabase
│   │   │   └── registration.ts    # Server actions untuk submit & cek pendaftaran
│   │   ├── globals.css            # Styling tema dark felt billiard & glow
│   │   ├── layout.tsx             # Root layout & SEO metadata turnamen
│   │   └── page.tsx               # Halaman utama (Schedule, G-Form, Cek Status)
│   ├── components/
│   │   ├── Navbar.tsx             # Navigasi & indikator status koneksi Supabase
│   │   ├── HeroBanner.tsx         # Banner turnamen, total hadiah & statistik meja
│   │   ├── ScheduleView.tsx       # Tampilan jadwal, filter meja & live match card
│   │   ├── RegistrationForm.tsx   # Form pendaftaran Google Form style & Digital Pass
│   │   ├── CheckRegistrationModal.tsx # Pencarian status pendaftaran atlet
│   │   └── SupabaseSetupGuide.tsx # Panduan modal setup Supabase
│   ├── lib/
│   │   ├── mock-data.ts           # Konfigurasi turnamen & data awal jadwal
│   │   └── supabase.ts            # Supabase client helper
│   └── types/
│       └── tournament.ts          # TypeScript interfaces untuk Match & Registration
├── supabase/
│   └── schema.sql                 # Script SQL siap pakai untuk Supabase SQL Editor
├── .env.example
├── .env.local
└── package.json
```

---

## ⚡ Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL + RLS)
- **Icons**: Lucide React
