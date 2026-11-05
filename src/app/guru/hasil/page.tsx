"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table2,
  Compass,
  FileText,
  Sparkles,
  ShieldAlert,
  Users,
} from "lucide-react";
import {
  getAssessmentSummaryByToken,
  fetchAssessmentSummaryFromSupabase,
  ClassAssessmentSummary,
} from "@/lib/teacher-results-mock-data";
import { getAllAssessments, fetchAssessmentsFromSupabase } from "@/lib/assessment-management-store";
import { TeacherResultsHeader, AssessmentOption } from "@/components/dashboard/TeacherResultsHeader";
import { DiagnosticSummaryCards } from "@/components/dashboard/DiagnosticSummaryCards";
import { StudentUnderstandingMatrix } from "@/components/dashboard/StudentUnderstandingMatrix";
import { PrerequisiteMapPanel } from "@/components/dashboard/PrerequisiteMapPanel";
import { IndividualStudentReport } from "@/components/dashboard/IndividualStudentReport";
import { QuestionDetailModal } from "@/components/dashboard/QuestionDetailModal";
import { DownloadResultsModal } from "@/components/dashboard/DownloadResultsModal";
import { QuestionQualityDashboard } from "@/components/question-quality/QuestionQualityDashboard";
import { CheatingReportDashboard } from "@/components/cheating-detection/CheatingReportDashboard";

type ActiveTab = "matrix" | "map" | "student" | "quality" | "cheating";

function TeacherResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Query params
  const initialToken = searchParams.get("token") || "";
  const initialTab = (searchParams.get("tab") as ActiveTab) || "matrix";
  const initialStudentId = searchParams.get("student") || "";

  // State
  const [selectedToken, setSelectedToken] = useState<string>(initialToken);
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudentId || "std-01"
  );
  const [activeQuestionModalId, setActiveQuestionModalId] = useState<string | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [summary, setSummary] = useState<ClassAssessmentSummary>(() =>
    getAssessmentSummaryByToken(initialToken)
  );

  const [assessmentOptions, setAssessmentOptions] = useState<AssessmentOption[]>(() => {
    return getAllAssessments().map((a) => ({
      tokenCode: a.token.code,
      title: a.title,
      className: a.className,
    }));
  });

  // Load assessments list from Supabase
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

  // Sync state with URL params & load fresh data from Supabase
  useEffect(() => {
    const qToken = searchParams.get("token") || selectedToken;
    if (qToken) {
      setSelectedToken(qToken);
      setSummary(getAssessmentSummaryByToken(qToken));
      fetchAssessmentSummaryFromSupabase(qToken).then((remote) => {
        if (remote) {
          setSummary(remote);
          if (remote.students.length > 0 && !remote.students.some((s) => s.id === selectedStudentId)) {
            setSelectedStudentId(remote.students[0].id);
          }
        }
      });
    }

    const qTab = searchParams.get("tab") as ActiveTab;
    if (qTab && ["matrix", "map", "student", "quality", "cheating"].includes(qTab)) {
      setActiveTab(qTab);
    }
    const qStudent = searchParams.get("student");
    if (qStudent) {
      setSelectedStudentId(qStudent);
    }
  }, [searchParams]);

  // Handlers
  const handleSelectToken = (token: string) => {
    setSelectedToken(token);
    setSummary(getAssessmentSummaryByToken(token));
    fetchAssessmentSummaryFromSupabase(token).then((remote) => {
      if (remote) {
        setSummary(remote);
        if (remote.students.length > 0 && !remote.students.some((s) => s.id === selectedStudentId)) {
          setSelectedStudentId(remote.students[0].id);
        }
      }
    });
    router.push(`/guru/hasil?token=${token}&tab=${activeTab}`);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === "student") {
      router.push(`/guru/hasil?token=${selectedToken}&tab=${tab}&student=${selectedStudentId}`);
    } else {
      router.push(`/guru/hasil?token=${selectedToken}&tab=${tab}`);
    }
  };

  const handleViewStudentReport = (studentId: string) => {
    setSelectedStudentId(studentId);
    setActiveTab("student");
    router.push(`/guru/hasil?token=${selectedToken}&tab=student&student=${studentId}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrintPage = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Sticky Teacher Header */}
      <TeacherResultsHeader
        summary={summary}
        selectedToken={selectedToken}
        onSelectToken={handleSelectToken}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onPrintPage={handlePrintPage}
        assessmentOptions={assessmentOptions}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Diagnostic Overview Metric Cards (Hidden on student report print) */}
        <div className="print:hidden">
          <DiagnosticSummaryCards summary={summary} />
        </div>

        {/* Tab Navigation Controls (Sub-features switcher) */}
        <div className="flex border border-slate-200 bg-white p-1 rounded-xl shadow-xs print:hidden gap-1 overflow-x-auto">
          {/* Tab 1: Matriks Status Siswa */}
          <button
            onClick={() => handleTabChange("matrix")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "matrix"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Table2 className="w-4 h-4" />
            <span>Matriks Pemahaman per Butir</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${activeTab === "matrix" ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"}`}>
              {summary.completedCount} Siswa
            </span>
          </button>

          {/* Tab 2: Peta Materi Prasyarat */}
          <button
            onClick={() => handleTabChange("map")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "map"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Peta Materi Prasyarat</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${activeTab === "map" ? "bg-amber-400 text-amber-950" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
              Tindak Lanjut
            </span>
          </button>

          {/* Tab 3: Laporan Tiap Siswa */}
          <button
            onClick={() => handleTabChange("student")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "student"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Laporan Tiap Siswa</span>
          </button>

          {/* Tab 4: Analisis Kualitas Soal */}
          <button
            onClick={() => handleTabChange("quality")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "quality"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <span>Analisis Kualitas Soal</span>
          </button>

          {/* Tab 5: Deteksi Kecurangan Ujian */}
          <button
            onClick={() => handleTabChange("cheating")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === "cheating"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-600 group-hover:text-amber-700" />
            <span>Deteksi Kecurangan</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div>
          {summary.students.length === 0 && (activeTab === "matrix" || activeTab === "map" || activeTab === "student") ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Belum Ada Data Hasil & Profil Pemahaman Siswa
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                Belum ada siswa yang menyelesaikan asesmen diagnostik ini. Silakan buat asesmen baru di modul Asesmen dan bagikan token kelas kepada siswa untuk mulai mengumpulkan data konsepsi tiga tingkat.
              </p>
              <div className="inline-flex items-center gap-3">
                <Link
                  href="/guru/asesmen"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
                >
                  <span>+ Buat Asesmen Baru</span>
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Tab 1: Matriks Siswa */}
              {activeTab === "matrix" && (
                <StudentUnderstandingMatrix
                  summary={summary}
                  onViewStudentReport={handleViewStudentReport}
                  onSelectQuestion={(qId) => setActiveQuestionModalId(qId)}
                />
              )}

              {/* Tab 2: Peta Materi Prasyarat */}
              {activeTab === "map" && (
                <PrerequisiteMapPanel
                  summary={summary}
                  onSelectQuestion={(qId) => setActiveQuestionModalId(qId)}
                />
              )}

              {/* Tab 3: Laporan Individual Siswa */}
              {activeTab === "student" && (
                <IndividualStudentReport
                  studentId={selectedStudentId}
                  summary={summary}
                  onSelectStudent={(id) => {
                    setSelectedStudentId(id);
                    router.push(`/guru/hasil?token=${selectedToken}&tab=student&student=${id}`);
                  }}
                  onBackToMatrix={() => handleTabChange("matrix")}
                />
              )}
            </>
          )}

          {/* Tab 4: Analisis Kualitas Soal */}
          {activeTab === "quality" && (
            <QuestionQualityDashboard summary={summary} />
          )}

          {/* Tab 5: Deteksi Kecurangan Ujian */}
          {activeTab === "cheating" && (
            <CheatingReportDashboard
              initialToken={selectedToken}
              onSelectToken={handleSelectToken}
            />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-5 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            SITINDAK — Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi © 2026
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Profil Pemahaman Tiga Tingkat Siswa</span>
            <span>•</span>
            <button
              onClick={() => setIsDownloadModalOpen(true)}
              className="text-blue-600 hover:underline font-semibold"
            >
              Unduh Hasil (.csv)
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Question Detail Modal */}
      <QuestionDetailModal
        questionId={activeQuestionModalId}
        summary={summary}
        onClose={() => setActiveQuestionModalId(null)}
        onViewStudentReport={handleViewStudentReport}
      />

      {/* Download Results Modal */}
      <DownloadResultsModal
        isOpen={isDownloadModalOpen}
        summary={summary}
        onClose={() => setIsDownloadModalOpen(false)}
        onPrintPage={handlePrintPage}
      />

    </div>
  );
}

export default function TeacherResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Memuat Profil Pemahaman Siswa...</p>
          </div>
        </div>
      }
    >
      <TeacherResultsContent />
    </Suspense>
  );
}
