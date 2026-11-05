# Kerjakan Asesmen

Siswa mengerjakan soal tiga tingkat langsung dari HP atau laptop setelah memasukkan token dari guru.

## Spesifikasi

### Tujuan
Siswa dapat mengerjakan asesmen tiga tingkat secara online dari HP atau laptop setelah memasukkan token dari guru, sehingga hasil pengerjaannya bisa langsung dianalisis.
### Selesai bila
- Siswa bisa membuka halaman asesmen, memasukkan token dari guru, dan langsung melihat soal bila token masih berlaku.
- Siswa yang memasukkan token tidak valid atau kedaluwarsa mendapat pesan jelas dan tidak bisa masuk ke soal.
- Setiap soal tampil bertingkat: pilihan jawaban, alasan memilih, lalu tingkat keyakinan siswa.
- Tampilan soal tetap rapi dan mudah dipakai di layar HP maupun laptop.
- Siswa mengirim jawaban satu kali di akhir dan mendapat tanda bahwa asesmen sudah terkirim.

## Sub-fitur: Masuk dengan Token

Siswa membuka asesmen hanya dengan token dari guru yang masih berlaku; server memeriksa token, jadwal buka–tutup, dan sisa pemakaian, lalu siswa mengisi nama sebelum mulai mengerjakan.

### Tujuan
Membatasi akses pengerjaan asesmen hanya bagi siswa yang memiliki token dari guru yang masih berlaku, sekaligus memastikan hanya asesmen yang sudah dibuka dan belum ditutup yang bisa dikerjakan.

### Halaman masuk
- Satu kolom **token** + tombol "Masuk", satu-satunya isian di halaman ini — tanpa login akun siswa.
- Kolom token: huruf besar otomatis (case-insensitive), spasi di awal/akhir dibuang, mendukung tempel (paste) dari chat, dan `inputmode` teks sehingga nyaman di HP maupun laptop.
- Setelah token dinyatakan valid, barulah muncul isian **nama siswa** dan tombol "Mulai mengerjakan".
- Tidak ada petunjuk yang membocorkan daftar token, judul asesmen, atau nama kelas sebelum token valid.

### Pemeriksaan token (dilakukan di server, bukan di browser)
Server memeriksa berurutan dan menolak dengan pesan berbeda untuk tiap penyebab:
1. Kode token tidak ditemukan → "Token tidak dikenali. Periksa kembali kode dari guru."
2. `tokens.is_active = false` → "Token sudah dinonaktifkan guru."
3. `tokens.expires_at` sudah lewat → "Token sudah kedaluwarsa."
4. `used_count >= max_uses` → "Kuota pemakaian token sudah habis."
5. Waktu sekarang < `assessments.opens_at` → "Asesmen belum dibuka." (tampilkan jadwal buka)
6. Waktu sekarang > `assessments.closes_at` atau `status = selesai` → "Asesmen sudah ditutup."
7. Semua lolos → tampilkan isian nama.

- Pemeriksaan memakai koneksi server (service role); anon key tidak dipakai query langsung, dan respons gagal tidak menyertakan data token/asesmen.
- Pembatasan percobaan: maksimal beberapa kali coba per menit per IP/sesi untuk mencegah penebakan token; setelah batas tercapai tampil pesan "Terlalu banyak percobaan, coba lagi sebentar."

### Setelah nama diisi
- Nama wajib (tidak kosong, panjang wajar, spasi berlebih dirapikan); nama dicatat pada `students` untuk kelas asesmen tersebut bila belum ada.
- Server membuat **satu** `attempts` (`status = berlangsung`, `started_at`, `token_id`, `student_id`, `assessment_id`) dan menaikkan `tokens.used_count` **satu kali** — bukan per klik.
- Identitas siswa di sesi pengerjaan ditentukan server dari attempt yang dibuat, bukan dari parameter di URL; `attempt_id` disimpan di cookie sesi sehingga muat ulang halaman tidak membuat attempt baru (sifat idempoten).
- Bila attempt atas nama sama untuk asesmen itu sudah ada dan belum terkirim → siswa **melanjutkan** pengerjaan yang sama; bila sudah terkirim → diarahkan ke halaman hasil & pembahasan, bukan membuat attempt baru.
- Bila kuota token habis tepat saat bersamaan diklaim dua siswa, hanya satu yang berhasil; yang lain mendapat pesan kuota habis.

