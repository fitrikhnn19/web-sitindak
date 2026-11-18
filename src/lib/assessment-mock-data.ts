// assessment-mock-data.ts
// Comprehensive mock data for 3-tier diagnostic assessment (Fase 1 SITINDAK)

export type ConceptionStatus = "paham" | "miskonsepsi" | "belum paham";

export interface QuestionOption {
  key: "A" | "B" | "C" | "D" | "E";
  text: string;
  isCorrect: boolean;
}

export interface ThreeTierQuestion {
  id: string;
  number: number;
  title: string;
  topic: string;
  prerequisiteTopic: string;
  tier1Question: string;
  tier1SvgDiagram?: string;
  imageUrl?: string;
  tier1Options: QuestionOption[];
  tier2Question: string;
  tier2Options: QuestionOption[];
  tier3Prompt: string;
  explanation: string;
}

export interface AssessmentToken {
  code: string;
  title: string;
  className: string;
  teacherName: string;
  isActive: boolean;
  maxUses: number;
  usedCount: number;
  opensAt: string; // ISO or human-readable format
  closesAt: string;
  status: "berjalan" | "draf" | "selesai";
  durationMinutes?: number; // Alokasi durasi ujian dalam menit (0 = tanpa batas)
}

export interface StudentAnswer {
  questionId: string;
  tier1Answer?: "A" | "B" | "C" | "D" | "E";
  tier2Answer?: "A" | "B" | "C" | "D" | "E";
  tier3Confidence?: "yakin" | "tidak yakin";
}

export interface AttemptSession {
  tokenCode: string;
  studentName: string;
  assessmentTitle: string;
  className: string;
  startedAt: string;
  submittedAt?: string;
  status: "berlangsung" | "terkirim";
  answers: Record<string, StudentAnswer>;
  cheatingEventsCount: number;
}

// Preset token scenarios to test all server validation rules specified in PRD & features
export const MOCK_TOKENS: Record<string, AssessmentToken> = {
  GEOXI10: {
    code: "GEOXI10",
    title: "Asesmen Diagnostik Transformasi Geometri (3-Tier)",
    className: "XI 10",
    teacherName: "Nur Fitria Khanani",
    isActive: true,
    maxUses: 35,
    usedCount: 0,
    opensAt: "2026-11-18T00:00:00+08:00",
    closesAt: "2026-11-25T23:59:59+08:00",
    status: "berjalan",
    durationMinutes: 60,
  },
};

