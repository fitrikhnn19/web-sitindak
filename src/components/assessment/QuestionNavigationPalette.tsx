"use client";

import React from "react";
import {
  ClipboardList,
} from "lucide-react";
import { ThreeTierQuestion, StudentAnswer } from "@/lib/assessment-mock-data";

interface QuestionNavigationPaletteProps {
  questions: ThreeTierQuestion[];
  currentIndex: number;
  answers: Record<string, StudentAnswer>;
  onSelectQuestion: (index: number) => void;
  onOpenReview: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const QuestionNavigationPalette: React.FC<QuestionNavigationPaletteProps> = ({
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
  onOpenReview,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const totalQuestions = questions.length;

  // Calculate status for each question
  const getQuestionStatus = (q: ThreeTierQuestion) => {
    const ans = answers[q.id];
    if (!ans) return "empty";
    const hasTier1 = Boolean(ans.tier1Answer);
    const hasTier2 = Boolean(ans.tier2Answer);
    const hasTier3 = Boolean(ans.tier3Confidence);

    if (hasTier1 && hasTier2 && hasTier3) return "complete";
    if (hasTier1 || hasTier2 || hasTier3) return "partial";
    return "empty";
  };

  const completeCount = questions.filter(
    (q) => getQuestionStatus(q) === "complete"
  ).length;

  return (
    <div className="w-full">
      {/* Desktop / Static Sidebar Panel */}
      <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Kisi Nomor Soal
            </h4>
            <p className="text-[11px] text-slate-500">
              {completeCount} dari {totalQuestions} butir lengkap
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {Math.round((completeCount / totalQuestions) * 100)}%
            </span>
          </div>
        </div>

        {/* Status Legend */}
        <div className="grid grid-cols-3 gap-1 mb-4 text-[11px] text-slate-600 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Lengkap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Parsial</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span>Belum</span>
          </div>
        </div>

        {/* Question Grid Buttons */}
        <div className="grid grid-cols-5 gap-2">
          {questions.map((q, idx) => {
            const status = getQuestionStatus(q);
            const isCurrent = idx === currentIndex;

            let badgeColor = "bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-100";
            if (status === "complete") {
              badgeColor = "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold";
            } else if (status === "partial") {
              badgeColor = "bg-amber-50 border-amber-300 text-amber-900 font-bold";
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  onSelectQuestion(idx);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`h-10 rounded-lg font-mono text-xs transition-all relative flex items-center justify-center border ${badgeColor} ${isCurrent
                    ? "ring-2 ring-blue-600 border-blue-600 font-bold scale-105 z-10 shadow-xs"
                    : ""
                  }`}
              >
                <span>{idx + 1}</span>
                {status === "complete" && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-600" />
                )}
                {status === "partial" && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Review Shortcut Button */}
        <div className="mt-5 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onOpenReview}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <span>Review & Kirim Jawaban</span>
          </button>
        </div>
      </div>
    </div>
  );
};
