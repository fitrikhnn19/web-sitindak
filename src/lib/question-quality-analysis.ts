// question-quality-analysis.ts
// Skema data, service komputasi, dan data analisis kualitas soal (Fase 3 SITINDAK)
// Sesuai tabel PRD: question_analysis & spesifikasi features/04-analisis-kualitas-soal.md

import {
  MOCK_QUESTIONS,
  ThreeTierQuestion,
  QuestionOption,
} from "./assessment-mock-data";
import { MOCK_QUESTION_ID_MAP } from "./assessment-management-store";
import {
  ClassAssessmentSummary,
  getAssessmentSummaryByToken,
  fetchAssessmentSummaryFromSupabase,
  StudentResult,
} from "./teacher-results-mock-data";

// ---------------------------------------------------------------------------
// 1. Types & Interfaces (Task 9 - Skema Data Analisis Butir Sesuai PRD)
// ---------------------------------------------------------------------------

export type DifficultyLabel = "Terlalu Mudah" | "Sedang" | "Terlalu Sulit";
export type DiscriminationLabel = "Sangat Baik" | "Baik" | "Cukup" | "Lemah";
export type ValidityLabel = "Tinggi" | "Cukup" | "Rendah";
export type ReliabilityLabel = "Tinggi (Sangat Terpercaya)" | "Cukup" | "Rendah";
export type QualityFlag = "layak" | "perlu diperbaiki";

export interface OptionDistractorStat {
  key: "A" | "B" | "C" | "D" | "E";
  text: string;
  isCorrect: boolean;
  totalSelected: number;
  selectionRate: number; // 0 - 100%
  upperGroupSelected: number;
  upperGroupRate: number;
  lowerGroupSelected: number;
  lowerGroupRate: number;
  isDistractorEffective: boolean;
  distractorNote?: string;
}

export interface QuestionQualityItem {
  id: string; // uuid
  assessmentId: string;
  questionId: string;
  questionNumber: number;
  title: string;
  prerequisiteTopic: string;

  // PRD Schema Columns (Tabel question_analysis)
  difficultyIndex: number;      // difficulty_index (0.00 - 1.00)
  discriminationIndex: number;  // discrimination_index (-1.00 - 1.00)
  validityValue: number;        // validity_value (0.00 - 1.00)
  reliabilityValue: number;     // reliability_value (0.00 - 1.00)
  flag: QualityFlag;            // flag ("layak" | "perlu diperbaiki")
  suggestion: string;           // suggestion (saran perbaikan singkat & spesifik)

  // Label Awam (Non-teknis untuk guru)
  difficultyLabel: DifficultyLabel;
  discriminationLabel: DiscriminationLabel;
  validityLabel: ValidityLabel;

  // Komparasi Kelompok (Task 3: Perbandingan Siswa Paham vs Belum Paham)
  upperGroupCorrectCount: number;
  upperGroupTotal: number;
  upperGroupCorrectRate: number; // persentase kelompok atas
  lowerGroupCorrectCount: number;
  lowerGroupTotal: number;
  lowerGroupCorrectRate: number; // persentase kelompok bawah

  // Distribusi Jawaban & Pengecoh
  tier1Distractors: OptionDistractorStat[];
  tier2Distractors: OptionDistractorStat[];
  confidenceStats: {
    yakinRate: number;
    tidakYakinRate: number;
  };

  // Status Diagnostik Tiga Tingkat
  pahamRate: number;
  miskonsepsiRate: number;
  belumPahamRate: number;

  // Analisis Masalah Spesifik
  issueTags: string[];
}

export interface AssessmentQualitySummary {
  tokenCode: string;
  assessmentTitle: string;
  className: string;
  teacherName: string;
  totalStudents: number;
  totalQuestions: number;

  // Reliabilitas Asesmen (PRD reliability_value & Task 4)
  reliabilityValue: number;
  reliabilityLabel: ReliabilityLabel;
  reliabilityExplanation: string;

