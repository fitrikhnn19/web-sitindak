"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  KeyRound,
  ShieldCheck,
  GraduationCap,
} from "lucide-react";

interface TeacherAuthLayoutProps {
  children: React.ReactNode;
  badgeTitle?: string;
  pageTitle: string;
  pageDescription: string;
}

export const TeacherAuthLayout: React.FC<TeacherAuthLayoutProps> = ({
  children,
  badgeTitle = "Akun Guru SITINDAK",
  pageTitle,
  pageDescription,
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Bar Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-slate-900">
                    SITINDAK
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    Portal Guru
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi
                </p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/asesmen"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-sm transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Uji Layar Siswa (Token)</span>
              <span className="sm:hidden">Siswa</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri: Form Card (Col 7 on LG) */}
          <div className="lg:col-span-7 w-full max-w-xl mx-auto">
            <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
              
              {/* Header Card */}
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>{badgeTitle}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {pageTitle}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  {pageDescription}
                </p>
              </div>

              {/* Children (Form Masuk, Daftar, atau Lupa Sandi) */}
              {children}

            </div>
          </div>

          {/* Kolom Kanan: Edukasi Three-Tier & PRD Context (Col 5 on LG) */}
          <div className="lg:col-span-5 hidden lg:flex flex-col gap-5 text-left">
            
            {/* Kartu Edukasi SITINDAK */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Diagnostik Three-Tier Instan
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Membedakan konsepsi siswa sebelum materi Geometri
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Tanpa perlu memeriksa secara manual satu per satu, SITINDAK mengelompokkan pemahaman siswa ke dalam 3 kategori ilmiah:
              </p>

              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">
                      Sudah Paham Utuh
                    </span>
                    <span className="text-[11px] text-emerald-700 leading-tight block mt-0.5">
                      Jawaban benar + Alasan tepat + Yakin mantap. Siap masuk materi lanjutan.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">
                      Miskonsepsi
                    </span>
                    <span className="text-[11px] text-amber-800 leading-tight block mt-0.5">
                      Jawaban/alasan keliru namun siswa yakin. Butuh pelurusan konsep prasyarat.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-100 border border-slate-200">
                  <HelpCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Belum Paham (Menebak)
                    </span>
                    <span className="text-[11px] text-slate-600 leading-tight block mt-0.5">
                      Tidak yakin atau ragu-ragu dalam memberikan alasan. Perlu penguatan materi.
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Rancangan Asesmen Diagnostik</span>
                <span className="text-blue-600 font-semibold">Satu Akun, Multi Kelas</span>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">SITINDAK</span>
            <span>— Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Platform Diagnostik Tiga Tingkat Geometri SMA
          </p>
        </div>
      </footer>

    </div>
  );
};
