"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Building2,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Save,
  ArrowRight,
  Layers,
  GraduationCap,
  FileBadge2,
  Calendar,
  Lock,
  ExternalLink,
  Info,
} from "lucide-react";
import { TeacherSessionHeader } from "@/components/dashboard/TeacherSessionHeader";
import { useTeacherAuth } from "@/lib/useTeacherAuth";

function ProfilGuruContent() {
  const router = useRouter();
  const { teacher, isLoggedIn, updateProfile, resetPassword } = useTeacherAuth();

  // Form states
  const [name, setName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [subject, setSubject] = useState("");
  const [nip, setNip] = useState("");
  const [bio, setBio] = useState("");

  // Password change states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordToast, setPasswordToast] = useState<string | null>(null);

  // Status notifications
  const [notificationToast, setNotificationToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state dari auth session
  useEffect(() => {
    if (teacher) {
      setName(teacher.name || "");
      setSchoolName(teacher.schoolName || "");
      setSubject(teacher.subject || "Matematika");
      setNip(teacher.nip || "");
      setBio(teacher.bio || "");
    }
  }, [teacher]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("error", "Nama lengkap guru tidak boleh kosong.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateProfile({
        name: name.trim(),
        schoolName: schoolName.trim(),
        subject: subject.trim(),
        nip: nip.trim(),
        bio: bio.trim(),
      });
      setIsSaving(false);

      if (res.success) {
        showToast("success", "Perubahan profil dan nama sekolah berhasil disimpan!");
      } else {
        showToast("error", res.message);
      }
    } catch {
      setIsSaving(false);
      showToast("error", "Gagal menyimpan perubahan ke database.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher?.email) return;

    if (newPassword.length < 6) {
      setPasswordToast("Kata sandi baru minimal 6 karakter.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordToast("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    try {
      const res = await resetPassword(newPassword);
      if (res.success) {
        setPasswordToast("Kata sandi berhasil diperbarui!");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setPasswordToast(null), 3500);
      } else {
        setPasswordToast(res.message);
      }
    } catch {
      setPasswordToast("Gagal memperbarui kata sandi.");
    }
  };

  const showToast = (type: "success" | "error", message: string) => {
    setNotificationToast({ type, message });
    setTimeout(() => setNotificationToast(null), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Teacher Session Header */}
      <TeacherSessionHeader
        currentModule="profil"
        title="Atur Profil & Sekolah"
        subtitle="Kelola identitas pendidik, data sekolah, dan preferensi akun guru"
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Banner Notification Toast */}
        {notificationToast && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 shadow-sm ${
              notificationToast.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                : "bg-rose-50 border border-rose-200 text-rose-800"
            }`}
          >
            <div className="flex items-center gap-2">
              {notificationToast.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span className="font-medium">{notificationToast.message}</span>
            </div>
            <button
              onClick={() => setNotificationToast(null)}
              className="text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Atur Profil & Sekolah Guru
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Lengkapi identitas pendidik dan asal sekolah agar otomatis tercantum di lembar hasil siswa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/guru/asesmen"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-sm transition-colors"
            >
              <span>Dasbor Asesmen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* PRD Boundary Notice: Pengelolaan Kelas di Dasbor */}
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 block">
                Pengelolaan Kelas & Jadwal Asesmen
              </span>
              <p className="text-[11px] text-slate-600 leading-relaxed max-w-3xl">
                Guru sering mengampu beberapa kelas sekaligus (mis. XI-A, XI-B). Pembuatan kelas, token asesmen, dan pengaturan jadwal dikelola langsung di halaman <strong>Dasbor Asesmen</strong>.
              </p>
            </div>
          </div>
          <Link
            href="/guru/asesmen"
            className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-colors flex items-center gap-1.5"
          >
            <span>Buka Kelola Kelas</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid Two Columns: Profil Form & Sesi Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Kolom Kiri: Formulir Profil & Sekolah (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            <form onSubmit={handleSaveProfile} className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Data Identitas Pendidik
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">
                  ID: {teacher?.id || "tch-default"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Nama Lengkap Guru */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Lengkap Guru (beserta Gelar Akademik):
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Dra. Sri Wahyuni, M.Pd."
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Ditampilkan sebagai nama guru pengampu di header asesmen siswa dan laporan diagnostik.
                  </p>
                </div>

                {/* Email (Readonly / Auth sync indicator) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Alamat Email Akun (Tersinkronisasi):
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="email"
                      value={teacher?.email || ""}
                      readOnly
                      disabled
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 text-xs sm:text-sm cursor-not-allowed font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Email akun autentikasi utama.
                  </p>
                </div>

                {/* NIP / NUPTK */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    NIP / NUPTK (Opsional):
                  </label>
                  <div className="relative">
                    <FileBadge2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={nip}
                      onChange={(e) => setNip(e.target.value)}
                      placeholder="19780512 200501 2 004"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Nomor identitas resmi pegawai jika diperlukan untuk cetak lembar hasil.
                  </p>
                </div>

                {/* Asal Sekolah */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Nama Asal Sekolah / Instansi:
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Contoh: SMA Negeri 1 Surabaya"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Sekolah tempat Anda mengajar saat ini.
                  </p>
                </div>

                {/* Mata Pelajaran / Subjek */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mata Pelajaran & Topik Utama:
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Contoh: Matematika (Transformasi Geometri)"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Bio / Catatan Profil */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Profil Singkat & Pendekatan Pedagogik:
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tuliskan fokus pengajaran, tujuan diagnostik miskonsepsi, atau pendekatan pembelajaran berdiferensiasi..."
                    className="w-full p-3 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400 resize-none"
                  />
                </div>

              </div>

              {/* Tombol Simpan Perubahan Profil */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Perubahan Profil</span>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Bagian Keamanan & Ubah Kata Sandi */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-blue-600" />
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Keamanan & Kata Sandi Akun
                  </h2>
                </div>
                <span className="text-[11px] text-slate-500">
                  Ubah kata sandi secara berkala
                </span>
              </div>

              {passwordToast && (
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{passwordToast}</span>
                </div>
              )}

              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Kata Sandi Baru:
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Konfirmasi Sandi Baru:
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ketik ulang kata sandi baru"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={!newPassword || !confirmPassword}
                    className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-semibold border border-slate-300 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Perbarui Kata Sandi
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Kolom Kanan: Status Akun, Sesi, & Ringkasan (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Kartu Status Sesi Aktif */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Status Sesi Guru</span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Aktif & Terlindungi
                </span>
              </div>

              <div className="text-center py-2">
                <div className="w-14 h-14 rounded-xl bg-blue-600 text-white text-lg font-bold flex items-center justify-center mx-auto shadow-sm">
                  {name ? name.substring(0, 2).toUpperCase() : "GW"}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-3 truncate">
                  {name || "Guru SITINDAK"}
                </h3>
                <p className="text-xs text-blue-600 font-medium truncate mt-0.5">
                  {schoolName || "Belum Mengisi Sekolah"}
                </p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                  {teacher?.email}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Terdaftar Sejak:</span>
                  </span>
                  <span className="font-semibold text-slate-800">
                    {teacher?.createdAt ? new Date(teacher.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "15 Okt 2026"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Layanan Auth:</span>
                  </span>
                  <span className="font-semibold text-emerald-700">
                    Supabase Auth RLS
                  </span>
                </div>
              </div>
            </div>

            {/* Kartu Ringkasan Modul Guru */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Akses Cepat Modul Guru
              </h3>

              <div className="space-y-1.5">
                <Link
                  href="/guru/asesmen"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Kelola Kelas & Token</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/guru/soal"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Bank Soal Three-Tier</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/guru/hasil"
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Profil Diagnostik Siswa</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">SITINDAK</span>
            <span>— Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Manajemen Profil & Sekolah Pendidik
          </p>
        </div>
      </footer>

    </div>
  );
}

export default function ProfilGuruPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-600 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProfilGuruContent />
    </Suspense>
  );
}
