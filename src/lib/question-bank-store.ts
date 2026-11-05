// src/lib/question-bank-store.ts
// Manajemen Kumpulan Soal Tiga Tingkat (Question Bank Store) untuk Guru SITINDAK
// Terhubung langsung ke Supabase PostgreSQL tabel `questions` (RLS dinonaktifkan)

import { createClient } from "./supabase/client";
import { getCurrentTeacherSession } from "./teacher-auth-store";
import { MOCK_QUESTIONS } from "./assessment-mock-data";

export interface QuestionTierOptions {
  A: string;
  B: string;
  C: string;
  D: string;
  E: string;
  correctOption: "A" | "B" | "C" | "D" | "E";
}

export interface QuestionBankItem {
  id: string;
  title: string;
  topic: string;
  prerequisiteTopic: string;
  // Tingkat 1: Pertanyaan utama + opsi A-E + 1 kunci benar
  tier1Question: string;
  tier1Options: QuestionTierOptions;
  // Gambar atau diagram geometris
  imageUrl?: string;
  svgDiagram?: string;
  // Tingkat 2: Pertanyaan alasan + opsi alasan A-E + 1 kunci benar
  tier2Question: string;
  tier2Options: QuestionTierOptions;
  // Tingkat 3: Hanya teks ajakan keyakinan (TIDAK ADA OPSI A-E & TIDAK ADA KUNCI)
  tier3Prompt: string;
  // Pembahasan mendalam & materi prasyarat
  explanation: string;
  // Metadata
  createdAt: string;
  updatedAt?: string;
  linkedAssessments?: string[]; // IDs/Tokens of assessments using this question
}

export interface AssessmentRef {
  id: string;
  code: string;
  title: string;
  className: string;
  questionCount: number;
}

