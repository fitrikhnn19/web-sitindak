"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { TeacherAuthLayout } from "@/components/auth/TeacherAuthLayout";
import { useTeacherAuth } from "@/lib/useTeacherAuth";

function LupaSandiContent() {
  const router = useRouter();
  const { requestPasswordReset, resetPassword } = useTeacherAuth();

  // Wizard Step: 1 = Input Email, 2 = Input Sandi Baru, 3 = Selesai
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: Request Reset
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await requestPasswordReset(email);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage(res.message);
        setStep(2);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Gagal memproses permohonan reset sandi.");
    }
  };

  // Step 2: Submit New Password
  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Kata sandi minimal harus 6 karakter.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await resetPassword(newPassword);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage(res.message);
        setStep(3);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Gagal memperbarui kata sandi.");
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Alert Notification */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {successMessage && step !== 3 && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center justify-between text-xs font-semibold px-1 text-slate-500">
        <span className={step >= 1 ? "text-blue-600 font-bold" : ""}>
          1. Verifikasi Email
        </span>
        <span className="text-slate-300">→</span>
        <span className={step >= 2 ? "text-blue-600 font-bold" : ""}>
          2. Sandi Baru
        </span>
        <span className="text-slate-300">→</span>
        <span className={step === 3 ? "text-blue-600 font-bold" : ""}>
          3. Selesai
        </span>
      </div>

      {/* STEP 1: Masukkan Email */}
      {step === 1 && (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Email Terdaftar:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sri.wahyuni@guru.sma.belajar.id"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Kami akan memeriksa akun guru yang sesuai dengan alamat email Anda.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Lanjut: Verifikasi Akun</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setEmail("sri.wahyuni@guru.sma.belajar.id")}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Gunakan Email Akun Uji Coba (Dra. Sri Wahyuni)</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Masukkan Kata Sandi Baru */}
      {step === 2 && (
        <form onSubmit={handleSaveNewPassword} className="space-y-4">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <span>Email terverifikasi: </span>
            <strong className="text-blue-600 font-mono font-semibold">{email}</strong>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kata Sandi Baru:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Konfirmasi Kata Sandi Baru:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setErrorMessage(null);
              }}
              className="py-2.5 px-4 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-sm transition-colors"
            >
              Kembali
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Simpan Kata Sandi Baru</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Sukses */}
      {step === 3 && (
        <div className="py-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              Kata Sandi Berhasil Diperbarui!
            </h3>
            <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
              Kata sandi baru untuk akun <strong className="text-slate-900">{email}</strong> telah aktif. Anda sekarang dapat masuk kembali.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/guru/masuk?reset=success"
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all inline-flex items-center justify-center gap-2"
            >
              <span>Masuk dengan Kata Sandi Baru</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Navigasi kembali ke Masuk */}
      <div className="pt-4 border-t border-slate-200 text-center">
        <Link
          href="/guru/masuk"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Masuk</span>
        </Link>
      </div>

    </div>
  );
}

export default function LupaSandiPage() {
  return (
    <TeacherAuthLayout
      badgeTitle="Pemulihan Akun Guru"
      pageTitle="Atur Ulang Kata Sandi"
      pageDescription="Masukkan email terdaftar untuk memulihkan akses ke akun guru dan dasbor asesmen SITINDAK."
    >
      <Suspense
        fallback={
          <div className="py-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <LupaSandiContent />
      </Suspense>
    </TeacherAuthLayout>
  );
}
