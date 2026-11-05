# Kelola Asesmen & Token

Guru menyiapkan asesmen, membagikan satu token kelas dengan kuota pemakaian, dan memantau siapa yang sudah mengerjakan.

## Spesifikasi

### Tujuan
Membantu guru menyiapkan asesmen, membagikan satu token kelas dengan kuota pemakaian, dan memantau pengerjaan siswa dari satu tempat agar pelaksanaan asesmen terkendali.

### Cakupan
- Membuat asesmen: judul, daftar soal, dan kelas tujuan; asesmen muncul di dasbor kelas tersebut.
- Membuat **satu token per kelas** untuk pelaksanaan asesmen itu, dengan kuota pemakaian sejumlah siswa kelas dan masa berlaku.
- Mengatur jadwal buka dan tutup asesmen.
- Memantau siswa yang sudah dan belum menyelesaikan asesmen.
- Status token dan jadwal ditampilkan jelas (aktif/tidak aktif, buka/tutup, sisa kuota).

### Aturan token
- Kode token dibagikan sekali ke grup kelas, bukan satu kode per siswa.
- Setiap siswa yang berhasil masuk mengurangi sisa kuota satu kali; siswa yang sama yang kembali tidak mengurangi kuota lagi dan melanjutkan pengerjaannya.
- Token berhenti berlaku bila dinonaktifkan, masa berlaku lewat, atau kuota habis; token tidak dapat dipakai untuk kelas atau asesmen lain.

### Selesai bila
- Guru dapat membuat asesmen dengan judul, daftar soal, dan kelas tujuan, lalu asesmen muncul di dasbor kelas tersebut.
- Guru dapat membuat dan membagikan satu token kelas per pelaksanaan asesmen, serta melihat kode, masa berlaku, dan sisa kuotanya.
- Guru dapat mengubah kuota dan masa berlaku atau menonaktifkan token, dan status barunya langsung terlihat.
- Guru dapat mengatur jadwal buka dan tutup asesmen; di luar jadwal siswa tidak bisa mengerjakan.
- Guru dapat melihat daftar siswa yang sudah dan belum menyelesaikan asesmen pada kelas tersebut.
- Status token dan jadwal terlihat jelas (aktif/tidak aktif, buka/tutup, kuota habis) sehingga guru tahu kapan asesmen bisa dipakai.

## Sub-fitur: Buat Asesmen

Guru menentukan judul, daftar soal, dan kelas yang akan mengerjakan.

### Tujuan
Guru membuat asesmen baru untuk satu kelas dengan menentukan judul dan daftar soal yang akan dikerjakan siswa.
### Selesai bila
- Guru dapat mengisi judul asesmen dan memilih satu kelas dari daftar kelas yang diampu.
- Guru dapat memilih soal dari kumpulan soal dan mengatur urutan tampilnya.
- Setelah disimpan, asesmen muncul di dasbor kelas yang dipilih dengan status awal yang jelas (mis. draf).

## Sub-fitur: Token untuk Siswa

Guru membuat satu token per kelas untuk satu pelaksanaan asesmen; masa berlaku dan kuota pemakaian sejumlah siswa ditetapkan saat pembuatan.

### Tujuan
Guru membuat satu token untuk satu kelas pada satu pelaksanaan asesmen agar hanya siswa kelas tersebut yang dapat masuk, dengan kuota pemakaian sejumlah siswa di kelas itu.

### Bentuk token
- Satu token mewakili **satu kelas pada satu pelaksanaan asesmen**, bukan satu token per siswa.
- Token berupa kode pendek yang mudah dibaca dan diketik ulang (huruf besar, tanpa karakter ambigu).
- Kuota pemakaian (`max_uses`) diisi otomatis sejumlah siswa di kelas saat token dibuat, dan guru dapat menyesuaikannya (misalnya untuk siswa tambahan).
- Token punya masa berlaku (`expires_at`) dan status aktif (`is_active`).

### Perilaku
- Kode token dibagikan sekali ke grup kelas; semua siswa memakai kode yang sama.
- Setiap siswa yang berhasil masuk menaikkan `used_count` tepat satu; siswa yang sama tidak menambah kuota saat memuat ulang halaman atau kembali ke asesmen.
- Siswa yang sudah pernah masuk tetap dapat **melanjutkan** pengerjaannya selama asesmen masih dibuka, walaupun kuota sudah habis.
- Token berhenti berlaku bila `is_active = false`, `expires_at` terlewat, atau `used_count >= max_uses`.
- Guru dapat menonaktifkan token kapan pun; siswa baru langsung tidak bisa masuk, sedangkan pengerjaan yang sudah berjalan tetap dapat diselesaikan atau ditutup lewat jadwal.

