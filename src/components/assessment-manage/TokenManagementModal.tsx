"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  KeyRound,
  Copy,
  Check,
  Share2,
  Users,
  Clock,
  Power,
  ShieldCheck,
  AlertTriangle,
  Info,
  Save,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import {
  AssessmentItem,
  deriveTokenStatus,
  deriveScheduleStatus,
  updateTokenQuota,
  toggleTokenActive,
  updateTokenExpiry,
  generateWhatsAppShareText,
} from "@/lib/assessment-management-store";
import { TokenStatusBadge, QuotaProgressBar } from "./StatusBadges";

interface TokenManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  assessment: AssessmentItem | null;
  onAssessmentUpdated: (updated: AssessmentItem) => void;
}

export const TokenManagementModal: React.FC<TokenManagementModalProps> = ({
  isOpen,
  onClose,
  assessment,
  onAssessmentUpdated,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedShareText, setCopiedShareText] = useState(false);
  const [activeTab, setActiveTab] = useState<"token" | "share">("token");

  // Editable fields
  const [maxUses, setMaxUses] = useState<number>(32);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (assessment) {
      setMaxUses(assessment.token.maxUses);
      setIsActive(assessment.token.isActive);

      // Format ISO string to datetime-local
      const d = new Date(assessment.token.expiresAt);
      const pad = (n: number) => n.toString().padStart(2, "0");
      const dtLocal = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      setExpiresAt(dtLocal);

      setSaveSuccessMsg(null);
      setCopiedCode(false);
      setCopiedShareText(false);
    }
  }, [assessment, isOpen]);

  if (!isOpen || !assessment) return null;

  const currentTokenStatus = deriveTokenStatus(
    { ...assessment.token, isActive, maxUses },
    assessment.opensAt,
    expiresAt ? new Date(expiresAt).toISOString() : assessment.closesAt
  );

  const remainingQuota = Math.max(0, maxUses - assessment.token.usedCount);

  // Copy token code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(assessment.token.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Copy share message template
  const handleCopyShareText = () => {
    const text = generateWhatsAppShareText(assessment);
    navigator.clipboard.writeText(text);
    setCopiedShareText(true);
    setTimeout(() => setCopiedShareText(false), 3000);
  };

  // Save changes
  const handleSaveTokenChanges = (e: React.FormEvent) => {
    e.preventDefault();

    let updated = updateTokenQuota(assessment.id, maxUses);
    if (updated) {
      updated = toggleTokenActive(assessment.id, isActive);
    }
    if (updated && expiresAt) {
      updated = updateTokenExpiry(assessment.id, new Date(expiresAt).toISOString());
    }

    if (updated) {
      onAssessmentUpdated(updated);
      setSaveSuccessMsg("Perubahan token dan kuota pemakaian berhasil disimpan!");
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xl my-8">

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  Panel Token Kelas
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                  {assessment.className}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Satu token bersama untuk seluruh siswa kelas dengan kuota pemakaian terkendali
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-slate-100 p-1 border border-slate-200 mt-4 mb-5">
          <button
            onClick={() => setActiveTab("token")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === "token"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Pengaturan Token & Kuota</span>
          </button>
          <button
            onClick={() => setActiveTab("share")}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === "share"
              ? "bg-white text-blue-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Bagikan ke Grup Siswa (WhatsApp)</span>
          </button>
        </div>

        {saveSuccessMsg && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {activeTab === "token" ? (
          <form onSubmit={handleSaveTokenChanges} className="space-y-6">

            {/* Display Token Utama Card */}
            <div className="p-4 sm:p-5 rounded-xl bg-blue-50/50 border border-blue-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Kode Token Kelas {assessment.className}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl sm:text-4xl font-bold font-mono tracking-widest text-blue-800">
                      {assessment.token.code}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm active:scale-95"
                      title="Salin Kode Token"
                    >
                      {copiedCode ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {copiedCode && (
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                      ✓ Kode token berhasil disalin ke papan klip!
                    </span>
                  )}
                </div>

                <div className="flex flex-col items-start sm:items-end gap-2">
                  <span className="text-xs text-slate-500">Status Token Saat Ini:</span>
                  <TokenStatusBadge status={currentTokenStatus} size="md" />
                </div>

              </div>

              {/* Quota Progress */}
              <div className="mt-5 pt-4 border-t border-blue-200">
                <QuotaProgressBar
                  usedCount={assessment.token.usedCount}
                  maxUses={maxUses}
                  showDetails={true}
                />
              </div>
            </div>

            {/* Aturan Token PRD Info Box */}
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-start gap-2.5">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-slate-900">
                  Prinsip Token Kelas SITINDAK:
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Satu kode token dibagikan sekali ke grup kelas untuk semua siswa. Setiap siswa baru yang berhasil masuk mengurangi sisa kuota satu kali. Siswa yang memuat ulang halaman tidak mengurangi kuota lagi dan tetap dapat melanjutkan ujiannya.
                </p>
              </div>
            </div>

            {/* Input Kuota & Masa Berlaku */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Kuota Pemakaian (max_uses) */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Batas Kuota Pemakaian:</span>
                  <span className="text-[11px] text-slate-500 font-normal">
                    Terpakai: {assessment.token.usedCount}
                  </span>
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="number"
                    min={assessment.token.usedCount}
                    max={150}
                    value={maxUses}
                    onChange={(e) => setMaxUses(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 font-bold text-sm focus:outline-none focus:border-blue-600"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setMaxUses((prev) => prev + 1)}
                      className="px-2 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700"
                      title="Tambah 1 kuota siswa susulan"
                    >
                      +1
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaxUses((prev) => prev + 5)}
                      className="px-2 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700"
                      title="Tambah 5 kuota"
                    >
                      +5
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  *Guru dapat menaikkan kuota sewaktu-waktu jika ada siswa susulan atau remedial.
                </p>
              </div>

              {/* Masa Berlaku Token */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>Batas Masa Berlaku Token:</span>
                </label>
                <input
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full mt-2 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-blue-600"
                />
                <p className="text-[10px] text-slate-500 mt-2">
                  Token berhenti berlaku bila waktu ini terlewati.
                </p>
              </div>

            </div>

            {/* Toggle Status Aktif (is_active) */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Power className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-rose-600"}`} />
                  <span>Izin Akses Masuk Token:</span>
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5 max-w-md">
                  {isActive
                    ? "Token aktif: Siswa kelas dapat memasukkan token dan mulai mengerjakan."
                    : "Token dinonaktifkan: Siswa baru langsung ditolak, tetapi siswa yang sudah sedang mengerjakan tetap bisa menyelesaikan."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isActive ? "bg-emerald-600" : "bg-slate-300"
                  }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                />
              </button>
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <a
                href={`/asesmen?token=${assessment.token.code}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                <span>Uji Coba Masuk Layar Siswa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                >
                  Tutup
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </div>

          </form>
        ) : (
          /* Tab Share WhatsApp */
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Pratinjau Format Pesan Grup Kelas (WhatsApp)</span>
                </span>
                <button
                  onClick={handleCopyShareText}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm"
                >
                  {copiedShareText ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Pesan WA</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="p-3.5 rounded-lg bg-white text-slate-800 text-xs font-mono whitespace-pre-wrap leading-relaxed border border-slate-200 max-h-72 overflow-y-auto">
                {generateWhatsAppShareText(assessment)}
              </pre>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900">
              💡 <strong>Tips Guru:</strong> Bagikan teks di atas langsung ke grup WhatsApp kelas atau tempel di papan tulis kelas saat jam asesmen diagnostik dimulai.
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Selesai
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
