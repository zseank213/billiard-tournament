import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#dc2626",
};

export const metadata: Metadata = {
  title: "TI BILLIARD CUP 2026 — Sportivitas Antar Bidang IT DEPT x Ganesha Operation",
  description:
    "Portal Resmi Turnamen TI BILLIARD CUP 2026. Sportivitas Antar Bidang IT DEPT & Ganesha Operation. Live Skor, Jadwal Pertandingan, Pendaftaran & Merchandise.",
  keywords: [
    "TI BILLIARD CUP 2026",
    "IT DEPT",
    "Ganesha Operation",
    "Sportivitas Antar Bidang",
    "Billiard Tournament 2026",
    "Jadwal Billiard",
  ],
  icons: {
    icon: "/images/logo-it-dept.png",
    apple: "/images/logo-it-dept.png",
  },
};

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 antialiased tournament-bg w-full max-w-full overflow-x-clip selection:bg-red-500 selection:text-white">
        {/* Strictly Fixed Top App Bar (Never scrolls out of view) */}
        <Navbar />
        {/* Main page wrapper with padding for fixed navbar */}
        <div className="pt-14 sm:pt-20 flex-1 flex flex-col justify-between w-full min-w-0 max-w-full overflow-x-clip">
          <main className="flex-1 w-full min-w-0 max-w-full">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
