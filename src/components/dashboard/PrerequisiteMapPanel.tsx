"use client";

import React, { useState } from "react";
import {
  Compass,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Lightbulb,
} from "lucide-react";
import {
  ClassAssessmentSummary,
  RepetitionLevel,
} from "@/lib/teacher-results-mock-data";

interface PrerequisiteMapPanelProps {
  summary: ClassAssessmentSummary;
  onSelectQuestion: (questionId: string) => void;
}

export const PrerequisiteMapPanel: React.FC<PrerequisiteMapPanelProps> = ({
  summary,
  onSelectQuestion,
}) => {
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<
    "all" | RepetitionLevel
  >("all");

  const filteredTopics = summary.prerequisiteMap.filter((topic) => {
    if (selectedTopicFilter === "all") return true;
    return topic.repetitionNeed === selectedTopicFilter;
  });

  const getRepetitionBadge = (level: RepetitionLevel) => {
    switch (level) {
      case "Sangat Butuh Pengulangan":
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-800",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
          label: "Sangat Butuh Pengulangan",
          pillBg: "bg-rose-600",
        };
      case "Butuh Pengulangan":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-900",
          icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
          label: "Butuh Pengulangan",
          pillBg: "bg-amber-500",
        };
      case "Tuntas / Siap Lanjut":
      default:
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: "Tuntas / Siap Lanjut",
          pillBg: "bg-emerald-600",
        };
    }
  };

  const highPriorityCount = summary.prerequisiteMap.filter(
    (t) => t.repetitionNeed === "Sangat Butuh Pengulangan"
  ).length;

  const moderatePriorityCount = summary.prerequisiteMap.filter(
    (t) => t.repetitionNeed === "Butuh Pengulangan"
  ).length;

  return (
    <div className="space-y-6">
      {/* Intro Guidance Card for Teachers */}
      <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-200 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Peta Kesiapan Materi Prasyarat Transformasi Geometri
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Rekomendasi topik yang wajib diulang guru sebelum memulai materi baru, dihitung otomatis dari tingkat miskonsepsi & keraguan siswa.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {highPriorityCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                {highPriorityCount} Topik Kritis
              </span>
            )}
            {moderatePriorityCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {moderatePriorityCount} Perlu Penguatan
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
          <button
            onClick={() => setSelectedTopicFilter("all")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedTopicFilter === "all"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Semua Topik ({summary.prerequisiteMap.length})
          </button>
          <button
            onClick={() => setSelectedTopicFilter("Sangat Butuh Pengulangan")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedTopicFilter === "Sangat Butuh Pengulangan"
                ? "bg-rose-100 text-rose-800 shadow-xs"
                : "text-slate-600 hover:text-rose-800"
            }`}
          >
            Sangat Butuh Pengulangan ({highPriorityCount})
          </button>
          <button
            onClick={() => setSelectedTopicFilter("Butuh Pengulangan")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedTopicFilter === "Butuh Pengulangan"
                ? "bg-amber-100 text-amber-900 shadow-xs"
                : "text-slate-600 hover:text-amber-800"
            }`}
          >
            Butuh Pengulangan ({moderatePriorityCount})
          </button>
          <button
            onClick={() => setSelectedTopicFilter("Tuntas / Siap Lanjut")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
              selectedTopicFilter === "Tuntas / Siap Lanjut"
                ? "bg-emerald-100 text-emerald-900 shadow-xs"
                : "text-slate-600 hover:text-emerald-800"
            }`}
          >
            Tuntas / Siap Lanjut
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Menampilkan {filteredTopics.length} materi prasyarat
        </span>
      </div>

      {/* Topic Cards Grid */}
      {filteredTopics.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-white border border-slate-200 text-slate-500 text-xs shadow-sm">
          Belum ada data materi prasyarat yang terpetakan untuk filter ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTopics.map((topic) => {
            const badge = getRepetitionBadge(topic.repetitionNeed);

            return (
              <div
                key={topic.topicName}
                className="rounded-xl bg-white border border-slate-200 p-5 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors space-y-4"
              >
                <div>
                  {/* Status Badge & Related Questions */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${badge.bg}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>

                    {/* Associated Question Pills */}
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] text-slate-500 uppercase mr-1 font-semibold">
                        Butir:
                      </span>
                      {topic.relatedQuestionNumbers.map((num, i) => {
                        const qId = topic.relatedQuestionIds[i];
                        return (
                          <button
                            key={num}
                            onClick={() => onSelectQuestion(qId)}
                            className="px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-bold border border-blue-200 transition-colors"
                            title={`Buka rincian soal butir ${num}`}
                          >
                            Q{num}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Topic Name */}
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {topic.topicName}
                  </h4>

                  {/* Progress Distribution Bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-700">
                      <span className="text-emerald-700 font-bold">
                        Tuntas: {topic.pahamPercentage}%
                      </span>
                      <span className="text-amber-800 font-bold">
                        Bermasalah: {topic.problemPercentage}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full flex overflow-hidden">
                      <div
                        className="bg-emerald-500 transition-all"
                        style={{ width: `${topic.pahamPercentage}%` }}
                        title={`Paham: ${topic.pahamPercentage}%`}
                      />
                      <div
                        className="bg-amber-400 transition-all"
                        style={{
                          width: `${
                            topic.totalStudents * topic.relatedQuestionNumbers.length > 0
                              ? Math.round(
                                  (topic.miskonsepsiCount /
                                    (topic.totalStudents *
                                      topic.relatedQuestionNumbers.length)) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                        title="Miskonsepsi"
                      />
                      <div
                        className="bg-slate-400 transition-all"
                        style={{
                          width: `${
                            topic.totalStudents * topic.relatedQuestionNumbers.length > 0
                              ? Math.round(
                                  (topic.belumPahamCount /
                                    (topic.totalStudents *
                                      topic.relatedQuestionNumbers.length)) *
                                    100
                                )
                              : 0
                          }%`,
                        }}
                        title="Belum Paham"
                      />
                    </div>

                    <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                      <span>{topic.pahamCount} respon paham</span>
                      <span>{topic.miskonsepsiCount} miskonsepsi • {topic.belumPahamCount} belum paham</span>
                    </div>
                  </div>

                  {/* Actionable Remedial Strategy for Teacher */}
                  <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 space-y-1">
                    <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                      <span>Rekomendasi Tindak Lanjut Guru:</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-600">
                      {topic.pedagogicalAction}
                    </p>
                  </div>
                </div>

                {/* Affected Students List */}
                {topic.affectedStudentNames.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-500 font-medium block mb-1">
                      Siswa Memerlukan Intervensi ({topic.affectedStudentNames.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {topic.affectedStudentNames.slice(0, 6).map((name) => (
                        <span
                          key={name}
                          className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {name}
                        </span>
                      ))}
                      {topic.affectedStudentNames.length > 6 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-medium">
                          +{topic.affectedStudentNames.length - 6} lainnya
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
