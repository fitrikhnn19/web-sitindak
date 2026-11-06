"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  User,
  School,
  FileText,
  HelpCircle,
  Sparkles,
  Layers,
  KeyRound,
  Eye,
  Check,
} from "lucide-react";
import { AssessmentToken } from "@/lib/assessment-mock-data";

interface AssessmentInstructionsProps {
  token: AssessmentToken;
  studentName: string;
  questionCount: number;
  onStartExam: () => void;
  onBackToEntry: () => void;
}

export const AssessmentInstructions: React.FC<AssessmentInstructionsProps> = ({
  token,
  studentName,
  questionCount,
  onStartExam,
  onBackToEntry,
}) => {
  const [hasAgreed, setHasAgreed] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Ringkasan & Verifikasi Data Diri */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Data Diri Berhasil Diverifikasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Petunjuk Pengerjaan Asesmen
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Bacalah instruksi berikut secara seksama sebelum memulai pengerjaan soal.
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToEntry}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ganti Nama / Token</span>
          </button>
        </div>

        {/* Info Grid Siswa & Asesmen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Nama Peserta
            </span>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-sm font-bold text-slate-900 truncate" title={studentName}>
                {studentName}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Kelas / Rombel
            </span>
            <div className="flex items-center gap-2">
              <School className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="text-sm font-bold text-slate-900 truncate">
                {token.className}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Alokasi Waktu
            </span>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="text-sm font-bold text-slate-900">
                {token.durationMinutes && token.durationMinutes > 0
                  ? `${token.durationMinutes} Menit`
                  : "Tanpa Batas"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Jumlah Butir Soal
            </span>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-sm font-bold text-slate-900">
                {questionCount} Soal 3-Tingkat
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Panduan Cara Kerja Soal 3 Tingkat (Three-Tier) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Cara Menjawab Soal 3 Tingkat (Three-Tier)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Setiap nomor soal memiliki 3 tingkat yang harus kamu selesaikan secara berurutan:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tingkat 1 */}
          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 space-y-3 relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 text-white text-xs font-bold">
              <span>Tingkat 1</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Jawaban Konsep Matematika
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bacalah soal matematika dengan teliti, kemudian tentukan pilihan jawaban yang paling tepat (Pilihan A, B, C, D, atau E).
            </p>
          </div>

          {/* Tingkat 2 */}
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 space-y-3 relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600 text-white text-xs font-bold">
              <span>Tingkat 2</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Alasan Ilmiah Pemilihan Jawaban
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pilihlah dasar penalaran, rumus, atau alasan ilmiah yang mendasari mengapa kamu memilih jawaban pada Tingkat 1.
            </p>
          </div>

          {/* Tingkat 3 */}
          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5 space-y-3 relative">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-600 text-white text-xs font-bold">
              <span>Tingkat 3</span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">
              Tingkat Keyakinan Diri
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tentukan seberapa yakin kamu dengan kombinasi jawaban dan alasanmu:
            </p>
            <div className="space-y-1.5 pt-1 text-[11px]">
              <div className="flex items-center gap-2 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>Yakin (Paham konsepnya)</span>
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <HelpCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Tidak Yakin (Menebak / Ragu)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Catatan Edukatif */}
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 leading-relaxed">
            <span className="font-bold">Tips Kejujuran Pemahaman:</span> Asesmen ini bertujuan mendeteksi kebutuhan belajarmu, bukan untuk menghakimi nilai akhir. Jika kamu memang ragu atau menebak, pilihlah opsi <strong>&quot;Tidak Yakin&quot;</strong> secara jujur agar gurumu dapat memberikan penjelasan dan materi pengayaan yang tepat.
          </div>
        </div>
      </div>

      {/* 3. Tata Tertib & Mode Fokus Ujian (Anti-Kecurangan) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Tata Tertib &amp; Mode Fokus Ujian
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Sistem SITINDAK dilengkapi pengawasan integritas otomatis selama asesmen berlangsung:
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
              1
            </span>
            <div className="leading-relaxed">
              <strong className="text-slate-900">Dilarang Berpindah Tab atau Keluar Halaman:</strong> Sistem akan mendeteksi dan mencatat durasi serta frekuensi jika kamu berpindah tab di peramban, membuka aplikasi lain, atau meminimalkan layar.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
              2
            </span>
            <div className="leading-relaxed">
              <strong className="text-slate-900">Pintasan Keyboard &amp; Klik Kanan Dinonaktifkan:</strong> Tombol pintasan (seperti Alt+Tab, Ctrl+C, Ctrl+V, F12) serta menu klik kanan dibatasi untuk menjaga keamanan butir soal.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
              3
            </span>
            <div className="leading-relaxed">
              <strong className="text-slate-900">Pengatur Waktu Berjalan Mundur:</strong> Waktu ujian akan mulai berjalan otomatis begitu kamu menekan tombol &quot;Mulai Kerjakan Asesmen&quot;. Jika waktu habis, jawabanmu otomatis tersimpan dan dikirimkan.
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
            <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
              4
            </span>
            <div className="leading-relaxed">
              <strong className="text-slate-900">Penyimpanan Jawaban Otomatis:</strong> Setiap jawaban yang kamu klik akan langsung tersimpan. Kamu dapat berpindah nomor soal kapan saja menggunakan kisi navigasi nomor soal.
            </div>
          </div>
        </div>
      </div>

      {/* 4. Persetujuan & Tombol Mulai */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <label className="flex items-start gap-3.5 cursor-pointer p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50/70 transition-all select-none">
          <input
            type="checkbox"
            checked={hasAgreed}
            onChange={(e) => setHasAgreed(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold text-slate-900 block mb-0.5">
              Konfirmasi Pemahaman Petunjuk Pengerjaan
            </span>
            Saya telah membaca dan memahami seluruh petunjuk pengerjaan di atas. Saya berjanji akan mengerjakan asesmen ini secara mandiri, fokus, dan jujur tanpa bantuan pihak lain.
          </div>
        </label>

        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onBackToEntry}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
          >
            Kembali
          </button>

          <button
            type="button"
            disabled={!hasAgreed}
            onClick={onStartExam}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              hasAgreed
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                : "bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
            }`}
          >
            <span>Mulai Kerjakan Asesmen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

