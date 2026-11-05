"use client";

import React, { useState } from "react";
import { 
  Smartphone, 
  Laptop, 
  KeyRound, 
  CheckCircle2, 
  EyeOff, 
  ShieldCheck, 
  BookOpen, 
  Layers,
  ArrowRight
} from "lucide-react";
import { MathRenderer } from "./MathRenderer";

interface StudentExperienceSectionProps {
  onOpenTokenModal: () => void;
}

export const StudentExperienceSection: React.FC<StudentExperienceSectionProps> = ({
  onOpenTokenModal,
}) => {
  const [deviceView, setDeviceView] = useState<"mobile" | "desktop">("mobile");

  return (
    <section id="alur-siswa" className="py-24 relative bg-slate-50 border-y border-slate-200 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Smartphone className="w-3.5 h-3.5 text-blue-600" />
            <span>Pengalaman Siswa Mulus & Ringan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Dirancang Nyaman untuk Layar HP Siswa
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Tanpa perlu membuat akun, tanpa kata sandi rumit. Cukup ketik token dari guru dan nama lengkap, siswa langsung siap mengerjakan soal bertingkat dan menerima umpan balik reflektif saat itu juga.
          </p>
        </div>

        {/* Feature Grid & Device Interactive Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 4 Key Student Experience Steps */}
          <div className="lg:col-span-6 space-y-4">
            
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 font-bold flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  1. Masuk Instan Hanya dengan Token
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Guru membagikan token ke papan tulis atau grup kelas. Siswa cukup memasukkan kode dan nama. Tidak ada formulir pendaftaran akun atau verifikasi email yang menyita waktu jam pelajaran.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  2. Alur Pengerjaan Tiga Tingkat yang Jelas
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Siswa diarahkan secara terstruktur: pilih jawaban di Tingkat 1, pilih alasan di Tingkat 2, lalu tetapkan tingkat keyakinan ("Yakin" atau "Tidak Yakin"). Rumus matematika dirender tajam dengan KaTeX.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 font-bold flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  3. Mode Fokus Ujian & Anti-Kecurangan
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Layar diatur terfokus selama pengerjaan. Jika siswa mencoba berpindah tab mencari jawaban di peramban lain, sistem akan memberi peringatan dan mencatat kejadian tersebut untuk laporan guru.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  4. Umpan Balik Privat & Refleksi Pembelajaran
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Tepat setelah tombol "Kirim Jawaban" ditekan, siswa langsung disajikan hasil analisisnya sendiri secara privat, lengkap dengan pembahasan butir dan materi prasyarat yang perlu dipelajari ulang.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="/asesmen"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
              >
                <KeyRound className="w-4 h-4" />
                <span>Simulasikan Masuk Sebagai Siswa</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* Right Column: Interactive Phone Mockup */}
          <div className="lg:col-span-6 flex flex-col items-center">
            
            {/* Device Switcher */}
            <div className="flex rounded-lg bg-white p-1 border border-slate-200 shadow-sm mb-6">
              <button
                onClick={() => setDeviceView("mobile")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  deviceView === "mobile"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Layar HP (Mobile First)</span>
              </button>
              <button
                onClick={() => setDeviceView("desktop")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  deviceView === "desktop"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Laptop className="w-3.5 h-3.5" />
                <span>Layar Laptop / Tablet</span>
              </button>
            </div>

            {/* Mockup Frame */}
            {deviceView === "mobile" ? (
              <div className="w-[320px] sm:w-[350px] rounded-[42px] p-3 bg-slate-900 border-4 border-slate-700 shadow-xl relative">
                
                {/* Phone Speaker Notch */}
                <div className="w-28 h-4 bg-slate-950 rounded-b-xl mx-auto mb-2 flex items-center justify-center">
                  <div className="w-10 h-1 bg-slate-700 rounded-full" />
                </div>

                {/* Inner Screen */}
                <div className="rounded-[30px] bg-slate-50 border border-slate-200 p-4 min-h-[520px] flex flex-col justify-between text-xs">
                  
                  {/* Top Bar inside App */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-[11px]">SITINDAK</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                          Kelas XI-A
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-mono font-medium">
                        ⏱️ Mode Ujian Aktif
                      </span>
                    </div>

                    {/* Question Header */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                      <span className="font-medium">Soal 2 dari 10</span>
                      <span className="text-blue-700 font-semibold">Refleksi Bidang</span>
                    </div>

                    {/* Question Body */}
                    <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm mb-3">
                      <p className="text-slate-900 font-medium text-[11px] leading-relaxed">
                        Tentukan bayangan titik <MathRenderer math="A(4, -3)" /> jika dicerminkan terhadap sumbu <MathRenderer math="X" />!
                      </p>
                    </div>

                    {/* Tier 1 mini choice */}
                    <div className="space-y-1.5 mb-3">
                      <div className="p-2 rounded-lg bg-blue-50 border-2 border-blue-600 text-slate-900 flex items-center justify-between text-[10px] font-semibold">
                        <span>A. <MathRenderer math="A'(4, 3)" /></span>
                        <span className="text-[9px] text-blue-700 font-bold">Dipilih ✓</span>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px]">
                        <span>B. <MathRenderer math="A'(-4, -3)" /></span>
                      </div>
                    </div>

                    {/* Tier 2 mini prompt */}
                    <p className="text-[10px] text-slate-600 font-semibold mb-1">
                      Alasan memilih jawaban:
                    </p>
                    <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-[10px] mb-3">
                      "Pencerminan sumbu X hanya mengubah tanda ordinat y menjadi lawannya: (x, -y)."
                    </div>

                    {/* Tier 3 Confidence */}
                    <p className="text-[10px] text-slate-600 font-semibold mb-1">
                      Tingkat Keyakinan:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 rounded-lg bg-blue-600 text-white font-bold text-center text-[10px] shadow-sm">
                        YAKIN
                      </div>
                      <div className="p-2 rounded-lg bg-white text-slate-600 text-center text-[10px] border border-slate-200 font-medium">
                        Tidak Yakin
                      </div>
                    </div>
                  </div>

                  {/* Navigation Footer */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-[10px] font-medium">
                      &larr; Sebelumnya
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold text-[10px] shadow-sm">
                      Lanjut &rarr;
                    </button>
                  </div>

                </div>

                {/* Bottom Bar indicator */}
                <div className="w-24 h-1 bg-slate-600 rounded-full mx-auto mt-2" />
              </div>
            ) : (
              /* Desktop Mockup */
              <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-3 shadow-lg">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="text-[10px] text-slate-500 font-mono ml-2">
                    https://sitindak.id/asesmen/GEO-IXA
                  </span>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-5 min-h-[360px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-4">
                      <h4 className="text-xs font-bold text-slate-900">
                        SITINDAK — Ujian Mode Fokus (Siswa: Cantika Putri Utami)
                      </h4>
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-semibold px-2 py-0.5 rounded">
                        Peramban Terkunci
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 mb-3 shadow-sm">
                      Soal #02: Titik <MathRenderer math="A(4, -3)" /> dicerminkan terhadap sumbu <MathRenderer math="X" />.
                    </div>
                    <p className="text-xs text-slate-600 mb-2">
                      Pilihan Tingkat 1 (A–E) dan Alasan Tingkat 2 (A–E) tersusun rapi berdampingan dengan ukuran tulisan optimal untuk membaca rumus.
                    </p>
                  </div>
                  <div className="text-right">
                    <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm">
                      Kirim Jawaban & Dapatkan Pembahasan
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
};
