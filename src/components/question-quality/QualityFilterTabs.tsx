"use client";

import React from "react";
import {
  ListFilter,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  X,
} from "lucide-react";

export type QualityFilterMode = "ALL" | "PROBLEMATIC" | "VALID";

interface QualityFilterTabsProps {
  filterMode: QualityFilterMode;
  onFilterModeChange: (mode: QualityFilterMode) => void;
  totalCount: number;
  problematicCount: number;
  validCount: number;
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  difficultyFilter: string;
  onDifficultyFilterChange: (diff: string) => void;
  discriminationFilter: string;
  onDiscriminationFilterChange: (disc: string) => void;
  onResetFilters: () => void;
}

export const QualityFilterTabs: React.FC<QualityFilterTabsProps> = ({
  filterMode,
  onFilterModeChange,
  totalCount,
  problematicCount,
  validCount,
  searchQuery,
  onSearchQueryChange,
  difficultyFilter,
  onDifficultyFilterChange,
  discriminationFilter,
  onDiscriminationFilterChange,
  onResetFilters,
}) => {
  const hasActiveFilters =
    difficultyFilter !== "ALL" ||
    discriminationFilter !== "ALL" ||
    searchQuery.trim().length > 0;

  return (
    <div className="space-y-3">
      {/* Primary Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Segmented Switcher */}
        <div className="flex p-0.5 rounded-lg bg-slate-100 border border-slate-200 gap-1 overflow-x-auto">
          {/* Option 1: Semua Soal */}
          <button
            onClick={() => onFilterModeChange("ALL")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${filterMode === "ALL"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Semua Butir Soal</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700 font-mono font-bold">
              {totalCount}
            </span>
          </button>

          {/* Option 2: Perlu Diperbaiki */}
          <button
            onClick={() => onFilterModeChange("PROBLEMATIC")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${filterMode === "PROBLEMATIC"
                ? "bg-amber-100 text-amber-900 border border-amber-300 shadow-xs font-bold"
                : "text-slate-600 hover:text-amber-800"
              }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Perlu Diperbaiki</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-200 text-amber-900 font-mono border border-amber-300 font-bold">
              {problematicCount}
            </span>
          </button>

          {/* Option 3: Sudah Layak Pakai */}
          <button
            onClick={() => onFilterModeChange("VALID")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${filterMode === "VALID"
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs font-bold"
                : "text-slate-600 hover:text-emerald-800"
              }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sudah Layak Pakai</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-200 text-emerald-900 font-mono border border-emerald-300 font-bold">
              {validCount}
            </span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder="Cari nomor, materi, atau judul..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange("")}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary filter chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-500 flex items-center gap-1 text-[11px] font-medium">
          <Filter className="w-3 h-3 text-slate-400" />
          <span>Filter Lanjutan:</span>
        </span>

        {/* Filter Kesukaran */}
        <select
          value={difficultyFilter}
          onChange={(e) => onDifficultyFilterChange(e.target.value)}
          className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 text-[11px] font-medium focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
        >
          <option value="ALL">Semua Kesukaran</option>
          <option value="Terlalu Mudah">Terlalu Mudah (P &gt; 0.70)</option>
          <option value="Sedang">Sedang (0.30 &le; P &le; 0.70)</option>
          <option value="Terlalu Sulit">Terlalu Sulit (P &lt; 0.30)</option>
        </select>

        {/* Filter Daya Pembeda */}
        <select
          value={discriminationFilter}
          onChange={(e) => onDiscriminationFilterChange(e.target.value)}
          className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-slate-700 text-[11px] font-medium focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
        >
          <option value="ALL">Semua Daya Pembeda</option>
          <option value="Sangat Baik">Sangat Baik (D &ge; 0.40)</option>
          <option value="Baik">Baik (0.30 &le; D &lt; 0.40)</option>
          <option value="Cukup">Cukup (0.20 &le; D &lt; 0.30)</option>
          <option value="Lemah">Lemah (D &lt; 0.20)</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-2 ml-auto"
          >
            Reset Filter
          </button>
        )}
      </div>
    </div>
  );
};
