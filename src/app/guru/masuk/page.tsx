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
} from "lucide-react";
import { TeacherAuthLayout } from "@/components/auth/TeacherAuthLayout";
import { useTeacherAuth } from "@/lib/useTeacherAuth";

function MasukFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoggedIn, teacher } = useTeacherAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check query params for status messages
  useEffect(() => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage(`Berhasil masuk! Mengarahkan ke dasbor...`);
        setTimeout(() => {
          router.push("/guru/asesmen");
        }, 500);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Terjadi kesalahan saat menghubungi server autentikasi.");
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Alert Notification Toast */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* Jika sudah ada sesi aktif terdeteksi */}
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
              href="/guru/asesmen"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Lanjut ke Dasbor Guru</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-500 text-[11px]">atau ganti akun di bawah</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Kolom Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Alamat Email Guru:
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
            Gunakan email terdaftar (mis. email akun belajar.id atau email resmi sekolah).
          </p>
        </div>

        {/* Kolom Kata Sandi */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-10 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400 font-sans"
              required
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
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
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

      </form>

      {/* Switch to Register */}
      <div className="pt-2 text-center text-xs text-slate-500">
        <span>Belum memiliki akun guru? </span>
        <Link
          href="/guru/daftar"
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Daftar Akun Baru
        </Link>
      </div>

    </div>
  );
}

export default function MasukPage() {
  return (
    <TeacherAuthLayout
      badgeTitle="Masuk Akun Guru"
      pageTitle="Masuk ke Portal Guru SITINDAK"
      pageDescription="Akses dasbor asesmen, kelola token kelas, susun butir three-tier, dan pantau peta konsepsi siswa."
    >
      <Suspense
        fallback={
          <div className="py-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <MasukFormContent />
      </Suspense>
    </TeacherAuthLayout>
  );
}
