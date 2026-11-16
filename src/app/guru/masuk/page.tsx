"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  User,
  Check,
} from "lucide-react";
import { TeacherAuthLayout } from "@/components/auth/TeacherAuthLayout";
import { useTeacherAuth } from "@/lib/useTeacherAuth";

function UnifiedAuthFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, register, loginWithGoogle, isLoggedIn, teacher } = useTeacherAuth();

  // Mode: "login" atau "register"
  const [mode, setMode] = useState<"login" | "register">("login");

  // State Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // State Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & Feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Inisialisasi mode dari query parameter (?mode=register)
  useEffect(() => {
    const requestedMode = searchParams.get("mode");
    if (requestedMode === "register") {
      setMode("register");
    } else if (requestedMode === "login") {
      setMode("login");
    }

    const status = searchParams.get("status");
    const reset = searchParams.get("reset");
    const registered = searchParams.get("registered");

    if (status === "logged_out") {
      setSuccessMessage("Anda telah berhasil keluar dari sesi akun guru.");
    } else if (reset === "success") {
      setSuccessMessage("Kata sandi berhasil diperbarui! Silakan masuk dengan sandi baru Anda.");
    } else if (registered === "success") {
      setSuccessMessage("Pendaftaran akun guru berhasil! Silakan masuk.");
    }
  }, [searchParams]);

  // Evaluasi kekuatan sandi pendaftaran
  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "Belum diisi", color: "bg-slate-200", width: "0%" };
    if (pass.length < 6) return { score: 1, label: "Terlalu Pendek (min 6)", color: "bg-rose-500", width: "25%" };

    let score = 1;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;

    switch (score) {
      case 2:
        return { score: 2, label: "Cukup", color: "bg-amber-500", width: "50%" };
      case 3:
        return { score: 3, label: "Kuat", color: "bg-blue-500", width: "75%" };
      case 4:
      default:
        return { score: 4, label: "Sangat Kuat", color: "bg-emerald-500", width: "100%" };
    }
  };

  const strength = calculatePasswordStrength(regPassword);

  // Handler Masuk via Email & Password
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(loginEmail, loginPassword);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage("Berhasil masuk! Mengarahkan ke dasbor guru...");
        setTimeout(() => {
          router.push("/guru");
        }, 500);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Terjadi kesalahan saat menghubungi server autentikasi.");
    }
  };

  // Handler Daftar Akun Baru
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok. Harap periksa kembali.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage("Kata sandi minimal harus 6 karakter.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Anda harus menyetujui ketentuan penggunaan SITINDAK.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await register(regName, regEmail, regPassword);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage("Pendaftaran akun berhasil! Mengarahkan ke dasbor guru...");
        setTimeout(() => {
          router.push("/guru");
        }, 600);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Terjadi kesalahan saat menghubungi server pendaftaran.");
    }
  };

  // Handler Masuk / Daftar dengan Akun Google
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGoogleLoading(true);

    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setIsGoogleLoading(false);
        setErrorMessage(res.message);
      }
      // Jika sukses, browser akan otomatis diarahkan oleh Supabase ke halaman login Google OAuth
    } catch {
      setIsGoogleLoading(false);
      setErrorMessage("Gagal menghubungkan ke layanan Google OAuth.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Tab Segment: Masuk vs Daftar */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mode === "login"
              ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Masuk Akun</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setMode("register");
            setErrorMessage(null);
            setSuccessMessage(null);
          }}
          className={`py-2.5 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mode === "register"
              ? "bg-white text-blue-700 shadow-xs border border-slate-200/80"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Daftar Akun Baru</span>
        </button>
      </div>

      {/* Alert Notification Toast */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Sesi Aktif Terdeteksi Banner */}
      {isLoggedIn && teacher && !searchParams.get("status") && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-slate-700 font-medium">Sesi guru saat ini masih aktif:</span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              Aktif
            </span>
          </div>
          <p className="font-bold text-slate-900 text-sm">{teacher.name}</p>
          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/guru"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Lanjut ke Dasbor Guru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-500 text-[11px]">atau beralih akun di bawah</span>
          </div>
        </div>
      )}

      {/* Tombol Masuk / Daftar dengan Google */}
      <div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || isGoogleLoading}
          className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center gap-2.5 transition-all hover:border-slate-400 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isGoogleLoading ? (
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>
            {mode === "login" ? "Masuk dengan Akun Google" : "Daftar dengan Akun Google"}
          </span>
        </button>
      </div>

      {/* Pembatas / Divider */}
      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-3 text-slate-400 text-xs font-medium">
          {mode === "login" ? "atau masuk dengan email" : "atau daftar dengan email"}
        </span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      {/* ======================================================= */}
      {/* FORM MODE: MASUK                                       */}
      {/* ======================================================= */}
      {mode === "login" && (
        <form onSubmit={handleLoginSubmit} method="POST" className="space-y-4 animate-in fade-in duration-200">
          {/* Kolom Email */}
          <div>
            <label htmlFor="loginEmail" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Email Guru:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                id="loginEmail"
                name="email"
                type="email"
                autoComplete="username"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="sri.wahyuni@guru.sma.belajar.id"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Gunakan email terdaftar (mis. email akun belajar.id atau email resmi sekolah).
            </p>
          </div>

          {/* Kolom Kata Sandi */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="loginPassword" className="block text-xs font-semibold text-slate-700">
                Kata Sandi:
              </label>
              <Link
                href="/guru/lupa-sandi"
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                id="loginPassword"
                name="password"
                type={showLoginPassword ? "text" : "password"}
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400 font-sans"
                required
              />
              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-slate-600">Ingat sesi saya di peramban ini</span>
            </label>
          </div>

          {/* Tombol Masuk */}
          <button
            type="submit"
            disabled={isSubmitting || isGoogleLoading}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk ke Dasbor Guru</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Switcher to Register */}
          <div className="pt-3 text-center text-xs text-slate-600 border-t border-slate-150">
            <span>Belum memiliki akun guru? </span>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              Daftar sekarang.
            </button>
          </div>
        </form>
      )}

      {/* ======================================================= */}
      {/* FORM MODE: DAFTAR AKUN BARU                             */}
      {/* ======================================================= */}
      {mode === "register" && (
        <form onSubmit={handleRegisterSubmit} method="POST" className="space-y-4 animate-in fade-in duration-200">
          {/* Kolom 1: Nama Lengkap Guru */}
          <div>
            <label htmlFor="regName" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Lengkap Guru (beserta Gelar):
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                id="regName"
                name="name"
                type="text"
                autoComplete="name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Contoh: Budi Santoso, S.Pd., M.Si."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Nama ini akan tampil di lembar asesmen siswa dan laporan diagnostik.
            </p>
          </div>

          {/* Kolom 2: Email */}
          <div>
            <label htmlFor="regEmail" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Alamat Email Aktif:
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                id="regEmail"
                name="email"
                type="email"
                autoComplete="username"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="budi.santoso@guru.sma.belajar.id"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                required
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Email digunakan sebagai akun login utama dan pemulihan kata sandi.
            </p>
          </div>

          {/* Kolom 3: Kata Sandi */}
          <div>
            <label htmlFor="regPassword" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kata Sandi Baru:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                id="regPassword"
                name="password"
                type={showRegPassword ? "text" : "password"}
                autoComplete="new-password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowRegPassword(!showRegPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Indikator Kekuatan Sandi */}
            {regPassword && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: strength.width }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 text-right">
                  Kekuatan: <span className="text-slate-800 font-semibold">{strength.label}</span>
                </p>
              </div>
            )}
          </div>

          {/* Kolom 4: Konfirmasi Kata Sandi */}
          <div>
            <label htmlFor="regConfirmPassword" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Konfirmasi Kata Sandi:
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <input
                id="regConfirmPassword"
                name="confirmPassword"
                type={showRegPassword ? "text" : "password"}
                autoComplete="new-password"
                value={regConfirmPassword}
                onChange={(e) => setRegConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi di atas"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                required
              />
            </div>
          </div>

          {/* Checkbox Ketentuan */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[11px] text-slate-600 leading-snug">
                Saya menyetujui penggunaan sistem asesmen diagnostik SITINDAK dan menjaga kerahasiaan butir soal three-tier kelas.
              </span>
            </label>
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            disabled={isSubmitting || isGoogleLoading || !agreeTerms}
            className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Daftar Akun Baru</span>
                <Check className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Switcher to Login */}
          <div className="pt-3 text-center text-xs text-slate-600 border-t border-slate-150">
            <span>Sudah memiliki akun guru? </span>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
            >
              Masuk sekarang.
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function MasukPage() {
  return (
    <TeacherAuthLayout
      badgeTitle="Portal Autentikasi Guru"
      pageTitle="Akses Portal Guru SITINDAK"
      pageDescription="Masuk ke akun guru Anda atau daftar akun baru untuk mengelola asesmen dan memetakan konsepsi siswa."
    >
      <Suspense
        fallback={
          <div className="py-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <UnifiedAuthFormContent />
      </Suspense>
    </TeacherAuthLayout>
  );
}
