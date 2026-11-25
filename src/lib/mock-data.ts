import { Match, TournamentInfo, TableInfo, PrizeItem } from "@/types/tournament";

export const TOURNAMENT_CONFIG: TournamentInfo = {
  name: "TI BILLIARD CUP 2026",
  tagline: "Turnamen Biliar Bola 8 Antar Bidang — Ganesha Operation",
  date_range: "Mulai Kamis, 03 Desember 2026",
  match_time: "Pukul 18.00 - 20.00 WIB",
  technical_meeting: "Rabu, 02 Desember 2026",
  registration_deadline: "Selasa, 01 Desember 2026",
  venue: "Greenlight Cafe & Billiard",
  venue_detail: "Samping Mall BEC, Bandung",
  address: "Jl. Purnawarman No. 36B, Bandung, Jawa Barat 40117",
  trophy_title: "Piala Bergilir Direktur Perencanaan",
  total_prize: "Piala Bergilir Direktur Perencanaan + Trophy Juara 1, 2, 3 + Voucher & Merchandise",
  registration_fee: "GRATIS untuk Seluruh Bidang",
  total_tables: 8,
  is_registration_open: true,
  contact_wa: "6285189970998",
  contact_sean: "6285189970998",
  contact_novi: "6285624055869",
  chairman: "Michael Sean Pasquale Thomas",
  chairman_title: "Staf Pusat Mobile Platform",
  manager: "Andy Yusuf Martua, S.T., M.M.",
  manager_title: "Manajer Teknologi Informasi",
};

export interface MerchandiseItem {
  id: string;
  name: string;
  category: string;
  description: string;
  specs: string;
  badge: string;
  priceTag: string;
}

export const MERCHANDISE_ITEMS: MerchandiseItem[] = [
  {
    id: "m-01",
    name: "Kaos / Jersey Official TI Billiard Cup 2026",
    category: "Official Apparel",
    description: "Jersey sporty dry-fit premium kombinasi putih, merah marun & aksen emas kejuaraan. Dilengkapi bordir logo IT DEPT di dada kiri dan artwork grafis bola 8 bermahkota di bagian punggung.",
    specs: "Bahan Dry-fit Milano Premium • Breathable • Anti-Odor • Quick Dry",
    badge: "Official Jersey",
    priceTag: "Paket Atlet Terdaftar",
  },
  {
    id: "m-02",
    name: "Topi Eksklusif TI Billiard Cup",
    category: "Headwear",
    description: "Topi baseball two-tone putih-merah berkelas tinggi dengan bordir 3D logo TI BILLIARD CUP 2026 di mahkota depan dan aksen strip dinamis di visor.",
    specs: "Bahan Katun Drill Tebal • Buckle Pengatur Logam Tahan Karat",
    badge: "Limited Edition",
    priceTag: "Merchandise Resmi",
  },
  {
    id: "m-03",
    name: "Tumbler Stainless Steel Termos",
    category: "Drinkware",
    description: "Tumbler olahraga berdinding ganda dengan isolasi vakum, menjaga air dingin hingga 24 jam dan hangat 12 jam. Grafis laser print TI Billiard Cup tahan gores.",
    specs: "Kapasitas 500ml • SUS 304 Food Grade • Flip-Lock Lid Anti-Tumpah",
    badge: "Best Seller",
    priceTag: "Merchandise Resmi",
  },
  {
    id: "m-04",
    name: "Mug / Gelas Keramik Two-Tone",
    category: "Drinkware",
    description: "Mug keramik premium tebal dengan bagian dalam dan gagang warna merah elegan, berhias logo IT Dept dan emblem 8-ball mahkota resmi turnamen.",
    specs: "Keramik Glaze 11 oz • Microwave & Dishwasher Safe",
    badge: "Official Swag",
    priceTag: "Souvenir Turnamen",
  },
  {
    id: "m-05",
    name: "Gantungan Kunci Akrilik 8-Ball Bermahkota",
    category: "Accessories",
    description: "Gantungan kunci akrilik bening tebal 4mm presisi laser cutting berbentuk bola 8 mahkota bertuliskan TI Billiard Cup 2026 dengan ring tebal anti-karat.",
    specs: "Akrilik Tebal 4mm • Double Sided UV Print • High Gloss Finish",
    badge: "Hadiah Peserta",
    priceTag: "Souvenir Semua Atlet",
  },
  {
    id: "m-06",
    name: "Voucher Hadiah Juara Senilai Rp 100.000",
    category: "Prize Voucher",
    description: "Voucher belanja resmi turnamen senilai Rp 100.000 untuk atlet pemenang pertandingan babak gugur dan peraih gelar juara.",
    specs: "Nominal Rp 100.000 • Berlaku di seluruh merchant mitra turnamen",
    badge: "Hadiah Juara",
    priceTag: "Voucher Rp 100.000",
  },
  {
    id: "m-07",
    name: "Voucher Doorprize Senilai Rp 50.000",
    category: "Doorprize Voucher",
    description: "Voucher doorprize untuk dibagikan secara acak kepada penonton, supporter bidang paling heboh, serta peserta lucky draw harian.",
    specs: "Nominal Rp 50.000 • Berlaku di seluruh merchant mitra turnamen",
    badge: "Doorprize Peserta",
    priceTag: "Voucher Rp 50.000",
  },
];

