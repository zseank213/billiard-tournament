import { RegistrationForm } from "@/components/RegistrationForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pendaftaran Delegasi Tim — TI BILLIARD CUP 2026",
  description: "Formulir pendaftaran resmi perwakilan kontingen bidang di lingkungan kerja Ganesha Operation. Gratis tanpa dipungut biaya.",
};

export default function RegisterPage() {
  return (
    <div className="max-w-7xl mx-auto w-full min-w-0 max-w-full px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <RegistrationForm />
    </div>
  );
}

