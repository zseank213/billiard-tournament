  -- =========================================================================
  -- TI BILLIARD CUP 2026 - MIGRATION: NORMALIZED REGISTRATIONS SCHEMA
  -- Jalankan skrip ini langsung di Supabase SQL Editor:
  -- Dashboard > SQL Editor > New query
  -- =========================================================================

  -- 1. BACKUP TABEL LAMA (SEBAGAI PENGAMAN)
  CREATE TABLE IF NOT EXISTS public.registrations_backup_old AS SELECT * FROM public.registrations;

  -- 2. BUAT TIPE ENUM CATEGORY
  DO $$ BEGIN
      CREATE TYPE registration_category AS ENUM ('GANDA', 'SINGLE_PUTRA', 'SINGLE_PUTRI');
  EXCEPTION
      WHEN duplicate_object THEN null;
  END $$;

  -- 3. BUAT TABEL REGISTRATIONS BARU YANG BERSIH & RAPI
  DROP TABLE IF EXISTS public.registrations CASCADE;

  CREATE TABLE public.registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      bidang_name TEXT NOT NULL,
      category registration_category NOT NULL,
      team_label TEXT NOT NULL,
      player1_name TEXT NOT NULL,
      player1_phone TEXT,
      player2_name TEXT,
      player2_phone TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
  );

  CREATE INDEX idx_registrations_bidang ON public.registrations(bidang_name);
  CREATE INDEX idx_registrations_category ON public.registrations(category);

  -- 4. INSERT DATA BERSIH (45 ENTRI RESMI DARI SELURUH BIDANG)
  INSERT INTO public.registrations (bidang_name, category, team_label, player1_name, player1_phone, player2_name, player2_phone)
  VALUES
  ('Teknologi Informasi', 'GANDA', 'Ganda 1', 'Asman', '085156874394', 'Yudha', '087878841224'),
  ('Teknologi Informasi', 'GANDA', 'Ganda 2', 'Alwin', '082291984239', 'Abraham', '0829540615868'),
  ('Teknologi Informasi', 'SINGLE_PUTRA', 'Single Putra', 'Alwin', '082291984239', NULL, NULL),
  ('Teknologi Informasi', 'GANDA', 'Ganda 3', 'Michael Sean Pasquale Thomas', '085189970998', 'M Arifien Syachrizal', '081220906625'),
  ('Teknologi Informasi', 'GANDA', 'Ganda 4', 'Rofi Fathurrohman', '081388373836', 'Wildan Farid Afif', '087843114135'),
  ('Teknologi Informasi', 'GANDA', 'Ganda 5', 'Ilham Rizki', '085156795943', 'Rizki Widiyanto', '085172145348'),
  ('Teknologi Informasi', 'SINGLE_PUTRA', 'Single Putra 2', 'Calvin', '0895423468234', NULL, NULL),
  ('Teknologi Informasi', 'SINGLE_PUTRA', 'Single Putra 3', 'Abraham', '0829540615868', NULL, NULL),
  ('Teknologi Informasi', 'SINGLE_PUTRA', 'Single Putra 4', 'M Arifien Syachrizal', '081220906625', NULL, NULL),
  ('Teknologi Informasi', 'SINGLE_PUTRA', 'Single Putra 5', 'Michael Sean Pasquale Thomas', '085189970998', NULL, NULL),
  ('Teknologi Informasi', 'SINGLE_PUTRA', 'Single Putra 6', 'Raihan Fuad Syakir', '089531707266', NULL, NULL),
  ('Teknologi Informasi', 'SINGLE_PUTRA', 'Single Putra 7', 'Musbahiar', '085222666513', NULL, NULL),
  ('Teknologi Informasi', 'SINGLE_PUTRA', 'Single Putra 8', 'Rofi Fathurrohman', '081388373836', NULL, NULL),
  ('Teknologi Informasi', 'SINGLE_PUTRA', 'Single Putra 9', 'Ilham Rizki', '085156795943', NULL, NULL),
  ('Teknologi Informasi', 'SINGLE_PUTRA', 'Single Putra 10', 'Rizki Widiyanto', '085172145348', NULL, NULL),
  ('Teknologi Informasi', 'SINGLE_PUTRI', 'Single Putri', 'Chairunnisa Ramadhani', '085222364524', NULL, NULL),
  ('Akuntansi', 'GANDA', 'Ganda 1', 'Novan Saputra', '085956444477', 'Syehabudin', '081312861202'),
  ('Akuntansi', 'SINGLE_PUTRA', 'Single Putra', 'Bagas Dwi Widy Syahputra', '083128382237', NULL, NULL),
  ('Akuntansi', 'SINGLE_PUTRI', 'Single Putri', 'Shofi Aghnia Fauziyyah', '085156861049', NULL, NULL),
  ('Pelayanan dan Pembinaan Siswa', 'GANDA', 'Ganda 1', 'Rangga Alfian M', '0812114447', 'Adji Maulana', '082117835293'),
  ('Pelayanan dan Pembinaan Siswa', 'SINGLE_PUTRA', 'Single Putra', 'Rangga Alfian M', '0812114447', NULL, NULL),
  ('Implementasi Materi Pelajaran', 'GANDA', 'Ganda 1', 'Rangga Perdana Putra', '083822870286', 'Ghanyrahman Lanang Bagaskoro Widjayakusumo Widyodiningrat', '082217507341'),
  ('Implementasi Materi Pelajaran', 'GANDA', 'Ganda 2', 'Aldy Virgiawan', '085155113177', 'Rafnika Azalia Rifa', '081297646064'),
  ('Implementasi Materi Pelajaran', 'SINGLE_PUTRA', 'Single Putra', 'Ghanyrahman Lanang Bagaskoro Widjayakusumo Widyodiningrat', '082217507341', NULL, NULL),
  ('Implementasi Materi Pelajaran', 'SINGLE_PUTRI', 'Single Putri', 'Ferbina Rut Meita Tarigan', '081295936477', NULL, NULL),
  ('Peningkatan Prestasi Akademik', 'GANDA', 'Ganda 1', 'Sonny', '081312416855', 'Rizky', '08877182788'),
  ('Peningkatan Prestasi Akademik', 'GANDA', 'Ganda 2', 'Syarah', '081546553400', 'Dani', '081220343656'),
  ('Peningkatan Prestasi Akademik', 'SINGLE_PUTRA', 'Single Putra', 'Pak Ary', '085707272223', NULL, NULL),
  ('Peningkatan Prestasi Akademik', 'SINGLE_PUTRI', 'Single Putri', 'Dhanes', '085703209089', NULL, NULL),
  ('Koordinator Kepala Bagian Konstruksi', 'GANDA', 'Ganda 1', 'Trian Adi Pamungkas', '088299026500', 'Anton Ardiyansah', '08172369868'),
  ('Koordinator Kepala Bagian Konstruksi', 'SINGLE_PUTRA', 'Single Putra', 'Mangara S', '081395148741', NULL, NULL),
  ('Sekuriti dan Dokumentasi Aset', 'GANDA', 'Ganda 1', 'Wahyu sutrisna', '0895805140506', 'Sofwan', '082115094283'),
  ('Sekuriti dan Dokumentasi Aset', 'GANDA', 'Ganda 2', 'Wahyu', '0895805140506', 'Fery', '08986462038'),
  ('Sekuriti dan Dokumentasi Aset', 'SINGLE_PUTRA', 'Single Putra', 'Feri baban', '08986462038', NULL, NULL),
  ('Koordinator Kepala Bagian Audit Rekening', 'GANDA', 'Ganda 1', 'Somuntul Sidauruk', '081232637975', 'Sahla Kartika Sari', '085117360312'),
  ('Koordinator Kepala Bagian Audit Rekening', 'SINGLE_PUTRA', 'Single Putra', 'Somuntul Sidauruk', '081232637975', NULL, NULL),
  ('Koordinator Kepala Bagian Audit Rekening', 'SINGLE_PUTRI', 'Single Putri', 'Sahla Kartika Sari', '085117360312', NULL, NULL),
  ('Digital Marketing dan Media Sosial', 'GANDA', 'Ganda 1', 'Fabrianus Pujanugraha Mone', '081381262019', 'Wildan Rizki Nurfauzi', '089646436360'),
  ('Digital Marketing dan Media Sosial', 'SINGLE_PUTRA', 'Single Putra', 'Muhammad Fichri Hikmanulhakiim', '081236441997', NULL, NULL),
  ('Pembuat Materi Ajar', 'GANDA', 'Ganda 1', 'Yana Daffiana', '081321320786', 'Ardian Syah', '082119645099'),
  ('Pembuat Materi Ajar', 'SINGLE_PUTRA', 'Single Putra', 'Yana Daffiana', '081321320786', NULL, NULL),
  ('Pembuat Materi Ajar', 'SINGLE_PUTRI', 'Single Putri', 'Jovanka', '085730050715', NULL, NULL),
  ('Sumber Daya Manusia', 'GANDA', 'Ganda 1', 'Fakhril Nur Anfasa F.', '089536061746', 'Juan Sudianto', '081288469916'),
  ('Sumber Daya Manusia', 'SINGLE_PUTRA', 'Single Putra', 'Fakhril Nur Anfasa F.', '089536061746', NULL, NULL),
  ('Sumber Daya Manusia', 'SINGLE_PUTRI', 'Single Putri', 'Sani Maria Angely Hutapea', '082111546940', NULL, NULL);

  -- 5. ATUR POLISI KEAMANAN (RLS) LENGKAP: VIEW, INSERT, UPDATE, DELETE
  ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Public can view registrations" ON public.registrations;
  CREATE POLICY "Public can view registrations" ON public.registrations
    FOR SELECT TO anon, authenticated USING (true);

  DROP POLICY IF EXISTS "Public can submit registrations" ON public.registrations;
  CREATE POLICY "Public can submit registrations" ON public.registrations
    FOR INSERT TO anon, authenticated WITH CHECK (true);

  DROP POLICY IF EXISTS "Public can update registrations" ON public.registrations;
  CREATE POLICY "Public can update registrations" ON public.registrations
    FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Public can delete registrations" ON public.registrations;
  CREATE POLICY "Public can delete registrations" ON public.registrations
    FOR DELETE TO anon, authenticated USING (true);
