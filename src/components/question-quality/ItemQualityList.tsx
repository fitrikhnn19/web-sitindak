"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Target,
  HelpCircle,
  Users,
  Eye,
  Check,
} from "lucide-react";
import { QuestionQualityItem } from "@/lib/question-quality-analysis";

interface ItemQualityListProps {
  items: QuestionQualityItem[];
  totalStudents?: number;
  onSelectQuestion: (questionId: string) => void;
}

export const ItemQualityList: React.FC<ItemQualityListProps> = ({
  items,
  totalStudents,
  onSelectQuestion,
}) => {
  if (items.length === 0) {
    if (totalStudents === 0) {
      return (
        <div className="p-8 sm:p-12 text-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            Belum Ada Siswa yang Mengumpulkan Jawaban
          </h4>
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            Analisis kualitas butir soal (tingkat kesukaran, daya pembeda, efektivitas pengecoh, dan indeks reliabilitas) akan dihitung otomatis segera setelah siswa menyelesaikan pengerjaan asesmen ini.
          </p>
        </div>
      );
    }

    return (
      <div className="p-8 sm:p-12 text-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-900">
          Tidak ada butir soal yang sesuai filter
        </h4>
        <p className="text-xs max-w-sm mx-auto">
          Coba atur ulang kata kunci pencarian atau ubah filter tingkat kesukaran dan daya pembeda di atas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isProblematic = item.flag === "perlu diperbaiki";

        // Color coding for Difficulty
        let diffColor = "bg-blue-50 text-blue-700 border-blue-200";
        if (item.difficultyLabel === "Terlalu Mudah") {
          diffColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
        } else if (item.difficultyLabel === "Terlalu Sulit") {
          diffColor = "bg-rose-50 text-rose-800 border-rose-200";
        }

        // Color coding for Discrimination
        let discColor = "bg-emerald-50 text-emerald-800 border-emerald-200";
        if (item.discriminationLabel === "Cukup") {
          discColor = "bg-blue-50 text-blue-700 border-blue-200";
        } else if (item.discriminationLabel === "Lemah") {
          discColor = "bg-rose-50 text-rose-800 border-rose-200";
        }

        // Color coding for Validity
        let valColor = "bg-indigo-50 text-indigo-700 border-indigo-200";
        if (item.validityLabel === "Rendah") {
          valColor = "bg-rose-50 text-rose-800 border-rose-200";
        }

        return (
          <div
            key={item.id}
            className={`rounded-xl border transition-all duration-200 overflow-hidden shadow-xs ${
              isProblematic
                ? "bg-amber-50/20 border-amber-300 hover:border-amber-400"
                : "bg-white border-slate-200 hover:border-slate-300"
            }`}
          >
            {/* Main Content Area */}
            <div className="p-4 sm:p-5 space-y-4">
              
              {/* Header: Number, Title, Topic & Status Flag */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 font-mono shadow-xs ${
                      isProblematic
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-slate-100 text-slate-800 border border-slate-200"
                    }`}
                  >
                    Q{item.questionNumber}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        {item.prerequisiteTopic}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                      Status Diagnostik: <strong className="text-emerald-700">{item.pahamRate}% Paham</strong> •{" "}
                      <strong className="text-amber-800">{item.miskonsepsiRate}% Miskonsepsi</strong> •{" "}
                      <strong className="text-rose-700">{item.belumPahamRate}% Belum Paham</strong>
                    </p>
                  </div>
                </div>

                {/* Status Flag Badge (Layak vs Perlu Diperbaiki) */}
                <div className="self-start sm:self-center">
                  {isProblematic ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-xs">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Perlu Diperbaiki</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Layak Pakai</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Psychometric Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                
                {/* 1. Tingkat Kesukaran */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-blue-600" />
                      <span>Tingkat Kesukaran (P)</span>
                    </span>
                    <span className="font-mono text-slate-900 font-bold">
                      {item.difficultyIndex.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border ${diffColor}`}
                    >
                      {item.difficultyLabel}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      ({Math.round(item.difficultyIndex * 100)}% siswa benar)
                    </span>
                  </div>
                </div>

                {/* 2. Daya Pembeda */}
                <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                      <span>Daya Pembeda (D)</span>
                    </span>
                    <span className="font-mono text-slate-900 font-bold">
                      {item.discriminationIndex.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border ${discColor}`}
                    >
                      {item.discriminationLabel}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.discriminationIndex >= 0.3 ? "Membedakan baik" : "Kurang membedakan"}
                    </span>
                  </div>
                </div>

                {/* 3. Validitas Butir */}
                <div className="space-y-1 sm:border-l sm:border-slate-200 sm:pl-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                      <span>Validitas Butir (r)</span>
                    </span>
                    <span className="font-mono text-slate-900 font-bold">
                      {item.validityValue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border ${valColor}`}
                    >
                      Kategori {item.validityLabel}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {item.validityValue >= 0.25 ? "Konsisten" : "Perlu revisi"}
                    </span>
                  </div>
                </div>

              </div>

              {/* Komparasi Kelompok Atas vs Kelompok Bawah */}
              <div className="p-3 rounded-lg bg-slate-50/80 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                    <span>Perbandingan Kelompok Siswa:</span>
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Kelompok Atas ({item.upperGroupCorrectCount}/{item.upperGroupTotal}) vs Kelompok Bawah ({item.lowerGroupCorrectCount}/{item.lowerGroupTotal})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Kelompok Atas */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-blue-700 font-semibold">Siswa Paham (Ranking Atas):</span>
                      <strong className="text-slate-900 font-mono">{item.upperGroupCorrectRate}% Benar</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${item.upperGroupCorrectRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Kelompok Bawah */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-600 font-semibold">Siswa Belum Paham (Ranking Bawah):</span>
                      <strong className="text-slate-900 font-mono">{item.lowerGroupCorrectRate}% Benar</strong>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-slate-400 rounded-full"
                        style={{ width: `${item.lowerGroupCorrectRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Saran Perbaikan Soal Singkat & Spesifik */}
              <div
                className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
                  isProblematic
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-slate-50 border border-slate-200 text-slate-700"
                }`}
              >
                {isProblematic ? (
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block mb-0.5 text-slate-900">
                    {isProblematic ? "Saran Perbaikan Butir:" : "Catatan Kualitas:"}
                  </span>
                  <p className="text-slate-700 font-medium">{item.suggestion}</p>
                </div>
              </div>

              {/* Action Button: Buka Detail Butir */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.issueTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => onSelectQuestion(item.questionId)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:text-blue-600 border border-slate-300 transition-colors shadow-xs ml-auto whitespace-nowrap"
                >
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Detail Analisis Butir</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              </div>

            </div>
          </div>
        );
      })}
    </div>
  );
};