  // Ringkasan Kelayakan
  layakCount: number;
  perluDiperbaikiCount: number;
  layakPercentage: number;

  // Rata-rata Psikometrik
  averageDifficulty: number;
  averageDifficultyLabel: DifficultyLabel;
  averageDiscrimination: number;
  averageDiscriminationLabel: DiscriminationLabel;
  averageValidity: number;

  // Sebaran Tingkat Kesukaran (Task 2)
  difficultyDistribution: {
    mudah: number;
    sedang: number;
    sulit: number;
  };

  // Sebaran Daya Pembeda (Task 3)
  discriminationDistribution: {
    sangatBaik: number;
    baik: number;
    cukup: number;
    lemah: number;
  };

  // Butir-butir Soal
  items: QuestionQualityItem[];
  lastCalculatedAt: string;
}

// ---------------------------------------------------------------------------
// 2. Helper & Algoritma Analisis Psikometrik (Task 10, 11, 12, 13)
// ---------------------------------------------------------------------------

/**
 * Task 10: Hitung Tingkat Kesukaran (Difficulty Index - P)
 * P = Jumlah Siswa Menjawab Benar (Tingkat 1) / Total Siswa
 */
export function getDifficultyLabel(index: number): DifficultyLabel {
  if (index > 0.70) return "Terlalu Mudah";
  if (index >= 0.30) return "Sedang";
  return "Terlalu Sulit";
}

/**
 * Task 11: Hitung Daya Pembeda (Discrimination Index - D)
 * D = (Proporsi Benar Kelompok Atas - Proporsi Benar Kelompok Bawah)
 */
export function getDiscriminationLabel(index: number): DiscriminationLabel {
  if (index >= 0.40) return "Sangat Baik";
  if (index >= 0.30) return "Baik";
  if (index >= 0.20) return "Cukup";
  return "Lemah";
}

/**
 * Task 12: Interpretasi Validitas Butir (Point-Biserial Correlation - r)
 */
export function getValidityLabel(r: number): ValidityLabel {
  if (r >= 0.40) return "Tinggi";
  if (r >= 0.25) return "Cukup";
  return "Rendah";
}

/**
 * Task 12: Interpretasi Reliabilitas Asesmen (Cronbach's Alpha / KR-20)
 */
export function getReliabilityLabel(alpha: number): ReliabilityLabel {
  if (alpha >= 0.80) return "Tinggi (Sangat Terpercaya)";
  if (alpha >= 0.60) return "Cukup";
  return "Rendah";
}

/**
 * Task 13: Logika Deteksi Soal Bermasalah dan Pembuat Saran Perbaikan Spesifik
 */
