# SITINDAK (Sistem Tindak Lanjut Diagnostik Asesmen Konsepsi)

Frontend web platform untuk asesmen diagnostik **Three-Tier** matematika, dirancang khusus untuk membedakan siswa yang **Sudah Paham**, mengalami **Miskonsepsi**, dan **Belum Paham** pada materi prasyarat Transformasi Geometri, serta secara otomatis menyajikan peta materi prasyarat dan laporan komprehensif tanpa hitung manual.

---

## 🌟 Fitur Utama (Berdasarkan PRD)

1. **Diagnostik Tiga Tingkat (Three-Tier CRI)**
   - **Tingkat 1**: Pertanyaan konten matematika dengan pilihan A–E dan rumus KaTeX.
   - **Tingkat 2**: Alasan ilmiah di balik jawaban dengan pilihan A–E.
   - **Tingkat 3**: Derajat keyakinan (*Yakin* atau *Tidak Yakin* tanpa pilihan A–E sesuai spesifikasi PRD).
   - **Matriks Klasifikasi**: Memisahkan tebakan beruntung (*lucky guess*) dari miskonsepsi murni.

2. **Simulator Diagnostik Interaktif**
   - Pengunjung dapat langsung mencoba butir soal prasyarat refleksi $y = -x$, memilih jawaban, alasan, dan keyakinan, serta melihat evaluasi mesin diagnosa secara real-time.

3. **Peta Materi Prasyarat Geometri (Prerequisite Mapping)**
   - Menampilkan status kesiapan siswa sebelum masuk materi transformasi geometri.
   - Memetakan tingkat kebutuhan pengulangan (*Tinggi*, *Sedang*, *Aman*) untuk tiap materi dasar (Sistem Koordinat Kartesius, Operasi Aljabar Negatif, Sumbu Simetri, dsb.) beserta rekomendasi rencana tindak lanjut guru.

4. **Dasbor Guru Cerdas**
   - **Profil Pemahaman Kelas**: Matriks status per butir per siswa (Paham, Miskonsepsi, Belum Paham).
   - **Analisis Kualitas Soal**: Tingkat kesukaran ($P$), daya pembeda ($D$), validitas & reliabilitas ($r$) dengan rekomendasi perbaikan butir otomatis.
   - **Kelola Asesmen & Token**: Satu token per kelas dengan batasan kuota pemakaian (`max_uses`) dan masa berlaku.
   - **Deteksi Kecurangan**: Catatan pemantauan perpindahan tab dan mode fokus ujian.

5. **Pengalaman Siswa Nyaman (HP & Laptop)**
   - Masuk instan hanya dengan **Token Kelas + Nama Siswa** (tanpa ribet akun/email/password).
   - Tampilan responsif optimal untuk layar *smartphone*.
   - Umpan balik privat seketika: begitu klik kirim, siswa langsung mendapatkan pembahasan jawaban benar dan rekomendasi materi prasyarat yang wajib dipelajari ulang secara mandiri.

6. **Gerbang Akses Interaktif**
   - Modal simulasi masuk token siswa dengan sampel token (`GEO-IXA`, `TRANS-9B`, `EXPIRED-TEST`).
   - Modal simulasi portal guru (Masuk & Daftar Akun baru sesuai spesifikasi PRD Fase 4).

---

## 🚀 Menjalankan Aplikasi

Pastikan Node.js (v18+) sudah terpasang di komputer Anda.

```bash
# Jalankan server pengembangan lokal
npm run dev

# Buka di peramban
http://localhost:3000
```

Untuk membangun versi produksi:
```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack Frontend

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Matematika & Rumus**: KaTeX (`katex`)
- **Ikon**: Lucide React
- **Komponen & Desain**: Responsive, dark theme beraksen edukatif modern

