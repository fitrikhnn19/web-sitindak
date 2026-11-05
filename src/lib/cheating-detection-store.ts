// src/lib/cheating-detection-store.ts
// Store, Model & Layanan Frontend Deteksi Kecurangan & Mode Fokus (Fase 3 SITINDAK - Feature 06)

import { createClient } from "./supabase/client";

export type CheatingEventType =
  | "pindah_tab"
  | "keluar_halaman"
  | "keluar_layar_penuh"
  | "salin_soal"
  | "klik_kanan"
  | "tutup_halaman";

export interface CheatingEvent {
  id: string;
  attemptId?: string;
  studentId: string;
  studentName: string;
  className: string;
  tokenCode: string;
  eventType: CheatingEventType;
  eventLabel: string;
  occurredAt: string; // ISO datetime string
  detail: string;
  questionNumber?: number;
  questionTitle?: string;
  durationSeconds?: number;
  severity: "rendah" | "sedang" | "tinggi";
}

export interface StudentCheatingSummary {
  studentId: string;
  studentName: string;
  className: string;
  tokenCode: string;
  submittedAt?: string;
  durationMinutes?: number;
  status: "terkirim" | "berlangsung" | "belum_mulai";
  totalEvents: number;
  hasCheating: boolean; // false = Siswa Berintegritas Penuh
  events: CheatingEvent[];
  highestSeverity: "nihil" | "rendah" | "sedang" | "tinggi";
  integrityStatus: "Integritas Terjaga" | "Perlu Konfirmasi" | "Indikasi Pelanggaran";
  integrityScorePct: number; // e.g. 100% (clean), 80%, etc.
  pahamCount?: number;
  miskonsepsiCount?: number;
  belumPahamCount?: number;
}

export interface ClassCheatingReport {
  tokenCode: string;
  assessmentTitle: string;
  className: string;
  teacherName: string;
  teacherNip?: string;
  totalStudents: number;
  completedStudents: number;
  cleanStudentsCount: number; // 0 incidents
  flaggedStudentsCount: number; // >= 1 incidents
  totalIncidents: number;
  incidentTypeBreakdown: Record<CheatingEventType, number>;
  integrityRating: "Sangat Tinggi" | "Tinggi" | "Perlu Perhatian" | "Kritis";
  averageIntegrityScore: number;
  students: StudentCheatingSummary[];
}

export const CHEATING_EVENT_LABELS: Record<CheatingEventType, { label: string; desc: string }> = {
  pindah_tab: {
    label: "Pindah Tab Peramban",
    desc: "Siswa berpindah ke tab lain atau meminimalkan jendela browser saat soal aktif.",
  },
  keluar_halaman: {
    label: "Jendela Kehilangan Fokus",
    desc: "Fokus kursor terlepas ke aplikasi eksternal di luar peramban ujian.",
  },
  keluar_layar_penuh: {
    label: "Keluar Mode Layar Penuh",
    desc: "Siswa membatalkan atau keluar dari tampilan layar penuh ujian sebelum mengirim.",
  },
  salin_soal: {
    label: "Upaya Menyalin Teks Soal",
    desc: "Terdeteksi kombinasi tombol salin (Ctrl+C / Cmd+C) atau upaya menyalin teks.",
  },
  klik_kanan: {
    label: "Membuka Menu Klik Kanan",
    desc: "Upaya membuka menu konteks browser yang dinonaktifkan demi keamanan ujian.",
  },
  tutup_halaman: {
    label: "Mencoba Menutup Halaman",
    desc: "Peringatan keluar halaman (beforeunload) terpancing saat pengerjaan berlangsung.",
  },
};

// -------------------------------------------------------------
// Data Tiruan Kelas XI-A (Token: GEO-IXA / GEO-XIA, Pengampu: Dra. Sri Wahyuni, M.Pd.)
// -------------------------------------------------------------
const MOCK_EVENTS_IXA: CheatingEvent[] = [];
const RAW_STUDENTS_IXA: Array<{ id: string; name: string; submittedAt?: string; duration?: number; paham: number; misk: number; belum: number }> = [];
const MOCK_EVENTS_9B: CheatingEvent[] = [];
const RAW_STUDENTS_9B: Array<{ id: string; name: string; submittedAt?: string; duration?: number; paham: number; misk: number; belum: number }> = [];

