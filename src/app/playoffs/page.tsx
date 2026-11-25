import { BracketView } from "@/components/liquipedia/BracketView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Playoffs (Bagan Gugur) — TI BILLIARD CUP 2026",
  description: "Bagan pertandingan babak gugur Single Elimination 8 Besar hingga Grand Final memperebutkan Piala Bergilir Direktur Perencanaan.",
};

export default function PlayoffsPage() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 w-full min-w-0 max-w-full">
      <BracketView />
    </div>
  );
}

