"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  KeyRound,
  Layers,
  BarChart3,
  User,
  LogOut,
  ChevronDown,
  Building2,
  School,
  Mail,
  ShieldCheck,
  CheckCircle2,
  LayoutDashboard,
  Settings,
  HelpCircle,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import { useTeacherAuth } from "@/lib/useTeacherAuth";

interface TeacherSessionHeaderProps {
  currentModule?: "dasbor" | "kelas" | "asesmen" | "soal" | "hasil" | "kualitas" | "profil";
  title?: string;
  subtitle?: string;
}

export const TeacherSessionHeader: React.FC<TeacherSessionHeaderProps> = ({
  currentModule = "dasbor",
  title,
  subtitle,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { teacher, isLoggedIn, logout } = useTeacherAuth();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Inisial avatar dari nama guru
  const getInitials = (name?: string) => {
    if (!name) return "GR";
    const clean = name.replace(/^(Dra\.|Drs\.|Dr\.|Prof\.|Ir\.|H\.|Hj\.)\s*/gi, "");
    const parts = clean.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0]?.substring(0, 2).toUpperCase() || "GR";
  };

  const handleLogoutAction = async () => {
    setShowLogoutConfirm(false);
    await logout();
    router.push("/guru/masuk?status=logged_out");
  };

  const navLinks = [
    {
      id: "dasbor",
      label: "Dasbor Utama",
      href: "/guru",
      icon: LayoutDashboard,
      active: pathname === "/guru",
    },
    {
      id: "kelas",
      label: "Kelola Kelas",
      href: "/guru/kelas",
      icon: School,
      active: pathname.startsWith("/guru/kelas"),
    },
    {
      id: "asesmen",
      label: "Asesmen & Token",
      href: "/guru/asesmen",
      icon: KeyRound,
      active: pathname.startsWith("/guru/asesmen"),
    },
    {
      id: "soal",
      label: "Bank Soal 3-Tier",
      href: "/guru/soal",
      icon: Layers,
      active: pathname.startsWith("/guru/soal"),
    },
    {
      id: "hasil",
      label: "Hasil & Profil Siswa",
      href: "/guru/hasil",
      icon: BarChart3,
      active: pathname.startsWith("/guru/hasil"),
    },
    {
      id: "kualitas",
      label: "Kualitas Soal",
      href: "/guru/analisis-soal",
      icon: CheckCircle2,
      active: pathname.startsWith("/guru/analisis-soal"),
    },
  ];

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3">

            {/* Sisi Kiri: Branding & Modul */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Kembali ke Beranda SITINDAK"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <Link href="/guru" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      SITINDAK
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Portal Guru
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 hidden sm:block">
                    {subtitle || "Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi"}
                  </p>
                </div>
              </Link>
            </div>

            {/* Navigasi Desktop */}
            <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1 rounded-lg border border-slate-200">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${item.active
                        ? "bg-white text-blue-700 shadow-sm border border-slate-200/60"
                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Sisi Kanan: Sesi Aktif Guru & Aksi */}
            <div className="flex items-center gap-2.5">

              {/* Uji Layar Siswa Shortcut */}
              <Link
                href="/asesmen"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                title="Coba simulasi pengerjaan siswa dengan token"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Uji Layar Siswa</span>
              </Link>

              {/* Status Sesi Guru */}
              {isLoggedIn && teacher ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 transition-all text-left shadow-sm"
                    aria-label="Menu akun guru"
                  >
                    {/* Avatar Inisial */}
                    <div className="w-7 h-7 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                      {getInitials(teacher.name)}
                    </div>

                    <div className="hidden sm:block text-left">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 max-w-[130px] truncate leading-none">
                          {teacher.name}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Sesi Aktif" />
                      </div>
                      <p className="text-[10px] text-slate-500 truncate max-w-[130px] leading-tight mt-0.5">
                        {teacher.schoolName || "Atur Sekolah"}
                      </p>
                    </div>

                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
                  </button>

                  {/* Dropdown Menu Sesi */}
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 shadow-lg p-2 z-50 animate-in fade-in zoom-in-95 duration-150">

                      {/* Identitas Sesi */}
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
                            {getInitials(teacher.name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 truncate">
                              {teacher.name}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                              <span className="truncate">{teacher.email}</span>
                            </p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Sesi Aktif
                              </span>
                              {teacher.schoolName && (
                                <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                                  {teacher.schoolName}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Navigasi Profil */}
                      <div className="space-y-1">
                        <Link
                          href="/guru/profil"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${pathname === "/guru/profil"
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
                            }`}
                        >
                          <User className="w-4 h-4 text-blue-600" />
                          <span>Atur Profil & Sekolah</span>
                        </Link>

                        <Link
                          href="/guru/kelas"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${pathname === "/guru/kelas"
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
                            }`}
                        >
                          <School className="w-4 h-4 text-blue-600" />
                          <span>Kelola Kelas di Dasbor</span>
                        </Link>

                        <div className="border-t border-slate-100 my-1 pt-1" />

                        {/* Tombol Keluar */}
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Keluar dari Akun Guru</span>
                        </button>
                      </div>

                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/guru/masuk"
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    Masuk Akun Guru
                  </Link>
                  <Link
                    href="/guru/daftar"
                    className="hidden sm:inline-flex px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors border border-slate-300"
                  >
                    Daftar Baru
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                aria-label="Buka menu navigasi"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>

            </div>

          </div>

          {/* Navigasi Mobile Menu Bar */}
          {isMobileMenuOpen && (
            <div className="xl:hidden mt-3 pt-3 border-t border-slate-200 space-y-1 animate-in fade-in duration-150">
              {navLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${item.active
                        ? "bg-blue-50 text-blue-700 font-bold"
                        : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <div className="border-t border-slate-200 pt-2 mt-2 flex flex-col gap-1">
                <Link
                  href="/guru/profil"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Profil Guru & Sekolah</span>
                </Link>

                <Link
                  href="/asesmen"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-blue-700 hover:bg-blue-50"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Uji Layar Siswa</span>
                </Link>

                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar dari Sesi</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </div>
      </header>

      {/* Modal Dialog Konfirmasi Keluar (Logout Confirmation Modal) */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 shadow-xl text-center space-y-4">

            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900">
                Keluar dari Akun Guru?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Sesi aktif untuk <strong className="text-slate-900">{teacher?.name || "Guru"}</strong> akan diakhiri. Anda perlu masuk kembali untuk mengelola asesmen dan melihat hasil siswa.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogoutAction}
                className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ya, Keluar</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
