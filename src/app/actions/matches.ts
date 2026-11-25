"use server";

import { Match } from "@/types/tournament";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { INITIAL_MATCHES } from "@/lib/mock-data";

export async function getMatches(): Promise<{ matches: Match[]; isLiveSupabase: boolean }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("scheduled_time", { ascending: true });

      if (!error && data && data.length > 0) {
        return {
          matches: data as Match[],
          isLiveSupabase: true,
        };
      }
    } catch (e) {
      console.warn("Failed fetching from Supabase, using initial seed:", e);
    }
  }

  return {
    matches: INITIAL_MATCHES,
    isLiveSupabase: false,
  };
}