export function createEmptyClassCheatingReport(tokenCode: string = ""): ClassCheatingReport {
  return {
    tokenCode,
    assessmentTitle: "Belum Ada Asesmen",
    className: "-",
    teacherName: "-",
    teacherNip: "-",
    totalStudents: 0,
    completedStudents: 0,
    cleanStudentsCount: 0,
    flaggedStudentsCount: 0,
    totalIncidents: 0,
    incidentTypeBreakdown: {
      pindah_tab: 0,
      keluar_halaman: 0,
      keluar_layar_penuh: 0,
      salin_soal: 0,
      klik_kanan: 0,
      tutup_halaman: 0,
    },
    integrityRating: "Sangat Tinggi",
    averageIntegrityScore: 100,
    students: [],
  };
}

export function getLocalStoredEventsForToken(tokenCode: string): CheatingEvent[] {
  if (typeof window === "undefined") return [];

  const localEvents: CheatingEvent[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`sitindak_cheating_events_${tokenCode}`)) {
        const itemStr = localStorage.getItem(key);
        if (itemStr) {
          const parsed = JSON.parse(itemStr);
          if (Array.isArray(parsed)) {
            localEvents.push(...parsed);
          }
        }
      }
    }
  } catch (err) {
    console.warn("Gagal membaca local storage cheating events:", err);
  }
  return localEvents;
}

