"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  Slash,
  Users,
  Play,
  Calendar,
  Lock,
} from "lucide-react";
import {
  TokenDerivedStatus,
  ScheduleDerivedStatus,
} from "@/lib/assessment-management-store";

interface TokenStatusBadgeProps {
  status: TokenDerivedStatus;
  size?: "sm" | "md";
}

export const TokenStatusBadge: React.FC<TokenStatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const configs: Record<
    TokenDerivedStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    aktif: {
      label: "Aktif (Siap Pakai)",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
    },
    belum_dibuka: {
      label: "Belum Dibuka",
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
      icon: <Clock className="w-3.5 h-3.5 text-sky-600" />,
    },
    kedaluwarsa: {
      label: "Kedaluwarsa",
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />,
    },
    dinonaktifkan: {
      label: "Dinonaktifkan",
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-200",
      icon: <Slash className="w-3.5 h-3.5 text-slate-500" />,
    },
    kuota_habis: {
      label: "Kuota Habis",
      bg: "bg-amber-50",
      text: "text-amber-800",
      border: "border-amber-200",
      icon: <Users className="w-3.5 h-3.5 text-amber-600" />,
    },
  };

  const current = configs[status] || configs.aktif;

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 gap-1"
      : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

interface ScheduleStatusBadgeProps {
  status: ScheduleDerivedStatus;
  size?: "sm" | "md";
}

export const ScheduleStatusBadge: React.FC<ScheduleStatusBadgeProps> = ({
  status,
  size = "md",
}) => {
  const configs: Record<
    ScheduleDerivedStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    berjalan: {
      label: "Sedang Berjalan",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: <Play className="w-3.5 h-3.5 text-emerald-600" />,
    },
    belum_dibuka: {
      label: "Terjadwal",
      bg: "bg-sky-50",
      text: "text-sky-700",
      border: "border-sky-200",
      icon: <Calendar className="w-3.5 h-3.5 text-sky-600" />,
    },
    selesai: {
      label: "Sudah Ditutup",
      bg: "bg-slate-100",
      text: "text-slate-700",
      border: "border-slate-200",
      icon: <Lock className="w-3.5 h-3.5 text-slate-500" />,
    },
  };

  const current = configs[status] || configs.berjalan;

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 gap-1"
      : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
    >
      {current.icon}
      <span>{current.label}</span>
    </span>
  );
};

interface QuotaProgressBarProps {
  usedCount: number;
  maxUses: number;
  className?: string;
  showDetails?: boolean;
}

export const QuotaProgressBar: React.FC<QuotaProgressBarProps> = ({
  usedCount,
  maxUses,
  className = "",
  showDetails = true,
}) => {
  const percentage = Math.min(100, Math.round((usedCount / (maxUses || 1)) * 100));
  const remaining = Math.max(0, maxUses - usedCount);

  // Dynamic bar color
  let barColor = "bg-blue-600";
  let statusText = "text-slate-500";

  if (percentage >= 100) {
    barColor = "bg-amber-500";
    statusText = "text-amber-700 font-semibold";
  } else if (percentage >= 75) {
    barColor = "bg-blue-500";
  }

  return (
    <div className={`space-y-1.5 ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800">
              {usedCount} / {maxUses} siswa
            </span>
            <span className="text-[11px] text-slate-500 font-mono">({percentage}%)</span>
          </div>
          <span className={`text-[11px] ${statusText}`}>
            {remaining === 0 ? "Kuota penuh" : `Sisa ${remaining} kuota`}
          </span>
        </div>
      )}

      {/* Progress Track */}
      <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
