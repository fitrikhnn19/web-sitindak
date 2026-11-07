"use client";

import React from "react";
import {
  CheckCircle2,
  HelpCircle,
  Lock,
  ArrowDown,
  ShieldCheck,
} from "lucide-react";
import { ThreeTierQuestion, StudentAnswer } from "@/lib/assessment-mock-data";
import { FormattedMathText } from "./FormattedMathText";

interface ThreeTierQuestionCardProps {
  question: ThreeTierQuestion;
  currentAnswer?: StudentAnswer;
  onAnswerChange: (answer: StudentAnswer) => void;
}

export const ThreeTierQuestionCard: React.FC<ThreeTierQuestionCardProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
}) => {
  const selectedTier1 = currentAnswer?.tier1Answer;
  const selectedTier2 = currentAnswer?.tier2Answer;
  const selectedTier3 = currentAnswer?.tier3Confidence;

  // Prerequisites check for strictly enforced 3-tier sequence:
  const isTier2Unlocked = Boolean(selectedTier1);
  const isTier3Unlocked = Boolean(selectedTier1 && selectedTier2);

  const handleSelectTier1 = (key: "A" | "B" | "C" | "D" | "E") => {
    onAnswerChange({
      questionId: question.id,
      tier1Answer: key,
      tier2Answer: selectedTier2,
      tier3Confidence: selectedTier3,
    });
  };

  const handleSelectTier2 = (key: "A" | "B" | "C" | "D" | "E") => {
    if (!isTier2Unlocked) return;
    onAnswerChange({
      questionId: question.id,
      tier1Answer: selectedTier1,
      tier2Answer: key,
      tier3Confidence: selectedTier3,
    });
  };

  const handleSelectTier3 = (confidence: "yakin" | "tidak yakin") => {
    if (!isTier3Unlocked) return;
    onAnswerChange({
      questionId: question.id,
      tier1Answer: selectedTier1,
      tier2Answer: selectedTier2,
      tier3Confidence: confidence,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Question Header & Stem */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 font-bold text-xs sm:text-sm border border-blue-200">
              Soal #{question.number}
            </span>
            <span className="text-xs text-slate-600 font-medium">
              {question.topic}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
              Prasyarat: {question.prerequisiteTopic}
            </span>
          </div>
        </div>

        {/* Question Text */}
        <div className="text-sm sm:text-base text-slate-900 font-medium leading-relaxed mb-3">
          <FormattedMathText text={question.tier1Question} />
        </div>

        {/* Optional Geometric Diagram or Image */}
        {(question.tier1SvgDiagram || (question as any).svgDiagram || question.imageUrl) && (
          <div className="my-4 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-x-auto">
            {(question.tier1SvgDiagram || (question as any).svgDiagram) ? (
              <div
                className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
                dangerouslySetInnerHTML={{
                  __html: (question.tier1SvgDiagram || (question as any).svgDiagram) as string,
                }}
              />
            ) : question.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={question.imageUrl}
                alt="Diagram Soal"
                className="max-h-64 max-w-full rounded-lg object-contain shadow-xs"
              />
            ) : null}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TIER 1: PILIHAN JAWABAN (A, B, C, D, E)                  */}
      {/* ======================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Tingkat 1: Pilihan Jawaban
              </h3>
              <p className="text-[11px] text-slate-500">
                Pilih tepat satu opsi jawaban konsep (A–E)
              </p>
            </div>
          </div>
          {selectedTier1 ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dipilih: {selectedTier1}</span>
            </span>
          ) : (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
              Wajib diisi
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {question.tier1Options.map((opt) => {
            const isSelected = selectedTier1 === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleSelectTier1(opt.key)}
                className={`w-full p-3.5 sm:p-4 rounded-xl text-left transition-all flex items-start gap-3.5 group cursor-pointer ${
                  isSelected
                    ? "bg-blue-50/80 border-2 border-blue-600 text-slate-900 shadow-xs ring-1 ring-blue-500/20"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
                  }`}
                >
                  {opt.key}
                </span>
                <span className="text-xs sm:text-sm font-medium pt-0.5 leading-snug flex-1">
                  <FormattedMathText text={opt.text} />
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Subtle note when Tier 1 is not yet answered */}
        {!isTier2Unlocked && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Pilih salah satu jawaban di atas untuk membuka pertanyaan alasan pada Tingkat 2.</span>
          </div>
        )}
      </div>

      {/* Downward indicator between Tier 1 and Tier 2 */}
      <div className="flex items-center justify-center">
        {isTier2Unlocked ? (
          <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[11px] text-blue-700 font-semibold shadow-2xs animate-in fade-in duration-200">
            <ArrowDown className="w-3.5 h-3.5 text-blue-600" />
            <span>Lanjut ke Tingkat 2 (Alasan Memilih)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-500 font-medium">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>Tingkat 2 Terkunci</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TIER 2: ALASAN MEMILIH (A, B, C, D, E)                    */}
      {/* Pertanyaan dan opsi HANYA ditampilkan jika Tier 1 sudah  */}
      {/* dijawab. Jika belum, tampilkan status terkunci tanpa isi. */}
      {/* ======================================================== */}
      {!isTier2Unlocked ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 sm:p-8 text-center transition-all">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mb-3 border border-slate-200/80 shadow-2xs">
            <Lock className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-800">
            Tingkat 2: Pertanyaan Alasan Terkunci
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
            Pertanyaan dan pilihan alasan belum ditampilkan. Silakan pilih salah satu opsi jawaban pada <strong>Tingkat 1</strong> di atas terlebih dahulu untuk membukanya.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-300 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Tingkat 2: Alasan Memilih Jawaban
                </h3>
                <p className="text-[11px] text-slate-500">
                  Pilih alasan ilmiah/matematis yang mendasari jawaban Tingkat 1 Anda
                </p>
              </div>
            </div>
            {selectedTier2 ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />
                <span>Alasan: {selectedTier2}</span>
              </span>
            ) : (
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                Wajib diisi
              </span>
            )}
          </div>

          <div className="text-xs sm:text-sm text-slate-800 font-medium mb-3.5 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-150">
            <FormattedMathText text={question.tier2Question} />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {question.tier2Options.map((opt) => {
              const isSelected = selectedTier2 === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => handleSelectTier2(opt.key)}
                  className={`w-full p-3.5 sm:p-4 rounded-xl text-left transition-all flex items-start gap-3.5 group cursor-pointer ${
                    isSelected
                      ? "bg-purple-50/80 border-2 border-purple-600 text-slate-900 shadow-xs ring-1 ring-purple-500/20"
                      : "bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                      isSelected
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-slate-700 group-hover:bg-slate-200"
                    }`}
                  >
                    {opt.key}
                  </span>
                  <span className="text-xs sm:text-sm font-medium pt-0.5 leading-snug flex-1">
                    <FormattedMathText text={opt.text} />
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Subtle note when Tier 2 is not yet answered */}
          {!isTier3Unlocked && (
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Pilih salah satu alasan di atas untuk membuka tingkat keyakinan pada Tingkat 3.</span>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TIER 3: TINGKAT KEYAKINAN (HANYA YAKIN / TIDAK YAKIN)     */}
      {/* Hanya dirender jika Tier 1 sudah dijawab. Pertanyaan dan */}
      {/* tombol HANYA muncul jika Tier 2 sudah dijawab.            */}
      {/* ======================================================== */}
      {isTier2Unlocked && (
        <>
          {/* Downward indicator between Tier 2 and Tier 3 */}
          <div className="flex items-center justify-center">
            {isTier3Unlocked ? (
              <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-[11px] text-purple-700 font-semibold shadow-2xs animate-in fade-in duration-200">
                <ArrowDown className="w-3.5 h-3.5 text-purple-600" />
                <span>Lanjut ke Tingkat 3 (Tingkat Keyakinan)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] text-slate-500 font-medium">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>Tingkat 3 Terkunci</span>
              </div>
            )}
          </div>

          {!isTier3Unlocked ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 sm:p-8 text-center transition-all animate-in fade-in duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mb-3 border border-slate-200/80 shadow-2xs">
                <Lock className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Tingkat 3: Derajat Keyakinan Terkunci
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto leading-relaxed">
                Pilihan keyakinan belum ditampilkan. Silakan pilih salah satu alasan ilmiah pada <strong>Tingkat 2</strong> di atas terlebih dahulu untuk membukanya.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-200 p-5 sm:p-7 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-300 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      Tingkat 3: Tingkat Keyakinan
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Pilih keyakinan Anda (Hanya pilihan Yakin atau Tidak Yakin)
                    </p>
                  </div>
                </div>
                {selectedTier3 ? (
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md border flex items-center gap-1 ${
                      selectedTier3 === "yakin"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : "bg-amber-50 text-amber-800 border-amber-200"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="capitalize">{selectedTier3}</span>
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                    Wajib diisi
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm text-slate-800 font-medium mb-3.5 leading-relaxed bg-slate-50/70 p-3.5 rounded-xl border border-slate-150">
                <FormattedMathText text={question.tier3Prompt} />
              </div>

              {/* Exactly TWO Buttons: Yakin vs Tidak Yakin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectTier3("yakin")}
                  className={`p-4 sm:p-5 rounded-xl text-center font-bold text-sm sm:text-base transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                    selectedTier3 === "yakin"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-500 ring-offset-1"
                      : "bg-white border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span>YAKIN</span>
                  </div>
                  <span className={`text-[11px] font-normal ${selectedTier3 === "yakin" ? "text-emerald-100" : "text-slate-500"}`}>
                    Saya yakin jawaban tingkat 1 dan alasan tingkat 2 benar
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectTier3("tidak yakin")}
                  className={`p-4 sm:p-5 rounded-xl text-center font-bold text-sm sm:text-base transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer border ${
                    selectedTier3 === "tidak yakin"
                      ? "bg-amber-600 text-white border-amber-600 shadow-sm ring-2 ring-amber-500 ring-offset-1"
                      : "bg-white border-slate-200 text-slate-700 hover:border-amber-500 hover:text-amber-700 hover:bg-amber-50/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    <span>TIDAK YAKIN</span>
                  </div>
                  <span className={`text-[11px] font-normal ${selectedTier3 === "tidak yakin" ? "text-amber-100" : "text-slate-500"}`}>
                    Saya masih ragu-ragu atau menebak pilihan di atas
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Completion pill when all 3 tiers are answered */}
          {selectedTier1 && selectedTier2 && selectedTier3 && (
            <div className="p-3.5 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2.5 font-medium">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>
                  Soal <strong>#{question.number}</strong> telah lengkap dijawab di semua tingkat!
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                Lengkap 3 Tingkat ✓
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