### Selesai bila
- Halaman masuk menampilkan satu kolom token yang mudah diisi dari HP maupun laptop.
- Token valid + dalam jadwal membuka akses ke soal asesmen.
- Token salah, tidak aktif, kedaluwarsa, kuota habis, atau di luar jadwal ditolak dengan pesan spesifik seperti di atas (bukan pesan generik).
- Setelah token diterima, siswa diminta mengisi namanya sebelum mulai mengerjakan.
- Membuat sesi pengerjaan tidak menggandakan `attempts` saat tombol ditekan dua kali atau halaman dimuat ulang, dan `used_count` bertambah tepat satu per sesi baru.
- Siswa yang sudah mengirim jawaban dan memasukkan token lagi diarahkan ke halaman hasil, bukan mulai dari awal.
- Tidak ada data asesmen, token lain, atau daftar siswa yang bisa dibaca dari browser sebelum maupun sesudah token divalidasi.

## Sub-fitur: Soal Tiga Tingkat

Setiap soal disajikan bertingkat: tingkat 1 dan 2 dengan pilihan A–E, tingkat 3 hanya pilihan yakin atau tidak yakin.

### Tujuan
Menyajikan setiap soal dalam tiga tingkat berurutan agar sistem dapat menilai pemahaman siswa secara mendalam, bukan sekadar benar atau salah.

### Bentuk tiap tingkat
- Tingkat 1 (pertanyaan utama): lima pilihan jawaban berlabel A, B, C, D, E. Siswa memilih tepat satu.
- Tingkat 2 (alasan): lima pilihan alasan berlabel A, B, C, D, E. Siswa memilih tepat satu.
- Tingkat 3 (keyakinan): tanpa pilihan A–E. Hanya dua tombol, "Yakin" dan "Tidak yakin".

### Selesai bila
- Tiap soal menampilkan tiga bagian berurutan: tingkat 1 (A–E), tingkat 2 (A–E), lalu tingkat 3 (Yakin / Tidak yakin).
- Tingkat 1 dan 2 masing-masing menampilkan tepat lima opsi berlabel A–E dan hanya satu opsi dapat dipilih; memilih opsi lain menggantikan pilihan sebelumnya.
- Tingkat 3 tidak menampilkan opsi A–E maupun pilihan tambahan, hanya dua tombol keyakinan yang saling eksklusif.
- Siswa tidak bisa lanjut ke tingkat berikutnya sebelum menjawab tingkat sebelumnya, dan jawaban yang sudah dipilih tetap terlihat.
- Pilihan yang tersimpan dicatat sesuai kode opsi (A–E) untuk tingkat 1 dan 2, serta "yakin" atau "tidak yakin" untuk tingkat 3.
- Rumus matematika dan gambar pada soal tampil rapi di layar siswa.

## Sub-fitur: Nyaman di HP & Laptop

Tampilan soal menyesuaikan layar sehingga siswa bisa mengerjakan dari mana saja.

### Tujuan
Membuat tampilan soal menyesuaikan ukuran layar agar siswa dapat mengerjakan dengan nyaman dari HP maupun laptop.
### Selesai bila
- Di layar HP, soal, pilihan jawaban, dan tombol tetap terbaca tanpa perlu memperbesar atau menggeser ke samping.
- Di layar laptop, tata letak soal tetap rapi dan tidak melebar berlebihan.
- Tombol navigasi antar soal mudah dijangkau di kedua ukuran layar.

## Sub-fitur: Kirim Jawaban

