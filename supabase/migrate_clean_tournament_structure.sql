-- =========================================================================
-- TI BILLIARD CUP 2026 - ANALISIS & STRUKTUR DATABASE TERBAIK (BEST PRACTICE)
-- Untuk: Group Stage (Babak Penyisihan) & Playoffs (Babak Gugur)
-- =========================================================================

-- =========================================================================
-- 1. HASIL ANALISIS MENDALAM:
-- =========================================================================
--
-- A. TABEL GROUP_STANDINGS (KLASEMEN GRUP)
--    Masalah struktur lama:
--    - Kolom 'status' (qualified/eliminated/null) sering null dan mubazir, karena
--      pada sistem 4 grup, posisi 1 & 2 otomatis lolos, posisi 3, 4, 5 otomatis gugur.
--    - Kolom 'short_name' redundant dengan team_name.
--    - 'series_won' / 'series_lost' sering membingungkan dengan 'racks_won'/'racks_lost'.
--      Istilah standar biliar:
--      * matches_played (Main)
--      * matches_won (Menang)
--      * matches_lost (Kalah)
--      * racks_won (Game Menang)
--      * racks_lost (Game Kalah)
--      * rack_diff (Selisih Game)
--      * points (Poin: 1 poin per match win)
--
-- B. TABEL PLAYOFFS (BAGAN GUGUR 8 BESAR)
--    Masalah struktur lama:
--    - 'team1_short', 'team2_short' sering kosong / tidak digunakan.
--    - Tidak ada nomor meja ('table_number') untuk wasit.
--    - Tidak ada relasi alur pemenang (siapa pemenang QF yang maju ke SF).
--
-- C. REKOMENDASI ARSITEKTUR TERBAIK (MODERN TOURNAMENT ENGINE):
--    1. Tabel Realtime Snapshot: 'tournament_draws' (Babak Grup) & 'tournament_playoffs' (Playoff).
--       Menjamin sinkronisasi 100% instan antara live report wasit di /dashboard
--       dengan tampilan publik di /group-stage dan /playoffs tanpa delay / race condition.
--    2. Tabel Relasional Bersih (Opsional untuk query analitik):
-- =========================================================================

-- 1. TABEL UTAMA PLAYOFFS (REALTIME JSONB SYNC)
CREATE TABLE IF NOT EXISTS public.tournament_playoffs (
    category TEXT PRIMARY KEY, -- 'ganda-putra', 'single-putra', 'single-putri'
    bracket_data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tournament_playoffs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view tournament_playoffs" ON public.tournament_playoffs;
CREATE POLICY "Public can view tournament_playoffs" ON public.tournament_playoffs FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Allow anon upsert tournament_playoffs" ON public.tournament_playoffs;
CREATE POLICY "Allow anon upsert tournament_playoffs" ON public.tournament_playoffs FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);


-- 2. TABEL RELASIONAL BERSIH GROUP STANDINGS (JIKA DIBUTUHKAN QUERY PER BARIS)
CREATE TABLE IF NOT EXISTS public.group_standings_clean (
    id SERIAL PRIMARY KEY,
    group_letter CHAR(1) NOT NULL, -- 'A', 'B', 'C', 'D'
    category TEXT NOT NULL,         -- 'GANDA', 'SINGLE_PUTRA', 'SINGLE_PUTRI'
    rank_pos INT NOT NULL,          -- 1, 2, 3, 4, 5
    team_name TEXT NOT NULL,
    player_names TEXT,
    matches_played INT NOT NULL DEFAULT 0,
    matches_won INT NOT NULL DEFAULT 0,
    matches_lost INT NOT NULL DEFAULT 0,
    racks_won INT NOT NULL DEFAULT 0,
    racks_lost INT NOT NULL DEFAULT 0,
    rack_diff INT NOT NULL DEFAULT 0,
    points INT NOT NULL DEFAULT 0,
    is_qualified BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_group_team UNIQUE (category, group_letter, team_name)
);

ALTER TABLE public.group_standings_clean ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view group_standings_clean" ON public.group_standings_clean;
CREATE POLICY "Public can view group_standings_clean" ON public.group_standings_clean FOR SELECT TO anon, authenticated USING (true);


-- 3. TABEL RELASIONAL BERSIH PLAYOFF MATCHES
CREATE TABLE IF NOT EXISTS public.playoff_matches_clean (
    id TEXT PRIMARY KEY,             -- 'ganda-qf-1', 'ganda-sf-1', 'ganda-gf'
    category TEXT NOT NULL,          -- 'GANDA', 'SINGLE_PUTRA', 'SINGLE_PUTRI'
    stage TEXT NOT NULL,             -- 'QUARTERFINAL', 'SEMIFINAL', 'BRONZE', 'GRAND_FINAL'
    match_number INT NOT NULL,       -- 1, 2, 3, 4
    table_number INT DEFAULT 1,      -- Meja 1 s/d 6
    team1_name TEXT NOT NULL,
    team1_score INT NOT NULL DEFAULT 0,
    team2_name TEXT NOT NULL,
    team2_score INT NOT NULL DEFAULT 0,
    race_to INT NOT NULL DEFAULT 4,
    status TEXT NOT NULL DEFAULT 'upcoming', -- 'upcoming', 'live', 'completed'
    winner_name TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.playoff_matches_clean ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view playoff_matches_clean" ON public.playoff_matches_clean;
CREATE POLICY "Public can view playoff_matches_clean" ON public.playoff_matches_clean FOR SELECT TO anon, authenticated USING (true);

