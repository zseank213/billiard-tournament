import { RegulationView } from "@/components/RegulationView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulasi Resmi Pertandingan Bola 8 — TI BILLIARD CUP 2026",
  description: "Surat keputusan resmi dan regulasi pertandingan Bola 8 TI BILLIARD CUP 2026 Ganesha Operation Pusat.",
};

export default function RegulationPage() {
  return (
    <div className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <RegulationView />
    </div>
  );
}

