"use client";

import React, { useState } from "react";
import {
  X,
  KeyRound,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  Users
} from "lucide-react";

interface TokenTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TokenTesterModal: React.FC<TokenTesterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [tokenInput, setTokenInput] = useState("");
  const [step, setStep] = useState<"token" | "name" | "success">("token");
  const [studentName, setStudentName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  // Preset valid sample tokens per PRD spec
  const validTokens: Record<string, { title: string; className: string; maxUses: number; closesAt: string }> = {
    "GEO-IXA": {
      title: "Asesmen Diagnostik Prasyarat Transformasi Geometri",
      className: "Kelas XI-A",
      maxUses: 32,
      closesAt: "Hari ini, 12:00 WIB",
    },
    "TRANS-9B": {
      title: "Diagnostik Translasi & Refleksi Kartesius",
      className: "Kelas XI-B",
      maxUses: 30,
      closesAt: "Hari ini, 14:00 WIB",
    },
  };

  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanToken = tokenInput.trim().toUpperCase();

    if (!cleanToken) {
      setErrorMessage("Silakan masukkan kode token dari guru Anda.");
      return;
    }

    if (cleanToken === "EXPIRED-TEST") {
      setErrorMessage("Token sudah kedaluwarsa. Hubungi guru matematika Anda untuk token terbaru.");
      return;
    }

    if (validTokens[cleanToken]) {
      setErrorMessage("");
      setStep("name");
    } else {
      setErrorMessage("Token tidak dikenali. Pastikan Anda memasukkan kode yang benar dari guru.");
    }
  };

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMessage("Harap masukkan nama lengkap Anda.");
      return;
    }
    setErrorMessage("");
    setStep("success");
  };

  const handleReset = () => {
    setTokenInput("");
    setStudentName("");
    setErrorMessage("");
    setStep("token");
  };

  const currentAssessment = validTokens[tokenInput.trim().toUpperCase()];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Masuk Asesmen Siswa
            </h3>
            <p className="text-xs text-slate-500">
              Gerbang akses asesmen tiga tingkat SITINDAK
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: TOKEN INPUT */}
        {step === "token" && (
          <form onSubmit={handleVerifyToken} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Masukkan Token dari Guru:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value.toUpperCase());
                    setErrorMessage("");
                  }}
                  placeholder="Contoh: GEO-IXA"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-center tracking-widest text-lg font-bold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 uppercase"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Token bersifat tidak peka huruf besar/kecil (otomatis kapital).
              </p>
            </div>

            {/* Quick Demo Token Chips */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-600 block mb-2">
                Pilih token sampel untuk simulasi:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTokenInput("GEO-IXA");
                    setErrorMessage("");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[11px] font-mono font-semibold text-blue-700 border border-blue-200 transition-colors"
                >
                  GEO-IXA (Kelas XI-A)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTokenInput("TRANS-9B");
                    setErrorMessage("");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-[11px] font-mono font-semibold text-indigo-700 border border-indigo-200 transition-colors"
                >
                  TRANS-9B (Kelas XI-B)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTokenInput("EXPIRED-TEST");
                    setErrorMessage("");
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[11px] font-mono font-semibold text-rose-700 border border-rose-200 transition-colors"
                >
                  EXPIRED-TEST (Uji Kedaluwarsa)
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Periksa Token</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* STEP 2: STUDENT NAME ENTRY */}
        {step === "name" && (
          <form onSubmit={handleStartExam} className="space-y-4 animate-in fade-in duration-200">
            {/* Assessment Details verified badge */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-blue-900 font-bold">
                <span>✓ Token Valid: {tokenInput}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-600 text-white font-semibold">
                  {currentAssessment?.className}
                </span>
              </div>
              <p className="text-slate-800 font-semibold">
                {currentAssessment?.title}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-600 pt-1">
                <span>Kuota: {currentAssessment?.maxUses} Siswa</span>
                <span>• Tutup: {currentAssessment?.closesAt}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Nama Lengkap Siswa:
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Contoh: Cantika Putri Utami"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Nama ini akan dicatat guru untuk laporan pemahaman individual.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-1/3 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              >
                Ganti Token
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Mulai Mengerjakan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: MOCK SESSION START SUCCESS */}
        {step === "success" && (
          <div className="text-center py-4 space-y-4 animate-in fade-in duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900">
                Sesi Ujian Siap!
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Selamat mengerjakan, <strong className="text-slate-900">{studentName}</strong>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-1.5 text-slate-700">
              <div className="flex items-center gap-2 text-blue-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mode Fokus Ujian Diaktifkan</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Soal tiga tingkat akan disajikan berurutan. Jawaban dinilai seketika di akhir tanpa melihat hasil siswa lain.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <a
                href={`/asesmen?token=${tokenInput.trim().toUpperCase()}`}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Masuk ke Lembar Ujian Asesmen</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                Coba Token Lain
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
