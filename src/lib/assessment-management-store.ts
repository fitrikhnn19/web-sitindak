// src/lib/assessment-management-store.ts
// Manajemen Data Asesmen, Token Kelas, dan Jadwal (Fase 3 SITINDAK)
// Terhubung langsung ke Supabase PostgreSQL tabel `assessments` & `assessment_questions` (RLS dinonaktifkan)

import { createClient } from "./supabase/client";
import { getCurrentTeacherSession } from "./teacher-auth-store";
import { getAllClasses } from "./class-management-store";

export interface ClassRoom {
  id: string;
  name: string; // e.g. "Kelas XI-A"
  gradeLevel: string; // e.g. "SMA Kelas 11"
  totalStudents: number;
  teacherName: string;
}

export type TokenDerivedStatus =
  | "aktif"
  | "belum_dibuka"
  | "kedaluwarsa"
  | "dinonaktifkan"
  | "kuota_habis";

export type ScheduleDerivedStatus = "belum_dibuka" | "berjalan" | "selesai";

export interface StudentProgress {
  id: string;
  name: string;
  status: "terkirim" | "berlangsung" | "belum_mulai";
  startedAt?: string;
  submittedAt?: string;
  durationMinutes?: number;
  pahamCount?: number;
  miskonsepsiCount?: number;
  belumPahamCount?: number;
  currentQuestion?: number;
  cheatingEventsCount?: number;
}

export interface AssessmentTokenData {
  id: string;
  code: string; // Unique uppercase short code e.g. "GEO-IXA"
  isActive: boolean;
  maxUses: number; // Set initially to student count, editable by teacher
  usedCount: number; // Increment 1 per unique student login
  expiresAt: string; // ISO datetime
}

export interface AssessmentItem {
  id: string;
  title: string;
  classId: string;
  className: string;
  gradeLevel: string;
  teacherName: string;
  questionIds: string[]; // Ordered list of question IDs from question bank
  opensAt: string; // ISO datetime
  closesAt: string; // ISO datetime
  durationMinutes?: number; // e.g. 45 menit pengerjaan per siswa (0 = tanpa batas)
  status: "berjalan" | "draf" | "selesai";
  createdAt: string;
  token: AssessmentTokenData;
  students: StudentProgress[];
}

export const MOCK_QUESTION_ID_MAP: Record<string, string> = {
  "q-1": "21d06bde-21d0-411a-ab29-a1e59261e14f",
  "q-2": "6b86fcbc-ea70-4375-9eff-1bf93ecbe45a",
  "q-3": "2905e53e-b1b2-4421-8200-2e2f2306566b",
  "q-4": "bb956a77-aa04-4d42-bf7c-b974e7b7efb9",
  "q-5": "ce47950d-4c50-47e5-831d-cebe9ca006e9",
  "q-6": "d4acb8e2-f5fe-48f3-9942-bc4abf2d866f",
  "q-7": "4a8efca9-89ad-4fd3-bf7c-e977c5c01e11",
  "q-8": "96796c04-9e8c-4b46-a0ef-c920aa5fa3ad",
  "q-9": "c989963d-f4d9-42cc-ab69-1a2d10e3dff8",
  "q-10": "0c13e0ab-c103-4b48-8504-d9472c840f1d",
  "q-11": "dd56e9c5-20ce-42b5-a4b3-d9c2b693d2b2",
  "q-12": "563d22b0-ea5f-440b-8f0a-c3ae60bbe993",
};

export function resolveQuestionUuid(id: string): string {
  if (MOCK_QUESTION_ID_MAP[id]) {
    return MOCK_QUESTION_ID_MAP[id];
  }
  return id;
}

// Daftar kelas default guru (kosong pada instansiasi awal)
export const MOCK_CLASSES: ClassRoom[] = [];