### Selesai bila
- Guru dapat membuat satu token untuk sebuah asesmen dan kelas, melihat kode yang bisa dibagikan, serta melihat sisa kuota (`max_uses` - `used_count`) dan masa berlakunya.
- Guru dapat mengubah kuota dan masa berlaku serta menonaktifkan token; perubahan berlaku untuk siswa yang masuk setelahnya.
- Token hanya berlaku untuk asesmen dan kelas terkait, dan siswa dari kelas lain tidak bisa memakainya.
- Guru dapat melihat status tiap token: aktif, belum dibuka, kedaluwarsa, dinonaktifkan, atau kuota habis.
- Dua siswa yang masuk hampir bersamaan tidak dapat memakai kuota terakhir secara bersamaan (klaim kuota aman dari balapan).

## Sub-fitur: Jadwal Buka-Tutup

Guru mengatur kapan asesmen mulai dibuka dan ditutup.

### Tujuan
Guru mengatur waktu mulai dan berakhirnya asesmen agar siswa hanya bisa mengerjakan pada rentang waktu yang ditentukan.
### Selesai bila
- Guru dapat menetapkan tanggal dan jam buka serta tutup asesmen.
- Siswa yang mencoba masuk sebelum jadwal buka atau setelah jadwal tutup tidak dapat mengerjakan dan melihat pesan yang jelas.
- Guru melihat status jadwal asesmen (mis. belum dibuka, sedang berjalan, sudah ditutup) di dasbor.

## Sub-fitur: Status Pengerjaan

Guru melihat daftar siswa yang sudah atau belum menyelesaikan asesmen.

### Tujuan
Guru memantau daftar siswa yang sudah atau belum menyelesaikan asesmen tanpa menghitung manual.
### Selesai bila
- Guru dapat melihat daftar siswa di kelas tujuan beserta status sudah/belum menyelesaikan asesmen.
- Status terbarui otomatis setelah siswa mengirim jawaban, tanpa guru memuat ulang manual.
- Guru dapat melihat jumlah siswa yang sudah dan belum menyelesaikan sebagai ringkasan.

## Task

### 1. Bangun halaman kelola asesmen dengan data tiruan

### 2. Buat form asesmen dengan pemilih soal tiruan

### 3. Buat panel token siswa dengan data tiruan

### 4. Buat pengaturan jadwal buka-tutup asesmen

### 5. Buat daftar status pengerjaan siswa tiruan

### 6. Tambahkan indikator status token dan jadwal tiruan

### 7. Buat skema database asesmen token dan jadwal

### 8. Buat API pengelolaan asesmen dan urutan soal

### 9. Buat API token kelas (kuota pemakaian) dan validasinya

Endpoint pembuatan/penonaktifan token dan validasi masuk siswa. Satu token = satu kelas pada satu pelaksanaan asesmen. Kuota `max_uses` diisi sejumlah siswa kelas, `used_count` naik satu per siswa baru yang berhasil masuk (idempoten per attempt), bersama validasi `is_active`, `expires_at`, dan jadwal buka-tutup asesmen. Klaim kuota harus aman dari balapan (kuota terakhir tidak terpakai dua kali). Respons gagal tidak memuat data token atau asesmen.

**Prompt:**

```
Buat API token kelas pada plan ini.

Konteks skema (`tokens`): `code` (unik), `assessment_id`, `class_id`, `is_active`, `max_uses`, `used_count`, `expires_at`.

Yang perlu dibuat:
1. Endpoint pembuatan token untuk satu asesmen + satu kelas. Isi `max_uses` otomatis sejumlah siswa di kelas itu, izinkan guru menyesuaikannya.
2. Endpoint daftar token beserta status turunan: aktif / belum dibuka / kedaluwarsa / dinonaktifkan / kuota habis, plus sisa kuota (`max_uses - used_count`).
3. Endpoint penonaktifan token (`is_active = false`) dan pengubahan kuota / masa berlaku.
4. Validasi masuk siswa: cek token dikenal -> aktif -> belum kedaluwarsa -> kuota tersisa -> jadwal asesmen (`opens_at`/`closes_at`/`status`). Tiap kegagalan mengembalikan pesan berbeda tanpa membocorkan data token atau asesmen.
5. Penambahan `used_count` dilakukan satu kali per attempt baru (idempoten: muat ulang atau kembali ke halaman tidak menambah kuota; attempt yang sudah ada dilanjutkan). Gunakan transaksi/penguncian agar dua siswa tidak sama-sama mengambil kuota terakhir.
6. Batasi percobaan validasi per menit per IP untuk mencegah penebakan kode.

Token bukan sekali pakai per siswa: batasnya adalah kuota pemakaian sejumlah siswa kelas ditambah masa berlaku.
```

### 10. Buat API jadwal buka-tutup dan validasi akses

### 11. Buat API status pengerjaan dan ringkasan siswa

### 12. Hubungkan submit jawaban ke status penyelesaian
