"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  School,
  Users,
  GraduationCap,
  Calendar,
  Layers,
  KeyRound,
  CheckCircle2,
  Clock,
  Share2,
  Copy,
  Check,
  Edit2,
  Trash2,
  Plus,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Power,
  RotateCcw,
  PlayCircle,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
} from "lucide-react";
import {
  ClassRoom,
  getAssessmentsForClass,
  getClassStatistics,
} from "@/lib/class-management-store";
import {
  AssessmentItem,
  deriveTokenStatus,
  deriveScheduleStatus,
  getRemainingQuota,
  toggleTokenActive,
  generateWhatsAppShareText,
} from "@/lib/assessment-management-store";
import {
  TokenStatusBadge,
  ScheduleStatusBadge,
  QuotaProgressBar,
} from "@/components/assessment-manage/StatusBadges";
import {
  NoAssessmentsForClassEmptyState,
  NoStudentsFilteredEmptyState,
} from "./ClassEmptyStates";

interface ClassWorkspaceViewProps {
  classroom: ClassRoom;
  onEditClass: (classroom: ClassRoom) => void;
  onDeleteClass: (classroom: ClassRoom) => void;
  onCreateAssessment: (classId: string) => void;
  onOpenTokenModal: (assessment: AssessmentItem) => void;
  onOpenScheduleModal: (assessment: AssessmentItem) => void;
  onAssessmentUpdated: (updated: AssessmentItem) => void;
  onShowToast: (message: string) => void;
}