function evaluateItemIssuesAndSuggestions(
  qNumber: number,
  diff: number,
  disc: number,
  val: number,
  upperRate: number,
  lowerRate: number,
  tier1Distractors: OptionDistractorStat[],
  misconceptionRate: number
): { flag: QualityFlag; suggestion: string; issueTags: string[] } {
  const issues: string[] = [];

  // Evaluasi Daya Pembeda
  if (disc < 0.20) {
    if (disc < 0) {
      issues.push("Daya pembeda negatif (kelompok bawah lebih banyak benar)");
    } else {
      issues.push("Daya pembeda lemah (tidak membedakan pemahaman)");
    }
  }

  // Evaluasi Kesukaran
  if (diff > 0.75) {
    issues.push("Tingkat kesukaran terlalu mudah");
  } else if (diff < 0.25) {
    issues.push("Tingkat kesukaran terlalu sulit");
  }

  // Evaluasi Validitas
  if (val < 0.25) {
    issues.push("Nilai validitas rendah");
  }

  // Evaluasi Pengecoh (Distractor) Tingkat 1
  const unusedDistractors = tier1Distractors.filter(
    (d) => !d.isCorrect && d.selectionRate === 0
  );
  if (unusedDistractors.length >= 2) {
    issues.push(`Pengecoh ${unusedDistractors.map((d) => d.key).join(" & ")} tidak berfungsi (0% pemilih)`);
  }

  // Evaluasi Pengecoh yang justru dipilih kelompok atas
  const misleadingDistractor = tier1Distractors.find(
    (d) => !d.isCorrect && d.upperGroupRate > 30
  );
  if (misleadingDistractor) {
    issues.push(`Pengecoh ${misleadingDistractor.key} membingungkan siswa kelompok atas`);
  }

  // Flag penentuan
  const isProblematic =
    disc < 0.20 ||
    val < 0.25 ||
    diff > 0.85 ||
    diff < 0.20 ||
    issues.length >= 2;

  const flag: QualityFlag = isProblematic ? "perlu diperbaiki" : "layak";

  // Saran Perbaikan Spesifik (Bahasa awam & instruksional untuk guru)
  let suggestion = "";

  if (disc < 0) {
    suggestion = `Koreksi kunci jawaban atau redaksi butir. Kelompok bawah (${lowerRate}%) menjawab benar lebih tinggi dari kelompok atas (${upperRate}%), kemungkinan opsi jawaban ambigu atau kunci jawaban salah terpasang.`;
  } else if (diff > 0.80 && unusedDistractors.length >= 2) {
    suggestion = `Jawaban terlalu mudah ditebak siswa. Pilihan pengecoh ${unusedDistractors.map((d) => d.key).join(", ")} tidak ada yang memilih. Perbaiki opsi pengecoh dengan salah konsep yang lebih realistis.`;
  } else if (disc < 0.20 && misconceptionRate > 40) {
    suggestion = `Daya pembeda lemah (${disc.toFixed(2)}) dan miskonsepsi tinggi (${misconceptionRate}%). Banyak siswa terkecoh pada alasan tingkat 2. Perjelas kalimat pertanyaan pada tingkat 2 agar tidak multitafsir.`;
  } else if (diff < 0.25) {
    suggestion = `Soal tergolong terlalu sulit bagi siswa (${Math.round(diff * 100)}% benar). Periksa apakah konsep prasyarat sudah tuntas diajarkan, atau sederhanakan notasi rumus pada pertanyaan.`;
  } else if (unusedDistractors.length > 0) {
    suggestion = `Pengecoh ${unusedDistractors.map((d) => d.key).join(" & ")} tidak berfungsi sama sekali. Disarankan merevisi kedua opsi tersebut agar pengecoh lebih seimbang.`;
  } else if (val < 0.25) {
    suggestion = `Korelasi butir dengan skor total asesmen rendah. Butir ini kurang sejalan dengan indikator kompetensi prasyarat yang lain. Perlu perbaikan butir sebelum dipakai kembali.`;
  } else {
    suggestion = `Kualitas butir soal sangat baik dan seimbang. Daya pembeda memadai (${disc.toFixed(2)}) dan pengecoh berfungsi efektif. Siap disimpan ke Bank Soal terverifikasi.`;
  }

  return {
    flag,
    suggestion,
    issueTags: issues.length > 0 ? issues : ["Soal seimbang & berkualitas baik"],
  };
}

// ---------------------------------------------------------------------------
// 3. Engine Analisis Komprehensif (Task 14, 15, 16)
// ---------------------------------------------------------------------------

/**
 * Menghitung analisis psikometrik lengkap per asesmen berdasarkan data jawaban siswa
 */
