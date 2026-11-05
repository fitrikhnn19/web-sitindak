"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Table2,
} from "lucide-react";
import {
  getAssessmentSummaryByToken,
  fetchAssessmentSummaryFromSupabase,
  ClassAssessmentSummary,
} from "@/lib/teacher-results-mock-data";
import { getAllAssessments, fetchAssessmentsFromSupabase } from "@/lib/assessment-management-store";
import { QuestionQualityDashboard } from "@/components/question-quality/QuestionQualityDashboard";
import { TeacherSessionHeader } from "@/components/dashboard/TeacherSessionHeader";

function AnalisisKualitasContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialToken = searchParams.get("token") || "";
  const [selectedToken, setSelectedToken] = useState<string>(initialToken);
  const [summary, setSummary] = useState<ClassAssessmentSummary>(() =>
    getAssessmentSummaryByToken(initialToken)
  );

  const [assessmentOptions, setAssessmentOptions] = useState<
    Array<{ tokenCode: string; title: string; className: string }>
  >(() => {
    return getAllAssessments().map((a) => ({
      tokenCode: a.token.code,
      title: a.title,
      className: a.className,
    }));
  });

  // Load available assessments from Supabase
  useEffect(() => {
    fetchAssessmentsFromSupabase().then((items) => {
      if (items && items.length > 0) {
        setAssessmentOptions(
          items.map((a) => ({
            tokenCode: a.token.code,
            title: a.title,
            className: a.className,
          }))
        );
      }
    });
  }, []);

  // Sync token from URL param and load real assessment data from Supabase
  useEffect(() => {
    const qToken = searchParams.get("token") || selectedToken;
    if (qToken) {
      setSelectedToken(qToken);
      setSummary(getAssessmentSummaryByToken(qToken));
      fetchAssessmentSummaryFromSupabase(qToken).then((remote) => {
        if (remote) setSummary(remote);
      });
    }
  }, [searchParams]);

  const handleSelectToken = (token: string) => {
    setSelectedToken(token);
    setSummary(getAssessmentSummaryByToken(token));
    fetchAssessmentSummaryFromSupabase(token).then((remote) => {
      if (remote) setSummary(remote);
    });
    router.push(`/guru/analisis-soal?token=${token}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      {/* Teacher Session Header */}
      <TeacherSessionHeader
        currentModule="kualitas"
        title="Kualitas Soal"
        subtitle="Analisis Kualitas Soal (Tingkat Kesukaran, Daya Pembeda, Validitas & Reliabilitas)"
      />

      {/* Class & Token Subheader */}
      <div className="bg-white border-b border-slate-200 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/guru/hasil"
              className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
              title="Kembali ke Hasil Siswa"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">
                  Evaluasi Psikometrik: {summary.className !== "-" ? summary.className : "Semua Asesmen"}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {summary.tokenCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Pengampu: {summary.teacherName} • Partisipasi: {summary.completedCount} Siswa
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedToken}
              onChange={(e) => handleSelectToken(e.target.value)}
              className="text-xs font-semibold py-1.5 pl-3 pr-8 rounded-lg bg-white border border-slate-300 text-slate-800 hover:border-blue-500 focus:outline-none focus:border-blue-600 transition-colors cursor-pointer max-w-[260px] truncate shadow-xs"
              title="Pilih Token Asesmen"
            >
              {!assessmentOptions.some((o) => o.tokenCode === selectedToken) && (
                <option value={selectedToken}>
                  {summary.className} ({selectedToken})
                </option>
              )}
              {assessmentOptions.map((opt) => (
                <option key={opt.tokenCode} value={opt.tokenCode}>
                  {opt.className} ({opt.tokenCode})
                </option>
              ))}
            </select>

            <Link
              href={`/guru/hasil?token=${selectedToken}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 transition-colors shadow-xs"
            >
              <Table2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Profil Siswa</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <QuestionQualityDashboard summary={summary} />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            SITINDAK — Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi © 2026
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Analisis Kualitas Soal Tiga Tingkat</span>
            <span>•</span>
            <Link
              href={`/guru/hasil?token=${selectedToken}&tab=quality`}
              className="text-blue-600 hover:underline font-semibold"
            >
              Buka di Tab Hasil Asesmen
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function AnalisisKualitasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Memuat Analisis Kualitas Soal...</p>
          </div>
        </div>
      }
    >
      <AnalisisKualitasContent />
    </Suspense>
  );
}
