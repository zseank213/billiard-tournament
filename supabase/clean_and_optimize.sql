-- =========================================================================
-- TI BILLIARD CUP 2026 - DATABASE CLEANUP & ARCHITECTURAL OPTIMIZATION
-- Jalankan skrip ini langsung di Supabase SQL Editor:
-- Dashboard > SQL Editor > New query
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. BERSIHKAN DATA PENGUJIAN / TESTING DARI TABEL REGISTRATIONS
-- -------------------------------------------------------------------------
DELETE FROM public.registrations
WHERE category IN ('drawn-group-stage', 'tournament-drawn-state')
   OR registration_code LIKE 'SYSTEM_%'
   OR registration_code LIKE 'DRAWN_%'
   OR registration_code LIKE 'RESET_%';

-- -------------------------------------------------------------------------
-- 2. DEDUPLIKASI: HAPUS ROW RIWAYAT LAMA (SISAKAN 1 ROW TERBARU PER BIDANG)
-- -------------------------------------------------------------------------
DELETE FROM public.registrations
WHERE category = 'delegasi-lengkap'
  AND id NOT IN (
    SELECT DISTINCT ON (bidang_name) id
    FROM public.registrations
    WHERE category = 'delegasi-lengkap'
    ORDER BY bidang_name, created_at DESC
  );

-- -------------------------------------------------------------------------
-- 3. PERBAIKI POLISI RLS PADA TABEL REGISTRATIONS
-- (Mengizinkan UPDATE & DELETE agar saat mengedit atlet tidak lagi membuat baris duplikat)
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can submit registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public can update registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public can delete registrations" ON public.registrations;
DROP POLICY IF EXISTS "Public can view registrations" ON public.registrations;

CREATE POLICY "Public can view registrations" ON public.registrations
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can submit registrations" ON public.registrations
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Public can update registrations" ON public.registrations
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Public can delete registrations" ON public.registrations
  FOR DELETE TO anon, authenticated USING (true);

-- -------------------------------------------------------------------------
-- 4. BUAT TABEL KHUSUS TOURNAMENT_DRAWS (PISAH DARI REGISTRATIONS)
-- Best Practice: State undian tidak boleh mencemari tabel data pendaftaran atlet
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tournament_draws (
    category TEXT PRIMARY KEY, -- 'ganda-putra', 'single-putra', 'single-putri'
    groups_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tournament_draws ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view tournament_draws" ON public.tournament_draws;
CREATE POLICY "Public can view tournament_draws" ON public.tournament_draws
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can manage tournament_draws" ON public.tournament_draws;
CREATE POLICY "Public can manage tournament_draws" ON public.tournament_draws
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- -------------------------------------------------------------------------
-- 5. BUKA PERIZINAN RLS UNTUK GROUP_STANDINGS & GROUP_MATCHES
-- -------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can manage group_standings" ON public.group_standings;
CREATE POLICY "Public can manage group_standings" ON public.group_standings
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage group_matches" ON public.group_matches;
CREATE POLICY "Public can manage group_matches" ON public.group_matches
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public can manage playoff_matches" ON public.playoff_matches;
CREATE POLICY "Public can manage playoff_matches" ON public.playoff_matches
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