export function computeAssessmentQuality(
  summary: ClassAssessmentSummary
): AssessmentQualitySummary {
  const students = summary.students;
  const questions = MOCK_QUESTIONS;
  const N = students.length;

  if (N === 0) {
    return createEmptyQualitySummary(summary);
  }

  // 1. Urutkan siswa berdasarkan total skor (Tier 1 score + Tier 2 score)
  const sortedStudents = [...students].sort((a, b) => {
    const scoreA = a.tier1Score + a.tier2Score;
    const scoreB = b.tier1Score + b.tier2Score;
    return scoreB - scoreA;
  });

  // 2. Tentukan Kelompok Atas dan Kelompok Bawah (Upper & Lower 30-33%)
  const groupSize = Math.max(3, Math.round(N * 0.33));
  const upperGroup = sortedStudents.slice(0, groupSize);
  const lowerGroup = sortedStudents.slice(N - groupSize, N);

  // 3. Hitung varians total skor untuk KR-20 / Cronbach's Alpha
  const studentTotalScores = students.map((s) => s.tier1Score);
  const meanScore =
    studentTotalScores.reduce((acc, v) => acc + v, 0) / studentTotalScores.length;
  const varianceScore =
    studentTotalScores.reduce((acc, v) => acc + Math.pow(v - meanScore, 2), 0) /
    studentTotalScores.length;
  const stdDevScore = Math.sqrt(varianceScore || 0.001);

  // 4. Analisis Tiap Butir Soal
  let sumPq = 0;
  const items: QuestionQualityItem[] = questions.map((q) => {
    const matchItem = (ir: any) =>
      ir.questionId === q.id ||
      ir.questionNumber === q.number ||
      MOCK_QUESTION_ID_MAP[q.id] === ir.questionId;

    // Siswa yang menjawab benar di tingkat 1
    const correctCountT1 = students.filter((s) => {
      const item = s.itemResults.find(matchItem);
      return item?.isTier1Correct;
    }).length;

    // Tingkat Kesukaran (P)
    const difficultyIndex = Number((correctCountT1 / N).toFixed(2));
    const pq = difficultyIndex * (1 - difficultyIndex);
    sumPq += pq;

    // Kelompok Atas vs Kelompok Bawah (Daya Pembeda D)
    const upperCorrect = upperGroup.filter((s) => {
      const item = s.itemResults.find(matchItem);
      return item?.isTier1Correct;
    }).length;

    const lowerCorrect = lowerGroup.filter((s) => {
      const item = s.itemResults.find(matchItem);
      return item?.isTier1Correct;
    }).length;

    const upperGroupRate = Math.round((upperCorrect / groupSize) * 100);
    const lowerGroupRate = Math.round((lowerCorrect / groupSize) * 100);
    const discriminationIndex = Number(
      ((upperCorrect - lowerCorrect) / groupSize).toFixed(2)
    );

    // Validitas Butir (Point Biserial r_pbis)
    // r = (Mean_correct - Mean_incorrect) / StdDev * sqrt(p * q)
    const correctScores = students
      .filter((s) => s.itemResults.find(matchItem)?.isTier1Correct)
      .map((s) => s.tier1Score);
    const incorrectScores = students
      .filter((s) => !s.itemResults.find(matchItem)?.isTier1Correct)
      .map((s) => s.tier1Score);

    const meanCorrect =
      correctScores.length > 0
        ? correctScores.reduce((a, b) => a + b, 0) / correctScores.length
        : meanScore;
    const meanIncorrect =
      incorrectScores.length > 0
        ? incorrectScores.reduce((a, b) => a + b, 0) / incorrectScores.length
        : meanScore;

    let validityValue = 0.35;
    if (stdDevScore > 0 && difficultyIndex > 0 && difficultyIndex < 1) {
      validityValue =
        ((meanCorrect - meanIncorrect) / stdDevScore) *
        Math.sqrt(difficultyIndex * (1 - difficultyIndex));
      validityValue = Number(Math.max(-0.2, Math.min(0.95, validityValue)).toFixed(2));
    }

    // Analisis Pilihan Jawaban & Pengecoh Tingkat 1 (Distraktor)
    const tier1Distractors: OptionDistractorStat[] = q.tier1Options.map((opt) => {
      const selectedTotal = students.filter((s) => {
        const item = s.itemResults.find(matchItem);
        return item?.tier1Answer === opt.key;
      }).length;

      const upperSelected = upperGroup.filter((s) => {
        const item = s.itemResults.find(matchItem);
        return item?.tier1Answer === opt.key;
      }).length;

      const lowerSelected = lowerGroup.filter((s) => {
        const item = s.itemResults.find(matchItem);
        return item?.tier1Answer === opt.key;
      }).length;

      const selectionRate = Math.round((selectedTotal / N) * 100);
      const isEffective = opt.isCorrect ? true : selectionRate >= 5;

      let note = "";
      if (opt.isCorrect) {
        note = "Kunci Jawaban Benar";
      } else if (selectionRate === 0) {
        note = "Pengecoh Mati (0% pemilih, tidak efektif)";
      } else if (lowerSelected > upperSelected) {
        note = "Pengecoh Berfungsi Baik (mengecoh kelompok bawah)";
      } else if (upperSelected > lowerSelected) {
        note = "Pengecoh Ambigu (justru mengecoh kelompok atas)";
      } else {
        note = "Pengecoh Cukup Berfungsi";
      }

      return {
        key: opt.key,
        text: opt.text,
        isCorrect: opt.isCorrect,
        totalSelected: selectedTotal,
        selectionRate,
        upperGroupSelected: upperSelected,
        upperGroupRate: Math.round((upperSelected / groupSize) * 100),
        lowerGroupSelected: lowerSelected,
        lowerGroupRate: Math.round((lowerSelected / groupSize) * 100),
        isDistractorEffective: isEffective,
        distractorNote: note,
      };
    });

    // Analisis Pilihan Alasan Tingkat 2 (Distraktor Alasan)
    const tier2Distractors: OptionDistractorStat[] = q.tier2Options.map((opt) => {
      const selectedTotal = students.filter((s) => {
        const item = s.itemResults.find(matchItem);
        return item?.tier2Answer === opt.key;
      }).length;

      const upperSelected = upperGroup.filter((s) => {
        const item = s.itemResults.find(matchItem);
        return item?.tier2Answer === opt.key;
      }).length;

      const lowerSelected = lowerGroup.filter((s) => {
        const item = s.itemResults.find(matchItem);
        return item?.tier2Answer === opt.key;
      }).length;

      const selectionRate = Math.round((selectedTotal / N) * 100);
      return {
        key: opt.key,
        text: opt.text,
        isCorrect: opt.isCorrect,
        totalSelected: selectedTotal,
        selectionRate,
        upperGroupSelected: upperSelected,
        upperGroupRate: Math.round((upperSelected / groupSize) * 100),
        lowerGroupSelected: lowerSelected,
        lowerGroupRate: Math.round((lowerSelected / groupSize) * 100),
        isDistractorEffective: opt.isCorrect ? true : selectionRate >= 5,
        distractorNote: opt.isCorrect
          ? "Alasan Benar"
          : selectionRate === 0
            ? "Alasan Pengecoh Tidak Pernah Dipilih"
            : "Alasan Miskonsepsi",
      };
    });

    // Tingkat Keyakinan
    const yakinCount = students.filter((s) => {
      const item = s.itemResults.find(matchItem);
      return item?.tier3Confidence === "yakin";
    }).length;

    // Tingkat Konsepsi 3-Tier
    const pahamCount = students.filter((s) => {
      const item = s.itemResults.find(matchItem);
      return item?.status === "paham";
    }).length;
    const miskonsepsiCount = students.filter((s) => {
      const item = s.itemResults.find(matchItem);
      return item?.status === "miskonsepsi";
    }).length;
    const belumPahamCount = N - pahamCount - miskonsepsiCount;

    const misRate = Math.round((miskonsepsiCount / N) * 100);

    // Evaluasi Flag & Saran Perbaikan
    const { flag, suggestion, issueTags } = evaluateItemIssuesAndSuggestions(
      q.number,
      difficultyIndex,
      discriminationIndex,
      validityValue,
      upperGroupRate,
      lowerGroupRate,
      tier1Distractors,
      misRate
    );

    return {
      id: `qa-${q.id}`,
      assessmentId: summary.tokenCode,
      questionId: q.id,
      questionNumber: q.number,
      title: q.title,
      prerequisiteTopic: q.prerequisiteTopic,
      difficultyIndex,
      difficultyLabel: getDifficultyLabel(difficultyIndex),
      discriminationIndex,
      discriminationLabel: getDiscriminationLabel(discriminationIndex),
      validityValue,
      validityLabel: getValidityLabel(validityValue),
      reliabilityValue: 0.82, // Nilai reliabilitas asesmen disematkan ke butir sesuai skema PRD
      flag,
      suggestion,
      upperGroupCorrectCount: upperCorrect,
      upperGroupTotal: groupSize,
      upperGroupCorrectRate: upperGroupRate,
      lowerGroupCorrectCount: lowerCorrect,
      lowerGroupTotal: groupSize,
      lowerGroupCorrectRate: lowerGroupRate,
      tier1Distractors,
      tier2Distractors,
      confidenceStats: {
        yakinRate: Math.round((yakinCount / N) * 100),
        tidakYakinRate: Math.round(((N - yakinCount) / N) * 100),
      },
      pahamRate: Math.round((pahamCount / N) * 100),
      miskonsepsiRate: misRate,
      belumPahamRate: Math.round((belumPahamCount / N) * 100),
      issueTags,
    };
  });

  // 5. Hitung Reliabilitas Asesmen Menggunakan Rumus KR-20 (Kuder-Richardson)
  // r = (k / (k - 1)) * (1 - sum(p * q) / var_total)
  const k = questions.length;
  let reliabilityValue = 0.82;
  if (k > 1 && varianceScore > 0) {
    const rawAlpha = (k / (k - 1)) * (1 - sumPq / varianceScore);
    reliabilityValue = Number(Math.max(0.4, Math.min(0.96, rawAlpha)).toFixed(2));
  }

  // Update reliabilitas di tiap butir
  items.forEach((it) => {
    it.reliabilityValue = reliabilityValue;
  });

  // 6. Ringkasan Keseluruhan Asesmen
  const layakCount = items.filter((it) => it.flag === "layak").length;
  const perluDiperbaikiCount = items.length - layakCount;
  const layakPercentage = Math.round((layakCount / items.length) * 100);

  const avgDiff = Number(
    (items.reduce((acc, it) => acc + it.difficultyIndex, 0) / items.length).toFixed(2)
  );
  const avgDisc = Number(
    (
      items.reduce((acc, it) => acc + it.discriminationIndex, 0) / items.length
    ).toFixed(2)
  );
  const avgVal = Number(
    (items.reduce((acc, it) => acc + it.validityValue, 0) / items.length).toFixed(2)
  );

  const diffDist = {
    mudah: items.filter((it) => it.difficultyLabel === "Terlalu Mudah").length,
    sedang: items.filter((it) => it.difficultyLabel === "Sedang").length,
    sulit: items.filter((it) => it.difficultyLabel === "Terlalu Sulit").length,
  };

  const discDist = {
    sangatBaik: items.filter((it) => it.discriminationLabel === "Sangat Baik").length,
    baik: items.filter((it) => it.discriminationLabel === "Baik").length,
    cukup: items.filter((it) => it.discriminationLabel === "Cukup").length,
    lemah: items.filter((it) => it.discriminationLabel === "Lemah").length,
  };

  const reliabilityLabel = getReliabilityLabel(reliabilityValue);
  let reliabilityExplanation =
    "Asesmen memiliki konsistensi tinggi. Hasil tes dapat dipercaya untuk menentukan materi prasyarat yang perlu diulang sebelum masuk transformasi geometri.";
  if (reliabilityValue < 0.6) {
    reliabilityExplanation =
      "Konsistensi asesmen masih rendah. Hasil tes perlu diverifikasi dengan tugas atau observasi harian sebelum mengambil keputusan pembelajaran lanjutan.";
  } else if (reliabilityValue < 0.8) {
    reliabilityExplanation =
      "Konsistensi asesmen cukup memadai. Sebagian besar butir sudah mengukur kompetensi dengan stabil.";
  }

  return {
    tokenCode: summary.tokenCode,
    assessmentTitle: summary.assessmentTitle,
    className: summary.className,
    teacherName: summary.teacherName,
    totalStudents: N,
    totalQuestions: k,
    reliabilityValue,
    reliabilityLabel,
    reliabilityExplanation,
    layakCount,
    perluDiperbaikiCount,
    layakPercentage,
    averageDifficulty: avgDiff,
    averageDifficultyLabel: getDifficultyLabel(avgDiff),
    averageDiscrimination: avgDisc,
    averageDiscriminationLabel: getDiscriminationLabel(avgDisc),
    averageValidity: avgVal,
    difficultyDistribution: diffDist,
    discriminationDistribution: discDist,
    items,
    lastCalculatedAt: new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
}

function createEmptyQualitySummary(
  summary: ClassAssessmentSummary
): AssessmentQualitySummary {
  return {
    tokenCode: summary.tokenCode,
    assessmentTitle: summary.assessmentTitle,
    className: summary.className,
    teacherName: summary.teacherName,
    totalStudents: 0,
    totalQuestions: 10,
    reliabilityValue: 0.0,
    reliabilityLabel: "Rendah",
    reliabilityExplanation: "Belum ada siswa yang menyelesaikan asesmen.",
    layakCount: 0,
    perluDiperbaikiCount: 0,
    layakPercentage: 0,
    averageDifficulty: 0,
    averageDifficultyLabel: "Sedang",
    averageDiscrimination: 0,
    averageDiscriminationLabel: "Lemah",
    averageValidity: 0,
    difficultyDistribution: { mudah: 0, sedang: 0, sulit: 0 },
    discriminationDistribution: { sangatBaik: 0, baik: 0, cukup: 0, lemah: 0 },
    items: [],
    lastCalculatedAt: "-",
  };
}

// ---------------------------------------------------------------------------
// 4. Mock API Endpoints (Task 15 & 16)
// ---------------------------------------------------------------------------

/**
 * Task 15: Endpoint ringkasan kualitas asesmen (Client-side API terhubung Supabase)
 */
export async function getQuestionQualitySummary(
  tokenCode: string
): Promise<AssessmentQualitySummary> {
  const remote = await fetchAssessmentSummaryFromSupabase(tokenCode);
  const summary = remote || getAssessmentSummaryByToken(tokenCode);
  return computeAssessmentQuality(summary);
}

/**
 * Task 16: Endpoint detail analisis per butir (Client-side API terhubung Supabase)
 */
export async function getQuestionQualityDetail(
  tokenCode: string,
  questionId: string
): Promise<{
  question: ThreeTierQuestion;
  analysis: QuestionQualityItem;
} | null> {
  const quality = await getQuestionQualitySummary(tokenCode);
  const analysis = quality.items.find(
    (it) => it.questionId === questionId || `qa-${it.questionId}` === questionId
  );
  const question =
    MOCK_QUESTIONS.find((q) => q.id === questionId) ||
    MOCK_QUESTIONS.find((q) => MOCK_QUESTION_ID_MAP[q.id] === questionId) ||
    (analysis ? MOCK_QUESTIONS.find((q) => q.number === analysis.questionNumber) : undefined);

  if (!analysis || !question) return null;
  return { question, analysis };
}
