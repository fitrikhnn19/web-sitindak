"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import {
  AssessmentQualitySummary,
} from "@/lib/question-quality-analysis";

interface QualityMetricCardsProps {
  summary: AssessmentQualitySummary;
  onRecalculate: () => Promise<void>;
  onOpenGlossary: () => void;
}

export const QualityMetricCards: React.FC<QualityMetricCardsProps> = ({
  summary,
  onRecalculate,
  onOpenGlossary,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);

  const handleRefreshClick = async () => {
    setIsRefreshing(true);
    await onRecalculate();
    setIsRefreshing(false);
    setJustUpdated(true);
    setTimeout(() => setJustUpdated(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Ringkasan Kualitas Soal & Psikometrik Asesmen</span>
              {justUpdated && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Baru Saja Diperbarui
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Evaluasi otomatis dari {summary.totalStudents} siswa • Terakhir dianalisis: {summary.lastCalculatedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onOpenGlossary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Panduan Istilah Awam</span>
          </button>

          <button
            onClick={handleRefreshClick}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-all shadow-xs disabled:opacity-60"
            title="Hitung ulang psikometrik butir dari data jawaban terbaru"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-blue-600 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span>{isRefreshing ? "Menganalisis..." : "Hitung Ulang Analisis"}</span>
          </button>
        </div>
      </div>

      {/* 4 Core Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Reliabilitas Asesmen */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-700">Reliabilitas Asesmen</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {summary.reliabilityValue.toFixed(2)}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {summary.reliabilityLabel}
            </span>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 leading-snug line-clamp-2">
            {summary.reliabilityExplanation}
          </p>
        </div>

        {/* Card 2: Status Kelayakan Butir Soal */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-700">Status Kelayakan Soal</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {summary.layakCount}
              <span className="text-sm font-normal text-slate-500">/{summary.totalQuestions}</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              {summary.layakPercentage}% Layak Pakai
            </span>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full"
                style={{ width: `${summary.layakPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Soal Perlu Diperbaiki */}
        <div className="rounded-xl bg-white border border-amber-300 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-amber-900">Perlu Diperbaiki</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-800 font-mono tracking-tight">
              {summary.perluDiperbaikiCount}
              <span className="text-sm font-normal text-slate-500">/{summary.totalQuestions}</span>
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              {summary.totalQuestions > 0 ? Math.round((summary.perluDiperbaikiCount / summary.totalQuestions) * 100) : 0}% Butir
            </span>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 leading-snug line-clamp-2">
            Butir dengan daya pembeda lemah atau opsi pengecoh yang belum berfungsi efektif.
          </p>
        </div>

        {/* Card 4: Rata-rata Daya Pembeda Asesmen */}
        <div className="rounded-xl bg-white border border-slate-200 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start justify-between">
            <span className="text-xs font-bold text-slate-700">Daya Pembeda Rata-rata</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {summary.averageDiscrimination.toFixed(2)}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {summary.averageDiscriminationLabel}
            </span>
          </div>

          <p className="mt-2 text-[11px] text-slate-600 leading-snug line-clamp-2">
            Kemampuan butir soal membedakan siswa kelompok atas vs kelompok bawah secara empiris.
          </p>
        </div>

      </div>
    </div>
  );
};
