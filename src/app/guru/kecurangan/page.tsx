"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheatingReportDashboard } from "@/components/cheating-detection/CheatingReportDashboard";
import { TeacherSessionHeader } from "@/components/dashboard/TeacherSessionHeader";

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
      <TeacherSessionHeader
        currentModule="kecurangan"
        title="Pengawasan Ujian & Integritas Siswa"
        subtitle="Forensik & Catatan Pengawasan Asesmen"
      />

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