// Preset Geometri SVG siap pakai untuk kemudahan guru matematika
export const GEOMETRY_SVG_PRESETS = [
  {
    id: "preset-translasi",
    title: "Vektor Translasi Kartesius",
    description: "Pergeseran titik P pada sumbu koordinat dengan vektor panah",
    svg: `<svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
  <defs>
    <pattern id="grid_p1" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
    </pattern>
    <marker id="arrow_p1" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#0b8be7" />
    </marker>
  </defs>
  <rect width="260" height="200" fill="#0f172a" rx="10" />
  <rect width="260" height="200" fill="url(#grid_p1)" rx="10" />
  <line x1="130" y1="10" x2="130" y2="190" stroke="#64748b" stroke-width="1.5" />
  <line x1="10" y1="100" x2="250" y2="100" stroke="#64748b" stroke-width="1.5" />
  <text x="245" y="93" fill="#94a3b8" font-size="10" font-weight="bold">X</text>
  <text x="135" y="20" fill="#94a3b8" font-size="10" font-weight="bold">Y</text>
  <circle cx="160" cy="150" r="4.5" fill="#f59e0b" />
  <text x="168" y="156" fill="#fcd34d" font-size="10" font-weight="bold">P(2, -5)</text>
  <line x1="160" y1="150" x2="115" y2="110" stroke="#0b8be7" stroke-width="2.5" stroke-dasharray="3,3" marker-end="url(#arrow_p1)" />
  <circle cx="115" cy="110" r="4.5" fill="#10b981" />
  <text x="80" y="112" fill="#6ee7b7" font-size="10" font-weight="bold">P'(-1, -1)</text>
</svg>`,
  },
  {
    id: "preset-refleksi-x",
    title: "Refleksi terhadap Sumbu X",
    description: "Cermin horizontal dengan titik awal dan titik bayangan simetris",
    svg: `<svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
  <defs>
    <pattern id="grid_p2" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
    </pattern>
  </defs>
  <rect width="260" height="200" fill="#0f172a" rx="10" />
  <rect width="260" height="200" fill="url(#grid_p2)" rx="10" />
  <line x1="10" y1="100" x2="250" y2="100" stroke="#38bdf8" stroke-width="3" />
  <text x="195" y="90" fill="#38bdf8" font-size="10" font-weight="bold">Cermin (Sumbu X)</text>
  <line x1="100" y1="10" x2="100" y2="190" stroke="#64748b" stroke-width="1.5" />
  <circle cx="160" cy="145" r="4.5" fill="#f59e0b" />
  <text x="168" y="152" fill="#fcd34d" font-size="10" font-weight="bold">A(4, -3)</text>
  <line x1="160" y1="145" x2="160" y2="55" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,4" />
  <circle cx="160" cy="55" r="4.5" fill="#10b981" />
  <text x="168" y="52" fill="#6ee7b7" font-size="10" font-weight="bold">A'(4, 3)</text>
</svg>`,
  },
  {
    id: "preset-refleksi-diagonal",
    title: "Refleksi terhadap Garis y = x",
    description: "Cermin garis diagonal y = x dengan garis proyeksi tegak lurus",
    svg: `<svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
  <defs>
    <pattern id="grid_p3" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
    </pattern>
  </defs>
  <rect width="260" height="200" fill="#0f172a" rx="10" />
  <rect width="260" height="200" fill="url(#grid_p3)" rx="10" />
  <line x1="40" y1="160" x2="240" y2="160" stroke="#64748b" stroke-width="1.5" />
  <line x1="40" y1="10" x2="40" y2="180" stroke="#64748b" stroke-width="1.5" />
  <line x1="30" y1="170" x2="200" y2="20" stroke="#38bdf8" stroke-width="2.5" />
  <text x="180" y="35" fill="#38bdf8" font-size="10" font-weight="bold">y = x</text>
  <circle cx="85" cy="55" r="4.5" fill="#f59e0b" />
  <text x="50" y="50" fill="#fcd34d" font-size="10" font-weight="bold">M(3, 7)</text>
  <line x1="85" y1="55" x2="145" y2="115" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3,3" />
  <circle cx="145" cy="115" r="4.5" fill="#10b981" />
  <text x="153" y="122" fill="#6ee7b7" font-size="10" font-weight="bold">M'(7, 3)</text>
</svg>`,
  },
  {
    id: "preset-rotasi-90",
    title: "Rotasi 90° Berlawanan Jarum Jam",
    description: "Busur lingkaran rotasi sudut siku-siku berpusat di titik asal O(0,0)",
    svg: `<svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
  <defs>
    <pattern id="grid_p4" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
    </pattern>
    <marker id="arrow_p4" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
    </marker>
  </defs>
  <rect width="260" height="200" fill="#0f172a" rx="10" />
  <rect width="260" height="200" fill="url(#grid_p4)" rx="10" />
  <line x1="130" y1="10" x2="130" y2="190" stroke="#64748b" stroke-width="1.5" />
  <line x1="10" y1="110" x2="250" y2="110" stroke="#64748b" stroke-width="1.5" />
  <circle cx="130" cy="110" r="3" fill="#cbd5e1" />
  <text x="135" y="122" fill="#94a3b8" font-size="9">O(0,0)</text>
  <circle cx="210" cy="110" r="4.5" fill="#f59e0b" />
  <text x="210" y="128" fill="#fcd34d" font-size="10" font-weight="bold">R(4, 0)</text>
  <circle cx="130" cy="30" r="4.5" fill="#10b981" />
  <text x="80" y="32" fill="#6ee7b7" font-size="10" font-weight="bold">R'(0, 4)</text>
  <path d="M 200 110 A 70 70 0 0 0 130 40" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrow_p4)" />
  <text x="175" y="65" fill="#38bdf8" font-size="10" font-weight="bold">+90°</text>
</svg>`,
  },
  {
    id: "preset-dilatasi",
    title: "Dilatasi Segitiga / Faktor Skala",
    description: "Perbesaran bangun geometris dengan faktor skala k = 2 dari titik pusat",
    svg: `<svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
  <defs>
    <pattern id="grid_p5" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
    </pattern>
  </defs>
  <rect width="260" height="200" fill="#0f172a" rx="10" />
  <rect width="260" height="200" fill="url(#grid_p5)" rx="10" />
  <line x1="30" y1="170" x2="250" y2="170" stroke="#64748b" stroke-width="1.5" />
  <line x1="30" y1="10" x2="30" y2="180" stroke="#64748b" stroke-width="1.5" />
  <circle cx="30" cy="170" r="3" fill="#cbd5e1" />
  <!-- Original Triangle -->
  <polygon points="50,170 90,170 70,130" fill="rgba(245, 158, 11, 0.2)" stroke="#f59e0b" stroke-width="1.5" />
  <text x="55" y="155" fill="#fcd34d" font-size="9" font-weight="bold">Awal</text>
  <!-- Dilated Triangle k=2 -->
  <polygon points="70,170 150,170 110,90" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" stroke-width="2" />
  <text x="95" y="140" fill="#6ee7b7" font-size="10" font-weight="bold">Bayangan (k=2)</text>
  <!-- Ray from Origin -->
  <line x1="30" y1="170" x2="160" y2="40" stroke="#38bdf8" stroke-width="1" stroke-dasharray="3,3" />
</svg>`,
  },
];

