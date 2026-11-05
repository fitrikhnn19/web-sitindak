// teacher-results-mock-data.ts
// Data tiruan & service diagnostik lengkap untuk Profil Pemahaman Siswa (Fase 2 SITINDAK)

import { createClient } from "./supabase/client";
import {
  MOCK_QUESTIONS,
  ThreeTierQuestion,
  ConceptionStatus,
  evaluateConception,
  QuestionOption,
} from "./assessment-mock-data";

export interface StudentItemResult {
  questionId: string;
  questionNumber: number;
  title: string;
  prerequisiteTopic: string;
  tier1Answer: "A" | "B" | "C" | "D" | "E";
  tier1CorrectAnswer: "A" | "B" | "C" | "D" | "E";
  isTier1Correct: boolean;
  tier2Answer: "A" | "B" | "C" | "D" | "E";
  tier2CorrectAnswer: "A" | "B" | "C" | "D" | "E";
  isTier2Correct: boolean;
  tier3Confidence: "yakin" | "tidak yakin";
  status: ConceptionStatus; // "paham" | "miskonsepsi" | "belum paham"
  feedbackNote: string;
}

export interface StudentResult {
  id: string;
  studentName: string;
  className: string;
  submittedAt: string;
  durationMinutes: number;
  cheatingEventsCount: number;
  tier1Score: number; // e.g. 8/10
  tier2Score: number; // e.g. 7/10
  pahamCount: number;
  miskonsepsiCount: number;
  belumPahamCount: number;
  itemResults: StudentItemResult[];
  needsPrerequisiteReview: string[];
  differentiatedRecommendation: string;
}

export type RepetitionLevel =
  | "Sangat Butuh Pengulangan"
  | "Butuh Pengulangan"
  | "Tuntas / Siap Lanjut";

export interface PrerequisiteTopicMap {
  topicName: string;
  relatedQuestionNumbers: number[];
  relatedQuestionIds: string[];
  totalStudents: number;
  pahamCount: number;
  miskonsepsiCount: number;
  belumPahamCount: number;
  pahamPercentage: number;
  problemPercentage: number; // (miskonsepsi + belum paham) / total * 100
  repetitionNeed: RepetitionLevel;
  pedagogicalAction: string;
  affectedStudentNames: string[];
}

export interface ItemStatistic {
  questionId: string;
  questionNumber: number;
  title: string;
  prerequisiteTopic: string;
  totalAnswered: number;
  pahamCount: number;
  miskonsepsiCount: number;
  belumPahamCount: number;
  pahamRate: number;
  miskonsepsiRate: number;
  belumPahamRate: number;
  tier1Distribution: Record<"A" | "B" | "C" | "D" | "E", number>;
  tier2Distribution: Record<"A" | "B" | "C" | "D" | "E", number>;
  confidenceDistribution: { yakin: number; tidakYakin: number };
}

export interface ClassAssessmentSummary {
  tokenCode: string;
  assessmentTitle: string;
  className: string;
  teacherName: string;
  totalQuota: number;
  completedCount: number;
  opensAt: string;
  closesAt: string;
  status: "berjalan" | "selesai" | "draf";
  totalQuestions: number;
  classAverageTier1Score: number;
  classAverageTier2Score: number;
  overallMasteryRate: number;
  overallMisconceptionRate: number;
  overallUnmasteredRate: number;
  students: StudentResult[];
  prerequisiteMap: PrerequisiteTopicMap[];
  itemAnalytics: ItemStatistic[];
}

// -------------------------------------------------------------
// 16 Siswa Realistis Kelas XI-A (Token: GEO-IXA)
// -------------------------------------------------------------
interface RawStudentAnswerSpec {
  id: string;
  name: string;
  submittedAt: string;
  durationMinutes: number;
  cheatingEvents: number;
  // Answers for q-1 through q-10: [tier1, tier2, tier3]
  answers: Record<string, ["A" | "B" | "C" | "D" | "E", "A" | "B" | "C" | "D" | "E", "yakin" | "tidak yakin"]>;
  recommendation: string;
}