export const TOURNAMENT_PRIZES: PrizeItem[] = [
  {
    place: "PIALA BERGILIR",
    title: "Piala Bergilir Direktur Perencanaan",
    trophy: "Trophy Bergilir Tertinggi Direktur Perencanaan + Sertifikat Kehormatan Direksi",
    voucher: "Voucher Belanja Utama & Bonus Penghargaan Bidang",
    merchandise: "Jersey Gold Champions + Set Lengkap Merchandise (Topi, Tumbler, Mug)",
    badgeColor: "from-amber-500 to-yellow-500 text-slate-900",
  },
  {
    place: "JUARA 1",
    title: "Ganda Putra • Single Putra • Single Putri",
    trophy: "Trophy Tetap Juara 1 untuk Masing-Masing Kategori",
    voucher: "Voucher Belanja Juara 1 + Uang Pembinaan Turnamen",
    merchandise: "Set Lengkap Merchandise Official TI Billiard Cup 2026",
    badgeColor: "from-red-600 to-rose-600 text-white",
  },
  {
    place: "JUARA 2",
    title: "Runner-Up Setiap Kategori",
    trophy: "Trophy Runner-Up + Plakat Perak Kejuaraan",
    voucher: "Voucher Belanja Juara 2 untuk Pemenang",
    merchandise: "Set Merchandise Official (Kaos Jersey & Topi)",
    badgeColor: "from-slate-400 to-slate-500 text-white",
  },
  {
    place: "JUARA 3 BERSAMA",
    title: "Juara 3 / Semifinalis",
    trophy: "Trophy Juara 3 / Medali Perunggu Antar Bidang",
    voucher: "Voucher Belanja Juara 3",
    merchandise: "Tumbler Sport & Souvenir Gantungan Kunci",
    badgeColor: "from-amber-700 to-amber-600 text-white",
  },
];

