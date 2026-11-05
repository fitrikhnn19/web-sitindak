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
export const MOCK_TOKENS: Record<string, AssessmentToken> = {};

// 10 Comprehensive 3-Tier Questions with LaTeX and Geometric SVG Diagrams
export const MOCK_QUESTIONS: ThreeTierQuestion[] = [
  {
    id: "q-1",
    number: 1,
    title: "Translasi Titik pada Bidang Kartesius",
    topic: "Translasi Geometri",
    prerequisiteTopic: "Sistem Koordinat Kartesius & Penjumlahan Bilangan Bulat",
    tier1Question: "Titik $P(2, -5)$ ditranslasikan oleh vektor pergeseran $T = \\begin{pmatrix} -3 \\\\ 4 \\end{pmatrix}$. Tentukan koordinat bayangan titik $P'$!",
    tier1SvgDiagram: `
      <svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
        <!-- Grid lines -->
        <defs>
          <pattern id="grid1" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
          </pattern>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#0b8be7" />
          </marker>
        </defs>
        <rect width="260" height="200" fill="#0f172a" rx="10" />
        <rect width="260" height="200" fill="url(#grid1)" rx="10" />
        <!-- Axes -->
        <line x1="130" y1="10" x2="130" y2="190" stroke="#64748b" stroke-width="1.5" />
        <line x1="10" y1="100" x2="250" y2="100" stroke="#64748b" stroke-width="1.5" />
        <text x="245" y="93" fill="#94a3b8" font-size="10" font-weight="bold">X</text>
        <text x="135" y="20" fill="#94a3b8" font-size="10" font-weight="bold">Y</text>
        <!-- Point P(2, -5) -> centered around 130, 100 -->
        <circle cx="160" cy="150" r="4.5" fill="#f59e0b" />
        <text x="168" y="156" fill="#fcd34d" font-size="10" font-weight="bold">P(2, -5)</text>
        <!-- Translation Vector Vector T(-3, 4) -->
        <line x1="160" y1="150" x2="115" y2="110" stroke="#0b8be7" stroke-width="2.5" stroke-dasharray="3,3" marker-end="url(#arrow)" />
        <!-- Point P'(-1, -1) -->
        <circle cx="115" cy="110" r="4.5" fill="#10b981" />
        <text x="80" y="112" fill="#6ee7b7" font-size="10" font-weight="bold">P'(-1, -1)</text>
      </svg>
    `,
    tier1Options: [
      { key: "A", text: "$P'(-1, -1)$", isCorrect: true },
      { key: "B", text: "$P'(5, -9)$", isCorrect: false },
      { key: "C", text: "$P'(-1, 1)$", isCorrect: false },
      { key: "D", text: "$P'(-5, 9)$", isCorrect: false },
      { key: "E", text: "$P'(1, -1)$", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Translasi menjumlahkan absis awal dengan komponen vektor a, dan ordinat awal dengan komponen vektor b: $(x + a, y + b)$.", isCorrect: true },
      { key: "B", text: "Translasi mengurangkan koordinat titik awal terhadap vektor translasi: $(x - a, y - b)$.", isCorrect: false },
      { key: "C", text: "Hanya komponen x yang dijumlahkan, sedangkan komponen y dibiarkan konstan.", isCorrect: false },
      { key: "D", text: "Koordinat bayangan diperoleh dari perkalian titik awal dengan vektor geser: $(x \\cdot a, y \\cdot b)$.", isCorrect: false },
      { key: "E", text: "Translasi membalik tanda semua koordinat titik awal karena arah vektor pergeseran.", isCorrect: false },
    ],
    tier3Prompt: "Seberapa yakin Anda dengan pilihan jawaban tingkat 1 dan alasan tingkat 2 di atas?",
    explanation: "Rumus umum translasi titik $P(x, y)$ oleh $T(a, b)$ adalah $P'(x + a, y + b)$. Untuk $P(2, -5)$ dan $T(-3, 4)$, maka $x' = 2 + (-3) = -1$ dan $y' = -5 + 4 = -1$. Sehingga koordinat bayangan adalah $P'(-1, -1)$.",
  },
  {
    id: "q-2",
    number: 2,
    title: "Refleksi terhadap Sumbu X",
    topic: "Refleksi Geometri",
    prerequisiteTopic: "Sifat Simetri Sumbu Koordinat",
    tier1Question: "Tentukan bayangan titik $A(4, -3)$ jika dicerminkan terhadap sumbu $X$!",
    tier1SvgDiagram: `
      <svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
        <defs>
          <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="260" height="200" fill="#0f172a" rx="10" />
        <rect width="260" height="200" fill="url(#grid2)" rx="10" />
        <!-- Sumbu X highlighted as mirror -->
        <line x1="10" y1="100" x2="250" y2="100" stroke="#38bdf8" stroke-width="3" />
        <text x="210" y="92" fill="#38bdf8" font-size="10" font-weight="bold">Cermin (Sumbu X)</text>
        <line x1="100" y1="10" x2="100" y2="190" stroke="#64748b" stroke-width="1.5" />
        <!-- Titik A(4, -3) di kuadran IV -->
        <circle cx="160" cy="145" r="4.5" fill="#f59e0b" />
        <text x="168" y="152" fill="#fcd34d" font-size="10" font-weight="bold">A(4, -3)</text>
        <!-- Reflection dashed line -->
        <line x1="160" y1="145" x2="160" y2="55" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,4" />
        <!-- Bayangan A'(4, 3) di kuadran I -->
        <circle cx="160" cy="55" r="4.5" fill="#10b981" />
        <text x="168" y="52" fill="#6ee7b7" font-size="10" font-weight="bold">A'(4, 3)</text>
      </svg>
    `,
    tier1Options: [
      { key: "A", text: "$A'(4, 3)$", isCorrect: true },
      { key: "B", text: "$A'(-4, -3)$", isCorrect: false },
      { key: "C", text: "$A'(-4, 3)$", isCorrect: false },
      { key: "D", text: "$A'(-3, 4)$", isCorrect: false },
      { key: "E", text: "$A'(3, -4)$", isCorrect: false },
    ],
    tier2Question: "Alasan matematis yang paling mendasari pilihan Anda:",
    tier2Options: [
      { key: "A", text: "Pencerminan terhadap sumbu X mempertahankan nilai absis x dan membalik tanda ordinat y menjadi lawannya: $(x, -y)$.", isCorrect: true },
      { key: "B", text: "Pencerminan terhadap sumbu X membalik tanda absis x dan membiarkan ordinat y tetap: $(-x, y)$.", isCorrect: false },
      { key: "C", text: "Pencerminan terhadap garis selalu membalik tanda kedua koordinat: $(-x, -y)$.", isCorrect: false },
      { key: "D", text: "Pencerminan sumbu menukar posisi absis dan ordinat: $(y, x)$.", isCorrect: false },
      { key: "E", text: "Jarak titik ke cermin dihitung dengan menambahkan nilai kuadrat absis ke ordinat.", isCorrect: false },
    ],
    tier3Prompt: "Apakah Anda yakin dengan pilihan jawaban dan alasan di atas?",
    explanation: "Refleksi terhadap sumbu $X$ memetakan $(x, y) \\to (x, -y)$. Jarak titik ke sumbu $X$ sama dengan jarak bayangan ke sumbu $X$, tetapi di seberang sumbu. Jadi $A(4, -3) \\to A'(4, -(-3)) = A'(4, 3)$.",
  },
  {
    id: "q-3",
    number: 3,
    title: "Refleksi terhadap Sumbu Y",
    topic: "Refleksi Geometri",
    prerequisiteTopic: "Sifat Simetri Sumbu Tegak Bidang Koordinat",
    tier1Question: "Sebuah titik $K(-5, 2)$ dicerminkan terhadap sumbu vertikal (sumbu $Y$). Di manakah koordinat titik bayangan $K'$?",
    tier1SvgDiagram: `
      <svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
        <defs>
          <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="260" height="200" fill="#0f172a" rx="10" />
        <rect width="260" height="200" fill="url(#grid3)" rx="10" />
        <!-- Sumbu Y highlighted as mirror -->
        <line x1="130" y1="10" x2="130" y2="190" stroke="#38bdf8" stroke-width="3" />
        <text x="135" y="25" fill="#38bdf8" font-size="10" font-weight="bold">Cermin Sumbu Y</text>
        <line x1="10" y1="110" x2="250" y2="110" stroke="#64748b" stroke-width="1.5" />
        <!-- Point K(-5, 2) -->
        <circle cx="60" cy="80" r="4.5" fill="#f59e0b" />
        <text x="25" y="75" fill="#fcd34d" font-size="10" font-weight="bold">K(-5, 2)</text>
        <!-- Reflection dashed line across Y -->
        <line x1="60" y1="80" x2="200" y2="80" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,4" />
        <!-- Point K'(5, 2) -->
        <circle cx="200" cy="80" r="4.5" fill="#10b981" />
        <text x="195" y="72" fill="#6ee7b7" font-size="10" font-weight="bold">K'(5, 2)</text>
      </svg>
    `,
    tier1Options: [
      { key: "A", text: "$K'(5, 2)$", isCorrect: true },
      { key: "B", text: "$K'(-5, -2)$", isCorrect: false },
      { key: "C", text: "$K'(5, -2)$", isCorrect: false },
      { key: "D", text: "$K'(2, -5)$", isCorrect: false },
      { key: "E", text: "$K'(-2, 5)$", isCorrect: false },
    ],
    tier2Question: "Pilihlah alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Pencerminan terhadap sumbu Y membalik tanda absis x menjadi lawannya, sedangkan nilai ordinat y tetap konstan: $(-x, y)$.", isCorrect: true },
      { key: "B", text: "Pencerminan sumbu Y membalik nilai ordinat y menjadi negatif: $(x, -y)$.", isCorrect: false },
      { key: "C", text: "Sumbu Y terletak pada kuadran I sehingga seluruh titik menjadi bernilai positif.", isCorrect: false },
      { key: "D", text: "Pencerminan mengubah sumbu tegak menjadi mendatar sehingga koordinat saling bertukar tempat.", isCorrect: false },
      { key: "E", text: "Pencerminan sumbu vertikal mengalikan kedua koordinat dengan faktor minus dua.", isCorrect: false },
    ],
    tier3Prompt: "Apakah Anda yakin dengan pilihan tingkat 1 dan tingkat 2 di atas?",
    explanation: "Pada refleksi terhadap sumbu $Y$, aturan perubahannya adalah $(x, y) \\to (-x, y)$. Nilai $x = -5$ berubah menjadi $-(-5) = 5$, sedangkan nilai $y = 2$ tetap. Maka bayangannya adalah $K'(5, 2)$.",
  },
  {
    id: "q-4",
    number: 4,
    title: "Refleksi terhadap Garis y = x",
    topic: "Refleksi Geometri",
    prerequisiteTopic: "Persamaan Garis Lurus Diagonal & Penukaran Variabel",
    tier1Question: "Titik $M(3, 7)$ direfleksikan terhadap garis lurus $y = x$. Berapakah koordinat bayangan $M'$?",
    tier1SvgDiagram: `
      <svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
        <defs>
          <pattern id="grid4" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="260" height="200" fill="#0f172a" rx="10" />
        <rect width="260" height="200" fill="url(#grid4)" rx="10" />
        <!-- Axes -->
        <line x1="40" y1="160" x2="240" y2="160" stroke="#64748b" stroke-width="1.5" />
        <line x1="40" y1="10" x2="40" y2="180" stroke="#64748b" stroke-width="1.5" />
        <!-- Line y = x diagonal -->
        <line x1="30" y1="170" x2="200" y2="20" stroke="#38bdf8" stroke-width="2.5" />
        <text x="180" y="35" fill="#38bdf8" font-size="10" font-weight="bold">y = x</text>
        <!-- Point M(3, 7) -->
        <circle cx="85" cy="55" r="4.5" fill="#f59e0b" />
        <text x="50" y="50" fill="#fcd34d" font-size="10" font-weight="bold">M(3, 7)</text>
        <!-- Perpendicular dash line -->
        <line x1="85" y1="55" x2="145" y2="115" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3,3" />
        <!-- Point M'(7, 3) -->
        <circle cx="145" cy="115" r="4.5" fill="#10b981" />
        <text x="153" y="122" fill="#6ee7b7" font-size="10" font-weight="bold">M'(7, 3)</text>
      </svg>
    `,
    tier1Options: [
      { key: "A", text: "$M'(7, 3)$", isCorrect: true },
      { key: "B", text: "$M'(-3, -7)$", isCorrect: false },
      { key: "C", text: "$M'(-7, -3)$", isCorrect: false },
      { key: "D", text: "$M'(3, -7)$", isCorrect: false },
      { key: "E", text: "$M'(-7, 3)$", isCorrect: false },
    ],
    tier2Question: "Alasan matematis yang mendasari pilihan Anda:",
    tier2Options: [
      { key: "A", text: "Refleksi terhadap garis diagonal y = x menukar posisi nilai absis dan ordinat tanpa mengubah tandanya: (x, y) menjadi (y, x).", isCorrect: true },
      { key: "B", text: "Refleksi garis y = x membalik tanda kedua koordinat tanpa menukar letak posisinya.", isCorrect: false },
      { key: "C", text: "Refleksi diagonal selalu mengurangkan nilai x dengan nilai y.", isCorrect: false },
      { key: "D", text: "Garis y = x membagi bidang menjadi dua sehingga koordinat titik dikalikan dengan nol.", isCorrect: false },
      { key: "E", text: "Nilai koordinat bayangan diperoleh dari penjumlahan titik dengan gradien garis.", isCorrect: false },
    ],
    tier3Prompt: "Apakah Anda yakin dengan pilihan Anda?",
    explanation: "Rumus refleksi terhadap garis $y = x$ adalah $(x, y) \\to (y, x)$. Posisi absis dan ordinat bertukar tempat tanpa perubahan tanda. Oleh karena itu, $M(3, 7) \\to M'(7, 3)$.",
  },
  {
    id: "q-5",
    number: 5,
    title: "Refleksi terhadap Garis y = -x",
    topic: "Refleksi Geometri",
    prerequisiteTopic: "Refleksi Garis Diagonal & Tanda Aljabar",
    tier1Question: "Titik $B(3, -2)$ direfleksikan terhadap garis diagonal $y = -x$. Berapakah koordinat bayangan $B'$?",
    tier1SvgDiagram: `
      <svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
        <defs>
          <pattern id="grid5" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="260" height="200" fill="#0f172a" rx="10" />
        <rect width="260" height="200" fill="url(#grid5)" rx="10" />
        <!-- Axes -->
        <line x1="130" y1="10" x2="130" y2="190" stroke="#64748b" stroke-width="1.5" />
        <line x1="10" y1="100" x2="250" y2="100" stroke="#64748b" stroke-width="1.5" />
        <!-- Line y = -x -->
        <line x1="40" y1="20" x2="220" y2="180" stroke="#38bdf8" stroke-width="2.5" />
        <text x="180" y="175" fill="#38bdf8" font-size="10" font-weight="bold">y = -x</text>
        <!-- Point B(3, -2) -->
        <circle cx="170" cy="130" r="4.5" fill="#f59e0b" />
        <text x="178" y="135" fill="#fcd34d" font-size="10" font-weight="bold">B(3, -2)</text>
        <!-- Reflection dashed line -->
        <line x1="170" y1="130" x2="160" y2="145" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="3,3" />
        <!-- Point B'(2, -3) -->
        <circle cx="160" cy="145" r="4.5" fill="#10b981" />
        <text x="120" y="160" fill="#6ee7b7" font-size="10" font-weight="bold">B'(2, -3)</text>
      </svg>
    `,
    tier1Options: [
      { key: "A", text: "$B'(2, -3)$", isCorrect: true },
      { key: "B", text: "$B'(-2, 3)$", isCorrect: false },
      { key: "C", text: "$B'(-3, 2)$", isCorrect: false },
      { key: "D", text: "$B'(3, 2)$", isCorrect: false },
      { key: "E", text: "$B'(-3, -2)$", isCorrect: false },
    ],
    tier2Question: "Pilihlah satu alasan matematis di balik pilihan Anda:",
    tier2Options: [
      { key: "A", text: "Refleksi terhadap garis y = -x menukar posisi absis dan ordinat serta menegasikan kedua tandanya: (-y, -x).", isCorrect: true },
      { key: "B", text: "Garis y = -x hanya membalik tanda koordinat tanpa menukar susunan posisinya: (-x, -y).", isCorrect: false },
      { key: "C", text: "Refleksi garis diagonal selalu mempertahankan tanda bilangan asli: (y, x).", isCorrect: false },
      { key: "D", text: "Refleksi hanya mengubah tanda ordinat menjadi positif karena cermin miring ke kanan.", isCorrect: false },
      { key: "E", text: "Jarak bayangan ke sumbu dihitung dari perkalian koordinat titik asal.", isCorrect: false },
    ],
    tier3Prompt: "Apakah Anda yakin dengan kebenaran pilihan Anda?",
    explanation: "Pencerminan terhadap garis $y = -x$ memetakan $(x, y) \\to (-y, -x)$. Di sini $x = 3$ dan $y = -2$. Absis baru $x' = -(-2) = 2$ dan ordinat baru $y' = -(3) = -3$. Jadi $B'(2, -3)$.",
  },
  {
    id: "q-6",
    number: 6,
    title: "Rotasi 90 Derajat Berlawanan Arah Jarum Jam",
    topic: "Rotasi Geometri",
    prerequisiteTopic: "Sudut dan Orientasi Putaran Trigonometri",
    tier1Question: "Tentukan bayangan titik $C(1, 4)$ jika dirotasikan sejauh $90^\\circ$ berlawanan arah jarum jam terhadap titik pusat $O(0,0)$!",
    tier1SvgDiagram: `
      <svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
        <defs>
          <pattern id="grid6" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="260" height="200" fill="#0f172a" rx="10" />
        <rect width="260" height="200" fill="url(#grid6)" rx="10" />
        <line x1="130" y1="10" x2="130" y2="190" stroke="#64748b" stroke-width="1.5" />
        <line x1="10" y1="120" x2="250" y2="120" stroke="#64748b" stroke-width="1.5" />
        <!-- Origin -->
        <circle cx="130" cy="120" r="3.5" fill="#38bdf8" />
        <text x="135" y="132" fill="#38bdf8" font-size="10">O(0,0)</text>
        <!-- Point C(1, 4) -->
        <circle cx="145" cy="60" r="4.5" fill="#f59e0b" />
        <text x="152" y="65" fill="#fcd34d" font-size="10" font-weight="bold">C(1, 4)</text>
        <!-- Rotation arc -->
        <path d="M 145 60 A 62 62 0 0 0 70 105" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="3,3" />
        <!-- Bayangan C'(-4, 1) -->
        <circle cx="70" cy="105" r="4.5" fill="#10b981" />
        <text x="35" y="105" fill="#6ee7b7" font-size="10" font-weight="bold">C'(-4, 1)</text>
      </svg>
    `,
    tier1Options: [
      { key: "A", text: "$C'(-4, 1)$", isCorrect: true },
      { key: "B", text: "$C'(4, -1)$", isCorrect: false },
      { key: "C", text: "$C'(-1, -4)$", isCorrect: false },
      { key: "D", text: "$C'(1, -4)$", isCorrect: false },
      { key: "E", text: "$C'(-4, -1)$", isCorrect: false },
    ],
    tier2Question: "Alasan matematis yang paling mendasari pilihan Anda:",
    tier2Options: [
      { key: "A", text: "Rotasi sudut +90° berpusat di titik asal O(0,0) mengubah posisi (x, y) menjadi (-y, x).", isCorrect: true },
      { key: "B", text: "Rotasi searah jarum jam mengubah posisi menjadi (y, -x) sehingga tanda minus berada pada ordinat.", isCorrect: false },
      { key: "C", text: "Rotasi hanya memutar tanda koordinat tanpa menukar urutan absis dan ordinat: (-x, -y).", isCorrect: false },
      { key: "D", text: "Putaran 90 derajat sama persis dengan pencerminan terhadap sumbu koordinat datar.", isCorrect: false },
      { key: "E", text: "Koordinat bayangan dihitung dengan menjumlahkan derajat sudut (90) ke absis titik awal.", isCorrect: false },
    ],
    tier3Prompt: "Apakah Anda yakin dengan pilihan jawaban dan alasan tersebut?",
    explanation: "Rotasi $R[O, +90^\\circ]$ berlawanan arah jarum jam memetakan titik $(x, y) \\to (-y, x)$. Untuk $C(1, 4)$, didapatkan $x' = -4$ dan $y' = 1$. Sehingga bayangan koordinatnya adalah $C'(-4, 1)$.",
  },
  {
    id: "q-7",
    number: 7,
    title: "Rotasi 180 Derajat Pusat O(0,0)",
    topic: "Rotasi Geometri",
    prerequisiteTopic: "Konsep Simetri Putar Setengah Lingkaran",
    tier1Question: "Bayangan titik $D(-3, 6)$ setelah dirotasikan sejauh $180^\\circ$ dengan pusat titik asal $O(0,0)$ adalah...",
    tier1SvgDiagram: `
      <svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
        <defs>
          <pattern id="grid7" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="260" height="200" fill="#0f172a" rx="10" />
        <rect width="260" height="200" fill="url(#grid7)" rx="10" />
        <line x1="130" y1="10" x2="130" y2="190" stroke="#64748b" stroke-width="1.5" />
        <line x1="10" y1="100" x2="250" y2="100" stroke="#64748b" stroke-width="1.5" />
        <circle cx="130" cy="100" r="3.5" fill="#38bdf8" />
        <!-- Point D(-3, 6) in Quad II -->
        <circle cx="90" cy="40" r="4.5" fill="#f59e0b" />
        <text x="45" y="40" fill="#fcd34d" font-size="10" font-weight="bold">D(-3, 6)</text>
        <!-- Straight through center line -->
        <line x1="90" y1="40" x2="170" y2="160" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="4,4" />
        <!-- Point D'(3, -6) in Quad IV -->
        <circle cx="170" cy="160" r="4.5" fill="#10b981" />
        <text x="178" y="165" fill="#6ee7b7" font-size="10" font-weight="bold">D'(3, -6)</text>
      </svg>
    `,
    tier1Options: [
      { key: "A", text: "$D'(3, -6)$", isCorrect: true },
      { key: "B", text: "$D'(-3, -6)$", isCorrect: false },
      { key: "C", text: "$D'(6, -3)$", isCorrect: false },
      { key: "D", text: "$D'(-6, 3)$", isCorrect: false },
      { key: "E", text: "$D'(3, 6)$", isCorrect: false },
    ],
    tier2Question: "Alasan matematis yang mendasari pilihan Anda:",
    tier2Options: [
      { key: "A", text: "Rotasi 180° berpusat di O(0,0) membalik tanda kedua koordinat tanpa menukar posisinya: (-x, -y).", isCorrect: true },
      { key: "B", text: "Rotasi setengah lingkaran menukar posisi absis dan ordinat menjadi (-y, -x).", isCorrect: false },
      { key: "C", text: "Rotasi 180 derajat mempertahankan nilai koordinat karena putaran kembali ke titik semula.", isCorrect: false },
      { key: "D", text: "Rotasi hanya mengubah tanda absis x karena sumbu putar berada di garis mendatar.", isCorrect: false },
      { key: "E", text: "Koordinat bayangan menjadi dua kali lipat dari jarak titik awal ke titik pusat.", isCorrect: false },
    ],
    tier3Prompt: "Apakah Anda yakin dengan pilihan jawaban dan alasan tingkat 2?",
    explanation: "Rotasi $R[O, 180^\\circ]$ memetakan titik $(x, y) \\to (-x, -y)$. Baik diputar searah maupun berlawanan jarum jam, hasil rotasi $180^\\circ$ adalah simetri terhadap titik asal $O$. Maka $D(-3, 6) \\to D'(-(-3), -(6)) = D'(3, -6)$.",
  },
  {
    id: "q-8",
    number: 8,
    title: "Dilatasi Titik dengan Faktor Skala k",
    topic: "Dilatasi Geometri",
    prerequisiteTopic: "Konsep Perbesaran Skala & Perkalian Bilangan Bulat",
    tier1Question: "Titik $E(2, -4)$ didilatasikan dengan faktor skala $k = 3$ dan berpusat di titik asal $O(0,0)$. Tentukan koordinat bayangan $E'$!",
    tier1SvgDiagram: `
      <svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
        <defs>
          <pattern id="grid8" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="260" height="200" fill="#0f172a" rx="10" />
        <rect width="260" height="200" fill="url(#grid8)" rx="10" />
        <line x1="80" y1="10" x2="80" y2="190" stroke="#64748b" stroke-width="1.5" />
        <line x1="10" y1="60" x2="250" y2="60" stroke="#64748b" stroke-width="1.5" />
        <circle cx="80" cy="60" r="3.5" fill="#38bdf8" />
        <text x="65" y="55" fill="#38bdf8" font-size="10">O(0,0)</text>
        <!-- Point E(2, -4) -->
        <circle cx="120" cy="100" r="4.5" fill="#f59e0b" />
        <text x="125" y="98" fill="#fcd34d" font-size="10" font-weight="bold">E(2, -4)</text>
        <!-- Ray from center -->
        <line x1="80" y1="60" x2="200" y2="180" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="3,3" />
        <!-- Bayangan E'(6, -12) scaled -->
        <circle cx="200" cy="180" r="4.5" fill="#10b981" />
        <text x="145" y="185" fill="#6ee7b7" font-size="10" font-weight="bold">E'(6, -12)</text>
      </svg>
    `,
    tier1Options: [
      { key: "A", text: "$E'(6, -12)$", isCorrect: true },
      { key: "B", text: "$E'(5, -1)$", isCorrect: false },
      { key: "C", text: "$E'(-6, 12)$", isCorrect: false },
      { key: "D", text: "$E'(6, -4)$", isCorrect: false },
      { key: "E", text: "$E'(2, -12)$", isCorrect: false },
    ],
    tier2Question: "Alasan matematis yang mendasari jawaban Anda:",
    tier2Options: [
      { key: "A", text: "Dilatasi dengan pusat O(0,0) mengalikan setiap koordinat (absis dan ordinat) secara merata dengan faktor skala k: (k · x, k · y).", isCorrect: true },
      { key: "B", text: "Dilatasi menjumlahkan faktor skala k ke nilai koordinat titik awal: (x + k, y + k).", isCorrect: false },
      { key: "C", text: "Dilatasi hanya mengalikan komponen absis x, sedangkan ordinat y tetap konstan.", isCorrect: false },
      { key: "D", text: "Faktor skala merupakan pangkat dari koordinat titik awal: (x^k, y^k).", isCorrect: false },
      { key: "E", text: "Dilatasi menukar posisi koordinat lalu mengalikannya dengan tanda negatif.", isCorrect: false },
    ],
    tier3Prompt: "Apakah Anda yakin dengan pilihan jawaban dan alasan di atas?",
    explanation: "Aturan dilatasi dengan pusat $O(0,0)$ dan faktor skala $k$ adalah $[O, k]: (x, y) \\to (kx, ky)$. Dengan $k = 3$ dan $E(2, -4)$, maka $x' = 3 \\cdot 2 = 6$ dan $y' = 3 \\cdot (-4) = -12$. Jadi $E'(6, -12)$.",
  },
  {
    id: "q-9",
    number: 9,
    title: "Translasi Bangun Segitiga pada Koordinat Kartesius",
    topic: "Translasi Geometri",
    prerequisiteTopic: "Translasi Beberapa Titik Sudut Poligon",
    tier1Question: "Segitiga $ABC$ memiliki titik sudut $A(1, 2)$, $B(4, 2)$, dan $C(2, 5)$. Jika segitiga tersebut digeser oleh vektor $T = \\begin{pmatrix} 2 \\\\ -3 \\end{pmatrix}$, berapakah koordinat baru untuk titik $A'$?",
    tier1SvgDiagram: `
      <svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
        <defs>
          <pattern id="grid9" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="260" height="200" fill="#0f172a" rx="10" />
        <rect width="260" height="200" fill="url(#grid9)" rx="10" />
        <!-- Axes -->
        <line x1="30" y1="120" x2="250" y2="120" stroke="#64748b" stroke-width="1.5" />
        <line x1="60" y1="10" x2="60" y2="190" stroke="#64748b" stroke-width="1.5" />
        <!-- Triangle ABC original (amber) -->
        <polygon points="80,80 140,80 100,30" fill="rgba(245, 158, 11, 0.25)" stroke="#f59e0b" stroke-width="2" />
        <text x="68" y="95" fill="#fcd34d" font-size="9" font-weight="bold">A(1,2)</text>
        <text x="145" y="90" fill="#fcd34d" font-size="9" font-weight="bold">B</text>
        <text x="100" y="24" fill="#fcd34d" font-size="9" font-weight="bold">C</text>
        <!-- Triangle A'B'C' translated (emerald) -->
        <polygon points="120,140 180,140 140,90" fill="rgba(16, 185, 129, 0.25)" stroke="#10b981" stroke-width="2" />
        <text x="110" y="155" fill="#6ee7b7" font-size="9" font-weight="bold">A'(3,-1)</text>
        <!-- Shift vector arrow -->
        <line x1="80" y1="80" x2="120" y2="140" stroke="#38bdf8" stroke-width="1.5" stroke-dasharray="2,2" />
      </svg>
    `,
    tier1Options: [
      { key: "A", text: "$A'(3, -1)$", isCorrect: true },
      { key: "B", text: "$A'(-1, 5)$", isCorrect: false },
      { key: "C", text: "$A'(2, -6)$", isCorrect: false },
      { key: "D", text: "$A'(3, 5)$", isCorrect: false },
      { key: "E", text: "$A'(-1, -1)$", isCorrect: false },
    ],
    tier2Question: "Alasan matematis yang mendasari pilihan Anda:",
    tier2Options: [
      { key: "A", text: "Translasi pada bangun datar menggeser setiap titik sudut dengan penambahan vektor translasi yang sama tanpa mengubah ukuran dan bentuk bangun.", isCorrect: true },
      { key: "B", text: "Translasi bangun hanya menggeser titik sudut pusat, sedangkan titik lainnya tetap di tempat semula.", isCorrect: false },
      { key: "C", text: "Pergeseran bangun datar mengubah sudut dan skala titik sudut proporsional terhadap luas segitiga.", isCorrect: false },
      { key: "D", text: "Koordinat bayangan didapat dari pengurangan titik A dengan titik B dan C.", isCorrect: false },
      { key: "E", text: "Tanda dari absis dan ordinat harus selalu dibalik ketika segitiga berpindah kuadran.", isCorrect: false },
    ],
    tier3Prompt: "Apakah Anda yakin dengan pilihan jawaban dan alasan di atas?",
    explanation: "Translasi bangun datar adalah isometri (mempertahankan bentuk dan ukuran). Setiap titik sudut digeser dengan vektor yang sama $T(2, -3)$. Untuk titik $A(1, 2)$, bayangannya adalah $A'(1 + 2, 2 + (-3)) = A'(3, -1)$.",
  },
  {
    id: "q-10",
    number: 10,
    title: "Komposisi Refleksi Berurutan terhadap Dua Sumbu",
    topic: "Komposisi Transformasi",
    prerequisiteTopic: "Komposisi Refleksi Sumbu X Dilanjutkan Sumbu Y",
    tier1Question: "Titik $F(2, 5)$ dicerminkan terhadap sumbu $X$, kemudian bayangannya dicerminkan lagi terhadap sumbu $Y$. Tentukan koordinat akhir bayangan titik $F''$!",
    tier1SvgDiagram: `
      <svg viewBox="0 0 260 200" class="w-full max-w-[260px] mx-auto text-slate-300">
        <defs>
          <pattern id="grid10" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" stroke-width="0.75" />
          </pattern>
        </defs>
        <rect width="260" height="200" fill="#0f172a" rx="10" />
        <rect width="260" height="200" fill="url(#grid10)" rx="10" />
        <line x1="130" y1="10" x2="130" y2="190" stroke="#64748b" stroke-width="1.5" />
        <line x1="10" y1="100" x2="250" y2="100" stroke="#64748b" stroke-width="1.5" />
        <!-- Step 1: F(2, 5) -->
        <circle cx="160" cy="45" r="4.5" fill="#f59e0b" />
        <text x="168" y="48" fill="#fcd34d" font-size="9" font-weight="bold">F(2, 5)</text>
        <!-- Step 2: F'(2, -5) across X -->
        <circle cx="160" cy="155" r="4" fill="#38bdf8" />
        <text x="168" y="160" fill="#7dd3fc" font-size="9">F'(2, -5)</text>
        <!-- Step 3: F''(-2, -5) across Y -->
        <circle cx="100" cy="155" r="4.5" fill="#10b981" />
        <text x="45" y="160" fill="#6ee7b7" font-size="9" font-weight="bold">F''(-2, -5)</text>
        <!-- connecting dashes -->
        <line x1="160" y1="45" x2="160" y2="155" stroke="#f43f5e" stroke-width="1.2" stroke-dasharray="3,3" />
        <line x1="160" y1="155" x2="100" y2="155" stroke="#a855f7" stroke-width="1.2" stroke-dasharray="3,3" />
      </svg>
    `,
    tier1Options: [
      { key: "A", text: "$F''(-2, -5)$", isCorrect: true },
      { key: "B", text: "$F''(2, 5)$", isCorrect: false },
      { key: "C", text: "$F''(-2, 5)$", isCorrect: false },
      { key: "D", text: "$F''(2, -5)$", isCorrect: false },
      { key: "E", text: "$F''(-5, -2)$", isCorrect: false },
    ],
    tier2Question: "Alasan matematis yang mendasari pilihan Anda:",
    tier2Options: [
      { key: "A", text: "Pencerminan terhadap sumbu X membalik tanda y: (x, -y), lalu dilanjutkan pencerminan sumbu Y membalik tanda x: (-x, -y). Komposisi ini setara dengan rotasi 180°.", isCorrect: true },
      { key: "B", text: "Dua pencerminan terhadap sumbu koordinat saling menghilangkan sehingga titik kembali persis ke koordinat asal (x, y).", isCorrect: false },
      { key: "C", text: "Komposisi refleksi menukar posisi absis dan ordinat menjadi (-y, -x).", isCorrect: false },
      { key: "D", text: "Hanya pencerminan pertama yang berpengaruh, sedangkan pencerminan kedua tidak mengubah posisi.", isCorrect: false },
      { key: "E", text: "Pencerminan berurutan menggandakan nilai koordinat titik awal menjadi dua kali lipat.", isCorrect: false },
    ],
    tier3Prompt: "Apakah Anda yakin dengan pilihan jawaban dan alasan di atas?",
    explanation: "Tahap 1: Refleksi sumbu $X$ memetakan $(x, y) \\to (x, -y)$. Jadi $F(2, 5) \\to F'(2, -5)$. Tahap 2: Refleksi sumbu $Y$ memetakan $(x, y) \\to (-x, y)$. Jadi $F'(2, -5) \\to F''(-2, -5)$. Menariknya, komposisi refleksi terhadap sumbu $X$ kemudian sumbu $Y$ identik dengan rotasi $180^\\circ$ berpusat di $O(0,0)$.",
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

