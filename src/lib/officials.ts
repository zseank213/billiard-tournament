export interface TableOfficialRecord {
  id: number;
  table_number: number;
  table_name: string;
  table_type: "match" | "mini_game";
  category_label: string;
  pj_name: string;
  role: string;
  order_no: number;
}

export const DEFAULT_TABLE_OFFICIALS: TableOfficialRecord[] = [
  {
    id: 1,
    table_number: 1,
    table_name: "Meja 1",
    table_type: "match",
    category_label: "Turnamen Bola 8 Resmi",
    pj_name: "Musbahniar",
    role: "Wasit Utama Meja 1",
    order_no: 1,
  },
  {
    id: 2,
    table_number: 1,
    table_name: "Meja 1",
    table_type: "match",
    category_label: "Turnamen Bola 8 Resmi",
    pj_name: "Abraham Wellmart Marudut Tua Siahaan",
    role: "Pengawas & Pencatat Meja 1",
    order_no: 2,
  },
  {
    id: 3,
    table_number: 2,
    table_name: "Meja 2",
    table_type: "match",
    category_label: "Turnamen Bola 8 Resmi",
    pj_name: "Roy Aziz Barera",
    role: "Wasit Utama Meja 2",
    order_no: 1,
  },
  {
    id: 4,
    table_number: 2,
    table_name: "Meja 2",
    table_type: "match",
    category_label: "Turnamen Bola 8 Resmi",
    pj_name: "Muhammad Asman",
    role: "Pengawas & Pencatat Meja 2",
    order_no: 2,
  },
  {
    id: 5,
    table_number: 3,
    table_name: "Meja 3",
    table_type: "match",
    category_label: "Turnamen Bola 8 Resmi",
    pj_name: "Calvin Satria Dewangga Putra H",
    role: "Wasit Utama Meja 3",
    order_no: 1,
  },
  {
    id: 6,
    table_number: 3,
    table_name: "Meja 3",
    table_type: "match",
    category_label: "Turnamen Bola 8 Resmi",
    pj_name: "Muhammad Alwin Lapapahi",
    role: "Pengawas & Pencatat Meja 3",
    order_no: 2,
  },
  {
    id: 7,
    table_number: 4,
    table_name: "Meja 4",
    table_type: "match",
    category_label: "Turnamen Bola 8 Resmi",
    pj_name: "Raihan Fuad Syakir",
    role: "Wasit & Pengawas Meja 4",
    order_no: 1,
  },
  {
    id: 8,
    table_number: 5,
    table_name: "Meja 5",
    table_type: "match",
    category_label: "Turnamen Bola 8 Resmi",
    pj_name: "Muhammad Ilham Rizki Pratama",
    role: "Wasit & Pengawas Meja 5",
    order_no: 1,
  },
  {
    id: 9,
    table_number: 6,
    table_name: "Meja 6",
    table_type: "mini_game",
    category_label: "Mini Games & Doorprize Arena",
    pj_name: "Dzakiy Harissalam",
    role: "Koordinator Mini Game Meja 6",
    order_no: 1,
  },
  {
    id: 10,
    table_number: 6,
    table_name: "Meja 6",
    table_type: "mini_game",
    category_label: "Mini Games & Doorprize Arena",
    pj_name: "Ahmad Yoga Witdodo",
    role: "PJ Validasi & Doorprize Meja 6",
    order_no: 2,
  },
];