// Helper: generate daftar siswa tiruan dengan status pengerjaan
export function generateMockStudents(
  className: string,
  total: number,
  completedCount: number,
  inProgressCount: number
): StudentProgress[] {
  const firstNames = [
    "Ahmad", "Budi", "Citra", "Daffa", "Eka", "Fajar", "Gita", "Hafiz",
    "Indah", "Joko", "Kartika", "Lestari", "Maulana", "Nadia", "Oki",
    "Pratama", "Qori", "Rizki", "Siti", "Taufik", "Utami", "Vino",
    "Wahyudi", "Xena", "Yoga", "Zahra", "Aldi", "Bella", "Candra",
    "Dimas", "Erna", "Farhan", "Gilang", "Hesti", "Ilham"
  ];
  const lastNames = [
    "Pratama", "Santoso", "Dewi", "Alfarizi", "Handayani", "Nugraha",
    "Savitri", "Ramadhan", "Kusuma", "Saputra", "Wulandari", "Utami",
    "Hidayat", "Aulia", "Setiawan", "Wijaya", "Firmansyah", "Pertiwi",
    "Ananda", "Putra", "Pratiwi", "Nurhaliza", "Hakim", "Zulham"
  ];

  const students: StudentProgress[] = [];

  for (let i = 0; i < total; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[(i * 3 + 1) % lastNames.length];
    const studentId = `std-${className.toLowerCase().replace(/[^a-z0-9]/g, "")}-${(i + 1).toString().padStart(2, "0")}`;
    const fullName = `${fn} ${ln}`;

    if (i < completedCount) {
      const paham = Math.floor(Math.random() * 4) + 6;
      const miskonsepsi = Math.floor(Math.random() * 3) + 1;
      const belumPaham = Math.max(0, 10 - paham - miskonsepsi);
      const cheating = i === 6 ? 2 : (i === 11 ? 1 : 0);

      students.push({
        id: studentId,
        name: fullName,
        status: "terkirim",
        startedAt: "2026-11-02T08:00:00",
        submittedAt: `2026-11-02T08:${(25 + i).toString().padStart(2, "0")}:15`,
        durationMinutes: 25 + (i % 20),
        pahamCount: paham,
        miskonsepsiCount: miskonsepsi,
        belumPahamCount: belumPaham,
        cheatingEventsCount: cheating,
      });
    } else if (i < completedCount + inProgressCount) {
      students.push({
        id: studentId,
        name: fullName,
        status: "berlangsung",
        startedAt: "2026-11-02T08:20:00",
        currentQuestion: (i % 5) + 5,
        cheatingEventsCount: 0,
      });
    } else {
      students.push({
        id: studentId,
        name: fullName,
        status: "belum_mulai",
      });
    }
  }

  return students;
}

// Initial data asesmen default (kosong untuk guru baru)
export const INITIAL_ASSESSMENTS: AssessmentItem[] = [];

function getAssessmentsStorageKey(teacherId?: string): string {
  if (teacherId) return `sitindak_teacher_assessments_${teacherId}`;
  const current = getCurrentTeacherSession();
  if (current?.id) return `sitindak_teacher_assessments_${current.id}`;
  return "sitindak_teacher_assessments_guest";
}

// Evaluasi status jadwal turunan
export function deriveScheduleStatus(
  opensAt: string,
  closesAt: string,
  currentDate = new Date()
): ScheduleDerivedStatus {
  const now = currentDate.getTime();
  const openTime = new Date(opensAt).getTime();
  const closeTime = new Date(closesAt).getTime();

  if (now < openTime) {
    return "belum_dibuka";
  }
  if (now > closeTime) {
    return "selesai";
  }
  return "berjalan";
}

// Evaluasi 5 status token turunan sesuai PRD & spesifikasi feature
export function deriveTokenStatus(
  token: AssessmentTokenData,
  opensAt: string,
  closesAt: string,
  currentDate = new Date()
): TokenDerivedStatus {
  if (!token.isActive) {
    return "dinonaktifkan";
  }

  const now = currentDate.getTime();
  const tokenExpiry = new Date(token.expiresAt).getTime();
  const assessmentClose = new Date(closesAt).getTime();

  if (now > tokenExpiry || now > assessmentClose) {
    return "kedaluwarsa";
  }

  const openTime = new Date(opensAt).getTime();
  if (now < openTime) {
    return "belum_dibuka";
  }

  if (token.usedCount >= token.maxUses) {
    return "kuota_habis";
  }

  return "aktif";
}

