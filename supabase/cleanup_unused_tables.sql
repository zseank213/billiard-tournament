-- =============================================================================
-- SQL SCRIPT: CLEANUP TABEL TIDAK TERPAKAI / DUPLIKAT (SUPABASE)
-- TI BILLIARD CUP 2026 — Ganesha Operation
-- =============================================================================
-- Jalankan skrip ini di: Supabase Dashboard -> SQL Editor -> New Query -> Run
-- 
-- TUJUAN:
-- Menghapus tabel-tabel duplikat/uji coba lama yang kosong agar Table Editor
-- bersih, rapi, dan tidak membingungkan panitia.
-- =============================================================================

-- 1. HAPUS TABEL DUPLIKAT / TIDAK DIGUNAKAN
DROP TABLE IF EXISTS public.playoff_matches_clean CASCADE;
DROP TABLE IF EXISTS public.group_standings_clean CASCADE;
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.group_matches CASCADE;

-- 2. PASTIKAN PERIZINAN RLS UNTUK PLAYOFF_MATCHES AKTIF
ALTER TABLE public.playoff_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can manage playoff_matches" ON public.playoff_matches;
CREATE POLICY "Public can manage playoff_matches" ON public.playoff_matches
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- HASIL AKHIR:
-- Tabel resmi yang aktif & dipakai aplikasi sekarang adalah:
-- 1. registrations       -> Data pendaftaran atlet (Ganda, Single Putra, Single Putri)
-- 2. bidang              -> Master 20 bidang kantor pusat GO
-- 3. table_officials     -> Daftar penanggung jawab & wasit meja
-- 4. tournament_draws    -> Snapshot undian grup, skor babak grup, klasemen
-- 5. playoff_matches     -> Tabel 24 pertandingan bagan playoff (QF, SF, Bronze, Final)
-- =============================================================================
