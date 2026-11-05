"use client";

import React, { useState } from "react";
import {
  X,
  Smartphone,
  Laptop,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  ShieldCheck,
  Check,
} from "lucide-react";
import { QuestionBankItem } from "@/lib/question-bank-store";
import { FormattedMathText } from "@/components/assessment/FormattedMathText";

interface StudentQuestionPreviewModalProps {
  question: QuestionBankItem;
  isOpen: boolean;
  onClose: () => void;
}

export const StudentQuestionPreviewModal: React.FC<StudentQuestionPreviewModalProps> = ({
  question,
  isOpen,
  onClose,
}) => {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [showTeacherGuide, setShowTeacherGuide] = useState(true);

  // Simulated student interactions
  const [selectedT1, setSelectedT1] = useState<"A" | "B" | "C" | "D" | "E" | null>(null);
  const [selectedT2, setSelectedT2] = useState<"A" | "B" | "C" | "D" | "E" | null>(null);
  const [selectedT3, setSelectedT3] = useState<"yakin" | "tidak yakin" | null>(null);

  if (!isOpen) return null;

  const t1Keys: ("A" | "B" | "C" | "D" | "E")[] = ["A", "B", "C", "D", "E"];
  const t2Keys: ("A" | "B" | "C" | "D" | "E")[] = ["A", "B", "C", "D", "E"];

  // Evaluate simulated student conception
  const isT1Correct = selectedT1 === question.tier1Options.correctOption;
  const isT2Correct = selectedT2 === question.tier2Options.correctOption;
  const hasAnsweredAll = selectedT1 !== null && selectedT2 !== null && selectedT3 !== null;

  let diagnosisText = "";
  let diagnosisColor = "";
  if (hasAnsweredAll) {
    if (selectedT3 === "yakin") {
      if (isT1Correct && isT2Correct) {
        diagnosisText = "Paham Konsep Utuh (Scientific Conception)";
        diagnosisColor = "text-emerald-900 bg-emerald-50 border-emerald-200";
      } else {
        diagnosisText = "Miskonsepsi (Misconception)";
        diagnosisColor = "text-rose-900 bg-rose-50 border-rose-200";
      }
    } else {
      if (isT1Correct && isT2Correct) {
        diagnosisText = "Kurang Percaya Diri (Lack of Confidence)";
        diagnosisColor = "text-amber-900 bg-amber-50 border-amber-200";
      } else {
        diagnosisText = "Belum Paham / Menebak (No Conception / Lucky Guess)";
        diagnosisColor = "text-amber-900 bg-amber-50 border-amber-200";
      }
    }
  }

  const handleResetSim = () => {
    setSelectedT1(null);
    setSelectedT2(null);
    setSelectedT3(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden my-auto">

        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Pratinjau Layar Siswa
              </span>
              <span className="text-xs text-slate-700 font-semibold">
                {question.title || "Soal Tiga Tingkat"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Simulasi tampilan butir soal tiga tingkat saat dikerjakan oleh siswa di asesmen online.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Switcher */}
            <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setDevice("desktop")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all ${device === "desktop"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Laptop</span>
              </button>
              <button
                type="button"
                onClick={() => setDevice("mobile")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md flex items-center gap-1.5 transition-all ${device === "mobile"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Layar HP</span>
              </button>
            </div>

            {/* Toggle Teacher Guide */}
            <button
              type="button"
              onClick={() => setShowTeacherGuide(!showTeacherGuide)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${showTeacherGuide
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              {showTeacherGuide ? "Kunci Guru: Aktif" : "Kunci Guru: Sembunyi"}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
          <div
            className={`mx-auto transition-all duration-300 ${device === "mobile"
              ? "max-w-[390px] border-4 border-slate-300 rounded-[36px] p-4 bg-slate-50 shadow-lg relative"
              : "max-w-3xl"
              }`}
          >
            {/* Phone Notch Mockup when mobile */}
            {device === "mobile" && (
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 text-[10px] text-slate-500 font-medium">
                <span className="font-bold text-slate-900">09:41</span>
                <div className="w-20 h-4 bg-slate-200 rounded-full mx-auto" />
                <span>4G 100%</span>
              </div>
            )}

            {/* Question Header */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs mb-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                  Butir Soal Diagnostik
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Materi Prasyarat: <strong className="text-slate-800">{question.prerequisiteTopic}</strong>
                </span>
              </div>

              {/* Tier 1 Question Text */}
              <div className="text-sm sm:text-base font-medium text-slate-900 leading-relaxed mt-2">
                <FormattedMathText text={question.tier1Question} />
              </div>

              {/* Graphic / Svg Diagram */}
              {(question.svgDiagram || question.imageUrl) && (
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-center">
                  {question.svgDiagram ? (
                    <div
                      className="w-full max-w-[280px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto"
                      dangerouslySetInnerHTML={{ __html: question.svgDiagram }}
                    />
                  ) : question.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={question.imageUrl}
                      alt="Diagram Soal"
                      className="max-h-52 max-w-full rounded-md object-contain"
                    />
                  ) : null}
                </div>
              )}
            </div>

            {/* TIER 1: Pilihan Jawaban A-E */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs mb-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[11px] font-bold">
                    1
                  </span>
                  <span>Tingkat 1: Pilihan Jawaban</span>
                </h5>
                {showTeacherGuide && (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Kunci Guru: {question.tier1Options.correctOption}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {t1Keys.map((key) => {
                  const text = question.tier1Options[key];
                  const isSelected = selectedT1 === key;
                  const isTeacherCorrect = showTeacherGuide && question.tier1Options.correctOption === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedT1(key)}
                      className={`w-full p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${isSelected
                        ? "bg-blue-50 border-blue-500 text-blue-900 shadow-xs ring-1 ring-blue-500"
                        : isTeacherCorrect
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${isSelected
                          ? "bg-blue-600 text-white"
                          : isTeacherCorrect
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {key}
                      </span>
                      <span className="text-xs sm:text-sm pt-0.5 leading-relaxed flex-1">
                        <FormattedMathText text={text} />
                      </span>
                      {isTeacherCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider self-center px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                          Kunci Benar
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TIER 2: Alasan Memilih Jawaban A-E */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs mb-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[11px] font-bold">
                    2
                  </span>
                  <span>Tingkat 2: Alasan Memilih Jawaban</span>
                </h5>
                {showTeacherGuide && (
                  <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Kunci Alasan: {question.tier2Options.correctOption}
                  </span>
                )}
              </div>

              <div className="text-xs sm:text-sm font-medium text-slate-800 mb-3">
                <FormattedMathText text={question.tier2Question} />
              </div>

              <div className="space-y-2">
                {t2Keys.map((key) => {
                  const text = question.tier2Options[key];
                  const isSelected = selectedT2 === key;
                  const isTeacherCorrect = showTeacherGuide && question.tier2Options.correctOption === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedT2(key)}
                      className={`w-full p-3 rounded-lg border text-left transition-all flex items-start gap-3 ${isSelected
                        ? "bg-amber-50 border-amber-500 text-amber-900 shadow-xs ring-1 ring-amber-500"
                        : isTeacherCorrect
                          ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                          : "bg-white border-slate-200 text-slate-800 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center shrink-0 transition-colors ${isSelected
                          ? "bg-amber-600 text-white"
                          : isTeacherCorrect
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-100 text-slate-700"
                          }`}
                      >
                        {key}
                      </span>
                      <span className="text-xs sm:text-sm pt-0.5 leading-relaxed flex-1">
                        <FormattedMathText text={text} />
                      </span>
                      {isTeacherCorrect && (
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider self-center px-2 py-0.5 rounded bg-emerald-100 border border-emerald-200">
                          Alasan Benar
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TIER 3: Ajakan Keyakinan */}
            <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs mb-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-bold">
                    3
                  </span>
                  <span>Tingkat 3: Derajat Keyakinan</span>
                </h5>
                <span className="text-[10px] text-slate-500 font-medium">
                  (Tanpa Opsi A-E & Tanpa Kunci)
                </span>
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-800 mb-3">
                {question.tier3Prompt}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedT3("yakin")}
                  className={`py-2.5 px-4 rounded-lg border text-center font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${selectedT3 === "yakin"
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                    : "bg-white border-slate-300 text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
                    }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Yakin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedT3("tidak yakin")}
                  className={`py-2.5 px-4 rounded-lg border text-center font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${selectedT3 === "tidak yakin"
                    ? "bg-amber-600 border-amber-600 text-white shadow-sm"
                    : "bg-white border-slate-300 text-slate-700 hover:border-amber-400 hover:text-amber-700"
                    }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Tidak Yakin</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Result Simulation Box */}
            {hasAnsweredAll && (
              <div className={`p-4 rounded-xl border ${diagnosisColor} mb-4 animate-in fade-in duration-200 shadow-xs`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Hasil Analisis Diagnostik Otomatis Siswa:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetSim}
                    className="text-[11px] underline font-medium hover:opacity-80"
                  >
                    Reset Simulasi
                  </button>
                </div>
                <p className="text-base font-bold">{diagnosisText}</p>
                <div className="text-xs mt-2 space-y-1 opacity-90 font-medium">
                  <p>• Pilihan Jawaban T1: <strong>{selectedT1}</strong> ({isT1Correct ? "Benar" : "Salah"})</p>
                  <p>• Pilihan Alasan T2: <strong>{selectedT2}</strong> ({isT2Correct ? "Benar" : "Salah"})</p>
                  <p>• Keyakinan T3: <strong className="capitalize">{selectedT3}</strong></p>
                </div>
              </div>
            )}

            {/* Teacher's Explanation Preview */}
            {question.explanation && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span>Pembahasan Guru & Bahan Refleksi Siswa:</span>
                </div>
                <div className="text-slate-700 leading-relaxed">
                  <FormattedMathText text={question.explanation} />
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500 font-medium">
            Kombinasi 3 tingkat membedakan <strong>Paham Konsep</strong>, <strong>Miskonsepsi</strong>, dan <strong>Belum Paham</strong> secara presisi.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
          >
            Tutup Pratinjau
          </button>
        </div>

      </div>
    </div>
  );
};
