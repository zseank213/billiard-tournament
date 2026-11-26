"use server";

import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { TableOfficialRecord, DEFAULT_TABLE_OFFICIALS } from "@/lib/officials";

export async function getTableOfficials(): Promise<TableOfficialRecord[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("table_officials")
        .select("*")
        .order("table_number", { ascending: true })
        .order("order_no", { ascending: true });

      if (!error && data && data.length > 0) {
        return data as TableOfficialRecord[];
      }
    } catch (e) {
      console.warn("Failed fetching table_officials from Supabase, using defaults:", e);
    }
  }

  return DEFAULT_TABLE_OFFICIALS;
}
