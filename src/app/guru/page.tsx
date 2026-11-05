"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import {
  Compass,
  ArrowRight,
  KeyRound,
  Layers,
  BarChart3,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  ShieldCheck,
  User,
  School,
  Plus,
  BookOpen,
} from "lucide-react";
import { TeacherSessionHeader } from "@/components/dashboard/TeacherSessionHeader";
import { useTeacherAuth } from "@/lib/useTeacherAuth";

function TeacherDashboardHomeContent() {
  const { teacher, isLoggedIn } = useTeacherAuth();

  const greetingName = teacher?.name || "Bapak/Ibu Guru";
  const schoolDisplay = teacher?.schoolName || "Sekolah Belum Diatur";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Teacher Session Header */}
      <TeacherSessionHeader
        currentModule="dasbor"
        title="Dasbor Utama Guru"
        subtitle="Pusat Kendali Asesmen Tiga Tingkat & Diagnostik Miskonsepsi Siswa"
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Portal Guru SITINDAK — Asesmen Tiga Tingkat Geometri</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Selamat Datang, {greetingName}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Platform diagnostik ini membantu Anda mendeteksi miskonsepsi siswa secara otomatis tanpa hitung manual sebelum masuk ke materi transformasi geometri.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{schoolDisplay}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>Kelas Diampu: XI-A, XI-B (SMA Kelas 11)</span>
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Sesi Guru Aktif
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/guru/kelas"
                className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
              >
                <School className="w-4 h-4" />
                <span>Kelola Kelas</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/guru/asesmen"
                className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-300 shadow-sm transition-colors flex items-center gap-2"
              >
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Kelola Asesmen & Token</span>
              </Link>
              
              <Link
                href="/guru/profil"
                className="px-4 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-300 shadow-sm transition-colors flex items-center gap-2"
              >
                <User className="w-4 h-4 text-slate-600" />
                <span>Atur Profil & Sekolah</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Completion Alert if school is not set */}
        {(!teacher?.schoolName || teacher.schoolName.trim() === "") && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Nama sekolah belum diatur. Lengkapi nama sekolah di halaman profil agar laporan asesmen siswa memuat identitas instansi yang lengkap.
              </span>
            </div>
            <Link
              href="/guru/profil"
              className="shrink-0 px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-semibold transition-colors"
            >
              Lengkapi Sekolah Sekarang →
            </Link>
          </div>
        )}

        {/* Onboarding Guide for New Teacher */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Alur Memulai Asesmen Diagnostik SITINDAK
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">1</span>
              <div>
                <p className="font-bold text-slate-900">Atur Profil & Sekolah</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Isi identitas Anda dan nama sekolah di menu <Link href="/guru/profil" className="text-blue-600 underline hover:text-blue-700">Profil</Link>.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0">2</span>
              <div>
                <p className="font-bold text-slate-900">Daftarkan Kelas yang Diampu</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Tambah kelas dan kuota siswa di menu <Link href="/guru/kelas" className="text-blue-600 underline hover:text-blue-700">Kelola Kelas</Link>. Siswa otomatis tercatat saat login.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">3</span>
              <div>
                <p className="font-bold text-slate-900">Terbitkan Token Asesmen</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Pilih soal dan buat satu token untuk kelas di menu <Link href="/guru/asesmen" className="text-blue-600 underline hover:text-blue-700">Asesmen & Token</Link>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Core Modules Cards */}
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span>Modul Kerja Guru SITINDAK</span>
            <span className="text-xs text-slate-500 font-normal">(Terintegrasi)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            
            {/* Card 1: Kelola Kelas */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center transition-transform group-hover:scale-105">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    Manajemen Kelas
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                    Kelola Kelas di Dasbor
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Daftarkan kelas yang diampu, atur kuota siswa, dan kelola ruang asesmen terpisah antar kelas.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100">
                <Link
                  href="/guru/kelas"
                  className="w-full py-2 rounded-lg bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Buka Ruang Kelas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            
            {/* Card 2: Asesmen & Token */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center transition-transform group-hover:scale-105">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    Pelaksanaan
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                    Kelola Asesmen & Token
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Buat asesmen terjadwal, terbitkan token per kelas dengan kuota pemakaian, dan pantau progres pengerjaan siswa.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100">
                <Link
                  href="/guru/asesmen"
                  className="w-full py-2 rounded-lg bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Buka Asesmen & Token</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 3: Bank Soal 3-Tier */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center transition-transform group-hover:scale-105">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                    Bank Instrumen
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                    Bank Soal Tiga Tingkat
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Susun butir soal 3-tier: Jawaban (A–E), Alasan (A–E), dan Tingkat Keyakinan, lengkap dengan rumus LaTeX.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100">
                <Link
                  href="/guru/soal"
                  className="w-full py-2 rounded-lg bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Buka Kumpulan Soal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 4: Profil Hasil Siswa */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center transition-transform group-hover:scale-105">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    Diagnostik
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                    Profil Diagnostik Siswa
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Matriks pemahaman siswa (paham, miskonsepsi, belum paham), peta materi prasyarat yang perlu diulang, dan unduh laporan.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100">
                <Link
                  href="/guru/hasil"
                  className="w-full py-2 rounded-lg bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Lihat Profil Hasil</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Card 5: Kualitas Soal */}
            <div className="rounded-xl bg-white border border-slate-200 p-5 flex flex-col justify-between hover:border-blue-400 hover:shadow-md transition-all group">
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center transition-transform group-hover:scale-105">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">
                    Psikometrik
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
                    Analisis Kualitas Soal
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Uji psikometrik otomatis: indeks kesukaran, daya pembeda, koefisien validitas & reliabilitas, serta saran perbaikan butir.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100">
                <Link
                  href="/guru/analisis-soal"
                  className="w-full py-2 rounded-lg bg-slate-50 group-hover:bg-blue-600 text-slate-700 group-hover:text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Evaluasi Kualitas</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Three-Tier Diagnostic Quick Guide & Student Test shortcut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Panduan Diagnostik Tiga Tingkat (Three-Tier)
                </h3>
              </div>
              <span className="text-[11px] text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                Prasyarat Geometri
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Format asesmen diagnostik yang dirancang khusus untuk membedakan secara tegas kondisi konsepsi siswa:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center">1</span>
                  <h4 className="text-xs font-bold text-slate-900">Tingkat 1: Jawaban</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pilihan konten A–E yang memuat satu opsi benar dan distractor bermuatan miskonsepsi.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center justify-center">2</span>
                  <h4 className="text-xs font-bold text-slate-900">Tingkat 2: Alasan</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pilihan penalaran A–E yang membedakan pemahaman konsep mendalam vs hafalan rumus.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 font-bold text-[11px] flex items-center justify-center">3</span>
                  <h4 className="text-xs font-bold text-slate-900">Tingkat 3: Keyakinan</h4>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Pilihan tegas <em>Yakin</em> atau <em>Tidak Yakin</em> (tanpa A–E) untuk mendeteksi tebakan.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 rounded-2xl bg-blue-50 border border-blue-200 p-6 flex flex-col justify-between shadow-sm">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-700">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Simulasi Pengerjaan Siswa</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Ingin Menguji Tampilan dari Sisi Siswa?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Buka simulasi layar siswa untuk mencoba pengerjaan soal tiga tingkat dengan token kelas (contoh: <strong className="text-blue-700">GEO-IXA</strong>) dalam mode fokus ujian.
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/asesmen"
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Buka Layar Pengerjaan Siswa</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">SITINDAK</span>
            <span>— Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Portal Guru Terintegrasi
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function TeacherDashboardHomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <TeacherDashboardHomeContent />
    </Suspense>
  );
}