// -------------------------------------------------------------
// Simpan event baru dari layar ujian siswa
// -------------------------------------------------------------
export function recordStudentCheatingEvent(event: Omit<CheatingEvent, "id">): CheatingEvent {
  const fullEvent: CheatingEvent = {
    ...event,
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
  };

  if (typeof window !== "undefined") {
    try {
      const storageKey = `sitindak_cheating_events_${event.tokenCode}_${event.studentName.toLowerCase()}`;
      const existingStr = localStorage.getItem(storageKey);
      const existing: CheatingEvent[] = existingStr ? JSON.parse(existingStr) : [];
      existing.push(fullEvent);
      localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (e) {
      console.warn("Gagal menyimpan event ke localStorage:", e);
    }
  }

  return fullEvent;
}

// -------------------------------------------------------------
// Build Laporan Kecurangan Kelas Berdasarkan Token
// -------------------------------------------------------------
export function getClassCheatingReport(tokenCode: string = "GEO-IXA"): ClassCheatingReport {
  const is11A = tokenCode === "GEO-IXA" || tokenCode === "GEO-XIA";
  const assessmentTitle = is11A
    ? "Asesmen Diagnostik Prasyarat Transformasi Geometri"
    : "Diagnostik Translasi & Refleksi Kartesius";
  const className = is11A ? "Kelas XI-A" : "Kelas XI-B";
  const teacherName = is11A ? "Dra. Sri Wahyuni, M.Pd." : "Drs. Budi Santoso, M.Si.";
  const teacherNip = is11A ? "19780512 200501 2 004" : "19720315 199802 1 003";

  // Raw mock events
  const baseEvents = is11A ? [...MOCK_EVENTS_IXA] : [...MOCK_EVENTS_9B];
  
  // Ambil event lokal tambahan dari pengerjaan siswa yang baru saja diuji
  const localEvents = getLocalStoredEventsForToken(tokenCode);
  const allEvents = [...baseEvents, ...localEvents];

  // Raw students
  const rawList = is11A ? RAW_STUDENTS_IXA : RAW_STUDENTS_9B;

  // Cek apakah ada siswa baru di localStorage yang baru saja menyelesaikan asesmen
  const studentMap = new Map<string, {
    id: string;
    name: string;
    submittedAt?: string;
    duration?: number;
    paham: number;
    misk: number;
    belum: number;
  }>();

  rawList.forEach((s) => {
    studentMap.set(s.name.toLowerCase(), s);
  });

  // Periksa apakah ada submission sesi browser aktif
  if (typeof window !== "undefined") {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`sitindak_submission_${tokenCode}_`)) {
          const item = localStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            const lowerName = (parsed.studentName || "").toLowerCase();
            if (lowerName && !studentMap.has(lowerName)) {
              studentMap.set(lowerName, {
                id: `std-custom-${Date.now()}`,
                name: parsed.studentName,
                submittedAt: parsed.submittedAt,
                duration: 25,
                paham: 6,
                misk: 2,
                belum: 2,
              });
            }
          }
        }
      }
    } catch {
      // fallback
    }
  }

    if (studentMap.size === 0 && allEvents.length === 0) {
    return createEmptyClassCheatingReport(tokenCode);
  }

  // Bangun daftar StudentCheatingSummary
  const studentSummaries: StudentCheatingSummary[] = Array.from(studentMap.values()).map((s) => {
    const studentEvents = allEvents.filter(
      (e) => e.studentName.toLowerCase() === s.name.toLowerCase()
    );
    const totalEvents = studentEvents.length;
    const hasCheating = totalEvents > 0;

    let highestSeverity: "nihil" | "rendah" | "sedang" | "tinggi" = "nihil";
    if (studentEvents.some((e) => e.severity === "tinggi")) {
      highestSeverity = "tinggi";
    } else if (studentEvents.some((e) => e.severity === "sedang")) {
      highestSeverity = "sedang";
    } else if (studentEvents.some((e) => e.severity === "rendah")) {
      highestSeverity = "rendah";
    }

    let integrityStatus: "Integritas Terjaga" | "Perlu Konfirmasi" | "Indikasi Pelanggaran" = "Integritas Terjaga";
    if (totalEvents >= 2 || highestSeverity === "tinggi") {
      integrityStatus = "Indikasi Pelanggaran";
    } else if (totalEvents === 1) {
      integrityStatus = "Perlu Konfirmasi";
    }

    // Skor Integritas (100% jika 0 kejadian, berkurang 10-20% per kejadian)
    const integrityScorePct = Math.max(20, 100 - totalEvents * 18);

    return {
      studentId: s.id,
      studentName: s.name,
      className,
      tokenCode,
      submittedAt: s.submittedAt,
      durationMinutes: s.duration,
      status: "terkirim",
      totalEvents,
      hasCheating,
      events: studentEvents.sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()),
      highestSeverity,
      integrityStatus,
      integrityScorePct,
      pahamCount: s.paham,
      miskonsepsiCount: s.misk,
      belumPahamCount: s.belum,
    };
  });

  // Urutkan siswa: yang memiliki catatan mencurigakan di atas, lalu urut nama
  studentSummaries.sort((a, b) => {
    if (b.totalEvents !== a.totalEvents) return b.totalEvents - a.totalEvents;
    return a.studentName.localeCompare(b.studentName);
  });

  // Hitung KPI
  const totalStudents = studentSummaries.length;
  const completedStudents = studentSummaries.filter((s) => s.status === "terkirim").length;
  const cleanStudentsCount = studentSummaries.filter((s) => !s.hasCheating).length;
  const flaggedStudentsCount = studentSummaries.filter((s) => s.hasCheating).length;
  const totalIncidents = allEvents.length;

  const incidentTypeBreakdown: Record<CheatingEventType, number> = {
    pindah_tab: allEvents.filter((e) => e.eventType === "pindah_tab").length,
    keluar_halaman: allEvents.filter((e) => e.eventType === "keluar_halaman").length,
    keluar_layar_penuh: allEvents.filter((e) => e.eventType === "keluar_layar_penuh").length,
    salin_soal: allEvents.filter((e) => e.eventType === "salin_soal").length,
    klik_kanan: allEvents.filter((e) => e.eventType === "klik_kanan").length,
    tutup_halaman: allEvents.filter((e) => e.eventType === "tutup_halaman").length,
  };

  const avgIntegrity = Math.round(
    studentSummaries.reduce((acc, s) => acc + s.integrityScorePct, 0) / (totalStudents || 1)
  );

  let integrityRating: "Sangat Tinggi" | "Tinggi" | "Perlu Perhatian" | "Kritis" = "Sangat Tinggi";
  if (flaggedStudentsCount >= 5 || avgIntegrity < 75) {
    integrityRating = "Perlu Perhatian";
  } else if (flaggedStudentsCount >= 2 || avgIntegrity < 90) {
    integrityRating = "Tinggi";
  }

  return {
    tokenCode,
    assessmentTitle,
    className,
    teacherName,
    teacherNip,
    totalStudents,
    completedStudents,
    cleanStudentsCount,
    flaggedStudentsCount,
    totalIncidents,
    incidentTypeBreakdown,
    integrityRating,
    averageIntegrityScore: avgIntegrity,
    students: studentSummaries,
  };
}

