"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  School,
  Plus,
  Layers,
  Users,
  Grid,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Filter,
  Search,
} from "lucide-react";
import {
  ClassRoom,
  getAllClasses,
  getClassById,
  fetchClassesFromSupabase,
  resetClassesToDefault,
} from "@/lib/class-management-store";
import {
  AssessmentItem,
  getAllAssessments,
} from "@/lib/assessment-management-store";
import { ClassDashboardHeader } from "@/components/class-manage/ClassDashboardHeader";
import { ClassListCard } from "@/components/class-manage/ClassListCard";
import { ClassWorkspaceView } from "@/components/class-manage/ClassWorkspaceView";
import { AddEditClassModal } from "@/components/class-manage/AddEditClassModal";
import { DeleteClassModal } from "@/components/class-manage/DeleteClassModal";
import { NoClassesEmptyState } from "@/components/class-manage/ClassEmptyStates";
import { CreateAssessmentModal } from "@/components/assessment-manage/CreateAssessmentModal";
import { TokenManagementModal } from "@/components/assessment-manage/TokenManagementModal";
import { ScheduleManagementModal } from "@/components/assessment-manage/ScheduleManagementModal";
import { useTeacherAuth } from "@/lib/useTeacherAuth";

function ClassManagementDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn, isLoading } = useTeacherAuth();

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/guru/masuk");
    }
  }, [isLoading, isLoggedIn, router]);

  // URL Query Parameters
  const initialClassIdQuery = searchParams.get("id");
  const initialViewQuery = searchParams.get("view"); // "all" or "workspace"
  const initialActionQuery = searchParams.get("action"); // "add"

  // Classes & Selection State
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [viewMode, setViewMode] = useState<"workspace" | "overview">("workspace");

  // Modals
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [classToEdit, setClassToEdit] = useState<ClassRoom | null>(null);
  const [classToDelete, setClassToDelete] = useState<ClassRoom | null>(null);

  // Assessment & Token Modals
  const [isCreateAssessmentModalOpen, setIsCreateAssessmentModalOpen] = useState(false);
  const [createAssessmentClassId, setCreateAssessmentClassId] = useState<string>("");
  const [selectedAssessmentForToken, setSelectedAssessmentForToken] = useState<AssessmentItem | null>(null);
  const [selectedAssessmentForSchedule, setSelectedAssessmentForSchedule] = useState<AssessmentItem | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initial load & Supabase sync
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. Ambil dari cache lokal terlebih dahulu
      const initial = getAllClasses();
      if (isMounted) setClasses(initial);

      // 2. Muat data terbaru dari Supabase
      const remote = await fetchClassesFromSupabase();
      if (!isMounted) return;
      setClasses(remote);

      const loadedClasses = remote.length > 0 ? remote : initial;

      if (loadedClasses.length === 0) {
        setViewMode("overview");
        setSelectedClassId("");
        return;
      }

      if (initialViewQuery === "all") {
        setViewMode("overview");
        setSelectedClassId("all");
      } else if (initialClassIdQuery) {
        const match = loadedClasses.find((c) => c.id === initialClassIdQuery);
        if (match) {
          setSelectedClassId(match.id);
          setViewMode("workspace");
        } else {
          setSelectedClassId(loadedClasses[0].id);
          setViewMode("workspace");
        }
      } else {
        setSelectedClassId(loadedClasses[0].id);
        setViewMode("workspace");
      }

      if (initialActionQuery === "add") {
        setClassToEdit(null);
        setIsAddEditModalOpen(true);
      }
    }

    loadData();

    const handleClassesChange = () => {
      setClasses(getAllClasses());
    };
    window.addEventListener("sitindak_classes_change", handleClassesChange);

    return () => {
      isMounted = false;
      window.removeEventListener("sitindak_classes_change", handleClassesChange);
    };
  }, [initialClassIdQuery, initialViewQuery, initialActionQuery]);

  // Selected Active Class Room
  const activeClass = useMemo(() => {
    if (viewMode === "overview" || selectedClassId === "all") return null;
    return classes.find((c) => c.id === selectedClassId) || classes[0] || null;
  }, [classes, selectedClassId, viewMode]);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Class Selection Handler
  const handleSelectClass = (classId: string) => {
    if (classId === "all") {
      setSelectedClassId("all");
      setViewMode("overview");
      router.push("/guru/kelas?view=all");
    } else {
      setSelectedClassId(classId);
      setViewMode("workspace");
      router.push(`/guru/kelas?id=${classId}`);
    }
  };

  // Class CRUD Handlers
  const handleOpenAddModal = () => {
    setClassToEdit(null);
    setIsAddEditModalOpen(true);
  };

  const handleOpenEditModal = (cls: ClassRoom) => {
    setClassToEdit(cls);
    setIsAddEditModalOpen(true);
  };

  const handleOpenDeleteModal = (cls: ClassRoom) => {
    setClassToDelete(cls);
  };

  const handleClassSaved = async (savedClass: ClassRoom, isNew: boolean) => {
    const refreshed = await fetchClassesFromSupabase();
    setClasses(refreshed);
    setSelectedClassId(savedClass.id);
    setViewMode("workspace");
    router.push(`/guru/kelas?id=${savedClass.id}`);

    showToast(
      isNew
        ? `Kelas ${savedClass.name} berhasil ditambahkan ke dasbor!`
        : `Data kelas ${savedClass.name} berhasil diperbarui.`
    );
  };

  const handleClassDeleted = async (deletedId: string) => {
    const refreshed = await fetchClassesFromSupabase();
    setClasses(refreshed);

    if (refreshed.length > 0) {
      setSelectedClassId(refreshed[0].id);
      setViewMode("workspace");
      router.push(`/guru/kelas?id=${refreshed[0].id}`);
    } else {
      setSelectedClassId("");
      setViewMode("overview");
      router.push("/guru/kelas");
    }

    showToast("Kelas berhasil dihapus dari dasbor.");
  };

  const handleResetDefaults = () => {
    const defaults = resetClassesToDefault();
    setClasses(defaults);
    setSelectedClassId(defaults[0].id);
    setViewMode("workspace");
    router.push(`/guru/kelas?id=${defaults[0].id}`);
    showToast("Data kelas telah direset ke default (XI-A s/d XI-D).");
  };

  // Assessment Trigger from Class
  const handleOpenCreateAssessmentForClass = (classId: string) => {
    setCreateAssessmentClassId(classId);
    setIsCreateAssessmentModalOpen(true);
  };

  const handleAssessmentCreated = (newAssessment: AssessmentItem) => {
    showToast(`Asesmen "${newAssessment.title}" berhasil dibuat untuk ${newAssessment.className}!`);
    const refreshed = getAllClasses();
    setClasses(refreshed);
  };

  const handleAssessmentUpdated = (updated: AssessmentItem) => {
    if (selectedAssessmentForToken?.id === updated.id) {
      setSelectedAssessmentForToken(updated);
    }
    if (selectedAssessmentForSchedule?.id === updated.id) {
      setSelectedAssessmentForSchedule(updated);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">

      {/* 1. Header Navigation */}
      <ClassDashboardHeader
        classes={classes}
        selectedClassId={selectedClassId}
        onSelectClass={handleSelectClass}
        onOpenAddModal={handleOpenAddModal}
      />

      {/* 2. Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Banner Toast Notification */}
        {toastMessage && (
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-semibold">{toastMessage}</span>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-slate-700 p-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* 3. Class Switcher Tab Bar */}
        {classes.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            {/* Scrollable Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">

              {/* Button: Overview / Semua Kelas */}
              <button
                onClick={() => handleSelectClass("all")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${viewMode === "overview" || selectedClassId === "all"
                  ? "bg-white text-blue-700 border border-slate-300 shadow-sm"
                  : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                  }`}
              >
                <Grid className="w-3.5 h-3.5 text-blue-600" />
                <span>Semua Kelas</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-[10px] text-slate-700 font-semibold">
                  {classes.length}
                </span>
              </button>

              <div className="h-5 w-px bg-slate-300 mx-1 shrink-0" />

              {/* Individual Class Tabs */}
              {classes.map((cls) => {
                const isSelected = viewMode === "workspace" && activeClass?.id === cls.id;
                return (
                  <button
                    key={cls.id}
                    onClick={() => handleSelectClass(cls.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 flex items-center gap-2 ${isSelected
                      ? "bg-blue-600 text-white shadow-sm border border-blue-600"
                      : "bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                      }`}
                  >
                    <School className={`w-3.5 h-3.5 ${isSelected ? "text-white" : "text-slate-400"}`} />
                    <span>{cls.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                        }`}
                    >
                      {cls.totalStudents} siswa
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Action Button: + Tambah Kelas Baru */}
            <div className="shrink-0 flex items-center gap-2">
              <button
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Kelas Baru</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Content Area */}
        {classes.length === 0 ? (
          <NoClassesEmptyState
            onAddClass={handleOpenAddModal}
            onResetDefaults={handleResetDefaults}
          />
        ) : viewMode === "overview" || selectedClassId === "all" ? (
          /* A. Overview Mode: Grid of All Classes */
          <div className="space-y-6 animate-in fade-in duration-200">

            {/* Overview Intro Banner */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <School className="w-5 h-5 text-blue-600" />
                  <span>Ikhtisar Seluruh Kelas yang Diampu</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                  Setiap kelas memiliki ruang kelola asesmennya sendiri. Pilih salah satu kelas di bawah untuk memantau token, jadwal buka-tutup, dan progres pemahaman tiga tingkat siswa kelas tersebut secara terpisah.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleOpenAddModal}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Kelas Baru</span>
                </button>
              </div>
            </div>

            {/* Class Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {classes.map((cls) => (
                <ClassListCard
                  key={cls.id}
                  classroom={cls}
                  onOpenWorkspace={handleSelectClass}
                  onEditClass={handleOpenEditModal}
                  onDeleteClass={handleOpenDeleteModal}
                  onCreateAssessment={handleOpenCreateAssessmentForClass}
                />
              ))}
            </div>

          </div>
        ) : activeClass ? (
          /* B. Focused Workspace Mode for Selected Class */
          <ClassWorkspaceView
            classroom={activeClass}
            onEditClass={handleOpenEditModal}
            onDeleteClass={handleOpenDeleteModal}
            onCreateAssessment={handleOpenCreateAssessmentForClass}
            onOpenTokenModal={(asm) => setSelectedAssessmentForToken(asm)}
            onOpenScheduleModal={(asm) => setSelectedAssessmentForSchedule(asm)}
            onAssessmentUpdated={handleAssessmentUpdated}
            onShowToast={showToast}
          />
        ) : null}

      </main>

      {/* 5. Modals */}
      {/* Add / Edit Class Modal */}
      <AddEditClassModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        classToEdit={classToEdit}
        onSaved={handleClassSaved}
      />

      {/* Delete Class Confirmation Modal */}
      <DeleteClassModal
        isOpen={Boolean(classToDelete)}
        onClose={() => setClassToDelete(null)}
        classroom={classToDelete}
        onDeleted={handleClassDeleted}
      />

      {/* Create Assessment Modal (Scoped to Class) */}
      <CreateAssessmentModal
        isOpen={isCreateAssessmentModalOpen}
        onClose={() => setIsCreateAssessmentModalOpen(false)}
        initialClassId={createAssessmentClassId}
        onCreated={handleAssessmentCreated}
        onOpenAddClass={handleOpenAddModal}
      />

      {/* Token Management Modal */}
      <TokenManagementModal
        isOpen={Boolean(selectedAssessmentForToken)}
        onClose={() => setSelectedAssessmentForToken(null)}
        assessment={selectedAssessmentForToken}
        onAssessmentUpdated={handleAssessmentUpdated}
      />

      {/* Schedule Management Modal */}
      <ScheduleManagementModal
        isOpen={Boolean(selectedAssessmentForSchedule)}
        onClose={() => setSelectedAssessmentForSchedule(null)}
        assessment={selectedAssessmentForSchedule}
        onAssessmentUpdated={handleAssessmentUpdated}
      />

    </div>
  );
}

export default function ClassManagementPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-8">
          <div className="flex items-center gap-3 text-slate-500">
            <School className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-sm font-semibold">Memuat Dasbor Ruang Kelas...</span>
          </div>
        </div>
      }
    >
      <ClassManagementDashboardContent />
    </Suspense>
  );
}