export const INITIAL_MATCHES: Match[] = [
  {
    id: "m-01",
    round_name: "Babak Penyisihan",
    match_number: 1,
    table_number: 1,
    scheduled_time: "2026-12-03 18:00",
    category: "Ganda Putra",
    player1_name: "Teknologi Informasi",
    player1_handicap: "HC 4",
    player1_club: "IT",
    player2_name: "Selling",
    player2_handicap: "HC 4",
    player2_club: "SEL",
    score1: 0,
    score2: 0,
    race_to: 4,
    status: "upcoming",
  },
  {
    id: "m-02",
    round_name: "Babak Penyisihan",
    match_number: 2,
    table_number: 2,
    scheduled_time: "2026-12-03 18:00",
    category: "Ganda Putra",
    player1_name: "Marketing",
    player1_handicap: "HC 4",
    player1_club: "MKT",
    player2_name: "Manajer Logistik dan Distribusi",
    player2_handicap: "HC 4",
    player2_club: "LOG",
    score1: 0,
    score2: 0,
    race_to: 4,
    status: "upcoming",
  },
  {
    id: "m-03",
    round_name: "Babak Penyisihan",
    match_number: 3,
    table_number: 3,
    scheduled_time: "2026-12-03 18:30",
    category: "Single Putra",
    player1_name: "Penelitian dan Pengembangan",
    player1_handicap: "HC 4",
    player1_club: "LIT",
    player2_name: "Manajer Akuntansi",
    player2_handicap: "HC 4",
    player2_club: "AKT",
    score1: 0,
    score2: 0,
    race_to: 4,
    status: "upcoming",
  },
  {
    id: "m-04",
    round_name: "Babak Penyisihan",
    match_number: 4,
    table_number: 4,
    scheduled_time: "2026-12-03 18:30",
    category: "Single Putri",
    player1_name: "Sumber Daya Manusia",
    player1_handicap: "HC 4",
    player1_club: "SDM",
    player2_name: "Koordinator Kepala Bagian Audit Rekening",
    player2_handicap: "HC 4",
    player2_club: "AREK",
    score1: 0,
    score2: 0,
    race_to: 4,
    status: "upcoming",
  },
];

export const TABLES_DATA: TableInfo[] = [
  {
    tableNumber: 1,
    tableName: "Table 1 (Arena Utama TV Table)",
    status: "available",
    cloth: "Simonis 860 Red Tournament Edition",
  },
  {
    tableNumber: 2,
    tableName: "Table 2 (Arena Barat)",
    status: "available",
    cloth: "Simonis 860 Red Tournament Edition",
  },
  {
    tableNumber: 3,
    tableName: "Table 3 (Arena Barat)",
    status: "available",
    cloth: "Rasson Pro Tournament Cloth",
  },
  {
    tableNumber: 4,
    tableName: "Table 4 (Arena Timur)",
    status: "available",
    cloth: "Rasson Pro Tournament Cloth",
  },
  {
    tableNumber: 5,
    tableName: "Table 5 (Arena Timur)",
    status: "available",
    cloth: "Simonis 860 Tournament Cloth",
  },
  {
    tableNumber: 6,
    tableName: "Table 6 (Arena Tengah)",
    status: "available",
    cloth: "Simonis 860 Tournament Cloth",
  },
  {
    tableNumber: 7,
    tableName: "Table 7 (Arena Tengah)",
    status: "available",
    cloth: "Rasson Ox Tournament Cloth",
  },
  {
    tableNumber: 8,
    tableName: "Table 8 (Arena VIP)",
    status: "available",
    cloth: "Rasson Ox Tournament Cloth",
  },
];

export const TOURNAMENT_RULES = [
  {
    title: "Sistem Pertandingan: BOLA 8 (8-Ball)",
    desc: "Pertandingan resmi menggunakan bola 8. Memasukkan seluruh bola kelompok (Solid/Stripes) kemudian memasukkan bola 8 ke dalam kantong sasaran sah untuk memenangkan rack.",
  },
  {
    title: "Kategori Resmi & Kuota Partisipasi",
    desc: "Setiap bidang dapat mendaftarkan peserta secara GRATIS dengan ketentuan: Max 2 Tim Ganda Putra (2 orang/tim), 1 Tim Single Putra (1 orang), dan 1 Tim Single Putri (1 orang).",
  },
  {
    title: "Piala Bergilir Direktur Perencanaan",
    desc: "Piala Bergilir Direktur Perencanaan diperebutkan untuk bidang terbaik dengan akumulasi prestasi dan poin kemenangan tertinggi sepanjang turnamen.",
  },
  {
    title: "Jadwal Penting & Technical Meeting",
    desc: "Pendaftaran dibuka hingga Selasa, 1 Desember 2026. Technical Meeting dilaksanakan pada Rabu, 2 Desember 2026. Pertandingan dimulai Kamis, 3 Desember 2026 Pukul 18.00 - 20.00 WIB.",
  },
  {
    title: "Lokasi Pertandingan Resmi",
    desc: "Kegiatan dilaksanakan di Greenlight Cafe & Billiard (Samping Mall BEC), Bandung. Seluruh peserta diharapkan hadir tepat waktu.",
  },
  {
    title: "Kontak Resmi Panitia Penyelenggara",
    desc: "Sean - TI (085189970998) & Novi - TI (085624055869). Diselenggarakan oleh Bidang Teknologi Informasi Ganesha Operation Pusat.",
  },
];

