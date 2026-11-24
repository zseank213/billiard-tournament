import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Nusantara Billiard Championship 2026 - Live Schedule & Registration",
  description:
    "Dashboard Turnamen Billiard 9-Ball & 10-Ball Handicap Nasional. Live Schedule, Skor Pertandingan, dan Formulir Pendaftaran Peserta terintegrasi Supabase.",
  keywords: [
    "turnamen billiard",
    "billiard championship",
    "jadwal turnamen biliar",
    "pendaftaran billiard",
    "9-ball open",
    "10-ball handicap",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistSans.variable} ${geistMono.variable} dark h-full`}>
      <body className="min-h-full flex flex-col bg-[#080c0a] text-zinc-100 antialiased felt-pattern">
        {children}
      </body>
    </html>
  );
}
