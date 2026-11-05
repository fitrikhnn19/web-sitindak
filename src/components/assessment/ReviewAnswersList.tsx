"use client";

import React from "react";
import {
  ArrowLeft,
  AlertTriangle,
  Send,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { ThreeTierQuestion, StudentAnswer, formatTimeRemaining } from "@/lib/assessment-mock-data";

interface ReviewAnswersListProps {
  questions: ThreeTierQuestion[];
  answers: Record<string, StudentAnswer>;
  onJumpToQuestion: (index: number) => void;
  onBackToExam: () => void;
  onRequestSubmit: () => void;
  remainingSeconds?: number | null;
  durationMinutes?: number;
}

export const ReviewAnswersList: React.FC<ReviewAnswersListProps> = ({
  questions,
  answers,
  onJumpToQuestion,
  onBackToExam,
  onRequestSubmit,
  remainingSeconds,
  durationMinutes,
}) => {
  // Determine completion stats
  const itemsStatus = questions.map((q, idx) => {
    const ans = answers[q.id];
    const t1 = ans?.tier1Answer;
    const t2 = ans?.tier2Answer;
    const t3 = ans?.tier3Confidence;

    const isComplete = Boolean(t1 && t2 && t3);
    const isPartial = Boolean((t1 || t2 || t3) && !isComplete);
    const isEmpty = !t1 && !t2 && !t3;

    return {
      question: q,
      index: idx,
      t1,
      t2,
      t3,
      isComplete,
      isPartial,
      isEmpty,
    };
  });

  const completeCount = itemsStatus.filter((i) => i.isComplete).length;
  const incompleteItems = itemsStatus.filter((i) => !i.isComplete);
  const incompleteCount = incompleteItems.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBackToExam}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Lembar Soal</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Ikhtisar & Review Jawaban Siswa
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Periksa kelengkapan jawaban 3 tingkat sebelum mengirim sesi asesmen.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Duration / Time Remaining Pill */}
          {durationMinutes && durationMinutes > 0 && remainingSeconds !== undefined && remainingSeconds !== null && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[100px]">
              <span className={`block text-lg font-bold font-mono ${remainingSeconds <= 300 ? "text-amber-600 animate-pulse" : "text-blue-600"}`}>
                {formatTimeRemaining(remainingSeconds)}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                Sisa Waktu
              </span>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center min-w-[100px]">
            <span className="block text-lg font-bold text-emerald-700 font-mono">
              {completeCount} / {questions.length}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
              Lengkap
            </span>
          </div>

          <button
            type="button"
            onClick={onRequestSubmit}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
          >
            <span>Kirim Jawaban</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Incomplete Alert Warning Banner (if any) */}
      {incompleteCount > 0 && (
        <div className="p-4 sm:p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-900">
                Perhatian: Terdapat {incompleteCount} butir soal yang belum lengkap dijawab!
              </p>
              <p className="text-[11px] sm:text-xs text-amber-800 mt-0.5">
                Setiap butir membutuhkan pilihan jawaban (Tingkat 1), alasan (Tingkat 2), dan tingkat keyakinan (Tingkat 3).
              </p>
            </div>
          </div>

          {/* Quick jump to first incomplete question */}
          <button
            type="button"
            onClick={() => onJumpToQuestion(incompleteItems[0].index)}
            className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>Lengkapi Soal #{incompleteItems[0].index + 1}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Review Table / Cards */}
      <div className="rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 shadow-sm space-y-2.5">
        <div className="hidden sm:grid grid-cols-12 gap-3 pb-3 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider px-3">
          <div className="col-span-1">No</div>
          <div className="col-span-4">Topik & Soal</div>
          <div className="col-span-2 text-center">Tingkat 1 (A-E)</div>
          <div className="col-span-2 text-center">Tingkat 2 (A-E)</div>
          <div className="col-span-2 text-center">Tingkat 3 (Keyakinan)</div>
          <div className="col-span-1 text-right">Aksi</div>
        </div>

        {itemsStatus.map((item) => (
          <div
            key={item.question.id}
            className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:grid sm:grid-cols-12 gap-2.5 sm:gap-3 sm:items-center ${
              item.isComplete
                ? "bg-white border-slate-200 hover:border-slate-300"
                : "bg-amber-50/40 border-amber-200 hover:border-amber-300"
            }`}
          >
            {/* Question Number & Topic */}
            <div className="col-span-1 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-mono font-bold text-xs flex items-center justify-center border border-slate-200">
                #{item.index + 1}
              </span>
            </div>

            <div className="col-span-4">
              <p className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1">
                {item.question.title}
              </p>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {item.question.topic}
              </p>
            </div>

            {/* Tier 1 badge */}
            <div className="col-span-2 flex items-center sm:justify-center gap-2">
              <span className="text-[10px] sm:hidden text-slate-500 font-medium">
                T1:
              </span>
              {item.t1 ? (
                <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold text-xs">
                  Opsi {item.t1}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 text-xs">
                  Kosong
                </span>
              )}
            </div>

            {/* Tier 2 badge */}
            <div className="col-span-2 flex items-center sm:justify-center gap-2">
              <span className="text-[10px] sm:hidden text-slate-500 font-medium">
                T2:
              </span>
              {item.t2 ? (
                <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-mono font-bold text-xs">
                  Alasan {item.t2}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 text-xs">
                  Kosong
                </span>
              )}
            </div>

            {/* Tier 3 badge */}
            <div className="col-span-2 flex items-center sm:justify-center gap-2">
              <span className="text-[10px] sm:hidden text-slate-500 font-medium">
                T3:
              </span>
              {item.t3 ? (
                <span
                  className={`px-2.5 py-0.5 rounded-md font-bold text-xs capitalize ${
                    item.t3 === "yakin"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {item.t3}
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 text-xs">
                  Kosong
                </span>
              )}
            </div>

            {/* Action Jump Button */}
            <div className="col-span-1 text-right mt-1 sm:mt-0">
              <button
                type="button"
                onClick={() => onJumpToQuestion(item.index)}
                className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-colors flex items-center justify-center sm:justify-end gap-1"
              >
                <span>Edit</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Footer Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <button
          type="button"
          onClick={onBackToExam}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 shadow-sm transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Soal Terakhir</span>
        </button>

        <button
          type="button"
          onClick={onRequestSubmit}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>Selesai & Kirimkan Jawaban Asesmen</span>
        </button>
      </div>
    </div>
  );
};