Siswa mengirim jawaban sekali di akhir pengerjaan; sistem menilai, mengunci jawaban, dan langsung mengarahkan siswa ke halaman hasil & pembahasan.

## Tujuan
Menutup sesi pengerjaan siswa secara pasti: jawaban dikirim satu kali, dinilai di server saat itu juga, lalu siswa dibawa ke halaman hasil & pembahasan sebagai bahan refleksi. Setelah terkirim, jawaban tidak dapat diubah.

## Sebelum mengirim
- Siswa melihat daftar butir asesmen beserta tanda **sudah dijawab** / **belum dijawab**.
- Daftar memakai status tiga tingkat per butir: tingkat 1 (A–E), tingkat 2 (A–E), tingkat 3 (`yakin` / `tidak yakin`). Butir dianggap lengkap bila ketiganya terisi.
- Peringatan ditampilkan bila masih ada butir belum lengkap, dengan jumlah butir yang belum dijawab dan jalan pintas untuk kembali ke butir tersebut.
- Siswa dapat kembali memperbaiki jawaban sebelum menekan kirim.

## Saat menekan kirim
- Muncul konfirmasi sekali lagi: jumlah butir yang sudah/belum dijawab dan pernyataan bahwa **jawaban tidak bisa diubah setelah terkirim**.
- Bila siswa membatalkan, ia kembali ke daftar soal tanpa perubahan data.
- Kirim hanya bisa dilakukan selama token masih berlaku dan jadwal `closes_at` belum lewat; di luar itu tombol kirim nonaktif dengan penjelasan.

## Setelah terkirim
- `attempts.status` menjadi `terkirim` dan `attempts.submitted_at` terisi waktu server.
- Jawaban disimpan per butir ke `answers` (`tier1_answer`/`tier2_answer` berupa kode opsi A–E, `tier3_confidence` berupa `yakin`/`tidak yakin`).
- Penilaian dijalankan di server: `is_tier1_correct`, `is_tier2_correct`, dan `understanding_status` (paham / miskonsepsi / belum paham) diisi saat itu.
- Analisis pemahaman per butir dan analisis kualitas soal langsung dipicu agar guru bisa membuka hasil tanpa menunggu.
- Pengiriman bersifat idempoten: klik ganda atau refresh tidak membuat attempt/jawaban ganda — percobaan kedua ditolak atau diabaikan.
- Siswa diarahkan ke halaman **hasil & pembahasan**, dengan tanda jelas bahwa asesmen berhasil terkirim.

## Selesai bila
- Siswa melihat status lengkap/belum lengkap setiap butir sebelum mengirim.
- Ada konfirmasi yang menyebut jawaban tidak bisa diubah, dan pembatalan tidak mengubah data.
- Tombol kirim nonaktif bila token kedaluwarsa atau jadwal sudah tutup.
- Setelah terkirim: `attempts.submitted_at` terisi, status `terkirim`, jawaban tersimpan lengkap, dan nilai `is_tier1_correct`, `is_tier2_correct`, `understanding_status` sudah terisi.
- Kirim berulang tidak menghasilkan data ganda.
- Siswa otomatis dibawa ke halaman hasil & pembahasan dan tidak bisa kembali mengedit jawaban.

## Task

### 1. Bangun halaman asesmen dengan data tiruan

### 2. Buat halaman masuk token dan nama

### 3. Buat komponen soal tiga tingkat statis

### 4. Tambah alur wajib jawab tiap tingkat

### 5. Buat navigasi antar soal dengan state tiruan

### 6. Tampilkan rumus dan gambar soal tiruan

### 7. Sesuaikan layout soal untuk HP dan laptop

### 8. Buat daftar review jawaban sebelum kirim

### 9. Buat konfirmasi kirim dan status terkirim

### 10. Buat skema token sesi dan jawaban

### 11. Buat layanan validasi token dan kedaluwarsa

### 12. Buat endpoint mulai sesi dengan nama siswa

### 13. Buat endpoint ambil soal tiga tingkat

### 14. Buat endpoint kirim jawaban final
