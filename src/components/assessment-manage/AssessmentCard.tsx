"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  KeyRound,
  Calendar,
  Timer,
  Users,
  Copy,
  Check,
  Clock,
  ArrowRight,
  BarChart3,
  Share2,
  Settings,
  MoreVertical,
  Trash2,
  Layers,
  ExternalLink,
  Power,
  ShieldAlert,
} from "lucide-react";
import {
  AssessmentItem,
  deriveTokenStatus,
  deriveScheduleStatus,
  getRemainingQuota,
  generateWhatsAppShareText,
  toggleTokenActive,
} from "@/lib/assessment-management-store";
import {
  TokenStatusBadge,
  ScheduleStatusBadge,
  QuotaProgressBar,
} from "./StatusBadges";

interface AssessmentCardProps {
  assessment: AssessmentItem;
  onOpenTokenModal: (assessment: AssessmentItem) => void;
  onOpenScheduleModal: (assessment: AssessmentItem) => void;
  onOpenMonitoringModal: (assessment: AssessmentItem) => void;
  onDeleteAssessment: (id: string) => void;
  onAssessmentUpdated: (updated: AssessmentItem) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({
  assessment,
  onOpenTokenModal,
  onOpenScheduleModal,
  onOpenMonitoringModal,
  onDeleteAssessment,
  onAssessmentUpdated,
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const tokenStatus = deriveTokenStatus(
    assessment.token,
    assessment.opensAt,
    assessment.closesAt
  );

  const scheduleStatus = deriveScheduleStatus(
    assessment.opensAt,
    assessment.closesAt
  );

  const remainingQuota = getRemainingQuota(assessment.token);
  const completedStudents = assessment.students.filter((s) => s.status === "terkirim").length;
  const inProgressStudents = assessment.students.filter((s) => s.status === "berlangsung").length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(assessment.token.code);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCopyShare = () => {
    const text = generateWhatsAppShareText(assessment);
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleToggleActive = () => {
    const updated = toggleTokenActive(assessment.id);
    if (updated) {
      onAssessmentUpdated(updated);
    }
  };

  const formatDateTime = (iso: string) => {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="rounded-xl bg-white border border-slate-200 hover:border-blue-400 transition-all duration-200 shadow-sm overflow-hidden flex flex-col group">
      
      {/* Top Header */}
      <div className="p-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {assessment.className}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {assessment.gradeLevel}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
              <Layers className="w-3 h-3 text-blue-600" />
              <span>{assessment.questionIds.length} Soal 3-Tier</span>
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug truncate">
            {assessment.title}
          </h3>
        </div>

        {/* Status badges */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <TokenStatusBadge status={tokenStatus} size="sm" />
          <ScheduleStatusBadge status={scheduleStatus} size="sm" />
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 space-y-4 flex-1">
        
        {/* Token Box with quick copy & toggle */}
        <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                Kode Token Kelas
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-bold font-mono tracking-wider text-blue-800">
                  {assessment.token.code}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-white transition-colors"
                  title="Salin Kode Token"
                >
                  {copiedToken ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick toggle switch */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {assessment.token.isActive ? "Aktif" : "Nonaktif"}
            </span>
            <button
              onClick={handleToggleActive}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                assessment.token.isActive ? "bg-emerald-600" : "bg-slate-300"
              }`}
              title={assessment.token.isActive ? "Klik untuk menonaktifkan token" : "Klik untuk mengaktifkan token"}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  assessment.token.isActive ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Quota Progress Bar */}
        <div>
          <QuotaProgressBar
            usedCount={assessment.token.usedCount}
            maxUses={assessment.token.maxUses}
            showDetails={true}
          />
        </div>

        {/* Schedule & Timing Info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Jadwal Dibuka</span>
            <span className="font-semibold text-slate-800 mt-0.5 block truncate">
              {formatDateTime(assessment.opensAt)}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Batas Ditutup</span>
            <span className="font-semibold text-slate-800 mt-0.5 block truncate">
              {formatDateTime(assessment.closesAt)}
            </span>
          </div>
        </div>

        {/* Durasi Pengerjaan Ujian */}
        <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <span className="flex items-center gap-1.5 text-amber-800 text-[11px] font-medium">
            <Timer className="w-3.5 h-3.5 text-amber-600" />
            <span>Durasi Pengerjaan:</span>
          </span>
          <span className="font-semibold text-amber-900 text-xs">
            {assessment.durationMinutes && assessment.durationMinutes > 0
              ? `${assessment.durationMinutes} Menit`
              : "Tanpa Batas Waktu"}
          </span>
        </div>

        {/* Student submission stats */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              <strong className="text-emerald-700 font-semibold">{completedStudents}</strong> selesai
              {inProgressStudents > 0 && (
                <>
                  {" "}• <strong className="text-blue-700 font-semibold">{inProgressStudents}</strong> sedang ujian
                </>
              )}
            </span>
          </div>

          <button
            onClick={() => onOpenMonitoringModal(assessment)}
            className="text-blue-600 hover:text-blue-700 font-semibold text-xs inline-flex items-center gap-1"
          >
            <span>Pantau Siswa</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Footer Action Buttons */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onOpenTokenModal(assessment)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1.5 shadow-sm"
            title="Kelola Kuota & Masa Berlaku Token"
          >
            <KeyRound className="w-3.5 h-3.5 text-blue-600" />
            <span>Atur Token</span>
          </button>

          <button
            onClick={() => onOpenScheduleModal(assessment)}
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors flex items-center gap-1.5 shadow-sm"
            title="Ubah Jadwal Buka / Tutup & Durasi Asesmen"
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Jadwal</span>
          </button>

          <button
            onClick={handleCopyShare}
            className="p-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 transition-colors"
            title="Salin Template Pesan WhatsApp Grup Kelas"
          >
            {copiedShare ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href={`/guru/kecurangan?token=${assessment.token.code}`}
            className="p-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-50 text-amber-700 border border-slate-300 transition-colors"
            title="Laporan Integritas & Deteksi Kecurangan"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
          </Link>

          <Link
            href={`/guru/hasil?token=${assessment.token.code}`}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm flex items-center gap-1.5"
            title="Lihat Profil Diagnostik Siswa di Dasbor Hasil"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hasil Siswa</span>
          </Link>

          <button
            onClick={() => {
              if (confirm(`Apakah Anda yakin ingin menghapus asesmen "${assessment.title}"?`)) {
                onDeleteAssessment(assessment.id);
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Hapus Asesmen"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