// Hitung sisa kuota
export function getRemainingQuota(token: AssessmentTokenData): number {
  return Math.max(0, token.maxUses - token.usedCount);
}

function normalizeAssessment(item: AssessmentItem): AssessmentItem {
  // Hanya masukkan siswa riil yang sudah pernah mengakses (berlangsung atau terkirim)
  // Buang semua data siswa dummy/tiruan berstatus 'belum_mulai'
  const realStudents = Array.isArray(item.students)
    ? item.students.filter((s) => s.status === "berlangsung" || s.status === "terkirim")
    : [];

  return {
    ...item,
    durationMinutes: item.durationMinutes !== undefined ? item.durationMinutes : 45,
    title: item.title ? item.title.replace(/Kelas\s*IX-/gi, "Kelas XI-") : item.title,
    className: item.className ? item.className.replace(/Kelas\s*IX-/gi, "Kelas XI-") : item.className,
    gradeLevel: item.gradeLevel
      ? item.gradeLevel.replace(/SMP\s*Kelas\s*9/gi, "SMA Kelas 11").replace(/SMP/gi, "SMA")
      : "SMA Kelas 11",
    students: realStudents,
  };
}

// Baca semua asesmen dari storage (scoped per guru)
export function getAllAssessments(teacherId?: string): AssessmentItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const key = getAssessmentsStorageKey(teacherId);
    let raw = localStorage.getItem(key);

    // Fallback migrasi jika key per-user belum terbentuk tapi session aktif milik guru sebelumnya
    if (!raw && !teacherId) {
      const current = getCurrentTeacherSession();
      if (current?.id) {
        const legacy = localStorage.getItem("sitindak_teacher_assessments_v1");
        if (legacy) {
          try {
            const parsedLegacy = JSON.parse(legacy);
            if (Array.isArray(parsedLegacy) && parsedLegacy.length > 0) {
              const filtered = parsedLegacy.filter((a: any) => a.teacherName === current.name);
              if (filtered.length > 0) {
                raw = JSON.stringify(filtered);
                localStorage.setItem(key, raw);
              }
            }
          } catch {}
        }
      }
    }

    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.map(normalizeAssessment);
    }
    return [];
  } catch (err) {
    console.error("Gagal membaca localStorage asesmen:", err);
    return [];
  }
}

// Simpan data asesmen ke storage & broadcast event
export function saveAssessments(assessments: AssessmentItem[], teacherId?: string): void {
  if (typeof window === "undefined") return;
  try {
    const key = getAssessmentsStorageKey(teacherId);
    localStorage.setItem(key, JSON.stringify(assessments));
    window.dispatchEvent(new Event("sitindak_assessments_change"));
  } catch (err) {
    console.error("Gagal menyimpan ke localStorage asesmen:", err);
  }
}

/**
 * Memuat asesmen langsung dari Supabase (difilter berdasarkan teacher_id)
 */
