"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  BookOpen,
  Plus,
  Layers,
  BarChart3,
  KeyRound,
  GraduationCap,
  HelpCircle,
  School,
} from "lucide-react";
import { QuestionBankView } from "@/components/question-bank/QuestionBankView";
import { ThreeTierEditorForm } from "@/components/question-builder/ThreeTierEditorForm";
import { TeacherSessionHeader } from "@/components/dashboard/TeacherSessionHeader";

function QuestionBankContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Mode: "list" (bank soal) or "create" or "edit"
  const actionParam = searchParams.get("action");
  const editIdParam = searchParams.get("id");

  const [mode, setMode] = useState<"list" | "editor">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (actionParam === "create") {
      setMode("editor");
      setEditingId(null);
    } else if (actionParam === "edit" && editIdParam) {
      setMode("editor");
      setEditingId(editIdParam);
    } else {
      setMode("list");
      setEditingId(null);
    }
  }, [actionParam, editIdParam]);

  const handleStartCreate = () => {
    setMode("editor");
    setEditingId(null);
    router.push("/guru/soal?action=create");
  };

  const handleStartEdit = (id: string) => {
    setMode("editor");
    setEditingId(id);
    router.push(`/guru/soal?action=edit&id=${id}`);
  };

  const handleBackToList = () => {
    setMode("list");
    setEditingId(null);
    router.push("/guru/soal");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Teacher Session Header */}
      <TeacherSessionHeader
        currentModule="soal"
        title="Bank Soal Tiga Tingkat"
        subtitle="Penyusun & Bank Soal Tiga Tingkat (Fase 2 PRD)"
      />

      {/* Mode Sub-navigation Bar */}
      <div className="bg-white border-b border-slate-200 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleBackToList}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                mode === "list"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kumpulan Soal Bank</span>
            </button>

            <button
              onClick={handleStartCreate}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                mode === "editor" && !editingId
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tulis Soal Baru (3-Tier)</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 hidden sm:block">
            {mode === "list" ? "Daftar butir soal tersimpan" : "Form editor soal 3 tingkat"}
          </div>
        </div>
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mode === "list" ? (
          <QuestionBankView
            onEditQuestion={handleStartEdit}
            onCreateNew={handleStartCreate}
          />
        ) : (
          <ThreeTierEditorForm
            initialQuestionId={editingId}
            onCancel={handleBackToList}
            onSuccess={() => handleBackToList()}
          />
        )}
      </main>

      {/* Footer info banner */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">SITINDAK</span>
            <span>— Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Three-Tier Assessment Engine</span>
            <span>•</span>
            <span>KaTeX Math Rendering</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default function GuruSoalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-600 font-medium">
              Memuat Kumpulan Soal Tiga Tingkat...
            </span>
          </div>
        </div>
      }
    >
      <QuestionBankContent />
    </Suspense>
  );
}
