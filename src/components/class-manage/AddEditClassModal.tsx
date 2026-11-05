"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  School,
  Save,
  Users,
  GraduationCap,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  ClassRoom,
  addClass,
  updateClass,
} from "@/lib/class-management-store";

interface AddEditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classToEdit?: ClassRoom | null;
  onSaved: (classroom: ClassRoom, isNew: boolean) => void;
}

const GRADE_LEVEL_OPTIONS = [
  "SMA Kelas 10",
  "SMA Kelas 11",
  "SMA Kelas 12",
  "Kustom...",
];

export const AddEditClassModal: React.FC<AddEditClassModalProps> = ({
  isOpen,
  onClose,
  classToEdit,
  onSaved,
}) => {
  const isEditing = Boolean(classToEdit);

  const [name, setName] = useState("");
  const [selectedGradeOption, setSelectedGradeOption] = useState("SMA Kelas 11");
  const [customGrade, setCustomGrade] = useState("");
  const [totalStudents, setTotalStudents] = useState<number>(32);
  const [academicYear, setAcademicYear] = useState("2026/2027");
  const [description, setDescription] = useState("");
  const [teacherName, setTeacherName] = useState("Dra. Sri Wahyuni, M.Pd.");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (classToEdit) {
        setName(classToEdit.name);
        if (GRADE_LEVEL_OPTIONS.includes(classToEdit.gradeLevel)) {
          setSelectedGradeOption(classToEdit.gradeLevel);
          setCustomGrade("");
        } else {
          setSelectedGradeOption("Kustom...");
          setCustomGrade(classToEdit.gradeLevel);
        }
        setTotalStudents(classToEdit.totalStudents);
        setAcademicYear(classToEdit.academicYear || "2026/2027");
        setDescription(classToEdit.description || "");
        setTeacherName(classToEdit.teacherName || "Dra. Sri Wahyuni, M.Pd.");
      } else {
        setName("");
        setSelectedGradeOption("SMA Kelas 11");
        setCustomGrade("");
        setTotalStudents(32);
        setAcademicYear("2026/2027");
        setDescription("");
        setTeacherName("Dra. Sri Wahyuni, M.Pd.");
      }
      setErrorMessage(null);
    }
  }, [isOpen, classToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Nama kelas wajib diisi (mis. Kelas XI-A atau XI-1).");
      return;
    }

    const effectiveGradeLevel =
      selectedGradeOption === "Kustom..."
        ? customGrade.trim() || "SMA Kelas 11"
        : selectedGradeOption;

    if (!effectiveGradeLevel) {
      setErrorMessage("Tingkat kelas wajib dipilih atau diisi.");
      return;
    }

    if (!totalStudents || totalStudents < 1) {
      setErrorMessage("Jumlah siswa minimal 1 orang.");
      return;
    }

    if (totalStudents > 80) {
      setErrorMessage("Jumlah siswa maksimal 80 orang per kelas.");
      return;
    }

    try {
      if (isEditing && classToEdit) {
        const updated = await updateClass(classToEdit.id, {
          name: trimmedName,
          gradeLevel: effectiveGradeLevel,
          totalStudents: Number(totalStudents),
          academicYear: academicYear.trim(),
          description: description.trim(),
          teacherName: teacherName.trim(),
        });
        if (updated) {
          onSaved(updated, false);
          onClose();
        } else {
          setErrorMessage("Gagal memperbarui kelas.");
        }
      } else {
        const created = await addClass({
          name: trimmedName,
          gradeLevel: effectiveGradeLevel,
          totalStudents: Number(totalStudents),
          academicYear: academicYear.trim(),
          description: description.trim(),
          teacherName: teacherName.trim(),
        });
        onSaved(created, true);
        onClose();
      }
    } catch (err) {
      setErrorMessage("Terjadi kesalahan saat menyimpan data kelas.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isEditing ? "Ubah Data Kelas" : "Tambah Kelas Baru"}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? "Perbarui nama, tingkat kelas, atau kuota siswa di dasbor"
                  : "Buat ruang kelola asesmen baru untuk kelas yang Anda ampu"}
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

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Nama Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Kelas: <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <School className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="mis. Kelas XI-A, XI-B, atau XI-IPA 1"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-slate-400 font-medium"
                required
                autoFocus
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Nama ini akan menjadi label ruang kelola dan kode dasar token asesmen.
            </p>
          </div>

          {/* Tingkat Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tingkat Kelas (Jenjang): <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <select
                value={selectedGradeOption}
                onChange={(e) => setSelectedGradeOption(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 cursor-pointer"
              >
                {GRADE_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            {selectedGradeOption === "Kustom..." && (
              <input
                type="text"
                value={customGrade}
                onChange={(e) => setCustomGrade(e.target.value)}
                placeholder="Ketik tingkat kelas kustom (mis. Paket C Setara SMA)"
                className="mt-2 w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                required
              />
            )}
          </div>

          {/* Grid: Jumlah Siswa & Tahun Ajaran */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Jumlah Siswa: <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={totalStudents}
                  onChange={(e) => setTotalStudents(parseInt(e.target.value, 10) || 0)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Dipakai otomatis sebagai batas kuota token asesmen kelas ini.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tahun Ajaran:
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2026/2027"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Guru Pengampu */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Guru Pengampu:
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-blue-600"
            />
          </div>

          {/* Catatan / Keterangan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Keterangan / Lokasi (Opsional):
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="mis. Lab Komputer Matematika atau Ruang 15"
              className="w-full px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 resize-none placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? "Simpan Perubahan Kelas" : "Tambah Kelas ke Dasbor"}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
