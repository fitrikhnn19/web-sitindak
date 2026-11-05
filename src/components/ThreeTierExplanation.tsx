"use client";

import React from "react";
import { 
  Layers, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Zap, 
  ShieldAlert, 
  Compass, 
  ArrowRight
} from "lucide-react";

export const ThreeTierExplanation: React.FC = () => {
  return (
    <section id="fitur" className="py-24 relative bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Fondasi Ilmiah Tiga Tingkat</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Mengapa Pilihan Ganda Biasa Tidak Cukup?
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Dalam matematika, siswa yang menjawab benar belum tentu paham konsepnya. Sebaliknya, siswa yang salah mungkin memiliki pola berpikir keliru yang konsisten (miskonsepsi). SITINDAK membedahnya menjadi tiga lapis terstruktur.
          </p>
        </div>

        {/* 3 Tier Cards Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          
          {/* Tier 1 Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-7 hover:border-blue-400 hover:shadow-md transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-extrabold text-lg mb-6 group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all">
              1
            </div>
            <div className="text-xs uppercase font-bold tracking-wider text-blue-600 mb-1">
              Tingkat 1
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Pertanyaan Konten (A–E)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Menguji hasil hitungan atau pilihan jawaban matematis langsung. Siswa memilih 1 dari 5 pilihan (A–E) yang dilengkapi rumus LaTeX rapi.
            </p>
            <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <strong className="text-slate-700 font-semibold">Tujuan:</strong> Mengukur penguasaan prosedural dan komputasi awal.
            </div>
          </div>

          {/* Tier 2 Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-7 hover:border-indigo-400 hover:shadow-md transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-extrabold text-lg mb-6 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              2
            </div>
            <div className="text-xs uppercase font-bold tracking-wider text-indigo-600 mb-1">
              Tingkat 2
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Alasan Berpikir (A–E)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Menguji alasan ilmiah di balik jawaban tingkat 1. Menampilkan 5 argumen konseptual untuk mendeteksi cara berpikir siswa.
            </p>
            <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <strong className="text-slate-700 font-semibold">Tujuan:</strong> Membedah kerangka konsep dan menangkap miskonsepsi tersembunyi.
            </div>
          </div>

          {/* Tier 3 Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-7 hover:border-cyan-400 hover:shadow-md transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700 font-extrabold text-lg mb-6 group-hover:scale-105 group-hover:bg-cyan-600 group-hover:text-white transition-all">
              3
            </div>
            <div className="text-xs uppercase font-bold tracking-wider text-cyan-700 mb-1">
              Tingkat 3
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Derajat Keyakinan (CRI)
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Dua pilihan tegas: <strong className="text-slate-900">Yakin</strong> atau <strong className="text-slate-900">Tidak Yakin</strong> (tanpa pilihan A–E sesuai PRD). Membedakan pengetahuan mantap dari tebakan acak.
            </p>
            <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <strong className="text-slate-700 font-semibold">Tujuan:</strong> Menegaskan validitas diagnosa keyakinan siswa.
            </div>
          </div>

        </div>

        {/* Comparison Section: Conventional vs SITINDAK */}
        <div id="keunggulan" className="rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-10 shadow-sm scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Perbandingan: Asesmen Biasa vs SITINDAK
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Lihat bagaimana SITINDAK mengubah data asesmen biasa menjadi tindak lanjut yang dapat langsung diimplementasikan guru di kelas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Conventional Box */}
            <div className="rounded-xl bg-white border border-rose-200 p-6 shadow-sm">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">Asesmen Pilihan Ganda Konvensional</h4>
                  <p className="text-xs text-slate-500">Metode 1-Tingkat (Benar / Salah)</p>
                </div>
              </div>

              <ul className="mt-5 space-y-3.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Siswa yang <strong>menebak beruntung</strong> tercatat sebagai siswa yang "paham".</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Tidak membedakan antara "belum belajar" dan "miskonsepsi konsep mendalam".</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Guru harus memeriksa satu per satu dan menganalisis manual berjam-jam.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Siswa hanya menerima angka nilai (misal: 60/100) tanpa tahu letak akar kesalahannya.</span>
                </li>
              </ul>
            </div>

            {/* SITINDAK Box */}
            <div className="rounded-xl bg-white border-2 border-blue-500 p-6 shadow-sm relative">
              <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700 uppercase">
                Solusi Modern
              </div>
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-900">SITINDAK Three-Tier Diagnostic</h4>
                  <p className="text-xs text-slate-500">Metode 3-Tingkat + Peta Prasyarat Matematika</p>
                </div>
              </div>

              <ul className="mt-5 space-y-3.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Mendeteksi secara tepat 3 kategori: <strong>Sudah Paham</strong>, <strong>Miskonsepsi</strong>, atau <strong>Belum Paham</strong>.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Memfilter tebakan beruntung dengan verifikasi tingkat alasan dan keyakinan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Analisis otomatis <strong>0 detik</strong> selesai di server, langsung tersaji di dasbor guru.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Siswa langsung menerima pembahasan rinci dan peta materi prasyarat yang wajib dipelajari ulang.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
