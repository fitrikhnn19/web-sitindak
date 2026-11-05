"use client";

import React from "react";
import {
  Info,
  CheckCircle2,
  Flame,
  Smile,
  Target,
} from "lucide-react";
import { AssessmentQualitySummary } from "@/lib/question-quality-analysis";

interface DifficultyDistributionCardProps {
  summary: AssessmentQualitySummary;
  selectedFilter: string;
  onSelectDifficultyFilter: (diff: string) => void;
}

export const DifficultyDistributionCard: React.FC<DifficultyDistributionCardProps> = ({
  summary,
  selectedFilter,
  onSelectDifficultyFilter,
}) => {
  const total = summary.totalQuestions || 1;
  const mudahCount = summary.difficultyDistribution.mudah;
  const sedangCount = summary.difficultyDistribution.sedang;
  const sulitCount = summary.difficultyDistribution.sulit;

  const mudahPct = Math.round((mudahCount / total) * 100);
  const sedangPct = Math.round((sedangCount / total) * 100);
  const sulitPct = Math.round((sulitCount / total) * 100);

  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4 sm:p-5 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">
              Sebaran Tingkat Kesukaran Butir Soal
            </h3>
            <p className="text-[11px] text-slate-500">
              Komposisi sebaran butir soal mudah, sedang, dan sulit dalam asesmen ini
            </p>
          </div>
        </div>

        <span className="text-[11px] text-slate-500 font-medium">
          Total: <strong className="text-slate-800">{total} Butir Soal</strong>
        </span>
      </div>

      {/* Visual Stacked Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-slate-600">Proporsi Butir:</span>
          <span className="text-slate-700 font-mono text-[11px]">
            {mudahCount} Mudah ({mudahPct}%) • {sedangCount} Sedang ({sedangPct}%) • {sulitCount} Sulit ({sulitPct}%)
          </span>
        </div>

        <div className="h-4 rounded-lg bg-slate-100 p-0.5 border border-slate-200 flex overflow-hidden">
          {mudahPct > 0 && (
            <div
              style={{ width: `${mudahPct}%` }}
              className="bg-emerald-500 hover:brightness-105 transition-all rounded-l cursor-pointer relative group"
              onClick={() => onSelectDifficultyFilter("Terlalu Mudah")}
              title={`Klik untuk filter: ${mudahCount} Soal Terlalu Mudah`}
            />
          )}
          {sedangPct > 0 && (
            <div
              style={{ width: `${sedangPct}%` }}
              className="bg-blue-500 hover:brightness-105 transition-all cursor-pointer relative group"
              onClick={() => onSelectDifficultyFilter("Sedang")}
              title={`Klik untuk filter: ${sedangCount} Soal Sedang`}
            />
          )}
          {sulitPct > 0 && (
            <div
              style={{ width: `${sulitPct}%` }}
              className="bg-rose-500 hover:brightness-105 transition-all rounded-r cursor-pointer relative group"
              onClick={() => onSelectDifficultyFilter("Terlalu Sulit")}
              title={`Klik untuk filter: ${sulitCount} Soal Terlalu Sulit`}
            />
          )}
        </div>
      </div>

      {/* Interactive 3 Level Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card Mudah */}
        <button
          onClick={() =>
            onSelectDifficultyFilter(
              selectedFilter === "Terlalu Mudah" ? "ALL" : "Terlalu Mudah"
            )
          }
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedFilter === "Terlalu Mudah"
              ? "bg-emerald-50 border-emerald-400 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terlalu Mudah</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold">
              P &gt; 0.70
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {mudahCount} <span className="text-xs font-normal text-slate-500">soal</span>
            </span>
            <span className="text-xs font-semibold text-emerald-700 font-mono">
              {mudahPct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Menjawab benar &gt; 70% siswa. Pengecoh perlu ditinjau ulang.
          </p>
        </button>

        {/* Card Sedang */}
        <button
          onClick={() =>
            onSelectDifficultyFilter(selectedFilter === "Sedang" ? "ALL" : "Sedang")
          }
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedFilter === "Sedang"
              ? "bg-blue-50 border-blue-400 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Sedang (Ideal)</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200 font-semibold">
              0.30 &le; P &le; 0.70
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {sedangCount} <span className="text-xs font-normal text-slate-500">soal</span>
            </span>
            <span className="text-xs font-semibold text-blue-700 font-mono">
              {sedangPct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Proporsi ideal asesmen diagnostik untuk mendeteksi batas pemahaman.
          </p>
        </button>

        {/* Card Sulit */}
        <button
          onClick={() =>
            onSelectDifficultyFilter(
              selectedFilter === "Terlalu Sulit" ? "ALL" : "Terlalu Sulit"
            )
          }
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedFilter === "Terlalu Sulit"
              ? "bg-rose-50 border-rose-400 shadow-xs"
              : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Terlalu Sulit</span>
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 border border-rose-200 font-semibold">
              P &lt; 0.30
            </span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {sulitCount} <span className="text-xs font-normal text-slate-500">soal</span>
            </span>
            <span className="text-xs font-semibold text-rose-700 font-mono">
              {sulitPct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Hanya sedikit yang menjawab benar. Cek apakah konsep prasyarat sudah diajarkan.
          </p>
        </button>
      </div>

      {/* Pedagogical Guideline Note */}
      <div className="flex items-start gap-2.5 p-3 rounded-lg bg-blue-50 border border-blue-200 text-[11px] text-slate-700">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p>
          <strong className="text-blue-900">Rekomendasi Komposisi Soal:</strong> Asesmen diagnostik prasyarat yang baik memiliki setidaknya <strong>60% soal kategori Sedang</strong>, <strong>20% Mudah</strong> (untuk memotivasi siswa), dan <strong>20% Sulit</strong> (untuk pengayaan & memetakan siswa berpaham tinggi).
        </p>
      </div>
    </div>
  );
};
