import { CheckRegistrationModal } from "@/components/CheckRegistrationModal";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Status Pendaftaran Atlet — TI BILLIARD CUP 2026",
  description: "Periksa status pendaftaran delegasi atlet bidang menggunakan Nomor WhatsApp atau Kode Pendaftaran resmi.",
};

export default function CheckStatusPage() {
  return (
    <div className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <CheckRegistrationModal />
    </div>
  );
}

