export interface Match {
  id: string;
  round_name: string; // e.g. "Babak 32 Besar", "16 Besar", "Quarter Final", "Semifinal", "Grand Final"
  match_number: number;
  table_number: number; // e.g. 1, 2, 3, 4
  scheduled_time: string; // ISO string or format "2026-11-25 14:00"
  player1_name: string;
  player1_handicap: string; // e.g. "HC 5", "HC 6"
  player1_club?: string;
  player2_name: string;
  player2_handicap: string;
  player2_club?: string;
  score1: number;
  score2: number;
  race_to: number; // e.g. 7 (Race to 7)
  status: "upcoming" | "live" | "completed";
  winner?: string;
}

export interface Registration {
  id?: string;
  registration_code: string;
  full_name: string;
  phone_number: string;
  email: string;
  city: string;
  club_name: string;
  category: "9-ball-open" | "10-ball-handicap" | "junior-under21";
  handicap: string;
  payment_method: string;
  payment_proof_note?: string;
  payment_status: "pending" | "verified" | "rejected";
  created_at?: string;
}

export interface TournamentInfo {
  name: string;
  tagline: string;
  date_range: string;
  venue: string;
  address: string;
  total_prize: string;
  registration_fee: string;
  total_tables: number;
  is_registration_open: boolean;
  contact_wa: string;
}