export const ClassWorkspaceView: React.FC<ClassWorkspaceViewProps> = ({
  classroom,
  onEditClass,
  onDeleteClass,
  onCreateAssessment,
  onOpenTokenModal,
  onOpenScheduleModal,
  onAssessmentUpdated,
  onShowToast,
}) => {
  // Assessments for this specific class
  const classAssessments = useMemo(() => {
    return getAssessmentsForClass(classroom.id);
  }, [classroom.id]);

  // Selected assessment tab inside this class
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>(
    classAssessments[0]?.id || ""
  );

  // Sync if selected assessment changes or deleted
  const currentAssessment = useMemo(() => {
    if (!classAssessments.length) return null;
    return (
      classAssessments.find((a) => a.id === selectedAssessmentId) ||
      classAssessments[0]
    );
  }, [classAssessments, selectedAssessmentId]);

  // Local student search & filter
  const [studentSearch, setStudentSearch] = useState("");
  const [studentStatusFilter, setStudentStatusFilter] = useState<string>("semua");

  // Copy feedback states
  const [copiedToken, setCopiedToken] = useState(false);

  // Class statistics
  const stats = getClassStatistics(classroom.id);

  // Filter students of the active assessment
  const filteredStudents = useMemo(() => {
    if (!currentAssessment) return [];
    return (currentAssessment.students || []).filter((std) => {
      const matchName = std.name
        .toLowerCase()
        .includes(studentSearch.toLowerCase().trim());
      const matchStatus =
        studentStatusFilter === "semua" || std.status === studentStatusFilter;
      return matchName && matchStatus;
    });
  }, [currentAssessment, studentSearch, studentStatusFilter]);

  // Quick Copy Token
  const handleCopyToken = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedToken(true);
    onShowToast(`Token ${code} berhasil disalin ke papan klip!`);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // Quick WhatsApp Share
  const handleShareWhatsApp = (assessment: AssessmentItem) => {
    const text = generateWhatsAppShareText(assessment);
    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, "_blank");
    onShowToast(`Membuka WhatsApp untuk membagikan token ${assessment.token.code}`);
  };

  // Quick Toggle Token Active
  const handleToggleToken = (assessment: AssessmentItem) => {
    const updated = toggleTokenActive(assessment.id);
    if (updated) {
      onAssessmentUpdated(updated);
      onShowToast(
        updated.token.isActive
          ? `Token ${updated.token.code} diaktifkan kembali.`
          : `Token ${updated.token.code} telah dinonaktifkan.`
      );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* 1. Header Banner Ruang Kelas */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <School className="w-7 h-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                  {classroom.name}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {classroom.gradeLevel}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>{classroom.totalStudents} Siswa Terdaftar</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                <span>Pengampu: <strong className="text-slate-800">{classroom.teacherName}</strong></span>
                {classroom.academicYear && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>Tahun Ajaran: <strong className="text-slate-800">{classroom.academicYear}</strong></span>
                  </>
                )}
                {classroom.description && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="italic">"{classroom.description}"</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Header Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onEditClass(classroom)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shadow-sm"
              title="Ubah nama, tingkat, atau kuota siswa"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Ubah Data Kelas</span>
            </button>

            <button
              onClick={() => onDeleteClass(classroom)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold border border-slate-300 transition-colors"
              title="Hapus kelas dari dasbor"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hapus</span>
            </button>

            <button
              onClick={() => onCreateAssessment(classroom.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Asesmen Baru</span>
            </button>
          </div>
        </div>

        {/* Quick Class Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500">Total Asesmen</p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">{stats.totalAssessments}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500">Asesmen Berjalan</p>
            <p className="text-lg font-bold text-blue-700 mt-0.5">{stats.activeAssessmentsCount}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500">Siswa Telah Kirim</p>
            <p className="text-lg font-bold text-emerald-700 mt-0.5">{stats.totalFinishedSubmissions}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p className="text-[11px] text-slate-500">Rata-rata Partisipasi</p>
            <p className="text-lg font-bold text-blue-700 mt-0.5">{stats.participationPercentage}%</p>
          </div>
        </div>
      </div>

      {/* 2. Assessment Tabs for this Class */}
      {classAssessments.length === 0 ? (
        <NoAssessmentsForClassEmptyState
          className={classroom.name}
          onCreateAssessment={() => onCreateAssessment(classroom.id)}
        />
      ) : (
        <>
          {/* Assessment Picker Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-2.5 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-semibold text-slate-500 px-2 shrink-0">
                Pilih Asesmen:
              </span>
              {classAssessments.map((asm) => {
                const isSelected = asm.id === currentAssessment?.id;
                return (
                  <button
                    key={asm.id}
                    onClick={() => setSelectedAssessmentId(asm.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${isSelected
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
                      }`}
                  >
                    <span>{asm.title}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isSelected ? "bg-blue-700 text-white" : "bg-slate-200 text-slate-700"
                        }`}
                    >
                      {asm.token.code}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => onCreateAssessment(classroom.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Tambah Asesmen Lagi</span>
            </button>
          </div>

          {currentAssessment && (
            <div className="space-y-6">

              {/* Asesmen, Token, & Jadwal Overview Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                {/* Panel 1: Token Asesmen Khusus Kelas Ini */}
                <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                          <KeyRound className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Token Akses Siswa ({classroom.name})
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Satu token dipakai bersama oleh seluruh siswa {classroom.name}
                          </p>
                        </div>
                      </div>

                      <TokenStatusBadge
                        status={deriveTokenStatus(
                          currentAssessment.token,
                          currentAssessment.opensAt,
                          currentAssessment.closesAt
                        )}
                      />
                    </div>

                    {/* Token Display Box */}
                    <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-0.5">
                          Kode Token Kelas:
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl sm:text-3xl font-bold font-mono text-blue-700 tracking-wider">
                            {currentAssessment.token.code}
                          </span>
                          <button
                            onClick={() => handleCopyToken(currentAssessment.token.code)}
                            className="p-2 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 transition-colors shadow-sm"
                            title="Salin Kode Token"
                          >
                            {copiedToken ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Quota Stats */}
                      <div className="sm:text-right border-t sm:border-t-0 sm:border-l border-blue-200 pt-3 sm:pt-0 sm:pl-4">
                        <span className="text-[11px] text-slate-500 block mb-0.5">
                          Penggunaan Kuota:
                        </span>
                        <p className="text-sm font-bold text-slate-900">
                          <span className="text-blue-700 font-mono text-base font-bold">
                            {currentAssessment.token.usedCount}
                          </span>
                          <span className="text-slate-400 mx-1">/</span>
                          <span className="font-mono">{currentAssessment.token.maxUses} siswa</span>
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Sisa kuota: {getRemainingQuota(currentAssessment.token)} kursi
                        </p>
                      </div>
                    </div>

                    {/* Quota Progress Bar */}
                    <div className="mt-4">
                      <QuotaProgressBar
                        usedCount={currentAssessment.token.usedCount}
                        maxUses={currentAssessment.token.maxUses}
                      />
                    </div>
                  </div>

                  {/* Token Action Bar */}
                  <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => handleCopyToken(currentAssessment.token.code)}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      {copiedToken ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Token</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleShareWhatsApp(currentAssessment)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Bagikan ke Grup WhatsApp</span>
                    </button>

                    <button
                      onClick={() => onOpenTokenModal(currentAssessment)}
                      className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                      <span>Atur Kuota Token</span>
                    </button>

                    <button
                      onClick={() => handleToggleToken(currentAssessment)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 border ${currentAssessment.token.isActive
                        ? "bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border-slate-300"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600"
                        }`}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{currentAssessment.token.isActive ? "Nonaktifkan" : "Aktifkan"}</span>
                    </button>
                  </div>
                </div>

                {/* Panel 2: Jadwal Buka - Tutup Asesmen */}
                <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Jadwal Pelaksanaan
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            Waktu buka & tutup asesmen
                          </p>
                        </div>
                      </div>

                      <ScheduleStatusBadge
                        status={deriveScheduleStatus(
                          currentAssessment.opensAt,
                          currentAssessment.closesAt
                        )}
                      />
                    </div>

                    <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <span className="text-[11px] text-slate-500 font-medium block">
                          Dibuka Pada:
                        </span>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">
                          {new Date(currentAssessment.opensAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}{" "}
                          WIB
                        </p>
                      </div>

                      <div className="border-t border-slate-200 pt-2.5">
                        <span className="text-[11px] text-slate-500 font-medium block">
                          Batas Penutupan:
                        </span>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">
                          {new Date(currentAssessment.closesAt).toLocaleString("id-ID", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}{" "}
                          WIB
                        </p>
                      </div>

                      <div className="border-t border-slate-200 pt-2.5">
                        <span className="text-[11px] text-slate-500 font-medium block">
                          Jumlah Butir Soal:
                        </span>
                        <p className="text-xs font-semibold text-blue-700 mt-0.5 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span>{currentAssessment.questionIds?.length || 10} Soal Tiga Tingkat</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => onOpenScheduleModal(currentAssessment)}
                      className="w-full py-2 px-3 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Atur Jadwal Buka - Tutup</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Panel 3: Status Pengerjaan Siswa Khusus Kelas Ini */}
              <div className="rounded-2xl bg-white border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">

                {/* Header Section: Title & Simulation Testing Bar */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          Status Pengerjaan Siswa ({classroom.name})
                        </h3>
                        <p className="text-xs text-slate-500">
                          Memantau siapa yang belum mulai, sedang mengerjakan, atau telah mengirim jawaban khusus kelas {classroom.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Summary Counters */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Terkirim */}
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-emerald-800 block font-medium">Selesai (Terkirim)</span>
                      <span className="text-lg font-bold text-emerald-900">
                        {currentAssessment.students?.filter((s) => s.status === "terkirim").length || 0} Siswa
                      </span>
                    </div>
                  </div>

                  {/* Berlangsung */}
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-blue-800 block font-medium">Sedang Mengerjakan</span>
                      <span className="text-lg font-bold text-blue-900">
                        {currentAssessment.students?.filter((s) => s.status === "berlangsung").length || 0} Siswa
                      </span>
                    </div>
                  </div>

                  {/* Belum Mulai */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 block font-medium">Belum Mulai</span>
                      <span className="text-lg font-bold text-slate-700">
                        {currentAssessment.students?.filter((s) => s.status === "belum_mulai").length || 0} Siswa
                      </span>
                    </div>
                  </div>

                  {/* Total & Direct Link to Hasil */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[11px] text-slate-500 block font-medium">Total Siswa Kelas</span>
                      <span className="text-lg font-bold text-slate-900">
                        {currentAssessment.students?.length || classroom.totalStudents} Siswa
                      </span>
                    </div>
                    <Link
                      href={`/guru/hasil?token=${currentAssessment.token.code}`}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm"
                      title="Lihat Profil Diagnostik Lengkap di Dasbor Hasil"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Filters & Search Toolbar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                  {/* Status Filter Tabs */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 overflow-x-auto scrollbar-none">
                    {[
                      { id: "semua", label: "Semua Siswa" },
                      { id: "terkirim", label: "Selesai" },
                      { id: "berlangsung", label: "Sedang Ujian" },
                      { id: "belum_mulai", label: "Belum Mulai" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setStudentStatusFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all whitespace-nowrap ${studentStatusFilter === tab.id
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search by student name */}
                  <div className="relative sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Cari nama siswa..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Student Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4 w-12 text-center">No</th>
                          <th className="py-3 px-4">Nama Siswa</th>
                          <th className="py-3 px-4">Status Pengerjaan</th>
                          <th className="py-3 px-4">Waktu Mulai / Selesai</th>
                          <th className="py-3 px-4">Durasi</th>
                          <th className="py-3 px-4">Profil Diagnostik (3-Tier)</th>
                          <th className="py-3 px-4">Integritas</th>
                          <th className="py-3 px-4 text-right">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredStudents.length === 0 ? (
                          <tr>
                            <td colSpan={8}>
                              <NoStudentsFilteredEmptyState
                                query={studentSearch}
                                statusFilter={studentStatusFilter}
                                onResetFilters={() => {
                                  setStudentSearch("");
                                  setStudentStatusFilter("semua");
                                }}
                              />
                            </td>
                          </tr>
                        ) : (
                          filteredStudents.map((std, idx) => {
                            const isSubmitted = std.status === "terkirim";
                            const isInProgress = std.status === "berlangsung";
                            const hasCheating = (std.cheatingEventsCount || 0) > 0;

                            return (
                              <tr
                                key={std.id}
                                className="hover:bg-slate-50 transition-colors"
                              >
                                <td className="py-3 px-4 text-center text-slate-400 font-mono">
                                  {idx + 1}
                                </td>

                                <td className="py-3 px-4 font-semibold text-slate-900">
                                  {std.name}
                                </td>

                                <td className="py-3 px-4">
                                  {isSubmitted ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                                      <CheckCircle2 className="w-3 h-3" />
                                      <span>Terkirim</span>
                                    </span>
                                  ) : isInProgress ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200 animate-pulse">
                                      <Clock className="w-3 h-3" />
                                      <span>Mengerjakan</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                                      <span>Belum Mulai</span>
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-4 text-slate-600">
                                  {isSubmitted ? (
                                    <div className="space-y-0.5 text-[11px]">
                                      <p className="text-slate-500">Mulai: {std.startedAt ? std.startedAt.slice(11, 16) : "-"}</p>
                                      <p className="font-semibold text-slate-800">Kirim: {std.submittedAt ? std.submittedAt.slice(11, 16) : "-"}</p>
                                    </div>
                                  ) : isInProgress ? (
                                    <span className="text-[11px] text-blue-700 font-medium">
                                      Mulai pkl {std.startedAt ? std.startedAt.slice(11, 16) : "-"}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>

                                <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                                  {std.durationMinutes ? `${std.durationMinutes} mnt` : "-"}
                                </td>

                                <td className="py-3 px-4">
                                  {isSubmitted && std.pahamCount !== undefined ? (
                                    <div className="flex items-center gap-1.5 text-[11px]">
                                      <span
                                        className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold"
                                        title={`${std.pahamCount} butir Paham`}
                                      >
                                        P: {std.pahamCount}
                                      </span>
                                      <span
                                        className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 font-semibold"
                                        title={`${std.miskonsepsiCount} butir Miskonsepsi`}
                                      >
                                        M: {std.miskonsepsiCount}
                                      </span>
                                      <span
                                        className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-semibold"
                                        title={`${std.belumPahamCount} butir Belum Paham`}
                                      >
                                        B: {std.belumPahamCount}
                                      </span>
                                    </div>
                                  ) : isInProgress ? (
                                    <span className="text-[11px] text-blue-700 italic">
                                      Sedang menjawab butir {(std.currentQuestion || 1)}...
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>

                                <td className="py-3 px-4">
                                  {hasCheating ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-semibold border border-rose-200">
                                      <ShieldAlert className="w-3 h-3 text-rose-600" />
                                      <span>{std.cheatingEventsCount}x Pindah Tab</span>
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                      <span>Aman</span>
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-4 text-right">
                                  {isSubmitted ? (
                                    <Link
                                      href={`/guru/hasil?token=${currentAssessment.token.code}&tab=student&student=${std.id}`}
                                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition-colors border border-blue-200"
                                    >
                                      <span>Rincian</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </Link>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Link to Hasil */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Analisis Konsepsi & Peta Prasyarat Siap Ditinjau</span>
                    </h4>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Lihat matriks pemahaman siswa per butir soal dan materi prasyarat geometri yang perlu diajarkan ulang.
                    </p>
                  </div>
                  <Link
                    href={`/guru/hasil?token=${currentAssessment.token.code}`}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all shrink-0"
                  >
                    <span>Buka Dasbor Hasil {classroom.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};
