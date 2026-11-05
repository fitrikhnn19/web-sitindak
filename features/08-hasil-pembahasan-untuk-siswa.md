# Hasil & Pembahasan untuk Siswa

Setelah mengirim asesmen, siswa langsung mendapat umpan balik sebagai bahan refleksi belajar.

## Spesifikasi

### Tujuan
Memberi siswa umpan balik langsung setelah mengirim asesmen, sehingga mereka tahu hasil pengerjaannya dan apa yang perlu dipelajari ulang tanpa melihat data siswa lain.

### Selesai bila
- Setelah menekan kirim, siswa langsung dibawa ke halaman hasil yang menampilkan ringkasan pengerjaannya sendiri.
- Halaman hasil menampilkan tiap butir beserta status pemahamannya (sudah paham / miskonsepsi / belum paham).
- Tiap butir menampilkan jawaban yang benar beserta alasannya serta materi prasyarat yang diuji.
- Halaman hasil tidak menampilkan skor maupun jawaban siswa lain.
- Siswa dapat membuka kembali halaman hasil selama tautan/sesi pengerjaannya masih berlaku.

## Sub-fitur: Ringkasan Hasil Pengerjaan

Siswa melihat hasil pengerjaannya sendiri (jumlah benar dan status pemahaman per butir) tanpa melihat data siswa lain.

### Tujuan
Menampilkan ringkasan hasil pengerjaan siswa sendiri agar ia langsung tahu capaian dan status pemahaman tiap butirnya.

### Selesai bila
- Halaman hasil menampilkan jumlah jawaban benar dari total butir yang dikerjakan siswa.
- Tiap butir ditandai status pemahaman: sudah paham, miskonsepsi, atau belum paham.
- Halaman hanya menampilkan data pengerjaan siswa itu sendiri, tanpa skor atau jawaban siswa lain.

## Sub-fitur: Pembahasan Jawaban Benar

Tiap butir menampilkan jawaban yang benar beserta alasannya agar siswa tahu letak kesalahannya.

### Tujuan
Menunjukkan jawaban yang benar beserta alasannya pada tiap butir agar siswa tahu letak kesalahannya.

### Selesai bila
- Tiap butir menampilkan jawaban benar tingkat 1 dan alasan benar tingkat 2 sesuai yang ditulis guru.
- Pembahasan menampilkan pilihan jawaban siswa sebagai pembanding sehingga terlihat perbedaannya.
- Rumus dan gambar pada pembahasan tampil rapi di HP maupun laptop.

## Sub-fitur: Kaitan ke Materi Prasyarat

Pembahasan menandai materi prasyarat yang diuji butir tersebut sehingga siswa tahu bagian mana yang perlu dipelajari ulang.

### Tujuan
Menandai materi prasyarat yang diuji tiap butir agar siswa tahu bagian mana yang perlu dipelajari ulang.

### Selesai bila
- Tiap butir pada halaman hasil menampilkan label materi prasyarat yang diuji.
- Siswa dapat melihat daftar materi prasyarat yang perlu dipelajari ulang dari butir yang belum dipahaminya.

## Sub-fitur: Bahan Refleksi

Siswa dapat membaca ulang halaman hasil ini selama tautan atau sesi pengerjaannya masih berlaku.

### Tujuan
Memungkinkan siswa membaca ulang halaman hasilnya kapan saja selama akses masih berlaku sebagai bahan refleksi.

### Selesai bila
- Siswa dapat membuka kembali halaman hasil tanpa mengerjakan ulang asesmen, selama tautan/sesi pengerjaannya masih berlaku.
- Saat akses sudah tidak berlaku, halaman menampilkan pemberitahuan yang jelas bahwa hasil tidak dapat dibuka lagi.
- Halaman hasil yang dibuka ulang tetap menampilkan data pengerjaan siswa sendiri.

## Task

### 1. Bangun halaman hasil asesmen data tiruan

### 2. Tampilkan ringkasan benar dan status pemahaman

### 3. Tampilkan pembahasan jawaban benar dan jawaban siswa

### 4. Tambahkan label materi prasyarat tiap butir

### 5. Tangani akses ulang dan hasil kedaluwarsa

### 6. Rapikan responsif rumus dan gambar pembahasan

### 7. Buat skema hasil pengerjaan dan status pemahaman

### 8. Buat endpoint hasil asesmen siswa sendiri

### 9. Buat endpoint pembahasan butir dan materi prasyarat

### 10. Validasi akses dan kedaluwarsa tautan hasil

### 11. Buat hasil otomatis saat asesmen dikirim

### 12. Batasi query hasil hanya milik siswa
