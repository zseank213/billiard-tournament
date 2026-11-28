export interface Match {
  id: string;
  round_name: string; // e.g. "Babak 32 Besar", "16 Besar", "Quarter Final", "Semifinal", "Grand Final"
  match_number: number;
  table_number: number; // e.g. 1, 2, 3, 4, 5, 6, 7, 8
  scheduled_time: string; // e.g. "2026-12-03 18:00"
  category: "Ganda Putra" | "Single Putra" | "Single Putri";
  player1_name: string;
  player1_handicap: string;
  player1_club?: string; // Divisi / Bidang
  player2_name: string;
  player2_handicap: string;
  player2_club?: string; // Divisi / Bidang
  score1: number;
  score2: number;
  race_to: number; // e.g. 4 (Race to 4 / Bola 8)
  status: "upcoming" | "live" | "completed";
  winner?: string;
}

export interface TableInfo {
  tableNumber: number;
  tableName: string;
  status: "live" | "upcoming" | "break" | "available";
  currentMatch?: Match;
  nextMatch?: Match;
  cloth: string;
}

export interface PrizeItem {
  place: string;
  rankNum?: number;
  title: string;
  trophy: string;
  voucher: string;
  merchandise: string;
  teamRecipient?: string;
  teamShort?: string;
  badgeColor: string;
}

export interface ParticipantMemberSlot {
  slotNumber: number;
  category: "Ganda Putra" | "Single Putra" | "Single Putri";
  role: string;
  playerName: string; // e.g. "Belum Didaftarkan (TBD)"
}

export interface ParticipantTeam {
  id: string;
  name: string;
  shortName: string;
  bidang: string;
  seed: number;
  status: "host" | "invited" | "confirmed" | "registered" | "pending";
  accentColor: string;
  slots: ParticipantMemberSlot[];
  representative?: string;
  rosterGanda?: { player1: string; player2: string; teamNumber: number }[];
  rosterSinglePutra?: string;
  rosterSinglePutri?: string;
}

export interface GroupTeamStanding {
  pos: number;
  teamId: string;
  teamName: string;
  shortName: string;
  matchesPlayed: number;
  seriesWon: number;
  seriesLost: number;
  racksWon: number;
  racksLost: number;
  rackDiff: number;
  points: number;
  status?: "playoffs" | "qualified" | "eliminated" | "upper" | "lower" | null;
  playerName?: string;
}

export interface GroupStageData {
  groupId: string;
  groupName: string;
  standings: GroupTeamStanding[];
  matches: {
    id: string;
    team1: string;
    team2: string;
    score1: number;
    score2: number;
    ballDiff?: number; // Selisih jumlah bola yang masih tersisa di meja
    status: "completed" | "live" | "upcoming";
    time?: string;
    table?: number;
  }[];
}

export type GroupMatchItem = GroupStageData["matches"][number];

export interface SingleEliminationBracket {
  quarterfinals: BracketMatchNode[];
  semifinals: BracketMatchNode[];
  bronzeMatch: BracketMatchNode;
  grandFinal: BracketMatchNode;
}

export interface BracketTeamSlot {
  name: string;
  shortName: string;
  seed?: number;
  score?: number;
  isWinner?: boolean;
}

export interface BracketMatchNode {
  id: string;
  roundName: string;
  matchTitle: string;
  category: "Ganda Putra" | "Single Putra" | "Single Putri";
  team1: BracketTeamSlot;
  team2: BracketTeamSlot;
  tableNumber?: number;
  time?: string;
  raceTo?: number;
  status: "completed" | "live" | "upcoming";
  nextMatchId?: string;
  lowerMatchId?: string;
}

export interface Registration {
  id?: string;
  registration_code: string;
  full_name: string;
  partner_name?: string; // for Ganda Putra
  phone_number: string;
  email: string;
  city: string;
  club_name: string; // Bidang kerja
  bidang_name?: string;
  coordinator_name?: string;
  category: "ganda-putra" | "single-putra" | "single-putri" | "delegasi-lengkap" | string;
  handicap: string;
  payment_method: string;
  payment_proof_note?: string;
  notes?: string;
  payment_status: "pending" | "verified" | "confirmed" | "rejected";
  created_at?: string;

  // Multi-kategori delegasi lengkap bidang (Per Atlet ada nomor WhatsApp)
  ganda_tim1_player1?: string;
  ganda_tim1_player1_phone?: string;
  ganda_tim1_player2?: string;
  ganda_tim1_player2_phone?: string;
  ganda_tim2_player1?: string;
  ganda_tim2_player1_phone?: string;
  ganda_tim2_player2?: string;
  ganda_tim2_player2_phone?: string;
  single_putra_player?: string;
  single_putra_phone?: string;
  single_putri_player?: string;
  single_putri_phone?: string;
}

export interface BidangFullRegistrationPayload {
  bidangName: string;
  // Ganda Putra Tim 1 (Opsional)
  gandaTim1Player1?: string;
  gandaTim1Player1Phone?: string;
  gandaTim1Player2?: string;
  gandaTim1Player2Phone?: string;
  // Ganda Putra Tim 2 (Optional)
  hasGandaTim2?: boolean;
  gandaTim2Player1?: string;
  gandaTim2Player1Phone?: string;
  gandaTim2Player2?: string;
  gandaTim2Player2Phone?: string;
  // Single Putra
  singlePutraPlayer?: string;
  singlePutraPhone?: string;
  // Single Putri
  singlePutriPlayer?: string;
  singlePutriPhone?: string;
  notes?: string;

  // Khusus Tuan Rumah (Teknologi Informasi): Tambah tim/atlet tanpa batas
  extraGandaTeams?: {
    teamNumber: number;
    player1: string;
    phone1: string;
    player2: string;
    phone2: string;
  }[];
  extraSinglePutra?: {
    playerNumber: number;
    player: string;
    phone: string;
  }[];
  extraSinglePutri?: {
    playerNumber: number;
    player: string;
    phone: string;
  }[];
}

export interface TournamentInfo {
  name: string;
  tagline: string;
  letter_number?: string;
  date_range: string;
  match_time: string;
  technical_meeting: string;
  registration_deadline: string;
  venue: string;
  venue_detail: string;
  address: string;
  trophy_title: string;
  total_prize: string;
  registration_fee: string;
  total_tables: number;
  is_registration_open: boolean;
  contact_wa: string;
  contact_sean: string;
  contact_novi: string;
  whatsapp_group_link?: string;
  chairman: string;
  chairman_title: string;
  manager: string;
  manager_title: string;
}
