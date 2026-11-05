"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  BookOpen,
  Calendar,
  KeyRound,
  Users,
  Clock,
  Timer,
  ArrowUp,
  ArrowDown,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  School,
} from "lucide-react";
import {
  createAssessment,
  AssessmentItem,
} from "@/lib/assessment-management-store";
import { getAllClasses, fetchClassesFromSupabase, ClassRoom } from "@/lib/class-management-store";
import { getAllQuestions, fetchQuestionsFromSupabase, QuestionBankItem } from "@/lib/question-bank-store";
import { FormattedMathText } from "@/components/assessment/FormattedMathText";

interface CreateAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (newAssessment: AssessmentItem) => void;
  initialClassId?: string;
  onOpenAddClass?: () => void;
}

export const CreateAssessmentModal: React.FC<CreateAssessmentModalProps> = ({
  isOpen,
  onClose,
  onCreated,
  initialClassId,
  onOpenAddClass,
}) => {
  // Classes list from store
  const [availableClasses, setAvailableClasses] = useState<ClassRoom[]>([]);

  // Form fields
  const [title, setTitle] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [opensAt, setOpensAt] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [customToken, setCustomToken] = useState("");
  const [customMaxUses, setCustomMaxUses] = useState<number>(32);

  // Question Picker state
  const [availableQuestions, setAvailableQuestions] = useState<QuestionBankItem[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("Semua");
  const [previewQuestionId, setPreviewQuestionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    if (isOpen) {
      const questions = getAllQuestions();
      setAvailableQuestions(questions);
      fetchQuestionsFromSupabase().then((remoteQ) => {
        if (remoteQ && remoteQ.length > 0) setAvailableQuestions(remoteQ);
      });

      // Default: select first 6 questions for quick setup convenience
      const defaultIds = questions.slice(0, 6).map((q) => q.id);
      setSelectedQuestionIds(defaultIds);

      // Load classes dynamically from store & Supabase
      const classes = getAllClasses();
      setAvailableClasses(classes);
      fetchClassesFromSupabase().then((remote) => {
        if (remote.length > 0) setAvailableClasses(remote);
      });

      const targetClassId =
        initialClassId && classes.some((c) => c.id === initialClassId)
          ? initialClassId
          : classes[0]?.id || "";

      setSelectedClassId(targetClassId);
      const initialCls = classes.find((c) => c.id === targetClassId) || classes[0];

      // Set default schedule: opens today 07:00, closes in 7 days 17:00
      const now = new Date();
      const openDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 7, 0);
      const closeDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 17, 0);

      const formatDt = (d: Date) => {
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      };

      setOpensAt(formatDt(openDate));
      setClosesAt(formatDt(closeDate));

      // Reset fields
      setTitle("Asesmen Diagnostik Prasyarat Transformasi Geometri");
      setDurationMinutes(45);
      if (initialCls) {
        setCustomMaxUses(initialCls.totalStudents);
        setCustomToken(`GEO-${initialCls.name.replace(/[^A-Za-z0-9]/g, "").toUpperCase()}`);
      } else {
        setCustomMaxUses(32);
        setCustomToken("GEO-TEST");
      }
      setErrorMessage(null);
    }
  }, [isOpen, initialClassId]);

  // Handle class selection change -> update default quota and suggested token
  const handleClassChange = (classId: string) => {
    setSelectedClassId(classId);
    const cls = availableClasses.find((c) => c.id === classId);
    if (cls) {
      setCustomMaxUses(cls.totalStudents);
      const cleanName = cls.name.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      setCustomToken(`GEO-${cleanName}`);
    }
  };

  if (!isOpen) return null;

  // Filtered available questions
  const filteredQuestions = availableQuestions.filter((q) => {
    const matchSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.prerequisiteTopic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTopic =
      topicFilter === "Semua" || q.topic.toLowerCase() === topicFilter.toLowerCase();
    return matchSearch && matchTopic;
  });

  const handleToggleSelectQuestion = (qId: string) => {
    if (selectedQuestionIds.includes(qId)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((id) => id !== qId));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, qId]);
    }
  };

  const handleSelectAll = () => {
    setSelectedQuestionIds(availableQuestions.map((q) => q.id));
  };

  const handleClearAll = () => {
    setSelectedQuestionIds([]);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const reordered = [...selectedQuestionIds];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;
    setSelectedQuestionIds(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === selectedQuestionIds.length - 1) return;
    const reordered = [...selectedQuestionIds];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;
    setSelectedQuestionIds(reordered);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Judul asesmen wajib diisi.");
      return;
    }
    if (!selectedClassId) {
      setErrorMessage("Silakan pilih kelas tujuan asesmen.");
      return;
    }
    if (selectedQuestionIds.length === 0) {
      setErrorMessage("Pilih minimal 1 butir soal tiga tingkat.");
      return;
    }
    if (!opensAt || !closesAt) {
      setErrorMessage("Jadwal buka dan batas tutup asesmen wajib ditentukan.");
      return;
    }
    if (new Date(opensAt) >= new Date(closesAt)) {
      setErrorMessage("Jadwal buka harus lebih awal dari batas tutup asesmen.");
      return;
    }

    try {
      const created = createAssessment({
        title: title.trim(),
        classId: selectedClassId,
        questionIds: selectedQuestionIds,
        opensAt: new Date(opensAt).toISOString(),
        closesAt: new Date(closesAt).toISOString(),
        durationMinutes: durationMinutes,
        customTokenCode: customToken.trim() || undefined,
        customMaxUses: customMaxUses,
      });

      onCreated(created);
      onClose();
    } catch (err) {
      setErrorMessage("Gagal membuat asesmen baru.");
    }
  };

  const selectedClass = availableClasses.find((c) => c.id === selectedClassId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xl my-8">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Buat Asesmen Baru
              </h2>
              <p className="text-xs text-slate-500">
                Tentukan judul, kelas tujuan, daftar soal tiga tingkat, dan satu token kelas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Guidance if 0 classes exist */}
        {availableClasses.length === 0 && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div>
                <p className="font-semibold text-slate-900">Belum Ada Kelas yang Terdaftar</p>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Asesmen diagnostik dan token pengerjaan wajib dikaitkan dengan satu kelas yang Anda ampu. Silakan tambahkan kelas terlebih dahulu sebelum membuat asesmen.
                </p>
              </div>
            </div>
            {onOpenAddClass && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddClass();
                }}
                className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shrink-0 transition-all shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Kelas Sekarang</span>
              </button>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-6">

          {/* Section 1: Data Utama Asesmen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Judul Asesmen */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Judul Asesmen Diagnostik: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: Asesmen Diagnostik Prasyarat Transformasi Geometri"
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                required
              />
            </div>

            {/* Pilihan Kelas */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Pilih Kelas Tujuan: <span className="text-rose-500">*</span>
                </label>
                {onOpenAddClass && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenAddClass();
                    }}
                    className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    + Tambah Kelas Baru
                  </button>
                )}
              </div>
              <select
                value={selectedClassId}
                onChange={(e) => handleClassChange(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 transition-all cursor-pointer"
                required
              >
                {availableClasses.length === 0 ? (
                  <option value="">-- Belum Ada Kelas (Tambah Kelas Terlebih Dahulu) --</option>
                ) : (
                  availableClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.totalStudents} siswa) — {cls.gradeLevel}
                    </option>
                  ))
                )}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {selectedClass
                  ? `Asesmen dan token akan terkait khusus dan muncul di ruang ${selectedClass.name}.`
                  : "Pilih salah satu kelas yang Anda ampu."}
              </p>
            </div>

            {/* Token & Kuota Generator */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kode Token Kelas:
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-slate-300 text-blue-700 font-mono text-xs sm:text-sm font-bold uppercase focus:outline-none focus:border-blue-600"
                    placeholder="GEO-XIA"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Kuota Pemakaian:
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={customMaxUses}
                  onChange={(e) => setCustomMaxUses(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Jadwal Buka & Tutup */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Waktu Dibuka:</span>
              </label>
              <input
                type="datetime-local"
                value={opensAt}
                onChange={(e) => setOpensAt(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-rose-600" />
                <span>Batas Ditutup:</span>
              </label>
              <input
                type="datetime-local"
                value={closesAt}
                onChange={(e) => setClosesAt(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                required
              />
            </div>

            {/* Pengaturan Durasi Pengerjaan per Siswa */}
            <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-2.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-amber-600" />
                  <span>Durasi Pengerjaan Ujian:</span>
                </label>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-amber-900 border border-amber-300">
                  {durationMinutes === 0 ? "Tanpa Batas Waktu" : `${durationMinutes} Menit`}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Hitungan mundur otomatis per siswa setelah tombol &quot;Mulai Mengerjakan&quot; ditekan. Ujian otomatis dikumpulkan saat waktu habis.
              </p>

              {/* Pilihan Cepat (Preset Chips) */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { label: "30 Menit", val: 30 },
                  { label: "45 Menit", val: 45 },
                  { label: "60 Menit", val: 60 },
                  { label: "90 Menit", val: 90 },
                  { label: "120 Menit", val: 120 },
                  { label: "Tanpa Batas", val: 0 },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => setDurationMinutes(item.val)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${durationMinutes === item.val
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-white hover:bg-amber-100 text-amber-900 border border-amber-200"
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Input Kustom Menit */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] text-slate-600 shrink-0">Durasi Kustom:</span>
                <div className="relative w-40">
                  <input
                    type="number"
                    min="0"
                    max="360"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full pl-3 pr-14 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-600"
                    placeholder="Contoh: 45"
                  />
                  <span className="absolute right-3 top-1.5 text-xs text-slate-400 pointer-events-none">
                    menit
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Pemilih Soal Tiruan & Urutan Tampil */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>Pilih & Atur Urutan Soal Tiga Tingkat</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Dipilih {selectedQuestionIds.length} dari {availableQuestions.length} butir soal tersedia
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                  Pilih Semua ({availableQuestions.length})
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Selected Questions Order List */}
            {selectedQuestionIds.length > 0 && (
              <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs font-semibold text-slate-800 mb-2 flex items-center justify-between">
                  <span>Urutan Tampil Soal untuk Siswa:</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Gunakan tombol panah (↑ / ↓) untuk mengatur urutan
                  </span>
                </div>

                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {selectedQuestionIds.map((qid, idx) => {
                    const q = availableQuestions.find((item) => item.id === qid);
                    if (!q) return null;
                    return (
                      <div
                        key={qid}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 shadow-sm"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-[11px] shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate font-medium">{q.title}</span>
                          <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0 font-medium">
                            {q.prerequisiteTopic}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleMoveUp(idx)}
                            disabled={idx === 0}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Pindah ke atas"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveDown(idx)}
                            disabled={idx === selectedQuestionIds.length - 1}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Pindah ke bawah"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleSelectQuestion(qid)}
                            className="p-1 rounded-md text-rose-500 hover:bg-rose-50 ml-1"
                            title="Hapus dari asesmen ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Search & Topic Filters for question pool */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari butir soal berdasarkan judul atau konsep..."
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {["Semua", "Translasi", "Refleksi", "Rotasi", "Dilatasi"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTopicFilter(t)}
                    className={`px-2.5 py-1 text-xs rounded-md transition-all shrink-0 font-medium ${topicFilter === t
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Question pool list */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50">
              {filteredQuestions.map((q) => {
                const isSelected = selectedQuestionIds.includes(q.id);
                const orderIndex = selectedQuestionIds.indexOf(q.id);

                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleSelectQuestion(q.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-3 ${isSelected
                      ? "bg-blue-50/80 border-blue-300"
                      : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => { }}
                        className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {q.title}
                          </h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium shrink-0">
                            {q.prerequisiteTopic}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          {q.tier1Question.replace(/\\\[.*?\\\]/g, "[rumus]")}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {isSelected ? (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 border border-blue-200">
                          Urutan #{orderIndex + 1}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 hover:text-slate-800">
                          + Tambah
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">
              *Token kelas aktif dibuat otomatis dengan kuota {customMaxUses} siswa.
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                Batal
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Simpan & Rilis Asesmen</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
