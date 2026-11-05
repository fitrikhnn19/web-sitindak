"use client";

import React, { useState } from "react";
import {
  X,
  AlertTriangle,
  Trash2,
  School,
  Layers,
  Users,
} from "lucide-react";
import {
  ClassRoom,
  deleteClass,
  getAssessmentsForClass,
} from "@/lib/class-management-store";

interface DeleteClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classroom: ClassRoom | null;
  onDeleted: (classId: string) => void;
}

export const DeleteClassModal: React.FC<DeleteClassModalProps> = ({
  isOpen,
  onClose,
  classroom,
  onDeleted,
}) => {
  const [deleteAssessmentsToo, setDeleteAssessmentsToo] = useState(true);

  if (!isOpen || !classroom) return null;

  const assessments = getAssessmentsForClass(classroom.id);
  const totalStudents = classroom.totalStudents;

  const handleConfirmDelete = async () => {
    await deleteClass(classroom.id, deleteAssessmentsToo);
    onDeleted(classroom.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Hapus Kelas
              </h2>
              <p className="text-xs text-rose-600 font-medium">
                Tindakan ini tidak dapat dibatalkan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Kelas yang akan dihapus:</span>
              <span className="text-xs font-bold text-slate-900">{classroom.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Tingkat Jenjang:</span>
              <span className="text-xs text-slate-700">{classroom.gradeLevel}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Jumlah Siswa:</span>
              <span className="text-xs text-slate-700">{totalStudents} Siswa</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">Asesmen Terkait:</span>
              <span className="text-xs font-semibold text-blue-700">
                {assessments.length} asesmen terdaftar
              </span>
            </div>
          </div>

          {assessments.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <div className="space-y-1">
                <p className="font-semibold">Peringatan Asesmen Aktif</p>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Kelas ini memiliki {assessments.length} asesmen dan token pengerjaan. Jika dihapus, Anda tidak dapat lagi memantau progres siswa kelas ini.
                </p>
              </div>
            </div>
          )}

          {assessments.length > 0 && (
            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={deleteAssessmentsToo}
                onChange={(e) => setDeleteAssessmentsToo(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700">
                Hapus juga seluruh asesmen dan token milik kelas {classroom.name}
              </span>
            </label>
          )}

          <p className="text-xs text-slate-600">
            Apakah Anda yakin ingin menghapus <strong>{classroom.name}</strong> dari dasbor Anda?
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-5 mt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Hapus Kelas</span>
          </button>
        </div>

      </div>
    </div>
  );
};