// Correct answers reference from MOCK_QUESTIONS:
// q-1: T1: B, T2: A
// q-2: T1: A, T2: A
// q-3: T1: A, T2: A
// q-4: T1: A, T2: A
// q-5: T1: A, T2: A
// q-6: T1: A, T2: A
// q-7: T1: A, T2: A
// q-8: T1: A, T2: A
// q-9: T1: A, T2: A
// q-10: T1: A, T2: A

const RAW_STUDENTS_IXA: RawStudentAnswerSpec[] = [];
export const MOCK_STUDENTS_IXA: StudentResult[] = [];

// -------------------------------------------------------------
// Calculate Prerequisite Topics & Item Analytics
// -------------------------------------------------------------
function buildPrerequisiteMap(
  questions: ThreeTierQuestion[],
  students: StudentResult[]
): PrerequisiteTopicMap[] {
  const topicMap = new Map<
    string,
    {
      qNums: number[];
      qIds: string[];
      paham: number;
      miskonsepsi: number;
      belumPaham: number;
      affectedStudents: Set<string>;
    }
  >();

  questions.forEach((q) => {
    if (!topicMap.has(q.prerequisiteTopic)) {
      topicMap.set(q.prerequisiteTopic, {
        qNums: [],
        qIds: [],
        paham: 0,
        miskonsepsi: 0,
        belumPaham: 0,
        affectedStudents: new Set<string>(),
      });
    }
    const entry = topicMap.get(q.prerequisiteTopic)!;
    if (!entry.qNums.includes(q.number)) entry.qNums.push(q.number);
    if (!entry.qIds.includes(q.id)) entry.qIds.push(q.id);
  });

  // Tally from student results
  students.forEach((std) => {
    std.itemResults.forEach((ir) => {
      const entry = topicMap.get(ir.prerequisiteTopic);
      if (!entry) return;

      if (ir.status === "paham") {
        entry.paham += 1;
      } else if (ir.status === "miskonsepsi") {
        entry.miskonsepsi += 1;
        entry.affectedStudents.add(std.studentName);
      } else {
        entry.belumPaham += 1;
        entry.affectedStudents.add(std.studentName);
      }
    });
  });

  const totalStudents = students.length;

  return Array.from(topicMap.entries()).map(([topicName, data]) => {
    const totalOccurrences = data.paham + data.miskonsepsi + data.belumPaham;
    const pahamPct = totalOccurrences > 0 ? Math.round((data.paham / totalOccurrences) * 100) : 0;
    const problemPct = totalOccurrences > 0 ? Math.round(
      ((data.miskonsepsi + data.belumPaham) / totalOccurrences) * 100
    ) : 0;

    let repetitionNeed: RepetitionLevel = "Tuntas / Siap Lanjut";
    let pedagogicalAction = "";

    if (problemPct >= 45) {
      repetitionNeed = "Sangat Butuh Pengulangan";
      pedagogicalAction =
        "Wajib diulas secara klasikal selama 15–20 menit di awal bab. Gunakan peraga fisik koordinat atau software GeoGebra sebelum melangkah ke translasi & refleksi majemuk.";
    } else if (problemPct >= 25) {
      repetitionNeed = "Butuh Pengulangan";
      pedagogicalAction =
        "Cukup dibahas melalui 2–3 contoh pembanding (soal jebakan) pada awal pertemuan, atau diberikan tugas apersepsi mandiri untuk siswa terdampak.";
    } else {
      repetitionNeed = "Tuntas / Siap Lanjut";
      pedagogicalAction =
        "Mayoritas siswa sudah menguasai konsep ini dengan mantap. Siap langsung dipakai sebagai pijakan bab transformasi geometri.";
    }

    return {
      topicName,
      relatedQuestionNumbers: data.qNums.sort((a, b) => a - b),
      relatedQuestionIds: data.qIds,
      totalStudents,
      pahamCount: data.paham,
      miskonsepsiCount: data.miskonsepsi,
      belumPahamCount: data.belumPaham,
      pahamPercentage: pahamPct,
      problemPercentage: problemPct,
      repetitionNeed,
      pedagogicalAction,
      affectedStudentNames: Array.from(data.affectedStudents),
    };
  });
}

