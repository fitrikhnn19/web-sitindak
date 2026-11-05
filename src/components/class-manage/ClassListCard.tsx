"use client";

import React from "react";
import {
  School,
  Users,
  GraduationCap,
  Calendar,
  Layers,
  ArrowRight,
  Edit2,
  Trash2,
  Plus,
  KeyRound,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  ClassRoom,
  getClassStatistics,
} from "@/lib/class-management-store";

interface ClassListCardProps {
  classroom: ClassRoom;
  onOpenWorkspace: (classId: string) => void;
  onEditClass: (classroom: ClassRoom) => void;
  onDeleteClass: (classroom: ClassRoom) => void;
  onCreateAssessment: (classId: string) => void;
}

export const ClassListCard: React.FC<ClassListCardProps> = ({
  classroom,
  onOpenWorkspace,
  onEditClass,
  onDeleteClass,
  onCreateAssessment,
}) => {
  const stats = getClassStatistics(classroom.id);

  return (
    <div className="rounded-xl bg-white border border-slate-200 hover:border-blue-400 p-5 sm:p-6 transition-all duration-200 hover:shadow-md flex flex-col justify-between shadow-sm">
      
      <div>
        {/* Card Header: Class Name, Grade Badge & Quick Actions */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {classroom.name}
                </h3>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  {classroom.gradeLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                <span>{classroom.teacherName}</span>
                {classroom.academicYear && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>TA {classroom.academicYear}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action buttons (Edit, Delete) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEditClass(classroom)}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 border border-slate-200 transition-colors"
              title="Ubah data kelas"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteClass(classroom)}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 transition-colors"
              title="Hapus kelas dari dasbor"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Description / Room info if present */}
        {classroom.description && (
          <p className="text-xs text-slate-600 mt-3 line-clamp-1 italic">
            "{classroom.description}"
          </p>
        )}

        {/* Class Metrics Grid */}
        <div className="grid grid-cols-3 gap-2.5 mt-5">
          {/* Siswa */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px] mb-1">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Siswa</span>
            </div>
            <span className="text-base font-bold text-slate-900">
              {classroom.totalStudents}
            </span>
          </div>

          {/* Asesmen Aktif */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px] mb-1">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Berjalan</span>
            </div>
            <span className="text-base font-bold text-blue-700">
              {stats.activeAssessmentsCount}
            </span>
          </div>

          {/* Selesai / Terkirim */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-500 text-[11px] mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terkirim</span>
            </div>
            <span className="text-base font-bold text-emerald-700">
              {stats.totalFinishedSubmissions}
            </span>
          </div>
        </div>

        {/* Participation Progress Bar */}
        <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-slate-500" />
              <span>Total {stats.totalAssessments} Asesmen</span>
            </span>
            <span className="font-semibold text-blue-700">
              {stats.participationPercentage}% Partisipasi
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${stats.participationPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-slate-100">
        <button
          onClick={() => onOpenWorkspace(classroom.id)}
          className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>Buka Ruang Kelas</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onCreateAssessment(classroom.id)}
          className="p-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors shadow-sm"
          title="Buat Asesmen Baru untuk Kelas Ini"
        >
          <Plus className="w-4 h-4 text-blue-600" />
        </button>
      </div>

    </div>
  );
};
