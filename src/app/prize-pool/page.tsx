import { PrizePoolView } from "@/components/liquipedia/PrizePoolView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prize Pool & Hadiah Kejuaraan — TI BILLIARD CUP 2026",
  description: "Rincian alokasi hadiah uang tunai, piala tetap, dan 3 Piala Bergilir Direktur Perencanaan TI BILLIARD CUP 2026.",
};

export default function PrizePoolPage() {
  return (
    <div className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <PrizePoolView />
    </div>
  );
}

