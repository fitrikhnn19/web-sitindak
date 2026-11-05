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
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:static print:border-none print:shadow-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          {/* Top bar: Back link, branding & actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/guru"
                className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="Kembali ke Dasbor Guru"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                  <Compass className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                      SITINDAK
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                      Dasbor Guru
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 hidden sm:block">
                    Profil Pemahaman Siswa & Diagnostik Tiga Tingkat
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons: Nav Links, Download & Profil */}
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              {/* Link to Assessment & Token Management */}
              <Link
                href="/guru/asesmen"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors shadow-sm"
                title="Kelola Asesmen & Token Kelas"
              >
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Asesmen & Token</span>
              </Link>

              {/* Link to Question Bank */}
              <Link
                href="/guru/soal"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors shadow-sm"
                title="Buka Bank Soal Tiga Tingkat"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Bank Soal</span>
              </Link>

              {/* Link to Question Quality Analysis */}
              <Link
                href={`/guru/analisis-soal?token=${selectedToken}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors shadow-sm"
                title="Analisis Kualitas Soal"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Kualitas Soal</span>
              </Link>

              {/* Assessment / Class selector */}
              <div className="relative">
                <select
                  value={selectedToken}
                  onChange={(e) => onSelectToken(e.target.value)}
                  className="text-xs font-semibold py-1.5 pl-2.5 pr-7 rounded-lg bg-slate-50 border border-slate-300 text-slate-800 hover:border-blue-500 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors cursor-pointer max-w-[190px] truncate"
                  title="Pilih Token Asesmen Kelas"
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

              {/* Print Button */}
              <button
                onClick={onPrintPage}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-sm"
                title="Cetak Halaman ini"
              >
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden md:inline">Cetak</span>
              </button>

              {/* Unduh Hasil Button */}
              <button
                onClick={onOpenDownloadModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5 text-white" />
                <span>Unduh Hasil</span>
              </button>

              <div className="h-4 w-px bg-slate-200 mx-0.5 hidden sm:block" />

              {/* Profile Guru Link */}
              <Link
                href="/guru/profil"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors"
                title="Atur Profil & Sekolah Guru"
              >
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden lg:inline">{currentTeacherName.split(" ")[0]}</span>
              </Link>

              {/* Logout Button */}
              {isLoggedIn && (
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="p-1.5 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-600 text-slate-500 border border-slate-300 transition-colors"
                  title="Keluar dari akun guru"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Assessment Metadata Banner */}
          <div className="mt-4 pt-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-bold text-slate-900">
                  {summary.assessmentTitle}
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 border border-blue-200 text-blue-700">
                  {summary.className}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  Token: <strong className="text-blue-700">{summary.tokenCode}</strong>
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-500 text-[11px] flex-wrap">
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Pengampu: {currentTeacherName}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Partisipasi: <strong className="text-slate-900">{summary.completedCount}</strong> dari {summary.totalQuota} siswa ({Math.round((summary.completedCount / summary.totalQuota) * 100)}%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Jadwal: 1 Nov – 10 Nov 2026</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Sesi Berjalan
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
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
