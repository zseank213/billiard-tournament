import { MerchandiseShowcase } from "@/components/MerchandiseShowcase";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official Merchandise & Doorprize — TI BILLIARD CUP 2026",
  description: "Koleksi kaos, topi, tumbler, mug eksklusif, serta voucher belanja hadiah mini game dan doorprize TI BILLIARD CUP 2026.",
};

export default function MerchandisePage() {
  return (
    <div className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <MerchandiseShowcase />
    </div>
  );
}

