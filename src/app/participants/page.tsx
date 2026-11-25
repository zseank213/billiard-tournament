import { ParticipantsView } from "@/components/liquipedia/ParticipantsView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Peserta Bidang — TI BILLIARD CUP 2026",
  description: "Daftar 20 tim perwakilan bidang di lingkungan Ganesha Operation Pusat beserta roster atlet.",
};

export default function ParticipantsPage() {
  return (
    <div className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <ParticipantsView />
    </div>
  );
}