export async function fetchAssessmentsFromSupabase(explicitTeacherId?: string): Promise<AssessmentItem[]> {
  if (typeof window === "undefined") return getAllAssessments();

  try {
    const supabase = createClient();
    const currentTeacher = getCurrentTeacherSession();
    const { data: authData } = await supabase.auth.getUser();
    const teacherId = explicitTeacherId || authData?.user?.id || currentTeacher?.id;

    if (!teacherId) {
      return getAllAssessments();
    }

    const { data, error } = await supabase
      .from("assessments")
      .select(`
        id,
        title,
        class_id,
        teacher_id,
        opens_at,
        closes_at,
        duration_minutes,
        status,
        created_at,
        token_code,
        is_token_active,
        max_uses,
        used_count,
        classes (
          id,
          name,
          grade_level
        ),
        profiles (
          id,
          full_name
        ),
        assessment_questions (
          question_id,
          order_index
        )
      `)
      .eq("teacher_id", teacherId)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Gagal mengambil asesmen dari Supabase:", error);
      return getAllAssessments(teacherId);
    }

    if (data && Array.isArray(data)) {
      const currentCached = getAllAssessments(teacherId);
      const mapped: AssessmentItem[] = data.map((row: any) => {
        const matchingCached = currentCached.find(
          (c) => c.id === row.id || c.token.code === row.token_code
        );

        // Sort question IDs by order_index
        const sortedQuestions = Array.isArray(row.assessment_questions)
          ? [...row.assessment_questions]
              .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
              .map((aq: any) => aq.question_id)
          : [];

        const cls = row.classes;
        const className = cls?.name || "Kelas";
        const gradeLevel = cls?.grade_level || "SMA Kelas 11";
        const teacherName =
          row.profiles?.full_name ||
          currentTeacher?.name ||
          "Guru";

        const maxUses = row.max_uses ?? 32;
        const usedCount = row.used_count ?? 0;

        const students =
          matchingCached?.students && matchingCached.students.length > 0
            ? matchingCached.students.filter((s) => s.status === "berlangsung" || s.status === "terkirim")
            : [];

        const scheduleStat = deriveScheduleStatus(row.opens_at, row.closes_at);
        const derivedStatus: "berjalan" | "draf" | "selesai" =
          scheduleStat === "selesai"
            ? "selesai"
            : scheduleStat === "berjalan"
            ? "berjalan"
            : "draf";

        return {
          id: row.id,
          title: row.title,
          classId: row.class_id,
          className: className,
          gradeLevel: gradeLevel,
          teacherName: teacherName,
          questionIds: sortedQuestions,
          opensAt: row.opens_at,
          closesAt: row.closes_at,
          durationMinutes: row.duration_minutes ?? 45,
          status: derivedStatus,
          createdAt: row.created_at,
          token: {
            id: `tok-${row.id}`,
            code: row.token_code,
            isActive: Boolean(row.is_token_active),
            maxUses: maxUses,
            usedCount: usedCount,
            expiresAt: row.closes_at,
          },
          students: students,
        };
      });

      saveAssessments(mapped, teacherId);
      return mapped;
    }

    saveAssessments([], teacherId);
    return [];
  } catch (err) {
    console.error("Kesalahan fetch asesmen Supabase:", err);
    return getAllAssessments();
  }
}

