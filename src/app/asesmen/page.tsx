"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  User,
  ArrowLeft,
  X,
  Maximize2,
  Minimize2,
  Clock,
  Menu,
} from "lucide-react";
import {
  MOCK_TOKENS,
  MOCK_QUESTIONS,
  AssessmentToken,
  StudentAnswer,
  ThreeTierQuestion,
  formatTimeRemaining,
} from "@/lib/assessment-mock-data";
import {
  CheatingEvent,
  CheatingEventType,
  recordStudentCheatingEvent,
} from "@/lib/cheating-detection-store";
import {
  fetchQuestionsForAssessment,
  submitStudentAssessmentToSupabase,
  recordCheatingLogToSupabase,
  recordStudentSessionStart,
} from "@/lib/student-submission-service";
import { AssessmentTokenEntry } from "@/components/assessment/AssessmentTokenEntry";
import { ThreeTierQuestionCard } from "@/components/assessment/ThreeTierQuestionCard";
import { QuestionNavigationPalette } from "@/components/assessment/QuestionNavigationPalette";
import { ReviewAnswersList } from "@/components/assessment/ReviewAnswersList";
import { SubmitConfirmationModal } from "@/components/assessment/SubmitConfirmationModal";
import { AssessmentResultsFeedback } from "@/components/assessment/AssessmentResultsFeedback";
import { AssessmentInstructions } from "@/components/assessment/AssessmentInstructions";

