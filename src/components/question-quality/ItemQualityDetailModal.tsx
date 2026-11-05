"use client";

import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Target,
  BookOpen,
  Info,
  Check,
} from "lucide-react";
import {
  QuestionQualityItem,
} from "@/lib/question-quality-analysis";
import {
  MOCK_QUESTIONS,
  ThreeTierQuestion,
} from "@/lib/assessment-mock-data";
import { MOCK_QUESTION_ID_MAP } from "@/lib/assessment-management-store";
import { FormattedMathText } from "@/components/assessment/FormattedMathText";

interface ItemQualityDetailModalProps {
  questionId: string | null;
  items: QuestionQualityItem[];
  onClose: () => void;
  onSelectQuestion: (questionId: string) => void;
}

export const ItemQualityDetailModal: React.FC<ItemQualityDetailModalProps> = ({
  questionId,
  items,
  onClose,
  onSelectQuestion,
}) => {
  const [activeTab, setActiveTab] = useState<"soal" | "distraktor" | "rekomendasi">("soal");

  if (!questionId) return null;

  const currentItemIndex = items.findIndex((it) => it.questionId === questionId);
  const analysis = items[currentItemIndex] || items[0];
  const question: ThreeTierQuestion | undefined =
    MOCK_QUESTIONS.find((q) => q.id === analysis.questionId) ||
    MOCK_QUESTIONS.find((q) => MOCK_QUESTION_ID_MAP[q.id] === analysis.questionId) ||
    MOCK_QUESTIONS.find((q) => q.number === analysis.questionNumber);

  if (!question) return null;

  const hasPrev = currentItemIndex > 0;
  const hasNext = currentItemIndex < items.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onSelectQuestion(items[currentItemIndex - 1].questionId);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onSelectQuestion(items[currentItemIndex + 1].questionId);
    }
  };

  const isProblematic = analysis.flag === "perlu diperbaiki";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[94vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden text-slate-900">
        
        {/* Modal Top Header with Context Preservation & Quick Navigation */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 font-mono shadow-xs ${
                isProblematic
                  ? "bg-amber-100 text-amber-900 border border-amber-300"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-200"
              }`}
            >
              Q{analysis.questionNumber}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  {analysis.title}
                </h3>
                {isProblematic ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Perlu Diperbaiki
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Layak Pakai
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Materi Prasyarat: <strong className="text-slate-800">{analysis.prerequisiteTopic}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Prev / Next buttons */}
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={handlePrev}
                disabled={!hasPrev}
                className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Butir Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono px-2 text-slate-600 font-bold">
                {currentItemIndex + 1}/{items.length}
              </span>
              <button
                onClick={handleNext}
                disabled={!hasNext}
                className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Butir Berikutnya"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Kembali ke Daftar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Metric Quick Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>Kesukaran:</span>
              <strong className="text-slate-900 font-mono">{analysis.difficultyIndex.toFixed(2)}</strong>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-700">
                {analysis.difficultyLabel}
              </span>
            </span>

            <span className="flex items-center gap-1.5 text-slate-700">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Daya Pembeda:</span>
              <strong className="text-slate-900 font-mono">{analysis.discriminationIndex.toFixed(2)}</strong>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-700">
                {analysis.discriminationLabel}
              </span>
            </span>

            <span className="flex items-center gap-1.5 text-slate-700">
              <Check className="w-3.5 h-3.5 text-blue-600" />
              <span>Validitas:</span>
              <strong className="text-slate-900 font-mono">{analysis.validityValue.toFixed(2)}</strong>
              <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-700">
                {analysis.validityLabel}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab("soal")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === "soal"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Naskah Soal 3-Tier
            </button>
            <button
              onClick={() => setActiveTab("distraktor")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === "distraktor"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Analisis Pengecoh
            </button>
            <button
              onClick={() => setActiveTab("rekomendasi")}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                activeTab === "rekomendasi"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Saran Perbaikan
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: NASKAH SOAL TIGA TINGKAT */}
          {activeTab === "soal" && (
            <div className="space-y-5">
              {/* Tingkat 1: Pertanyaan Utama */}
              <div className="rounded-xl bg-slate-50/70 border border-slate-200 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    Tingkat 1: Pertanyaan Konseptual
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Pilihan Ganda A–E</span>
                </div>

                <div className="text-sm text-slate-900 leading-relaxed font-medium">
                  <FormattedMathText text={question.tier1Question} />
                </div>

                {/* Optional SVG Diagram */}
                {question.tier1SvgDiagram && (
                  <div
                    className="p-3 bg-white rounded-lg border border-slate-200 text-center my-3"
                    dangerouslySetInnerHTML={{ __html: question.tier1SvgDiagram }}
                  />
                )}

                {/* Options A-E */}
                <div className="space-y-2 pt-1">
                  {question.tier1Options.map((opt) => (
                    <div
                      key={opt.key}
                      className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                        opt.isCorrect
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md font-bold flex items-center justify-center shrink-0 text-xs font-mono ${
                          opt.isCorrect
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {opt.key}
                      </span>
                      <div className="flex-1">
                        <FormattedMathText text={opt.text} />
                        {opt.isCorrect && (
                          <span className="ml-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                            Kunci Jawaban Benar
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tingkat 2: Pertanyaan Alasan */}
              <div className="rounded-xl bg-slate-50/70 border border-slate-200 p-4 sm:p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Tingkat 2: Alasan Memilih Jawaban
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">Pilihan Alasan A–E</span>
                </div>

                <div className="text-sm text-slate-900 leading-relaxed font-medium">
                  <FormattedMathText text={question.tier2Question} />
                </div>

                <div className="space-y-2 pt-1">
                  {question.tier2Options.map((opt) => (
                    <div
                      key={opt.key}
                      className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-3 transition-colors ${
                        opt.isCorrect
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : "bg-white border-slate-200 text-slate-800"
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md font-bold flex items-center justify-center shrink-0 text-xs font-mono ${
                          opt.isCorrect
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {opt.key}
                      </span>
                      <div className="flex-1">
                        <FormattedMathText text={opt.text} />
                        {opt.isCorrect && (
                          <span className="ml-2 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                            Alasan Benar
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tingkat 3: Keyakinan Siswa */}
              <div className="rounded-xl bg-slate-50/70 border border-slate-200 p-4 sm:p-5 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-500" />
                  Tingkat 3: Tingkat Keyakinan Siswa
                </span>
                <p className="text-xs text-slate-700 font-medium">
                  {question.tier3Prompt}
                </p>
                <div className="flex items-center gap-3 pt-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex-1 shadow-xs">
                    <span className="text-slate-500 font-medium">Siswa Yakin:</span>
                    <strong className="block text-emerald-700 text-base font-mono">
                      {analysis.confidenceStats.yakinRate}%
                    </strong>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 flex-1 shadow-xs">
                    <span className="text-slate-500 font-medium">Siswa Tidak Yakin / Ragu:</span>
                    <strong className="block text-slate-700 text-base font-mono">
                      {analysis.confidenceStats.tidakYakinRate}%
                    </strong>
                  </div>
                </div>
              </div>

              {/* Pembahasan Guru */}
              <div className="rounded-xl bg-blue-50/60 border border-blue-200 p-4 text-xs text-slate-800 space-y-2">
                <span className="font-bold text-blue-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Kunci Pembahasan Lengkap:</span>
                </span>
                <div className="leading-relaxed">
                  <FormattedMathText text={question.explanation} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANALISIS EFEKTIVITAS PENGECOH */}
          {activeTab === "distraktor" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-700 space-y-2">
                <span className="font-bold text-blue-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Prinsip Analisis Pengecoh (Distraktor):</span>
                </span>
                <p className="leading-relaxed">
                  Pengecoh yang baik dipilih oleh siswa <strong>kelompok bawah</strong> yang belum paham, dan <strong>dihindari oleh kelompok atas</strong> yang sudah paham. Jika suatu pengecoh 0% dipilih, opsi tersebut dianggap tidak berfungsi.
                </p>
              </div>

              {/* Distraktor Tingkat 1 */}
              <div className="rounded-xl bg-slate-50/70 border border-slate-200 p-4 sm:p-5 space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>Pola Pemilihan Opsi Tingkat 1 (Jawaban A–E)</span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Kelompok Atas ({analysis.upperGroupTotal}) vs Bawah ({analysis.lowerGroupTotal})
                  </span>
                </h4>

                <div className="space-y-3">
                  {analysis.tier1Distractors.map((d) => (
                    <div
                      key={d.key}
                      className={`p-3 rounded-lg border space-y-2 ${
                        d.isCorrect
                          ? "bg-emerald-50/70 border-emerald-300"
                          : d.selectionRate === 0
                          ? "bg-rose-50/70 border-rose-200"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-xs font-mono ${
                              d.isCorrect
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {d.key}
                          </span>
                          <span className="text-xs text-slate-900 font-medium">
                            <FormattedMathText text={d.text} />
                          </span>
                        </div>

                        <div className="text-right whitespace-nowrap">
                          <span className="text-xs font-bold text-slate-900 font-mono">
                            {d.totalSelected} siswa ({d.selectionRate}%)
                          </span>
                        </div>
                      </div>

                      {/* Bar Komparasi Kelompok Atas vs Bawah */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                        <div>
                          <div className="flex justify-between text-slate-600">
                            <span>Kelompok Atas:</span>
                            <strong className="text-blue-700 font-mono font-bold">
                              {d.upperGroupSelected} ({d.upperGroupRate}%)
                            </strong>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-200 mt-1 overflow-hidden">
                            <div
                              className="h-full bg-blue-600"
                              style={{ width: `${d.upperGroupRate}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-slate-600">
                            <span>Kelompok Bawah:</span>
                            <strong className="text-slate-800 font-mono font-bold">
                              {d.lowerGroupSelected} ({d.lowerGroupRate}%)
                            </strong>
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-200 mt-1 overflow-hidden">
                            <div
                              className="h-full bg-slate-500"
                              style={{ width: `${d.lowerGroupRate}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Catatan Status Distraktor */}
                      <p
                        className={`text-[11px] font-semibold pt-1 ${
                          d.isCorrect
                            ? "text-emerald-700"
                            : d.selectionRate === 0
                            ? "text-rose-700"
                            : "text-slate-600"
                        }`}
                      >
                        • {d.distractorNote}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distraktor Tingkat 2 (Alasan) */}
              <div className="rounded-xl bg-slate-50/70 border border-slate-200 p-4 sm:p-5 space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-amber-900">
                  Pola Pemilihan Alasan Tingkat 2 (Alasan A–E)
                </h4>

                <div className="space-y-3">
                  {analysis.tier2Distractors.map((d) => (
                    <div
                      key={d.key}
                      className={`p-3 rounded-lg border space-y-2 ${
                        d.isCorrect
                          ? "bg-emerald-50/70 border-emerald-300"
                          : "bg-white border-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-xs font-mono ${
                              d.isCorrect
                                ? "bg-emerald-600 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {d.key}
                          </span>
                          <span className="text-xs text-slate-900 font-medium">
                            <FormattedMathText text={d.text} />
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 font-mono whitespace-nowrap">
                          {d.totalSelected} siswa ({d.selectionRate}%)
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 font-medium">
                        • {d.distractorNote} (Dipilih {d.upperGroupSelected} siswa ranking atas vs {d.lowerGroupSelected} ranking bawah)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SARAN PERBAIKAN & TINDAK LANJUT GURU */}
          {activeTab === "rekomendasi" && (
            <div className="space-y-6">
              
              {/* Highlight Card */}
              <div
                className={`p-5 rounded-xl border space-y-3 ${
                  isProblematic
                    ? "bg-amber-50 border-amber-300 text-amber-900"
                    : "bg-emerald-50 border-emerald-300 text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  {isProblematic ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  <h4 className="text-base font-bold text-slate-900">
                    {isProblematic
                      ? "Butir Membutuhkan Revisi Sebelum Dipakai Kembali"
                      : "Butir Sudah Teruji & Layak Digunakan"}
                  </h4>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {analysis.suggestion}
                </p>
              </div>

              {/* Action checklist */}
              <div className="rounded-xl bg-slate-50/70 border border-slate-200 p-5 space-y-4">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>Daftar Tindak Lanjut Guru untuk Butir Ini:</span>
                </h4>

                <div className="space-y-3 text-xs sm:text-sm">
                  {analysis.issueTags.map((issue, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-white border border-slate-200 flex items-start gap-3 shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <strong className="text-slate-900 block">{issue}</strong>
                        <p className="text-slate-600 mt-0.5 text-xs">
                          {issue.includes("terlalu mudah")
                            ? "Tingkatkan kompleksitas stimulus atau berikan nilai koordinat pecahan/negatif agar siswa tidak sekadar menebak."
                            : issue.includes("terlalu sulit")
                            ? "Berikan jembatan skafolding pada materi prasyarat sebelum mengujikan transformasi lebih rumit."
                            : issue.includes("Pengecoh")
                            ? "Ganti opsi pengecoh yang mati dengan salah konsep umum yang kerap ditemukan saat latihan kelas."
                            : "Periksa kembali bahasa pada soal dan kunci jawaban di bank soal."}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pedagogical Classroom Implication */}
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-slate-800 space-y-1.5">
                <strong className="text-blue-900 block font-bold flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Implikasi ke Pembelajaran Kelas:
                </strong>
                <p className="leading-relaxed text-slate-700">
                  Pada butir ini, terdapat {analysis.miskonsepsiRate}% siswa mengalami miskonsepsi. Saat membahas soal ini di kelas, fokuskan pada klarifikasi alasan tingkat 2 daripada sekadar menyebutkan jawaban akhir tingkat 1.
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Modal Bottom Footer with Navigation Context */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Kembali ke Daftar Soal
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
            >
              &larr; Soal Sebelumnya
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-xs"
            >
              Soal Berikutnya &rarr;
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
