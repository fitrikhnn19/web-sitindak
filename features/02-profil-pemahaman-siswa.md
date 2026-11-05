# Profil Pemahaman Siswa

Guru langsung melihat hasil asesmen tanpa menghitung manual, lengkap dengan status pemahaman tiap siswa.

## Spesifikasi

### Tujuan
Memberi guru gambaran langsung hasil asesmen tiap siswa dan status pemahamannya, sehingga guru tidak perlu menghitung manual saat menyusun pembelajaran lanjutan.
### Selesai bila
- Guru dapat membuka halaman hasil untuk satu asesmen dan melihat daftar siswa yang mengerjakan.
- Setiap siswa menampilkan status pemahaman per butir soal dengan label **sudah paham**, **miskonsepsi**, atau **belum paham**.
- Guru dapat melihat peta materi prasyarat yang perlu diulang berdasarkan hasil asesmen.
- Guru dapat membuka ringkasan rapi per siswa dan membacanya kembali kapan saja.
- Guru dapat mengunduh hasil asesmen untuk dibagikan atau diarsipkan.

## Sub-fitur: Status Pemahaman per Butir

Guru melihat tiap butir soal: siswa sudah paham, mengalami miskonsepsi, atau belum paham.

### Tujuan
Menunjukkan kepada guru status pemahaman setiap siswa pada tiap butir soal agar bagian yang sudah kuat dan bermasalah langsung terlihat.
### Selesai bila
- Tiap butir soal per siswa menampilkan satu label jelas: **sudah paham**, **miskonsepsi**, atau **belum paham**.
- Guru dapat melihat butir soal beserta jawaban siswa dan statusnya dalam satu tampilan yang mudah dipindai.
- Status yang sama terbaca konsisten saat guru membuka butir tersebut dari laporan siswa.

## Sub-fitur: Peta Materi Prasyarat

Guru mengetahui materi prasyarat mana yang perlu diulang sebelum masuk materi transformasi geometri.

### Tujuan
Membantu guru mengetahui materi prasyarat mana yang perlu diulang sebelum masuk transformasi geometri berdasarkan hasil asesmen.
### Selesai bila
- Halaman hasil menampilkan daftar materi prasyarat yang diuji pada asesmen.
- Tiap materi prasyarat ditandai tingkat kebutuhan pengulangan berdasarkan banyaknya siswa yang belum paham atau miskonsepsi.
- Guru dapat melihat butir soal yang terkait dengan tiap materi prasyarat.

## Sub-fitur: Laporan Tiap Siswa

Satu ringkasan rapi per siswa yang bisa dibaca ulang kapan saja sebagai dasar menyusun pembelajaran.

### Tujuan
Menyediakan satu ringkasan rapi per siswa sebagai dasar menyusun pembelajaran yang sesuai dan dapat dibaca ulang kapan saja.
### Selesai bila
- Guru dapat membuka laporan satu siswa dari daftar siswa pada asesmen.
- Laporan memuat identitas siswa, jumlah jawaban benar, status pemahaman per butir, dan materi prasyarat yang perlu dipelajari ulang.
- Laporan yang sama dapat dibuka kembali tanpa berubah selama data asesmen tersimpan.

## Sub-fitur: Unduh Hasil

Guru dapat mengunduh hasil asesmen untuk dibagikan atau diarsipkan.

### Tujuan
Memudahkan guru membagikan atau mengarsipkan hasil asesmen dalam bentuk berkas unduhan.
### Selesai bila
- Tersedia tombol **Unduh Hasil** pada halaman hasil asesmen.
- Berkas hasil memuat ringkasan per siswa dan status pemahaman per butir sesuai yang tampil di layar.
- Nama berkas mencantumkan judul asesmen dan tanggal unduh agar mudah dikenali.

## Task

### 1. Bangun halaman hasil asesmen dengan data tiruan

### 2. Tampilkan tabel status pemahaman per butir siswa

### 3. Buat rincian butir dengan jawaban dan status

### 4. Tambahkan panel peta materi prasyarat asesmen

### 5. Buat halaman laporan pemahaman per siswa

### 6. Hubungkan daftar siswa ke laporan per siswa

### 7. Tambahkan tombol unduh hasil dan berkas tiruan

### 8. Buat service klasifikasi status pemahaman per butir

### 9. Buat endpoint status pemahaman per butir

### 10. Buat API peta materi prasyarat asesmen

### 11. Buat endpoint laporan pemahaman per siswa

### 12. Buat endpoint ekspor hasil asesmen
