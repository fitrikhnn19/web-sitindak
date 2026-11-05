"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Play,
  Lock,
  Save,
  Check,
  AlertCircle,
  Timer,
  ChevronRight,
} from "lucide-react";
import {
  AssessmentItem,
  deriveScheduleStatus,
  updateSchedule,
  ScheduleDerivedStatus,
} from "@/lib/assessment-management-store";
import { ScheduleStatusBadge } from "./StatusBadges";

interface ScheduleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentItem | null;
  onAssessmentUpdated: (updated: AssessmentItem) => void;
}

export const ScheduleManagementModal: React.FC<ScheduleManagementModalProps> = ({
  isOpen,
  onClose,
  assessment,
  onAssessmentUpdated,
}) => {
  const [opensAt, setOpensAt] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Helper formatting for datetime-local
  const formatDt = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  useEffect(() => {
    if (assessment) {
      const openD = new Date(assessment.opensAt);
      const closeD = new Date(assessment.closesAt);
      setOpensAt(formatDt(openD));
      setClosesAt(formatDt(closeD));
      setDurationMinutes(assessment.durationMinutes !== undefined ? assessment.durationMinutes : 45);
      setSaveSuccessMsg(null);
      setErrorMessage(null);
    }
  }, [assessment, isOpen]);

  if (!isOpen || !assessment) return null;

  const currentScheduleStatus: ScheduleDerivedStatus = deriveScheduleStatus(
    opensAt ? new Date(opensAt).toISOString() : assessment.opensAt,
    closesAt ? new Date(closesAt).toISOString() : assessment.closesAt
  );

  // Quick preset actions
  const applyPresetNow90Min = () => {
    const now = new Date();
    const close = new Date(now.getTime() + 90 * 60 * 1000);
    setOpensAt(formatDt(now));
    setClosesAt(formatDt(close));
  };

  const applyPresetNow2Hours = () => {
    const now = new Date();
    const close = new Date(now.getTime() + 120 * 60 * 1000);
    setOpensAt(formatDt(now));
    setClosesAt(formatDt(close));
  };

  const applyPresetTomorrowMorning = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const start = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 7, 30);
    const end = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 0);
    setOpensAt(formatDt(start));
    setClosesAt(formatDt(end));
  };

  const applyExtend30Min = () => {
    const currentEnd = closesAt ? new Date(closesAt) : new Date(assessment.closesAt);
    const extended = new Date(currentEnd.getTime() + 30 * 60 * 1000);
    setClosesAt(formatDt(extended));
  };

  const applyCloseNow = () => {
    const now = new Date();
    const past = new Date(now.getTime() - 60 * 1000);
    setClosesAt(formatDt(past));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opensAt || !closesAt) {
      setErrorMessage("Waktu buka dan tutup wajib diisi.");
      return;
    }
    if (new Date(opensAt) >= new Date(closesAt)) {
      setErrorMessage("Waktu buka harus lebih awal dari waktu tutup asesmen.");
      return;
    }

    const updated = updateSchedule(
      assessment.id,
      new Date(opensAt).toISOString(),
      new Date(closesAt).toISOString(),
      durationMinutes
    );

    if (updated) {
      onAssessmentUpdated(updated);
      setSaveSuccessMsg("Jadwal dan durasi asesmen berhasil diperbarui!");
      setTimeout(() => {
        setSaveSuccessMsg(null);
      }, 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Jadwal & Durasi Pengerjaan Asesmen
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {assessment.className}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Atur jadwal buka-tutup dan alokasi batas waktu pengerjaan per siswa
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

        {saveSuccessMsg && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          
          {/* Current Status Preview Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Status Jadwal Pelaksanaan
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                {assessment.title}
              </h3>
            </div>
            <ScheduleStatusBadge status={currentScheduleStatus} size="md" />
          </div>

          {/* Quick Preset Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Pilihan Jadwal Cepat (Presets):
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={applyPresetNow90Min}
                className="px-2.5 py-2 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors text-left"
              >
                ⚡ Buka Sekarang (90 Menit)
              </button>
              <button
                type="button"
                onClick={applyPresetNow2Hours}
                className="px-2.5 py-2 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors text-left"
              >
                ⏱️ Buka Sekarang (2 Jam)
              </button>
              <button
                type="button"
                onClick={applyPresetTomorrowMorning}
                className="px-2.5 py-2 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors text-left"
              >
                🌅 Jadwalkan Besok Pagi
              </button>
              <button
                type="button"
                onClick={applyExtend30Min}
                className="px-2.5 py-2 text-xs font-medium rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors text-left"
              >
                ➕ Perpanjang +30 Menit
              </button>
              <button
                type="button"
                onClick={applyCloseNow}
                className="px-2.5 py-2 text-xs font-medium rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors text-left sm:col-span-2"
              >
                🔒 Kunci & Tutup Asesmen Sekarang
              </button>
            </div>
          </div>

          {/* Form Date/Time Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-emerald-600" />
                <span>Waktu Buka Asesmen:</span>
              </label>
              <input
                type="datetime-local"
                value={opensAt}
                onChange={(e) => setOpensAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1.5">
                Siswa tidak bisa membuka soal sebelum jam ini tiba.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                <span>Batas Tutup Asesmen:</span>
              </label>
              <input
                type="datetime-local"
                value={closesAt}
                onChange={(e) => setClosesAt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-blue-600"
                required
              />
              <p className="text-[10px] text-slate-500 mt-1.5">
                Setelah waktu ini, pengerjaan baru dikunci otomatis.
              </p>
            </div>
          </div>

          {/* Pengaturan Durasi Pengerjaan */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                <Timer className="w-4 h-4 text-amber-600" />
                <span>Batas Durasi Pengerjaan per Siswa:</span>
              </label>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-amber-900 border border-amber-300">
                {durationMinutes === 0 ? "Tanpa Batas Waktu" : `${durationMinutes} Menit`}
              </span>
            </div>
            
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Waktu hitung mundur berjalan begitu siswa memasukkan token dan nama. Ujian otomatis terkumpul saat durasi habis.
            </p>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "30 Menit", val: 30 },
                { label: "45 Menit", val: 45 },
                { label: "60 Menit", val: 60 },
                { label: "90 Menit", val: 90 },
                { label: "120 Menit", val: 120 },
                { label: "Tanpa Batas", val: 0 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setDurationMinutes(item.val)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    durationMinutes === item.val
                      ? "bg-amber-600 text-white font-bold shadow-sm"
                      : "bg-white hover:bg-amber-100 text-amber-900 border border-amber-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-slate-600 shrink-0">Atur Kustom:</span>
              <div className="relative w-40">
                <input
                  type="number"
                  min="0"
                  max="360"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-3 pr-14 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-600"
                  placeholder="Ketik menit"
                />
                <span className="absolute right-3 top-1.5 text-xs text-slate-400 pointer-events-none">
                  menit
                </span>
              </div>
            </div>
          </div>

          {/* PRD Rule Note */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
            🛡️ <strong>Aturan Akses Siswa:</strong> Siswa yang mencoba masuk sebelum jadwal buka atau setelah jadwal tutup akan menerima pesan penolakan yang informatif tanpa membocorkan isi butir soal diagnostik.
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Jadwal & Durasi</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
