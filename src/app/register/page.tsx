import { RegistrationForm } from "@/components/RegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Delegasi Tim — TI BILLIARD CUP 2026",
  description:
    "Formulir pendaftaran resmi perwakilan kontingen bidang di lingkungan kerja Ganesha Operation. Gratis tanpa dipungut biaya.",
  openGraph: {
    title: "Pendaftaran Delegasi Tim — TI BILLIARD CUP 2026",
    description:
      "Formulir pendaftaran resmi perwakilan kontingen bidang di lingkungan kerja Ganesha Operation. Segera daftarkan kontingen bidang Anda!",
    url: "https://open-tournament.ganeshaoperationexpert.com/register",
    images: [
      {
        url: "/images/ti-billiard-cup-banner-2026.jpg",
        width: 683,
        height: 1024,
        alt: "TI BILLIARD CUP 2026 Official Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pendaftaran Delegasi Tim — TI BILLIARD CUP 2026",
    description:
      "Formulir pendaftaran resmi perwakilan kontingen bidang di lingkungan kerja Ganesha Operation.",
    images: ["/images/ti-billiard-cup-banner-2026.jpg"],
  },
};

export default function RegisterPage() {
  return (
    <div className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <RegistrationForm />
    </div>
  );
}

