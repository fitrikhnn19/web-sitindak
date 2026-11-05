"use client";

import React, { useState } from "react";
import {
  X,
  Link2,
  CheckCircle2,
  Clock,
  Check,
} from "lucide-react";
import {
  QuestionBankItem,
  AVAILABLE_ASSESSMENTS,
  linkQuestionsToAssessment,
} from "@/lib/question-bank-store";

interface LinkToAssessmentModalProps {
  selectedQuestions: QuestionBankItem[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LinkToAssessmentModal: React.FC<LinkToAssessmentModalProps> = ({
  selectedQuestions,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedAssessmentCode, setSelectedAssessmentCode] = useState(
    AVAILABLE_ASSESSMENTS[0]?.code || "GEO-IXA"
  );
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const targetAssessment = AVAILABLE_ASSESSMENTS.find(
    (a) => a.code === selectedAssessmentCode
  );

  const estimatedDurationMinutes = selectedQuestions.length * 3;

  const handleLink = () => {
    const questionIds = selectedQuestions.map((q) => q.id);
    linkQuestionsToAssessment(selectedAssessmentCode, questionIds);
    setIsSubmitted(true);
    setTimeout(() => {
      onSuccess();
      onClose();
      setIsSubmitted(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tautkan Soal ke Asesmen Kelas
              </h3>
              <p className="text-xs text-slate-500">
                Gunakan ulang butir soal tiga tingkat langsung tanpa menyalin ulang isi soal.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!isSubmitted ? (
            <>
              {/* Selected Questions Summary Banner */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                    Kumpulan Soal Terpilih:
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {selectedQuestions.length} Butir Soal Tiga Tingkat
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-700 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Est. {estimatedDurationMinutes} Menit</span>
                  </div>
                </div>
              </div>

              {/* Assessment Target Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Pilih Asesmen & Kelas Target:
                </label>
                <div className="space-y-2">
                  {AVAILABLE_ASSESSMENTS.map((asm) => {
                    const isSelected = selectedAssessmentCode === asm.code;
                    return (
                      <div
                        key={asm.id}
                        onClick={() => setSelectedAssessmentCode(asm.code)}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-50 border-blue-500 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">
                              {asm.title}
                            </span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                              {asm.code}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {asm.className} • Saat ini memiliki {asm.questionCount} butir soal
                          </p>
                        </div>

                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* List of Ordered Questions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Daftar Soal yang Akan Ditautkan:
                </label>
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
                  {selectedQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-3 text-xs shadow-xs"
                    >
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <div className="flex-1 truncate">
                        <p className="font-semibold text-slate-900 truncate">{q.title}</p>
                        <p className="text-[11px] text-slate-500 truncate">
                          Prasyarat: {q.prerequisiteTopic}
                        </p>
                      </div>
                      <span className="text-[11px] text-blue-700 shrink-0 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        Kunci: {q.tier1Options.correctOption} & {q.tier2Options.correctOption}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-8 text-center space-y-4 animate-in fade-in duration-200">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Berhasil Ditautkan ke Asesmen!
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {selectedQuestions.length} butir soal tiga tingkat telah berhasil ditautkan ke{" "}
                  <strong>{targetAssessment?.title}</strong> ({targetAssessment?.className}).
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isSubmitted && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleLink}
              disabled={selectedQuestions.length === 0}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all disabled:opacity-50"
            >
              <Link2 className="w-4 h-4" />
              <span>Tautkan Sekarang ({selectedQuestions.length} Soal)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
