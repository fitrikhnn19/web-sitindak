// src/lib/class-management-store.ts
// Manajemen Kelas Guru di Dasbor SITINDAK — Terhubung ke Supabase PostgreSQL tabel `classes`
// RLS dinonaktifkan sesuai kebutuhan pengembangan

import { createClient } from "./supabase/client";
import { getCurrentTeacherSession } from "./teacher-auth-store";
import {
  AssessmentItem,
  getAllAssessments,
  saveAssessments,
} from "./assessment-management-store";

export interface ClassRoom {
  id: string; // UUID from Supabase or unique ID
  name: string; // e.g. "Kelas XI-A"
  gradeLevel: string; // e.g. "SMA Kelas 11"
  totalStudents: number; // e.g. 32
  teacherName: string; // e.g. "Dra. Sri Wahyuni, M.Pd."
  academicYear?: string; // e.g. "2026/2027"
  description?: string; // e.g. "Matematika Semester Ganjil"
  createdAt?: string; // ISO datetime
}

// Data awal kelas guru (kosong untuk instansiasi live baru)
export const DEFAULT_CLASSES: ClassRoom[] = [];

const CLASSES_STORAGE_KEY = "sitindak_teacher_classes_v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function normalizeClass(c: ClassRoom): ClassRoom {
  return {
    ...c,
    name: c.name ? c.name.replace(/Kelas\s*IX-/gi, "Kelas XI-") : c.name,
    gradeLevel: c.gradeLevel
      ? c.gradeLevel.replace(/SMP\s*Kelas\s*9/gi, "SMA Kelas 11").replace(/SMP/gi, "SMA")
      : "SMA Kelas 11",
  };
}

/**
 * Mengambil seluruh daftar kelas guru dari localStorage (cache cepat untuk SSR & initial render)
 */
export function getAllClasses(): ClassRoom[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(CLASSES_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeClass);
    }
    return [];
  } catch (err) {
    console.error("Gagal membaca localStorage kelas:", err);
    return [];
  }
}

/**
 * Menyimpan daftar kelas ke cache lokal dan trigger event
 */
export function saveClasses(classes: ClassRoom[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(CLASSES_STORAGE_KEY, JSON.stringify(classes));
    window.dispatchEvent(new Event("sitindak_classes_change"));
  } catch (err) {
    console.error("Gagal menyimpan kelas ke localStorage:", err);
  }
}

/**
 * Memuat seluruh kelas guru langsung dari tabel `classes` di Supabase
 */
export async function fetchClassesFromSupabase(): Promise<ClassRoom[]> {
  if (!isBrowser()) return [];

  try {
    const supabase = createClient();
    const currentTeacher = getCurrentTeacherSession();
    const teacherName = currentTeacher?.name || "Guru";

    const { data, error } = await supabase
      .from("classes")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Gagal mengambil data kelas dari Supabase, menggunakan cache:", error);
      return getAllClasses();
    }

    if (data && Array.isArray(data)) {
      const mapped: ClassRoom[] = data.map((row) => ({
        id: row.id,
        name: row.name,
        gradeLevel: row.grade_level,
        totalStudents: row.total_students,
        teacherName: teacherName,
        academicYear: row.academic_year || "2026/2027",
        description: row.description || "",
        createdAt: row.created_at,
      }));

      saveClasses(mapped);
      return mapped;
    }

    return getAllClasses();
  } catch (err) {
    console.error("Kesalahan jaringan fetch kelas Supabase:", err);
    return getAllClasses();
  }
}

/**
 * Mengambil satu kelas berdasarkan ID
 */
export function getClassById(id: string): ClassRoom | null {
  const classes = getAllClasses();
  return classes.find((c) => c.id === id) || null;
}

/**
 * Menambah kelas baru ke database Supabase dan memperbarui state lokal
 */
export async function addClass(data: {
  name: string;
  gradeLevel: string;
  totalStudents: number;
  academicYear?: string;
  description?: string;
  teacherName?: string;
}): Promise<ClassRoom> {
  const current = getAllClasses();
  const currentTeacher = getCurrentTeacherSession();
  const teacherName = data.teacherName || currentTeacher?.name || "Guru";

  let newClass: ClassRoom = {
    id: `cls-${Date.now()}`,
    name: data.name.trim(),
    gradeLevel: data.gradeLevel.trim(),
    totalStudents: Math.max(1, data.totalStudents || 32),
    teacherName: teacherName,
    academicYear: data.academicYear || "2026/2027",
    description: data.description?.trim() || "",
    createdAt: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    const teacherId = authData?.user?.id || currentTeacher?.id || "1af1750b-4f72-454d-8477-f15c3d875fcf";

    const { data: inserted, error } = await supabase
      .from("classes")
      .insert({
        teacher_id: teacherId,
        name: newClass.name,
        grade_level: newClass.gradeLevel,
        total_students: newClass.totalStudents,
        academic_year: newClass.academicYear,
        description: newClass.description,
      })
      .select()
      .single();

    if (error) {
      console.warn("Gagal insert kelas ke Supabase, menggunakan fallback lokal:", error);
    } else if (inserted) {
      newClass = {
        id: inserted.id,
        name: inserted.name,
        gradeLevel: inserted.grade_level,
        totalStudents: inserted.total_students,
        teacherName: teacherName,
        academicYear: inserted.academic_year || "2026/2027",
        description: inserted.description || "",
        createdAt: inserted.created_at,
      };
    }
  } catch (err) {
    console.error("Kesalahan koneksi saat menambah kelas ke Supabase:", err);
  }

  const updated = [...current, newClass];
  saveClasses(updated);
  return newClass;
}

