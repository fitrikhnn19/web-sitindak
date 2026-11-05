"use client";

import React from "react";
import Link from "next/link";
import {
  User,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Printer,
  ArrowLeft,
  BookOpen,
  ShieldCheck,
  ShieldAlert,
  Lightbulb,
} from "lucide-react";
import {
  ClassAssessmentSummary,
} from "@/lib/teacher-results-mock-data";
import { FormattedMathText } from "@/components/assessment/FormattedMathText";
import { MOCK_QUESTIONS } from "@/lib/assessment-mock-data";

interface IndividualStudentReportProps {
  studentId: string;
  summary: ClassAssessmentSummary;
  onSelectStudent: (studentId: string) => void;
  onBackToMatrix: () => void;
}

export const IndividualStudentReport: React.FC<IndividualStudentReportProps> = ({
  studentId,
  summary,
  onSelectStudent,
  onBackToMatrix,
}) => {
  const student = summary.students.find((s) => s.id === studentId) || summary.students[0];

  if (!student) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
          <User className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Belum Ada Siswa yang Menyelesaikan Ujian</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Belum ada rekaman lembar pengerjaan siswa untuk asesmen <strong>{summary.assessmentTitle}</strong> ({summary.tokenCode}).
          Laporan individual siswa akan otomatis tersedia segera setelah siswa mengumpulkan ujian.
        </p>
        <button
          onClick={onBackToMatrix}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Matriks Kelas</span>
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(student.submittedAt).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm print:hidden">
        <button
          onClick={onBackToMatrix}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors w-fit shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Matriks Kelas</span>
        </button>

        {/* Student Switcher Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Pilih Siswa:
          </span>
          <div className="relative">
            <select
              value={student.id}
              onChange={(e) => onSelectStudent(e.target.value)}
              className="text-xs font-bold py-2 pl-3 pr-8 rounded-lg bg-white border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
            >
              {summary.students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.studentName} ({s.pahamCount} Paham, {s.miskonsepsiCount} Miskonsepsi)
                </option>
              ))}
            </select>
          </div>

          {/* Print Report */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>Cetak Laporan</span>
          </button>
        </div>
      </div>

      {/* Printable Report Paper Container */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm print:border-none print:shadow-none print:p-0">

        {/* Report Header */}
        <div className="border-b border-slate-200 pb-6 print:border-black/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 print:border-black print:text-black print:bg-slate-100">
                  Laporan Diagnostik Individual
                </span>
                <span className="text-xs text-slate-500 print:text-slate-700">
                  SITINDAK Three-Tier Assessment
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 print:text-black">
                {student.studentName}
              </h2>
              <p className="text-xs text-slate-500 mt-1 print:text-slate-700">
                {student.className} • Asesmen: {summary.assessmentTitle}
              </p>
            </div>

            {/* Quick Metadata */}
            <div className="text-left sm:text-right text-xs space-y-1 text-slate-600 print:text-slate-800">
              <div className="flex items-center sm:justify-end gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Durasi: <strong>{student.durationMinutes} menit</strong></span>
              </div>
              <div className="flex items-center sm:justify-end gap-1.5">
                {student.cheatingEventsCount === 0 ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Integritas: Terjaga Penuh
                  </span>
                ) : (
                  <Link
                    href={`/guru/kecurangan?token=${summary.tokenCode}`}
                    className="text-amber-800 hover:text-amber-900 font-semibold flex items-center gap-1 underline underline-offset-2"
                    title="Buka Laporan Forensik Deteksi Kecurangan"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Peringatan: {student.cheatingEventsCount}x Pindah Tab (Lihat Bukti)</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Score & Profile Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 print:border-black/20 text-center">
            <span className="text-[11px] text-slate-500 font-medium block">
              Skor Jawaban (Tingkat 1)
            </span>
            <span className="text-2xl font-black text-slate-900 print:text-black">
              {student.tier1Score}/{summary.totalQuestions}
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">
              Benar Pilihan Ganda
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 print:border-black/20 text-center">
            <span className="text-[11px] text-slate-500 font-medium block">
              Skor Alasan (Tingkat 2)
            </span>
            <span className="text-2xl font-black text-slate-900 print:text-black">
              {student.tier2Score}/{summary.totalQuestions}
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">
              Alasan Ilmiah Tepat
            </span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 print:border-black/20 text-center">
            <span className="text-[11px] text-emerald-800 font-bold block">
              Sudah Paham
            </span>
            <span className="text-2xl font-black text-emerald-700 print:text-black">
              {student.pahamCount} Butir
            </span>
            <span className="text-[10px] text-emerald-600 block font-medium">
              {Math.round((student.pahamCount / summary.totalQuestions) * 100)}% Penguasaan
            </span>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 print:border-black/20 text-center">
            <span className="text-[11px] text-amber-900 font-bold block">
              Miskonsepsi
            </span>
            <span className="text-2xl font-black text-amber-800 print:text-black">
              {student.miskonsepsiCount} Butir
            </span>
            <span className="text-[10px] text-amber-700 block font-medium">
              Perlu Remediasi Segera
            </span>
          </div>
        </div>

        {/* Personalized Teacher Action & Prerequisite Topics To Review */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {/* Prerequisite Topics to Review */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5 print:border-black/30">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Materi Prasyarat yang Perlu Dipelajari Ulang:</span>
            </div>
            {student.needsPrerequisiteReview.length === 0 ? (
              <p className="text-xs text-emerald-700 italic">
                Siswa tidak memiliki miskonsepsi atau materi prasyarat yang bermasalah.
              </p>
            ) : (
              <ul className="space-y-1.5 text-xs">
                {student.needsPrerequisiteReview.map((topic, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-slate-800 print:text-black"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Differentiated Recommendation */}
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2.5 print:border-black/30">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
              <Lightbulb className="w-4 h-4 text-blue-600" />
              <span>Rekomendasi Tindak Lanjut Guru untuk Siswa Ini:</span>
            </div>
            <p className="text-xs text-slate-700 print:text-black leading-relaxed">
              {student.differentiatedRecommendation}
            </p>
          </div>
        </div>

        {/* Detailed Item-by-Item Breakdown (Q1 to Q10) */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 print:text-black">
              Rincian Pemahaman Tiap Butir Soal ({student.itemResults.length} Butir):
            </h3>
            <span className="text-[11px] text-slate-500">
              Evaluasi Three-Tier Konseptual
            </span>
          </div>

          <div className="space-y-3">
            {student.itemResults.map((item) => {
              const fullQuestion = MOCK_QUESTIONS.find((q) => q.id === item.questionId);

              return (
                <div
                  key={item.questionId}
                  className="rounded-xl bg-white border border-slate-200 p-4 space-y-3 shadow-xs print:border-black/20"
                >
                  {/* Top Bar of Item */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        Q{item.questionNumber}
                      </span>
                      <span className="font-bold text-xs text-slate-900 print:text-black">
                        {item.title}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {item.status === "paham" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Sudah Paham
                        </span>
                      )}
                      {item.status === "miskonsepsi" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Miskonsepsi
                        </span>
                      )}
                      {item.status === "belum paham" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                          Belum Paham
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question context */}
                  <div className="text-xs text-slate-700 print:text-black">
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                      Prasyarat: {item.prerequisiteTopic}
                    </span>
                    {fullQuestion && (
                      <div className="mt-1 font-medium">
                        <FormattedMathText text={fullQuestion.tier1Question} />
                      </div>
                    )}
                  </div>

                  {/* Answers Comparison Matrix */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {/* Tier 1 Answer */}
                    <div
                      className={`p-2.5 rounded-lg border ${item.isTier1Correct
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-rose-50 border-rose-200 text-rose-900"
                        }`}
                    >
                      <span className="text-[10px] text-slate-500 block font-semibold">
                        Tingkat 1 (Pilihan Jawaban)
                      </span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-bold">
                          Jawaban: {item.tier1Answer}
                        </span>
                        <span className="text-[10px] font-semibold">
                          {item.isTier1Correct ? "✓ Tepat" : `Kunci: ${item.tier1CorrectAnswer}`}
                        </span>
                      </div>
                    </div>

                    {/* Tier 2 Reason */}
                    <div
                      className={`p-2.5 rounded-lg border ${item.isTier2Correct
                        ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                        : "bg-rose-50 border-rose-200 text-rose-900"
                        }`}
                    >
                      <span className="text-[10px] text-slate-500 block font-semibold">
                        Tingkat 2 (Alasan Matematis)
                      </span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-bold">
                          Alasan: {item.tier2Answer}
                        </span>
                        <span className="text-[10px] font-semibold">
                          {item.isTier2Correct ? "✓ Tepat" : `Kunci: ${item.tier2CorrectAnswer}`}
                        </span>
                      </div>
                    </div>

                    {/* Tier 3 Confidence */}
                    <div className="p-2.5 rounded-lg border bg-slate-50 border-slate-200 text-slate-800">
                      <span className="text-[10px] text-slate-500 block font-semibold">
                        Tingkat 3 (Tingkat Keyakinan)
                      </span>
                      <div className="flex items-center justify-between mt-0.5">
                        <span className="font-bold capitalize">
                          {item.tier3Confidence}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {item.tier3Confidence === "yakin" ? "Mantap" : "Ragu-ragu / Tebak"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Diagnostic Note */}
                  <div className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <strong className="text-slate-800 not-italic">Catatan Diagnostik: </strong>
                    {item.feedbackNote}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Footer */}
        <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 print:text-black">
          <div>
            <p className="font-bold text-slate-800 print:text-black">
              SITINDAK — Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi
            </p>
            <p className="text-[11px] text-slate-500 print:text-slate-700">
              Dokumen resmi hasil diagnostik three-tier otomatis • Disimpan permanen
            </p>
          </div>
          <div className="text-right">
            <span className="font-medium text-[11px] text-slate-600 print:text-black">
              Guru Pengampu: {summary.teacherName}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