function AssessmentContent() {
  const searchParams = useSearchParams();
  const queryToken = searchParams.get("token") || "";

  // View state: 'entry' | 'instructions' | 'exam' | 'review' | 'results'
  const [view, setView] = useState<"entry" | "instructions" | "exam" | "review" | "results">("entry");
  const [token, setToken] = useState<AssessmentToken | null>(null);
  const [studentName, setStudentName] = useState("");
  const [startedAt, setStartedAt] = useState<string>("");
  const [submittedAt, setSubmittedAt] = useState<string>("");

  // Exam answers state: questionId -> StudentAnswer
  const [answers, setAnswers] = useState<Record<string, StudentAnswer>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // Modals & Navigation state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isMobilePaletteOpen, setIsMobilePaletteOpen] = useState(false);

  // Focus mode & Anti-cheat tracking
  const [cheatingEvents, setCheatingEvents] = useState<CheatingEvent[]>([]);
  const [cheatingCount, setCheatingCount] = useState(0);
  const [cheatingAlert, setCheatingAlert] = useState<{
    title: string;
    message: string;
    severity?: "rendah" | "sedang" | "tinggi";
  } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Duration & Countdown Timer state
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const hasWarned5MinRef = useRef(false);
  const hasWarned1MinRef = useRef(false);

  // Hidden start timestamp ref to measure duration outside tab
  const hiddenStartTimeRef = useRef<number | null>(null);
  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic questions configured for current assessment token
  const [examQuestions, setExamQuestions] = useState<ThreeTierQuestion[]>(MOCK_QUESTIONS);
  const currentQuestion = examQuestions[currentIndex] || examQuestions[0] || MOCK_QUESTIONS[0];

  // Helper to trigger alert without blocking
  const showAlert = (
    title: string,
    message: string,
    severity: "rendah" | "sedang" | "tinggi" = "sedang"
  ) => {
    if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
    setCheatingAlert({ title, message, severity });
    alertTimerRef.current = setTimeout(() => {
      setCheatingAlert(null);
    }, 6000);
  };

  // Helper: Log cheating event to store & state
  const handleLogEvent = (
    eventType: CheatingEventType,
    eventLabel: string,
    detail: string,
    severity: "rendah" | "sedang" | "tinggi" = "sedang",
    durationSeconds?: number
  ) => {
    if (!token || !studentName) return;

    const newEvt = recordStudentCheatingEvent({
      studentId: `std-live-${studentName.toLowerCase().replace(/\s+/g, "-")}`,
      studentName,
      className: token.className,
      tokenCode: token.code,
      eventType,
      eventLabel,
      occurredAt: new Date().toISOString(),
      detail,
      questionNumber: currentIndex + 1,
      questionTitle: currentQuestion ? currentQuestion.title : undefined,
      durationSeconds,
      severity,
    });

    // Kirim langsung ke tabel cheating_logs di Supabase
    recordCheatingLogToSupabase({
      studentId: `std-live-${studentName.toLowerCase().replace(/\s+/g, "-")}`,
      studentName,
      className: token.className,
      tokenCode: token.code,
      eventType,
      eventLabel,
      occurredAt: new Date().toISOString(),
      detail,
      questionNumber: currentIndex + 1,
      questionTitle: currentQuestion ? currentQuestion.title : undefined,
      durationSeconds,
      severity,
    });

    setCheatingEvents((prev) => [...prev, newEvt]);
    setCheatingCount((prev) => prev + 1);
  };

  // Countdown Timer Interval Effect
  useEffect(() => {
    if (view !== "exam" && view !== "review") return;
    if (remainingSeconds === null) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          showAlert(
            "Waktu Pengerjaan Telah Habis!",
            "Alokasi waktu asesmen telah selesai. Jawaban Anda otomatis disimpan dan dikirimkan.",
            "tinggi"
          );
          // Auto submit
          handleConfirmSubmit();
          return 0;
        }

        // Warnings at 5 minutes and 1 minute
        if (prev === 300 && !hasWarned5MinRef.current) {
          hasWarned5MinRef.current = true;
          showAlert(
            "Peringatan Sisa Waktu 5 Menit",
            "Waktu pengerjaan tersisa 5 menit lagi. Segera periksa kelengkapan jawaban 3 tingkat Anda.",
            "sedang"
          );
        } else if (prev === 60 && !hasWarned1MinRef.current) {
          hasWarned1MinRef.current = true;
          showAlert(
            "Peringatan Terakhir: 1 Menit Lagi",
            "Waktu pengerjaan tersisa 1 menit. Sistem akan otomatis mengunci dan mengirim jawaban saat waktu habis.",
            "tinggi"
          );
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [view, remainingSeconds]);

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(() => {});
      }
    }
  };

  // Visibility and Fraud Detection Effects
  useEffect(() => {
    if (view !== "exam" && view !== "review") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        hiddenStartTimeRef.current = Date.now();
      } else {
        if (hiddenStartTimeRef.current) {
          const duration = Math.round((Date.now() - hiddenStartTimeRef.current) / 1000);
          hiddenStartTimeRef.current = null;
          handleLogEvent(
            "pindah_tab",
            "Pindah Tab / Keluar Layar",
            `Siswa berpindah tab atau meminimalkan browser selama ${duration} detik`,
            duration > 15 ? "tinggi" : "sedang",
            duration
          );
          showAlert(
            "Aktivitas Terpantau Guru",
            `Anda terdeteksi meninggalkan layar asesmen selama ${duration} detik. Aktivitas ini dicatat dalam log integritas guru.`,
            "sedang"
          );
        }
      }
    };

    const handleWindowBlur = () => {
      if (!document.hidden && !hiddenStartTimeRef.current) {
        hiddenStartTimeRef.current = Date.now();
      }
    };

    const handleWindowFocus = () => {
      if (hiddenStartTimeRef.current && !document.hidden) {
        const duration = Math.round((Date.now() - hiddenStartTimeRef.current) / 1000);
        hiddenStartTimeRef.current = null;
        if (duration >= 2) {
          handleLogEvent(
            "keluar_halaman",
            "Jendela Kehilangan Fokus",
            `Fokus jendela asesmen beralih ke aplikasi lain selama ${duration} detik`,
            duration > 20 ? "tinggi" : "sedang",
            duration
          );
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [view, currentIndex, currentQuestion, token, studentName]);

  // Security listener: Prevent copy, paste, inspect, print-screen
  useEffect(() => {
    if (view !== "exam" && view !== "review") return;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      handleLogEvent(
        "klik_kanan",
        "Percobaan Klik Kanan",
        "Mencoba membuka menu klik kanan saat mengerjakan soal",
        "rendah"
      );
      showAlert(
        "Fitur Dibatasi",
        "Klik kanan dinonaktifkan selama asesmen berlangsung demi keamanan integritas soal.",
        "rendah"
      );
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+C, Ctrl+V, Ctrl+U, F12, PrintScreen
      if (
        (e.ctrlKey && (e.key === "c" || e.key === "C" || e.key === "v" || e.key === "V" || e.key === "u" || e.key === "U")) ||
        e.key === "F12" ||
        e.key === "PrintScreen"
      ) {
        e.preventDefault();
        const actionName = e.key === "F12" ? "DevTools Inspect" : e.key === "PrintScreen" ? "Tangkapan Layar" : `Kombinasi Ctrl+${e.key.toUpperCase()}`;
        handleLogEvent(
          "salin_soal",
          "Kombinasi Tombol Dilarang",
          `Menekan tombol pintas dilarang: ${actionName}`,
          "sedang"
        );
        showAlert(
          "Peringatan Pintasan Keyboard",
          `Tombol pintasan ${actionName} dinonaktifkan dalam mode fokus asesmen.`,
          "sedang"
        );
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [view, currentIndex, currentQuestion, token, studentName]);

  // Handle moving from token entry to instructions view
  const handleReadyForInstructions = (validToken: AssessmentToken, name: string) => {
    setToken(validToken);
    setStudentName(name);
    setAnswers({});
    setCurrentIndex(0);
    setCheatingCount(0);
    setCheatingEvents([]);
    setIsTimeUp(false);
    hasWarned5MinRef.current = false;
    hasWarned1MinRef.current = false;

    fetchQuestionsForAssessment(validToken.code).then((loadedQ) => {
      if (loadedQ && loadedQ.length > 0) {
        setExamQuestions(loadedQ);
      }
    });

    setView("instructions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle student starting the exam after reading and confirming instructions
  const handleStartExamFromInstructions = () => {
    if (!token) return;
    const nowIso = new Date().toISOString();
    setStartedAt(nowIso);

    if (token.durationMinutes && token.durationMinutes > 0) {
      setRemainingSeconds(token.durationMinutes * 60);
    } else {
      setRemainingSeconds(null);
    }

    recordStudentSessionStart(token.code, studentName);

    setView("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToEntry = () => {
    setView("entry");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle returning student who already submitted
  const handleAlreadySubmitted = (validToken: AssessmentToken, name: string) => {
    fetchQuestionsForAssessment(validToken.code).then((loadedQ) => {
      if (loadedQ && loadedQ.length > 0) {
        setExamQuestions(loadedQ);
      }
    });

    const storageKey = `sitindak_submission_${validToken.code}_${name.toLowerCase()}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setToken(validToken);
        setStudentName(name);
        setStartedAt(parsed.startedAt || new Date().toISOString());
        setSubmittedAt(parsed.submittedAt || new Date().toISOString());
        setAnswers(parsed.answers || {});
        setCheatingCount(parsed.cheatingCount || 0);
        setIsTimeUp(Boolean(parsed.submittedDueToTimeUp));
        setView("results");
        return;
      } catch {
        // fallback
      }
    }
    handleReadyForInstructions(validToken, name);
  };

  const handleAnswerChange = (answer: StudentAnswer) => {
    setAnswers((prev) => ({
      ...prev,
      [answer.questionId]: answer,
    }));
  };

  const handleSelectQuestion = (index: number) => {
    setCurrentIndex(index);
    setView("exam");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < examQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setView("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const completeCount = examQuestions.filter((q) => {
    const ans = answers[q.id];
    return Boolean(ans?.tier1Answer && ans?.tier2Answer && ans?.tier3Confidence);
  }).length;
  const incompleteCount = examQuestions.length - completeCount;

  const handleConfirmSubmit = () => {
    const nowIso = new Date().toISOString();
    setSubmittedAt(nowIso);
    setIsSubmitModalOpen(false);

    if (token) {
      const storageKey = `sitindak_submission_${token.code}_${studentName.toLowerCase()}`;
      const duration = Math.max(1, Math.round((Date.now() - new Date(startedAt).getTime()) / 60000));
      const payload = {
        tokenCode: token.code,
        studentName,
        startedAt,
        submittedAt: nowIso,
        durationMinutes: duration,
        answers,
        cheatingCount,
        cheatingEvents,
        questions: examQuestions,
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
      submitStudentAssessmentToSupabase(payload);
    }

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }

    setView("results");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetSession = () => {
    setView("entry");
    setToken(null);
    setStudentName("");
    setAnswers({});
    setCurrentIndex(0);
    setCheatingCount(0);
    setCheatingEvents([]);
    setCheatingAlert(null);
    setIsTimeUp(false);
    setRemainingSeconds(null);
    hasWarned5MinRef.current = false;
    hasWarned1MinRef.current = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* Logo & Product Name */}
          <div className="flex items-center gap-3">
            {view === "exam" || view === "review" ? (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0 cursor-default">
                <Compass className="w-4 h-4" />
              </div>
            ) : (
              <a
                href="/"
                className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shrink-0 hover:bg-blue-700 transition-colors"
              >
                <Compass className="w-4 h-4" />
              </a>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-slate-900">
                  SITINDAK
                </span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Three-Tier
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi
              </p>
            </div>
          </div>

          {/* Active Exam Status Header (when in exam or review) */}
          {token && (view === "exam" || view === "review") && (
            <div className="flex items-center gap-2 sm:gap-2.5">
              
              {/* Countdown Timer Badge */}
              {token.durationMinutes && token.durationMinutes > 0 ? (
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition-all ${
                    remainingSeconds !== null && remainingSeconds <= 60
                      ? "bg-rose-50 border-rose-300 text-rose-700 animate-pulse"
                      : remainingSeconds !== null && remainingSeconds <= 300
                      ? "bg-amber-50 border-amber-300 text-amber-800"
                      : "bg-slate-100 border-slate-200 text-slate-800"
                  }`}
                  title="Sisa Waktu Pengerjaan Asesmen"
                >
                  <Clock
                    className={`w-3.5 h-3.5 shrink-0 ${
                      remainingSeconds !== null && remainingSeconds <= 60
                        ? "text-rose-600"
                        : remainingSeconds !== null && remainingSeconds <= 300
                        ? "text-amber-600"
                        : "text-blue-600"
                    }`}
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-slate-500 uppercase font-sans hidden md:inline">
                      Sisa:
                    </span>
                    <span className="tracking-wider">
                      {formatTimeRemaining(remainingSeconds ?? token.durationMinutes * 60)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">Tanpa Batas</span>
                </div>
              )}

              {/* Focus mode indicator pill */}
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-[11px]">Mode Fokus</span>
              </div>

              {/* Fullscreen toggle button */}
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                title={isFullscreen ? "Keluar Layar Penuh" : "Masuk Mode Layar Penuh"}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden md:inline">Normal</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
                    <span className="hidden md:inline">Layar Penuh</span>
                  </>
                )}
              </button>

              {/* Progress bar pill */}
              <div className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
                <span className="text-slate-500">Progres:</span>
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{
                      width: `${(completeCount / examQuestions.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="font-mono font-bold text-slate-900">
                  {completeCount}/{examQuestions.length}
                </span>
              </div>

              {/* Student info badge */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 font-semibold">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[110px] sm:max-w-none truncate">
                  {studentName}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
                  {token.className}
                </span>
              </div>

              {/* Review button on header */}
              {view === "exam" && (
                <button
                  type="button"
                  onClick={() => setView("review")}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Review</span>
                </button>
              )}
            </div>
          )}

          {/* Back Home CTA on Entry View */}
          {view === "entry" && (
            <a
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Beranda</span>
            </a>
          )}
        </div>
      </header>

      {/* Floating Proctoring / Suspicious Activity Warning Banner */}
      {cheatingAlert && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-lg p-3.5 rounded-xl bg-amber-600 text-white shadow-xl flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top duration-200 border border-amber-700">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-white" />
            <div>
              <h4 className="text-xs font-bold tracking-wide uppercase">
                {cheatingAlert.title}
              </h4>
              <p className="text-xs text-amber-50 mt-0.5 leading-relaxed">
                {cheatingAlert.message}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setCheatingAlert(null)}
            className="p-1 hover:bg-black/20 rounded text-white shrink-0"
            title="Tutup Peringatan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Body Content based on View */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        {/* VIEW 1: TOKEN & STUDENT NAME ENTRY */}
        {view === "entry" && (
          <div className="max-w-2xl mx-auto py-6 sm:py-12">
            <AssessmentTokenEntry
              initialToken={queryToken}
              onStartSession={handleReadyForInstructions}
              onAlreadySubmitted={handleAlreadySubmitted}
            />
          </div>
        )}

        {/* VIEW 1.5: INSTRUCTIONS BEFORE EXAM */}
        {view === "instructions" && token && (
          <div className="py-4 sm:py-6">
            <AssessmentInstructions
              token={token}
              studentName={studentName}
              questionCount={examQuestions.length}
              onStartExam={handleStartExamFromInstructions}
              onBackToEntry={handleBackToEntry}
            />
          </div>
        )}

        {/* VIEW 2: ACTIVE 3-TIER EXAM IN FOCUS MODE */}
        {view === "exam" && token && (
          <div className="max-w-7xl mx-auto">
            {/* Top Exam Navigation Bar */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-emerald-700">Mode Fokus Aktif</span>
                <span className="hidden sm:inline text-slate-300">•</span>
                <span className="hidden sm:inline font-medium text-slate-800">{token.title}</span>
                {token.durationMinutes && token.durationMinutes > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-mono font-medium text-slate-700">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>Durasi {token.durationMinutes} m</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>Tanpa Batas</span>
                  </span>
                )}
                {cheatingCount > 0 && (
                  <span className="ml-1 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    <ShieldAlert className="w-3 h-3 text-amber-600" />
                    <span>{cheatingCount} Catatan Pengawasan</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMobilePaletteOpen(true)}
                  className="lg:hidden px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 shadow-xs flex items-center gap-1.5"
                >
                  <Menu className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kisi Soal (#{currentIndex + 1})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setView("review")}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
                  <span>Review & Kirim</span>
                </button>
              </div>
            </div>

            {/* Split Layout: Main Question Card (Left) & Question Palette (Right on desktop) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Question Main Card Area */}
              <div className="lg:col-span-8 xl:col-span-9 space-y-6">
                <ThreeTierQuestionCard
                  question={currentQuestion}
                  currentAnswer={answers[currentQuestion.id]}
                  onAnswerChange={handleAnswerChange}
                />

                {/* Bottom Prev / Next Navigation Bar for Desktop & Mobile */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-sm">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={handlePrevQuestion}
                    className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                      currentIndex === 0
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>

                  {/* Center Question Counter Indicator */}
                  <span className="text-xs text-slate-500 font-mono font-medium">
                    Soal {currentIndex + 1} dari {examQuestions.length}
                  </span>

                  {currentIndex < examQuestions.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setView("review")}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
                    >
                      <span>Review & Kirim</span>
                      <ClipboardList className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side Column (Desktop Question Palette) */}
              <div className="hidden lg:block lg:col-span-4 xl:col-span-3 sticky top-24">
                <QuestionNavigationPalette
                  questions={examQuestions}
                  currentIndex={currentIndex}
                  answers={answers}
                  onSelectQuestion={handleSelectQuestion}
                  onOpenReview={() => setView("review")}
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: REVIEW ANSWERS BEFORE SUBMIT */}
        {view === "review" && (
          <ReviewAnswersList
            questions={examQuestions}
            answers={answers}
            onJumpToQuestion={(idx) => {
              setCurrentIndex(idx);
              setView("exam");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onBackToExam={() => {
              setView("exam");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onRequestSubmit={() => setIsSubmitModalOpen(true)}
            remainingSeconds={remainingSeconds}
            durationMinutes={token?.durationMinutes}
          />
        )}

        {/* VIEW 4: DIAGNOSTIC RESULTS & REFLECTIVE FEEDBACK */}
        {view === "results" && token && (
          <div className="space-y-4">
            {isTimeUp && (
              <div className="max-w-4xl mx-auto p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-950">
                    Waktu Pengerjaan Asesmen Telah Habis
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    Alokasi durasi asesmen ({token.durationMinutes} menit) telah berakhir. Seluruh jawaban yang sempat Anda isi telah otomatis disimpan dan dievaluasi status konsepsinya di bawah ini.
                  </p>
                </div>
              </div>
            )}
            <AssessmentResultsFeedback
              studentName={studentName}
              className={token.className}
              assessmentTitle={token.title}
              teacherName={token.teacherName}
              submittedAt={submittedAt}
              questions={examQuestions}
              answers={answers}
              tokenCode={token.code}
              onResetSession={handleResetSession}
              cheatingEventsCount={cheatingCount}
            />
          </div>
        )}
      </main>

      {/* Mobile Drawer Modal for Question Navigation Palette */}
      {isMobilePaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 p-5 shadow-xl relative">
            <button
              type="button"
              onClick={() => setIsMobilePaletteOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <QuestionNavigationPalette
              questions={examQuestions}
              currentIndex={currentIndex}
              answers={answers}
              onSelectQuestion={(idx) => {
                handleSelectQuestion(idx);
                setIsMobilePaletteOpen(false);
              }}
              onOpenReview={() => {
                setIsMobilePaletteOpen(false);
                setView("review");
              }}
            />
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onConfirmSubmit={handleConfirmSubmit}
        totalQuestions={examQuestions.length}
        completeCount={completeCount}
        incompleteCount={incompleteCount}
        remainingSeconds={remainingSeconds}
      />
    </div>
  );
}

export default function AssessmentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
          <span>Memuat gerbang asesmen...</span>
        </div>
      }
    >
      <AssessmentContent />
    </Suspense>
  );
}
