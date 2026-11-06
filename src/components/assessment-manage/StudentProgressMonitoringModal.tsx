"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  Users,
  Search,
  CheckCircle2,
  Clock,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  Copy,
  Check,
} from "lucide-react";
import {
  AssessmentItem,
  StudentProgress,
  getRemainingQuota,
} from "@/lib/assessment-management-store";
import { fetchAssessmentRealStudents } from "@/lib/student-submission-service";
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
  const [statusFilter, setStatusFilter] = useState<"semua" | "terkirim" | "berlangsung">("semua");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [realStudents, setRealStudents] = useState<StudentProgress[]>([]);

  // Sinkronisasi data siswa riil saat modal dibuka
  useEffect(() => {
    if (!isOpen || !assessment) return;

    let isMounted = true;

    // Bersihkan data dummy dari cache assessment awal
    const initialReal = Array.isArray(assessment.students)
      ? assessment.students.filter((s) => s.status === "berlangsung" || s.status === "terkirim")
      : [];
    setRealStudents(initialReal);

    const loadRealData = async () => {
      const subs = await fetchAssessmentRealStudents(assessment.id, assessment.token.code);
      if (!isMounted) return;

      const map = new Map<string, StudentProgress>();
      // Masukkan yang sudah ada di local assessment jika valid
      initialReal.forEach((s) => map.set(s.name.toLowerCase().trim(), s));
      // Timpa / tambahkan dari database Supabase
      subs.forEach((s) => map.set(s.name.toLowerCase().trim(), s));

      const merged = Array.from(map.values());
      setRealStudents(merged);

      if (merged.length !== assessment.students.length) {
        onAssessmentUpdated({
          ...assessment,
          students: merged,
          token: {
            ...assessment.token,
            usedCount: Math.max(assessment.token.usedCount, merged.length),
          },
        });
      }
    };

    loadRealData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, assessment?.id, assessment?.token.code]);

  if (!isOpen || !assessment) return null;

  // Manual refresh pengerjaan siswa
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const subs = await fetchAssessmentRealStudents(assessment.id, assessment.token.code);
      const map = new Map<string, StudentProgress>();
      subs.forEach((s) => map.set(s.name.toLowerCase().trim(), s));
      const merged = Array.from(map.values());
      setRealStudents(merged);

      onAssessmentUpdated({
        ...assessment,
        students: merged,
        token: {
          ...assessment.token,
          usedCount: Math.max(assessment.token.usedCount, merged.length),
        },
      });
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(assessment.token.code);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Filter siswa riil
  const filteredStudents = realStudents.filter((student) => {
    const matchSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "semua" || student.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Kalkulasi statistik riil
  const totalAccessed = realStudents.length;
  const completedCount = realStudents.filter((s) => s.status === "terkirim").length;
  const inProgressCount = realStudents.filter((s) => s.status === "berlangsung").length;
  const maxQuota = assessment.token.maxUses;
  const remainingQuota = Math.max(0, maxQuota - totalAccessed);

  const completedPct = totalAccessed > 0 ? Math.round((completedCount / totalAccessed) * 100) : 0;
  const inProgressPct = totalAccessed > 0 ? Math.round((inProgressCount / totalAccessed) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xl my-8 flex flex-col max-h-[90vh]">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
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
              <p className="text-xs text-slate-500 truncate max-w-md mt-0.5">
                {assessment.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 shrink-0">
          {/* Siswa Mengakses */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
              Siswa Mengakses
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-900">{totalAccessed}</span>
              <span className="text-xs text-slate-500">anak</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
              Kuota kelas: {maxQuota} siswa
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
            <span className="text-[10px] text-emerald-800 mt-0.5 block truncate">
              {completedCount > 0 ? "Hasil diagnostik siap" : "Belum ada terkirim"}
            </span>
          </div>

          {/* Sedang Mengerjakan */}
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-blue-800 uppercase tracking-wider">
                Sedang Mengerjakan
              </span>
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-blue-900">{inProgressCount}</span>
              <span className="text-xs text-blue-700">({inProgressPct}%)</span>
            </div>
            <span className="text-[10px] text-blue-800 mt-0.5 block truncate">
              Sesi aktif saat ini
            </span>
          </div>

          {/* Sisa Kuota Belum Masuk */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Sisa Kuota
              </span>
              <Clock className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-bold text-slate-700">{remainingQuota}</span>
              <span className="text-xs text-slate-500">anak</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
              Dari {maxQuota} total kuota
            </span>
          </div>
        </div>

        {/* Quota Bar & Refresh Action (Tanpa Tombol Simulasi Demo) */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-2/3">
            <QuotaProgressBar
              usedCount={totalAccessed}
              maxUses={maxQuota}
              showDetails={true}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-60"
              title="Segarkan data pengerjaan siswa"
            >
              <RotateCcw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>{isRefreshing ? "Menyinkronkan..." : "Segarkan Data"}</span>
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
              placeholder="Cari nama siswa yang sudah mengakses..."
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
              Semua ({totalAccessed})
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
          </div>
        </div>

        {/* Student List Table & Empty State */}
        <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl bg-white divide-y divide-slate-100 pr-1 shadow-sm min-h-[180px]">
          {realStudents.length === 0 ? (
            /* Empty state when no student has joined yet */
            <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">
                Belum Ada Siswa yang Mengakses Asesmen
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-4 leading-relaxed">
                Daftar nama siswa akan otomatis muncul di sini secara real-time begitu siswa membuka website dan memasukkan kode token kelas ini.
              </p>
              <div className="inline-flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="text-slate-500">Kode Token:</span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 tracking-wider">
                  {assessment.token.code}
                </span>
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="text-slate-500 hover:text-blue-600 font-medium ml-1 flex items-center gap-1 transition-colors"
                  title="Salin Kode Token"
                >
                  {copiedToken ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            /* Empty state when search filter doesn't match */
            <div className="py-12 text-center text-slate-400 text-xs">
              Tidak ada siswa yang sesuai dengan filter pencarian &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredStudents.map((student) => {
              const initials = student.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

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
                            <span>
                              Selesai:{" "}
                              {student.submittedAt
                                ? new Date(student.submittedAt).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }) + " WIB"
                                : "08:35 WIB"}
                            </span>
                            <span>•</span>
                            <span>Durasi: {student.durationMinutes || 30} mnt</span>
                          </>
                        )}
                        {student.status === "berlangsung" && (
                          <>
                            <span className="text-blue-700 font-medium">Sedang Mengerjakan</span>
                            <span>•</span>
                            <span>
                              Mulai:{" "}
                              {student.startedAt
                                ? new Date(student.startedAt).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }) + " WIB"
                                : "Baru saja"}
                            </span>
                          </>
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
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200" title="Paham Konsep">
                            P: {student.pahamCount ?? 0}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200" title="Miskonsepsi">
                            M: {student.miskonsepsiCount ?? 0}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200" title="Belum Paham">
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
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0 mt-3">
          <p>
            *Daftar nama dan status diperbarui otomatis secara real-time saat siswa mengakses atau mengirim jawaban.
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
