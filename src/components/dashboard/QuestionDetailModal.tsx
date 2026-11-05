"use client";

import React, { useState } from "react";
import {
  X,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import {
  MOCK_QUESTIONS,
} from "@/lib/assessment-mock-data";
import { MOCK_QUESTION_ID_MAP } from "@/lib/assessment-management-store";
import {
  ClassAssessmentSummary,
} from "@/lib/teacher-results-mock-data";
import { FormattedMathText } from "@/components/assessment/FormattedMathText";

interface QuestionDetailModalProps {
  questionId: string | null;
  summary: ClassAssessmentSummary;
  onClose: () => void;
  onViewStudentReport: (studentId: string) => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  questionId,
  summary,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"soal" | "pembahasan" | "distribusi">("soal");

  if (!questionId) return null;

  const itemStat = summary.itemAnalytics.find(
    (ia) => ia.questionId === questionId || `q-${ia.questionNumber}` === questionId
  );
  const question =
    MOCK_QUESTIONS.find((q) => q.id === questionId) ||
    MOCK_QUESTIONS.find((q) => MOCK_QUESTION_ID_MAP[q.id] === questionId) ||
    (itemStat ? MOCK_QUESTIONS.find((q) => q.number === itemStat.questionNumber) : undefined);

  if (!question || !itemStat) return null;

  // Categorize students for this question
  const studentsPaham: string[] = [];
  const studentsMiskonsepsi: string[] = [];
  const studentsBelumPaham: string[] = [];

  summary.students.forEach((s) => {
    const item = s.itemResults.find(
      (ir) => ir.questionId === questionId || (question && ir.questionNumber === question.number)
    );
    if (!item) return;
    if (item.status === "paham") studentsPaham.push(s.studentName);
    else if (item.status === "miskonsepsi") studentsMiskonsepsi.push(s.studentName);
    else studentsBelumPaham.push(s.studentName);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">

        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Butir Soal Q{question.number}
              </span>
              <span className="text-xs text-slate-500">
                Prasyarat: <strong className="text-slate-800">{question.prerequisiteTopic}</strong>
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {question.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-slate-50/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab("soal")}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${activeTab === "soal"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
          >
            Naskah Tiga Tingkat
          </button>
          <button
            onClick={() => setActiveTab("pembahasan")}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${activeTab === "pembahasan"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
          >
            Pembahasan & Kunci Jawaban
          </button>
          <button
            onClick={() => setActiveTab("distribusi")}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${activeTab === "distribusi"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
          >
            Distribusi Jawaban Siswa ({summary.completedCount})
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">

          {/* Quick Metrics Bar on top of modal */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] text-emerald-800 font-bold block">
                SUDAH PAHAM
              </span>
              <span className="text-xl font-black text-emerald-700">
                {itemStat.pahamRate}%
              </span>
              <span className="text-[10px] text-emerald-600 block font-medium">
                {itemStat.pahamCount} siswa
              </span>
            </div>

            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-[10px] text-amber-900 font-bold block">
                MISKONSEPSI
              </span>
              <span className="text-xl font-black text-amber-800">
                {itemStat.miskonsepsiRate}%
              </span>
              <span className="text-[10px] text-amber-700 block font-medium">
                {itemStat.miskonsepsiCount} siswa
              </span>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-600 font-bold block">
                BELUM PAHAM
              </span>
              <span className="text-xl font-black text-slate-800">
                {itemStat.belumPahamRate}%
              </span>
              <span className="text-[10px] text-slate-500 block font-medium">
                {itemStat.belumPahamCount} siswa
              </span>
            </div>
          </div>

          {activeTab === "soal" && (
            <div className="space-y-5">
              {/* Tingkat 1: Pertanyaan Jawaban */}
              <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Tingkat 1
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Pertanyaan Konseptual & Pilihan Jawaban
                  </span>
                </div>

                <div className="text-sm font-medium text-slate-900 leading-relaxed">
                  <FormattedMathText text={question.tier1Question} />
                </div>

                {/* Geometric diagram or image if any */}
                {(question.tier1SvgDiagram || (question as any).imageUrl) && (
                  <div className="p-3 rounded-lg bg-white border border-slate-200 flex justify-center">
                    {question.tier1SvgDiagram ? (
                      <div
                        className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
                        dangerouslySetInnerHTML={{ __html: question.tier1SvgDiagram }}
                      />
                    ) : (question as any).imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={(question as any).imageUrl}
                        alt="Diagram Soal"
                        className="max-h-52 max-w-full rounded-md object-contain"
                      />
                    ) : null}
                  </div>
                )}

                {/* Options A-E */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {question.tier1Options.map((opt) => (
                    <div
                      key={opt.key}
                      className={`p-2.5 rounded-lg border flex items-center gap-2.5 text-xs ${opt.isCorrect
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-white border-slate-200 text-slate-800"
                        }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md font-bold flex items-center justify-center text-xs ${opt.isCorrect
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {opt.key}
                      </span>
                      <span className="flex-1">
                        <FormattedMathText text={opt.text} />
                      </span>
                      {opt.isCorrect && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Kunci Benar
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tingkat 2: Alasan Memilih Jawaban */}
              <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    Tingkat 2
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    Alasan Matematis
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-800">
                  {question.tier2Question}
                </p>

                <div className="space-y-1.5 pt-1">
                  {question.tier2Options.map((opt) => (
                    <div
                      key={opt.key}
                      className={`p-2.5 rounded-lg border flex items-start gap-2.5 text-xs ${opt.isCorrect
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-white border-slate-200 text-slate-800"
                        }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-md font-bold flex items-center justify-center text-xs mt-0.5 ${opt.isCorrect
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {opt.key}
                      </span>
                      <span className="flex-1 leading-relaxed">
                        <FormattedMathText text={opt.text} />
                      </span>
                      {opt.isCorrect && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                          Kunci Alasan
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tingkat 3: Keyakinan */}
              <div className="p-3.5 rounded-xl bg-slate-50/60 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 mr-2">
                    Tingkat 3
                  </span>
                  <span className="text-xs text-slate-700 font-medium">
                    {question.tier3Prompt}
                  </span>
                </div>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                    Yakin
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-medium">
                    Tidak Yakin
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "pembahasan" && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2.5">
                <div className="flex items-center gap-2 text-blue-900 font-bold">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span>Pembahasan Guru & Konsep Matematis:</span>
                </div>
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  <FormattedMathText text={question.explanation} />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  Diagnostik Miskonsepsi Umum pada Soal ini:
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Siswa yang memilih opsi pengecoh dengan keyakinan tinggi biasanya terjebak pada:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-xs">
                  <li>Mengasumsikan perubahan tanda berlaku untuk sumbu yang salah.</li>
                  <li>Tertukar antara rotasi searah vs berlawanan arah jarum jam.</li>
                  <li>Menganggap dilatasi sebagai penjumlahan skalar alih-alih perkalian absis & ordinat.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "distribusi" && (
            <div className="space-y-5">
              {/* Distribution of Choices */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">
                  Distribusi Pilihan Siswa pada Tingkat 1 (Jawaban):
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {(["A", "B", "C", "D", "E"] as const).map((optKey) => {
                    const count = itemStat.tier1Distribution[optKey] || 0;
                    const pct = Math.round((count / itemStat.totalAnswered) * 100);
                    const isKey = question.tier1Options.find((o) => o.key === optKey)?.isCorrect;

                    return (
                      <div
                        key={optKey}
                        className={`p-3 rounded-lg border text-center ${isKey
                          ? "bg-emerald-50 border-emerald-300"
                          : "bg-white border-slate-200"
                          }`}
                      >
                        <span className={`font-bold text-sm block ${isKey ? "text-emerald-900" : "text-slate-900"}`}>
                          Opsi {optKey} {isKey && "✓"}
                        </span>
                        <span className="text-xs text-slate-600 block font-semibold">
                          {count} siswa
                        </span>
                        <span className="text-[10px] text-slate-400">
                          ({pct}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Categorized Students List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-xs">
                  Daftar Siswa Berdasarkan Status pada Butir Ini:
                </h4>

                {/* Siswa Miskonsepsi */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center justify-between text-amber-900 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      Miskonsepsi ({studentsMiskonsepsi.length} siswa)
                    </span>
                    <span className="text-[11px] font-normal text-amber-800">
                      Siswa yakin dengan konsep yang salah
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {studentsMiskonsepsi.length === 0 ? (
                      <span className="text-slate-400 italic text-[11px]">
                        Tidak ada siswa yang mengalami miskonsepsi pada butir ini.
                      </span>
                    ) : (
                      studentsMiskonsepsi.map((name) => (
                        <span
                          key={name}
                          className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-amber-900 text-[11px] font-medium"
                        >
                          {name}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Siswa Belum Paham */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-800 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                      Belum Paham / Ragu-ragu ({studentsBelumPaham.length} siswa)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {studentsBelumPaham.length === 0 ? (
                      <span className="text-slate-400 italic text-[11px]">
                        Semua siswa sudah paham atau memiliki keyakinan.
                      </span>
                    ) : (
                      studentsBelumPaham.map((name) => (
                        <span
                          key={name}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-300 text-slate-700 text-[11px] font-medium"
                        >
                          {name}
                        </span>
                      ))
                    )}
                  </div>
                </div>

                {/* Siswa Paham */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between text-emerald-900 font-bold text-xs">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Sudah Paham ({studentsPaham.length} siswa)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {studentsPaham.map((name) => (
                      <span
                        key={name}
                        className="px-2 py-0.5 rounded-md bg-white border border-emerald-300 text-emerald-800 text-[11px] font-medium"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-medium">
            SITINDAK Three-Tier Diagnostic System
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-xs"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