// Helper converting MOCK_QUESTIONS into QuestionBankItem[]
function convertMockToBankItems(): QuestionBankItem[] {
  return MOCK_QUESTIONS.map((q, idx) => {
    const t1Correct = q.tier1Options.find((opt) => opt.isCorrect)?.key || "A";
    const t2Correct = q.tier2Options.find((opt) => opt.isCorrect)?.key || "A";

    const getOptText = (opts: typeof q.tier1Options, key: "A" | "B" | "C" | "D" | "E") => {
      const match = opts.find((o) => o.key === key);
      return match ? match.text : "";
    };

    return {
      id: q.id,
      title: q.title || `Soal ${q.number}: ${q.topic}`,
      topic: q.topic,
      prerequisiteTopic: q.prerequisiteTopic,
      tier1Question: q.tier1Question,
      svgDiagram: q.tier1SvgDiagram,
      tier1Options: {
        A: getOptText(q.tier1Options, "A"),
        B: getOptText(q.tier1Options, "B"),
        C: getOptText(q.tier1Options, "C"),
        D: getOptText(q.tier1Options, "D"),
        E: getOptText(q.tier1Options, "E"),
        correctOption: t1Correct,
      },
      tier2Question: q.tier2Question,
      tier2Options: {
        A: getOptText(q.tier2Options, "A"),
        B: getOptText(q.tier2Options, "B"),
        C: getOptText(q.tier2Options, "C"),
        D: getOptText(q.tier2Options, "D"),
        E: getOptText(q.tier2Options, "E"),
        correctOption: t2Correct,
      },
      tier3Prompt:
        q.tier3Prompt ||
        "Seberapa yakin Anda dengan pilihan jawaban tingkat 1 dan alasan tingkat 2 di atas?",
      explanation: q.explanation,
      createdAt: `2026-10-${(10 + idx).toString().padStart(2, "0")}T08:00:00Z`,
      linkedAssessments: [],
    };
  });
}

const STORAGE_KEY = "sitindak_teacher_question_bank_v1";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

let memoryBank: QuestionBankItem[] | null = null;

function mapDbRowToQuestionItem(row: any): QuestionBankItem {
  return {
    id: row.id,
    title: row.title,
    topic: row.topic || "Geometri",
    prerequisiteTopic: row.prerequisite_topic || "",
    tier1Question: row.tier1_question,
    tier1Options: row.tier1_options as QuestionTierOptions,
    tier2Question: row.tier2_question,
    tier2Options: row.tier2_options as QuestionTierOptions,
    tier3Prompt:
      row.tier3_prompt ||
      "Seberapa yakin Anda dengan pilihan jawaban tingkat 1 dan alasan tingkat 2 di atas?",
    explanation: row.explanation || "",
    imageUrl: row.image_url,
    svgDiagram: row.svg_diagram,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    linkedAssessments: [],
  };
}

/**
 * Mengambil seluruh soal dari cache lokal (cepat & aman untuk SSR)
 */
export function getAllQuestions(): QuestionBankItem[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Failed to read from localStorage:", err);
    return memoryBank || [];
  }
}

/**
 * Memuat soal langsung dari tabel `questions` di Supabase
 */
export async function fetchQuestionsFromSupabase(): Promise<QuestionBankItem[]> {
  if (!isBrowser()) return [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.warn("Gagal mengambil soal dari Supabase, menggunakan cache:", error);
      return getAllQuestions();
    }

    if (data && Array.isArray(data)) {
      const mapped = data.map(mapDbRowToQuestionItem);
      persistQuestions(mapped);
      return mapped;
    }

    return getAllQuestions();
  } catch (err) {
    console.error("Kesalahan fetch soal Supabase:", err);
    return getAllQuestions();
  }
}

export function getQuestionById(id: string): QuestionBankItem | null {
  const all = getAllQuestions();
  return all.find((q) => q.id === id) || null;
}

/**
 * Menyimpan soal (Insert atau Update) ke database Supabase dan cache lokal
 */
