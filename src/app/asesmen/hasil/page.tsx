"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  Clock,
  AlertTriangle,
  RotateCcw,
  User,
  Users,
} from "lucide-react";
import { MOCK_QUESTIONS, ThreeTierQuestion } from "@/lib/assessment-mock-data";
import {
  checkAccessValidity,
  getStudentSubmission,
  fetchStudentSubmissionFromSupabase,
  PRESET_STUDENT_PROFILES,
  StudentSubmissionData,
  AccessValidityResult,
} from "@/lib/student-results-store";
import { fetchQuestionsForAssessment } from "@/lib/student-submission-service";
import { AssessmentResultsFeedback } from "@/components/assessment/AssessmentResultsFeedback";

function HasilContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Query parameters
  const queryToken = searchParams.get("token") || "";
  const querySiswa = searchParams.get("siswa") || "";
  const querySimulasi = searchParams.get("simulasi");

  // State
  const [selectedToken, setSelectedToken] = useState<string>(queryToken);
  const [selectedStudentName, setSelectedStudentName] = useState<string>(querySiswa);
  const [simulateExpired, setSimulateExpired] = useState<boolean>(querySimulasi === "expired");
  const [showDemoSelector, setShowDemoSelector] = useState<boolean>(false);
  const [resultQuestions, setResultQuestions] = useState<ThreeTierQuestion[]>(MOCK_QUESTIONS);
  const [submissionData, setSubmissionData] = useState<StudentSubmissionData>(() =>
    getStudentSubmission(queryToken, querySiswa)
  );

  // Sync with searchParams & revalidate from Supabase
  useEffect(() => {
    const qToken = searchParams.get("token") || selectedToken;
    const qSiswa = searchParams.get("siswa") || selectedStudentName;
    const qSim = searchParams.get("simulasi");

    if (qToken) setSelectedToken(qToken);
    if (qSiswa) setSelectedStudentName(qSiswa);
    setSimulateExpired(qSim === "expired");

    // Muat data lokal seketika
    const local = getStudentSubmission(qToken, qSiswa);
    setSubmissionData(local);

    // Revalidasi soal dari Supabase
    fetchQuestionsForAssessment(qToken).then((qList) => {
      if (qList && qList.length > 0) {
        setResultQuestions(qList);
      }
    });

    // Revalidasi submission dari Supabase
    fetchStudentSubmissionFromSupabase(qToken, qSiswa).then((remoteSub) => {
      if (remoteSub) {
        setSubmissionData(remoteSub);
      }
    });
  }, [searchParams]);

  const accessCheck: AccessValidityResult = checkAccessValidity(selectedToken, simulateExpired);

  const handleSelectStudentProfile = (name: string) => {
    setSelectedStudentName(name);
    router.push(`/asesmen/hasil?token=${encodeURIComponent(selectedToken)}&siswa=${encodeURIComponent(name)}${simulateExpired ? "&simulasi=expired" : ""}`);
  };

  const handleToggleSimulateExpired = (expired: boolean) => {
    setSimulateExpired(expired);
    router.push(
      `/asesmen/hasil?token=${encodeURIComponent(selectedToken)}&siswa=${encodeURIComponent(
        selectedStudentName
      )}${expired ? "&simulasi=expired" : ""}`
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0 hover:bg-blue-700 transition-colors"
            >
              <Compass className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  SITINDAK
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Hasil & Refleksi Siswa
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi
              </p>
            </div>
          </div>

          {/* Right Header Navigation */}
          <div className="flex items-center gap-2.5">
            {PRESET_STUDENT_PROFILES.length > 0 && (
            <button
              type="button"
              onClick={() => setShowDemoSelector(!showDemoSelector)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Uji Skenario Siswa & Masa Berlaku</span>
              <span className="sm:hidden">Skenario</span>
            </button>
          )}

            <Link
              href="/asesmen"
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Ke Gerbang Asesmen</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Demo Scenario Switcher Panel (Collapsible for Evaluators) */}
      {showDemoSelector && (
        <div className="bg-slate-100 border-b border-slate-200 p-4 sm:p-5 shadow-xs animate-in slide-in-from-top duration-200">
          <div className="max-w-4xl mx-auto space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Panel Pengujian Skenario Hasil Diagnostik Siswa</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDemoSelector(false)}
                className="text-slate-500 hover:text-slate-800 text-xs underline"
              >
                Tutup Panel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Preset Student Personas */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Pilih Profil Diagnostik Siswa:
                </span>
                <div className="space-y-1.5">
                  {PRESET_STUDENT_PROFILES.map((profile) => {
                    const isCurrent = selectedStudentName.toLowerCase() === profile.name.toLowerCase();
                    return (
                      <button
                        key={profile.id}
                        type="button"
                        onClick={() => handleSelectStudentProfile(profile.name)}
                        className={`w-full p-2.5 rounded-lg text-left transition-all flex items-center justify-between border ${
                          isCurrent
                            ? "bg-blue-50 border-blue-300 text-blue-900 font-semibold shadow-xs"
                            : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{profile.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {profile.id === "std-01" ? "8 Paham" : profile.id === "std-02" ? "5 Miskonsepsi" : "5 Belum Paham"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Expiration Simulation */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Uji Masa Berlaku / Akses Kedaluwarsa:
                </span>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs">
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Siswa dapat membuka kembali halaman hasil selama tautan/sesi asesmen masih dibuka guru. Saat asesmen ditutup, halaman menampilkan pemberitahuan yang jelas.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSimulateExpired(false)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs border transition-all ${
                        !simulateExpired
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      ✓ Sesi Aktif (Berlaku)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleSimulateExpired(true)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs border transition-all ${
                        simulateExpired
                          ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      ✗ Simulasi Kedaluwarsa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Body */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        {!selectedToken || !selectedStudentName || Object.keys(submissionData.answers).length === 0 ? (
          <div className="max-w-2xl mx-auto py-12 animate-in fade-in duration-300">
            <div className="rounded-2xl bg-white border border-slate-200 p-7 sm:p-10 shadow-sm space-y-5 text-center">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                <Compass className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Belum Ada Rekaman Hasil Pengerjaan
                </h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                  Tidak ditemukan rekaman jawaban siswa untuk sesi ini. Silakan masukkan token asesmen yang diberikan oleh guru untuk mulai mengerjakan.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/asesmen"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ke Halaman Masuk Asesmen</span>
                </Link>
              </div>
            </div>
          </div>
        ) : /* CONDITION A: EXPIRED OR INVALID ACCESS */
        !accessCheck.isValid ? (
          <div className="max-w-2xl mx-auto py-12 animate-in fade-in duration-300">
            <div className="rounded-2xl bg-white border border-rose-200 p-7 sm:p-10 shadow-sm space-y-5 text-center">
              
              <div className="w-14 h-14 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
                <Clock className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Akses Tidak Berlaku</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                  {accessCheck.title}
                </h2>
                <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed pt-1">
                  {accessCheck.message}
                </p>
              </div>

              {/* Informational Details Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Kode Asesmen:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedToken}</span>
                </div>
                {accessCheck.teacherName && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Guru Pengampu:</span>
                    <span className="text-slate-900 font-medium">{accessCheck.teacherName}</span>
                  </div>
                )}
                {accessCheck.closesAt && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Jadwal Tutup:</span>
                    <span className="text-slate-900 font-medium">
                      {new Date(accessCheck.closesAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}{" "}
                      WIB
                    </span>
                  </div>
                )}
              </div>

              {/* Call to Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <Link
                  href="/asesmen"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Masukkan Token Lain</span>
                </Link>

                <button
                  type="button"
                  onClick={() => handleToggleSimulateExpired(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-300 shadow-sm transition-colors"
                >
                  Uji Coba Sesi Aktif
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* CONDITION B: VALID ACCESS */
          <AssessmentResultsFeedback
            studentName={submissionData.studentName}
            className={submissionData.className}
            assessmentTitle={submissionData.assessmentTitle}
            teacherName={submissionData.teacherName}
            submittedAt={submissionData.submittedAt}
            questions={resultQuestions}
            answers={submissionData.answers}
            tokenCode={selectedToken}
            onResetSession={() => router.push("/asesmen")}
          />
        )}
      </main>
    </div>
  );
}

export default function StudentResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
          <span>Memuat hasil dan pembahasan diagnostik...</span>
        </div>
      }
    >
      <HasilContent />
    </Suspense>
  );
}