// Tambah Asesmen Baru (Sinkron ke localStorage & Supabase)
export function createAssessment(data: {
  title: string;
  classId: string;
  questionIds: string[];
  opensAt: string;
  closesAt: string;
  durationMinutes?: number;
  customTokenCode?: string;
  customMaxUses?: number;
}): AssessmentItem {
  const current = getAllAssessments();
  let selectedClass: ClassRoom | undefined;

  const allClasses = getAllClasses();
  selectedClass = allClasses.find((c) => c.id === data.classId);

  if (!selectedClass) {
    selectedClass = {
      id: data.classId,
      name: "Kelas XI",
      gradeLevel: "SMA Kelas 11",
      totalStudents: 32,
      teacherName: getCurrentTeacherSession()?.name || "Guru",
    };
  }

  // Buat kode token unik
  const tokenCode = data.customTokenCode
    ? data.customTokenCode.toUpperCase().replace(/[^A-Z0-9]/g, "")
    : generateUniqueTokenCode(selectedClass.name);

  const maxUses = data.customMaxUses ?? selectedClass.totalStudents;
  const newId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `asm-${Date.now()}`;
  const nowIso = new Date().toISOString();

  const newAssessment: AssessmentItem = {
    id: newId,
    title: data.title,
    classId: selectedClass.id,
    className: selectedClass.name,
    gradeLevel: selectedClass.gradeLevel,
    teacherName: selectedClass.teacherName,
    questionIds: data.questionIds,
    opensAt: data.opensAt,
    closesAt: data.closesAt,
    durationMinutes: data.durationMinutes !== undefined ? data.durationMinutes : 45,
    status: deriveScheduleStatus(data.opensAt, data.closesAt) === "berjalan" ? "berjalan" : "draf",
    createdAt: nowIso,
    token: {
      id: `tok-${newId}`,
      code: tokenCode,
      isActive: true,
      maxUses: maxUses,
      usedCount: 0,
      expiresAt: data.closesAt,
    },
    students: [],
  };

  const updated = [newAssessment, ...current];
  saveAssessments(updated);

  // Kirim data ke Supabase di latar belakang
  (async () => {
    try {
      const supabase = createClient();
      const currentTeacher = getCurrentTeacherSession();
      const { data: authData } = await supabase.auth.getUser();
      const teacherId = authData?.user?.id || currentTeacher?.id || "1af1750b-4f72-454d-8477-f15c3d875fcf";

      let validClassId = data.classId;
      const clsMatch = allClasses.find((c) => c.id === data.classId || c.name === selectedClass?.name);
      if (clsMatch && clsMatch.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}/i)) {
        validClassId = clsMatch.id;
      }

      const { error: insErr } = await supabase.from("assessments").insert({
        id: newId,
        teacher_id: teacherId,
        class_id: validClassId,
        title: data.title,
        token_code: tokenCode,
        opens_at: data.opensAt,
        closes_at: data.closesAt,
        duration_minutes: data.durationMinutes !== undefined ? data.durationMinutes : 45,
        max_uses: maxUses,
        used_count: 0,
        is_token_active: true,
        status: deriveScheduleStatus(data.opensAt, data.closesAt) === "berjalan" ? "berjalan" : "draf",
      });

      if (insErr) {
        console.warn("Gagal insert asesmen ke Supabase:", insErr);
        return;
      }

      // Link pertanyaan ke assessment_questions
      if (data.questionIds.length > 0) {
        const questionRows = data.questionIds.map((qId, idx) => ({
          assessment_id: newId,
          question_id: resolveQuestionUuid(qId),
          order_index: idx + 1,
        }));

        const { error: qErr } = await supabase.from("assessment_questions").insert(questionRows);
        if (qErr) {
          console.warn("Gagal insert assessment_questions ke Supabase:", qErr);
        }
      }
    } catch (e) {
      console.error("Kesalahan sinkronisasi asesmen baru ke Supabase:", e);
    }
  })();

  return newAssessment;
}

// Update Asesmen
export function updateAssessment(id: string, updates: Partial<AssessmentItem>): AssessmentItem | null {
  const current = getAllAssessments();
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const existing = current[index];
  const updatedItem: AssessmentItem = {
    ...existing,
    ...updates,
  };

  current[index] = updatedItem;
  saveAssessments(current);

  // Sync to Supabase
  (async () => {
    try {
      const supabase = createClient();
      const payload: any = { updated_at: new Date().toISOString() };
      if (updates.title) payload.title = updates.title;
      if (updates.durationMinutes !== undefined) payload.duration_minutes = updates.durationMinutes;
      if (updates.opensAt) payload.opens_at = updates.opensAt;
      if (updates.closesAt) payload.closes_at = updates.closesAt;
      if (updates.status) payload.status = updates.status;

      await supabase.from("assessments").update(payload).eq("id", id);
    } catch (e) {
      console.error("Gagal update asesmen ke Supabase:", e);
    }
  })();

  return updatedItem;
}

// Hapus Asesmen
export function deleteAssessment(id: string): boolean {
  const current = getAllAssessments();
  const filtered = current.filter((a) => a.id !== id);
  if (filtered.length === current.length) return false;

  saveAssessments(filtered);

  // Hapus dari Supabase (assessment_questions otomatis terhapus via CASCADE)
  (async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from("assessments").delete().eq("id", id);
      if (error) {
        console.warn("Gagal menghapus asesmen dari Supabase:", error);
      }
    } catch (e) {
      console.error("Kesalahan jaringan delete asesmen Supabase:", e);
    }
  })();

  return true;
}

