"use client";

import React from "react";
import {
  School,
  Plus,
  Layers,
  Search,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface NoClassesEmptyStateProps {
  onAddClass: () => void;
  onResetDefaults?: () => void;
}

export const NoClassesEmptyState: React.FC<NoClassesEmptyStateProps> = ({
  onAddClass,
  onResetDefaults,
}) => {
  return (
    <div className="py-16 px-6 rounded-2xl bg-white border border-slate-200 text-center max-w-2xl mx-auto my-8 shadow-sm">
      <div className="w-16 h-16 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mx-auto mb-5 shadow-sm">
        <School className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">
        Belum Ada Kelas yang Diampu
      </h3>

      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
        Tambahkan kelas yang Anda ajar (misal: Kelas XI-A, XI-B) langsung dari dasbor ini. Setiap kelas memiliki ruang kelola tersendiri agar asesmen, token pengerjaan, dan profil pemahaman siswa tetap terisolasi dan tidak tercampur.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onAddClass}
          className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Pertama Sekarang</span>
        </button>

        {onResetDefaults && (
          <button
            onClick={onResetDefaults}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Muat Data Kelas Bawaan (XI-A s/d XI-D)</span>
          </button>
        )}
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8 pt-8 border-t border-slate-100 text-left">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-semibold text-slate-900">1. Ruang Terpisah</p>
          <p className="text-[11px] text-slate-600 mt-1">Data siswa dan asesmen tiap kelas tidak akan tercampur.</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-semibold text-slate-900">2. Token Unik</p>
          <p className="text-[11px] text-slate-600 mt-1">Satu token bersama per kelas dengan kuota pemakaian otomatis.</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-semibold text-slate-900">3. Tanpa Daftar Ulang</p>
          <p className="text-[11px] text-slate-600 mt-1">Tambah, ganti nama, atau hapus kelas bebas kapan saja.</p>
        </div>
      </div>
    </div>
  );
};

interface NoAssessmentsForClassEmptyStateProps {
  className: string;
  onCreateAssessment: () => void;
}

export const NoAssessmentsForClassEmptyState: React.FC<NoAssessmentsForClassEmptyStateProps> = ({
  className,
  onCreateAssessment,
}) => {
  return (
    <div className="p-8 sm:p-12 rounded-2xl bg-white border border-slate-200 text-center max-w-xl mx-auto my-6 shadow-sm">
      <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 mx-auto mb-4">
        <Layers className="w-7 h-7" />
      </div>

      <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
        Belum Ada Asesmen untuk {className}
      </h4>

      <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
        Kelas ini belum memiliki asesmen diagnostik aktif. Buat asesmen baru untuk menghasilkan token unik dan memantau pemahaman tiga tingkat siswa di kelas ini.
      </p>

      <button
        onClick={onCreateAssessment}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Buat Asesmen Baru</span>
      </button>
    </div>
  );
};

interface NoStudentsFilteredEmptyStateProps {
  query?: string;
  statusFilter?: string;
  onResetFilters: () => void;
}

export const NoStudentsFilteredEmptyState: React.FC<NoStudentsFilteredEmptyStateProps> = ({
  query,
  statusFilter,
  onResetFilters,
}) => {
  return (
    <div className="py-10 text-center space-y-2">
      <p className="text-xs font-semibold text-slate-700">
        Tidak ada data siswa yang cocok dengan filter pencarian
        {query ? ` "${query}"` : ""}
        {statusFilter && statusFilter !== "semua" ? ` (status: ${statusFilter})` : ""}.
      </p>
      <button
        onClick={onResetFilters}
        className="text-xs text-blue-600 hover:text-blue-700 font-medium underline underline-offset-2"
      >
        Reset Filter
      </button>
    </div>
  );
};