// -------------------------------------------------------------
// Helper Export CSV untuk Bukti Audit Kejadian Mencurigakan
// -------------------------------------------------------------
export function exportCheatingAuditToCsv(report: ClassCheatingReport): string {
  const headers = [
    "No",
    "Nama Siswa",
    "Kelas",
    "Token",
    "Waktu Selesai",
    "Durasi (menit)",
    "Status Integritas",
    "Total Kejadian",
    "Tingkat Keparahan",
    "Rincian Kejadian (Jenis & Waktu)",
  ];

  const rows = report.students.map((s, idx) => {
    const eventsStr = s.events
      .map((e) => `[${e.eventLabel} @ ${e.occurredAt.replace("T", " ")}: ${e.detail}]`)
      .join("; ");

    return [
      idx + 1,
      `"${s.studentName}"`,
      `"${s.className}"`,
      `"${s.tokenCode}"`,
      s.submittedAt ? `"${s.submittedAt.replace("T", " ")}"` : `"-"`,
      s.durationMinutes || 0,
      `"${s.integrityStatus}"`,
      s.totalEvents,
      `"${s.highestSeverity.toUpperCase()}"`,
      `"${eventsStr || "Nihil Kejadian / Integritas Terjaga Penuh"}"`,
    ].join(",");
  });

  return [headers.join(","), ...rows].join("\n");
}

/**
 * Mengambil rekap integritas kelas dan log kecurangan langsung dari tabel `cheating_logs` dan `student_submissions` di Supabase
 */
