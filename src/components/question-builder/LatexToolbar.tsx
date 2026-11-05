"use client";

import React, { useState } from "react";
import { HelpCircle, Check, Calculator } from "lucide-react";
import { FormattedMathText } from "@/components/assessment/FormattedMathText";

interface LatexSnippet {
  label: string;
  latex: string;
  desc: string;
}

interface LatexToolbarProps {
  onInsert: (snippet: string) => void;
  className?: string;
}

export const LATEX_SHORTCUTS: LatexSnippet[] = [
  { label: "\\frac{a}{b}", latex: "\\frac{a}{b}", desc: "Pecahan biasa" },
  { label: "x^{2}", latex: "x^{2}", desc: "Pangkat / eksponen" },
  { label: "x_{1}", latex: "x_{1}", desc: "Indeks / subskrip" },
  { label: "\\sqrt{x}", latex: "\\sqrt{x}", desc: "Akar kuadrat" },
  { label: "\\pmatrix{x\\\\y}", latex: "\\begin{pmatrix} x \\\\ y \\end{pmatrix}", desc: "Vektor kolom 2x1" },
  { label: "\\pmatrix{a&b\\\\c&d}", latex: "\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}", desc: "Matriks transformasi 2x2" },
  { label: "P'(x', y')", latex: "P'(x', y')", desc: "Notasi titik bayangan" },
  { label: "\\to", latex: "\\to", desc: "Panah transformasi" },
  { label: "^{\\circ}", latex: "90^{\\circ}", desc: "Simbol derajat sudut" },
  { label: "\\vec{v}", latex: "\\vec{v}", desc: "Simbol vektor" },
  { label: "\\pi", latex: "\\pi", desc: "Konstanta pi" },
  { label: "\\alpha", latex: "\\alpha", desc: "Sudut alfa" },
  { label: "\\theta", latex: "\\theta", desc: "Sudut teta" },
  { label: "\\Delta", latex: "\\Delta", desc: "Segitiga / Delta" },
  { label: "\\pm", latex: "\\pm", desc: "Plus-minus" },
  { label: "\\neq", latex: "\\neq", desc: "Tidak sama dengan" },
  { label: "\\le", latex: "\\le", desc: "Kurang dari atau sama dengan" },
  { label: "\\ge", latex: "\\ge", desc: "Lebih dari atau sama dengan" },
];

export const LatexToolbar: React.FC<LatexToolbarProps> = ({ onInsert, className = "" }) => {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [showCheatsheet, setShowCheatsheet] = useState(false);

  const handleSnippetClick = (snippet: LatexSnippet, idx: number) => {
    // Insert with $...$ wrapper if needed
    const wrapped = `$${snippet.latex}$`;
    onInsert(wrapped);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  };

  return (
    <div className={`p-3 rounded-xl bg-white border border-slate-200 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
          <Calculator className="w-4 h-4 text-blue-600" />
          <span>Editor Simbol & Rumus Matematika (LaTeX)</span>
        </div>
        <button
          type="button"
          onClick={() => setShowCheatsheet(!showCheatsheet)}
          className="text-[11px] font-medium flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showCheatsheet ? "Tutup Panduan" : "Panduan Rumus"}</span>
        </button>
      </div>

      {/* Quick click formula chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        {LATEX_SHORTCUTS.map((item, idx) => {
          const isCopied = copiedIdx === idx;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => handleSnippetClick(item, idx)}
              title={`${item.desc} (Klik untuk menyisipkan)`}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg border transition-all ${
                isCopied
                  ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                  : "bg-slate-50 hover:bg-white border-slate-200 text-slate-800 hover:border-blue-400 hover:text-blue-700 shadow-xs"
              }`}
            >
              <span className="font-mono">
                <FormattedMathText text={`$${item.latex}$`} />
              </span>
              {isCopied ? (
                <Check className="w-3 h-3 text-white" />
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Cheatsheet drop panel */}
      {showCheatsheet && (
        <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 animate-in fade-in duration-150">
          <p className="font-bold text-slate-800">💡 Cara Penulisan Notasi Matematika:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>
              Apit rumus matematika dengan tanda dollar tunggal, contoh: <code className="text-blue-700 font-mono bg-white px-1 py-0.5 rounded border border-slate-200">$P&apos;(x+a, y+b)$</code>
            </li>
            <li>
              Untuk koordinat bertingkat atau matriks vektor, gunakan <code className="text-blue-700 font-mono bg-white px-1 py-0.5 rounded border border-slate-200">$\begin{"{pmatrix}"} -3 \\ 4 \end{"{pmatrix}"}$</code>
            </li>
            <li>
              Klik salah satu tombol simbol di atas untuk langsung menyisipkan rumus ke dalam teks pertanyaan atau opsi pilihan.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
