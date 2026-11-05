# Kelola Kelas di Dasbor

Setiap kelas yang diampu punya ruang kelola asesmennya sendiri di dasbor.

## Spesifikasi

### Tujuan
Memberi guru ruang kelola terpisah untuk setiap kelas yang diampu, sehingga asesmen, token, jadwal, dan status siswa tidak tercampur antar kelas.
### Selesai bila
- Guru melihat daftar kelas yang diampu di dasbor dan dapat membuka ruang kelola tiap kelas.
- Setiap ruang kelas menampilkan asesmen, token, jadwal, dan status pengerjaan siswa khusus kelas tersebut.
- Guru dapat menambah, mengganti nama, dan menghapus kelas langsung dari dasbor tanpa mengulang pendaftaran akun.
- Saat membuat asesmen, guru memilih satu kelas dari daftar kelas dan asesmen beserta tokennya terkait dengan kelas itu.

## Sub-fitur: Tambah & Atur Kelas

Guru menambah, mengganti nama, dan menghapus kelas yang diampu langsung dari dasbor tanpa mengulang pendaftaran akun.

### Tujuan
Memudahkan guru mengelola daftar kelas yang diampu langsung dari dasbor tanpa mengulang pendaftaran akun.
### Selesai bila
- Guru dapat menambah kelas baru dengan nama dan tingkat kelas, lalu kelas tersebut langsung muncul di daftar kelas.
- Guru dapat mengganti nama kelas dan menghapus kelas dari dasbor.
- Perubahan daftar kelas langsung terlihat pada pilihan kelas saat guru membuat asesmen.

## Sub-fitur: Dasbor per Kelas

Tiap kelas menampilkan asesmen, token, jadwal, dan status pengerjaan siswanya sendiri.

### Tujuan
Menjadikan setiap kelas sebagai ruang kelola tersendiri agar guru fokus pada asesmen, token, jadwal, dan status pengerjaan siswa kelas itu.
### Selesai bila
- Saat membuka satu kelas, guru melihat daftar asesmen, token, dan jadwal buka-tutup khusus kelas tersebut.
- Status pengerjaan siswa sudah atau belum menyelesaikan asesmen ditampilkan untuk kelas itu tanpa tercampur kelas lain.
- Guru dapat berpindah antar kelas dengan jelas dan data tiap kelas tetap terpisah.

## Sub-fitur: Pilih Kelas Saat Membuat Asesmen

Asesmen dan token dibuat untuk satu kelas yang dipilih dari daftar kelas guru.

### Tujuan
Memastikan asesmen dan token dibuat untuk satu kelas yang dipilih agar pelaksanaan serta hasilnya tepat sasaran.
### Selesai bila
- Formulir pembuatan asesmen menampilkan pilihan kelas dari daftar kelas guru dan mewajibkan satu kelas dipilih.
- Asesmen dan token yang dibuat hanya terkait dengan kelas terpilih dan muncul di ruang kelas tersebut.
- Bila guru belum memiliki kelas, guru diarahkan untuk menambah kelas terlebih dahulu sebelum membuat asesmen.

## Task

### 1. Bangun halaman dasbor kelas dengan data tiruan

### 2. Buat komponen kelola daftar kelas

### 3. Tampilkan asesmen token jadwal dan status siswa

### 4. Buat navigasi dan state terpisah antar kelas

### 5. Buat form pilih kelas saat buat asesmen

### 6. Poles tampilan dasbor kelas dan empty state

### 7. Buat tabel kelas dan migrasinya

### 8. Buat API CRUD kelas untuk guru

### 9. Buat skema relasi asesmen token ke kelas

### 10. Buat API asesmen token jadwal dan status siswa

### 11. Buat endpoint buat asesmen dengan kelas wajib