// Update Kuota Token (Guru dapat menambah/mengubah kuota)
export function updateTokenQuota(assessmentId: string, newMaxUses: number): AssessmentItem | null {
  const current = getAllAssessments();
  const item = current.find((a) => a.id === assessmentId);
  if (!item) return null;

  item.token.maxUses = Math.max(item.token.usedCount, newMaxUses);
  saveAssessments(current);

  (async () => {
    try {
      const supabase = createClient();
      await supabase
        .from("assessments")
        .update({
          max_uses: item.token.maxUses,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assessmentId);
    } catch (e) {
      console.error("Gagal update kuota token ke Supabase:", e);
    }
  })();

  return item;
}

// Toggle status aktif/nonaktif token
export function toggleTokenActive(assessmentId: string, isActive?: boolean): AssessmentItem | null {
  const current = getAllAssessments();
  const item = current.find((a) => a.id === assessmentId);
  if (!item) return null;

  item.token.isActive = isActive !== undefined ? isActive : !item.token.isActive;
  saveAssessments(current);

  (async () => {
    try {
      const supabase = createClient();
      await supabase
        .from("assessments")
        .update({
          is_token_active: item.token.isActive,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assessmentId);
    } catch (e) {
      console.error("Gagal update status aktif token ke Supabase:", e);
    }
  })();

  return item;
}

// Update Masa Berlaku Token
export function updateTokenExpiry(assessmentId: string, newExpiresAt: string): AssessmentItem | null {
  const current = getAllAssessments();
  const item = current.find((a) => a.id === assessmentId);
  if (!item) return null;

  item.token.expiresAt = newExpiresAt;
  item.closesAt = newExpiresAt;
  saveAssessments(current);

  (async () => {
    try {
      const supabase = createClient();
      await supabase
        .from("assessments")
        .update({
          closes_at: newExpiresAt,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assessmentId);
    } catch (e) {
      console.error("Gagal update batas token ke Supabase:", e);
    }
  })();

  return item;
}

// Update Jadwal Buka - Tutup Asesmen & Durasi
export function updateSchedule(
  assessmentId: string,
  opensAt: string,
  closesAt: string,
  durationMinutes?: number
): AssessmentItem | null {
  const current = getAllAssessments();
  const item = current.find((a) => a.id === assessmentId);
  if (!item) return null;

  item.opensAt = opensAt;
  item.closesAt = closesAt;
  if (durationMinutes !== undefined) {
    item.durationMinutes = durationMinutes;
  }
  item.token.expiresAt = closesAt;
  item.status = deriveScheduleStatus(opensAt, closesAt) === "selesai" ? "selesai" : "berjalan";

  saveAssessments(current);

  (async () => {
    try {
      const supabase = createClient();
      await supabase
        .from("assessments")
        .update({
          opens_at: opensAt,
          closes_at: closesAt,
          duration_minutes: item.durationMinutes,
          status: item.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assessmentId);
    } catch (e) {
      console.error("Gagal update jadwal asesmen ke Supabase:", e);
    }
  })();

  return item;
}

// Update Khusus Durasi Pengerjaan Asesmen
export function updateAssessmentDuration(assessmentId: string, durationMinutes: number): AssessmentItem | null {
  const current = getAllAssessments();
  const item = current.find((a) => a.id === assessmentId);
  if (!item) return null;

  item.durationMinutes = Math.max(0, durationMinutes);
  saveAssessments(current);

  (async () => {
    try {
      const supabase = createClient();
      await supabase
        .from("assessments")
        .update({
          duration_minutes: item.durationMinutes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", assessmentId);
    } catch (e) {
      console.error("Gagal update durasi ke Supabase:", e);
    }
  })();

  return item;
}

// Simulasi: Siswa baru mengklaim token dan mulai mengerjakan
export function simulateStudentEntry(assessmentId: string, studentId?: string): { success: boolean; message: string; assessment?: AssessmentItem } {
  const current = getAllAssessments();
  const item = current.find((a) => a.id === assessmentId);
  if (!item) return { success: false, message: "Asesmen tidak ditemukan" };

  const tokenStatus = deriveTokenStatus(item.token, item.opensAt, item.closesAt);
  if (tokenStatus !== "aktif") {
    const errorMap: Record<TokenDerivedStatus, string> = {
      dinonaktifkan: "Token asesmen ini telah dinonaktifkan oleh guru.",
      kedaluwarsa: "Waktu pengerjaan asesmen atau token telah berakhir.",
      kuota_habis: "Kuota pengerjaan untuk kelas ini sudah penuh.",
      belum_dibuka: "Asesmen ini belum dibuka sesuai jadwal.",
      aktif: "",
    };
    return { success: false, message: errorMap[tokenStatus] || "Token tidak dapat digunakan." };
  }

  let targetStudent = studentId
    ? item.students.find((s) => s.id === studentId)
    : item.students.find((s) => s.status === "belum_mulai");

  if (!targetStudent) {
    return { success: false, message: "Semua siswa di kelas ini sudah mengklaim kuota token." };
  }

  if (targetStudent.status === "belum_mulai") {
    targetStudent.status = "berlangsung";
    targetStudent.startedAt = new Date().toISOString();
    targetStudent.currentQuestion = 1;
    item.token.usedCount += 1;

    // Update used_count in Supabase
    (async () => {
      try {
        const supabase = createClient();
        await supabase
          .from("assessments")
          .update({
            used_count: item.token.usedCount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", assessmentId);
      } catch (e) {
        console.error("Gagal update used_count Supabase:", e);
      }
    })();
  }

  saveAssessments(current);
  return { success: true, message: `${targetStudent.name} berhasil masuk dengan token. Digunakan: ${item.token.usedCount}/${item.token.maxUses}`, assessment: item };
}

// Simulasi: Siswa menyelesaikan ujian & submit jawaban
export function simulateStudentSubmit(assessmentId: string, studentId: string): { success: boolean; message: string; assessment?: AssessmentItem } {
  const current = getAllAssessments();
  const item = current.find((a) => a.id === assessmentId);
  if (!item) return { success: false, message: "Asesmen tidak ditemukan" };

  const targetStudent = item.students.find((s) => s.id === studentId);
  if (!targetStudent) return { success: false, message: "Siswa tidak ditemukan" };

  targetStudent.status = "terkirim";
  targetStudent.submittedAt = new Date().toISOString();
  targetStudent.durationMinutes = Math.floor(Math.random() * 25) + 20;
  targetStudent.pahamCount = Math.floor(Math.random() * 4) + 6;
  targetStudent.miskonsepsiCount = Math.floor(Math.random() * 3) + 1;
  targetStudent.belumPahamCount = Math.max(0, 10 - targetStudent.pahamCount - targetStudent.miskonsepsiCount);

  saveAssessments(current);
  return { success: true, message: `${targetStudent.name} telah mengirimkan jawaban!`, assessment: item };
}

// Helper penghasil token otomatis
function generateUniqueTokenCode(className: string): string {
  const cleanClass = className.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const prefixes = ["GEO", "MAT", "DIAG", "TRANS", "KONSEPSI"];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = Math.floor(10 + Math.random() * 90);
  return `${randomPrefix}-${cleanClass.slice(-3)}${randomSuffix}`;
}

// Template teks pengumuman WhatsApp ke grup kelas
export function generateWhatsAppShareText(assessment: AssessmentItem): string {
  const opens = new Date(assessment.opensAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const closes = new Date(assessment.closesAt).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `📢 *PENGUMUMAN ASESMEN DIAGNOSTIK TIGA TINGKAT (SITINDAK)*
Kepada seluruh siswa *${assessment.className}*:

Silakan akses asesmen diagnostik berikut untuk mendiagnosis penguasaan materi prasyarat:
📝 *${assessment.title}*
🔑 *KODE TOKEN:* \`${assessment.token.code}\`
⏰ *Jadwal Dibuka:* ${opens} WIB
⏳ *Batas Pengiriman:* ${closes} WIB
📊 *Jumlah Soal:* ${assessment.questionIds.length} butir soal 3-tier (Konsep, Alasan, Keyakinan)

🌐 *Tautan Masuk Siswa:*
https://sitindak.app/asesmen

*Petunjuk Penting:*
1. Token di atas berlaku bersama untuk seluruh siswa *${assessment.className}*.
2. Masukkan kode token dan nama lengkap Anda di halaman pembuka.
3. Kerjakan dengan jujur dan teliti dari HP atau laptop. Setelah selesai, pembahasan jawaban benar akan langsung tampil untuk bahan refleksi.

— ${assessment.teacherName}`;
}
