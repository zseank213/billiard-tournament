import { LiveReportDashboard } from "@/components/dashboard/LiveReportDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Live Report & Wasit — TI BILLIARD CUP 2026",
  description: "Portal pengisian live score dan pelaporan pertandingan babak penyisihan grup & bagan gugur turnamen biliar antar bidang.",
};

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 w-full min-w-0 max-w-full">
      <LiveReportDashboard />
    </div>
  );
}