/**
 * Mengubah nama, tingkat, atau kuota siswa kelas di Supabase & lokal
 */
export async function updateClass(
  id: string,
  updates: Partial<Omit<ClassRoom, "id" | "createdAt">>
): Promise<ClassRoom | null> {
  const current = getAllClasses();
  const index = current.findIndex((c) => c.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const updatedClass: ClassRoom = {
    ...existing,
    ...updates,
    name: updates.name ? updates.name.trim() : existing.name,
    gradeLevel: updates.gradeLevel ? updates.gradeLevel.trim() : existing.gradeLevel,
    totalStudents:
      updates.totalStudents !== undefined
        ? Math.max(1, updates.totalStudents)
        : existing.totalStudents,
  };

  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("classes")
      .update({
        name: updatedClass.name,
        grade_level: updatedClass.gradeLevel,
        total_students: updatedClass.totalStudents,
        academic_year: updatedClass.academicYear,
        description: updatedClass.description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.warn("Gagal update kelas di Supabase:", error);
    }
  } catch (err) {
    console.error("Kesalahan update kelas ke Supabase:", err);
  }

  current[index] = updatedClass;
  saveClasses(current);

  // Sinkronkan ke asesmen yang memakai kelas ini jika nama / grade level berubah
  if (updates.name || updates.gradeLevel) {
    try {
      const allAssessments = getAllAssessments();
      let hasChanges = false;
      const updatedAssessments = allAssessments.map((asm) => {
        if (asm.classId === id) {
          hasChanges = true;
          return {
            ...asm,
            className: updatedClass.name,
            gradeLevel: updatedClass.gradeLevel,
          };
        }
        return asm;
      });
      if (hasChanges) {
        saveAssessments(updatedAssessments);
      }
    } catch (err) {
      console.warn("Gagal menyinkronkan nama kelas ke asesmen:", err);
    }
  }

  return updatedClass;
}

/**
 * Menghapus kelas dari dasbor & Supabase
 */
export async function deleteClass(id: string, cascadeAssessments = false): Promise<boolean> {
  const current = getAllClasses();
  const filtered = current.filter((c) => c.id !== id);
  if (filtered.length === current.length) return false;

  try {
    const supabase = createClient();
    const { error } = await supabase.from("classes").delete().eq("id", id);
    if (error) {
      console.warn("Gagal menghapus kelas dari Supabase:", error);
    }
  } catch (err) {
    console.error("Kesalahan delete kelas di Supabase:", err);
  }

  saveClasses(filtered);

  if (cascadeAssessments) {
    try {
      const allAssessments = getAllAssessments();
      const updatedAssessments = allAssessments.filter((a) => a.classId !== id);
      saveAssessments(updatedAssessments);
    } catch (err) {
      console.warn("Gagal menghapus asesmen terkait kelas:", err);
    }
  }

  return true;
}

/**
 * Mengambil seluruh asesmen milik kelas tertentu
 */
export function getAssessmentsForClass(classId: string): AssessmentItem[] {
  const all = getAllAssessments();
  return all.filter((a) => a.classId === classId);
}

export interface ClassStatistics {
  totalAssessments: number;
  activeAssessmentsCount: number;
  completedAssessmentsCount: number;
  draftAssessmentsCount: number;
  totalStudents: number;
  totalFinishedSubmissions: number;
  totalInProgressSubmissions: number;
  participationPercentage: number;
}

export function getClassStatistics(classId: string): ClassStatistics {
  const classroom = getClassById(classId);
  const assessments = getAssessmentsForClass(classId);
  const totalStudents = classroom?.totalStudents || 32;

  const totalAssessments = assessments.length;
  const activeAssessmentsCount = assessments.filter((a) => a.status === "berjalan").length;
  const completedAssessmentsCount = assessments.filter((a) => a.status === "selesai").length;
  const draftAssessmentsCount = assessments.filter((a) => a.status === "draf").length;

  let totalFinishedSubmissions = 0;
  let totalInProgressSubmissions = 0;

  assessments.forEach((asm) => {
    (asm.students || []).forEach((st) => {
      if (st.status === "terkirim") totalFinishedSubmissions++;
      else if (st.status === "berlangsung") totalInProgressSubmissions++;
    });
  });

  const totalPossible = totalAssessments * totalStudents;
  const participationPercentage =
    totalPossible > 0 ? Math.min(100, Math.round((totalFinishedSubmissions / totalPossible) * 100)) : 0;

  return {
    totalAssessments,
    activeAssessmentsCount,
    completedAssessmentsCount,
    draftAssessmentsCount,
    totalStudents,
    totalFinishedSubmissions,
    totalInProgressSubmissions,
    participationPercentage,
  };
}

export function resetClassesToDefault(): ClassRoom[] {
  saveClasses(DEFAULT_CLASSES);
  return DEFAULT_CLASSES;
}
