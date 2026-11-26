import { GroupStageView } from "@/components/liquipedia/GroupStageView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Group Stage (Babak Penyisihan) — TI BILLIARD CUP 2026",
  description: "Klasemen Babak Penyisihan 4 Grup (A, B, C, D) 20 bidang di lingkungan Ganesha Operation untuk kategori Ganda (Campuran / Bebas), Single Putra, dan Single Putri.",
};

export default function GroupStagePage() {
  return (
    <div className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <GroupStageView />
    </div>
  );
}

