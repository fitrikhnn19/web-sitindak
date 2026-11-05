"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  Plus,
  Layers,
  KeyRound,
  BarChart3,
  Calendar,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  HelpCircle,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  RefreshCw,
  School,
} from "lucide-react";
import {
  AssessmentItem,
  getAllAssessments,
  fetchAssessmentsFromSupabase,
  deleteAssessment,
  deriveScheduleStatus,
  deriveTokenStatus,
} from "@/lib/assessment-management-store";
import { getAllClasses, fetchClassesFromSupabase, ClassRoom } from "@/lib/class-management-store";
import { AssessmentCard } from "@/components/assessment-manage/AssessmentCard";
import { CreateAssessmentModal } from "@/components/assessment-manage/CreateAssessmentModal";
import { TokenManagementModal } from "@/components/assessment-manage/TokenManagementModal";
import { ScheduleManagementModal } from "@/components/assessment-manage/ScheduleManagementModal";
import { StudentProgressMonitoringModal } from "@/components/assessment-manage/StudentProgressMonitoringModal";
import { TeacherSessionHeader } from "@/components/dashboard/TeacherSessionHeader";

function AssessmentManagementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State for assessment list
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>("semua");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("semua");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAssessmentForToken, setSelectedAssessmentForToken] = useState<AssessmentItem | null>(null);
  const [selectedAssessmentForSchedule, setSelectedAssessmentForSchedule] = useState<AssessmentItem | null>(null);
  const [selectedAssessmentForMonitoring, setSelectedAssessmentForMonitoring] = useState<AssessmentItem | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  // Load assessments & classes
  useEffect(() => {
    const list = getAllAssessments();
    setAssessments(list);
    const classList = getAllClasses();
    setClasses(classList);

    // Ambil data terbaru dari Supabase
    fetchAssessmentsFromSupabase().then((remoteAssessments) => {
      if (remoteAssessments && remoteAssessments.length > 0) {
        setAssessments(remoteAssessments);
      }
    });

    fetchClassesFromSupabase().then((remoteClasses) => {
      if (remoteClasses && remoteClasses.length > 0) {
        setClasses(remoteClasses);
      }
    });

    // Check if query params ask to open create modal or monitor specific token
    const action = searchParams.get("action");
    const tokenQuery = searchParams.get("token");

    if (action === "create") {
      setIsCreateModalOpen(true);
    }

    if (tokenQuery) {
      const match = list.find((a) => a.token.code === tokenQuery);
      if (match) {
        setSelectedAssessmentForMonitoring(match);
      }
    }

    const handleStoreChange = () => {
      setAssessments(getAllAssessments());
    };
    window.addEventListener("sitindak_assessments_change", handleStoreChange);
    return () => window.removeEventListener("sitindak_assessments_change", handleStoreChange);
  }, [searchParams]);

  // Handle updates
  const handleAssessmentUpdated = (updated: AssessmentItem) => {
    const updatedList = assessments.map((a) => (a.id === updated.id ? updated : a));
    setAssessments(updatedList);

    // Keep active modal item synced
    if (selectedAssessmentForToken?.id === updated.id) {
      setSelectedAssessmentForToken(updated);
    }
    if (selectedAssessmentForSchedule?.id === updated.id) {
      setSelectedAssessmentForSchedule(updated);
    }
    if (selectedAssessmentForMonitoring?.id === updated.id) {
      setSelectedAssessmentForMonitoring(updated);
    }
  };

  const handleCreated = (newAssessment: AssessmentItem) => {
    setAssessments((prev) => [newAssessment, ...prev]);
    showToast(`Asesmen "${newAssessment.title}" berhasil dibuat dengan token ${newAssessment.token.code}!`);
  };

  const handleDelete = (id: string) => {
    const success = deleteAssessment(id);
    if (success) {
      setAssessments((prev) => prev.filter((a) => a.id !== id));
      showToast("Asesmen berhasil dihapus.");
    }
  };

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Filtered assessment list
  const filteredAssessments = assessments.filter((a) => {
    // Class filter
    const matchClass =
      selectedClassFilter === "semua" || a.classId === selectedClassFilter;

    // Status filter
    const scheduleStat = deriveScheduleStatus(a.opensAt, a.closesAt);
    const tokenStat = deriveTokenStatus(a.token, a.opensAt, a.closesAt);
    let matchStatus = true;
    if (selectedStatusFilter === "berjalan") {
      matchStatus = scheduleStat === "berjalan" && tokenStat === "aktif";
    } else if (selectedStatusFilter === "draf") {
      matchStatus = scheduleStat === "belum_dibuka" || a.status === "draf";
    } else if (selectedStatusFilter === "selesai") {
      matchStatus = scheduleStat === "selesai" || tokenStat === "kedaluwarsa";
    }

    // Search query
    const matchQuery =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.token.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.className.toLowerCase().includes(searchQuery.toLowerCase());

    return matchClass && matchStatus && matchQuery;
  });

  // Calculate top statistics
  const totalAssessments = assessments.length;
  const activeAssessments = assessments.filter(
    (a) =>
      deriveScheduleStatus(a.opensAt, a.closesAt) === "berjalan" &&
      deriveTokenStatus(a.token, a.opensAt, a.closesAt) === "aktif"
  ).length;

  const totalUsedQuota = assessments.reduce((acc, a) => acc + a.token.usedCount, 0);
  const totalMaxQuota = assessments.reduce((acc, a) => acc + a.token.maxUses, 0);
  const totalCompletedStudents = assessments.reduce(
    (acc, a) => acc + a.students.filter((s) => s.status === "terkirim").length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Teacher Session Header */}
      <TeacherSessionHeader
        currentModule="asesmen"
        title="Kelola Asesmen & Token"
        subtitle="Kelola Asesmen & Token Kelas (Fase 3 PRD)"
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Banner Notification Toast */}
        {notificationToast && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium">{notificationToast}</span>
            </div>
            <button
              onClick={() => setNotificationToast(null)}
              className="text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          </div>
        )}

        {/* Dashboard Title & Action Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Manajemen Asesmen
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                Satu Token per Kelas
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Kelola Asesmen & Token Kelas
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Siapkan asesmen diagnostik matematika, bagikan satu kode token kelas dengan kuota pemakaian otomatis, dan pantau penyelesaian siswa secara langsung.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Asesmen Baru</span>
          </button>
        </div>

        {/* 4 Summary Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Asesmen */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Asesmen</span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {totalAssessments}
              </span>
              <span className="text-xs text-slate-500">pelaksanaan</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Tersebar di {classes.length} kelas diampu
            </p>
          </div>

          {/* Card 2: Asesmen Aktif */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-emerald-200 shadow-sm">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Sedang Berjalan</span>
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-700">
                {activeAssessments}
              </span>
              <span className="text-xs text-slate-500">aktif</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Token siap dipakai siswa saat ini
            </p>
          </div>

          {/* Card 3: Kuota Terpakai */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Kuota Token Terpakai</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-indigo-700">
                {totalUsedQuota}
              </span>
              <span className="text-xs text-slate-500">/ {totalMaxQuota} kuota</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {Math.round((totalUsedQuota / (totalMaxQuota || 1)) * 100)}% kuota kelas terpakai
            </p>
          </div>

          {/* Card 4: Siswa Selesai */}
          <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Siswa Selesai</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                {totalCompletedStudents}
              </span>
              <span className="text-xs text-slate-500">siswa</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Jawaban dinilai otomatis 3-tier
            </p>
          </div>

        </div>

        {/* Toolbar: Filters & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari asesmen berdasarkan judul, nama kelas, atau kode token..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Filter Kelas */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedClassFilter}
                onChange={(e) => setSelectedClassFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="semua">Semua Kelas</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-700 font-semibold focus:outline-none cursor-pointer"
              >
                <option value="semua">Semua Status</option>
                <option value="berjalan">Sedang Berjalan</option>
                <option value="draf">Terjadwal / Draf</option>
                <option value="selesai">Sudah Ditutup</option>
              </select>
            </div>

            {(searchQuery || selectedClassFilter !== "semua" || selectedStatusFilter !== "semua") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedClassFilter("semua");
                  setSelectedStatusFilter("semua");
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold px-2 py-1"
              >
                Reset Filter
              </button>
            )}

          </div>

        </div>

        {/* Assessment Cards Grid */}
        {filteredAssessments.length === 0 ? (
          <div className="py-16 text-center rounded-xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Tidak Ada Asesmen Ditemukan</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Coba sesuaikan kata kunci pencarian atau bersihkan filter kelas dan status.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedClassFilter("semua");
                setSelectedStatusFilter("semua");
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700"
            >
              Tampilkan Semua Asesmen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssessments.map((item) => (
              <AssessmentCard
                key={item.id}
                assessment={item}
                onOpenTokenModal={(a) => setSelectedAssessmentForToken(a)}
                onOpenScheduleModal={(a) => setSelectedAssessmentForSchedule(a)}
                onOpenMonitoringModal={(a) => setSelectedAssessmentForMonitoring(a)}
                onDeleteAssessment={handleDelete}
                onAssessmentUpdated={handleAssessmentUpdated}
              />
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">SITINDAK</span>
            <span>— Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Portal Asesmen & Token Terintegrasi</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleCreated}
      />

      <TokenManagementModal
        isOpen={!!selectedAssessmentForToken}
        onClose={() => setSelectedAssessmentForToken(null)}
        assessment={selectedAssessmentForToken}
        onAssessmentUpdated={handleAssessmentUpdated}
      />

      <ScheduleManagementModal
        isOpen={!!selectedAssessmentForSchedule}
        onClose={() => setSelectedAssessmentForSchedule(null)}
        assessment={selectedAssessmentForSchedule}
        onAssessmentUpdated={handleAssessmentUpdated}
      />

      <StudentProgressMonitoringModal
        isOpen={!!selectedAssessmentForMonitoring}
        onClose={() => setSelectedAssessmentForMonitoring(null)}
        assessment={selectedAssessmentForMonitoring}
        onAssessmentUpdated={handleAssessmentUpdated}
      />

    </div>
  );
}

export default function GuruAsesmenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-600 font-medium">
              Memuat Manajemen Asesmen & Token Kelas...
            </span>
          </div>
        </div>
      }
    >
      <AssessmentManagementContent />
    </Suspense>
  );
}
