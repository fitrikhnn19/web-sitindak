"use client";

import React, { useState, useEffect } from "react";
import {
  KeyRound,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  User,
  Clock,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Info
} from "lucide-react";
import { MOCK_TOKENS, AssessmentToken } from "@/lib/assessment-mock-data";
import { getAllAssessments, fetchAssessmentsFromSupabase, simulateStudentEntry } from "@/lib/assessment-management-store";

interface AssessmentTokenEntryProps {
  initialToken?: string;
  onStartSession: (token: AssessmentToken, studentName: string) => void;
  onAlreadySubmitted?: (token: AssessmentToken, studentName: string) => void;
}

export const AssessmentTokenEntry: React.FC<AssessmentTokenEntryProps> = ({
  initialToken = "",
  onStartSession,
  onAlreadySubmitted,
}) => {
  const [tokenInput, setTokenInput] = useState(initialToken);
  const [validatedToken, setValidatedToken] = useState<AssessmentToken | null>(null);
  const [studentName, setStudentName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [rateLimitedUntil, setRateLimitedUntil] = useState<number | null>(null);

  useEffect(() => {
    fetchAssessmentsFromSupabase();
  }, []);

  // Check rate limit timer
  useEffect(() => {
    if (rateLimitedUntil) {
      const interval = setInterval(() => {
        if (Date.now() >= rateLimitedUntil) {
          setRateLimitedUntil(null);
          setAttemptCount(0);
          setErrorMessage(null);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [rateLimitedUntil]);

  // Handle token verification
  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();

    // Rate limit check
    if (rateLimitedUntil && Date.now() < rateLimitedUntil) {
      setErrorMessage("Terlalu banyak percobaan, coba lagi sebentar.");
      return;
    }

    const cleanCode = tokenInput.trim().toUpperCase();

    if (!cleanCode) {
      setErrorMessage("Silakan masukkan kode token dari guru Anda.");
      return;
    }

    const nextAttempts = attemptCount + 1;
    setAttemptCount(nextAttempts);

    if (nextAttempts >= 6) {
      const lockUntil = Date.now() + 30000;
      setRateLimitedUntil(lockUntil);
      setErrorMessage("Terlalu banyak percobaan, coba lagi sebentar.");
      return;
    }

    let tokenData: AssessmentToken | undefined = undefined;
    const storedAssessments = getAllAssessments();
    const matchedAssessment = storedAssessments.find((a) => a.token.code === cleanCode);
    if (matchedAssessment) {
      tokenData = {
        code: matchedAssessment.token.code,
        title: matchedAssessment.title,
        className: matchedAssessment.className,
        teacherName: matchedAssessment.teacherName,
        isActive: matchedAssessment.token.isActive,
        maxUses: matchedAssessment.token.maxUses,
        usedCount: matchedAssessment.token.usedCount,
        opensAt: matchedAssessment.opensAt,
        closesAt: matchedAssessment.closesAt,
        status: matchedAssessment.status,
        durationMinutes: matchedAssessment.durationMinutes !== undefined ? matchedAssessment.durationMinutes : 45,
      };
    }

    // 1. Kode token tidak ditemukan
    if (!tokenData) {
      setErrorMessage("Token tidak dikenali. Periksa kembali kode dari guru.");
      setValidatedToken(null);
      return;
    }

    // 2. tokens.is_active = false
    if (!tokenData.isActive) {
      setErrorMessage("Token sudah dinonaktifkan guru.");
      setValidatedToken(null);
      return;
    }

    const now = new Date();
    const opensAtDate = new Date(tokenData.opensAt);
    const closesAtDate = new Date(tokenData.closesAt);

    // 3. tokens.expires_at sudah lewat
    if (now > closesAtDate) {
      setErrorMessage("Token sudah kedaluwarsa.");
      setValidatedToken(null);
      return;
    }

    // 4. used_count >= max_uses
    if (tokenData.usedCount >= tokenData.maxUses) {
      setErrorMessage("Kuota pemakaian token sudah habis.");
      setValidatedToken(null);
      return;
    }

    // 5. Waktu sekarang < assessments.opens_at
    if (now < opensAtDate) {
      const formattedDate = opensAtDate.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      setErrorMessage(`Asesmen belum dibuka. Jadwal buka: ${formattedDate} WIB.`);
      setValidatedToken(null);
      return;
    }

    // 6. status = selesai
    if (tokenData.status === "selesai") {
      setErrorMessage("Asesmen sudah ditutup.");
      setValidatedToken(null);
      return;
    }

    // All validation passed
    setErrorMessage(null);
    setValidatedToken(tokenData);
  };

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedName = studentName.trim().replace(/\s+/g, " ");

    if (!cleanedName || cleanedName.length < 3) {
      setErrorMessage("Harap masukkan nama lengkap siswa (minimal 3 karakter).");
      return;
    }

    if (!validatedToken) return;

    // Check if previously submitted locally in session
    const storageKey = `sitindak_submission_${validatedToken.code}_${cleanedName.toLowerCase()}`;
    const previousSubmission = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;

    if (previousSubmission && onAlreadySubmitted) {
      onAlreadySubmitted(validatedToken, cleanedName);
      return;
    }

    const stored = getAllAssessments();
    const matched = stored.find((a) => a.token.code === validatedToken.code);
    if (matched) {
      simulateStudentEntry(matched.id);
    }

    onStartSession(validatedToken, cleanedName);
  };

  const handleResetToken = () => {
    setValidatedToken(null);
    setStudentName("");
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Product Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
          <KeyRound className="w-3.5 h-3.5 text-blue-600" />
          <span>Gerbang Masuk Asesmen Tiga Tingkat</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          SITINDAK
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm relative">
        {/* Error Notification Alert */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* STEP 1: TOKEN ONLY (Single Field) */}
        {!validatedToken ? (
          <form onSubmit={handleVerifyToken} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Masukkan Kode Token dari Guru:
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck="false"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value.toUpperCase());
                    setErrorMessage(null);
                  }}
                  placeholder="Contoh: GEO-IXA"
                  className="w-full px-4 py-3.5 rounded-xl bg-white border-2 border-slate-300 text-slate-900 font-mono text-center tracking-widest text-lg sm:text-xl font-bold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal placeholder:text-base uppercase"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 text-center">
                Mendukung salin-tempel dari pesan WhatsApp atau catatan guru.
              </p>
            </div>

            <button
              type="submit"
              disabled={Boolean(rateLimitedUntil)}
              className={`w-full py-3 rounded-xl font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2 ${
                rateLimitedUntil
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              <span>{rateLimitedUntil ? "Mohon Tunggu Sebentar..." : "Periksa Token"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* STEP 2: STUDENT NAME ENTRY (Revealed only after token is valid) */
          <form onSubmit={handleStartExam} className="space-y-4">
            {/* Assessment verified banner */}
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Token Valid: {validatedToken.code}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white border border-blue-200 text-blue-700 font-semibold text-[10px]">
                  {validatedToken.className}
                </span>
              </div>
              <p className="text-slate-900 font-bold text-sm leading-snug">
                {validatedToken.title}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-y-1 gap-x-4 text-[11px] text-slate-600 pt-1 border-t border-blue-200/60">
                <span>Guru: {validatedToken.teacherName}</span>
                <span>Kuota: {validatedToken.usedCount} / {validatedToken.maxUses} siswa</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Durasi: {validatedToken.durationMinutes && validatedToken.durationMinutes > 0 ? `${validatedToken.durationMinutes} Menit` : "Tanpa Batas"}</span>
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Lengkap Siswa:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => {
                    setStudentName(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Ketikkan nama lengkap Anda..."
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Pastikan nama sesuai daftar presensi kelas untuk catatan evaluasi guru.
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleResetToken}
                className="w-1/3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ganti</span>
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <span>Mulai Mengerjakan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* Focus Mode & Security Note */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mode Fokus Ujian Otomatis</span>
          </div>
          <span>Tanpa Akun Siswa</span>
        </div>
      </div>
    </div>
  );
};
