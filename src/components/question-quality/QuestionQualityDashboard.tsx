"use client";

import React, { useState, useMemo } from "react";
import {
  AssessmentQualitySummary,
  computeAssessmentQuality,
  QuestionQualityItem,
  QualityFlag,
} from "@/lib/question-quality-analysis";
import { ClassAssessmentSummary } from "@/lib/teacher-results-mock-data";
import { QualityMetricCards } from "./QualityMetricCards";
import { DifficultyDistributionCard } from "./DifficultyDistributionCard";
import {
  QualityFilterTabs,
  QualityFilterMode,
} from "./QualityFilterTabs";
import { ItemQualityList } from "./ItemQualityList";
import { ItemQualityDetailModal } from "./ItemQualityDetailModal";
import { PsychometricGlossaryModal } from "./PsychometricGlossaryModal";
import { Sparkles, BarChart3, HelpCircle, Layers } from "lucide-react";

interface QuestionQualityDashboardProps {
  summary: ClassAssessmentSummary;
}

export const QuestionQualityDashboard: React.FC<QuestionQualityDashboardProps> = ({
  summary,
}) => {
  // Compute initial quality data dynamically from student attempts
  const [qualityData, setQualityData] = useState<AssessmentQualitySummary>(() =>
    computeAssessmentQuality(summary)
  );

  // When summary prop changes (e.g. token switched in header), update qualityData
  React.useEffect(() => {
    setQualityData(computeAssessmentQuality(summary));
  }, [summary]);

  // Filter States (Task 6 & Task 2)
  const [filterMode, setFilterMode] = useState<QualityFilterMode>("ALL");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("ALL");
  const [discriminationFilter, setDiscriminationFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal States (Task 7 & Task 4)
  const [activeQuestionDetailId, setActiveQuestionDetailId] = useState<string | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);

  // Recalculate Simulation (Task 14: Picu Analisis setelah dinilai)
  const handleRecalculate = async () => {
    await new Promise((res) => setTimeout(res, 500));
    setQualityData(computeAssessmentQuality(summary));
  };

  // Filtered Item List
  const filteredItems = useMemo(() => {
    return qualityData.items.filter((item) => {
      // 1. Primary Filter Mode (Task 6: Pisahkan soal layak dan perlu perbaikan)
      if (filterMode === "PROBLEMATIC" && item.flag !== "perlu diperbaiki") {
        return false;
      }
      if (filterMode === "VALID" && item.flag !== "layak") {
        return false;
      }

      // 2. Difficulty Filter (Task 2)
      if (difficultyFilter !== "ALL" && item.difficultyLabel !== difficultyFilter) {
        return false;
      }

      // 3. Discrimination Filter (Task 3)
      if (
        discriminationFilter !== "ALL" &&
        item.discriminationLabel !== discriminationFilter
      ) {
        return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchTopic = item.prerequisiteTopic.toLowerCase().includes(query);
        const matchNumber = `q${item.questionNumber}`.includes(query) || `${item.questionNumber}` === query;
        const matchSuggestion = item.suggestion.toLowerCase().includes(query);
        if (!matchTitle && !matchTopic && !matchNumber && !matchSuggestion) {
          return false;
        }
      }

      return true;
    });
  }, [
    qualityData.items,
    filterMode,
    difficultyFilter,
    discriminationFilter,
    searchQuery,
  ]);

  const handleResetFilters = () => {
    setFilterMode("ALL");
    setDifficultyFilter("ALL");
    setDiscriminationFilter("ALL");
    setSearchQuery("");
  };

  if (qualityData.totalStudents === 0 || qualityData.items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 text-center shadow-xs">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
          <BarChart3 className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Belum Ada Data Analisis Kualitas Soal
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
          Kalkulasi psikometrik (tingkat kesukaran, daya pembeda, efektivitas pengecoh, dan reliabilitas KR-20) akan dihitung secara otomatis setelah siswa menyelesaikan pengerjaan asesmen.
        </p>
        <div className="inline-flex items-center gap-3 flex-wrap justify-center">
          <a
            href="/guru/asesmen"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>+ Buat Asesmen Baru</span>
          </a>
          <button
            onClick={() => setIsGlossaryOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>Panduan Parameter Psikometrik</span>
          </button>
        </div>

        <PsychometricGlossaryModal
          isOpen={isGlossaryOpen}
          onClose={() => setIsGlossaryOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* 1. Psychological & Metric Overview Cards (Task 1, 4, 14) */}
      <QualityMetricCards
        summary={qualityData}
        onRecalculate={handleRecalculate}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
      />

      {/* 2. Visual Distribution of Difficulty (Task 2) */}
      <DifficultyDistributionCard
        summary={qualityData}
        selectedFilter={difficultyFilter}
        onSelectDifficultyFilter={(diff) => setDifficultyFilter(diff)}
      />

      {/* 3. Filter Controls: Separate Valid vs Problematic Items (Task 6) */}
      <QualityFilterTabs
        filterMode={filterMode}
        onFilterModeChange={setFilterMode}
        totalCount={qualityData.items.length}
        problematicCount={qualityData.perluDiperbaikiCount}
        validCount={qualityData.layakCount}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        difficultyFilter={difficultyFilter}
        onDifficultyFilterChange={setDifficultyFilter}
        discriminationFilter={discriminationFilter}
        onDiscriminationFilterChange={setDiscriminationFilter}
        onResetFilters={handleResetFilters}
      />

      {/* 4. Item List and Comparative Cards (Task 1, 2, 3, 5, 8) */}
      <ItemQualityList
        items={filteredItems}
        totalStudents={qualityData.totalStudents}
        onSelectQuestion={(id) => setActiveQuestionDetailId(id)}
      />

      {/* 5. Interactive Detail Item Modal (Task 7) */}
      <ItemQualityDetailModal
        questionId={activeQuestionDetailId}
        items={qualityData.items}
        onClose={() => setActiveQuestionDetailId(null)}
        onSelectQuestion={(id) => setActiveQuestionDetailId(id)}
      />

      {/* 6. Layman Glossary Guide Modal (Task 4) */}
      <PsychometricGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />

    </div>
  );
};
