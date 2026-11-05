# Akun Guru

Guru mendaftar sekali lalu bisa masuk kembali untuk mengelola asesmennya.

## Spesifikasi

### Tujuan
Guru memiliki akun pribadi agar dapat masuk kembali dengan aman dan mengelola asesmennya tanpa mengulang pendaftaran.
### Selesai bila
- Guru dapat membuat akun baru hanya dengan nama, email, dan kata sandi, lalu langsung masuk ke dasbor.
- Guru dapat masuk dan keluar kapan saja dengan aman; setelah keluar, halaman akun tidak bisa dibuka tanpa masuk lagi.
- Guru dapat melengkapi nama, sekolah, dan profil setelah akun aktif, serta memulihkan akses saat lupa kata sandi.
- Daftar kelas yang diampu tidak diminta saat mendaftar dan dikelola terpisah di dasbor.

## Sub-fitur: Daftar Akun Guru

Guru membuat akun baru sebagai langkah pertama memakai aplikasi.

### Tujuan
Guru membuat akun baru sebagai langkah pertama memakai aplikasi.
### Selesai bila
- Form pendaftaran hanya meminta nama, email, dan kata sandi, dengan petunjuk isian yang jelas.
- Setelah pendaftaran berhasil, guru langsung masuk ke dasbor tanpa diminta mengisi sekolah atau kelas.
- Bila email sudah dipakai atau isian tidak valid, muncul pesan kesalahan yang mudah dipahami dan data isian tidak hilang.

## Sub-fitur: Masuk & Keluar

Guru masuk ke akunnya dan keluar dengan aman setelah selesai.

### Tujuan
Guru dapat masuk kembali ke akun dan keluar dengan aman setelah selesai.
### Selesai bila
- Halaman masuk meminta email dan kata sandi, dengan tombol "Masuk" yang jelas.
- Setelah berhasil masuk, guru diarahkan ke dasbor dan namanya terlihat sebagai penanda sesi aktif.
- Tombol "Keluar" mengakhiri sesi dan mengembalikan guru ke halaman masuk; salah kata sandi menampilkan pesan yang jelas.

## Sub-fitur: Atur Profil & Sekolah

Guru melengkapi nama, sekolah, dan profil setelah akun aktif; daftar kelas yang diampu dikelola di dasbor, bukan saat mendaftar.

### Tujuan
Guru melengkapi identitas dan sekolah setelah akun aktif agar profilnya siap dipakai.
### Selesai bila
- Halaman profil menampilkan isian nama, sekolah, dan profil yang dapat diubah guru.
- Perubahan yang disimpan langsung terlihat kembali saat halaman profil dibuka.
- Pengelolaan kelas tidak ada di halaman ini; daftar kelas diampu tetap dikelola dari dasbor.

## Sub-fitur: Lupa Kata Sandi

Guru bisa memulihkan akses akun saat lupa kata sandi.

### Tujuan
Guru dapat memulihkan akses akun saat lupa kata sandi tanpa bantuan manual.
### Selesai bila
- Halaman masuk menyediakan tautan "Lupa kata sandi?" yang mudah ditemukan.
- Guru dapat memasukkan email terdaftar dan menerima petunjuk untuk membuat kata sandi baru.
- Setelah kata sandi baru dibuat, guru dapat masuk memakai kata sandi tersebut; bila email tidak dikenali, muncul pesan yang jelas.

## Task

### 1. Bangun layout halaman akun guru

### 2. Buat halaman pendaftaran guru dengan data tiruan

### 3. Buat halaman masuk guru dengan data tiruan

### 4. Tampilkan header sesi guru dengan tombol keluar

### 5. Buat halaman profil guru dengan data tiruan

### 6. Buat halaman lupa kata sandi guru

### 7. Buat skema tabel akun guru dan migrasi

### 8. Buat layanan registrasi guru dengan hashing sandi

### 9. Buat endpoint masuk dan sesi guru

### 10. Buat endpoint keluar dan proteksi rute akun

### 11. Buat endpoint baca dan ubah profil guru

### 12. Buat alur reset kata sandi dengan token
