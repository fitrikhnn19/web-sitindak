"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Info,
  FileText,
  ShieldAlert,
} from "lucide-react";
import {
  ClassAssessmentSummary,
} from "@/lib/teacher-results-mock-data";
import { ConceptionStatus } from "@/lib/assessment-mock-data";

interface StudentUnderstandingMatrixProps {
  summary: ClassAssessmentSummary;
  onViewStudentReport: (studentId: string) => void;
  onSelectQuestion: (questionId: string) => void;
}

type FilterCategory = "all" | "misconception" | "unmastered" | "mastered";
type SortOption = "name-asc" | "score-desc" | "misconception-desc" | "paham-desc";

export const StudentUnderstandingMatrix: React.FC<StudentUnderstandingMatrixProps> = ({
  summary,
  onViewStudentReport,
  onSelectQuestion,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Filter & sort students
  const filteredStudents = useMemo(() => {
    let result = [...summary.students];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.studentName.toLowerCase().includes(q));
    }

    // Category filter
    if (filterCategory === "misconception") {
      result = result.filter((s) => s.miskonsepsiCount >= 2);
    } else if (filterCategory === "unmastered") {
      result = result.filter((s) => s.belumPahamCount >= 2);
    } else if (filterCategory === "mastered") {
      result = result.filter((s) => s.pahamCount >= 8);
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === "name-asc") {
        return a.studentName.localeCompare(b.studentName);
      }
      if (sortOption === "score-desc") {
        return b.tier1Score + b.tier2Score - (a.tier1Score + a.tier2Score);
      }
      if (sortOption === "misconception-desc") {
        return b.miskonsepsiCount - a.miskonsepsiCount;
      }
      if (sortOption === "paham-desc") {
        return b.pahamCount - a.pahamCount;
      }
      return 0;
    });

    return result;
  }, [summary.students, searchQuery, filterCategory, sortOption]);

  const getStatusBadge = (status: ConceptionStatus) => {
    switch (status) {
      case "paham":
        return {
          bg: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100",
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          label: "Paham",
          shortLabel: "Paham",
        };
      case "miskonsepsi":
        return {
          bg: "bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100",
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />,
          label: "Miskonsepsi",
          shortLabel: "Miskonsepsi",
        };
      case "belum paham":
      default:
        return {
          bg: "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200",
          icon: <HelpCircle className="w-3.5 h-3.5 text-slate-500" />,
          label: "Belum Paham",
          shortLabel: "Belum",
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search, Filters & Sorting */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter buttons */}
          <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setFilterCategory("all")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                filterCategory === "all"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Semua ({summary.students.length})
            </button>
            <button
              onClick={() => setFilterCategory("misconception")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                filterCategory === "misconception"
                  ? "bg-amber-100 text-amber-900 shadow-xs"
                  : "text-slate-600 hover:text-amber-800"
              }`}
            >
              Miskonsepsi
            </button>
            <button
              onClick={() => setFilterCategory("unmastered")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                filterCategory === "unmastered"
                  ? "bg-slate-200 text-slate-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Belum Paham
            </button>
            <button
              onClick={() => setFilterCategory("mastered")}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all ${
                filterCategory === "mastered"
                  ? "bg-emerald-100 text-emerald-900 shadow-xs"
                  : "text-slate-600 hover:text-emerald-800"
              }`}
            >
              Tuntas Tinggi
            </button>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="text-xs py-2 pl-3 pr-7 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer font-medium"
            >
              <option value="name-asc">Urutkan: Nama (A-Z)</option>
              <option value="score-desc">Urutkan: Nilai Tertinggi</option>
              <option value="misconception-desc">Urutkan: Miskonsepsi Terbanyak</option>
              <option value="paham-desc">Urutkan: Pemahaman Terbanyak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table: Matriks Siswa vs Butir Soal */}
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 min-w-[200px] sticky left-0 z-20 bg-slate-50 shadow-xs">
                  Nama Siswa
                </th>
                <th className="py-3.5 px-3 text-center min-w-[90px]">
                  Skor (T1/T2)
                </th>
                <th className="py-3.5 px-3 text-center min-w-[90px]">
                  Profil
                </th>
                {/* 10 Question Column Headers */}
                {Array.from({ length: summary.totalQuestions }, (_, i) => {
                  const qNum = i + 1;
                  const qId = summary.itemAnalytics[i]?.questionId || summary.students[0]?.itemResults[i]?.questionId || `q-${qNum}`;
                  return (
                    <th
                      key={qId}
                      onClick={() => onSelectQuestion(qId)}
                      className="py-3.5 px-2 text-center min-w-[95px] cursor-pointer hover:bg-blue-50/70 hover:text-blue-700 transition-colors group"
                      title={`Klik untuk melihat rincian soal Q${qNum}`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-900 group-hover:text-blue-700 flex items-center gap-1">
                          Q{qNum}
                          <Info className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-[10px] text-slate-400 lowercase font-normal">
                          butir {qNum}
                        </span>
                      </div>
                    </th>
                  );
                })}
                <th className="py-3.5 px-4 text-center min-w-[120px]">
                  Aksi Laporan
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={14}
                    className="py-12 text-center text-slate-400 italic"
                  >
                    Tidak ada siswa yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student, idx) => (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Student Identity (Sticky Left Column) */}
                    <td className="py-3 px-4 sticky left-0 z-10 bg-white group-hover:bg-slate-50/80 shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-slate-400 font-mono text-[11px] w-4">
                          {idx + 1}.
                        </span>
                        <div>
                          <button
                            onClick={() => onViewStudentReport(student.id)}
                            className="font-bold text-slate-900 hover:text-blue-600 text-left transition-colors flex items-center gap-1.5"
                          >
                            <span>{student.studentName}</span>
                            {student.cheatingEventsCount > 0 && (
                              <span
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200"
                                title={`${student.cheatingEventsCount} kali terdeteksi pindah tab`}
                              >
                                <ShieldAlert className="w-2.5 h-2.5" />
                                {student.cheatingEventsCount}
                              </span>
                            )}
                          </button>
                          <p className="text-[10px] text-slate-500">
                            {student.durationMinutes} mnt • Selesai
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Score T1 & T2 */}
                    <td className="py-3 px-3 text-center">
                      <span className="font-mono font-bold text-slate-800">
                        {student.tier1Score}/{summary.totalQuestions}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Alasan: {student.tier2Score}
                      </span>
                    </td>

                    {/* Conception Profile Mini Badge */}
                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                          title={`${student.pahamCount} butir Paham`}
                        >
                          {student.pahamCount}P
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
                          title={`${student.miskonsepsiCount} butir Miskonsepsi`}
                        >
                          {student.miskonsepsiCount}M
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                          title={`${student.belumPahamCount} butir Belum Paham`}
                        >
                          {student.belumPahamCount}B
                        </span>
                      </div>
                    </td>

                    {/* Question Statuses (Q1 - Q10) */}
                    {student.itemResults.map((item) => {
                      const badge = getStatusBadge(item.status);
                      const tooltipId = `${student.id}-${item.questionId}`;
                      const isHovered = activeTooltip === tooltipId;

                      return (
                        <td
                          key={item.questionId}
                          className="py-2.5 px-1.5 text-center relative"
                          onMouseEnter={() => setActiveTooltip(tooltipId)}
                          onMouseLeave={() => setActiveTooltip(null)}
                        >
                          <button
                            onClick={() => onSelectQuestion(item.questionId)}
                            className={`w-full py-1 px-1 rounded-md border text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${badge.bg}`}
                          >
                            {badge.icon}
                            <span className="truncate">{badge.shortLabel}</span>
                          </button>

                          {/* Hover Tooltip Popup */}
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 p-3 rounded-xl bg-white border border-slate-300 shadow-xl text-left pointer-events-none animate-in fade-in duration-150">
                              <div className="text-[11px] font-bold text-slate-900 mb-1">
                                Q{item.questionNumber}: {item.title}
                              </div>
                              <div className="text-[10px] space-y-1 text-slate-700">
                                <div>
                                  <span className="text-slate-500">Status: </span>
                                  <strong
                                    className={
                                      item.status === "paham"
                                        ? "text-emerald-700"
                                        : item.status === "miskonsepsi"
                                        ? "text-amber-800"
                                        : "text-slate-700"
                                    }
                                  >
                                    {item.status.toUpperCase()}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-slate-500">Jawaban T1: </span>
                                  <strong className={item.isTier1Correct ? "text-emerald-700" : "text-rose-700"}>
                                    {item.tier1Answer} {item.isTier1Correct ? "(Benar)" : `(Kunci: ${item.tier1CorrectAnswer})`}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-slate-500">Alasan T2: </span>
                                  <strong className={item.isTier2Correct ? "text-emerald-700" : "text-rose-700"}>
                                    {item.tier2Answer} {item.isTier2Correct ? "(Benar)" : `(Kunci: ${item.tier2CorrectAnswer})`}
                                  </strong>
                                </div>
                                <div>
                                  <span className="text-slate-500">Keyakinan T3: </span>
                                  <span className="italic font-medium">{item.tier3Confidence}</span>
                                </div>
                                <div className="pt-1 border-t border-slate-200 text-[9px] text-slate-500">
                                  {item.feedbackNote}
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Action Column: View Student Report */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onViewStudentReport(student.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-all text-xs font-semibold shadow-xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Rincian</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Table Footer: Rekapitulasi Persentase Butir Kelas */}
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 text-slate-700 font-bold text-[11px]">
              <tr>
                <td
                  colSpan={3}
                  className="py-3 px-4 sticky left-0 z-10 bg-slate-50 font-bold text-slate-900 shadow-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Rekap Capaian Kelas per Butir (%):</span>
                  </div>
                </td>

                {/* Question Summary per column */}
                {summary.itemAnalytics.map((ia) => (
                  <td key={ia.questionId} className="py-3 px-1.5 text-center text-[10px]">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-emerald-700 font-bold" title="Paham">
                        {ia.pahamRate}% P
                      </span>
                      <span className="text-amber-800 font-bold" title="Miskonsepsi">
                        {ia.miskonsepsiRate}% M
                      </span>
                      <span className="text-slate-600 font-medium" title="Belum Paham">
                        {ia.belumPahamRate}% B
                      </span>
                    </div>
                  </td>
                ))}

                <td className="py-3 px-4 text-center text-slate-400">
                  -
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Legend */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-slate-800">Keterangan Label:</span>
            <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <strong>Paham:</strong> T1 Benar + T2 Benar + Yakin
            </span>
            <span className="flex items-center gap-1.5 text-amber-900 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <strong>Miskonsepsi:</strong> Yakin tapi Jawaban/Alasan Salah
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              <strong>Belum Paham:</strong> Ragu-ragu / Tidak Yakin / Tebak
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            *Klik nomor soal pada header kolom (Q1..Q10) untuk melihat naskah soal & pembahasan
          </div>
        </div>
      </div>
    </div>
  );
};
