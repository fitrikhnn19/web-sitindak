// student-results-store.ts
// Store, diagnostic calculations, and mock data provider for Feature 08: Hasil & Pembahasan untuk Siswa

import {
  MOCK_QUESTIONS,
  MOCK_TOKENS,
  ThreeTierQuestion,
  StudentAnswer,
  ConceptionStatus,
  evaluateConception,
  AssessmentToken,
} from "./assessment-mock-data";
import { getAllAssessments } from "./assessment-management-store";
import { createClient } from "./supabase/client";

export interface StudentSubmissionData {
  tokenCode: string;
  studentName: string;
  className: string;
  assessmentTitle: string;
  teacherName: string;
  startedAt: string;
  submittedAt: string;
  answers: Record<string, StudentAnswer>;
  cheatingCount?: number;
}

export interface QuestionEvaluationDetail {
  question: ThreeTierQuestion;
  studentT1?: "A" | "B" | "C" | "D" | "E";
  studentT2?: "A" | "B" | "C" | "D" | "E";
  studentT3?: "yakin" | "tidak yakin";
  studentT1Text?: string;
  studentT2Text?: string;
  correctT1: "A" | "B" | "C" | "D" | "E";
  correctT2: "A" | "B" | "C" | "D" | "E";
  correctT1Text: string;
  correctT2Text: string;
  isT1Correct: boolean;
  isT2Correct: boolean;
  status: ConceptionStatus;
  diagnosticReasonText: string;
  prerequisiteTopic: string;
}

export interface RemedialTopicDetail {
  topicName: string;
  missedQuestionNumbers: number[];
  missedQuestionIds: string[];
  misconceptionCount: number;
  unmasteredCount: number;
  guidanceRecommendation: string;
}

export interface StudentDiagnosticSummary {
  studentName: string;
  className: string;
  assessmentTitle: string;
  teacherName: string;
  submittedAt: string;
  totalQuestions: number;
  
  // Jawaban benar metrics (Task 2)
  tier1CorrectCount: number;
  tier1Accuracy: number;
  tier2CorrectCount: number;
  tier2Accuracy: number;
  fullCorrectCount: number; // T1 & T2 correct
  fullAccuracy: number;

  // 3-tier diagnostic status counts (Task 2)
  pahamCount: number;
  pahamPercentage: number;
  miskonsepsiCount: number;
  miskonsepsiPercentage: number;
  belumPahamCount: number;
  belumPahamPercentage: number;

  evaluations: QuestionEvaluationDetail[];
  remedialPrerequisites: RemedialTopicDetail[]; // Task 4
}

export interface AccessValidityResult {
  isValid: boolean;
  reason?: "not_found" | "inactive" | "expired" | "closed" | "simulated_expired";
  title: string;
  message: string;
  closesAt?: string;
  teacherName?: string;
  assessmentTitle?: string;
  tokenCode?: string;
}

