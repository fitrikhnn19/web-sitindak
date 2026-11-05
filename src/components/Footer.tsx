"use client";

import React from "react";
import { Compass, ArrowUp } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                SITINDAK
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi
            </p>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              Platform asesmen three-tier matematika berbasis web untuk membedakan pemahaman utuh, miskonsepsi, dan keraguan siswa pada materi prasyarat matematika.
            </p>
          </div>

          {/* Quick Nav */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Navigasi Halaman
            </h4>
            <ul className="space-y-2">
              <li><a href="#beranda" className="text-slate-600 hover:text-blue-600 transition-colors">Beranda</a></li>
              <li><a href="#fitur" className="text-slate-600 hover:text-blue-600 transition-colors">Metode 3-Tingkat</a></li>
              <li><a href="#keunggulan" className="text-slate-600 hover:text-blue-600 transition-colors">Keunggulan SITINDAK</a></li>
              <li><a href="#alur-siswa" className="text-slate-600 hover:text-blue-600 transition-colors">Alur Pengerjaan Siswa</a></li>
              <li><a href="#faq" className="text-slate-600 hover:text-blue-600 transition-colors">Tanya & Jawab (FAQ)</a></li>
            </ul>
          </div>

          {/* Standards & Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Spesifikasi Ilmiah
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>Three-Tier Diagnostic Instrument</li>
              <li>Certainty of Response Index (CRI)</li>
              <li>Analisis Psikometrik Klasik (P, D, r)</li>
              <li>LaTeX Mathematics Rendering (KaTeX)</li>
              <li>Mode Fokus Ujian (Anti-Cheating)</li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-center sm:text-left">
            &copy; 2026 SITINDAK — Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi. Hak cipta dilindungi undang-undang.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors font-medium"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
};
