"use client";

import React from "react";
import Link from "next/link";
import {
  Compass,
  ArrowLeft,
  School,
  KeyRound,
  Layers,
  BarChart3,
  Plus,
} from "lucide-react";
import { ClassRoom } from "@/lib/class-management-store";

interface ClassDashboardHeaderProps {
  classes: ClassRoom[];
  selectedClassId: string;
  onSelectClass: (classId: string) => void;
  onOpenAddModal: () => void;
}

export const ClassDashboardHeader: React.FC<ClassDashboardHeaderProps> = ({
  classes,
  selectedClassId,
  onSelectClass,
  onOpenAddModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          {/* Logo, Back & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/guru"
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Kembali ke Dasbor Guru"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                    SITINDAK
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Dasbor Guru
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Kelola Kelas di Dasbor & Ruang Asesmen Terpisah
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Navigation Links & Portals */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/guru/kelas"
              className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <School className="w-3.5 h-3.5" />
              <span>Ruang Kelas</span>
            </Link>

            <Link
              href="/guru/asesmen"
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Kelola Asesmen & Token</span>
            </Link>

            <Link
              href="/guru/soal"
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Bank Soal 3-Tier</span>
            </Link>

            <Link
              href="/guru/hasil"
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-blue-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>Hasil & Profil Siswa</span>
            </Link>

            <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block" />

            <Link
              href="/asesmen"
              className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <KeyRound className="w-3.5 h-3.5 text-blue-600" />
              <span>Uji Layar Siswa</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};
