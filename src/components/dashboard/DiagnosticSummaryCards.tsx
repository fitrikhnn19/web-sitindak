"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import { ClassAssessmentSummary } from "@/lib/teacher-results-mock-data";

interface DiagnosticSummaryCardsProps {
  summary: ClassAssessmentSummary;
}

export const DiagnosticSummaryCards: React.FC<DiagnosticSummaryCardsProps> = ({
  summary,
}) => {
  const totalResponses = summary.students.length * summary.totalQuestions;
  const totalPaham = summary.students.reduce((acc, s) => acc + s.pahamCount, 0);
  const totalMiskonsepsi = summary.students.reduce(
    (acc, s) => acc + s.miskonsepsiCount,
    0
  );
  const totalBelumPaham = summary.students.reduce(
    (acc, s) => acc + s.belumPahamCount,
    0
  );

  return (
    <section className="space-y-4">
      {/* 4 Diagnostic Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Sudah Paham */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              1. Sudah Paham
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {summary.overallMasteryRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({totalPaham} dari {totalResponses} butir)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Jawaban benar, alasan tepat, dan siswa yakin. Siap melanjutkan ke materi inti transformasi.
          </p>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${summary.overallMasteryRate}%` }}
            />
          </div>
        </div>

        {/* Card 2: Miskonsepsi */}
        <div className="rounded-xl bg-white border border-amber-300 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <span>2. Miskonsepsi</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Fokus Guru
              </span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-700">
              {summary.overallMisconceptionRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({totalMiskonsepsi} dari {totalResponses} butir)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Siswa <strong>merasa yakin</strong>, padahal konsep atau alasannya keliru. Perlu penguatan konsep segera.
          </p>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${summary.overallMisconceptionRate}%` }}
            />
          </div>
        </div>

        {/* Card 3: Belum Paham */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Belum Paham
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">
              {summary.overallUnmasteredRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({totalBelumPaham} dari {totalResponses} butir)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Siswa <strong>tidak yakin / ragu-ragu</strong> atau menebak. Butuh penjelasan konsep dasar kembali.
          </p>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-slate-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${summary.overallUnmasteredRate}%` }}
            />
          </div>
        </div>

        {/* Card 4: Kesiapan Prasyarat Kelas */}
        <div className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              Kesiapan Prasyarat
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <BrainCircuit className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-700">
              {summary.classAverageTier1Score * 10}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Skor rata-rata: {summary.classAverageTier1Score}/10
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            Rata-rata alasan benar: <strong>{summary.classAverageTier2Score}/10</strong>. Rekomendasi: lakukan remediasi sebelum bab translasi.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Taraf Cukup
            </span>
            <span className="text-[11px] text-slate-500">
              • 3 topik butuh pengulangan
            </span>
          </div>
        </div>
      </div>

      {/* Visual Conception Ratio Bar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">
              Distribusi Pemahaman Kumulatif {summary.className}
            </h4>
            <p className="text-[11px] text-slate-500">
              Berdasarkan analisis diagnostik three-tier otomatis dari {summary.completedCount} siswa pengerjaan
            </p>
          </div>
        </div>

        <div className="w-full sm:w-1/2 flex flex-col gap-1.5">
          <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden">
            <div
              className="bg-emerald-500 transition-all"
              style={{ width: `${summary.overallMasteryRate}%` }}
              title={`Paham: ${summary.overallMasteryRate}%`}
            />
            <div
              className="bg-amber-400 transition-all"
              style={{ width: `${summary.overallMisconceptionRate}%` }}
              title={`Miskonsepsi: ${summary.overallMisconceptionRate}%`}
            />
            <div
              className="bg-slate-400 transition-all"
              style={{ width: `${summary.overallUnmasteredRate}%` }}
              title={`Belum Paham: ${summary.overallUnmasteredRate}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Paham ({summary.overallMasteryRate}%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Miskonsepsi ({summary.overallMisconceptionRate}%)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              Belum Paham ({summary.overallUnmasteredRate}%)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