// Remedial learning guidance dictionary tailored to geometry prerequisite topics
const PREREQUISITE_LEARNING_GUIDES: Record<string, string> = {
  "Sistem Koordinat Kartesius & Penjumlahan Bilangan Bulat":
    "Perkuat kembali pemahaman mengenai letak sumbu mendatar (absis X) dan sumbu tegak (ordinat Y) serta latihan operasi penjumlahan bilangan bertanda negatif sebelum menentukan letak bayangan translasi.",
  "Sifat Simetri Sumbu Koordinat":
    "Pahami bahwa pencerminan terhadap sumbu X membalik tanda nilai ordinat Y menjadi lawannya (x, -y), sedangkan pencerminan terhadap sumbu Y membalik nilai absis X menjadi (-x, y).",
  "Sifat Simetri Sumbu Tegak Bidang Koordinat":
    "Latih kembali penggambaran titik pada kuadran Kartesius untuk melihat jarak titik ke cermin sumbu Y tegak.",
  "Persamaan Garis Lurus Diagonal & Penukaran Variabel":
    "Refleksi garis diagonal y = x menukar posisi absis dan ordinat tanpa mengubah tandanya (x, y) ➜ (y, x).",
  "Refleksi Garis Diagonal & Tanda Aljabar":
    "Refleksi garis y = -x menukar posisi sekaligus membalik kedua tanda koordinat menjadi (-y, -x). Berhati-hatilah dengan tanda minus ganda.",
  "Sudut dan Orientasi Putaran Trigonometri":
    "Ingat aturan baku rotasi 90° berlawanan arah jarum jam [O, +90°]: (x, y) ➜ (-y, x). Latih putaran kuadran menggunakan busur derajat atau koordinat kartesius sederhana.",
  "Konsep Simetri Putar Setengah Lingkaran":
    "Rotasi 180° berpusat di titik asal selalu membalik kedua tanda koordinat menjadi (-x, -y), baik diputar searah maupun berlawanan arah jarum jam.",
  "Konsep Perbesaran Skala & Perkalian Bilangan Bulat":
    "Dilatasi titik dari pusat O(0,0) dengan faktor skala k mengalikan semua koordinat: (kx, ky). Jangan tertukar dengan menjumlahkan k.",
  "Translasi Beberapa Titik Sudut Poligon":
    "Setiap titik sudut segitiga atau poligon digeser dengan vektor pergeseran yang sama secara serentak tanpa mengubah ukuran luas maupun bentuk bangun aslinya.",
  "Komposisi Refleksi Sumbu X Dilanjutkan Sumbu Y":
    "Komposisi refleksi terhadap dua sumbu koordinat yang saling tegak lurus menghasilkan efek yang sama persis dengan rotasi 180° terhadap titik potong kedua cermin.",
};

