"use client";

import React, { useState, useMemo } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BookOpen,
  RotateCcw,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  Printer,
  Bookmark,
  Share2,
  Lock,
  Maximize2,
  Minimize2,
  Filter,
  Info,
} from "lucide-react";
import {
  ThreeTierQuestion,
  StudentAnswer,
  ConceptionStatus,
} from "@/lib/assessment-mock-data";
import {
  StudentSubmissionData,
  StudentDiagnosticSummary,
  calculateStudentDiagnostics,
} from "@/lib/student-results-store";
import { FormattedMathText } from "./FormattedMathText";

interface AssessmentResultsFeedbackProps {
  studentName: string;
  className: string;
  assessmentTitle: string;
  teacherName?: string;
  submittedAt: string;
  questions: ThreeTierQuestion[];
  answers: Record<string, StudentAnswer>;
  onResetSession: () => void;
  tokenCode?: string;
  cheatingEventsCount?: number;
}

export const AssessmentResultsFeedback: React.FC<AssessmentResultsFeedbackProps> = ({
  studentName,
  className,
  assessmentTitle,
  teacherName = "Dra. Sri Wahyuni, M.Pd.",
  submittedAt,
  questions,
  answers,
  onResetSession,
  tokenCode = "GEO-IXA",
}) => {
  const [filterStatus, setFilterStatus] = useState<"semua" | ConceptionStatus>("semua");
  const [filterTopic, setFilterTopic] = useState<string | "semua">("semua");
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [isCopied, setIsCopied] = useState(false);

  // Compute diagnostics
  const summary: StudentDiagnosticSummary = useMemo(() => {
    const submission: StudentSubmissionData = {
      tokenCode,
      studentName,
      className,
      assessmentTitle,
      teacherName,
      startedAt: new Date(Date.now() - 1800000).toISOString(),
      submittedAt: submittedAt || new Date().toISOString(),
      answers,
    };
    return calculateStudentDiagnostics(submission, questions);
  }, [studentName, className, assessmentTitle, teacherName, submittedAt, answers, questions, tokenCode]);

  const toggleExpand = (id: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [id]: prev[id] === undefined ? false : !prev[id],
    }));
  };

  const handleExpandAll = (expand: boolean) => {
    const newState: Record<string, boolean> = {};
    for (const q of questions) {
      newState[q.id] = expand;
    }
    setExpandedQuestions(newState);
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      const url = `${window.location.origin}/asesmen/hasil?token=${encodeURIComponent(
        tokenCode
      )}&siswa=${encodeURIComponent(studentName)}`;
      navigator.clipboard.writeText(url).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      });
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const filteredEvaluations = summary.evaluations.filter((item) => {
    const matchStatus = filterStatus === "semua" || item.status === filterStatus;
    const matchTopic = filterTopic === "semua" || item.prerequisiteTopic === filterTopic;
    return matchStatus && matchTopic;
  });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* 1. Header Banner & Identity */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative print:border-none print:shadow-none">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Asesmen Berhasil Dikirim & Terkunci</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs font-mono font-bold">
                Token: {tokenCode}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Hasil & Pembahasan Diagnostik Siswa
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs sm:text-sm text-slate-600">
              <span>
                Nama Siswa: <strong className="text-slate-900 font-bold">{studentName}</strong>
              </span>
              <span>•</span>
              <span>{className}</span>
              <span>•</span>
              <span>Pengampu: {teacherName}</span>
            </div>

            <p className="text-[11px] text-slate-500">
              Judul Asesmen: <span className="text-slate-800 font-medium">{assessmentTitle}</span> • Diserahkan pada:{" "}
              {new Date(submittedAt).toLocaleString("id-ID", {
                dateStyle: "full",
                timeStyle: "short",
              })}{" "}
              WIB
            </p>

            {/* Privacy Guarantee Note */}
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
              <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                <strong>Privasi Hasil:</strong> Halaman ini hanya menampilkan hasil pengerjaan Anda sendiri.
              </span>
            </div>
          </div>

          {/* Action Buttons: Copy link, Print, Reset */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 self-start shrink-0 print:hidden">
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isCopied
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                  : "bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-xs"
              }`}
              title="Salin tautan untuk membuka kembali halaman ini"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Salin Tautan</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-colors flex items-center gap-1.5"
              title="Cetak atau simpan lembar refleksi sebagai PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Cetak / PDF</span>
            </button>

            <button
              type="button"
              onClick={onResetSession}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-semibold border border-slate-300 shadow-xs transition-colors flex items-center gap-1.5"
              title="Kembali ke halaman masuk token"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Ringkasan Capaian Jawaban Benar */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Ringkasan Jawaban Benar & Capaian Tingkat</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Akumulasi kebenaran pilihan jawaban dan alasan ilmiah dari {summary.totalQuestions} butir soal yang Anda kerjakan
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 self-start sm:self-center">
            Total Soal: {summary.totalQuestions} Butir
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Tingkat 1 (Pilihan Jawaban) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Tingkat 1 (Pilihan Jawaban)
              </span>
              <span className="text-xs font-mono font-bold text-blue-600">
                {summary.tier1Accuracy}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {summary.tier1CorrectCount}
              </span>
              <span className="text-xs text-slate-500">/ {summary.totalQuestions} Butir Benar</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${summary.tier1Accuracy}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug pt-1">
              Ketepatan memilih koordinat hasil transformasi geometri.
            </p>
          </div>

          {/* Tingkat 2 (Alasan Ilmiah) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Tingkat 2 (Alasan Ilmiah)
              </span>
              <span className="text-xs font-mono font-bold text-purple-600">
                {summary.tier2Accuracy}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-mono">
                {summary.tier2CorrectCount}
              </span>
              <span className="text-xs text-slate-500">/ {summary.totalQuestions} Butir Benar</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${summary.tier2Accuracy}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug pt-1">
              Ketepatan memilih dalil, rumus, dan penalaran konsep.
            </p>
          </div>

          {/* Konsistensi Benar Utuh (T1 & T2 Benar Bersamaan) */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-800">
                Jawaban & Alasan Benar
              </span>
              <span className="text-xs font-mono font-bold text-emerald-700">
                {summary.fullAccuracy}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-900 font-mono">
                {summary.fullCorrectCount}
              </span>
              <span className="text-xs text-emerald-700">/ {summary.totalQuestions} Butir Sempurna</span>
            </div>
            <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${summary.fullAccuracy}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-700 leading-snug pt-1">
              Pilihan jawaban sekaligus alasannya tepat secara ilmiah.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Distribusi Status Pemahaman Tiga Tingkat */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Profil Pemahaman Konsepsi Anda</span>
          </h2>
          <span className="text-xs text-slate-500">
            Klik kartu untuk memfilter butir soal di bawah
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Paham Utuh */}
          <div
            onClick={() => setFilterStatus(filterStatus === "paham" ? "semua" : "paham")}
            className={`rounded-2xl p-5 shadow-sm relative overflow-hidden cursor-pointer transition-all border ${
              filterStatus === "paham"
                ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500"
                : "bg-white border-slate-200 hover:border-emerald-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                1. Sudah Paham
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 font-mono">
                {summary.pahamCount}
              </span>
              <span className="text-xs text-slate-500">
                / {summary.totalQuestions} Soal ({summary.pahamPercentage}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              <strong>Kriteria:</strong> Jawaban benar, alasan ilmiah tepat, dan Anda meyakininya dengan mantap.
            </p>
            {filterStatus === "paham" && (
              <span className="inline-block mt-2 text-[10px] text-emerald-700 font-semibold underline">
                ✓ Sedang memfilter status ini (klik untuk lepas)
              </span>
            )}
          </div>

          {/* Miskonsepsi */}
          <div
            onClick={() => setFilterStatus(filterStatus === "miskonsepsi" ? "semua" : "miskonsepsi")}
            className={`rounded-2xl p-5 shadow-sm relative overflow-hidden cursor-pointer transition-all border ${
              filterStatus === "miskonsepsi"
                ? "bg-amber-50 border-amber-400 ring-2 ring-amber-500"
                : "bg-white border-slate-200 hover:border-amber-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                2. Miskonsepsi
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 font-mono">
                {summary.miskonsepsiCount}
              </span>
              <span className="text-xs text-slate-500">
                / {summary.totalQuestions} Soal ({summary.miskonsepsiPercentage}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              <strong>Kriteria:</strong> Anda merasa yakin, namun jawaban atau alasan matematisnya keliru.
            </p>
            {filterStatus === "miskonsepsi" && (
              <span className="inline-block mt-2 text-[10px] text-amber-700 font-semibold underline">
                ✓ Sedang memfilter status ini (klik untuk lepas)
              </span>
            )}
          </div>

          {/* Belum Paham */}
          <div
            onClick={() => setFilterStatus(filterStatus === "belum paham" ? "semua" : "belum paham")}
            className={`rounded-2xl p-5 shadow-sm relative overflow-hidden cursor-pointer transition-all border ${
              filterStatus === "belum paham"
                ? "bg-slate-100 border-slate-400 ring-2 ring-slate-400"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Belum Paham
              </span>
              <div className="w-7 h-7 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900 font-mono">
                {summary.belumPahamCount}
              </span>
              <span className="text-xs text-slate-500">
                / {summary.totalQuestions} Soal ({summary.belumPahamPercentage}%)
              </span>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
              <strong>Kriteria:</strong> Anda memilih 'Tidak Yakin' (menebak) atau jawaban dan alasan belum tepat.
            </p>
            {filterStatus === "belum paham" && (
              <span className="inline-block mt-2 text-[10px] text-slate-700 font-semibold underline">
                ✓ Sedang memfilter status ini (klik untuk lepas)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 4. Rekomendasi Materi Prasyarat untuk Dipelajari Ulang */}
      {summary.remedialPrerequisites.length > 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Materi Prasyarat yang Perlu Dipelajari Ulang
                </h3>
                <p className="text-xs text-slate-500">
                  Fokuskan persiapan belajar mandiri Anda pada kompetensi dasar berikut sebelum masuk transformasi geometri lanjutan
                </p>
              </div>
            </div>

            {filterTopic !== "semua" && (
              <button
                type="button"
                onClick={() => setFilterTopic("semua")}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline self-start sm:self-center"
              >
                Tampilkan Semua Topik
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {summary.remedialPrerequisites.map((remedial, idx) => {
              const isSelected = filterTopic === remedial.topicName;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition-all text-xs ${
                    isSelected
                      ? "bg-blue-50/50 border-blue-300 ring-2 ring-blue-100"
                      : "bg-slate-50 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {remedial.topicName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-mono">
                        Soal #{remedial.missedQuestionNumbers.join(", #")}
                      </span>

                      {remedial.misconceptionCount > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-semibold">
                          {remedial.misconceptionCount} Miskonsepsi
                        </span>
                      )}

                      {remedial.unmasteredCount > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-semibold">
                          {remedial.unmasteredCount} Belum Paham
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          setFilterTopic(isSelected ? "semua" : remedial.topicName)
                        }
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-blue-600 text-[11px] font-semibold border border-slate-200 shadow-xs transition-colors"
                      >
                        {isSelected ? "Lepas Filter" : "Filter Soal Terkait"}
                      </button>
                    </div>
                  </div>

                  {/* Recommendation Guide */}
                  <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-slate-700 leading-relaxed flex items-start gap-2">
                    <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Saran Belajar:</strong> {remedial.guidanceRecommendation}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 flex items-center gap-3 text-xs sm:text-sm text-emerald-900">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="text-slate-900 block font-bold">Luar Biasa! Semua Konsep Prasyarat Terkuasai Penuh</strong>
            <span>Anda telah menunjukkan penguasaan utuh pada seluruh materi prasyarat. Anda siap melangkah ke materi transformasi geometri berikutnya.</span>
          </div>
        </div>
      )}

      {/* 5. Daftar Pembahasan Butir Soal */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <span>Pembahasan Butir Soal & Perbandingan Jawaban</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bandingkan pilihan jawaban dan alasan Anda dengan kunci jawaban ilmiah guru
            </p>
          </div>

          {/* Quick Filter & Accordion toggles */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {/* Filter Tabs */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setFilterStatus("semua")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  filterStatus === "semua"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Semua ({summary.totalQuestions})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("paham")}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  filterStatus === "paham"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Paham ({summary.pahamCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("miskonsepsi")}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  filterStatus === "miskonsepsi"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Miskonsepsi ({summary.miskonsepsiCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("belum paham")}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                  filterStatus === "belum paham"
                    ? "bg-slate-700 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Belum ({summary.belumPahamCount})
              </button>
            </div>

            {/* Expand / Collapse All buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleExpandAll(true)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs shadow-xs"
                title="Buka semua butir"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleExpandAll(false)}
                className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 text-xs shadow-xs"
                title="Tutup semua butir"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Indicator */}
        {(filterStatus !== "semua" || filterTopic !== "semua") && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
            <div className="flex items-center gap-2 text-slate-700">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>
                Menampilkan <strong>{filteredEvaluations.length}</strong> dari {summary.totalQuestions} butir soal{" "}
                {filterStatus !== "semua" && `(Status: ${filterStatus}) `}
                {filterTopic !== "semua" && `(Topik: ${filterTopic})`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setFilterStatus("semua");
                setFilterTopic("semua");
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold underline text-[11px]"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Question Cards List */}
        <div className="space-y-4">
          {filteredEvaluations.map((item) => {
            const isExpanded = expandedQuestions[item.question.id] ?? true;

            let statusBadge = (
              <span className="px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Sudah Paham</span>
              </span>
            );

            if (item.status === "miskonsepsi") {
              statusBadge = (
                <span className="px-3 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Miskonsepsi</span>
                </span>
              );
            } else if (item.status === "belum paham") {
              statusBadge = (
                <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shrink-0">
                  <XCircle className="w-3.5 h-3.5 text-slate-500" />
                  <span>Belum Paham</span>
                </span>
              );
            }

            return (
              <div
                key={item.question.id}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(item.question.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                      #{item.question.number}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.question.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className="text-slate-600 font-medium">Materi Prasyarat:</span>
                        <span className="px-2 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-700 font-medium">
                          {item.prerequisiteTopic}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {statusBadge}
                    <button
                      type="button"
                      className="text-slate-400 hover:text-slate-700 p-1"
                      aria-label="Toggle accordion"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Question Detail */}
                {isExpanded && (
                  <div className="px-4 pb-6 sm:px-6 space-y-4 border-t border-slate-200 pt-4">
                    
                    {/* Diagnostic Summary Note per Item */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-slate-700 leading-relaxed">
                        <strong className="text-slate-900">Analisis Status: </strong>
                        {item.diagnosticReasonText}
                      </div>
                    </div>

                    {/* Question Statement & Diagram */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                        Soal Tingkat 1:
                      </div>
                      <div className="text-xs sm:text-sm text-slate-900 leading-relaxed font-medium overflow-x-auto max-w-full">
                        <FormattedMathText text={item.question.tier1Question} />
                      </div>

                      {(item.question.tier1SvgDiagram || (item.question as any).imageUrl) && (
                        <div className="w-full flex justify-center py-2 overflow-x-auto">
                          {item.question.tier1SvgDiagram ? (
                            <div
                              className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
                              dangerouslySetInnerHTML={{
                                __html: item.question.tier1SvgDiagram,
                              }}
                            />
                          ) : (item.question as any).imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={(item.question as any).imageUrl}
                              alt="Diagram Soal"
                              className="max-h-52 max-w-full rounded-lg object-contain shadow-xs"
                            />
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Three-Tier Comparative Breakdown: Student vs Teacher Key */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Left: Pilihan Jawaban Anda (Siswa) */}
                      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block pb-1 border-b border-slate-100 flex items-center justify-between">
                          <span>Pilihan Jawaban Anda:</span>
                          <span className="text-[10px] text-slate-400 font-normal">Siswa</span>
                        </span>

                        <div className="space-y-3 text-xs">
                          {/* Tier 1 Student Pick */}
                          <div>
                            <span className="text-slate-500 block text-[10px] mb-1">
                              Tingkat 1 (Pilihan Jawaban):
                            </span>
                            <div className="flex items-start gap-2">
                              <span
                                className={`px-2 py-0.5 rounded font-mono font-bold text-xs shrink-0 ${
                                  item.isT1Correct
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : "bg-rose-50 text-rose-800 border border-rose-200"
                                }`}
                              >
                                {item.studentT1 || "-"}
                              </span>
                              <div className="text-slate-800 leading-relaxed overflow-x-auto max-w-full font-medium">
                                <FormattedMathText
                                  text={item.studentT1Text || "Tidak dijawab"}
                                />
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-semibold mt-1 inline-block ${
                                item.isT1Correct ? "text-emerald-700" : "text-rose-600"
                              }`}
                            >
                              {item.isT1Correct ? "✓ Jawaban Benar" : "✗ Jawaban Keliru"}
                            </span>
                          </div>

                          {/* Tier 2 Student Reason */}
                          <div className="pt-2 border-t border-slate-100">
                            <span className="text-slate-500 block text-[10px] mb-1">
                              Tingkat 2 (Alasan Memilih):
                            </span>
                            <div className="flex items-start gap-2">
                              <span
                                className={`px-2 py-0.5 rounded font-mono font-bold text-xs shrink-0 ${
                                  item.isT2Correct
                                    ? "bg-purple-50 text-purple-800 border border-purple-200"
                                    : "bg-rose-50 text-rose-800 border border-rose-200"
                                }`}
                              >
                                {item.studentT2 || "-"}
                              </span>
                              <div className="text-slate-800 leading-relaxed overflow-x-auto max-w-full font-medium">
                                <FormattedMathText
                                  text={item.studentT2Text || "Tidak dijawab"}
                                />
                              </div>
                            </div>
                            <span
                              className={`text-[10px] font-semibold mt-1 inline-block ${
                                item.isT2Correct ? "text-purple-700" : "text-rose-600"
                              }`}
                            >
                              {item.isT2Correct ? "✓ Alasan Tepat" : "✗ Alasan Keliru"}
                            </span>
                          </div>

                          {/* Tier 3 Confidence */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-slate-500 text-[10px]">
                              Tingkat 3 (Tingkat Keyakinan):
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-bold capitalize ${
                                item.studentT3 === "yakin"
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}
                            >
                              {item.studentT3 || "-"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Kunci Jawaban & Alasan Benar Guru */}
                      <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-900 block pb-1 border-b border-blue-200 flex items-center justify-between">
                          <span>Kunci Ilmiah Guru:</span>
                          <span className="text-[10px] text-blue-700 font-normal">Kunci Resmi</span>
                        </span>

                        <div className="space-y-3 text-xs">
                          {/* Kunci Tier 1 */}
                          <div>
                            <span className="text-blue-800 block text-[10px] mb-1 font-medium">
                              Jawaban Benar Tingkat 1:
                            </span>
                            <div className="flex items-start gap-2">
                              <span className="px-2 py-0.5 rounded bg-blue-100 border border-blue-300 text-blue-900 font-mono font-bold text-xs shrink-0">
                                {item.correctT1}
                              </span>
                              <div className="text-slate-900 font-medium leading-relaxed overflow-x-auto max-w-full">
                                <FormattedMathText text={item.correctT1Text} />
                              </div>
                            </div>
                          </div>

                          {/* Kunci Tier 2 */}
                          <div className="pt-2 border-t border-blue-200/60">
                            <span className="text-purple-800 block text-[10px] mb-1 font-medium">
                              Alasan Ilmiah Benar Tingkat 2:
                            </span>
                            <div className="flex items-start gap-2">
                              <span className="px-2 py-0.5 rounded bg-purple-100 border border-purple-300 text-purple-900 font-mono font-bold text-xs shrink-0">
                                {item.correctT2}
                              </span>
                              <div className="text-slate-900 font-medium leading-relaxed overflow-x-auto max-w-full">
                                <FormattedMathText text={item.correctT2Text} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Teacher Explanation Card */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center gap-1.5 text-slate-900 font-bold">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        <span>Pembahasan Lengkap & Konsep Ilmiah Guru:</span>
                      </div>
                      <div className="text-slate-700 leading-relaxed overflow-x-auto max-w-full">
                        <FormattedMathText text={item.question.explanation} />
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Footer Information & Bottom Call-to-Action */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-3 shadow-sm print:hidden">
        <h4 className="text-sm font-bold text-slate-900">Selesai Membaca Hasil & Pembahasan?</h4>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Tautan halaman hasil ini dapat Anda simpan atau buka kembali di perangkat lain selama asesmen masih dibuka oleh guru.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isCopied ? "Tautan Tersalin!" : "Salin Tautan Refleksi"}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-sm transition-colors flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Simpan PDF / Cetak</span>
          </button>
        </div>
      </div>
    </div>
  );
};
