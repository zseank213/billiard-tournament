-- =========================================================================
-- SUPABASE SCHEMA FOR BILLIARD TOURNAMENT DASHBOARD & REGISTRATION
-- =========================================================================
-- Copy and paste this script directly into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql

-- 1. Create table: registrations (Google Form style registration entries)
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    email TEXT,
    city TEXT,
    club_name TEXT,
    category TEXT NOT NULL,
    handicap TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    payment_proof_note TEXT,
    payment_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookups by code or phone
CREATE INDEX IF NOT EXISTS idx_registrations_code ON public.registrations(registration_code);
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON public.registrations(phone_number);

-- 2. Create table: matches (Tournament Schedule & Live Scores)
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY,
    round_name TEXT NOT NULL,
    match_number INT NOT NULL,
    table_number INT NOT NULL,
    scheduled_time TEXT NOT NULL,
    player1_name TEXT NOT NULL,
    player1_handicap TEXT,
    player1_club TEXT,
    player2_name TEXT NOT NULL,
    player2_handicap TEXT,
    player2_club TEXT,
    score1 INT DEFAULT 0,
    score2 INT DEFAULT 0,
    race_to INT DEFAULT 7,
    status TEXT DEFAULT 'upcoming', -- 'upcoming', 'live', 'completed'
    winner TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Setup Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Allow public anyone to view match schedules
DROP POLICY IF EXISTS "Public can view matches" ON public.matches;
CREATE POLICY "Public can view matches"
    ON public.matches FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow public anyone to submit registration (Google Form equivalent)
DROP POLICY IF EXISTS "Public can submit registrations" ON public.registrations;
CREATE POLICY "Public can submit registrations"
    ON public.registrations FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow public to query registration verification by registration_code or phone_number
DROP POLICY IF EXISTS "Public can query their registration status" ON public.registrations;
CREATE POLICY "Public can query their registration status"
    ON public.registrations FOR SELECT
    TO anon, authenticated
    USING (true);

-- 4. Initial Seed Data for Schedule (Tournament Matches)
INSERT INTO public.matches (
    id, round_name, match_number, table_number, scheduled_time,
    player1_name, player1_handicap, player1_club,
    player2_name, player2_handicap, player2_club,
    score1, score2, race_to, status, winner
) VALUES
('m-01', 'Babak 32 Besar', 1, 1, '2026-11-28 13:00', 'Ferry ''The Sniper'' S.', 'HC 5', 'Predator Club Jakarta', 'Rian Pratama', 'HC 4', 'Bandung Cue Masters', 4, 2, 7, 'live', NULL),
('m-02', 'Babak 32 Besar', 2, 2, '2026-11-28 13:00', 'Edward Wijaya', 'HC 6', 'Surabaya Pool Center', 'Bambang Kurnia', 'HC 5', 'Solo Billiard Academy', 5, 5, 7, 'live', NULL),
('m-03', 'Babak 32 Besar', 3, 3, '2026-11-28 13:30', 'David ''Ghost'' Tan', 'HC 6', 'Medan Snooker Hub', 'Agus Santoso', 'HC 4+', 'Semarang Break House', 7, 3, 7, 'completed', 'David ''Ghost'' Tan'),
('m-04', 'Babak 32 Besar', 4, 4, '2026-11-28 13:30', 'Satria Pratama', 'HC 4', 'Yogya Pool Studio', 'Kevin Alexander', 'HC 5', 'Bali Cue Sports', 7, 6, 7, 'completed', 'Satria Pratama'),
('m-05', 'Babak 32 Besar', 5, 1, '2026-11-28 15:00', 'Hendrik ''Cyclone'' L.', 'HC 6+', 'Jakarta Pool Federation', 'Donny Setiawan', 'HC 5', 'Palembang Billiard Club', 0, 0, 7, 'upcoming', NULL),
('m-06', 'Babak 32 Besar', 6, 2, '2026-11-28 15:00', 'Reza Maulana', 'HC 4', 'Makassar Cue Warriors', 'Tomy Chandra', 'HC 4+', 'Bekasi 8-Ballers', 0, 0, 7, 'upcoming', NULL),
('m-07', 'Babak 16 Besar', 7, 3, '2026-11-29 14:00', 'David ''Ghost'' Tan', 'HC 6', 'Medan Snooker Hub', 'Satria Pratama', 'HC 4', 'Yogya Pool Studio', 0, 0, 8, 'upcoming', NULL),
('m-08', 'Babak 16 Besar', 8, 4, '2026-11-29 14:00', 'TBD (Pemenang M-01)', '-', '', 'TBD (Pemenang M-02)', '-', '', 0, 0, 8, 'upcoming', NULL),
('m-09', 'Quarter Final', 9, 1, '2026-11-30 16:00', 'TBD', '-', '', 'TBD', '-', '', 0, 0, 9, 'upcoming', NULL),
('m-10', 'Grand Final', 10, 1, '2026-12-02 19:30', 'Finalist 1', 'Pro / HC 6+', '', 'Finalist 2', 'Pro / HC 6+', '', 0, 0, 11, 'upcoming', NULL)
ON CONFLICT (id) DO UPDATE 
SET score1 = EXCLUDED.score1,
    score2 = EXCLUDED.score2,
    status = EXCLUDED.status;
