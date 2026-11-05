"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Link2,
  BookOpen,
  Image as ImageIcon,
  CheckCircle2,
  RotateCcw,
  Layers,
  ChevronDown,
} from "lucide-react";
import {
  QuestionBankItem,
  getAllQuestions,
  fetchQuestionsFromSupabase,
  deleteQuestion,
  duplicateQuestion,
  resetToDefaultQuestions,
} from "@/lib/question-bank-store";
import { FormattedMathText } from "@/components/assessment/FormattedMathText";
import { StudentQuestionPreviewModal } from "@/components/question-builder/StudentQuestionPreviewModal";
import { LinkToAssessmentModal } from "./LinkToAssessmentModal";

interface QuestionBankViewProps {
  onEditQuestion: (id: string) => void;
  onCreateNew: () => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onEditQuestion,
  onCreateNew,
}) => {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>("all");
  const [filterHasImage, setFilterHasImage] = useState<boolean | null>(null);

  // Selected questions for bulk actions (linking to assessment)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals state
  const [previewingQuestion, setPreviewingQuestion] = useState<QuestionBankItem | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = () => {
    const list = getAllQuestions();
    setQuestions(list);
    fetchQuestionsFromSupabase().then((remote) => {
      if (remote) {
        setQuestions(remote);
      }
    });
  };

  useEffect(() => {
    loadData();
    const handleQuestionsChange = () => {
      setQuestions(getAllQuestions());
    };
    window.addEventListener("sitindak_questions_change", handleQuestionsChange);
    return () => window.removeEventListener("sitindak_questions_change", handleQuestionsChange);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Distinct prerequisite topics for filter dropdown
  const distinctTopics = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.prerequisiteTopic) set.add(q.prerequisiteTopic);
    });
    return Array.from(set);
  }, [questions]);

  // Filtered list
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Search matching title, question text, topic, or reason
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesT1 = q.tier1Question.toLowerCase().includes(query);
        const matchesT2 = q.tier2Question.toLowerCase().includes(query);
        const matchesTopic = q.prerequisiteTopic.toLowerCase().includes(query);
        if (!matchesTitle && !matchesT1 && !matchesT2 && !matchesTopic) {
          return false;
        }
      }

      // Topic filter
      if (selectedTopicFilter !== "all" && q.prerequisiteTopic !== selectedTopicFilter) {
        return false;
      }

      // Media filter
      if (filterHasImage === true && !q.imageUrl && !q.svgDiagram) {
        return false;
      }
      if (filterHasImage === false && (q.imageUrl || q.svgDiagram)) {
        return false;
      }

      return true;
    });
  }, [questions, searchQuery, selectedTopicFilter, filterHasImage]);

  // Bulk selection handlers
  const handleSelectAll = () => {
    if (selectedIds.length === filteredQuestions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredQuestions.map((q) => q.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    await deleteQuestion(id);
    setDeleteConfirmId(null);
    setSelectedIds((prev) => prev.filter((item) => item !== id));
    loadData();
    showToast("Soal berhasil dihapus dari kumpulan soal.");
  };

  const handleDuplicate = async (id: string) => {
    const dup = await duplicateQuestion(id);
    if (dup) {
      loadData();
      showToast(`Soal berhasil diduplikasi: "${dup.title}"`);
    }
  };

  const handleResetDefaults = () => {
    if (confirm("Kembalikan 10 butir soal standar diagnostik transformasi geometri bawaan?")) {
      resetToDefaultQuestions();
      loadData();
      setSelectedIds([]);
      showToast("Kumpulan soal berhasil direset ke standar 10 soal transformasi geometri.");
    }
  };

  const selectedQuestionObjects = useMemo(() => {
    return questions.filter((q) => selectedIds.includes(q.id));
  }, [questions, selectedIds]);

  return (
    <div className="space-y-6">

      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-slate-900 border border-slate-700 text-white shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header & Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Bank Soal Tiga Tingkat
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Total {questions.length} Butir Tersimpan
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Kumpulan Soal Diagnostik Three-Tier
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola, cari, sunting, dan gunakan ulang butir soal tiga tingkat untuk asesmen kelas matematika.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 shadow-sm transition-colors"
            title="Reset ke 10 butir soal standar transformasi geometri"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Reset Soal Contoh</span>
          </button>

          <button
            type="button"
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Soal Baru</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari soal berdasarkan judul, pertanyaan, notasi rumus, atau alasan..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 text-slate-900 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-700 font-medium"
              >
                Hapus
              </button>
            )}
          </div>

          {/* Prerequisite Topic Dropdown */}
          <div className="relative min-w-[240px]">
            <select
              value={selectedTopicFilter}
              onChange={(e) => setSelectedTopicFilter(e.target.value)}
              aria-label="Filter berdasarkan topik materi prasyarat"
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-xs text-slate-800 focus:outline-none focus:border-blue-600 appearance-none cursor-pointer pr-8 font-medium"
            >
              <option value="all">Semua Materi Prasyarat ({distinctTopics.length})</option>
              {distinctTopics.map((top) => (
                <option key={top} value={top}>
                  {top}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>

          {/* Image Filter Toggle */}
          <button
            type="button"
            onClick={() => {
              if (filterHasImage === null) setFilterHasImage(true);
              else if (filterHasImage === true) setFilterHasImage(false);
              else setFilterHasImage(null);
            }}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap shadow-sm ${filterHasImage === true
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : filterHasImage === false
                  ? "bg-slate-100 border-slate-300 text-slate-700"
                  : "bg-white border-slate-300 text-slate-600 hover:bg-slate-50"
              }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>
              {filterHasImage === true
                ? "Hanya Berdiagram"
                : filterHasImage === false
                  ? "Tanpa Diagram"
                  : "Semua Media"}
            </span>
          </button>
        </div>

        {/* Selected Items Action Bar */}
        {selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                {selectedIds.length}
              </span>
              <span className="text-xs font-semibold text-slate-800">
                Soal dipilih dari kumpulan
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                className="text-xs text-blue-600 hover:text-blue-800 underline font-medium ml-1"
              >
                Batalkan Pilihan
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Tautkan {selectedIds.length} Soal ke Asesmen</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Select All Row */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 font-medium">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={
              filteredQuestions.length > 0 &&
              selectedIds.length === filteredQuestions.length
            }
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <span>Pilih Semua Soal yang Ditampilkan ({filteredQuestions.length})</span>
        </label>
        <span>
          Menampilkan <strong className="text-slate-800">{filteredQuestions.length}</strong> dari {questions.length} butir
        </span>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Bank Soal Masih Kosong</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
              Belum ada butir soal three-tier yang tersimpan. Mulai buat soal pertama Anda untuk disematkan ke dalam asesmen kelas.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCreateNew}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Soal Baru (3-Tier)</span>
            </button>
          </div>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="py-14 text-center rounded-2xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">Tidak Ada Soal yang Cocok</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Tidak ditemukan butir soal yang sesuai dengan kata kunci &quot;{searchQuery}&quot; atau filter yang dipilih.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedTopicFilter("all");
              setFilterHasImage(null);
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            Bersihkan Filter Pencarian
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, index) => {
            const isSelected = selectedIds.includes(q.id);
            const hasMedia = Boolean(q.imageUrl || q.svgDiagram);

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all ${isSelected
                    ? "bg-blue-50/50 border-blue-400 shadow-sm"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                  {/* Left: Checkbox + Content */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(q.id)}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer shrink-0"
                    />

                    <div className="space-y-2 flex-1 min-w-0">
                      {/* Meta badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          #{index + 1}
                        </span>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {q.prerequisiteTopic}
                        </span>
                        {hasMedia && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <ImageIcon className="w-3 h-3" />
                            <span>Diagram Geometri</span>
                          </span>
                        )}
                        {q.linkedAssessments && q.linkedAssessments.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Link2 className="w-3 h-3" />
                            <span>Dipakai di {q.linkedAssessments.join(", ")}</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                        {q.title}
                      </h3>

                      {/* Tier 1 Question Snippet with Math */}
                      <div className="text-xs sm:text-sm text-slate-700 line-clamp-2 leading-relaxed">
                        <FormattedMathText text={q.tier1Question} />
                      </div>

                      {/* Thumbnail if has image/diagram */}
                      {hasMedia && (
                        <div className="pt-1">
                          <div className="w-28 h-20 sm:w-36 sm:h-24 bg-slate-50 rounded-lg p-1.5 border border-slate-200 flex items-center justify-center overflow-hidden">
                            {q.svgDiagram ? (
                              <div
                                className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full"
                                dangerouslySetInnerHTML={{ __html: q.svgDiagram }}
                              />
                            ) : q.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={q.imageUrl}
                                alt={q.title}
                                className="max-h-full max-w-full object-contain rounded"
                              />
                            ) : null}
                          </div>
                        </div>
                      )}

                      {/* Tier Summary Badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-100 text-slate-800">
                          <span className="text-blue-700 font-bold">T1:</span>
                          <span>Kunci <strong>{q.tier1Options.correctOption}</strong></span>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900">
                          <span className="text-amber-800 font-bold">T2:</span>
                          <span>Alasan <strong>{q.tier2Options.correctOption}</strong></span>
                        </div>

                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-600">
                          <span className="text-slate-800 font-bold">T3:</span>
                          <span>Keyakinan (Yakin/Tidak)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewingQuestion(q)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
                      title="Pratinjau tampilan soal saat dibaca siswa"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Pratinjau</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditQuestion(q.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Sunting Soal"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDuplicate(q.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        title="Duplikat Soal"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(q.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Hapus Soal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-xl bg-white border border-slate-200 p-5 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Hapus Butir Soal?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus butir soal ini dari Kumpulan Soal? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
              >
                Hapus Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Question Preview Modal */}
      {previewingQuestion && (
        <StudentQuestionPreviewModal
          question={previewingQuestion}
          isOpen={Boolean(previewingQuestion)}
          onClose={() => setPreviewingQuestion(null)}
        />
      )}

      {/* Link to Assessment Modal */}
      <LinkToAssessmentModal
        selectedQuestions={selectedQuestionObjects}
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onSuccess={() => {
          loadData();
          setSelectedIds([]);
          showToast("Soal berhasil ditautkan ke asesmen!");
        }}
      />

    </div>
  );
};