// 10 Comprehensive 3-Tier Questions with LaTeX and Geometric SVG Diagrams
export const MOCK_QUESTIONS: ThreeTierQuestion[] = [
  {
    id: "21d06bde-21d0-411a-ab29-a1e59261e14f",
    number: 1,
    title: "Translasi sebuah bangun pada bidang kartesius",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Definisi dan Karakteristik Transformasi Geometri",
    tier1Question: "Perhatikan gambar berikut.\nSegitiga $A'B'C'$ merupakan bayangan hasil translasi dari segitiga $ABC$ oleh vektor $\\begin{pmatrix} 10 \\\\ 4 \\end{pmatrix}$. Berdasarkan gambar tersebut, pernyataan yang tepat mengenai segitiga $ABC$ dan bayangannya adalah ....",
    imageUrl: "/images/questions/soal-1.png",
    tier1Options: [
      { key: "A", text: "Bentuk dan ukurannya sama, tetapi orientasi bayangannya terbalik.", isCorrect: false },
      { key: "B", text: "Bentuk dan ukurannya sama, serta orientasi bayangannya tidak berubah.", isCorrect: true },
      { key: "C", text: "Bentuk dan ukurannya sama, tetapi jarak perpindahan tiap titik berbeda-beda.", isCorrect: false },
      { key: "D", text: "Bentuknya sama, tetapi ukuran bayangannya berubah.", isCorrect: false },
      { key: "E", text: "Bentuk dan ukuran bayangan berubah karena bangun berpindah ke posisi baru.", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Karena translasi menggeser setiap titik sejauh dan searah yang sama.", isCorrect: true },
      { key: "B", text: "Karena pada translasi setiap titik berputar mengelilingi sebuah titik pusat, sehingga jarak perpindahan tiap titik berbeda-beda bergantung pada jaraknya ke pusat.", isCorrect: false },
      { key: "C", text: "Karena pada translasi setiap titik dan bayangannya berjarak sama dari sebuah garis cermin dan berada pada sisi yang berlawanan.", isCorrect: false },
      { key: "D", text: "Karena pada translasi jarak setiap titik ke sebuah titik pusat dikalikan faktor skala yang sama, sehingga ukuran bangun berubah tetapi bentuknya tetap.", isCorrect: false },
      { key: "E", text: "Karena pada translasi setiap titik boleh berpindah dengan jarak dan arah yang berbeda, asalkan seluruh bangun berada di posisi yang baru.", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Translasi memindahkan setiap titik pada bangun sejauh dan searah yang sama. Pada gambar tersebut, segitiga ABC digeser 10 satuan ke kanan dan 4 satuan ke atas. Karena semua titik berpindah dengan vektor yang sama, maka panjang setiap sisi dan besar setiap sudut tidak berubah. Dengan demikian, bentuk dan ukuran bayangan sama seperti bangun semula. Urutan titik dan arah hadap segitiga juga tidak berubah, sehingga orientasi bayangan sama dengan bangun semula.",
  },
  {
    id: "6b86fcbc-ea70-4375-9eff-1bf93ecbe45a",
    number: 2,
    title: "Refleksi sebuah bangun terhadap garis m pada bidang koordinat kartesius",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Definisi dan Karakteristik Transformasi Geometri",
    tier1Question: "Perhatikan gambar berikut.\nSegitiga $A'B'C'$ merupakan hasil refleksi dari segitiga $ABC$ terhadap garis $m$. Berdasarkan gambar tersebut, pernyataan yang tepat mengenai bayangan tersebut adalah ....",
    imageUrl: "/images/questions/soal-2.png",
    tier1Options: [
      { key: "A", text: "Bentuk dan ukuran sama, serta bayangan hanya bergeser tanpa perubahan orientasi", isCorrect: false },
      { key: "B", text: "Bentuk dan ukuran sama, serta bayangan sejajar dengan bangun semula", isCorrect: false },
      { key: "C", text: "Bentuk dan ukuran sama, tetapi orientasi bayangan terbalik", isCorrect: true },
      { key: "D", text: "Bentuk sama, tetapi ukuran bayangan berubah mengikuti jaraknya ke garis $m$", isCorrect: false },
      { key: "E", text: "Bentuk bayangan berbeda dari bangun semula karena orientasinya terbalik", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Karena pada refleksi setiap titik berputar mengelilingi sebuah titik pusat dengan sudut yang sama, sehingga jarak titik ke pusat tetap dan arah hadap bangun berubah", isCorrect: false },
      { key: "B", text: "Karena pada refleksi setiap titik bergeser sejauh dan searah yang sama, sehingga bentuk, ukuran, dan arah hadap bangun tidak berubah", isCorrect: false },
      { key: "C", text: "Karena pada refleksi jarak setiap titik ke sebuah titik pusat dikalikan faktor skala yang sama, sehingga ukuran berubah tetapi bentuknya tetap sebangun", isCorrect: false },
      { key: "D", text: "Karena pada refleksi, setiap titik dan bayangannya berjarak sama dari garis cermin dan berada pada sisi yang berlawanan serta ruas garis yang menghubungkannya tegak lurus terhadap garis cermin", isCorrect: true },
      { key: "E", text: "Karena pada refleksi arah hadap bangun berubah (terbalik), sehingga bentuk bayangan menjadi berbeda dari bangun semula", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Pada refleksi, garis cermin m berfungsi sebagai sumbu simetri. Setiap titik dan bayangannya berjarak sama dari garis m dan berada pada sisi yang berlawanan. Ruas garis yang menghubungkan setiap titik dengan bayangannya tegak lurus terhadap garis m. Refleksi merupakan transformasi isometri, sehingga panjang sisi dan besar sudut tidak berubah. Bentuk dan ukuran bangun tetap. Urutan titik A-B-C pada bayangan berlawanan arah dengan bangun semula, sehingga orientasi bayangan terbalik. Perubahan arah hadap tidak mengubah bentuk.",
  },
  {
    id: "2905e53e-b1b2-4421-8200-2e2f2306566b",
    number: 3,
    title: "Rotasi sebuah bangun terhadap titik pusat",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Konsep dan Karakteristik Transformasi Geometri",
    tier1Question: "Perhatikan gambar berikut.\nSegitiga $A'B'C'$ merupakan bayangan hasil rotasi dari segitiga $ABC$ terhadap titik pusat $P(0,0)$ sebesar $90^\\circ$ searah jarum jam. Berdasarkan gambar tersebut, pernyataan yang tepat mengenai segitiga $ABC$ dan bayangannya adalah ...",
    imageUrl: "/images/questions/soal-3.png",
    tier1Options: [
      { key: "A", text: "Bentuk dan ukuran sama, tetapi arah hadap bayangan berubah mengikuti besar dan arah sudut rotasi", isCorrect: true },
      { key: "B", text: "Bentuk dan ukuran sama, tetapi bayangan terbalik seperti bayangan pada cermin", isCorrect: false },
      { key: "C", text: "Bentuk dan ukuran sama, serta arah hadap bayangan sama dengan bangun semula", isCorrect: false },
      { key: "D", text: "Bentuk sama, tetapi ukuran bayangan berbeda", isCorrect: false },
      { key: "E", text: "Bentuk dan ukuran bayangan berbeda", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Karena pada rotasi setiap titik dan bayangannya berjarak sama dari sebuah garis yang melalui $P$ dan berada pada sisi berlawanan, sehingga bentuk dan ukuran bangun tidak berubah.", isCorrect: false },
      { key: "B", text: "Karena rotasi memutar setiap titik mengelilingi titik pusat $P$ dengan sudut yang sama dan jarak titik ke $P$ tetap, sehingga bentuk dan ukuran bangun tidak berubah, sedangkan arah hadapnya berubah mengikuti putaran.", isCorrect: true },
      { key: "C", text: "Karena pada rotasi setiap titik bergeser sejauh dan searah yang sama, sehingga bentuk dan arah hadap bangun tidak berubah.", isCorrect: false },
      { key: "D", text: "Karena pada rotasi jarak setiap titik ke pusat $P$ berubah-ubah selama berputar, sehingga ukuran bayangan dapat berbeda dari bangun semula.", isCorrect: false },
      { key: "E", text: "Karena pada rotasi setiap titik dicerminkan terhadap titik pusat $P$, sehingga bayangan menjadi terbalik seperti bayangan pada cermin datar.", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Rotasi memutar setiap titik mengelilingi titik pusat P sejauh sudut putar $\\theta$ yang sama. Jarak setiap titik ke pusat rotasi tetap sama ($PA' = PA, PB' = PB, PC' = PC$). Karena rotasi merupakan transformasi isometri, panjang sisi dan besar sudut segitiga tidak berubah, sehingga bentuk dan ukurannya tetap. Namun, arah hadap segitiga berubah sesuai arah putaran (90° searah jarum jam).",
  },
  {
    id: "bb956a77-aa04-4d42-bf7c-b974e7b7efb9",
    number: 4,
    title: "Dilatasi sebuah bangun terhadap titik pusat",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Konsep dan Karakteristik Transformasi Geometri",
    tier1Question: "Perhatikan gambar berikut.\nPersegi panjang $A'B'C'D'$ merupakan bayangan hasil dilatasi dari persegi panjang $ABCD$ dengan pusat $O(0,0)$ dan faktor skala $k = \\frac{1}{2}$. Berdasarkan gambar tersebut, pernyataan yang tepat mengenai persegi panjang $ABCD$ dan bayangannya adalah ...",
    imageUrl: "/images/questions/soal-4.png",
    tier1Options: [
      { key: "A", text: "Bentuk dan ukuran bayangan sama dengan bangun semula", isCorrect: false },
      { key: "B", text: "Bentuk dan ukuran sama, tetapi orientasi bayangan terbalik", isCorrect: false },
      { key: "C", text: "Bentuk dan ukuran sama, tetapi orientasi bayangan berputar", isCorrect: false },
      { key: "D", text: "Bentuk bayangan sebangun dengan bangun semula, tetapi ukurannya berbeda", isCorrect: true },
      { key: "E", text: "Ukuran bayangan selalu lebih besar daripada bangun semula", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Karena dilatasi menempatkan setiap titik bayangan pada garis yang melalui $O$ dengan perbandingan $OA' : OA = k$ yang sama untuk semua titik, sehingga perbandingan sisi-sisi bersesuaian sama dan sudut-sudutnya tetap", isCorrect: true },
      { key: "B", text: "Karena pada dilatasi setiap titik bayangan berada di sisi seberang $O$ dengan jarak yang sama dari $O$", isCorrect: false },
      { key: "C", text: "Karena pada dilatasi setiap titik berputar mengelilingi $O$ dengan sudut yang sama", isCorrect: false },
      { key: "D", text: "Karena pada dilatasi setiap titik bergeser sejauh dan searah yang sama", isCorrect: false },
      { key: "E", text: "Karena dilatasi selalu memperbesar bangun dengan menjauhkan titik-titik dari pusat $O$", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Pada dilatasi dengan pusat O(0,0) dan faktor skala $k = \\frac{1}{2}$, setiap jarak titik dari pusat dikalikan dengan k ($OA' = \\frac{1}{2} OA$). Karena nilai $|k| < 1$, bangun bayangan diperkecil. Dilatasi mempertahankan besar sudut dan perbandingan panjang sisi-sisi yang bersesuaian, sehingga bayangan sebangun dengan bangun semula tetapi ukurannya berbeda.",
  },
  {
    id: "ce47950d-4c50-47e5-831d-cebe9ca006e9",
    number: 5,
    title: "Menentukan Koordinat Bayangan Hasil Translasi",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Menentukan bayangan hasil transformasi",
    tier1Question: "Titik $P(-2, 3)$ ditranslasikan oleh vektor $T = \\begin{pmatrix} 4 \\\\ -5 \\end{pmatrix}$. Koordinat bayangan titik $P$ adalah ....",
    imageUrl: "/images/questions/soal-5.png",
    tier1Options: [
      { key: "A", text: "$P'(-6, 8)$", isCorrect: false },
      { key: "B", text: "$P'(2, 8)$", isCorrect: false },
      { key: "C", text: "$P'(-6, -2)$", isCorrect: false },
      { key: "D", text: "$P'(-7, 7)$", isCorrect: false },
      { key: "E", text: "$P'(2, -2)$", isCorrect: true },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Translasi $(a,b)$ berarti pengurangan, sehingga $x' = x - 4$ dan $y' = y - 5$", isCorrect: false },
      { key: "B", text: "Karena komponen pertama bernilai positif maka titik bergeser ke kanan, dan komponen kedua bernilai negatif maka titik bergeser ke atas", isCorrect: false },
      { key: "C", text: "Karena komponen pertama bernilai positif maka titik bergeser ke kanan dan komponen kedua bernilai negatif maka titik bergeser ke bawah, sehingga $x' = x + 4$ dan $y' = y - 5$", isCorrect: true },
      { key: "D", text: "Karena komponen pertama bernilai positif maka titik bergeser ke kiri, dan komponen kedua bernilai negatif maka titik bergeser ke atas", isCorrect: false },
      { key: "E", text: "Karena komponen pertama bernilai 4 menggeser ordinat ke atas dan komponen kedua bernilai -5 menggeser absis ke kiri", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Translasi $T = \\begin{pmatrix} a \\\\ b \\end{pmatrix}$ memetakan titik $(x, y)$ menjadi $(x', y') = (x + a, y + b)$. Untuk $P(-2, 3)$ dan $T = \\begin{pmatrix} 4 \\\\ -5 \\end{pmatrix}$:\n$x' = -2 + 4 = 2$\n$y' = 3 + (-5) = -2$\nSehingga bayangannya adalah $P'(2, -2)$.",
  },
  {
    id: "d4acb8e2-f5fe-48f3-9942-bc4abf2d866f",
    number: 6,
    title: "Menentukan koordinat bayangan refleksi sebuah titik terhadap garis x = 1",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Menentukan Bayangan Hasil Transformasi",
    tier1Question: "Titik $A(4, 3)$ dicerminkan terhadap garis $x = 1$. Koordinat bayangan titik $A$ adalah ...",
    imageUrl: "/images/questions/soal-6.png",
    tier1Options: [
      { key: "A", text: "$A'(-4, 3)$", isCorrect: false },
      { key: "B", text: "$A'(4, -3)$", isCorrect: false },
      { key: "C", text: "$A'(-2, 3)$", isCorrect: true },
      { key: "D", text: "$A'(7, 3)$", isCorrect: false },
      { key: "E", text: "$A'(-3, 3)$", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Pencerminan terhadap garis tegak mengubah absis titik menjadi lawannya", isCorrect: false },
      { key: "B", text: "Bayangan diperoleh dengan menambahkan jarak titik ke garis cermin pada absis titik", isCorrect: false },
      { key: "C", text: "Jarak titik ke garis cermin dianggap sama dengan nilai absis titik", isCorrect: false },
      { key: "D", text: "Pencerminan mengubah ordinat titik menjadi lawannya", isCorrect: false },
      { key: "E", text: "Titik dan bayangannya berjarak sama dari garis cermin dan berada pada sisi yang berseberangan, sehingga $x' = 2(1) - 4 = -2$ dan ordinat tetap", isCorrect: true },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Pencerminan terhadap garis vertikal $x = h$ memetakan titik $(x, y)$ menjadi $(x', y') = (2h - x, y)$. Dengan $h = 1$, $x = 4$, $y = 3$:\n$x' = 2(1) - 4 = 2 - 4 = -2$\n$y' = y = 3$\nSehingga koordinat bayangan adalah $A'(-2, 3)$. Jarak titik A ke garis cermin adalah $|4 - 1| = 3$, dan jarak A' ke garis cermin juga $|1 - (-2)| = 3$ pada sisi seberang.",
  },
  {
    id: "4a8efca9-89ad-4fd3-bf7c-e977c5c01e11",
    number: 7,
    title: "Menentukan bayangan hasil rotasi",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Menentukan koordinat bayangan hasil transformasi geometri",
    tier1Question: "Titik $P(3, 2)$ dirotasikan sebesar $270^\\circ$ berlawanan arah jarum jam dengan pusat $O(0, 0)$. Koordinat bayangan titik $P$ adalah ...",
    imageUrl: "/images/questions/soal-7.png",
    tier1Options: [
      { key: "A", text: "$P'(2, 3)$", isCorrect: false },
      { key: "B", text: "$P'(2, -3)$", isCorrect: true },
      { key: "C", text: "$P'(-2, 3)$", isCorrect: false },
      { key: "D", text: "$P'(-2, -3)$", isCorrect: false },
      { key: "E", text: "$P'(-3, -2)$", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Rotasi $270^\\circ$ berlawanan arah jarum jam sama dengan rotasi $90^\\circ$ searah jarum jam, sehingga $(x, y)$ menjadi $(y, -x)$", isCorrect: true },
      { key: "B", text: "Rotasi $270^\\circ$ berlawanan arah jarum jam sama dengan rotasi $90^\\circ$ berlawanan arah jarum jam, sehingga $(x, y)$ menjadi $(-y, x)$", isCorrect: false },
      { key: "C", text: "Rotasi $270^\\circ$ dihitung sebagai dua kali rotasi $90^\\circ$, sehingga $(x, y)$ menjadi $(-x, -y)$", isCorrect: false },
      { key: "D", text: "Rotasi hanya memutar posisi absis dan ordinat, sehingga $(x, y)$ menjadi $(y, x)$", isCorrect: false },
      { key: "E", text: "Rotasi $270^\\circ$ menukar absis dan ordinat lalu mengubah kedua tandanya, sehingga $(x, y)$ menjadi $(-y, -x)$", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Rotasi sebesar $270^\\circ$ berlawanan arah jarum jam (positif) dengan pusat $O(0,0)$ ekuivalen dengan rotasi $-90^\\circ$ (atau $90^\\circ$ searah jarum jam). Rumus transformasinya adalah $(x, y) \\to (y, -x)$. Untuk titik $P(3, 2)$:\n$x' = y = 2$\n$y' = -x = -3$\nJadi koordinat bayangannya adalah $P'(2, -3)$.",
  },
  {
    id: "96796c04-9e8c-4b46-a0ef-c920aa5fa3ad",
    number: 8,
    title: "Menentukan bayangan dilatasi",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Menentukan hasil bayangan transformasi geometri",
    tier1Question: "Titik $A(4, 2)$ didilatasikan dengan pusat $P(2, 1)$ dan faktor skala 3. Koordinat bayangan titik $A$ adalah ....",
    imageUrl: "/images/questions/soal-8.png",
    tier1Options: [
      { key: "A", text: "$A'(6, 3)$", isCorrect: false },
      { key: "B", text: "$A'(7, 5)$", isCorrect: false },
      { key: "C", text: "$A'(8, 4)$", isCorrect: true },
      { key: "D", text: "$A'(10, 5)$", isCorrect: false },
      { key: "E", text: "$A'(12, 6)$", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Pusat dilatasi selalu titik asal, sehingga $(x, y)$ menjadi $(3x, 3y)$", isCorrect: false },
      { key: "B", text: "Faktor skala ditambahkan pada koordinat titik, sehingga $(x, y)$ menjadi $(x+3, y+3)$", isCorrect: false },
      { key: "C", text: "Bayangan ditentukan dari vektor $3 \\times PA$ saja, tanpa menambahkan koordinat pusat $P$", isCorrect: false },
      { key: "D", text: "Bayangan terletak pada garis yang melalui $P$ dan $A$ dengan $PA' = 3 \\times PA$, sehingga dihitung dari pusat $P$: $A' = P + 3(A - P)$", isCorrect: true },
      { key: "E", text: "Pergeseran sejauh $3 \\times PA$ ditambahkan pada titik $A$, bukan pada pusat $P$, sehingga $A' = A + 3(A - P)$", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Dilatasi dengan pusat $P(a, b)$ dan faktor skala $k$ dirumuskan: $A' = P + k(A - P)$ atau $\\begin{pmatrix} x' \\\\ y' \\end{pmatrix} = \\begin{pmatrix} a \\\\ b \\end{pmatrix} + k \\begin{pmatrix} x - a \\\\ y - b \\end{pmatrix}$.\nDengan $P(2, 1)$, $A(4, 2)$, dan $k = 3$:\n$x' = 2 + 3(4 - 2) = 2 + 3(2) = 2 + 6 = 8$\n$y' = 1 + 3(2 - 1) = 1 + 3(1) = 1 + 3 = 4$\nJadi bayangannya adalah $A'(8, 4)$.",
  },
  {
    id: "c989963d-f4d9-42cc-ab69-1a2d10e3dff8",
    number: 9,
    title: "Menentukan posisi akhir objek setelah mengalami translasi",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Permasalahan Kontekstual Tentang Transformasi Geometri",
    tier1Question: "Sebuah drone pemetaan lahan mula-mula berada di titik $(2, 3)$ pada peta di atas, dengan 1 kotak mewakili 1 km. Drone tersebut terbang 4 km ke arah timur, kemudian terbang 3 km ke arah selatan. Posisi akhir drone adalah ....",
    imageUrl: "/images/questions/soal-9.png",
    tier1Options: [
      { key: "A", text: "$(-1, 7)$", isCorrect: false },
      { key: "B", text: "$(6, 3)$", isCorrect: false },
      { key: "C", text: "$(6, 6)$", isCorrect: false },
      { key: "D", text: "$(6, 0)$", isCorrect: true },
      { key: "E", text: "$(2, 0)$", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Karena gerakan dilakukan berurutan, hanya gerakan pertama yang diperhitungkan", isCorrect: false },
      { key: "B", text: "Karena gerakan dilakukan berurutan, hanya gerakan terakhir yang diperhitungkan", isCorrect: false },
      { key: "C", text: "Gerak ke timur mengubah absis (ke kanan bertambah) dan gerak ke selatan mengubah ordinat (ke bawah berkurang)", isCorrect: true },
      { key: "D", text: "Gerak ke timur mengubah ordinat dan gerak ke selatan mengubah absis", isCorrect: false },
      { key: "E", text: "Gerak ke selatan membuat ordinat bertambah", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Arah timur searah sumbu-x positif (absis bertambah 4). Arah selatan searah sumbu-y negatif (ordinat berkurang 3). Pergerakan drone dapat dinyatakan sebagai vektor translasi $T = \\begin{pmatrix} 4 \\\\ -3 \\end{pmatrix}$.\nPosisi akhir = $(2 + 4, 3 + (-3)) = (6, 0)$.",
  },
  {
    id: "0c13e0ab-c103-4b48-8504-d9472c840f1d",
    number: 10,
    title: "Menentukan posisi bayangan objek berdasarkan garis cermin",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Permasalahan Kontekstual Tentang Transformasi Geometri",
    tier1Question: "Denah di atas menunjukkan sebuah jalan lurus (1 kotak = 1 m) dengan garis tengah jalan $y = 2$. Lampu jalan A berada di titik $(3, 6)$. Lampu jalan B akan dipasang di seberang jalan pada posisi hasil pencerminan lampu A terhadap garis tengah jalan. Koordinat lampu B adalah ...",
    imageUrl: "/images/questions/soal-10.png",
    tier1Options: [
      { key: "A", text: "$(3, 2)$", isCorrect: false },
      { key: "B", text: "$(3, 0)$", isCorrect: false },
      { key: "C", text: "$(3, -6)$", isCorrect: false },
      { key: "D", text: "$(3, -4)$", isCorrect: false },
      { key: "E", text: "$(3, -2)$", isCorrect: true },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Jarak lampu A dan lampu B ke garis tengah jalan sama dan keduanya berada pada sisi yang berseberangan", isCorrect: true },
      { key: "B", text: "Garis cermin sejajar sumbu-x, sehingga hanya ordinat lampu A yang berubah tanda", isCorrect: false },
      { key: "C", text: "Lampu B berada di seberang jalan, sehingga posisinya tepat di tepi jalan seberang $y = 0$", isCorrect: false },
      { key: "D", text: "Lampu B berada 4 satuan di bawah sumbu-x, sesuai jarak lampu A ke garis tengah jalan", isCorrect: false },
      { key: "E", text: "Lampu B diperoleh dengan menggeser lampu A ke bawah sejauh jaraknya ke garis tengah jalan", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Pencerminan terhadap garis horizontal $y = k$ memetakan titik $(x, y)$ menjadi $(x, 2k - y)$.\nDengan garis tengah $y = 2$ dan titik lampu A $(3, 6)$:\n$x' = 3$\n$y' = 2(2) - 6 = 4 - 6 = -2$\nSehingga koordinat lampu B adalah $(3, -2)$. Jarak lampu A ke garis $y = 2$ adalah $|6 - 2| = 4$ m, sama dengan jarak lampu B ke garis $y = 2$ yaitu $|2 - (-2)| = 4$ m.",
  },
  {
    id: "dd56e9c5-20ce-42b5-a4b3-d9c2b693d2b2",
    number: 11,
    title: "Menentukan posisi akhir objek setelah mengalami rotasi",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Permasalahan Kontekstual Tentang Transformasi Geometri",
    tier1Question: "Poros sebuah kincir angin berada di titik $P(2, 2)$, dan ujung salah satu baling-balingnya berada di titik $A(2, 6)$. Baling-baling tersebut berputar $90^\\circ$ searah jarum jam terhadap poros $P$. Posisi ujung baling-baling setelah berputar adalah ...",
    imageUrl: "/images/questions/soal-11.png",
    tier1Options: [
      { key: "A", text: "$(-2, 2)$", isCorrect: false },
      { key: "B", text: "$(6, 2)$", isCorrect: true },
      { key: "C", text: "$(6, -2)$", isCorrect: false },
      { key: "D", text: "$(6, 6)$", isCorrect: false },
      { key: "E", text: "$(4, 0)$", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Putaran searah jarum jam dianggap sama dengan putaran berlawanan arah jarum jam", isCorrect: false },
      { key: "B", text: "Pusat putaran dapat diabaikan, yaitu titik diputar terhadap titik asal", isCorrect: false },
      { key: "C", text: "Hanya vektor dari pusat ke titik yang diputar, lalu hasilnya dijadikan koordinat bayangan tanpa menambahkan koordinat pusat", isCorrect: false },
      { key: "D", text: "Titik berpindah lurus ke kanan sejauh jarak titik ke pusat tanpa turun", isCorrect: false },
      { key: "E", text: "Vektor dari pusat ke titik diputar $90^\\circ$ searah jarum jam, lalu hasilnya ditambahkan dengan koordinat pusat", isCorrect: true },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Vektor dari poros $P(2, 2)$ ke ujung baling-baling $A(2, 6)$ adalah $\\vec{PA} = (2 - 2, 6 - 2) = (0, 4)$.\nRotasi $90^\\circ$ searah jarum jam memetakan vektor $(x, y) \\to (y, -x)$. Jadi $(0, 4) \\to (4, 0)$.\nMenambahkan kembali ke koordinat pusat $P(2, 2)$:\n$A' = (2 + 4, 2 + 0) = (6, 2)$.",
  },
  {
    id: "563d22b0-ea5f-440b-8f0a-c3ae60bbe993",
    number: 12,
    title: "Menentukan hasil dilatasi berdasarkan faktor skala",
    topic: "Transformasi Geometri",
    prerequisiteTopic: "Permasalahan Kontekstual Tentang Transformasi Geometri",
    tier1Question: "Sebuah foto berukuran $12\\text{ cm} \\times 9\\text{ cm}$ diperkecil dengan dilatasi berpusat di titik sudut kiri bawah foto dan faktor skala $\\frac{1}{3}$. Ukuran foto hasil dilatasi adalah ...",
    imageUrl: "/images/questions/soal-12.png",
    tier1Options: [
      { key: "A", text: "$4\\text{ cm} \\times 3\\text{ cm}$", isCorrect: true },
      { key: "B", text: "$8\\text{ cm} \\times 6\\text{ cm}$", isCorrect: false },
      { key: "C", text: "$9\\text{ cm} \\times 6\\text{ cm}$", isCorrect: false },
      { key: "D", text: "$12\\text{ cm} \\times 9\\text{ cm}$", isCorrect: false },
      { key: "E", text: "$36\\text{ cm} \\times 27\\text{ cm}$", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Karena faktor skala $\\frac{1}{3}$ berarti setiap panjang sisi dikurangi sebesar $\\frac{1}{3}$ dari panjang semula", isCorrect: false },
      { key: "B", text: "Faktor skala $\\frac{1}{3}$ berarti setiap panjang sisi dikurangi 3 cm, karena penyebut dianggap sebagai pengurang", isCorrect: false },
      { key: "C", text: "Faktor skala $\\frac{1}{3}$ berarti setiap panjang sisi dibagi dengan $\\frac{1}{3}$, sehingga setiap panjang sisi dibagi dengan $\\frac{1}{3}$", isCorrect: false },
      { key: "D", text: "Setiap panjang sisi foto dikalikan faktor skala, sehingga panjang dan lebar mengecil dengan perbandingan yang sama", isCorrect: true },
      { key: "E", text: "Faktor skala hanya menggeser letak foto terhadap pusat dilatasi, sedangkan ukuran foto tidak berubah", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda terhadap jawaban dan alasan yang telah dipilih?",
    explanation: "Dilatasi dengan faktor skala $k$ mengalikan setiap panjang dimensi bangun dengan $k$. Letak pusat dilatasi menentukan posisi bayangan, bukan ukurannya.\nPanjang baru = $12\\text{ cm} \\times \\frac{1}{3} = 4\\text{ cm}$\nLebar baru = $9\\text{ cm} \\times \\frac{1}{3} = 3\\text{ cm}$\nUkuran foto hasil dilatasi adalah $4\\text{ cm} \\times 3\\text{ cm}$.",
  },
];

// Helper to evaluate 3-Tier diagnostic understanding status
export function evaluateConception(
  question: ThreeTierQuestion,
  answer: StudentAnswer | undefined
): ConceptionStatus {
  if (!answer) return "belum paham";

  const tier1CorrectOption = question.tier1Options.find((o) => o.isCorrect)?.key;
  const tier2CorrectOption = question.tier2Options.find((o) => o.isCorrect)?.key;

  const isTier1Correct = answer.tier1Answer === tier1CorrectOption;
  const isTier2Correct = answer.tier2Answer === tier2CorrectOption;
  const isConfident = answer.tier3Confidence === "yakin";

  // Scientific 3-tier diagnostic classification logic:
  // 1. Paham: Tier 1 BENAR, Tier 2 BENAR, Tier 3 YAKIN
  if (isTier1Correct && isTier2Correct && isConfident) {
    return "paham";
  }

  // 2. Miskonsepsi: Tier 3 YAKIN, tetapi (Tier 1 SALAH atau Tier 2 SALAH)
  // Siswa meyakini konsep yang keliru
  if (isConfident && (!isTier1Correct || !isTier2Correct)) {
    return "miskonsepsi";
  }

  // 3. Belum Paham: Siswa TIDAK YAKIN (menebak/ragu-ragu), baik jawabannya kebetulan benar atau salah
  return "belum paham";
}

// Helper to format remaining seconds into MM:SS or HH:MM:SS
export function formatTimeRemaining(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