function buildItemAnalytics(
  questions: ThreeTierQuestion[],
  students: StudentResult[]
): ItemStatistic[] {
  return questions.map((q) => {
    let pahamCount = 0;
    let miskonsepsiCount = 0;
    let belumPahamCount = 0;
    const t1Dist: Record<"A" | "B" | "C" | "D" | "E", number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
    };
    const t2Dist: Record<"A" | "B" | "C" | "D" | "E", number> = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
    };
    const confDist = { yakin: 0, tidakYakin: 0 };

    students.forEach((s) => {
      const item = s.itemResults.find((ir) => ir.questionId === q.id);
      if (!item) return;

      if (item.status === "paham") pahamCount++;
      else if (item.status === "miskonsepsi") miskonsepsiCount++;
      else belumPahamCount++;

      if (item.tier1Answer) t1Dist[item.tier1Answer]++;
      if (item.tier2Answer) t2Dist[item.tier2Answer]++;
      if (item.tier3Confidence === "yakin") confDist.yakin++;
      else confDist.tidakYakin++;
    });

    const total = students.length;

    return {
      questionId: q.id,
      questionNumber: q.number,
      title: q.title,
      prerequisiteTopic: q.prerequisiteTopic,
      totalAnswered: total,
      pahamCount,
      miskonsepsiCount,
      belumPahamCount,
      pahamRate: total > 0 ? Math.round((pahamCount / total) * 100) : 0,
      miskonsepsiRate: total > 0 ? Math.round((miskonsepsiCount / total) * 100) : 0,
      belumPahamRate: total > 0 ? Math.round((belumPahamCount / total) * 100) : 0,
      tier1Distribution: t1Dist,
      tier2Distribution: t2Dist,
      confidenceDistribution: confDist,
    };
  });
}

// -------------------------------------------------------------
// Overall Assessment Summaries
// -------------------------------------------------------------
export function createEmptyAssessmentSummary(tokenCode: string = ""): ClassAssessmentSummary {
  return {
    tokenCode,
    assessmentTitle: "Belum Ada Asesmen",
    className: "-",
    teacherName: "-",
    totalQuota: 0,
    completedCount: 0,
    opensAt: new Date().toISOString(),
    closesAt: new Date().toISOString(),
    status: "draf",
    totalQuestions: 0,
    classAverageTier1Score: 0,
    classAverageTier2Score: 0,
    overallMasteryRate: 0,
    overallMisconceptionRate: 0,
    overallUnmasteredRate: 0,
    students: [],
    prerequisiteMap: [],
    itemAnalytics: [],
  };
}

export const MOCK_ASSESSMENT_SUMMARY_GEO_IXA: ClassAssessmentSummary = createEmptyAssessmentSummary("GEO-IXA");
export const MOCK_ASSESSMENT_SUMMARY_TRANS_9B: ClassAssessmentSummary = createEmptyAssessmentSummary("TRANS-9B");
export const MOCK_SUMMARIES_BY_TOKEN: Record<string, ClassAssessmentSummary> = {};

export function getAssessmentSummaryByToken(tokenCode: string): ClassAssessmentSummary {
  return MOCK_SUMMARIES_BY_TOKEN[tokenCode] || createEmptyAssessmentSummary(tokenCode);
}

