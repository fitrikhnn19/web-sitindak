"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Eye,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Info,
  BookOpen,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import {
  QuestionBankItem,
  QuestionTierOptions,
  saveQuestion,
  getQuestionById,
} from "@/lib/question-bank-store";
import { LatexToolbar } from "./LatexToolbar";
import { ImageUploader } from "./ImageUploader";
import { StudentQuestionPreviewModal } from "./StudentQuestionPreviewModal";
import { FormattedMathText } from "@/components/assessment/FormattedMathText";

interface ThreeTierEditorFormProps {
  initialQuestionId?: string | null;
  onSuccess?: (saved: QuestionBankItem) => void;
  onCancel?: () => void;
}

const OPTION_KEYS: ("A" | "B" | "C" | "D" | "E")[] = ["A", "B", "C", "D", "E"];

export const PREREQUISITE_TOPICS_SUGGESTIONS = [
  "Sistem Koordinat Kartesius & Penjumlahan Bilangan Bulat",
  "Sifat Simetri Sumbu Koordinat",
  "Sifat Simetri Sumbu Tegak Bidang Koordinat",
  "Persamaan Garis Lurus Diagonal & Penukaran Variabel",
  "Refleksi Garis Diagonal & Tanda Aljabar",
  "Garis Cermin Sejajar Sumbu Y (x = h) & Jarak Titik",
  "Garis Cermin Sejajar Sumbu X (y = k) & Jarak Titik",
  "Rotasi Titik & Matriks Transformasi Trigonometri Siku",
  "Rotasi 180 Derajat & Hubungan Lawan Koordinat",
  "Konsep Dilatasi, Faktor Skala, & Perkalian Skalar",
];

