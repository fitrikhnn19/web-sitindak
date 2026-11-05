"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Info,
  ShieldCheck,
} from "lucide-react";
import { TeacherAuthLayout } from "@/components/auth/TeacherAuthLayout";
import { useTeacherAuth } from "@/lib/useTeacherAuth";

function DaftarFormContent() {
  const router = useRouter();
  const { register } = useTeacherAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Indikator kekuatan kata sandi
  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "bg-slate-200", width: "0%" };
    if (password.length < 6) return { label: "Terlalu Pendek (min. 6)", color: "bg-rose-500", width: "30%" };
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    if (hasLetters && hasNumbers && password.length >= 8) {
      return { label: "Kuat", color: "bg-emerald-500", width: "100%" };
    }
    return { label: "Cukup", color: "bg-amber-500", width: "65%" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validasi kata sandi cocok
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok. Silakan ketik ulang.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Harap setujui ketentuan penggunaan SITINDAK.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await register(name, email, password);
      setIsSubmitting(false);

      if (res.success) {
        setSuccessMessage(`${res.message} Mengarahkan langsung ke dasbor...`);
        setTimeout(() => {
          router.push("/guru/asesmen");
        }, 800);
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setIsSubmitting(false);
      setErrorMessage("Terjadi gangguan koneksi ke server autentikasi.");
    }
  };

  const handleFillSample = () => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setName(`Budi Santoso, S.Pd., M.Si.`);
    setEmail(`budi.santoso${randomSuffix}@sekolah.belajar.id`);
    setPassword("sandiAman123");
    setConfirmPassword("sandiAman123");
    setErrorMessage(null);
  };

  return (
    <div className="space-y-5">
      
      {/* Alert Notifications */}
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

      {/* Info Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
        <p className="leading-relaxed text-[11px] text-slate-600">
          <strong className="text-slate-900">Praktis & Ringkas:</strong> Pendaftaran hanya meminta <strong>Nama Lengkap, Email, dan Sandi</strong>. Data nama sekolah dan kelas yang diampu dapat disesuaikan fleksibel di dalam dasbor.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Kolom 1: Nama Lengkap Guru */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nama Lengkap Guru (beserta Gelar):
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Alamat Email Aktif:
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Kata Sandi Baru:
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {/* Indikator Kekuatan Sandi */}
          {password && (
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
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Konfirmasi Kata Sandi:
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs text-slate-600 leading-relaxed">
              Saya menyetujui ketentuan penggunaan platform asesmen diagnostik SITINDAK dan menjaga kerahasiaan token asesmen siswa.
            </span>
          </label>
        </div>

        {/* Tombol Buat Akun */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span>Buat Akun Guru & Masuk Dasbor</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      {/* Auto-fill sample button */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          onClick={handleFillSample}
          className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Isi Cepat dengan Data Simulasi</span>
        </button>
      </div>

      {/* Switch to Login */}
      <div className="pt-2 text-center text-xs text-slate-500">
        <span>Sudah memiliki akun guru? </span>
        <Link
          href="/guru/masuk"
          className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Masuk ke Akun
        </Link>
      </div>

    </div>
  );
}

export default function DaftarPage() {
  return (
    <TeacherAuthLayout
      badgeTitle="Pendaftaran Akun Guru"
      pageTitle="Daftar Akun Guru Baru"
      pageDescription="Hanya butuh nama lengkap, email, dan kata sandi. Nama sekolah dan kelas diampu dikelola fleksibel di dasbor."
    >
      <Suspense
        fallback={
          <div className="py-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <DaftarFormContent />
      </Suspense>
    </TeacherAuthLayout>
  );
}
