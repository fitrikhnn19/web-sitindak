"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  ArrowLeft,
  Download,
  Calendar,
  Users,
  BookOpen,
  Layers,
  GraduationCap,
  KeyRound,
  ShieldAlert,
  User,
  LogOut,
  Building2,
  CheckCircle2,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ClassAssessmentSummary } from "@/lib/teacher-results-mock-data";
import { useTeacherAuth } from "@/lib/useTeacherAuth";
import { getAllAssessments, fetchAssessmentsFromSupabase } from "@/lib/assessment-management-store";

export interface AssessmentOption {
  tokenCode: string;
  title: string;
  className: string;
}

interface TeacherResultsHeaderProps {
  summary: ClassAssessmentSummary;
  selectedToken: string;
  onSelectToken: (token: string) => void;
  onOpenDownloadModal: () => void;
  onPrintPage: () => void;
  assessmentOptions?: AssessmentOption[];
}

export const TeacherResultsHeader: React.FC<TeacherResultsHeaderProps> = ({
  summary,
  selectedToken,
  onSelectToken,
  onOpenDownloadModal,
  onPrintPage,
  assessmentOptions,
}) => {
  const router = useRouter();
  const { teacher, isLoggedIn, logout } = useTeacherAuth();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMetaExpandedMobile, setIsMetaExpandedMobile] = useState(false);

  const [optionsList, setOptionsList] = useState<AssessmentOption[]>(() => {
    if (assessmentOptions && assessmentOptions.length > 0) return assessmentOptions;
    const initial = getAllAssessments();
    return initial.map((a) => ({
      tokenCode: a.token.code,
      title: a.title,
      className: a.className,
    }));
  });

  React.useEffect(() => {
    if (assessmentOptions && assessmentOptions.length > 0) {
      setOptionsList(assessmentOptions);
      return;
    }
    fetchAssessmentsFromSupabase().then((items) => {
      if (items && items.length > 0) {
        setOptionsList(
          items.map((a) => ({
            tokenCode: a.token.code,
            title: a.title,
            className: a.className,
          }))
        );
      }
    });
  }, [assessmentOptions]);

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    router.push("/guru/masuk?status=logged_out");
  };

  const currentTeacherName = teacher?.name || summary.teacherName;

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs print:static print:border-none print:shadow-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
          {/* Top bar: Back link, branding, token selector & desktop actions */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            
            {/* Left: Back & Branding */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                href="/guru"
                className="p-1.5 sm:p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Kembali ke Dasbor Guru"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-sm sm:text-lg font-bold text-slate-900 tracking-tight">
                      SITINDAK
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Hasil
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 hidden md:block">
                    Profil Pemahaman & Diagnostik Tiga Tingkat
                  </p>
                </div>
              </div>
            </div>

            {/* Middle: Assessment / Class selector (Compact & Responsive) */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative flex-1 max-w-[150px] sm:max-w-[200px]">
                <select
                  value={selectedToken}
                  onChange={(e) => onSelectToken(e.target.value)}
                  className="w-full text-xs font-semibold py-1.5 pl-2 sm:pl-2.5 pr-6 sm:pr-7 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 hover:border-blue-500 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors cursor-pointer truncate shadow-xs"
                  title="Pilih Token Asesmen Kelas"
                  aria-label="Pilih Token Asesmen Kelas"
                >
                  {!optionsList.some((o) => o.tokenCode === selectedToken) && (
                    <option value={selectedToken}>
                      {selectedToken ? `${summary.className || "Kelas"} (${selectedToken})` : "Belum Ada Asesmen"}
                    </option>
                  )}
                  {optionsList.map((opt) => (
                    <option key={opt.tokenCode} value={opt.tokenCode}>
                      {opt.className} ({opt.tokenCode})
                    </option>
                  ))}
                </select>
              </div>

              {/* Unduh button: Always visible because it's primary action */}
              <button
                onClick={onOpenDownloadModal}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all shrink-0"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Unduh Hasil</span>
              </button>
            </div>

            {/* Desktop-only action links */}
            <div className="hidden lg:flex items-center gap-2 print:hidden shrink-0">
              <Link
                href="/guru/asesmen"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Asesmen & Token</span>
              </Link>

              <Link
                href="/guru/soal"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Bank Soal</span>
              </Link>

              <Link
                href={`/guru/analisis-soal?token=${selectedToken}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Kualitas Soal</span>
              </Link>

              <button
                onClick={onPrintPage}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-xs"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>Cetak</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-0.5" />

              <Link
                href="/guru/profil"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentTeacherName.split(" ")[0]}</span>
              </Link>

              {isLoggedIn && (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-1.5 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-slate-300 transition-colors shadow-xs"
                  title="Keluar dari akun guru"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shrink-0"
              aria-label="Menu navigasi"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

          </div>

          {/* Mobile Accordion Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-2.5 pt-2.5 border-t border-slate-200 space-y-1 animate-in fade-in duration-150">
              <Link
                href="/guru"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Dasbor Utama Guru</span>
              </Link>

              <Link
                href="/guru/asesmen"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Kelola Asesmen & Token Kelas</span>
              </Link>

              <Link
                href="/guru/soal"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Bank Soal 3-Tier</span>
              </Link>

              <Link
                href={`/guru/analisis-soal?token=${selectedToken}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Analisis Kualitas Soal</span>
              </Link>

              <Link
                href="/asesmen"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50/60"
              >
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Uji Coba Layar Siswa</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onPrintPage();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left"
              >
                <BookOpen className="w-4 h-4 text-slate-500" />
                <span>Cetak Halaman Ini</span>
              </button>

              <div className="border-t border-slate-100 my-1 pt-1 flex items-center justify-between">
                <Link
                  href="/guru/profil"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600"
                >
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Profil: {currentTeacherName.split(" ")[0]}</span>
                </Link>

                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Assessment Metadata Banner (Compact & Collapsible on Mobile) */}
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              {/* Title & Token Pill */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[220px] sm:max-w-none">
                  {summary.assessmentTitle}
                </h1>
                <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-blue-50 border border-blue-200 text-blue-700">
                  {summary.className}
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Token: <strong className="text-blue-700">{summary.tokenCode}</strong>
                </span>

                {/* Mobile Info Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMetaExpandedMobile(!isMetaExpandedMobile)}
                  className="sm:hidden text-[10px] text-blue-600 font-semibold inline-flex items-center gap-0.5 ml-1"
                >
                  <span>{isMetaExpandedMobile ? "Tutup Info" : "Detail Info"}</span>
                  {isMetaExpandedMobile ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Status Pill */}
              <div className="hidden sm:flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Sesi Berjalan
                </span>
              </div>
            </div>

            {/* Extra details: Always on desktop, collapsible on mobile */}
            <div className={`flex items-center gap-4 text-slate-500 text-[11px] flex-wrap mt-1.5 ${isMetaExpandedMobile ? "flex" : "hidden sm:flex"}`}>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                <span>Pengampu: {currentTeacherName}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Partisipasi: <strong className="text-slate-900">{summary.completedCount}</strong>/{summary.totalQuota} siswa ({Math.round((summary.completedCount / Math.max(1, summary.totalQuota)) * 100)}%)
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Jadwal: 1 Nov – 10 Nov 2026</span>
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-6 shadow-xl text-center space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Keluar dari Akun Guru?
              </h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Anda akan keluar dari sesi guru aktif ({currentTeacherName}).
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
                onClick={handleLogout}
                className="flex-1 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-semibold text-white transition-colors flex items-center justify-center gap-1.5"
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
