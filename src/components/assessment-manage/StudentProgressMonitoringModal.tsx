"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  X,
  Users,
  Search,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  UserCheck,
  UserMinus,
  Check,
} from "lucide-react";
import {
  AssessmentItem,
  StudentProgress,
  simulateStudentEntry,
  simulateStudentSubmit,
  getRemainingQuota,
} from "@/lib/assessment-management-store";
import { QuotaProgressBar } from "./StatusBadges";

interface StudentProgressMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentItem | null;
  onAssessmentUpdated: (updated: AssessmentItem) => void;
}

export const StudentProgressMonitoringModal: React.FC<StudentProgressMonitoringModalProps> = ({
  isOpen,
  onClose,
  assessment,
  onAssessmentUpdated,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"semua" | "terkirim" | "berlangsung" | "belum_mulai">("semua");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationToast, setSimulationToast] = useState<string | null>(null);

  if (!isOpen || !assessment) return null;

  // Filter students
  const filteredStudents = assessment.students.filter((student) => {
    const matchSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "semua" || student.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Calculate summary counts
  const totalStudents = assessment.students.length;
  const completedCount = assessment.students.filter((s) => s.status === "terkirim").length;
  const inProgressCount = assessment.students.filter((s) => s.status === "berlangsung").length;
  const notStartedCount = assessment.students.filter((s) => s.status === "belum_mulai").length;
  const remainingQuota = getRemainingQuota(assessment.token);

  const completedPct = Math.round((completedCount / (totalStudents || 1)) * 100);
  const inProgressPct = Math.round((inProgressCount / (totalStudents || 1)) * 100);
  const notStartedPct = Math.round((notStartedCount / (totalStudents || 1)) * 100);

  // Simulation: student enters with token
  const handleSimulateEntry = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const res = simulateStudentEntry(assessment.id);
      setIsSimulating(false);
      setSimulationToast(res.message);
      if (res.assessment) {
        onAssessmentUpdated(res.assessment);
      }
      setTimeout(() => setSimulationToast(null), 3500);
    }, 400);
  };

  // Simulation: student submits answers
  const handleSimulateSubmit = () => {
    const inProg = assessment.students.find((s) => s.status === "berlangsung");
    if (!inProg) {
      setSimulationToast("Tidak ada siswa yang sedang dalam sesi pengerjaan.");
      setTimeout(() => setSimulationToast(null), 3000);
      return;
    }

    setIsSimulating(true);
    setTimeout(() => {
      const res = simulateStudentSubmit(assessment.id, inProg.id);
      setIsSimulating(false);
      setSimulationToast(res.message);
      if (res.assessment) {
        onAssessmentUpdated(res.assessment);
      }
      setTimeout(() => setSimulationToast(null), 3500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xl my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Pemantauan Pengerjaan Siswa
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {assessment.className}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  Token: {assessment.token.code}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate max-w-md">
                {assessment.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {simulationToast && (
          <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2 animate-in fade-in duration-200 shrink-0 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
            <span>{simulationToast}</span>
          </div>
        )}

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 shrink-0">
          {/* Total Siswa */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Siswa Kelas
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">{totalStudents}</span>
              <span className="text-xs text-slate-500">anak</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Kuota: {assessment.token.maxUses}
            </span>
          </div>

          {/* Selesai / Terkirim */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                Selesai (Terkirim)
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-emerald-900">{completedCount}</span>
              <span className="text-xs text-emerald-700">({completedPct}%)</span>
            </div>
            <span className="text-[10px] text-emerald-800 mt-0.5 block">
              Hasil diagnostik siap
            </span>
          </div>

          {/* Sedang Mengerjakan */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider">
                Sedang Mengerjakan
              </span>
              <span className="flex h-2 w-2 rounded-full bg-blue-600" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-blue-900">{inProgressCount}</span>
              <span className="text-xs text-blue-700">({inProgressPct}%)</span>
            </div>
            <span className="text-[10px] text-blue-800 mt-0.5 block">
              Sesi aktif saat ini
            </span>
          </div>

          {/* Belum Mulai */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Belum Membuka
              </span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-700">{notStartedCount}</span>
              <span className="text-xs text-slate-500">({notStartedPct}%)</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Sisa kuota: {remainingQuota}
            </span>
          </div>
        </div>

        {/* Quota bar & Simulation Bar */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-1/2">
            <QuotaProgressBar
              usedCount={assessment.token.usedCount}
              maxUses={assessment.token.maxUses}
              showDetails={true}
            />
          </div>

          {/* Simulation Controls for testing interactive real-time updates */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-slate-500 hidden lg:inline">Simulasi:</span>
            <button
              onClick={handleSimulateEntry}
              disabled={isSimulating || notStartedCount === 0 || remainingQuota === 0}
              className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1 shadow-sm"
              title="Simulasikan 1 siswa baru memasukkan token"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>+ Siswa Masuk</span>
            </button>

            <button
              onClick={handleSimulateSubmit}
              disabled={isSimulating || inProgressCount === 0}
              className="px-2.5 py-1.5 text-[11px] font-semibold rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 disabled:opacity-40 transition-all flex items-center gap-1 shadow-sm"
              title="Simulasikan 1 siswa selesai mengirim jawaban"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>✓ Siswa Kirim</span>
            </button>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-3 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter("semua")}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                statusFilter === "semua"
                  ? "bg-white text-blue-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua ({totalStudents})
            </button>
            <button
              onClick={() => setStatusFilter("terkirim")}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                statusFilter === "terkirim"
                  ? "bg-white text-emerald-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Terkirim ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter("berlangsung")}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                statusFilter === "berlangsung"
                  ? "bg-white text-blue-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Berlangsung ({inProgressCount})
            </button>
            <button
              onClick={() => setStatusFilter("belum_mulai")}
              className={`px-2.5 py-1 text-xs rounded-md transition-all ${
                statusFilter === "belum_mulai"
                  ? "bg-white text-slate-700 font-semibold shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Belum ({notStartedCount})
            </button>
          </div>
        </div>

        {/* Student List Table */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl bg-white divide-y divide-slate-100 pr-1 shadow-sm">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada siswa yang sesuai dengan filter pencarian.
            </div>
          ) : (
            filteredStudents.map((student, idx) => {
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("");

              return (
                <div
                  key={student.id}
                  className="p-3 sm:px-4 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  {/* Left: Avatar & Name */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-200">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {student.name}
                        </span>
                        {student.cheatingEventsCount && student.cheatingEventsCount > 0 ? (
                          <Link
                            href={`/guru/kecurangan?token=${assessment.token.code}`}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                            title="Buka Rekaman Kejadian Kecurangan Siswa"
                          >
                            <ShieldAlert className="w-3 h-3 text-rose-600" />
                            <span>{student.cheatingEventsCount}x Pindah Tab</span>
                          </Link>
                        ) : null}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        {student.status === "terkirim" && (
                          <>
                            <span>Selesai: {student.submittedAt?.split("T")[1]?.slice(0, 5) || "08:35"} WIB</span>
                            <span>•</span>
                            <span>Durasi: {student.durationMinutes || 30} mnt</span>
                          </>
                        )}
                        {student.status === "berlangsung" && (
                          <>
                            <span className="text-blue-700 font-medium">Sedang di Butir Soal #{student.currentQuestion || 5}</span>
                            <span>•</span>
                            <span>Mulai: 08:20 WIB</span>
                          </>
                        )}
                        {student.status === "belum_mulai" && (
                          <span className="text-slate-400">Belum memasukkan token</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Status Pill & Diagnostic Profile / Action */}
                  <div className="flex items-center gap-2 shrink-0">
                    {student.status === "terkirim" && (
                      <div className="flex items-center gap-2">
                        {/* 3-tier conception badge */}
                        <div className="hidden sm:flex items-center gap-1 text-[10px] font-semibold">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            P: {student.pahamCount ?? 8}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            M: {student.miskonsepsiCount ?? 2}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            B: {student.belumPahamCount ?? 0}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Terkirim</span>
                        </span>

                        <Link
                          href={`/guru/hasil?token=${assessment.token.code}&tab=student`}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-sm"
                          title="Lihat Profil Pemahaman Siswa di Dasbor Hasil"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}

                    {student.status === "berlangsung" && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span>Mengerjakan</span>
                      </span>
                    )}

                    {student.status === "belum_mulai" && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        <Clock className="w-3 h-3" />
                        <span>Belum Mulai</span>
                      </span>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0 mt-3">
          <p>
            *Status diperbarui otomatis setelah siswa mengirim jawaban.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