// ==========================================
// LIQUIPEDIA STYLE DATA STRUCTURES
// ==========================================

import { ParticipantTeam, GroupStageData, BracketMatchNode } from "@/types/tournament";

export const LIQUIPEDIA_PRIZE_POOL = [
  {
    place: "1st",
    rankNum: 1,
    title: "Piala Bergilir Direktur Perencanaan + Juara 1",
    trophy: "Piala Bergilir Direktur Perencanaan & Trophy Tetap Juara 1",
    voucher: "Voucher Belanja Rp 100.000",
    merchandise: "Jersey Gold Champions + Topi + Tumbler + Mug + Gantungan Kunci",
    teamRecipient: "Bidang Teknologi Informasi",
    teamShort: "IT",
    badgeColor: "from-amber-500 to-yellow-500 text-slate-950 font-black",
  },
  {
    place: "2nd",
    rankNum: 2,
    title: "Runner-Up / Juara 2",
    trophy: "Trophy Tetap Juara 2 & Piagam Direksi",
    voucher: "Voucher Belanja Rp 100.000",
    merchandise: "Set Jersey Official + Tumbler + Topi + Mug",
    teamRecipient: "Bidang Selling",
    teamShort: "SEL",
    badgeColor: "from-slate-300 via-slate-200 to-slate-400 text-slate-900 font-black",
  },
  {
    place: "3rd",
    rankNum: 3,
    title: "Juara 3 (Bronze Final)",
    trophy: "Trophy Tetap Juara 3 & Piagam Direksi",
    voucher: "Voucher Belanja Rp 50.000",
    merchandise: "Jersey Official + Tumbler + Gantungan Kunci",
    teamRecipient: "Bidang Akademik",
    teamShort: "AKA",
    badgeColor: "from-amber-700 to-amber-600 text-white font-black",
  },
  {
    place: "4th",
    rankNum: 4,
    title: "Peringkat 4",
    trophy: "Piagam Penghargaan Khusus Direksi",
    voucher: "Voucher Belanja Rp 50.000",
    merchandise: "Tumbler + Mug + Souvenir Bola 8",
    teamRecipient: "Bidang Keuangan & Finance",
    teamShort: "FIN",
    badgeColor: "from-slate-100 to-slate-200 text-slate-700 font-bold",
  },
  {
    place: "5th - 6th",
    rankNum: 5,
    title: "Peringkat 5 - 6 (Lower Bracket R2)",
    trophy: "Sertifikat Partisipasi Resmi",
    voucher: "Doorprize Voucher Rp 50.000",
    merchandise: "Mug Keramik + Gantungan Kunci",
    teamRecipient: "Bidang Marketing & Promosi / Bidang HRD",
    teamShort: "MKT / HRD",
    badgeColor: "from-slate-100 to-slate-200 text-slate-600 font-semibold",
  },
  {
    place: "7th - 8th",
    rankNum: 7,
    title: "Peringkat 7 - 8 (Lower Bracket R1)",
    trophy: "Sertifikat Partisipasi Resmi",
    voucher: "Doorprize Voucher Peserta",
    merchandise: "Gantungan Kunci Akrilik 8-Ball Bermahkota",
    teamRecipient: "Bidang Logistik / Bidang Sekretariat",
    teamShort: "LOG / SEK",
    badgeColor: "from-slate-100 to-slate-200 text-slate-500 font-semibold",
  },
];

