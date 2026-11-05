// src/lib/student-submission-service.ts
// Layanan Penyimpanan & Sinkronisasi Pengerjaan Siswa, Jawaban 3-Tier, dan Log Kecurangan ke Supabase
// Terhubung langsung ke tabel `student_submissions`, `student_answers`, dan `cheating_logs` (RLS dinonaktifkan)

import { createClient } from "./supabase/client";
import {
  ThreeTierQuestion,
  StudentAnswer,
  ConceptionStatus,
  evaluateConception,
  MOCK_QUESTIONS,
} from "./assessment-mock-data";
import { CheatingEvent } from "./cheating-detection-store";
import { resolveQuestionUuid, getAllAssessments, saveAssessments } from "./assessment-management-store";

export interface StudentSubmissionPayload {
  tokenCode: string;
  studentName: string;
  startedAt: string;
  submittedAt: string;
  durationMinutes: number;
  answers: Record<string, StudentAnswer>;
  cheatingEvents: CheatingEvent[];
  questions: ThreeTierQuestion[];
  assessmentId?: string;
  submittedDueToTimeUp?: boolean;
}

export interface SubmissionSaveResult {
  success: boolean;
  submissionId?: string;
  assessmentId?: string;
  pahamCount: number;
  miskonsepsiCount: number;
  belumPahamCount: number;
  totalScore: number;
  error?: string;
}

/**
 * Mengambil daftar butir soal tiga tingkat yang ditugaskan khusus untuk asesmen token tertentu
 */
export async function fetchQuestionsForAssessment(tokenCode: string): Promise<ThreeTierQuestion[]> {
  try {
    const supabase = createClient();
    const cleanToken = tokenCode.trim().toUpperCase();

    const { data: asm, error: asmErr } = await supabase
      .from("assessments")
      .select(`
        id,
        assessment_questions (
          order_index,
          questions (*)
        )
      `)
      .eq("token_code", cleanToken)
      .maybeSingle();

    if (asmErr) {
      console.warn("Gagal fetch soal dari Supabase, fallback ke MOCK_QUESTIONS:", asmErr);
      return MOCK_QUESTIONS;
    }

    if (asm && Array.isArray(asm.assessment_questions) && asm.assessment_questions.length > 0) {
      const sorted = [...asm.assessment_questions].sort(
        (a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)
      );

      const mapped: ThreeTierQuestion[] = sorted
        .filter((aq: any) => aq.questions)
        .map((aq: any, idx: number) => {
          const q = aq.questions;
          const t1Opts = (q.tier1_options as any) || {};
          const t2Opts = (q.tier2_options as any) || {};

          return {
            id: q.id,
            number: idx + 1,
            title: q.title || `Soal #${idx + 1}`,
            topic: q.topic || "Geometri",
            prerequisiteTopic: q.prerequisite_topic || "",
            tier1Question: q.tier1_question,
            tier1SvgDiagram: q.svg_diagram,
            imageUrl: q.image_url,
            tier1Options: (["A", "B", "C", "D", "E"] as const).map((key) => ({
              key,
              text: t1Opts[key] || "",
              isCorrect: t1Opts.correctOption === key,
            })),
            tier2Question: q.tier2_question,
            tier2Options: (["A", "B", "C", "D", "E"] as const).map((key) => ({
              key,
              text: t2Opts[key] || "",
              isCorrect: t2Opts.correctOption === key,
            })),
            tier3Prompt:
              q.tier3_prompt || "Apakah Anda yakin dengan jawaban Anda?",
            explanation: q.explanation || "",
          };
        });

      if (mapped.length > 0) return mapped;
    }

    return MOCK_QUESTIONS;
  } catch (err) {
    console.warn("Kesalahan fetch soal asesmen Supabase:", err);
    return MOCK_QUESTIONS;
  }
}

/**
 * Menyimpan rekaman kecurangan secara realtime ke Supabase saat kejadian berlangsung di layar siswa
 */
