"use client";

import React from "react";
import {
  X,
  AlertTriangle,
  Send,
  ShieldAlert,
  Clock
} from "lucide-react";
import { formatTimeRemaining } from "@/lib/assessment-mock-data";

interface SubmitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  totalQuestions: number;
  completeCount: number;
  incompleteCount: number;
  isSubmitting?: boolean;
  remainingSeconds?: number | null;
}

export const SubmitConfirmationModal: React.FC<SubmitConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions,
  completeCount,
  incompleteCount,
  isSubmitting = false,
  remainingSeconds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Icon Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Konfirmasi Pengiriman Asesmen
            </h3>
            <p className="text-xs text-slate-500">
              SITINDAK — Sistem Diagnostik Tiga Tingkat
            </p>
          </div>
        </div>

        {/* Warning Statement */}
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm leading-relaxed mb-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong>Perhatian:</strong> Jawaban yang telah dikirim bersifat final dan <strong>tidak dapat diubah kembali</strong>. Sistem akan langsung memproses analisis status pemahaman konsepsi Anda.
            </p>
          </div>
        </div>

        {/* Remaining Time Badge (if active) */}
        {remainingSeconds !== undefined && remainingSeconds !== null && (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-3.5">
            <span className="text-slate-600 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Sisa Waktu Pengerjaan:
            </span>
            <span className={`font-mono font-bold ${remainingSeconds <= 300 ? "text-amber-600 animate-pulse" : "text-blue-600"}`}>
              {formatTimeRemaining(remainingSeconds)}
            </span>
          </div>
        )}

        {/* Stats summary */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span className="block text-xl font-bold text-emerald-700 font-mono">
              {completeCount} / {totalQuestions}
            </span>
            <span className="text-[11px] text-slate-500">
              Butir Lengkap Dijawab
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <span
              className={`block text-xl font-bold font-mono ${
                incompleteCount > 0 ? "text-amber-600" : "text-slate-500"
              }`}
            >
              {incompleteCount}
            </span>
            <span className="text-[11px] text-slate-500">
              Butir Belum Lengkap
            </span>
          </div>
        </div>

        {incompleteCount > 0 && (
          <p className="text-[11px] text-rose-600 mb-4 text-center font-medium">
            *Masih ada butir belum lengkap. Butir yang kosong akan dinilai sebagai "Belum Paham".
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-1/2 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-300 shadow-sm transition-colors"
          >
            Batal, Cek Lagi
          </button>

          <button
            type="button"
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
            className="w-1/2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-1.5"
          >
            {isSubmitting ? (
              <span>Mengirim Jawaban...</span>
            ) : (
              <>
                <span>Ya, Kirim Sekarang</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