export function generateCsvExport(summary: ClassAssessmentSummary): string {
  const lines: string[] = [];

  // Metadata headers
  lines.push(`"SITINDAK - Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi"`);
  lines.push(`"Laporan Profil Pemahaman Siswa"`);
  lines.push(`"Judul Asesmen:","${summary.assessmentTitle}"`);
  lines.push(`"Kelas:","${summary.className}"`);
  lines.push(`"Guru Pengampu:","${summary.teacherName}"`);
  lines.push(`"Kode Token:","${summary.tokenCode}"`);
  lines.push(`"Tanggal Unduh:","${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}"`);
  lines.push(`"Jumlah Siswa Mengerjakan:","${summary.completedCount} dari ${summary.totalQuota} kuota"`);
  lines.push(`"Rata-rata Skor Tingkat 1:","${summary.classAverageTier1Score} / 10"`);
  lines.push(`"Rata-rata Skor Tingkat 2:","${summary.classAverageTier2Score} / 10"`);
  lines.push(`"Persentase Sudah Paham:","${summary.overallMasteryRate}%"`);
  lines.push(`"Persentase Miskonsepsi:","${summary.overallMisconceptionRate}%"`);
  lines.push(`"Persentase Belum Paham:","${summary.overallUnmasteredRate}%"`);
  lines.push("");

  // Table header
  const questionHeaders = Array.from({ length: summary.totalQuestions }, (_, i) => `Q${i + 1}`).join(",");
  lines.push(`"No","Nama Siswa","Skor T1","Skor T2","Paham","Miskonsepsi","Belum Paham",${questionHeaders},"Materi Prasyarat Perlu Diulang","Catatan Rekomendasi"`);

  // Student rows
  summary.students.forEach((s, idx) => {
    const qStatuses = s.itemResults
      .map((item) => {
        let label = "Belum Paham";
        if (item.status === "paham") label = "Paham";
        if (item.status === "miskonsepsi") label = "Miskonsepsi";
        return `"${label} (T1:${item.tier1Answer}, T2:${item.tier2Answer}, ${item.tier3Confidence})"`;
      })
      .join(",");

    const reviewTopics = `"${s.needsPrerequisiteReview.join("; ")}"`;
    const rec = `"${s.differentiatedRecommendation.replace(/"/g, '""')}"`;

    lines.push(
      `"${idx + 1}","${s.studentName}","${s.tier1Score}","${s.tier2Score}","${s.pahamCount}","${s.miskonsepsiCount}","${s.belumPahamCount}",${qStatuses},${reviewTopics},${rec}`
    );
  });

  lines.push("");
  lines.push(`"=== PETA MATERI PRASYARAT ASESMEN ==="`);
  lines.push(`"Materi Prasyarat","Butir Terkait","% Paham","% Miskonsepsi","% Belum Paham","Tingkat Kebutuhan Pengulangan","Rekomendasi Tindak Lanjut"`);

  summary.prerequisiteMap.forEach((pm) => {
    lines.push(
      `"${pm.topicName}","${pm.relatedQuestionNumbers.map((n) => `Q${n}`).join(", ")}","${pm.pahamPercentage}%","${Math.round((pm.miskonsepsiCount / (pm.totalStudents * pm.relatedQuestionNumbers.length)) * 100)}%","${Math.round((pm.belumPahamCount / (pm.totalStudents * pm.relatedQuestionNumbers.length)) * 100)}%","${pm.repetitionNeed}","${pm.pedagogicalAction.replace(/"/g, '""')}"`
    );
  });

  return lines.join("\r\n");
}

