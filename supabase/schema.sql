-- =========================================================================
-- TI BILLIARD CUP 2026 - SUPABASE DATABASE SCHEMA & SEED DATA
-- Project: https://supabase.com/dashboard/project/yciaiwicidarrxgwneqm
-- =========================================================================
-- Jalankan skrip ini langsung di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yciaiwicidarrxgwneqm/sql/new

-- -------------------------------------------------------------------------
-- 1. TABEL: BIDANG (20 Bidang: 1 IT DEPT Penyelenggara + 19 Bidang Diundang)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bidang (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    is_host BOOLEAN DEFAULT false,
    order_no INT NOT NULL,
    status TEXT DEFAULT 'invited',
    quota_ganda_putra INT DEFAULT 2,
    quota_single_putra INT DEFAULT 1,
    quota_single_putri INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bidang_code ON public.bidang(code);
CREATE INDEX IF NOT EXISTS idx_bidang_order ON public.bidang(order_no);

-- Seed 20 Bidang
INSERT INTO public.bidang (id, code, name, short_name, is_host, order_no, status, quota_ganda_putra, quota_single_putra, quota_single_putri)
VALUES
(1, 'IT', 'Teknologi Informasi (IT DEPT)', 'IT', true, 1, 'host', 2, 1, 1),
(2, 'SEL', 'Selling', 'SEL', false, 2, 'invited', 2, 1, 1),
(3, 'PMA', 'Pembuat Materi Ajar', 'PMA', false, 3, 'invited', 2, 1, 1),
(4, 'LIT', 'Penelitian dan Pengembangan', 'LIT', false, 4, 'invited', 2, 1, 1),
(5, 'MKT', 'Marketing', 'MKT', false, 5, 'invited', 2, 1, 1),
(6, 'DIG', 'Digital Marketing dan Media Sosial', 'DIG', false, 6, 'invited', 2, 1, 1),
(7, 'SDM', 'Sumber Daya Manusia', 'SDM', false, 7, 'invited', 2, 1, 1),
(8, 'KON', 'Koordinator Kepala Bagian Konstruksi', 'KON', false, 8, 'invited', 2, 1, 1),
(9, 'SEK', 'Sekuriti dan Dokumentasi Aset', 'SEK', false, 9, 'invited', 2, 1, 1),
(10, 'PPS', 'Pelayanan dan Pembinaan Siswa', 'PPS', false, 10, 'invited', 2, 1, 1),
(11, 'OPE', 'Operasional Pengajar', 'OPE', false, 11, 'invited', 2, 1, 1),
(12, 'IMP', 'Implementasi Materi Pelajaran', 'IMP', false, 12, 'invited', 2, 1, 1),
(13, 'PPA', 'Peningkatan Prestasi Akademik', 'PPA', false, 13, 'invited', 2, 1, 1),
(14, 'MSD', 'Koordinator Kepala Bagian Pengendali Mutu Materi SD dan SMP', 'MUT-SD', false, 14, 'invited', 2, 1, 1),
(15, 'MSMA', 'Koordinator Kepala Bagian Pengendali Mutu Materi SMA dan TPS', 'MUT-SMA', false, 15, 'invited', 2, 1, 1),
(16, 'LOG', 'Manajer Logistik dan Distribusi', 'LOG', false, 16, 'invited', 2, 1, 1),
(17, 'AKT', 'Manajer Akuntansi', 'AKT', false, 17, 'invited', 2, 1, 1),
(18, 'AUD', 'Audit Administrasi dan Kepatuhan', 'AUD', false, 18, 'invited', 2, 1, 1),
(19, 'PENG', 'Pengadaan dan Pemeliharaan', 'PENG', false, 19, 'invited', 2, 1, 1),
(20, 'AREK', 'Koordinator Kepala Bagian Audit Rekening', 'AREK', false, 20, 'invited', 2, 1, 1)
ON CONFLICT (code) DO UPDATE
SET name = EXCLUDED.name,
    short_name = EXCLUDED.short_name,
    is_host = EXCLUDED.is_host,
    order_no = EXCLUDED.order_no,
    status = EXCLUDED.status;

-- -------------------------------------------------------------------------
-- 2. TABEL: REGISTRATIONS (Formulir Pendaftaran Delegasi Lengkap Antar Bidang)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_code TEXT UNIQUE NOT NULL,
    bidang_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    city TEXT DEFAULT 'Bandung',
    club_name TEXT,
    category TEXT DEFAULT 'delegasi-lengkap',
    -- Kategori Ganda Putra (Nama & WhatsApp Tiap Pemain)
    ganda_tim1_player1 TEXT,
    ganda_tim1_player1_phone TEXT,
    ganda_tim1_player2 TEXT,
    ganda_tim1_player2_phone TEXT,
    ganda_tim2_player1 TEXT,
    ganda_tim2_player1_phone TEXT,
    ganda_tim2_player2 TEXT,
    ganda_tim2_player2_phone TEXT,
    -- Kategori Single Putra (Nama & WhatsApp)
    single_putra_player TEXT,
    single_putra_phone TEXT,
    -- Kategori Single Putri (Nama & WhatsApp)
    single_putri_player TEXT,
    single_putri_phone TEXT,
    -- Status & Catatan
    notes TEXT,
    full_name TEXT, -- Ringkasan nama delegasi
    status TEXT NOT NULL DEFAULT 'confirmed',
    payment_status TEXT NOT NULL DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Migrasi kolom WhatsApp per atlet jika tabel registrations sudah ada sebelumnya:
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ganda_tim1_player1 TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ganda_tim1_player1_phone TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ganda_tim1_player2 TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ganda_tim1_player2_phone TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ganda_tim2_player1 TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ganda_tim2_player1_phone TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ganda_tim2_player2 TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS ganda_tim2_player2_phone TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS single_putra_player TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS single_putra_phone TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS single_putri_player TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS single_putri_phone TEXT;
ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS notes TEXT;

CREATE INDEX IF NOT EXISTS idx_reg_code ON public.registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_reg_bidang ON public.registrations(bidang_name);

-- -------------------------------------------------------------------------
-- 3. TABEL: GROUP_STANDINGS (Klasemen Babak Penyisihan Fase Grup)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.group_standings (
    id SERIAL PRIMARY KEY,
    group_name TEXT NOT NULL, -- 'Grup A', 'Grup B'
    category TEXT NOT NULL DEFAULT 'Ganda Putra',
    pos INT NOT NULL,
    team_id TEXT NOT NULL,
    team_name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    matches_played INT DEFAULT 0,
    series_won INT DEFAULT 0,
    series_lost INT DEFAULT 0,
    racks_won INT DEFAULT 0,
    racks_lost INT DEFAULT 0,
    rack_diff INT DEFAULT 0,
    points INT DEFAULT 0,
    status TEXT DEFAULT NULL -- 'qualified', 'eliminated', or NULL
);

-- Seed data awal bersih (nilai 0, belum ada yang lolos/gugur)
INSERT INTO public.group_standings (id, group_name, category, pos, team_id, team_name, short_name, matches_played, series_won, series_lost, racks_won, racks_lost, rack_diff, points, status)
VALUES
(1, 'Grup A', 'Ganda Putra', 1, 'team-ti', 'Teknologi Informasi (IT DEPT)', 'IT DEPT', 0, 0, 0, 0, 0, 0, 0, NULL),
(2, 'Grup A', 'Ganda Putra', 2, 'team-selling', 'Selling', 'SELLING', 0, 0, 0, 0, 0, 0, 0, NULL),
(3, 'Grup A', 'Ganda Putra', 3, 'team-mkt', 'Marketing', 'MKT', 0, 0, 0, 0, 0, 0, 0, NULL),
(4, 'Grup A', 'Ganda Putra', 4, 'team-logistik', 'Manajer Logistik dan Distribusi', 'LOGISTIK', 0, 0, 0, 0, 0, 0, 0, NULL),
(5, 'Grup B', 'Ganda Putra', 1, 'team-litbang', 'Penelitian dan Pengembangan', 'LITBANG', 0, 0, 0, 0, 0, 0, 0, NULL),
(6, 'Grup B', 'Ganda Putra', 2, 'team-akuntansi', 'Manajer Akuntansi', 'AKUNTANSI', 0, 0, 0, 0, 0, 0, 0, NULL),
(7, 'Grup B', 'Ganda Putra', 3, 'team-sdm', 'Sumber Daya Manusia', 'SDM', 0, 0, 0, 0, 0, 0, 0, NULL),
(8, 'Grup B', 'Ganda Putra', 4, 'team-audit-rek', 'Koordinator Kepala Bagian Audit Rekening', 'AUDIT REK', 0, 0, 0, 0, 0, 0, 0, NULL)
ON CONFLICT (id) DO UPDATE
SET matches_played = EXCLUDED.matches_played,
    series_won = EXCLUDED.series_won,
    series_lost = EXCLUDED.series_lost,
    racks_won = EXCLUDED.racks_won,
    racks_lost = EXCLUDED.racks_lost,
    rack_diff = EXCLUDED.rack_diff,
    points = EXCLUDED.points,
    status = EXCLUDED.status;

-- -------------------------------------------------------------------------
-- 4. TABEL: GROUP_MATCHES (Pertandingan Head-to-Head Babak Grup)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.group_matches (
    id TEXT PRIMARY KEY,
    group_name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'Ganda Putra',
    team1 TEXT NOT NULL,
    team2 TEXT NOT NULL,
    score1 INT DEFAULT 0,
    score2 INT DEFAULT 0,
    status TEXT DEFAULT 'upcoming'
);

INSERT INTO public.group_matches (id, group_name, category, team1, team2, score1, score2, status)
VALUES
('ga-m1', 'Grup A', 'Ganda Putra', 'Teknologi Informasi (IT DEPT)', 'Selling', 0, 0, 'upcoming'),
('ga-m2', 'Grup A', 'Ganda Putra', 'Marketing', 'Manajer Logistik dan Distribusi', 0, 0, 'upcoming'),
('ga-m3', 'Grup A', 'Ganda Putra', 'Teknologi Informasi (IT DEPT)', 'Marketing', 0, 0, 'upcoming'),
('ga-m4', 'Grup A', 'Ganda Putra', 'Selling', 'Manajer Logistik dan Distribusi', 0, 0, 'upcoming'),
('ga-m5', 'Grup A', 'Ganda Putra', 'Teknologi Informasi (IT DEPT)', 'Manajer Logistik dan Distribusi', 0, 0, 'upcoming'),
('ga-m6', 'Grup A', 'Ganda Putra', 'Selling', 'Marketing', 0, 0, 'upcoming'),
('gb-m1', 'Grup B', 'Ganda Putra', 'Penelitian dan Pengembangan', 'Manajer Akuntansi', 0, 0, 'upcoming'),
('gb-m2', 'Grup B', 'Ganda Putra', 'Sumber Daya Manusia', 'Koordinator Kepala Bagian Audit Rekening', 0, 0, 'upcoming'),
('gb-m3', 'Grup B', 'Ganda Putra', 'Penelitian dan Pengembangan', 'Sumber Daya Manusia', 0, 0, 'upcoming'),
('gb-m4', 'Grup B', 'Ganda Putra', 'Manajer Akuntansi', 'Koordinator Kepala Bagian Audit Rekening', 0, 0, 'upcoming'),
('gb-m5', 'Grup B', 'Ganda Putra', 'Penelitian dan Pengembangan', 'Koordinator Kepala Bagian Audit Rekening', 0, 0, 'upcoming'),
('gb-m6', 'Grup B', 'Ganda Putra', 'Manajer Akuntansi', 'Sumber Daya Manusia', 0, 0, 'upcoming')
ON CONFLICT (id) DO UPDATE
SET score1 = EXCLUDED.score1,
    score2 = EXCLUDED.score2,
    status = EXCLUDED.status;

-- -------------------------------------------------------------------------
-- 5. TABEL: PLAYOFF_MATCHES (Bagan Gugur Playoffs)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.playoff_matches (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL DEFAULT 'Ganda Putra',
    round_name TEXT NOT NULL,
    team1_name TEXT NOT NULL,
    team1_short TEXT,
    team1_score INT DEFAULT 0,
    team2_name TEXT NOT NULL,
    team2_short TEXT,
    team2_score INT DEFAULT 0,
    race_to INT DEFAULT 4,
    status TEXT DEFAULT 'upcoming',
    winner TEXT DEFAULT NULL
);

INSERT INTO public.playoff_matches (id, category, round_name, team1_name, team1_short, team1_score, team2_name, team2_short, team2_score, race_to, status, winner)
VALUES
('qf-1', 'Ganda Putra', 'Quarterfinal 1 (8 Besar)', 'Juara Grup A', '1A', 0, 'Runner-up Grup B', '2B', 0, 4, 'upcoming', NULL),
('qf-2', 'Ganda Putra', 'Quarterfinal 2 (8 Besar)', 'Runner-up Grup A', '2A', 0, 'Peringkat 3 Grup B', '3B', 0, 4, 'upcoming', NULL),
('qf-3', 'Ganda Putra', 'Quarterfinal 3 (8 Besar)', 'Juara Grup B', '1B', 0, 'Peringkat 3 Grup A', '3A', 0, 4, 'upcoming', NULL),
('qf-4', 'Ganda Putra', 'Quarterfinal 4 (8 Besar)', 'Peringkat 4 Grup A', '4A', 0, 'Peringkat 4 Grup B', '4B', 0, 4, 'upcoming', NULL),
('sf-1', 'Ganda Putra', 'Semifinal 1 (4 Besar)', 'Pemenang QF 1', 'W1', 0, 'Pemenang QF 2', 'W2', 0, 4, 'upcoming', NULL),
('sf-2', 'Ganda Putra', 'Semifinal 2 (4 Besar)', 'Pemenang QF 3', 'W3', 0, 'Pemenang QF 4', 'W4', 0, 4, 'upcoming', NULL),
('gf-1', 'Ganda Putra', 'Grand Final Kejuaraan', 'Pemenang SF 1', 'W-SF1', 0, 'Pemenang SF 2', 'W-SF2', 0, 5, 'upcoming', NULL),
('bz-1', 'Ganda Putra', 'Perebutan Juara 3', 'Kalah SF 1', 'L1', 0, 'Kalah SF 2', 'L2', 0, 4, 'upcoming', NULL)
ON CONFLICT (id) DO UPDATE
SET team1_score = EXCLUDED.team1_score,
    team2_score = EXCLUDED.team2_score,
    status = EXCLUDED.status,
    winner = EXCLUDED.winner;

-- -------------------------------------------------------------------------
-- 6. SETUP ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------
ALTER TABLE public.bidang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playoff_matches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view bidang" ON public.bidang;
CREATE POLICY "Public can view bidang" ON public.bidang FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can submit registrations" ON public.registrations;
CREATE POLICY "Public can submit registrations" ON public.registrations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public can view registrations" ON public.registrations;
CREATE POLICY "Public can view registrations" ON public.registrations FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can view group_standings" ON public.group_standings;
CREATE POLICY "Public can view group_standings" ON public.group_standings FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can view group_matches" ON public.group_matches;
CREATE POLICY "Public can view group_matches" ON public.group_matches FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "Public can view playoff_matches" ON public.playoff_matches;
CREATE POLICY "Public can view playoff_matches" ON public.playoff_matches FOR SELECT TO anon, authenticated USING (true);

-- -------------------------------------------------------------------------
-- 7. TABEL: TABLE_OFFICIALS (Daftar Penanggung Jawab / Wasit Meja 1 s/d Meja 6)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.table_officials (
    id SERIAL PRIMARY KEY,
    table_number INT NOT NULL,
    table_name TEXT NOT NULL,
    table_type TEXT NOT NULL, -- 'match' atau 'mini_game'
    category_label TEXT NOT NULL,
    pj_name TEXT NOT NULL,
    role TEXT NOT NULL,
    order_no INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_table_officials_num ON public.table_officials(table_number);

-- Seed Data 10 Penanggung Jawab Resmi Per Meja
INSERT INTO public.table_officials (id, table_number, table_name, table_type, category_label, pj_name, role, order_no)
VALUES
(1, 1, 'Meja 1', 'match', 'Turnamen Bola 8 Resmi', 'Musbahniar', 'Wasit Utama Meja 1', 1),
(2, 1, 'Meja 1', 'match', 'Turnamen Bola 8 Resmi', 'Abraham Wellmart Marudut Tua Siahaan', 'Pengawas & Pencatat Meja 1', 2),
(3, 2, 'Meja 2', 'match', 'Turnamen Bola 8 Resmi', 'Roy Aziz Barera', 'Wasit Utama Meja 2', 1),
(4, 2, 'Meja 2', 'match', 'Turnamen Bola 8 Resmi', 'Muhammad Asman', 'Pengawas & Pencatat Meja 2', 2),
(5, 3, 'Meja 3', 'match', 'Turnamen Bola 8 Resmi', 'Calvin Satria Dewangga Putra H', 'Wasit Utama Meja 3', 1),
(6, 3, 'Meja 3', 'match', 'Turnamen Bola 8 Resmi', 'Muhammad Alwin Lapapahi', 'Pengawas & Pencatat Meja 3', 2),
(7, 4, 'Meja 4', 'match', 'Turnamen Bola 8 Resmi', 'Raihan Fuad Syakir', 'Wasit & Pengawas Meja 4', 1),
(8, 5, 'Meja 5', 'match', 'Turnamen Bola 8 Resmi', 'Muhammad Ilham Rizki Pratama', 'Wasit & Pengawas Meja 5', 1),
(9, 6, 'Meja 6', 'mini_game', 'Mini Games & Doorprize Arena', 'Dzakiy Harissalam', 'Koordinator Mini Game Meja 6', 1),
(10, 6, 'Meja 6', 'mini_game', 'Mini Games & Doorprize Arena', 'Ahmad Yoga Witdodo', 'PJ Validasi & Doorprize Meja 6', 2)
ON CONFLICT (id) DO UPDATE
SET table_number = EXCLUDED.table_number,
    table_name = EXCLUDED.table_name,
    table_type = EXCLUDED.table_type,
    category_label = EXCLUDED.category_label,
    pj_name = EXCLUDED.pj_name,
    role = EXCLUDED.role,
    order_no = EXCLUDED.order_no;

ALTER TABLE public.table_officials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view table_officials" ON public.table_officials;
CREATE POLICY "Public can view table_officials" ON public.table_officials FOR SELECT TO anon, authenticated USING (true);

