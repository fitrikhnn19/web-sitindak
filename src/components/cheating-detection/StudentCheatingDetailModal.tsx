"use client";

import React from "react";
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  StudentCheatingSummary,
} from "@/lib/cheating-detection-store";

interface StudentCheatingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentCheatingSummary | null;
  assessmentTitle: string;
}

export const StudentCheatingDetailModal: React.FC<StudentCheatingDetailModalProps> = ({
  isOpen,
  onClose,
  student,
  assessmentTitle,
}) => {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/40 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xl my-8 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                student.hasCheating
                  ? "bg-amber-100 text-amber-700 border border-amber-300"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
              }`}
            >
              {student.hasCheating ? (
                <ShieldAlert className="w-5 h-5" />
              ) : (
                <ShieldCheck className="w-5 h-5" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Audit Integritas: {student.studentName}
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {student.className}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {student.tokenCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 truncate max-w-md font-medium">
                {assessmentTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Badge & Diagnostic Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 shrink-0">
          {/* Status Integritas */}
          <div
            className={`p-3 rounded-xl border ${
              student.hasCheating
                ? "bg-amber-50/70 border-amber-200"
                : "bg-emerald-50/70 border-emerald-200"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
              Status Integritas
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              {student.hasCheating ? (
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              <span
                className={`text-xs font-bold ${
                  student.hasCheating ? "text-amber-900" : "text-emerald-800"
                }`}
              >
                {student.integrityStatus}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
              Skor: {student.integrityScorePct}%
            </span>
          </div>

          {/* Jumlah Kejadian */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
              Total Kejadian
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span
                className={`text-2xl font-black ${
                  student.hasCheating ? "text-amber-800" : "text-emerald-700"
                }`}
              >
                {student.totalEvents}
              </span>
              <span className="text-xs text-slate-500 font-medium">catatan</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {student.totalEvents === 0 ? "Nihil pelanggaran" : `Kepaparahan: ${student.highestSeverity}`}
            </span>
          </div>

          {/* Durasi Ujian */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
              Durasi Pengerjaan
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-slate-900">
                {student.durationMinutes || 0}
              </span>
              <span className="text-xs text-slate-500 font-medium">menit</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
              Selesai tepat waktu
            </span>
          </div>

          {/* Hasil Konsepsi 3-Tier */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">
              Profil Konsepsi
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold mt-1.5">
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                P: {student.pahamCount ?? "-"}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                M: {student.miskonsepsiCount ?? "-"}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800">
                B: {student.belumPahamCount ?? "-"}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-1 font-medium">
              {student.pahamCount && student.pahamCount >= 7 ? "Penguasaan tinggi" : "Perlu tindak lanjut"}
            </span>
          </div>
        </div>

        {/* Pedagogical Guidance Alert */}
        {student.hasCheating ? (
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5 mb-4 shrink-0">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <div className="leading-relaxed">
              <strong className="font-bold">Panduan Guru:</strong> Siswa tercatat melakukan perpindahan tab atau keluar dari mode fokus ujian. Kejadian ini <strong>tidak menghentikan pengerjaan siswa</strong>, namun guru disarankan mengkonfirmasi apakah siswa mencari jawaban di luar atau sekadar tidak sengaja menutup halaman browser.
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5 mb-4 shrink-0">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <div>
              <strong className="font-bold">Integritas Terjaga Penuh:</strong> Siswa mengerjakan asesmen sepenuhnya dalam mode fokus tanpa pernah beralih tab peramban atau meninggalkan jendela ujian.
            </div>
          </div>
        )}

        {/* Timeline of Suspicious Events */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Kronologi Aktivitas Mencurigakan ({student.events.length} Kejadian)
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">
              Waktu kejadian dalam WIB
            </span>
          </div>

          {student.events.length === 0 ? (
            <div className="py-12 text-center rounded-xl bg-slate-50 border border-slate-200 p-6 space-y-2">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Tidak Ada Kejadian Mencurigakan</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Siswa ini menyelesaikan asesmen dengan kepatuhan penuh terhadap aturan mode fokus ujian.
              </p>
            </div>
          ) : (
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {student.events.map((evt, idx) => {
                const clockTime = evt.occurredAt.includes("T")
                  ? evt.occurredAt.split("T")[1].slice(0, 8)
                  : evt.occurredAt;

                return (
                  <div key={evt.id || idx} className="relative pl-8 group">
                    {/* Timeline Node Dot */}
                    <div
                      className={`absolute left-2 top-3 -translate-x-1/2 w-3.5 h-3.5 rounded-full border-2 ${
                        evt.severity === "tinggi"
                          ? "bg-rose-500 border-white"
                          : "bg-amber-400 border-white"
                      }`}
                    />

                    {/* Event Card */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              evt.severity === "tinggi"
                                ? "bg-rose-100 text-rose-800 border border-rose-200"
                                : "bg-amber-100 text-amber-900 border border-amber-200"
                            }`}
                          >
                            Kejadian #{idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-900">
                            {evt.eventLabel}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{clockTime} WIB</span>
                        </div>
                      </div>

                      {/* Detail description */}
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {evt.detail}
                      </p>

                      {/* Context info: question and duration */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 text-[11px] text-slate-500">
                        {evt.questionNumber && (
                          <span className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                            Sedang di Butir Soal #{evt.questionNumber}
                            {evt.questionTitle ? ` — ${evt.questionTitle}` : ""}
                          </span>
                        )}

                        {evt.durationSeconds !== undefined && evt.durationSeconds > 0 && (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 font-semibold">
                            Durasi di luar halaman: {evt.durationSeconds} detik
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0 mt-4">
          <p className="text-[11px]">
            *Laporan forensik tercatat otomatis oleh modul pengawas SITINDAK.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold transition-colors shadow-xs"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
