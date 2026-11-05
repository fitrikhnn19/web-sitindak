"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export const TestimonialsFAQ: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "Apa itu SITINDAK dan bagaimana janji utamanya?",
      a: "SITINDAK (Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi) adalah aplikasi web diagnostik berbasis Three-Tier. Janji utamanya ada dua: membedakan 'sudah paham', 'miskonsepsi', dan 'belum paham' secara otomatis, serta langsung menerjemahkan hasil asesmen menjadi peta materi prasyarat matematika dan laporan per siswa tanpa hitung manual.",
    },
    {
      q: "Mengapa asesmen ini berfokus pada materi prasyarat Transformasi Geometri?",
      a: "Transformasi Geometri (translasi, refleksi, rotasi, dilatasi) adalah materi yang sangat rentan miskonsepsi jika bekal awal siswa rapuh. Melalui SITINDAK, guru dapat mendeteksi apakah kelemahan siswa terletak pada sistem koordinat kartesius, operasi aljabar bilangan bulat negatif, simetri bidang, atau faktor skala sebelum materi inti diajarkan.",
    },
    {
      q: "Bagaimana siswa masuk jika tidak memiliki akun atau email?",
      a: "Siswa TIDAK memerlukan akun atau email. Guru cukup membuat asesmen dan membagikan satu kode token kelas (misal: GEO-IXA). Siswa membuka situs di HP atau laptop, memasukkan token dan nama lengkap, lalu langsung mulai mengerjakan. Kuota pemakaian dan masa berlaku token dikontrol otomatis oleh server.",
    },
    {
      q: "Bagaimana algoritma membedakan tebakan beruntung dari miskonsepsi murni?",
      a: "Melalui integrasi 3 tingkat: Tingkat 1 (jawaban A–E), Tingkat 2 (alasan ilmiah A–E), dan Tingkat 3 (keyakinan Yakin / Tidak Yakin). Siswa yang menjawab benar secara tebakan acak biasanya memilih 'Tidak Yakin' atau memilih alasan yang keliru. Sebaliknya, siswa yang memilih alasan salah dengan tingkat keyakinan 'Yakin' diklasifikasikan sebagai miskonsepsi.",
    },
    {
      q: "Bagaimana SITINDAK memantau kejujuran pengerjaan asesmen siswa?",
      a: "Layar pengerjaan siswa berada dalam mode fokus ujian. Sistem mendeteksi peristiwa saat siswa berpindah tab di peramban atau keluar dari halaman aplikasi untuk mencari contekan, dan secara otomatis mencatat frekuensi serta durasinya pada Laporan Kejujuran di dasbor guru.",
    },
    {
      q: "Apakah hasil asesmen bisa diekspor untuk arsip kurikulum?",
      a: "Ya, tersedia fitur 'Unduh Hasil' di dasbor guru untuk mengekspor rekapitulasi nilai, status pemahaman tiap siswa, peta kebutuhan pengulangan materi prasyarat, serta analisis kualitas soal ke dalam format lembar kerja Excel dan dokumen cetak.",
    },
  ];

  return (
    <section id="faq" className="py-20 relative bg-white border-t border-slate-200 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Pertanyaan yang Sering Diajukan</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Tanya Jawab Seputar SITINDAK
          </h2>
          <p className="mt-3 text-sm text-slate-600">
            Pelajari lebih lanjut mengenai cara kerja asesmen diagnostik three-tier dan implementasinya di sekolah.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-xl bg-white border border-slate-200 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-900 hover:text-blue-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180 text-blue-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
