"use client";

import React from "react";
import { 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Check
} from "lucide-react";

interface HeroProps {
  onOpenTokenModal: () => void;
  onOpenTeacherModal: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenTokenModal,
  onOpenTeacherModal,
}) => {
  return (
    <section id="beranda" className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-50 border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Tag Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          <span>SITINDAK — Asesmen Diagnostik Three-Tier Matematika</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Bongkar{" "}
          <span className="text-blue-600 underline decoration-blue-200 decoration-wavy decoration-2">
            Miskonsepsi
          </span>{" "}
          Matematika Sebelum Masuk Materi Lanjutan.
        </h1>

        {/* Subheading */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
          Bukan sekadar benar atau salah. SITINDAK membedakan secara instan mana siswa yang{" "}
          <strong className="text-emerald-700 font-semibold">Paham Utuh</strong>, mengalami{" "}
          <strong className="text-amber-700 font-semibold">Miskonsepsi</strong>, atau{" "}
          <strong className="text-slate-700 font-semibold">Belum Paham</strong> materi prasyarat — langsung tersaji tanpa perlu hitung manual.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <a
            href="/asesmen"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
          >
            <KeyRound className="w-4 h-4 text-blue-100" />
            <span>Masuk dengan Token Siswa</span>
            <ArrowRight className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenTeacherModal}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
          >
            <span>Portal Masuk Guru</span>
          </button>
        </div>

        {/* 3 Status Outcome Cards (Clean Academic Edu-Tech) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 text-left max-w-4xl mx-auto">
          
          <div className="p-5 rounded-xl bg-white border border-emerald-200 shadow-xs hover:border-emerald-300 transition-colors">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-emerald-800">
                1. Sudah Paham
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jawaban benar, alasan ilmiah tepat, dan siswa meyakininya dengan mantap. Siap masuk ke materi lanjutan.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-amber-200 shadow-xs hover:border-amber-300 transition-colors">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-amber-800">
                2. Miskonsepsi
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Siswa yakin dengan alasan yang keliru. Terdeteksi secara presisi agar guru dapat memberikan intervensi terarah.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200">
                <XCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-800">
                3. Belum Paham
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Siswa ragu-ragu atau menebak tanpa dasar pemahaman awal. Perlu penguatan materi prasyarat dasar.
            </p>
          </div>

        </div>

        {/* Metrics Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">3 Tingkat</p>
            <p className="text-xs text-slate-500 mt-1">Jawaban • Alasan • Keyakinan</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">0 Detik</p>
            <p className="text-xs text-slate-500 mt-1">Analisis Otomatis di Server</p>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-700">100%</p>
            <p className="text-xs text-slate-500 mt-1">Privat untuk Refleksi Siswa</p>
          </div>
        </div>

      </div>
    </section>
  );
};