// ==========================================
// 19 INVITED BIDANG + IT DEPT (HOST)
// ==========================================
export const INVITED_BIDANG_LIST = [
  "Teknologi Informasi",
  "Selling",
  "Pembuat Materi Ajar",
  "Penelitian dan Pengembangan",
  "Marketing",
  "Digital Marketing dan Media Sosial",
  "Sumber Daya Manusia",
  "Koordinator Kepala Bagian Konstruksi",
  "Sekuriti dan Dokumentasi Aset",
  "Pelayanan dan Pembinaan Siswa",
  "Operasional Pengajar",
  "Implementasi Materi Pelajaran",
  "Peningkatan Prestasi Akademik",
  "Koordinator Kepala Bagian Pengendali Mutu Materi SD dan SMP",
  "Koordinator Kepala Bagian Pengendali Mutu Materi SMA dan TPS",
  "Manajer Logistik dan Distribusi",
  "Manajer Akuntansi",
  "Audit Administrasi dan Kepatuhan",
  "Pengadaan dan Pemeliharaan",
  "Koordinator Kepala Bagian Audit Rekening",
];

// Map 20 Bidang into clean ParticipantTeam data (Names TBD/Empty awaiting registration, No PIC, No Photo)
export const LIQUIPEDIA_PARTICIPANTS: ParticipantTeam[] = INVITED_BIDANG_LIST.map((bidang, idx) => {
  const isHost = idx === 0;
  let short = "IT";
  if (!isHost) {
    const words = bidang.split(" ");
    short = words.length > 1 ? words.map(w => w[0]).join("").slice(0, 4).toUpperCase() : bidang.slice(0, 4).toUpperCase();
  }

  return {
    id: `team-${idx + 1}`,
    name: bidang,
    shortName: short,
    bidang: bidang,
    seed: idx + 1,
    status: isHost ? ("host" as const) : ("invited" as const),
    accentColor: isHost ? "bg-red-600 text-white" : "bg-slate-900 text-white",
    slots: [
      {
        slotNumber: 1,
        category: "Ganda Putra",
        role: "Ganda Putra (Pemain 1)",
        playerName: "Belum Didaftarkan (TBD)",
      },
      {
        slotNumber: 2,
        category: "Ganda Putra",
        role: "Ganda Putra (Pemain 2)",
        playerName: "Belum Didaftarkan (TBD)",
      },
      {
        slotNumber: 3,
        category: "Single Putra",
        role: "Single Putra",
        playerName: "Belum Didaftarkan (TBD)",
      },
      {
        slotNumber: 4,
        category: "Single Putri",
        role: "Single Putri",
        playerName: "Belum Didaftarkan (TBD)",
      },
    ],
  };
});

