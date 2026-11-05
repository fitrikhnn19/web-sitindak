import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SITINDAK — Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi",
  description:
    "Aplikasi asesmen diagnostik three-tier matematika berbasis web. Membedakan siswa yang sudah paham, miskonsepsi, dan belum paham secara otomatis, lengkap dengan peta materi prasyarat matematika.",
  keywords: [
    "SITINDAK",
    "asesmen diagnostik",
    "three tier test",
    "miskonsepsi matematika",
    "transformasi geometri",
    "peta materi prasyarat",
    "kurikulum merdeka",
    "analisis butir soal",
  ],
  authors: [{ name: "SITINDAK Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-brand-100 selection:text-brand-900">
        {children}
      </body>
    </html>
  );
}

