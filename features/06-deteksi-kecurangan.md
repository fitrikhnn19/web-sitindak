# Deteksi Kecurangan

Guru mendapat tanda saat siswa mengerjakan dengan cara yang tidak wajar.

## Spesifikasi

### Tujuan
Memberi guru tanda dan bukti saat siswa mengerjakan asesmen dengan cara tidak wajar, agar hasil asesmen lebih dapat dipercaya.
### Selesai bila
- Selama asesmen, siswa berada dalam mode fokus dan upaya keluar dari halaman asesmen tercatat.
- Setiap kejadian mencurigakan tersimpan dengan jenis kejadian dan waktunya pada siswa yang tepat.
- Guru dapat membuka laporan kecurangan per siswa setelah asesmen selesai.
- Laporan hanya dapat dilihat oleh guru pemilik kelas/asesmen.

## Sub-fitur: Pantau Aktivitas Mencurigakan

Sistem mencatat saat siswa berpindah tab atau meninggalkan halaman asesmen.

### Tujuan
Mencatat saat siswa berpindah tab atau meninggalkan halaman asesmen selama pengerjaan.
### Selesai bila
- Setiap perpindahan tab atau keluar dari halaman asesmen tercatat sebagai kejadian mencurigakan.
- Tiap catatan menampilkan jenis kejadian dan waktu terjadinya.
- Pencatatan tidak menghentikan siswa dalam menjawab atau mengirim asesmen.

## Sub-fitur: Mode Fokus Ujian

Layar asesmen dibuat fokus sehingga siswa sulit membuka bantuan dari luar.

### Tujuan
Membuat layar asesmen tetap fokus sehingga siswa sulit membuka bantuan dari luar selama ujian.
### Selesai bila
- Saat asesmen dimulai, tampilan berubah ke mode fokus tanpa menu navigasi keluar.
- Jika siswa mencoba meninggalkan halaman asesmen, muncul peringatan bahwa aktivitasnya tercatat.
- Mode fokus tetap berjalan sampai siswa mengirim jawaban, lalu berakhir setelah asesmen terkirim.

## Sub-fitur: Laporan Kecurangan

Guru menerima daftar kejadian mencurigakan per siswa setelah asesmen selesai.

### Tujuan
Menampilkan daftar kejadian mencurigakan per siswa kepada guru setelah asesmen selesai.
### Selesai bila
- Guru melihat daftar siswa beserta jumlah dan rincian kejadian mencurigakan yang tercatat.
- Tiap kejadian menampilkan jenis, waktu, dan siswa terkait.
- Siswa yang tidak memiliki kejadian tetap ditandai jelas agar mudah dibedakan.
- Laporan hanya dapat diakses guru pemilik asesmen.

## Task

### 1. Bangun halaman asesmen mode fokus

### 2. Implementasi pencatatan pindah tab siswa

### 3. Bangun halaman laporan kecurangan guru

### 4. Buat tabel kejadian kecurangan & migrasi

### 5. Buat endpoint catat kejadian kecurangan

### 6. Buat endpoint laporan kecurangan asesmen

### 7. Terapkan otorisasi guru pemilik laporan