// Official Grand Prizes Breakdown (Lampiran Rincian Hadiah Resmi TI Billiard Cup 2026)
export const OFFICIAL_GRAND_PRIZES = {
  pialaBergilir: [
    { id: "pb-1", title: "Piala Bergilir DirRen Ganda Putra", category: "Ganda Putra" },
    { id: "pb-2", title: "Piala Bergilir DirRen Single Putra", category: "Single Putra" },
    { id: "pb-3", title: "Piala Bergilir DirRen Single Putri", category: "Single Putri" },
  ],
  categories: [
    {
      category: "Ganda Putra",
      trophy: "Piala Bergilir DirRen Ganda Putra",
      prizes: [
        { rank: "Juara 1", reward: "Uang Tunai + Piala Tetap + Piala Bergilir DirRen", badge: "Gold Champion" },
        { rank: "Juara 2", reward: "Uang Tunai + Piala Tetap", badge: "Runner-Up" },
        { rank: "Juara 3", reward: "Uang Tunai + Piala Tetap", badge: "Bronze Final" },
      ],
    },
    {
      category: "Single Putra",
      trophy: "Piala Bergilir DirRen Single Putra",
      prizes: [
        { rank: "Juara 1", reward: "Uang Tunai + Piala Tetap + Piala Bergilir DirRen", badge: "Gold Champion" },
        { rank: "Juara 2", reward: "Uang Tunai + Piala Tetap", badge: "Runner-Up" },
        { rank: "Juara 3", reward: "Uang Tunai + Piala Tetap", badge: "Bronze Final" },
      ],
    },
    {
      category: "Single Putri",
      trophy: "Piala Bergilir DirRen Single Putri",
      prizes: [
        { rank: "Juara 1", reward: "Uang Tunai + Piala Tetap + Piala Bergilir DirRen", badge: "Gold Champion" },
        { rank: "Juara 2", reward: "Uang Tunai + Piala Tetap", badge: "Runner-Up" },
        { rank: "Juara 3", reward: "Uang Tunai + Piala Tetap", badge: "Bronze Final" },
      ],
    },
  ],
  pendukungTerbaik: {
    title: "Hadiah Pendukung Terbaik",
    reward: "Apresiasi & Hadiah Spesial untuk Suporter Bidang Paling Heboh & Kompak",
  },
  gamesMini: {
    sulit: [
      { name: "Topi BTI Cup", type: "Apparel" },
      { name: "Kaos BTI Cup", type: "Official Jersey" },
      { name: "Tumbler BTI Cup", type: "Drinkware" },
      { name: "Voucher Indomaret Rp 100.000", type: "Shopping Voucher" },
    ],
    gampang: [
      { name: "Gantungan Kunci BTI Cup", type: "Merchandise" },
      { name: "Gelas Label BTI Cup", type: "Drinkware" },
      { name: "Kipas Tangan", type: "Accessories" },
      { name: "Paket Indomie", type: "Snack Pack" },
      { name: "Paket Snack", type: "Snack Pack" },
      { name: "Voucher Indomaret Rp 50.000", type: "Shopping Voucher" },
    ],
  },
};

