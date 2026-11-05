"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Compass, ArrowLeft, Layers, BarChart3, KeyRound } from "lucide-react";
import { ThreeTierEditorForm } from "@/components/question-builder/ThreeTierEditorForm";
import { TeacherSessionHeader } from "@/components/dashboard/TeacherSessionHeader";

function BuatSoalContent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Teacher Navigation Header */}
      <TeacherSessionHeader
        currentModule="soal"
        title="Penyusun Soal Tiga Tingkat"
        subtitle="Buat Butir Soal Diagnostik Baru dengan T1, T2, dan T3"
      />

      {/* Main Form */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ThreeTierEditorForm
          onCancel={() => router.push("/guru/soal")}
          onSuccess={() => router.push("/guru/soal")}
        />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">SITINDAK</span>
            <span>— Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Form Tiga Tingkat: Jawaban (T1) + Alasan (T2) + Keyakinan (T3)
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function BuatSoalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BuatSoalContent />
    </Suspense>
  );
}