export async function fetchClassCheatingReportFromSupabase(
  tokenCode: string = "GEO-IXA"
): Promise<ClassCheatingReport | null> {
  if (typeof window === "undefined") return null;

  try {
    const supabase = createClient();
    const cleanToken = tokenCode.trim().toUpperCase();

    // 1. Ambil data asesmen
    const { data: asm, error: asmErr } = await supabase
      .from("assessments")
      .select("id, title, max_uses, classes(name), profiles(full_name, nip)")
      .eq("token_code", cleanToken)
      .maybeSingle();

    if (asmErr || !asm) return null;

    const assessmentId = asm.id;
    const assessmentTitle = asm.title;
    const className = (asm.classes as any)?.name || "Kelas XI-A";
    const teacherName = (asm.profiles as any)?.full_name || "Guru";
    const teacherNip = (asm.profiles as any)?.nip || "-";

    // 2. Ambil log kecurangan dari tabel cheating_logs
    const { data: logs } = await supabase
      .from("cheating_logs")
      .select("*")
      .eq("assessment_id", assessmentId)
      .order("occurred_at", { ascending: true });

    // 3. Ambil daftar siswa dari tabel student_submissions
    const { data: subs } = await supabase
      .from("student_submissions")
      .select("*")
      .eq("assessment_id", assessmentId)
      .order("created_at", { ascending: true });

    if (!subs || subs.length === 0) {
      return {
        tokenCode: cleanToken,
        assessmentTitle,
        className,
        teacherName,
        teacherNip,
        totalStudents: asm.max_uses || 0,
        completedStudents: 0,
        cleanStudentsCount: 0,
        flaggedStudentsCount: 0,
        totalIncidents: 0,
        incidentTypeBreakdown: {
          pindah_tab: 0,
          keluar_halaman: 0,
          keluar_layar_penuh: 0,
          salin_soal: 0,
          klik_kanan: 0,
          tutup_halaman: 0,
        },
        integrityRating: "Sangat Tinggi",
        averageIntegrityScore: 100,
        students: [],
      };
    }

    const events: CheatingEvent[] = (logs || []).map((l: any) => ({
      id: l.id,
      attemptId: l.submission_id || undefined,
      studentId: `std-${l.student_name.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      studentName: l.student_name,
      className: className,
      tokenCode: cleanToken,
      eventType: l.event_type as CheatingEventType,
      eventLabel: l.event_label,
      occurredAt: l.occurred_at,
      detail: l.detail || "",
      questionNumber: l.question_number || undefined,
      durationSeconds: l.duration_seconds || 0,
      severity: l.severity as "rendah" | "sedang" | "tinggi",
    }));

    const studentSummaries: StudentCheatingSummary[] = subs.map((sub: any) => {
      const studentEvents = events.filter(
        (e) => e.studentName.toLowerCase() === sub.student_name.toLowerCase()
      );
      const totalEvents = studentEvents.length;
      const hasCheating = totalEvents > 0;

      let highestSeverity: "nihil" | "rendah" | "sedang" | "tinggi" = "nihil";
      if (studentEvents.some((e) => e.severity === "tinggi")) highestSeverity = "tinggi";
      else if (studentEvents.some((e) => e.severity === "sedang")) highestSeverity = "sedang";
      else if (studentEvents.some((e) => e.severity === "rendah")) highestSeverity = "rendah";

      let integrityStatus: "Integritas Terjaga" | "Perlu Konfirmasi" | "Indikasi Pelanggaran" = "Integritas Terjaga";
      if (highestSeverity === "tinggi" || totalEvents >= 3) {
        integrityStatus = "Indikasi Pelanggaran";
      } else if (highestSeverity === "sedang" || totalEvents >= 1) {
        integrityStatus = "Perlu Konfirmasi";
      }

      let penalty = 0;
      studentEvents.forEach((e) => {
        if (e.severity === "tinggi") penalty += 20;
        else if (e.severity === "sedang") penalty += 10;
        else penalty += 5;
      });
      const integrityScorePct = Math.max(0, 100 - penalty);

      return {
        studentId: sub.student_identifier || `std-${sub.id}`,
        studentName: sub.student_name,
        className,
        tokenCode: cleanToken,
        submittedAt: sub.submitted_at || undefined,
        durationMinutes: sub.duration_minutes || 0,
        status: sub.status === "terkirim" ? "terkirim" : "berlangsung",
        totalEvents,
        hasCheating,
        events: studentEvents,
        highestSeverity,
        integrityStatus,
        integrityScorePct,
        pahamCount: sub.paham_count || 0,
        miskonsepsiCount: sub.miskonsepsi_count || 0,
        belumPahamCount: sub.belum_paham_count || 0,
      };
    });

    const totalStudents = asm.max_uses || studentSummaries.length;
    const completedStudents = studentSummaries.filter((s) => s.status === "terkirim").length;
    const flaggedStudentsCount = studentSummaries.filter((s) => s.hasCheating).length;
    const cleanStudentsCount = studentSummaries.filter((s) => !s.hasCheating).length;
    const totalIncidents = events.length;

    const breakdown: Record<CheatingEventType, number> = {
      pindah_tab: 0,
      keluar_halaman: 0,
      keluar_layar_penuh: 0,
      salin_soal: 0,
      klik_kanan: 0,
      tutup_halaman: 0,
    };
    events.forEach((e) => {
      if (breakdown[e.eventType] !== undefined) breakdown[e.eventType]++;
    });

    const avgIntegrity =
      studentSummaries.length > 0
        ? Math.round(studentSummaries.reduce((acc, s) => acc + s.integrityScorePct, 0) / studentSummaries.length)
        : 100;

    let integrityRating: "Sangat Tinggi" | "Tinggi" | "Perlu Perhatian" | "Kritis" = "Sangat Tinggi";
    if (avgIntegrity < 60 || flaggedStudentsCount > totalStudents * 0.5) integrityRating = "Kritis";
    else if (avgIntegrity < 75 || flaggedStudentsCount > totalStudents * 0.3) integrityRating = "Perlu Perhatian";
    else if (avgIntegrity < 90) integrityRating = "Tinggi";

    return {
      tokenCode: cleanToken,
      assessmentTitle,
      className,
      teacherName,
      teacherNip,
      totalStudents,
      completedStudents,
      cleanStudentsCount,
      flaggedStudentsCount,
      totalIncidents,
      incidentTypeBreakdown: breakdown,
      integrityRating,
      averageIntegrityScore: avgIntegrity,
      students: studentSummaries,
    };
  } catch (err) {
    console.warn("Gagal fetch laporan kecurangan dari Supabase:", err);
    return null;
  }
}