export const LIQUIPEDIA_GROUP_A: GroupStageData = {
  groupId: "group-a",
  groupName: "Grup A — Babak Penyisihan",
  standings: [
    {
      pos: 1,
      teamId: "team-ti",
      teamName: "Teknologi Informasi",
      shortName: "IT",
      matchesPlayed: 0,
      seriesWon: 0,
      seriesLost: 0,
      racksWon: 0,
      racksLost: 0,
      rackDiff: 0,
      points: 0,
      status: null,
    },
    {
      pos: 2,
      teamId: "team-selling",
      teamName: "Selling",
      shortName: "SELLING",
      matchesPlayed: 0,
      seriesWon: 0,
      seriesLost: 0,
      racksWon: 0,
      racksLost: 0,
      rackDiff: 0,
      points: 0,
      status: null,
    },
    {
      pos: 3,
      teamId: "team-mkt",
      teamName: "Marketing",
      shortName: "MKT",
      matchesPlayed: 0,
      seriesWon: 0,
      seriesLost: 0,
      racksWon: 0,
      racksLost: 0,
      rackDiff: 0,
      points: 0,
      status: null,
    },
    {
      pos: 4,
      teamId: "team-logistik",
      teamName: "Manajer Logistik dan Distribusi",
      shortName: "LOGISTIK",
      matchesPlayed: 0,
      seriesWon: 0,
      seriesLost: 0,
      racksWon: 0,
      racksLost: 0,
      rackDiff: 0,
      points: 0,
      status: null,
    },
  ],
  matches: [
    {
      id: "ga-m1",
      team1: "Teknologi Informasi",
      team2: "Selling",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
    {
      id: "ga-m2",
      team1: "Marketing",
      team2: "Manajer Logistik dan Distribusi",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
    {
      id: "ga-m3",
      team1: "Teknologi Informasi",
      team2: "Marketing",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
    {
      id: "ga-m4",
      team1: "Selling",
      team2: "Manajer Logistik dan Distribusi",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
    {
      id: "ga-m5",
      team1: "Teknologi Informasi",
      team2: "Manajer Logistik dan Distribusi",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
    {
      id: "ga-m6",
      team1: "Selling",
      team2: "Marketing",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
  ],
};

export const LIQUIPEDIA_GROUP_B: GroupStageData = {
  groupId: "group-b",
  groupName: "Grup B — Babak Penyisihan",
  standings: [
    {
      pos: 1,
      teamId: "team-litbang",
      teamName: "Penelitian dan Pengembangan",
      shortName: "LITBANG",
      matchesPlayed: 0,
      seriesWon: 0,
      seriesLost: 0,
      racksWon: 0,
      racksLost: 0,
      rackDiff: 0,
      points: 0,
      status: null,
    },
    {
      pos: 2,
      teamId: "team-akuntansi",
      teamName: "Manajer Akuntansi",
      shortName: "AKUNTANSI",
      matchesPlayed: 0,
      seriesWon: 0,
      seriesLost: 0,
      racksWon: 0,
      racksLost: 0,
      rackDiff: 0,
      points: 0,
      status: null,
    },
    {
      pos: 3,
      teamId: "team-sdm",
      teamName: "Sumber Daya Manusia",
      shortName: "SDM",
      matchesPlayed: 0,
      seriesWon: 0,
      seriesLost: 0,
      racksWon: 0,
      racksLost: 0,
      rackDiff: 0,
      points: 0,
      status: null,
    },
    {
      pos: 4,
      teamId: "team-audit-rek",
      teamName: "Koordinator Kepala Bagian Audit Rekening",
      shortName: "AUDIT REK",
      matchesPlayed: 0,
      seriesWon: 0,
      seriesLost: 0,
      racksWon: 0,
      racksLost: 0,
      rackDiff: 0,
      points: 0,
      status: null,
    },
  ],
  matches: [
    {
      id: "gb-m1",
      team1: "Penelitian dan Pengembangan",
      team2: "Manajer Akuntansi",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
    {
      id: "gb-m2",
      team1: "Sumber Daya Manusia",
      team2: "Koordinator Kepala Bagian Audit Rekening",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
    {
      id: "gb-m3",
      team1: "Penelitian dan Pengembangan",
      team2: "Sumber Daya Manusia",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
    {
      id: "gb-m4",
      team1: "Manajer Akuntansi",
      team2: "Koordinator Kepala Bagian Audit Rekening",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
    {
      id: "gb-m5",
      team1: "Penelitian dan Pengembangan",
      team2: "Koordinator Kepala Bagian Audit Rekening",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
    {
      id: "gb-m6",
      team1: "Manajer Akuntansi",
      team2: "Sumber Daya Manusia",
      score1: 0,
      score2: 0,
      status: "upcoming",
    },
  ],
};

// ========================================================
// SINGLE ELIMINATION PLAYOFFS (Kalah Langsung Gugur)
// Alur: Group Stage -> Playoffs (Quarterfinals -> Semifinals -> Grand Final & 3rd Place)
// ========================================================
export interface SingleEliminationBracket {
  quarterfinals: BracketMatchNode[];
  semifinals: BracketMatchNode[];
  bronzeMatch: BracketMatchNode;
  grandFinal: BracketMatchNode;
}

const createCleanBracket = (
  category: "Ganda Putra" | "Single Putra" | "Single Putri",
  qfRace = 4,
  sfRace = 4,
  gfRace = 5
): SingleEliminationBracket => ({
  quarterfinals: [
    {
      id: `${category}-qf-1`,
      roundName: "Quarterfinal 1 (8 Besar)",
      matchTitle: "Perempat Final 1",
      category,
      team1: { name: "Juara Grup A", shortName: "1A", score: 0, isWinner: false, seed: 1 },
      team2: { name: "Runner-up Grup B", shortName: "2B", score: 0, isWinner: false },
      raceTo: qfRace,
      status: "upcoming",
    },
    {
      id: `${category}-qf-2`,
      roundName: "Quarterfinal 2 (8 Besar)",
      matchTitle: "Perempat Final 2",
      category,
      team1: { name: "Runner-up Grup A", shortName: "2A", score: 0, isWinner: false, seed: 2 },
      team2: { name: "Peringkat 3 Grup B", shortName: "3B", score: 0, isWinner: false },
      raceTo: qfRace,
      status: "upcoming",
    },
    {
      id: `${category}-qf-3`,
      roundName: "Quarterfinal 3 (8 Besar)",
      matchTitle: "Perempat Final 3",
      category,
      team1: { name: "Juara Grup B", shortName: "1B", score: 0, isWinner: false, seed: 1 },
      team2: { name: "Peringkat 3 Grup A", shortName: "3A", score: 0, isWinner: false },
      raceTo: qfRace,
      status: "upcoming",
    },
    {
      id: `${category}-qf-4`,
      roundName: "Quarterfinal 4 (8 Besar)",
      matchTitle: "Perempat Final 4",
      category,
      team1: { name: "Peringkat 4 Grup A", shortName: "4A", score: 0, isWinner: false },
      team2: { name: "Peringkat 4 Grup B", shortName: "4B", score: 0, isWinner: false },
      raceTo: qfRace,
      status: "upcoming",
    },
  ],
  semifinals: [
    {
      id: `${category}-sf-1`,
      roundName: "Semifinal 1 (4 Besar)",
      matchTitle: "Babak Semifinal 1",
      category,
      team1: { name: "Pemenang QF 1", shortName: "W1", score: 0, isWinner: false },
      team2: { name: "Pemenang QF 2", shortName: "W2", score: 0, isWinner: false },
      raceTo: sfRace,
      status: "upcoming",
    },
    {
      id: `${category}-sf-2`,
      roundName: "Semifinal 2 (4 Besar)",
      matchTitle: "Babak Semifinal 2",
      category,
      team1: { name: "Pemenang QF 3", shortName: "W3", score: 0, isWinner: false },
      team2: { name: "Pemenang QF 4", shortName: "W4", score: 0, isWinner: false },
      raceTo: sfRace,
      status: "upcoming",
    },
  ],
  bronzeMatch: {
    id: `${category}-bronze`,
    roundName: "Perebutan Juara 3 (Bronze Match)",
    matchTitle: "Bronze Match — Juara 3",
    category,
    team1: { name: "Kalah SF 1", shortName: "L1", score: 0, isWinner: false },
    team2: { name: "Kalah SF 2", shortName: "L2", score: 0, isWinner: false },
    raceTo: sfRace,
    status: "upcoming",
  },
  grandFinal: {
    id: `${category}-gf`,
    roundName: "Grand Final Kejuaraan",
    matchTitle: "GRAND FINAL — Piala Bergilir Direktur Perencanaan",
    category,
    team1: { name: "Pemenang SF 1", shortName: "W-SF1", score: 0, isWinner: false },
    team2: { name: "Pemenang SF 2", shortName: "W-SF2", score: 0, isWinner: false },
    raceTo: gfRace,
    status: "upcoming",
  },
});

export const LIQUIPEDIA_PLAYOFFS_DATA: Record<string, SingleEliminationBracket> = {
  "ganda-putra": createCleanBracket("Ganda Putra", 4, 4, 5),
  "single-putra": createCleanBracket("Single Putra", 4, 4, 5),
  "single-putri": createCleanBracket("Single Putri", 3, 3, 4),
};

