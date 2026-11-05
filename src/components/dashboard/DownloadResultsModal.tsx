"use client";

import React, { useState } from "react";
import {
  X,
  Download,
  FileSpreadsheet,
  FileCode,
  Printer,
  CheckCircle2,
} from "lucide-react";
import {
  ClassAssessmentSummary,
  generateCsvExport,
  triggerDownload,
} from "@/lib/teacher-results-mock-data";

interface DownloadResultsModalProps {
  isOpen: boolean;
  summary: ClassAssessmentSummary;
  onClose: () => void;
  onPrintPage: () => void;
}

export const DownloadResultsModal: React.FC<DownloadResultsModalProps> = ({
  isOpen,
  summary,
  onClose,
  onPrintPage,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const sanitizedTitle = summary.assessmentTitle.replace(/[^a-zA-Z0-9]/g, "_");
  const sanitizedClass = summary.className.replace(/[^a-zA-Z0-9]/g, "_");
  const defaultFilename = `Hasil_Asesmen_${sanitizedTitle}_${sanitizedClass}_${today}.csv`;
  const defaultJsonFilename = `Hasil_Asesmen_${sanitizedTitle}_${sanitizedClass}_${today}.json`;

  const handleDownloadCsv = () => {
    const csvContent = generateCsvExport(summary);
    triggerDownload(csvContent, defaultFilename, "text/csv;charset=utf-8;");
    setDownloadSuccess(`Berkas "${defaultFilename}" berhasil diunduh!`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadJson = () => {
    const jsonContent = JSON.stringify(summary, null, 2);
    triggerDownload(jsonContent, defaultJsonFilename, "application/json;charset=utf-8;");
    setDownloadSuccess(`Berkas "${defaultJsonFilename}" berhasil diunduh!`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Unduh Hasil & Arsip Asesmen
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {summary.assessmentTitle} • {summary.className}
            </p>
          </div>
        </div>

        {/* Success Alert Banner */}
        {downloadSuccess && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs text-emerald-800 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{downloadSuccess}</span>
          </div>
        )}

        {/* Filename Preview Info Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
          <span className="text-slate-500 block font-bold text-[11px] uppercase tracking-wide">
            Format Nama Berkas Otomatis:
          </span>
          <div className="font-mono text-xs text-blue-700 break-all p-2 rounded-lg bg-white border border-slate-200 font-semibold">
            {defaultFilename}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            *Mencantumkan judul asesmen, nama kelas, dan tanggal unduh hari ini agar rapi diarsipkan.
          </p>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          {/* CSV Spreadsheet Option */}
          <button
            onClick={handleDownloadCsv}
            className="w-full p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-500 transition-all text-left flex items-start gap-3.5 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Unduh Format Spreadsheet (CSV / Excel)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  Rekomendasi
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Lengkap dengan rekap nilai, status pemahaman per butir (Q1..Q10), dan daftar materi prasyarat yang perlu diulang.
              </p>
            </div>
          </button>

          {/* JSON Archive Option */}
          <button
            onClick={handleDownloadJson}
            className="w-full p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-500 transition-all text-left flex items-start gap-3.5 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors block">
                Unduh Data Mentah Lengkap (Format JSON)
              </span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Data terstruktur untuk arsip digital sistemik atau integrasi laporan sekolah lanjutan.
              </p>
            </div>
          </button>

          {/* Print Friendly Option */}
          <button
            onClick={() => {
              onClose();
              onPrintPage();
            }}
            className="w-full p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-500 transition-all text-left flex items-start gap-3.5 group shadow-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Printer className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-700 transition-colors block">
                Cetak / Simpan PDF Halaman ini
              </span>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Tata letak khusus pencetakan langsung melalui peramban untuk dibagikan ke forum guru MGMP.
              </p>
            </div>
          </button>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