export function triggerDownload(content: string, filename: string, mimeType = "text/csv;charset=utf-8;") {
  const blob = new Blob(["\uFEFF" + content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Memuat ringkasan hasil asesmen kelas langsung dari tabel Supabase:
 * `assessments`, `student_submissions`, `student_answers`, dan `cheating_logs`
 */
export async function fetchAssessmentSummaryFromSupabase(
  tokenCode: string = "GEO-IXA"
): Promise<ClassAssessmentSummary | null> {
  if (typeof window === "undefined") return null;

  try {
    const supabase = createClient();
    const cleanToken = tokenCode.trim().toUpperCase();

    // 1. Ambil data asesmen dengan relasi kelas, profil, dan butir soal
    const { data: asm, error: asmErr } = await supabase
      .from("assessments")
      .select(`
        id,
        title,
        max_uses,
        used_count,
        opens_at,
        closes_at,
        status,
        classes (
          id,
          name,
          grade_level
        ),
        profiles (
          full_name,
          nip
        ),
        assessment_questions (
          order_index,
          questions (*)
        )
      `)
      .eq("token_code", cleanToken)
      .maybeSingle();

    if (asmErr || !asm) return null;

    // 2. Ambil seluruh submission siswa pada asesmen ini
    const { data: subs, error: subsErr } = await supabase
      .from("student_submissions")
      .select(`
        id,
        student_name,
        student_identifier,
        started_at,
        submitted_at,
        duration_minutes,
        paham_count,
        miskonsepsi_count,
        belum_paham_count,
        created_at,
        student_answers (
          question_id,
          tier1_answer,
          tier2_reason,
          tier3_confidence,
          is_t1_correct,
          is_t2_correct,
          conception_status
        )
      `)
      .eq("assessment_id", asm.id)
      .order("created_at", { ascending: true });

    // 3. Susun daftar butir soal dari relasi asesmen
    const rawQuestions = Array.isArray(asm.assessment_questions)
      ? [...asm.assessment_questions].sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))
      : [];

    const questions: ThreeTierQuestion[] = rawQuestions
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
          tier3Prompt: q.tier3_prompt || "Apakah Anda yakin dengan pilihan Anda?",
          explanation: q.explanation || "",
        };
      });

    const activeQuestions = questions.length > 0 ? questions : MOCK_QUESTIONS;

    if (!subs || subs.length === 0) {
      return {
        tokenCode: cleanToken,
        assessmentTitle: asm.title,
        className: (asm.classes as any)?.name || "Kelas",
        teacherName: (asm.profiles as any)?.full_name || "Guru",
        totalQuota: asm.max_uses || 32,
        completedCount: 0,
        opensAt: asm.opens_at,
        closesAt: asm.closes_at,
        status: asm.status as any,
        totalQuestions: activeQuestions.length,
        classAverageTier1Score: 0,
        classAverageTier2Score: 0,
        overallMasteryRate: 0,
        overallMisconceptionRate: 0,
        overallUnmasteredRate: 0,
        students: [],
        prerequisiteMap: buildPrerequisiteMap(activeQuestions, []),
        itemAnalytics: buildItemAnalytics(activeQuestions, []),
      };
    }

    // 4. Ambil jumlah log kecurangan per siswa
    const { data: logs } = await supabase
      .from("cheating_logs")
      .select("student_name")
      .eq("assessment_id", asm.id);

    const cheatingCountMap: Record<string, number> = {};
    (logs || []).forEach((l: any) => {
      const nameKey = (l.student_name || "").toLowerCase();
      cheatingCountMap[nameKey] = (cheatingCountMap[nameKey] || 0) + 1;
    });

    // 5. Susun hasil diagnostik per siswa
    const studentResults: StudentResult[] = subs.map((sub: any, idx: number) => {
      const answersMap: Record<string, any> = {};
      if (Array.isArray(sub.student_answers)) {
        sub.student_answers.forEach((sa: any) => {
          answersMap[sa.question_id] = sa;
        });
      }

      let tier1Correct = 0;
      let tier2Correct = 0;
      const reviewTopicsSet = new Set<string>();

      const itemResults: StudentItemResult[] = activeQuestions.map((q) => {
        const sa = answersMap[q.id];
        const t1Ans = (sa?.tier1_answer || "A") as "A" | "B" | "C" | "D" | "E";
        const t2Ans = (sa?.tier2_reason || "A") as "A" | "B" | "C" | "D" | "E";
        const t3Conf = (sa?.tier3_confidence || "tidak yakin") as "yakin" | "tidak yakin";

        const t1CorrectKey = q.tier1Options.find((o) => o.isCorrect)?.key || "A";
        const t2CorrectKey = q.tier2Options.find((o) => o.isCorrect)?.key || "A";

        const isT1 = sa?.is_t1_correct ?? (t1Ans === t1CorrectKey);
        const isT2 = sa?.is_t2_correct ?? (t2Ans === t2CorrectKey);

        if (isT1) tier1Correct++;
        if (isT2) tier2Correct++;

        let status: ConceptionStatus = "belum paham";
        if (sa?.conception_status) {
          status = sa.conception_status as ConceptionStatus;
        } else {
          status = evaluateConception(q, {
            questionId: q.id,
            tier1Answer: t1Ans,
            tier2Answer: t2Ans,
            tier3Confidence: t3Conf,
          });
        }

        if (status !== "paham" && q.prerequisiteTopic) {
          reviewTopicsSet.add(q.prerequisiteTopic);
        }

        return {
          questionId: q.id,
          questionNumber: q.number,
          title: q.title,
          prerequisiteTopic: q.prerequisiteTopic,
          tier1Answer: t1Ans,
          tier1CorrectAnswer: t1CorrectKey,
          isTier1Correct: isT1,
          tier2Answer: t2Ans,
          tier2CorrectAnswer: t2CorrectKey,
          isTier2Correct: isT2,
          tier3Confidence: t3Conf,
          status,
          feedbackNote:
            status === "paham"
              ? "Konsep dan alasan dikuasai dengan keyakinan penuh."
              : status === "miskonsepsi"
              ? "Siswa yakin namun terdapat kekeliruan konsep."
              : "Siswa belum yakin dengan pemahaman konsep ini.",
        };
      });

      const cheatingEventsCount = cheatingCountMap[(sub.student_name || "").toLowerCase()] || 0;
      const paham = sub.paham_count ?? itemResults.filter((ir) => ir.status === "paham").length;
      const misk = sub.miskonsepsi_count ?? itemResults.filter((ir) => ir.status === "miskonsepsi").length;
      const belum = sub.belum_paham_count ?? itemResults.filter((ir) => ir.status === "belum paham").length;

      let differentiatedRecommendation = "Pengayaan mandiri materi lanjutan transformasi geometri.";
      if (misk >= 3) {
        differentiatedRecommendation = "Remedial terarah: diskusikan perbedaan konsep dan pembuktian koordinat.";
      } else if (belum >= 3) {
        differentiatedRecommendation = "Bimbingan bertahap: pengulangan dasar sistem koordinat kartesius.";
      }

      return {
        id: sub.student_identifier || `std-${idx + 1}`,
        studentName: sub.student_name,
        className: (asm.classes as any)?.name || "Kelas XI-A",
        submittedAt: sub.submitted_at || sub.created_at,
        durationMinutes: sub.duration_minutes || 25,
        cheatingEventsCount,
        tier1Score: tier1Correct,
        tier2Score: tier2Correct,
        pahamCount: paham,
        miskonsepsiCount: misk,
        belumPahamCount: belum,
        itemResults,
        needsPrerequisiteReview: Array.from(reviewTopicsSet),
        differentiatedRecommendation,
      };
    });

    const prerequisiteMap = buildPrerequisiteMap(activeQuestions, studentResults);
    const itemAnalytics = buildItemAnalytics(activeQuestions, studentResults);

    const totalStudents = studentResults.length;
    const totalPossible = totalStudents * activeQuestions.length;
    const totalPaham = studentResults.reduce((acc, s) => acc + s.pahamCount, 0);
    const totalMisk = studentResults.reduce((acc, s) => acc + s.miskonsepsiCount, 0);
    const totalBelum = studentResults.reduce((acc, s) => acc + s.belumPahamCount, 0);

    const avgT1 = totalStudents > 0
      ? Number((studentResults.reduce((acc, s) => acc + s.tier1Score, 0) / totalStudents).toFixed(1))
      : 0;
    const avgT2 = totalStudents > 0
      ? Number((studentResults.reduce((acc, s) => acc + s.tier2Score, 0) / totalStudents).toFixed(1))
      : 0;

    return {
      tokenCode: cleanToken,
      assessmentTitle: asm.title,
      className: (asm.classes as any)?.name || "Kelas XI-A",
      teacherName: (asm.profiles as any)?.full_name || "Guru",
      totalQuota: asm.max_uses || 32,
      completedCount: totalStudents,
      opensAt: asm.opens_at,
      closesAt: asm.closes_at,
      status: asm.status as any,
      totalQuestions: activeQuestions.length,
      classAverageTier1Score: avgT1,
      classAverageTier2Score: avgT2,
      overallMasteryRate: totalPossible > 0 ? Math.round((totalPaham / totalPossible) * 100) : 0,
      overallMisconceptionRate: totalPossible > 0 ? Math.round((totalMisk / totalPossible) * 100) : 0,
      overallUnmasteredRate: totalPossible > 0 ? Math.round((totalBelum / totalPossible) * 100) : 0,
      students: studentResults,
      prerequisiteMap,
      itemAnalytics,
    };
  } catch (err) {
    console.warn("Gagal fetch summary asesmen dari Supabase:", err);
    return null;
  }
}