export const ThreeTierEditorForm: React.FC<ThreeTierEditorFormProps> = ({
  initialQuestionId,
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();

  // Basic info
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("Transformasi Geometri");
  const [prerequisiteTopic, setPrerequisiteTopic] = useState(PREREQUISITE_TOPICS_SUGGESTIONS[0]);

  // Media
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [svgDiagram, setSvgDiagram] = useState<string | undefined>(undefined);

  // Tier 1
  const [tier1Question, setTier1Question] = useState("");
  const [tier1Options, setTier1Options] = useState<QuestionTierOptions>({
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
    correctOption: "A",
  });

  // Tier 2
  const [tier2Question, setTier2Question] = useState(
    "Pilihlah alasan matematis yang mendasari jawaban Anda:"
  );
  const [tier2Options, setTier2Options] = useState<QuestionTierOptions>({
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
    correctOption: "A",
  });

  // Tier 3
  const [tier3Prompt, setTier3Prompt] = useState(
    "Seberapa yakin Anda dengan pilihan jawaban tingkat 1 dan alasan tingkat 2 di atas?"
  );

  // Explanation
  const [explanation, setExplanation] = useState("");

  // Target input field for LaTeX toolbar insertion
  const [activeFieldTarget, setActiveFieldTarget] = useState<
    "t1_q" | "t2_q" | "t1_A" | "t1_B" | "t1_C" | "t1_D" | "t1_E" | "t2_A" | "t2_B" | "t2_C" | "t2_D" | "t2_E" | "expl"
  >("t1_q");

  // Validation errors
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [existingCreatedAt, setExistingCreatedAt] = useState<string | null>(null);

  // Load initial data if editing
  useEffect(() => {
    if (initialQuestionId) {
      const existing = getQuestionById(initialQuestionId);
      if (existing) {
        setTitle(existing.title);
        setTopic(existing.topic);
        setPrerequisiteTopic(existing.prerequisiteTopic);
        setImageUrl(existing.imageUrl);
        setSvgDiagram(existing.svgDiagram);
        setTier1Question(existing.tier1Question);
        setTier1Options(existing.tier1Options);
        setTier2Question(existing.tier2Question);
        setTier2Options(existing.tier2Options);
        setTier3Prompt(existing.tier3Prompt);
        setExplanation(existing.explanation);
        setExistingCreatedAt(existing.createdAt);
      }
    }
  }, [initialQuestionId]);

  // Insert LaTeX snippet into whichever input is focused
  const handleInsertLatex = (snippet: string) => {
    if (activeFieldTarget === "t1_q") {
      setTier1Question((prev) => prev + " " + snippet);
    } else if (activeFieldTarget === "t2_q") {
      setTier2Question((prev) => prev + " " + snippet);
    } else if (activeFieldTarget.startsWith("t1_")) {
      const key = activeFieldTarget.replace("t1_", "") as "A" | "B" | "C" | "D" | "E";
      setTier1Options((prev) => ({
        ...prev,
        [key]: prev[key] ? prev[key] + " " + snippet : snippet,
      }));
    } else if (activeFieldTarget.startsWith("t2_")) {
      const key = activeFieldTarget.replace("t2_", "") as "A" | "B" | "C" | "D" | "E";
      setTier2Options((prev) => ({
        ...prev,
        [key]: prev[key] ? prev[key] + " " + snippet : snippet,
      }));
    } else if (activeFieldTarget === "expl") {
      setExplanation((prev) => prev + " " + snippet);
    }
  };

  // Validation logic
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!title.trim()) {
      errors.push("Judul butir soal wajib diisi.");
    }
    if (!prerequisiteTopic.trim()) {
      errors.push("Materi prasyarat wajib dipilih atau diisi.");
    }
    if (!tier1Question.trim()) {
      errors.push("Pertanyaan Tingkat 1 wajib diisi.");
    }

    // Check all 5 options of Tier 1
    OPTION_KEYS.forEach((key) => {
      if (!tier1Options[key]?.trim()) {
        errors.push(`Pilihan jawaban Tingkat 1 (Opsi ${key}) belum diisi.`);
      }
    });

    if (!tier2Question.trim()) {
      errors.push("Pertanyaan Tingkat 2 (Alasan) wajib diisi.");
    }

    // Check all 5 options of Tier 2
    OPTION_KEYS.forEach((key) => {
      if (!tier2Options[key]?.trim()) {
        errors.push(`Pilihan alasan Tingkat 2 (Alasan ${key}) belum diisi.`);
      }
    });

    if (!tier3Prompt.trim()) {
      errors.push("Ajakan keyakinan Tingkat 3 wajib diisi.");
    }

    // Math validation check
    const checkUnbalancedMath = (str: string, fieldName: string) => {
      const matches = str.match(/\$/g);
      if (matches && matches.length % 2 !== 0) {
        errors.push(`Notasi LaTeX pada ${fieldName} memiliki tanda dollar ($) yang belum tertutup.`);
      }
    };

    checkUnbalancedMath(tier1Question, "Pertanyaan Tingkat 1");
    checkUnbalancedMath(tier2Question, "Pertanyaan Tingkat 2");
    checkUnbalancedMath(explanation, "Pembahasan");

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Prepare current object for preview or saving
  const getCurrentQuestionItem = (): QuestionBankItem => {
    return {
      id: initialQuestionId || `q-custom-${Date.now()}`,
      title: title.trim() || "Butir Soal Tiga Tingkat",
      topic: topic.trim() || "Transformasi Geometri",
      prerequisiteTopic: prerequisiteTopic.trim() || "Konsep Prasyarat",
      tier1Question: tier1Question.trim(),
      imageUrl,
      svgDiagram,
      tier1Options,
      tier2Question: tier2Question.trim(),
      tier2Options,
      tier3Prompt: tier3Prompt.trim(),
      explanation: explanation.trim(),
      createdAt: existingCreatedAt || new Date().toISOString(),
    };
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const item = getCurrentQuestionItem();
    const saved = await saveQuestion(item);

    setSaveSuccessMsg(true);
    setTimeout(() => {
      if (onSuccess) {
        onSuccess(saved);
      } else {
        router.push("/guru/soal");
      }
    }, 1200);
  };

  const handleOpenPreview = () => {
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={onCancel || (() => router.push("/guru/soal"))}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Kumpulan Soal</span>
          </button>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span>{initialQuestionId ? "Sunting Butir Soal 3-Tier" : "Penyusun Soal Tiga Tingkat"}</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Form 3-Tier
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Susun pertanyaan utama (T1), alasan matematis (T2), dan ajakan keyakinan (T3) dalam satu tampilan utuh.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-sm"
          >
            <Eye className="w-4 h-4 text-blue-600" />
            <span>Pratinjau Siswa</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Soal</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-3 animate-in fade-in duration-200">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold">Soal Tiga Tingkat Berhasil Disimpan!</p>
            <p className="text-xs text-emerald-700">
              Soal telah masuk ke dalam Kumpulan Soal dan siap digunakan untuk asesmen kelas. Mengalihkan...
            </p>
          </div>
        </div>
      )}

      {/* Validation Error Box */}
      {validationErrors.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1.5 animate-in shake duration-200">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Harap lengkapi isian soal berikut sebelum menyimpan:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-rose-700 pl-1">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* LaTeX Quick Insertion Toolbar */}
      <div className="sticky top-20 z-20">
        <LatexToolbar onInsert={handleInsertLatex} />
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 1. INFORMASI DASAR SOAL */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>1. Informasi Pokok Soal</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Judul Butir Soal: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Translasi Titik P(2, -5) pada Bidang Koordinat"
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Materi Prasyarat yang Diukur: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                list="prereq-topics"
                value={prerequisiteTopic}
                onChange={(e) => setPrerequisiteTopic(e.target.value)}
                placeholder="Pilih atau ketik topik prasyarat..."
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 placeholder:text-slate-400"
                required
              />
              <datalist id="prereq-topics">
                {PREREQUISITE_TOPICS_SUGGESTIONS.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </div>
          </div>
        </div>

        {/* 2. PENYISIPAN GAMBAR / DIAGRAM */}
        <ImageUploader
          imageUrl={imageUrl}
          svgDiagram={svgDiagram}
          onChange={({ imageUrl: img, svgDiagram: svg }) => {
            setImageUrl(img);
            setSvgDiagram(svg);
          }}
        />

        {/* 3. TINGKAT 1: PERTANYAAN UTAMA & 5 OPSI JAWABAN */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200">
                  T1
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Tingkat 1: Pertanyaan Utama & 5 Pilihan Jawaban (A–E)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Isi tepat lima pilihan jawaban. Tandai satu radio button sebagai kunci jawaban benar.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 self-start sm:self-center">
              Kunci Terpilih: <strong>Opsi {tier1Options.correctOption}</strong>
            </span>
          </div>

          {/* Pertanyaan Utama Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Teks Pertanyaan Utama: <span className="text-rose-500">*</span></span>
              <button
                type="button"
                onClick={() => setActiveFieldTarget("t1_q")}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md transition-colors ${
                  activeFieldTarget === "t1_q"
                    ? "bg-blue-600 text-white"
                    : "text-slate-500 hover:text-slate-800 bg-slate-100"
                }`}
              >
                {activeFieldTarget === "t1_q" ? "● Target Sisipan Aktif" : "Set Target Sisipan"}
              </button>
            </label>
            <textarea
              rows={3}
              value={tier1Question}
              onFocus={() => setActiveFieldTarget("t1_q")}
              onChange={(e) => setTier1Question(e.target.value)}
              placeholder="Contoh: Titik $P(2, -5)$ ditranslasikan oleh vektor pergeseran $T = \begin{pmatrix} -3 \\ 4 \end{pmatrix}$. Tentukan koordinat bayangan titik $P'$!"
              className="w-full p-3.5 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 placeholder:text-slate-400 font-mono"
              required
            />

            {/* Live KaTeX preview of question */}
            {tier1Question.trim() && (
              <div className="mt-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                  Pratinjau Rumus Pertanyaan Utama:
                </span>
                <FormattedMathText text={tier1Question} />
              </div>
            )}
          </div>

          {/* 5 Options A-E */}
          <div className="space-y-2.5 pt-1">
            <label className="block text-xs font-bold text-slate-700">
              Pilihan Jawaban (A–E) & Penanda Kunci Benar: <span className="text-rose-500">*</span>
            </label>

            {OPTION_KEYS.map((key) => {
              const isCorrect = tier1Options.correctOption === key;

              return (
                <div
                  key={key}
                  className={`p-3 rounded-lg border transition-all ${
                    isCorrect
                      ? "bg-blue-50/60 border-blue-400 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Radio button for correct key */}
                    <label
                      title={`Tandai Opsi ${key} sebagai kunci jawaban benar`}
                      className="flex items-center gap-1.5 cursor-pointer select-none"
                    >
                      <input
                        type="radio"
                        name="t1_correct_option"
                        checked={isCorrect}
                        onChange={() =>
                          setTier1Options((prev) => ({
                            ...prev,
                            correctOption: key,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span
                        className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center transition-colors ${
                          isCorrect
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {key}
                      </span>
                    </label>

                    {/* Text input */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={tier1Options[key]}
                        onFocus={() => setActiveFieldTarget(`t1_${key}` as any)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTier1Options((prev) => ({
                            ...prev,
                            [key]: val,
                          }));
                        }}
                        placeholder={`Teks pilihan jawaban ${key} (misal: $P'(-1, -1)$)`}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 placeholder:text-slate-400"
                        required
                      />
                    </div>

                    {isCorrect && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        <span>Kunci Benar</span>
                      </span>
                    )}
                  </div>

                  {/* Option Live Preview if has latex */}
                  {tier1Options[key]?.includes("$") && (
                    <div className="mt-2 ml-10 text-xs text-slate-700">
                      <span className="text-[10px] text-slate-400 mr-2 font-medium">Pratinjau:</span>
                      <FormattedMathText text={tier1Options[key]} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. TINGKAT 2: PERTANYAAN ALASAN & 5 OPSI ALASAN */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-50 text-amber-800 font-bold text-xs flex items-center justify-center border border-amber-200">
                  T2
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Tingkat 2: Pertanyaan Alasan & 5 Pilihan Alasan (A–E)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Menguji alasan matematis / konsep yang mendasari jawaban di Tingkat 1.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 self-start sm:self-center">
              Kunci Terpilih: <strong>Alasan {tier2Options.correctOption}</strong>
            </span>
          </div>

          {/* Pertanyaan Alasan Textarea */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Teks Pertanyaan Alasan: <span className="text-rose-500">*</span></span>
              <button
                type="button"
                onClick={() => setActiveFieldTarget("t2_q")}
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md transition-colors ${
                  activeFieldTarget === "t2_q"
                    ? "bg-amber-600 text-white"
                    : "text-slate-500 hover:text-slate-800 bg-slate-100"
                }`}
              >
                {activeFieldTarget === "t2_q" ? "● Target Sisipan Aktif" : "Set Target Sisipan"}
              </button>
            </label>
            <input
              type="text"
              value={tier2Question}
              onFocus={() => setActiveFieldTarget("t2_q")}
              onChange={(e) => setTier2Question(e.target.value)}
              placeholder="Pilihlah alasan matematis yang mendasari jawaban Anda:"
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 placeholder:text-slate-400"
              required
            />
          </div>

          {/* 5 Options Reason A-E */}
          <div className="space-y-2.5 pt-1">
            <label className="block text-xs font-bold text-slate-700">
              Pilihan Alasan (A–E) & Penanda Kunci Alasan Benar: <span className="text-rose-500">*</span>
            </label>

            {OPTION_KEYS.map((key) => {
              const isCorrect = tier2Options.correctOption === key;

              return (
                <div
                  key={key}
                  className={`p-3 rounded-lg border transition-all ${
                    isCorrect
                      ? "bg-amber-50/60 border-amber-400 shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Radio button for correct reason */}
                    <label
                      title={`Tandai Alasan ${key} sebagai alasan benar`}
                      className="flex items-center gap-1.5 cursor-pointer select-none"
                    >
                      <input
                        type="radio"
                        name="t2_correct_option"
                        checked={isCorrect}
                        onChange={() =>
                          setTier2Options((prev) => ({
                            ...prev,
                            correctOption: key,
                          }))
                        }
                        className="w-4 h-4 text-amber-600 border-slate-300 focus:ring-amber-500 cursor-pointer"
                      />
                      <span
                        className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center transition-colors ${
                          isCorrect
                            ? "bg-amber-600 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {key}
                      </span>
                    </label>

                    {/* Text input */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={tier2Options[key]}
                        onFocus={() => setActiveFieldTarget(`t2_${key}` as any)}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTier2Options((prev) => ({
                            ...prev,
                            [key]: val,
                          }));
                        }}
                        placeholder={`Teks alasan ${key} (misal: Translasi menjumlahkan absis awal dengan vektor: $(x + a, y + b)$)`}
                        className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-amber-500 placeholder:text-slate-400"
                        required
                      />
                    </div>

                    {isCorrect && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        <span>Kunci Alasan</span>
                      </span>
                    )}
                  </div>

                  {/* Option Live Preview if has latex */}
                  {tier2Options[key]?.includes("$") && (
                    <div className="mt-2 ml-10 text-xs text-slate-700">
                      <span className="text-[10px] text-slate-400 mr-2 font-medium">Pratinjau:</span>
                      <FormattedMathText text={tier2Options[key]} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. TINGKAT 3: AJAKAN TINGKAT KEYAKINAN */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                  T3
                </span>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Tingkat 3: Ajakan Keyakinan Siswa (Confidence Prompt)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Bagian ini hanya memuat teks ajakan keyakinan. Siswa di layar ujian hanya memilih Yakin atau Tidak Yakin.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-center">
              Khusus Keyakinan: Tanpa Opsi A–E & Tanpa Kunci
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Teks Ajakan Keyakinan: <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={tier3Prompt}
              onChange={(e) => setTier3Prompt(e.target.value)}
              placeholder="Seberapa yakin Anda dengan pilihan jawaban tingkat 1 dan alasan tingkat 2 di atas?"
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 placeholder:text-slate-400"
              required
            />
          </div>

          {/* Educational notice regarding 3-tier rules */}
          <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-slate-700 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-blue-900">
                Sesuai Pedoman Diagnostik Three-Tier SITINDAK:
              </p>
              <p className="text-slate-600 leading-relaxed">
                Tingkat 3 tidak menyediakan kolom pilihan A–E maupun penanda kunci jawaban. Di layar siswa, sistem menyajikan dua tombol pilihan langsung: <strong>Yakin</strong> atau <strong>Tidak Yakin</strong> untuk mengukur derajat kepastian konsepsi.
              </p>
            </div>
          </div>
        </div>

        {/* 6. PEMBAHASAN JAWABAN BENAR & BAHAN REFLEKSI */}
        <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Pembahasan Jawaban Benar & Bahan Refleksi Siswa</span>
            </h3>
            <button
              type="button"
              onClick={() => setActiveFieldTarget("expl")}
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-md transition-colors ${
                activeFieldTarget === "expl"
                  ? "bg-blue-600 text-white"
                  : "text-slate-500 hover:text-slate-800 bg-slate-100"
              }`}
            >
              {activeFieldTarget === "expl" ? "● Target Sisipan Aktif" : "Set Target Sisipan"}
            </button>
          </div>

          <p className="text-xs text-slate-500">
            Penjelasan ini langsung disajikan ke siswa di halaman hasil setelah mereka menyelesaikan asesmen, sebagai bahan refleksi mandiri terhadap materi prasyarat.
          </p>

          <textarea
            rows={4}
            value={explanation}
            onFocus={() => setActiveFieldTarget("expl")}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Tuliskan langkah pengerjaan yang benar, rumus yang digunakan, dan alasan kesalahan konsepsi umum..."
            className="w-full p-3.5 rounded-lg bg-white border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-600 placeholder:text-slate-400 font-sans"
          />

          {explanation.trim() && (
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                Pratinjau Render Pembahasan:
              </span>
              <FormattedMathText text={explanation} />
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Semua data butir soal tersimpan lokal & siap digunakan ulang di kumpulan soal.</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleOpenPreview}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-sm"
            >
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Pratinjau Siswa</span>
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-6 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Butir Soal</span>
            </button>
          </div>
        </div>

      </form>

      {/* Interactive Student Preview Modal */}
      <StudentQuestionPreviewModal
        question={getCurrentQuestionItem()}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />

    </div>
  );
};
