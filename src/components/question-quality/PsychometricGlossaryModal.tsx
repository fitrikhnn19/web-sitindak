"use client";

import React from "react";
import {
  X,
  BookOpen,
} from "lucide-react";

interface PsychometricGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PsychometricGlossaryModal: React.FC<PsychometricGlossaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6 text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Panduan Istilah Awam Kualitas Soal
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Memahami metrik psikometrik tanpa beban rumus statistik rumit
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

        {/* Content sections */}
        <div className="space-y-5 text-xs sm:text-sm leading-relaxed">
          {/* Section 1: Tingkat Kesukaran */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                1. Tingkat Kesukaran (Facility Index)
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                Indeks: 0.00 – 1.00
              </span>
            </div>
            <p className="text-slate-700">
              Menunjukkan seberapa banyak siswa yang dapat menjawab butir soal dengan benar.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <p className="font-bold text-emerald-800">Terlalu Mudah (&gt; 0.70)</p>
                <p className="text-slate-600 mt-1">
                  Lebih dari 70% siswa menjawab benar. Butir bagus untuk pemanasan, namun kurang membedakan kompetensi.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-blue-300 shadow-xs">
                <p className="font-bold text-blue-700">Sedang (0.30 – 0.70)</p>
                <p className="text-slate-600 mt-1">
                  <strong className="text-slate-900">Paling Ideal</strong> untuk asesmen diagnostik. Memberikan tantangan seimbang bagi siswa.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-xs">
                <p className="font-bold text-rose-800">Terlalu Sulit (&lt; 0.30)</p>
                <p className="text-slate-600 mt-1">
                  Kurang dari 30% siswa menjawab benar. Periksa apakah materi prasyarat sudah diajarkan sebelum asesmen.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Daya Pembeda */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                2. Daya Pembeda (Discrimination Index)
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                Indeks: -1.00 – 1.00
              </span>
            </div>
            <p className="text-slate-700">
              Menunjukkan kemampuan soal dalam membedakan siswa yang sudah benar-benar paham (kelompok atas) dengan siswa yang masih belum paham (kelompok bawah).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-emerald-300 shadow-xs">
                <p className="font-bold text-emerald-800">Baik / Sangat Baik (&ge; 0.30)</p>
                <p className="text-slate-600 mt-1">
                  Siswa ranking atas menjawab benar jauh lebih banyak daripada siswa ranking bawah. Soal berfungsi optimal.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-rose-300 shadow-xs">
                <p className="font-bold text-rose-800">Lemah / Negatif (&lt; 0.20)</p>
                <p className="text-slate-600 mt-1">
                  Kelompok bawah menjawab benar sama banyaknya atau lebih tinggi dari kelompok atas. Menandakan opsi soal membingungkan atau salah kunci.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Validitas & Reliabilitas */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                3. Validitas Butir & Reliabilitas Asesmen
              </span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Derajat Kepercayaan
              </span>
            </div>
            <p className="text-slate-700">
              <strong>Validitas Butir:</strong> Sejauh mana butir soal ini sejalan dengan keseluruhan hasil asesmen. Butir dengan validitas rendah biasanya mengukur hal di luar kisi-kisi atau membingungkan.
            </p>
            <p className="text-slate-700">
              <strong>Reliabilitas Asesmen (&alpha;):</strong> Derajat konsistensi keseluruhan instrumen. Nilai di atas 0.70 berarti hasil asesmen stabil dan guru dapat dengan yakin mengambil keputusan tindak lanjut pembelajaran berdasarkan data ini.
            </p>
          </div>

          {/* Section 4: Efektivitas Pengecoh */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                4. Efektivitas Pengecoh (Distractor Function)
              </span>
            </div>
            <p className="text-slate-700">
              Pengecoh yang baik dipilih oleh setidaknya 5% siswa (terutama kelompok bawah) dan tidak dipilih lebih banyak oleh kelompok atas. Jika suatu opsi pengecoh tidak ada yang memilih sama sekali (0%), opsi tersebut tidak berfungsi dan perlu diganti dengan pengecoh yang lebih realistis.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