export async function recordCheatingLogToSupabase(
  event: Omit<CheatingEvent, "id">,
  assessmentId?: string
): Promise<void> {
  try {
    const supabase = createClient();
    let targetAssessmentId = assessmentId;

    if (!targetAssessmentId) {
      const { data: asm } = await supabase
        .from("assessments")
        .select("id")
        .eq("token_code", event.tokenCode.trim().toUpperCase())
        .maybeSingle();
      if (asm) targetAssessmentId = asm.id;
    }

    if (!targetAssessmentId) return;

    await supabase.from("cheating_logs").insert({
      assessment_id: targetAssessmentId,
      student_name: event.studentName.trim(),
      event_type: event.eventType,
      event_label: event.eventLabel,
      severity: event.severity || "sedang",
      detail: event.detail || "",
      question_number: event.questionNumber || null,
      duration_seconds: event.durationSeconds || 0,
      occurred_at: event.occurredAt || new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Gagal menyimpan log kecurangan realtime ke Supabase:", err);
  }
}

/**
 * Menyimpan pengiriman akhir ujian siswa:
 * 1. Simpan/update data ke tabel `student_submissions`
 * 2. Simpan setiap butir jawaban dan diagnosis ke tabel `student_answers`
 * 3. Simpan log pelanggaran integritas ke tabel `cheating_logs`
 * 4. Update pemakaian token (`used_count`) di tabel `assessments`
 * 5. Update local cache untuk idempotency dan tampilan guru
 */
export async function submitStudentAssessmentToSupabase(
  payload: StudentSubmissionPayload
): Promise<SubmissionSaveResult> {
  let pahamCount = 0;
  let miskonsepsiCount = 0;
  let belumPahamCount = 0;

  // Evaluasi diagnostik 3-tier
  const evaluatedAnswers = payload.questions.map((q) => {
    const ans = payload.answers[q.id];
    const status: ConceptionStatus = evaluateConception(q, ans);

    if (status === "paham") pahamCount++;
    else if (status === "miskonsepsi") miskonsepsiCount++;
    else belumPahamCount++;

    const t1CorrectOpt = q.tier1Options.find((o) => o.isCorrect)?.key;
    const t2CorrectOpt = q.tier2Options.find((o) => o.isCorrect)?.key;

    const isT1Correct = ans?.tier1Answer ? ans.tier1Answer === t1CorrectOpt : false;
    const isT2Correct = ans?.tier2Answer ? ans.tier2Answer === t2CorrectOpt : false;

    return {
      rawQuestionId: q.id,
      questionUuid: resolveQuestionUuid(q.id),
      tier1Answer: ans?.tier1Answer || null,
      tier2Reason: ans?.tier2Answer || null,
      tier3Confidence: ans?.tier3Confidence || null,
      isT1Correct,
      isT2Correct,
      conceptionStatus: status,
    };
  });

  const totalQuestions = Math.max(1, payload.questions.length);
  const totalScore = Math.round((pahamCount / totalQuestions) * 100);

  // Backup ke LocalStorage
  if (typeof window !== "undefined") {
    try {
      const storageKey = `sitindak_submission_${payload.tokenCode}_${payload.studentName.toLowerCase()}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          tokenCode: payload.tokenCode,
          studentName: payload.studentName,
          startedAt: payload.startedAt,
          submittedAt: payload.submittedAt,
          durationMinutes: payload.durationMinutes,
          answers: payload.answers,
          cheatingCount: payload.cheatingEvents.length,
          cheatingEvents: payload.cheatingEvents,
          submittedDueToTimeUp: payload.submittedDueToTimeUp,
          pahamCount,
          miskonsepsiCount,
          belumPahamCount,
          totalScore,
        })
      );
    } catch (e) {
      console.warn("Gagal simpan backup submission ke localStorage:", e);
    }
  }

  try {
    const supabase = createClient();
    let targetAssessmentId = payload.assessmentId;
    let currentUsedCount = 0;

    // 1. Cari Assessment ID
    if (!targetAssessmentId) {
      const { data: asm } = await supabase
        .from("assessments")
        .select("id, used_count")
        .eq("token_code", payload.tokenCode.trim().toUpperCase())
        .maybeSingle();

      if (asm) {
        targetAssessmentId = asm.id;
        currentUsedCount = asm.used_count || 0;
      }
    }

    if (!targetAssessmentId) {
      console.warn(`Asesmen dengan token ${payload.tokenCode} tidak ditemukan di Supabase.`);
      return {
        success: true,
        pahamCount,
        miskonsepsiCount,
        belumPahamCount,
        totalScore,
      };
    }

    // 2. Cek apakah siswa ini sudah memiliki submission sebelumnya
    let submissionId: string | undefined;
    const { data: existingSub } = await supabase
      .from("student_submissions")
      .select("id")
      .eq("assessment_id", targetAssessmentId)
      .ilike("student_name", payload.studentName.trim())
      .maybeSingle();

    if (existingSub) {
      submissionId = existingSub.id;
      await supabase
        .from("student_submissions")
        .update({
          status: "terkirim",
          submitted_at: payload.submittedAt,
          duration_minutes: payload.durationMinutes,
          paham_count: pahamCount,
          miskonsepsi_count: miskonsepsiCount,
          belum_paham_count: belumPahamCount,
          total_score: totalScore,
        })
        .eq("id", submissionId);
    } else {
      const newSubId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : undefined;

      const subInsertData: any = {
        assessment_id: targetAssessmentId,
        student_name: payload.studentName.trim(),
        student_identifier: `std-${payload.studentName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
        status: "terkirim",
        started_at: payload.startedAt,
        submitted_at: payload.submittedAt,
        duration_minutes: payload.durationMinutes,
        paham_count: pahamCount,
        miskonsepsi_count: miskonsepsiCount,
        belum_paham_count: belumPahamCount,
        total_score: totalScore,
      };
      if (newSubId) subInsertData.id = newSubId;

      const { data: createdSub, error: subErr } = await supabase
        .from("student_submissions")
        .insert(subInsertData)
        .select("id")
        .single();

      if (subErr) {
        console.warn("Gagal insert ke student_submissions:", subErr);
      } else if (createdSub) {
        submissionId = createdSub.id;
      }

      // Update used_count asesmen
      await supabase
        .from("assessments")
        .update({ used_count: currentUsedCount + 1 })
        .eq("id", targetAssessmentId);
    }

    // 3. Simpan jawaban siswa ke tabel `student_answers`
    if (submissionId) {
      // Hapus jawaban sebelumnya bila ada untuk idempoten
      await supabase.from("student_answers").delete().eq("submission_id", submissionId);

      const answersToInsert = evaluatedAnswers.map((ea) => ({
        submission_id: submissionId,
        question_id: ea.questionUuid,
        tier1_answer: ea.tier1Answer,
        tier2_reason: ea.tier2Reason,
        tier3_confidence: ea.tier3Confidence,
        is_t1_correct: ea.isT1Correct,
        is_t2_correct: ea.isT2Correct,
        conception_status: ea.conceptionStatus,
      }));

      const { error: ansErr } = await supabase.from("student_answers").insert(answersToInsert);
      if (ansErr) {
        console.warn("Gagal insert ke student_answers:", ansErr);
      }
    }

    // 4. Simpan event pelanggaran/kecurangan ke tabel `cheating_logs`
    if (submissionId && payload.cheatingEvents && payload.cheatingEvents.length > 0) {
      const logsToInsert = payload.cheatingEvents.map((evt) => ({
        assessment_id: targetAssessmentId,
        submission_id: submissionId,
        student_name: payload.studentName.trim(),
        event_type: evt.eventType,
        event_label: evt.eventLabel,
        severity: evt.severity || "sedang",
        detail: evt.detail || "",
        question_number: evt.questionNumber || null,
        duration_seconds: evt.durationSeconds || 0,
        occurred_at: evt.occurredAt || new Date().toISOString(),
      }));

      await supabase.from("cheating_logs").insert(logsToInsert);
    }

    // 5. Perbarui status siswa di `assessment-management-store`
    const allAssessments = getAllAssessments();
    const targetAssessment = allAssessments.find((a) => a.id === targetAssessmentId || a.token.code === payload.tokenCode);
    if (targetAssessment) {
      const existingStudent = targetAssessment.students.find(
        (s) => s.name.toLowerCase() === payload.studentName.toLowerCase()
      );
      if (existingStudent) {
        existingStudent.status = "terkirim";
        existingStudent.submittedAt = payload.submittedAt;
        existingStudent.durationMinutes = payload.durationMinutes;
        existingStudent.pahamCount = pahamCount;
        existingStudent.miskonsepsiCount = miskonsepsiCount;
        existingStudent.belumPahamCount = belumPahamCount;
        existingStudent.cheatingEventsCount = payload.cheatingEvents.length;
      } else {
        targetAssessment.students.unshift({
          id: `std-real-${payload.studentName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
          name: payload.studentName,
          status: "terkirim",
          startedAt: payload.startedAt,
          submittedAt: payload.submittedAt,
          durationMinutes: payload.durationMinutes,
          pahamCount,
          miskonsepsiCount,
          belumPahamCount,
          cheatingEventsCount: payload.cheatingEvents.length,
        });
      }
      saveAssessments(allAssessments);
    }

    return {
      success: true,
      submissionId,
      assessmentId: targetAssessmentId,
      pahamCount,
      miskonsepsiCount,
      belumPahamCount,
      totalScore,
    };
  } catch (err) {
    console.error("Kesalahan sinkronisasi pengerjaan siswa ke Supabase:", err);
    return {
      success: true,
      pahamCount,
      miskonsepsiCount,
      belumPahamCount,
      totalScore,
    };
  }
}

