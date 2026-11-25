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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://open-tournament.vercel.app"
  ),
  title: "TI BILLIARD CUP 2026 — Turnamen Bola 8 Antar Bidang Ganesha Operation",
  description:
    "Portal Resmi Turnamen TI BILLIARD CUP 2026. Sportivitas Antar Bidang IT DEPT & Ganesha Operation. Perebutan Piala Bergilir Direktur Perencanaan.",
  keywords: [
    "TI BILLIARD CUP 2026",
    "IT DEPT",
    "Ganesha Operation",
    "Turnamen Bola 8",
    "Billiard Tournament 2026",
    "Piala Bergilir Direktur Perencanaan",
  ],
  icons: {
    icon: [
      { url: "/images/logo-it-dept.png", sizes: "any" },
      { url: "/icon.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/images/logo-it-dept.png",
    apple: "/images/logo-it-dept.png",
  },
  openGraph: {
    title: "TI BILLIARD CUP 2026 — Turnamen Bola 8 Antar Bidang",
    description:
      "Portal Resmi Turnamen TI BILLIARD CUP 2026. Perebutan Piala Bergilir Direktur Perencanaan. Mulai Kamis, 03 Desember 2026 di Greenlight Cafe & Billiard.",
    url: "https://open-tournament.vercel.app",
    siteName: "TI BILLIARD CUP 2026",
    images: [
      {
        url: "/images/ti-billiard-cup-banner-2026.jpg",
        width: 683,
        height: 1024,
        alt: "TI BILLIARD CUP 2026 Official Banner",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TI BILLIARD CUP 2026 — Turnamen Bola 8 Antar Bidang",
    description:
      "Portal Resmi Turnamen TI BILLIARD CUP 2026. Perebutan Piala Bergilir Direktur Perencanaan. Mulai Kamis, 03 Desember 2026 di Greenlight Cafe & Billiard.",
    images: ["/images/ti-billiard-cup-banner-2026.jpg"],
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