// Preset mock student answer profiles for thorough testing of all diagnostic states
export const PRESET_STUDENT_PROFILES = [
  {
    id: "std-01",
    name: "Ahmad Fauzi",
    label: "Ahmad Fauzi (Capaian Tinggi: 8 Paham, 1 Miskonsepsi, 1 Belum Paham)",
    badgeColor: "emerald",
    answers: {
      "q-1": { questionId: "q-1", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-2": { questionId: "q-2", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-3": { questionId: "q-3", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-4": { questionId: "q-4", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-5": { questionId: "q-5", tier1Answer: "B", tier2Answer: "B", tier3Confidence: "yakin" }, // Miskonsepsi
      "q-6": { questionId: "q-6", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "tidak yakin" }, // Belum paham (ragu)
      "q-7": { questionId: "q-7", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-8": { questionId: "q-8", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-9": { questionId: "q-9", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-10": { questionId: "q-10", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
    } as Record<string, StudentAnswer>,
  },
  {
    id: "std-02",
    name: "Siti Rahmawati",
    label: "Siti Rahmawati (Banyak Miskonsepsi: 3 Paham, 5 Miskonsepsi, 2 Belum Paham)",
    badgeColor: "amber",
    answers: {
      "q-1": { questionId: "q-1", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-2": { questionId: "q-2", tier1Answer: "B", tier2Answer: "B", tier3Confidence: "yakin" }, // Miskonsepsi
      "q-3": { questionId: "q-3", tier1Answer: "C", tier2Answer: "A", tier3Confidence: "yakin" }, // Miskonsepsi
      "q-4": { questionId: "q-4", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-5": { questionId: "q-5", tier1Answer: "C", tier2Answer: "B", tier3Confidence: "yakin" }, // Miskonsepsi
      "q-6": { questionId: "q-6", tier1Answer: "B", tier2Answer: "B", tier3Confidence: "yakin" }, // Miskonsepsi
      "q-7": { questionId: "q-7", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-8": { questionId: "q-8", tier1Answer: "B", tier2Answer: "B", tier3Confidence: "yakin" }, // Miskonsepsi
      "q-9": { questionId: "q-9", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "tidak yakin" }, // Belum paham
      "q-10": { questionId: "q-10", tier1Answer: "C", tier2Answer: "B", tier3Confidence: "tidak yakin" }, // Belum paham
    } as Record<string, StudentAnswer>,
  },
  {
    id: "std-03",
    name: "Rizky Pratama",
    label: "Rizky Pratama (Banyak Belum Paham: 2 Paham, 3 Miskonsepsi, 5 Belum Paham)",
    badgeColor: "rose",
    answers: {
      "q-1": { questionId: "q-1", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-2": { questionId: "q-2", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "yakin" }, // Paham
      "q-3": { questionId: "q-3", tier1Answer: "A", tier2Answer: "A", tier3Confidence: "tidak yakin" }, // Belum paham (tebak benar)
      "q-4": { questionId: "q-4", tier1Answer: "D", tier2Answer: "C", tier3Confidence: "tidak yakin" }, // Belum paham
      "q-5": { questionId: "q-5", tier1Answer: "B", tier2Answer: "B", tier3Confidence: "yakin" }, // Miskonsepsi
      "q-6": { questionId: "q-6", tier1Answer: "E", tier2Answer: "E", tier3Confidence: "tidak yakin" }, // Belum paham
      "q-7": { questionId: "q-7", tier1Answer: "C", tier2Answer: "C", tier3Confidence: "yakin" }, // Miskonsepsi
      "q-8": { questionId: "q-8", tier1Answer: "B", tier2Answer: "B", tier3Confidence: "yakin" }, // Miskonsepsi
      "q-9": { questionId: "q-9", tier1Answer: "E", tier2Answer: "E", tier3Confidence: "tidak yakin" }, // Belum paham
      "q-10": { questionId: "q-10", tier1Answer: "B", tier2Answer: "B", tier3Confidence: "tidak yakin" }, // Belum paham
    } as Record<string, StudentAnswer>,
  },
];

/**
 * Checks if the student's access to the results page is valid or expired.
 * Sesuai Sub-fitur Bahan Refleksi & Task 5:
 * Siswa dapat membuka kembali halaman hasil selama tautan/sesi pengerjaannya masih berlaku.
 * Saat akses sudah tidak berlaku, halaman menampilkan pemberitahuan yang jelas.
 */
export function checkAccessValidity(
  tokenCode: string,
  simulateExpired: boolean = false
): AccessValidityResult {
  if (simulateExpired) {
    return {
      isValid: false,
      reason: "simulated_expired",
      title: "Masa Akses Hasil Telah Kedaluwarsa",
      message:
        "Tautan hasil asesmen ini sudah tidak dapat dibuka lagi karena batas waktu refleksi mandiri telah berakhir. Silakan menghubungi guru pengampu jika memerlukan bimbingan lebih lanjut.",
      closesAt: new Date(Date.now() - 3600000).toISOString(),
      tokenCode,
    };
  }

  const cleanCode = (tokenCode || "").trim().toUpperCase();

  // Look in dynamic store first, then fallback to mock tokens
  const storedAssessments = getAllAssessments();
  const matchedAssessment = storedAssessments.find((a) => a.token.code === cleanCode);

  let tokenData: AssessmentToken | undefined = undefined;

  if (matchedAssessment) {
    tokenData = {
      code: matchedAssessment.token.code,
      title: matchedAssessment.title,
      className: matchedAssessment.className,
      teacherName: matchedAssessment.teacherName,
      isActive: matchedAssessment.token.isActive,
      maxUses: matchedAssessment.token.maxUses,
      usedCount: matchedAssessment.token.usedCount,
      opensAt: matchedAssessment.opensAt,
      closesAt: matchedAssessment.closesAt,
      status: matchedAssessment.status,
    };
  } else {
    tokenData = MOCK_TOKENS[cleanCode];
  }

  if (!tokenData) {
    return {
      isValid: false,
      reason: "not_found",
      title: "Asesmen Tidak Ditemukan",
      message:
        "Kode token atau tautan asesmen tidak terdaftar dalam sistem. Periksa kembali tautan yang Anda terima dari guru.",
      tokenCode: cleanCode,
    };
  }

  // 1. Check if token was deactivated by teacher
  if (!tokenData.isActive) {
    return {
      isValid: false,
      reason: "inactive",
      title: "Akses Hasil Dinonaktifkan oleh Guru",
      message: `Guru pengampu (${tokenData.teacherName}) telah menonaktifkan asesmen "${tokenData.title}". Halaman hasil tidak dapat diakses saat ini.`,
      teacherName: tokenData.teacherName,
      assessmentTitle: tokenData.title,
      tokenCode: cleanCode,
    };
  }

  // 2. Check if closesAt has passed
  const now = new Date();
  const closesAtDate = new Date(tokenData.closesAt);
  if (now > closesAtDate) {
    return {
      isValid: false,
      reason: "expired",
      title: "Masa Refleksi Asesmen Telah Berakhir",
      message: `Jadwal asesmen "${tokenData.title}" telah ditutup pada ${closesAtDate.toLocaleString("id-ID", { dateStyle: "full", timeStyle: "short" })} WIB. Sesuai kebijakan guru, halaman pembahasan hanya dibuka selama periode aktif asesmen.`,
      closesAt: tokenData.closesAt,
      teacherName: tokenData.teacherName,
      assessmentTitle: tokenData.title,
      tokenCode: cleanCode,
    };
  }

  // 3. Check status
  if (tokenData.status === "selesai") {
    return {
      isValid: false,
      reason: "closed",
      title: "Asesmen Telah Selesai",
      message: `Pelaksanaan asesmen "${tokenData.title}" untuk ${tokenData.className} telah dinyatakan selesai secara resmi oleh guru pengampu.`,
      teacherName: tokenData.teacherName,
      assessmentTitle: tokenData.title,
      tokenCode: cleanCode,
    };
  }

  // Valid access
  return {
    isValid: true,
    title: "Akses Hasil Valid",
    message: "Sesi hasil masih aktif dan dapat dibaca.",
    closesAt: tokenData.closesAt,
    teacherName: tokenData.teacherName,
    assessmentTitle: tokenData.title,
    tokenCode: cleanCode,
  };
}

/**
 * Retrieve student submission from localStorage if available, or fallback to mock student database
 */
export function createEmptyStudentSubmission(
  tokenCode: string = "",
  studentName: string = ""
): StudentSubmissionData {
  return {
    tokenCode,
    studentName,
    className: "-",
    assessmentTitle: "Belum Ada Pengerjaan",
    teacherName: "Guru",
    startedAt: new Date().toISOString(),
    submittedAt: new Date().toISOString(),
    answers: {},
    cheatingCount: 0,
  };
}

export function getStudentSubmission(
  tokenCode: string,
  studentName: string
): StudentSubmissionData {
  const cleanCode = (tokenCode || "GEO-IXA").trim().toUpperCase();
  const cleanName = (studentName || "Ahmad Fauzi").trim();

  // Try retrieving from localStorage
  if (typeof window !== "undefined") {
    const storageKey = `sitindak_submission_${cleanCode}_${cleanName.toLowerCase()}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.answers) {
          return {
            tokenCode: cleanCode,
            studentName: cleanName,
            className: parsed.className ? parsed.className.replace(/IX/g, "XI") : "Kelas XI-A",
            assessmentTitle:
              parsed.assessmentTitle ||
              "Asesmen Diagnostik Prasyarat Transformasi Geometri",
            teacherName: parsed.teacherName || "Guru",
            startedAt: parsed.startedAt || new Date(Date.now() - 1800000).toISOString(),
            submittedAt: parsed.submittedAt || new Date().toISOString(),
            answers: parsed.answers,
            cheatingCount: parsed.cheatingCount || 0,
          };
        }
      } catch {
        // Fallback to presets
      }
    }
  }

  // Match against preset profiles
  if (PRESET_STUDENT_PROFILES.length > 0) {
    const matchedPreset = PRESET_STUDENT_PROFILES.find(
      (p) => p.name.toLowerCase() === cleanName.toLowerCase()
    ) || PRESET_STUDENT_PROFILES[0];
    return {
      tokenCode: cleanCode,
      studentName: cleanName,
      className: "Kelas XI-A",
      assessmentTitle: "Asesmen Diagnostik",
      teacherName: "Guru",
      startedAt: new Date(Date.now() - 1800000).toISOString(),
      submittedAt: new Date().toISOString(),
      answers: matchedPreset.answers,
      cheatingCount: 0,
    };
  }
  return createEmptyStudentSubmission(cleanCode, cleanName);
}

/**
 * Mengambil rekaman hasil submit siswa langsung dari tabel `student_submissions` & `student_answers` di Supabase
 */
export async function fetchStudentSubmissionFromSupabase(
  tokenCode: string,
  studentName: string
): Promise<StudentSubmissionData | null> {
  if (typeof window === "undefined") return null;

  try {
    const supabase = createClient();
    const cleanToken = tokenCode.trim().toUpperCase();

    const { data: asm, error: asmErr } = await supabase
      .from("assessments")
      .select("id, title, duration_minutes, classes(name), profiles(full_name)")
      .eq("token_code", cleanToken)
      .maybeSingle();

    if (asmErr || !asm) return null;

    const { data: sub, error: subErr } = await supabase
      .from("student_submissions")
      .select(`
        id,
        student_name,
        started_at,
        submitted_at,
        duration_minutes,
        paham_count,
        miskonsepsi_count,
        belum_paham_count,
        student_answers (
          question_id,
          tier1_answer,
          tier2_reason,
          tier3_confidence,
          conception_status
        )
      `)
      .eq("assessment_id", asm.id)
      .ilike("student_name", studentName.trim())
      .maybeSingle();

    if (subErr || !sub) return null;

    const answersMap: Record<string, StudentAnswer> = {};
    if (Array.isArray(sub.student_answers)) {
      sub.student_answers.forEach((sa: any) => {
        answersMap[sa.question_id] = {
          questionId: sa.question_id,
          tier1Answer: sa.tier1_answer,
          tier2Answer: sa.tier2_reason,
          tier3Confidence: sa.tier3_confidence,
        };
      });
    }

    const { count: cheatingCount } = await supabase
      .from("cheating_logs")
      .select("id", { count: "exact", head: true })
      .eq("submission_id", sub.id);

    return {
      tokenCode: cleanToken,
      studentName: sub.student_name,
      className: (asm.classes as any)?.name || "Kelas XI-A",
      assessmentTitle: asm.title,
      teacherName: (asm.profiles as any)?.full_name || "Guru",
      startedAt: sub.started_at,
      submittedAt: sub.submitted_at || new Date().toISOString(),
      answers: answersMap,
      cheatingCount: cheatingCount || 0,
    };
  } catch (err) {
    console.warn("Kesalahan fetch submission siswa dari Supabase:", err);
    return null;
  }
}

/**
 * Perform complete 3-Tier diagnostic evaluation and summary calculation
 * Satisfies all specifications of Feature 08:
 * - Ringkasan jumlah jawaban benar (Tier 1 & Tier 2)
 * - Status pemahaman 3-tier per butir
 * - Pembahasan jawaban benar & pembanding jawaban siswa
 * - Kaitan materi prasyarat & daftar topik yang perlu diulang
 */
export function calculateStudentDiagnostics(
  submission: StudentSubmissionData,
  questions: ThreeTierQuestion[] = MOCK_QUESTIONS
): StudentDiagnosticSummary {
  const evaluations: QuestionEvaluationDetail[] = questions.map((q) => {
    const ans = submission.answers[q.id];
    const status = evaluateConception(q, ans);

    const correctT1Opt = q.tier1Options.find((o) => o.isCorrect);
    const correctT2Opt = q.tier2Options.find((o) => o.isCorrect);

    const correctT1 = (correctT1Opt?.key || "A") as "A" | "B" | "C" | "D" | "E";
    const correctT2 = (correctT2Opt?.key || "A") as "A" | "B" | "C" | "D" | "E";

    const studentT1 = ans?.tier1Answer;
    const studentT2 = ans?.tier2Answer;
    const studentT3 = ans?.tier3Confidence;

    const studentT1Opt = q.tier1Options.find((o) => o.key === studentT1);
    const studentT2Opt = q.tier2Options.find((o) => o.key === studentT2);

    const isT1Correct = Boolean(studentT1 && studentT1 === correctT1);
    const isT2Correct = Boolean(studentT2 && studentT2 === correctT2);

    // Explain pedagogical status in words
    let diagnosticReasonText = "";
    if (status === "paham") {
      diagnosticReasonText =
        "Jawaban Tingkat 1 benar, alasan Tingkat 2 tepat, dan Anda yakin dengan pilihan tersebut. Konsep prasyarat ini sudah Anda kuasai dengan baik.";
    } else if (status === "miskonsepsi") {
      diagnosticReasonText =
        "Anda memilih 'Yakin', namun terdapat kekeliruan pada jawaban atau alasan matematisnya. Hal ini menandakan adanya miskonsepsi yang perlu diluruskan sebelum masuk materi inti.";
    } else {
      diagnosticReasonText =
        "Anda memilih 'Tidak Yakin' atau masih ragu-ragu dengan konsep ini. Pemahaman materi prasyarat ini belum kokoh dan membutuhkan latihan tambahan.";
    }

    return {
      question: q,
      studentT1,
      studentT2,
      studentT3,
      studentT1Text: studentT1Opt?.text,
      studentT2Text: studentT2Opt?.text,
      correctT1,
      correctT2,
      correctT1Text: correctT1Opt?.text || "",
      correctT2Text: correctT2Opt?.text || "",
      isT1Correct,
      isT2Correct,
      status,
      diagnosticReasonText,
      prerequisiteTopic: q.prerequisiteTopic,
    };
  });

  const totalQuestions = questions.length;
  const tier1CorrectCount = evaluations.filter((e) => e.isT1Correct).length;
  const tier2CorrectCount = evaluations.filter((e) => e.isT2Correct).length;
  const fullCorrectCount = evaluations.filter((e) => e.isT1Correct && e.isT2Correct).length;

  const pahamCount = evaluations.filter((e) => e.status === "paham").length;
  const miskonsepsiCount = evaluations.filter((e) => e.status === "miskonsepsi").length;
  const belumPahamCount = evaluations.filter((e) => e.status === "belum paham").length;

  const tier1Accuracy = Math.round((tier1CorrectCount / (totalQuestions || 1)) * 100);
  const tier2Accuracy = Math.round((tier2CorrectCount / (totalQuestions || 1)) * 100);
  const fullAccuracy = Math.round((fullCorrectCount / (totalQuestions || 1)) * 100);

  const pahamPercentage = Math.round((pahamCount / (totalQuestions || 1)) * 100);
  const miskonsepsiPercentage = Math.round((miskonsepsiCount / (totalQuestions || 1)) * 100);
  const belumPahamPercentage = Math.round((belumPahamCount / (totalQuestions || 1)) * 100);

  // Group prerequisite topics needing review (Task 4)
  const missedEvaluations = evaluations.filter((e) => e.status !== "paham");
  const topicMap = new Map<string, QuestionEvaluationDetail[]>();

  for (const item of missedEvaluations) {
    const topic = item.prerequisiteTopic;
    if (!topicMap.has(topic)) {
      topicMap.set(topic, []);
    }
    topicMap.get(topic)!.push(item);
  }

  const remedialPrerequisites: RemedialTopicDetail[] = Array.from(topicMap.entries()).map(
    ([topicName, items]) => {
      const misconceptionCount = items.filter((i) => i.status === "miskonsepsi").length;
      const unmasteredCount = items.filter((i) => i.status === "belum paham").length;
      const missedQuestionNumbers = items.map((i) => i.question.number);
      const missedQuestionIds = items.map((i) => i.question.id);

      const guide =
        PREREQUISITE_LEARNING_GUIDES[topicName] ||
        "Pelajari kembali definisi dan contoh soal konsep dasar ini untuk memperkuat pemahaman sebelum memasuki materi transformasi geometri lanjutan.";

      return {
        topicName,
        missedQuestionNumbers,
        missedQuestionIds,
        misconceptionCount,
        unmasteredCount,
        guidanceRecommendation: guide,
      };
    }
  );

  return {
    studentName: submission.studentName,
    className: submission.className,
    assessmentTitle: submission.assessmentTitle,
    teacherName: submission.teacherName,
    submittedAt: submission.submittedAt,
    totalQuestions,
    tier1CorrectCount,
    tier1Accuracy,
    tier2CorrectCount,
    tier2Accuracy,
    fullCorrectCount,
    fullAccuracy,
    pahamCount,
    pahamPercentage,
    miskonsepsiCount,
    miskonsepsiPercentage,
    belumPahamCount,
    belumPahamPercentage,
    evaluations,
    remedialPrerequisites,
  };
}