export async function saveQuestion(item: QuestionBankItem): Promise<QuestionBankItem> {
  const all = getAllQuestions();
  const existingIdx = all.findIndex((q) => q.id === item.id);
  const timestamp = new Date().toISOString();
  const currentTeacher = getCurrentTeacherSession();

  let savedItem: QuestionBankItem = {
    ...item,
    updatedAt: timestamp,
  };

  try {
    const supabase = createClient();
    const { data: authData } = await supabase.auth.getUser();
    const teacherId = authData?.user?.id || currentTeacher?.id || "1af1750b-4f72-454d-8477-f15c3d875fcf";

    if (existingIdx >= 0) {
      // Update
      const { data: updated, error } = await supabase
        .from("questions")
        .update({
          title: item.title,
          topic: item.topic,
          prerequisite_topic: item.prerequisiteTopic,
          tier1_question: item.tier1Question,
          tier1_options: item.tier1Options as any,
          tier2_question: item.tier2Question,
          tier2_options: item.tier2Options as any,
          tier3_prompt: item.tier3Prompt,
          explanation: item.explanation,
          image_url: item.imageUrl || null,
          svg_diagram: item.svgDiagram || null,
          updated_at: timestamp,
        })
        .eq("id", item.id)
        .select()
        .single();

      if (error) {
        console.warn("Gagal update soal di Supabase:", error);
      } else if (updated) {
        savedItem = mapDbRowToQuestionItem(updated);
      }

      const updatedList = [...all];
      updatedList[existingIdx] = savedItem;
      persistQuestions(updatedList);
      return savedItem;
    } else {
      // Insert
      const { data: inserted, error } = await supabase
        .from("questions")
        .insert({
          teacher_id: teacherId,
          title: item.title,
          topic: item.topic,
          prerequisite_topic: item.prerequisiteTopic,
          tier1_question: item.tier1Question,
          tier1_options: item.tier1Options as any,
          tier2_question: item.tier2Question,
          tier2_options: item.tier2Options as any,
          tier3_prompt: item.tier3Prompt,
          explanation: item.explanation,
          image_url: item.imageUrl || null,
          svg_diagram: item.svgDiagram || null,
          is_public: true,
        })
        .select()
        .single();

      if (error) {
        console.warn("Gagal insert soal di Supabase, fallback lokal:", error);
        savedItem = {
          ...item,
          id: item.id || `q-custom-${Date.now()}`,
          createdAt: item.createdAt || timestamp,
        };
      } else if (inserted) {
        savedItem = mapDbRowToQuestionItem(inserted);
      }

      const updatedList = [savedItem, ...all];
      persistQuestions(updatedList);
      return savedItem;
    }
  } catch (err) {
    console.error("Kesalahan jaringan save soal:", err);
    const updatedList = [savedItem, ...all];
    persistQuestions(updatedList);
    return savedItem;
  }
}

/**
 * Menghapus soal dari database Supabase dan cache lokal
 */
export async function deleteQuestion(id: string): Promise<boolean> {
  const all = getAllQuestions();
  const filtered = all.filter((q) => q.id !== id);
  if (filtered.length === all.length) return false;

  try {
    const supabase = createClient();
    const { error } = await supabase.from("questions").delete().eq("id", id);
    if (error) {
      console.warn("Gagal menghapus soal dari Supabase:", error);
    }
  } catch (err) {
    console.error("Kesalahan delete soal Supabase:", err);
  }

  persistQuestions(filtered);
  return true;
}

export async function duplicateQuestion(id: string): Promise<QuestionBankItem | null> {
  const original = getQuestionById(id);
  if (!original) return null;

  const duplicated: QuestionBankItem = {
    ...JSON.parse(JSON.stringify(original)),
    id: "",
    title: `${original.title} (Salinan)`,
    createdAt: new Date().toISOString(),
    linkedAssessments: [],
  };

  return saveQuestion(duplicated);
}

export function resetToDefaultQuestions(): QuestionBankItem[] {
  persistQuestions([]);
  return [];
}

export function importSampleGeometryQuestions(): QuestionBankItem[] {
  const initial = convertMockToBankItems();
  persistQuestions(initial);
  return initial;
}

export function linkQuestionsToAssessment(assessmentCode: string, questionIds: string[]): boolean {
  const all = getAllQuestions();
  const updated = all.map((q) => {
    if (questionIds.includes(q.id)) {
      const current = q.linkedAssessments || [];
      if (!current.includes(assessmentCode)) {
        return { ...q, linkedAssessments: [...current, assessmentCode] };
      }
    }
    return q;
  });
  persistQuestions(updated);

  (async () => {
    try {
      const supabase = createClient();
      const { data: asm } = await supabase
        .from("assessments")
        .select("id")
        .eq("token_code", assessmentCode)
        .maybeSingle();

      if (asm) {
        // Query existing links to prevent duplicates
        const { data: existing } = await supabase
          .from("assessment_questions")
          .select("question_id")
          .eq("assessment_id", asm.id);

        const existingSet = new Set((existing || []).map((e: any) => e.question_id));
        const newRows = questionIds
          .filter((qId) => !existingSet.has(qId))
          .map((qId, i) => ({
            assessment_id: asm.id,
            question_id: qId,
            order_index: (existing?.length || 0) + i + 1,
          }));

        if (newRows.length > 0) {
          await supabase.from("assessment_questions").insert(newRows);
        }
      }
    } catch (e) {
      console.error("Gagal sinkron linkQuestionsToAssessment:", e);
    }
  })();

  return true;
}

function persistQuestions(items: QuestionBankItem[]) {
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new Event("sitindak_questions_change"));
    } catch (e) {
      console.error("Failed to persist questions to localStorage:", e);
    }
  }
  memoryBank = items;
}

export const AVAILABLE_ASSESSMENTS: AssessmentRef[] = [];
