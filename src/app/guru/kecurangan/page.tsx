"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  KeyRound,
  Layers,
  BarChart3,
  ShieldAlert,
} from "lucide-react";
import { CheatingReportDashboard } from "@/components/cheating-detection/CheatingReportDashboard";

function CheatingReportPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenQuery = searchParams.get("token") || "";

  const handleSelectToken = (token: string) => {
    router.push(`/guru/kecurangan?token=${token}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Teacher Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Logo & Navigation */}
            <div className="flex items-center gap-3">
              <Link
                href="/guru/hasil"
                className="p-2 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-xs transition-colors"
                title="Kembali ke Dasbor Hasil"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      SITINDAK
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                      Pengawasan Ujian
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                    Deteksi Kecurangan & Integritas Siswa
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links to other Guru modules */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/guru/hasil"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Hasil & Profil Siswa</span>
              </Link>

              <Link
                href="/guru/asesmen"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Kelola Asesmen & Token</span>
              </Link>

              <Link
                href="/guru/soal"
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Bank Soal 3-Tier</span>
              </Link>

              <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

              <Link
                href="/asesmen"
                className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                <span>Uji Mode Fokus Siswa</span>
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheatingReportDashboard
          initialToken={tokenQuery}
          onSelectToken={handleSelectToken}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SITINDAK</span>
            <span>— Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Mode Fokus & Pencatatan Aktivitas Tab</span>
            <span>•</span>
            <span>Otorisasi Guru Pemilik Kelas</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function CheatingReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Memuat Laporan Integritas Siswa...</p>
          </div>
        </div>
      }
    >
      <CheatingReportPageContent />
    </Suspense>
  );
}
